import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles } from 'lucide-react';
import {
  getYouTubeId,
  getYouTubeModalEmbedUrl,
  AKAAR_OFFICIAL_SHOWREEL_ID,
  AKAAR_OFFICIAL_POSTER_URL,
} from '../utils/videoHelpers';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Extract YouTube ID if present
  const ytId = getYouTubeId(videoUrl) || (videoUrl ? null : AKAAR_OFFICIAL_SHOWREEL_ID);
  const isYouTube = !!ytId;

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-5xl bg-black border border-neutral-800 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(249,206,0,0.15)] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/90">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00] animate-ping" />
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-syne font-black uppercase tracking-wider text-white">
                  Akaar Entertainments // Official Showreel
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isYouTube && (
                <a
                  href={`https://youtu.be/${ytId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-[#F9CE00]" />
                  <span>Open on YouTube</span>
                </a>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Close showreel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Container (Aspect Ratio 16:9 for True 1080p Presentation) */}
          <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
            {isYouTube ? (
              /* High-Quality YouTube Stream Player with Autoplay & Sound */
              <iframe
                src={getYouTubeModalEmbedUrl(ytId!, false)}
                title="Akaar Entertainments Official Showreel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              /* Direct HTML5 Video Player */
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  poster={AKAAR_OFFICIAL_POSTER_URL}
                  autoPlay
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {/* Custom Control Bar for HTML5 video */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 sm:p-5 flex flex-col gap-2.5">
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div
                      className="h-full bg-[#F9CE00] transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-white text-xs pt-1">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="p-1 text-white hover:text-[#F9CE00] transition-colors cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1 text-white hover:text-[#F9CE00] transition-colors cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#F9CE00]" />}
                      </button>
                      <span className="text-[11px] font-mono text-neutral-400">
                        29 Brands. One Studio. // Continuous Loop
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleFullscreen}
                        className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
