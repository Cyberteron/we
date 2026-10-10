import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowUpRight, Filter, Image as ImageIcon, Eye, X, ZoomIn, Layers } from 'lucide-react';
import { CaseStudy, PortfolioMediaItem } from '../types';

interface CaseStudiesProps {
  caseStudies: CaseStudy[];
  portfolioGallery?: PortfolioMediaItem[];
  onSelectCaseStudy: (item: CaseStudy) => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({
  caseStudies,
  portfolioGallery = [],
  onSelectCaseStudy,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'all' | 'cases' | 'media'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    client?: string;
    category?: string;
    tags?: string[];
  } | null>(null);

  const filters = ['All', 'Creative Strategy', 'Content Production', 'PR & Social', 'Experiential', '3D & Visuals'];

  // Combine items according to viewMode
  const filteredCaseStudies = caseStudies.filter((item) => {
    if (activeFilter === 'All') return true;
    return (
      item.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase())) ||
      item.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  const filteredMedia = portfolioGallery.filter((item) => {
    if (activeFilter === 'All') return true;
    return (
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(activeFilter.toLowerCase()))) ||
      item.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  return (
    <section id="work" className="py-20 sm:py-28 bg-[#0b0b0b] relative scroll-mt-20">
      {/* "Our Work" dynamic ticker banner */}
      <div className="w-full bg-[#F9CE00] py-3 sm:py-4 mb-14 overflow-hidden select-none shadow-md">
        <div className="animate-marquee-infinite flex items-center gap-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 shrink-0">
              <span className="text-xl sm:text-2xl font-syne font-black uppercase text-black tracking-tight">
                Our Work
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center text-xs font-bold uppercase tracking-[0.25em] text-[#F9CE00] mb-3">
              <span>Selected Portfolio &amp; Media Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-black text-white tracking-tight uppercase leading-none">
              Creative work that <br />
              <span className="text-neutral-400">breaks the internet.</span>
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-syne font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  viewMode === 'all'
                    ? 'bg-[#F9CE00] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All ({caseStudies.length + portfolioGallery.length})</span>
              </button>
              <button
                onClick={() => setViewMode('cases')}
                className={`px-3 py-1.5 rounded-lg text-xs font-syne font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  viewMode === 'cases'
                    ? 'bg-[#F9CE00] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Cases ({caseStudies.length})</span>
              </button>
              <button
                onClick={() => setViewMode('media')}
                className={`px-3 py-1.5 rounded-lg text-xs font-syne font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  viewMode === 'media'
                    ? 'bg-[#F9CE00] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media Gallery ({portfolioGallery.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills - Mobile friendly scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 mb-10 max-w-full touch-pan-x">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mr-1 uppercase tracking-wider font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#F9CE00]" />
            <span>Category:</span>
          </div>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all min-h-[38px] cursor-pointer touch-manipulation ${
                activeFilter === filter
                  ? 'bg-[#F9CE00] text-black shadow-md shadow-[#F9CE00]/20 font-black'
                  : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Case Studies */}
          {(viewMode === 'all' || viewMode === 'cases') &&
            filteredCaseStudies.map((study, idx) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                index={idx}
                isHovered={hoveredId === study.id}
                onHover={() => setHoveredId(study.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => onSelectCaseStudy(study)}
                onOpenLightbox={(e) => {
                  e.stopPropagation();
                  setLightboxImage({
                    url: study.posterUrl,
                    title: study.title,
                    client: study.client,
                    category: study.category,
                    tags: study.tags,
                  });
                }}
              />
            ))}

          {/* Media Gallery Visual Cards */}
          {(viewMode === 'all' || viewMode === 'media') &&
            filteredMedia.map((media, idx) => (
              <MediaGalleryCard
                key={media.id}
                item={media}
                index={idx}
                onOpenLightbox={() =>
                  setLightboxImage({
                    url: media.imageUrl,
                    title: media.title,
                    client: media.client,
                    category: media.category,
                    tags: media.tags,
                  })
                }
              />
            ))}
        </div>

        {/* Empty state if nothing matches */}
        {((viewMode === 'cases' && filteredCaseStudies.length === 0) ||
          (viewMode === 'media' && filteredMedia.length === 0) ||
          (viewMode === 'all' && filteredCaseStudies.length === 0 && filteredMedia.length === 0)) && (
          <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-syne font-bold text-white uppercase mb-1">
              No matching portfolio media found
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try selecting "All" or upload new media images in the Live Editor drawer.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal for High-Res Image Inspection */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl">
            <div className="fixed inset-0" onClick={() => setLightboxImage(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-5xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Lightbox Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/70">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#F9CE00] text-black text-xs font-mono font-black uppercase">
                    {lightboxImage.client || 'Portfolio Artwork'}
                  </span>
                  <span className="text-white font-syne font-bold text-sm tracking-wide">
                    {lightboxImage.title}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Image Preview */}
              <div className="p-4 sm:p-6 flex items-center justify-center overflow-auto bg-black flex-1 min-h-[300px]">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-neutral-900"
                />
              </div>

              {/* Lightbox Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-mono">Category:</span>
                  <span className="text-neutral-200 font-semibold">{lightboxImage.category}</span>
                  {lightboxImage.tags && lightboxImage.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 ml-3">
                      {lightboxImage.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-neutral-900 text-[10px] text-neutral-400 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={lightboxImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-[#F9CE00] hover:text-black text-neutral-200 font-mono text-[11px] transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Resolution</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onOpenLightbox: (e: React.MouseEvent) => void;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  study,
  index,
  isHovered,
  onHover,
  onLeave,
  onClick,
  onOpenLightbox,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    onHover();
    if (videoRef.current && study.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    onLeave();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all duration-300 shadow-xl"
    >
      {/* Media Canvas (16:10 or 16:9 ratio) */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-900">
        {/* Poster Image */}
        <img
          src={study.posterUrl}
          alt={study.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          loading="lazy"
        />

        {/* Video Preview on Hover (if direct video available) */}
        {study.videoUrl && !study.videoUrl.includes('youtu') && (
          <video
            ref={videoRef}
            src={study.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Top Floating Badge & Lightbox Trigger */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-neutral-200">
            {study.client}
          </span>
          <div className="flex items-center gap-2">
            {study.year && (
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-400">
                {study.year}
              </span>
            )}
            <button
              onClick={onOpenLightbox}
              title="Expand artwork image"
              className="p-1.5 rounded-full bg-black/70 backdrop-blur-md text-neutral-300 hover:text-[#F9CE00] border border-white/15 opacity-80 group-hover:opacity-100 transition-all"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Hover "Watch Case Study" Pill */}
        <div
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider shadow-2xl">
            {study.videoUrl ? <Play className="w-3.5 h-3.5 fill-black" /> : <ArrowUpRight className="w-4 h-4" />}
            <span>View Case Study</span>
          </span>
        </div>

        {/* Bottom subtle gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
      </div>

      {/* Card Metadata & Description */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
        <div>
          {/* Tags & Collaborator Badge */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {study.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {study.collaboratorName && (
              <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 border border-[#F9CE00]/25 px-2 py-0.5 rounded">
                Collab: {study.collaboratorName}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl sm:text-3xl font-syne font-extrabold text-white tracking-tight uppercase group-hover:text-[#F9CE00] transition-colors leading-tight">
              {study.title}
            </h3>
            <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-[#F9CE00] group-hover:text-black transition-colors shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <p className="mt-2 text-sm text-neutral-400 line-clamp-2 leading-relaxed">
            {study.summary}
          </p>
        </div>

        {/* Quick Results Bar */}
        {study.results && study.results.length > 0 && (
          <div className="mt-6 pt-4 border-t border-neutral-900 grid grid-cols-3 gap-2">
            {study.results.map((res, i) => (
              <div key={i} className="text-left">
                <div className="text-base sm:text-lg font-syne font-black text-[#F9CE00]">
                  {res.metric}
                </div>
                <div className="text-[10px] text-neutral-400 uppercase tracking-tight truncate">
                  {res.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

interface MediaGalleryCardProps {
  item: PortfolioMediaItem;
  index: number;
  onOpenLightbox: () => void;
}

const MediaGalleryCard: React.FC<MediaGalleryCardProps> = ({
  item,
  index,
  onOpenLightbox,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onOpenLightbox}
      className="group relative cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all duration-300 shadow-xl"
    >
      {/* Media Canvas */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-900">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Header Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-[#F9CE00]">
            {item.client || 'Portfolio Media'}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-neutral-300 flex items-center gap-1 border border-white/10">
            <ImageIcon className="w-3 h-3 text-[#F9CE00]" />
            <span>Visual Showcase</span>
          </span>
        </div>

        {/* Hover inspect pill */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider shadow-2xl">
            <ZoomIn className="w-4 h-4" />
            <span>View High-Res Artwork</span>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
      </div>

      {/* Card Info */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
              {item.category}
            </span>
            {item.tags?.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] font-mono text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded">
                #{t}
              </span>
            ))}
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl sm:text-2xl font-syne font-extrabold text-white tracking-tight uppercase group-hover:text-[#F9CE00] transition-colors leading-tight">
              {item.title}
            </h3>
            <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-[#F9CE00] group-hover:text-black transition-colors shrink-0">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>

          {item.caption && (
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
};

