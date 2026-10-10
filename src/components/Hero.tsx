import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown, Sparkles, Volume2, VolumeX, Maximize2, Minimize2, Upload, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { AgencyData } from '../types';
import {
  getYouTubeId,
  getYouTubeBackgroundEmbedUrl,
  sendYouTubeCommand,
  AKAAR_OFFICIAL_SHOWREEL_ID,
  AKAAR_OFFICIAL_POSTER_URL,
} from '../utils/videoHelpers';
import {
  saveLocalHeroVideo,
  getLocalHeroVideo,
  clearLocalHeroVideo,
} from '../utils/videoStorage';

interface HeroProps {
  data: AgencyData['hero'];
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenReel: () => void;
  onOpenContact: () => void;
  brandLogoUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  data,
  isMuted,
  onToggleMute,
  onOpenReel,
  onOpenContact,
  brandLogoUrl,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytIframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load user-uploaded video from IndexedDB on initial mount
  useEffect(() => {
    let mounted = true;
    getLocalHeroVideo().then((blobUrl) => {
      if (mounted && blobUrl) {
        setLocalVideoUrl(blobUrl);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Determine active video source:
  // 1. User uploaded video file in IndexedDB (fastest, uncompressed direct file)
  // 2. Direct MP4 video from data.videoUrl
  // 3. Official Akaar Entertainments showreel stream (epDa2WSMzIU)
  const isDirectFile = !!localVideoUrl || (!!data.videoUrl && !data.videoUrl.includes('youtu') && !data.videoUrl.includes('youtube'));
  const activeVideoUrl = localVideoUrl || (isDirectFile ? data.videoUrl : null);
  
  // Official Akaar Showreel YouTube ID fallback for streaming
  const ytId = !isDirectFile ? (getYouTubeId(data.videoUrl) || AKAAR_OFFICIAL_SHOWREEL_ID) : null;
  const poster = data.posterUrl || AKAAR_OFFICIAL_POSTER_URL;

  // Handle local video file upload (direct .mp4/.mov from user's device into browser database)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const blobUrl = await saveLocalHeroVideo(file);
      setLocalVideoUrl(blobUrl);
      setIsVideoLoaded(true);
    } catch {
      // Fallback: direct blob URL in memory
      const blobUrl = URL.createObjectURL(file);
      setLocalVideoUrl(blobUrl);
      setIsVideoLoaded(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToOfficialReel = async () => {
    await clearLocalHeroVideo();
    setLocalVideoUrl(null);
  };

  // Sync mute state to YouTube stream or native HTML5 video
  useEffect(() => {
    if (ytId && ytIframeRef.current) {
      if (isMuted) {
        sendYouTubeCommand(ytIframeRef.current, 'mute');
      } else {
        sendYouTubeCommand(ytIframeRef.current, 'unMute');
        sendYouTubeCommand(ytIframeRef.current, 'setVolume', [100]);
      }
    } else if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, ytId]);

  // Fullscreen state sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Listen for YouTube loop events to ensure continuous seamless playback without stops
  useEffect(() => {
    if (!ytId) return;
    const handleWindowMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const payload = JSON.parse(e.data);
          if (payload.event === 'onStateChange' && payload.info === 0) {
            sendYouTubeCommand(ytIframeRef.current, 'playVideo');
          }
          if (payload.event === 'onStateChange' && payload.info === 1) {
            setIsVideoLoaded(true);
          }
        }
      } catch {
        // ignore non-json messages
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [ytId]);

  // Toggle browser native fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (sectionRef.current?.requestFullscreen) {
        sectionRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black select-none"
    >
      {/* Hidden file input for direct video file upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* ============================================================== */}
      {/* 1. BACKGROUND VIDEO CONTAINER WITH PROPER ALIGNMENT & FULL CLARITY */}
      {/*    - Calibrated vertical alignment: top-[40%]                   */}
      {/*    - Full clarity with 95% opacity & vivid contrast              */}
      {/*    - Direct native video or HD official Akaar reel stream        */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
        {/* High-Res Poster to avoid flash while video initializes */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-85'
          }`}
          style={{
            backgroundImage: `url(${poster})`,
            backgroundPosition: 'center 35%',
          }}
        />

        {data.heroImageUrl ? (
          <img
            src={data.heroImageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-85 scale-105 transform motion-safe:animate-pulse-subtle"
            onLoad={() => setIsVideoLoaded(true)}
          />
        ) : isDirectFile && activeVideoUrl ? (
          /* Direct Native HTML5 Video File (Local Upload or Direct MP4) */
          <video
            ref={videoRef}
            src={activeVideoUrl}
            poster={poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
            onCanPlay={() => setIsVideoLoaded(true)}
            /* Calibrated proper alignment: centered vertically above the bottom yellow strip */
            className="absolute top-[40%] sm:top-[41%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover object-[center_35%] opacity-95 scale-105 pointer-events-none transition-opacity duration-500"
            style={{
              filter: 'contrast(1.05) brightness(1.02) saturate(1.04)',
            }}
          />
        ) : (
          /* Official Akaar Entertainments Showreel Stream (epDa2WSMzIU) */
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <iframe
              ref={ytIframeRef}
              src={getYouTubeBackgroundEmbedUrl(ytId!, { isMuted })}
              title="Akaar Entertainments Official Showreel"
              width="1920"
              height="1080"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => {
                setIsVideoLoaded(true);
                setTimeout(() => {
                  sendYouTubeCommand(ytIframeRef.current, 'setPlaybackQuality', ['hd1080']);
                  sendYouTubeCommand(ytIframeRef.current, 'setPlaybackQualityRange', ['hd1080', 'highres']);
                }, 400);
              }}
              /* Proper Alignment: top-[40%] perfectly centers the video in the visible hero viewport above the yellow bar */
              className="absolute top-[40%] sm:top-[41%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-0 shadow-2xl opacity-95 transition-opacity duration-700"
              style={{
                /* Viewport cover calibrated so all top captions and bottom titles are clearly visible */
                width: 'max(100vw, 177.78vh)',
                height: 'max(100vh, 56.25vw)',
                minWidth: '100%',
                minHeight: '100%',
                filter: 'contrast(1.05) brightness(1.02) saturate(1.04)',
              }}
            />
          </div>
        )}

        {/* Transparent Click Shield: prevents any native click overlay on the background video */}
        <div className="absolute inset-0 z-10 pointer-events-auto cursor-default" />

        {/* Lightweight Cinematic Scrim (Minimal so footage stays crystal-clear) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/15 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-radial-vignette pointer-events-none opacity-20" />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP TOOLBAR: AUDIO CONTROL, VIDEO UPLOAD & FULLSCREEN       */}
      {/* ============================================================== */}
      <div className="relative z-20 pt-24 sm:pt-32 px-3 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto gap-2">
        {/* Recognition & Production Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/70 backdrop-blur-md border border-[#F9CE00]/30 text-[11px] sm:text-xs font-semibold text-neutral-200 tracking-wide shadow-lg min-w-0"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F9CE00] animate-pulse shrink-0" />
          <span className="truncate max-w-[130px] xs:max-w-[200px] sm:max-w-none">
            {localVideoUrl ? 'Custom Video Playing' : data.awardBadge || 'Believe in a client-oriented ideology'}
          </span>
          {localVideoUrl && (
            <button
              onClick={handleResetToOfficialReel}
              className="ml-1 p-0.5 rounded text-neutral-400 hover:text-[#F9CE00] transition-colors"
              title="Reset to official Akaar reel"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </motion.div>

        {/* Video Control Pills: Upload, Sound & Native Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Upload Video File Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            id="hero-upload-video-btn"
            disabled={isUploading}
            className="group flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-black/75 backdrop-blur-md border border-[#F9CE00]/40 text-[11px] sm:text-xs font-semibold text-[#F9CE00] hover:text-black hover:bg-[#F9CE00] transition-all cursor-pointer shadow-xl active:scale-95"
            title="Upload your video file (.mp4, .mov) directly"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isUploading ? 'Loading...' : 'Upload Video'}</span>
          </button>

          {/* Audio Control Button (Sound Off / Sound On) */}
          <button
            onClick={onToggleMute}
            id="hero-sound-toggle"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#F9CE00] transition-all cursor-pointer shadow-xl active:scale-95"
            aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#F9CE00]" />
                <span className="hidden xs:inline">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#F9CE00] animate-bounce" />
                <span className="text-[#F9CE00] font-bold hidden xs:inline">Sound On</span>
              </>
            )}
          </button>

          {/* Native Fullscreen Toggle Button */}
          <button
            onClick={handleToggleFullscreen}
            id="hero-fullscreen-toggle"
            className="group flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-neutral-300 hover:text-white hover:border-[#F9CE00] transition-all cursor-pointer shadow-xl active:scale-95"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#F9CE00]" />
                <span className="hidden xs:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-neutral-300 group-hover:text-[#F9CE00]" />
                <span className="hidden xs:inline">Full Screen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN HERO TYPOGRAPHY & CALLOUT */}
      {/* ============================================================== */}
      <div className="relative z-20 my-auto px-4 sm:px-8 max-w-7xl mx-auto w-full py-8 sm:py-14 pointer-events-auto">
        <div className="max-w-4xl relative">
          {/* Ambient Radial Glow */}
          <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#F9CE00]/15 rounded-full blur-[110px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-black/70 border border-[#F9CE00]/30 backdrop-blur-md mb-4 sm:mb-5 shadow-lg max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#F9CE00] animate-pulse shrink-0" />
              <span className="text-[#F9CE00] text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase truncate">
                Akaar Entertainments // Ideas Get A Form
              </span>
            </div>

            {/* Bold Responsive Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-syne font-black tracking-tight sm:tracking-tighter text-white leading-[1.0] sm:leading-[0.95] mb-6 sm:mb-8 uppercase break-words drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              Give <span className="text-[#F9CE00] underline decoration-[#F9CE00]/40 decoration-wavy">Akaar</span> to ideas that travel.
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SIGNATURE YELLOW CALL-TO-ACTION BAR */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full bg-[#F9CE00] text-black shadow-2xl pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-syne font-extrabold tracking-tight text-black leading-snug mb-2 sm:mb-4">
              {data.headline}
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-black/85 font-medium leading-relaxed max-w-3xl">
              {data.subheadline}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 justify-end">
            <button
              onClick={onOpenContact}
              id="hero-yellow-cta-btn"
              className="w-full text-center px-6 py-3 sm:py-4 bg-black text-white font-syne font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl cursor-pointer"
            >
              {data.ctaPrimary || 'GET IN TOUCH'}
            </button>
            <button
              onClick={onOpenReel}
              id="hero-yellow-reel-btn"
              className="w-full text-center px-6 py-2.5 sm:py-3.5 bg-black/10 border-2 border-black text-black font-syne font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full hover:bg-black hover:text-[#F9CE00] transition-all cursor-pointer"
            >
              <span>{data.ctaSecondary || 'WATCH SHOWREEL'}</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator Strip */}
        <div className="w-full bg-black/10 py-2 border-t border-black/15 flex items-center justify-center">
          <a
            href="#brands"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/80 hover:text-black transition-colors"
          >
            <span>Explore Brands &amp; Capabilities</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
};
