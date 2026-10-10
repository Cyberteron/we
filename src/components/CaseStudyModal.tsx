import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  study,
  onClose,
  onOpenContact,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!study) return null;

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const getVimeoId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(study.videoUrl);
  const vimeoId = getVimeoId(study.videoUrl);

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-4xl bg-[#111] border border-neutral-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col text-left"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/80">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#F9CE00] text-black text-xs font-mono font-black uppercase">
                {study.client}
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Case Study ID: #{study.id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Video or Poster Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 group shadow-2xl">
              {ytId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                  title={study.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : vimeoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0`}
                  title={study.title}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : study.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={study.videoUrl}
                    poster={study.posterUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Floating Video Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={togglePlay}
                        className="p-1 text-white hover:text-[#F9CE00] transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1 text-white hover:text-[#F9CE00] transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-300">
                      Campaign Broadcast Master
                    </span>
                  </div>
                </>
              ) : (
                <img
                  src={study.posterUrl}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Campaign Title & Tags & Collaborator */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {study.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                  >
                    {t}
                  </span>
                ))}
                {/* Collaborator Link Option */}
                {study.collaboratorLink ? (
                  <a
                    href={study.collaboratorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F9CE00]/15 hover:bg-[#F9CE00] border border-[#F9CE00]/40 text-[#F9CE00] hover:text-black text-xs font-mono font-bold transition-all shadow-sm"
                  >
                    <span>Collaborator: {study.collaboratorName || 'Profile / Reel'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : study.collaboratorName ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono">
                    Collaborator: {study.collaboratorName}
                  </span>
                ) : null}
              </div>
              <h2 className="text-3xl sm:text-5xl font-syne font-black uppercase text-white tracking-tight leading-none mb-4">
                {study.title}
              </h2>
              <p className="text-lg text-neutral-300 leading-relaxed">
                {study.summary}
              </p>
            </div>

            {/* Results Callout Bento */}
            {study.results && (
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800/80">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#F9CE00] mb-4">
                  Verified Campaign Impact:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {study.results.map((res, i) => (
                    <div key={i} className="border-l-2 border-[#F9CE00] pl-4">
                      <div className="text-3xl sm:text-4xl font-syne font-black text-white">
                        {res.metric}
                      </div>
                      <div className="text-xs text-neutral-400 font-medium uppercase mt-1">
                        {res.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* The Challenge & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-neutral-900/40 border border-neutral-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  The Challenge
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {study.challenge}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-neutral-900/40 border border-neutral-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  The Creative Solution
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {study.solution}
                </p>
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#F9CE00] to-[#ffd726] text-black flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xl sm:text-2xl font-syne font-black uppercase leading-tight">
                  Want results like this for your brand?
                </h4>
                <p className="text-xs sm:text-sm font-semibold opacity-90">
                  Speak directly with our strategy and creative leads.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="px-6 py-3 rounded-full bg-black text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shrink-0 flex items-center gap-2"
              >
                <span>Brief Akaar Agency</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
