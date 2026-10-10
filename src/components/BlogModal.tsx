import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, Tag, ArrowRight, Share2, Check, User } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onOpenBriefUs?: (options?: { service?: string; budget?: string; message?: string }) => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose, onOpenBriefUs }) => {
  const [copied, setCopied] = React.useState(false);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (post) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [post, onClose]);

  if (!post) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple markdown-style rendering for paragraphs and headings
  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((para, i) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // H3 heading
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-xl sm:text-2xl font-syne font-black text-white uppercase tracking-tight mt-8 mb-4">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H2 heading
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="text-2xl sm:text-3xl font-syne font-black text-[#F9CE00] uppercase tracking-tight mt-10 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Bullet lists
      if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        const lines = trimmed.split('\n');
        return (
          <ul key={i} className="space-y-2.5 my-4 pl-4 border-l-2 border-[#F9CE00]/40">
            {lines.map((line, idx) => (
              <li key={idx} className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')}
              </li>
            ))}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p key={i} className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.article
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with Category & Close */}
          <div className="px-6 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/90 sticky top-0 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00]" />
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-[#F9CE00]">
                {post.category}
              </span>
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline-flex items-center gap-1 ml-2">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                id="blog-share-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
                title="Copy article link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>
              <button
                onClick={onClose}
                id="blog-modal-close-btn"
                className="p-1.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Article Body */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Author Meta */}
            <div className="flex items-center justify-between border-y border-neutral-800/80 py-3.5 text-xs text-neutral-400">
              <div className="flex items-center gap-3">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-[#F9CE00]">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="font-syne font-bold text-white uppercase text-sm">{post.author.name}</div>
                  <div className="text-neutral-400 text-xs">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-neutral-400">
                <Calendar className="w-3.5 h-3.5 text-[#F9CE00]" />
                <span>{post.publishedAt}</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-900 border border-neutral-800">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt Lead */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border-l-4 border-[#F9CE00] text-sm sm:text-base text-neutral-200 font-medium italic leading-relaxed">
              "{post.excerpt}"
            </div>

            {/* Main Content */}
            <div className="prose prose-invert max-w-none text-neutral-300">
              {renderFormattedContent(post.content)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-neutral-800/80">
                <div className="text-xs uppercase font-mono tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#F9CE00]" />
                  <span>Topics Covered:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-neutral-900 text-neutral-300 border border-neutral-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agency Callout Footer */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-950 via-[#151515] to-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div>
                <h4 className="text-base sm:text-lg font-syne font-black uppercase text-white tracking-tight">
                  Want this creative intelligence on your brand?
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                  Our Pune & Mumbai studio teams are ready to craft your next breakthrough campaign.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenBriefUs?.({
                    service: post.category === 'Video Production' ? 'Video Shoot' : 'Creative Strategy',
                    message: `Inquiry inspired by blog article: "${post.title}"`,
                  });
                }}
                id="blog-modal-cta-btn"
                className="px-5 py-2.5 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span>Brief Us &rarr;</span>
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </AnimatePresence>
  );
};
