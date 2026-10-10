import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Clock, Calendar, ArrowRight, BookOpen, Trash2, Tag, Sparkles, PenTool, CheckCircle2 } from 'lucide-react';
import { BlogPost } from '../types';
import { BlogModal } from './BlogModal';
import { WriteBlogModal } from './WriteBlogModal';

interface BlogSectionProps {
  blogs: BlogPost[];
  onAddBlog: (post: BlogPost) => void;
  onDeleteBlog?: (id: string) => void;
  onOpenBriefUs?: (options?: { service?: string; budget?: string; message?: string }) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  blogs,
  onAddBlog,
  onDeleteBlog,
  onOpenBriefUs,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);

  // Derive unique categories from user's published blogs
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return ['All', ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.tags.some((t) => t.toLowerCase().includes(q)) ||
        blog.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <section id="blogs" className="scroll-mt-24 py-16 sm:py-24 md:py-32 bg-[#090909] text-white relative border-t border-neutral-800/80 overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F9CE00]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00]" />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#F9CE00]">
                Intelligence &amp; Culture
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
                {blogs.length} {blogs.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-syne font-black uppercase text-white tracking-tight leading-tight">
              Akaar Insights &amp; Blogs.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Strategic intelligence, creator trends, viral hooks, and production workflows straight from our Pune &amp; Mumbai studio directors.
            </p>
          </div>

          {/* Prominent Write & Publish Button (Always accessible) */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsWriteModalOpen(true)}
              id="write-new-blog-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#F9CE00]/20 hover:scale-105 active:scale-95 cursor-pointer"
              title="Write and publish a new article"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Write &amp; Publish Article</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {blogs.length === 0 ? (
          /* Empty State: Shown when no blogs are published yet */
          <div className="py-16 sm:py-24 px-4 sm:px-8 text-center max-w-xl mx-auto rounded-3xl bg-neutral-950/80 border border-neutral-800/80 backdrop-blur-md shadow-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F9CE00]/10 border border-[#F9CE00]/30 flex items-center justify-center mx-auto mb-4 sm:mb-5 text-[#F9CE00]">
              <PenTool className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-syne font-black text-white uppercase tracking-tight mb-2">
              No Published Articles Yet
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Demo blogs have been removed. When you write and publish an article from your writer studio, it will appear here immediately and stay visible.
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              id="empty-state-write-blog-btn"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#F9CE00]/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Write &amp; Publish First Article</span>
            </button>
          </div>
        ) : (
          /* Published Blogs Listing */
          <>
            {/* Filter & Search Bar */}
            <div className="mb-8 sm:mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
              {/* Categories Horizontal Scroll */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const count = cat === 'All' ? blogs.length : blogs.filter((b) => b.category === cat).length;
                  return (
                    <button
                      key={cat}
                      id={`blog-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 min-h-[38px] ${
                        isSelected
                          ? 'bg-[#F9CE00] text-black font-bold shadow-md shadow-[#F9CE00]/20'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F9CE00] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-white"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            {/* Filtered Results Grid */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredBlogs.map((blog, idx) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(0.2, idx * 0.05) }}
                    className="group flex flex-col bg-[#111111] rounded-3xl overflow-hidden border border-neutral-800/80 hover:border-[#F9CE00]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black"
                  >
                    {/* Card Cover Image with Overlays */}
                    <div
                      onClick={() => setActivePost(blog)}
                      className="relative aspect-[16/10] overflow-hidden bg-neutral-900 cursor-pointer"
                    >
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Badges Overlay */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-neutral-700 text-[#F9CE00]">
                          {blog.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 backdrop-blur-md border border-neutral-800 text-neutral-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#F9CE00]" />
                          {blog.readTime}
                        </span>
                      </div>

                      {blog.featured && (
                        <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#F9CE00] bg-[#F9CE00]/10 border border-[#F9CE00]/40 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured Article</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta info: Date & Author */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#F9CE00]" />
                            {blog.publishedAt}
                          </span>
                          <span className="text-neutral-400 truncate max-w-[140px] text-right font-medium">
                            By {blog.author.name}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => setActivePost(blog)}
                          className="text-base sm:text-lg md:text-xl font-syne font-black uppercase text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[#F9CE00] transition-colors cursor-pointer mb-2.5"
                        >
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Footer tags and read action */}
                      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 truncate"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onDeleteBlog && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete article "${blog.title}"?`)) {
                                  onDeleteBlog(blog.id);
                                }
                              }}
                              className="p-1.5 rounded-full text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors"
                              title="Delete blog post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setActivePost(blog)}
                            className="inline-flex items-center gap-1.5 text-xs font-syne font-bold uppercase tracking-wider text-[#F9CE00] hover:text-white transition-colors cursor-pointer"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              /* No search match */
              <div className="text-center py-12 px-4 bg-neutral-950/60 rounded-3xl border border-dashed border-neutral-800">
                <BookOpen className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <h4 className="text-base font-syne font-bold uppercase text-white tracking-tight mb-1">
                  No Matching Articles Found
                </h4>
                <p className="text-xs text-neutral-400 mb-4">
                  No articles matched your search query. Try clearing the filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-mono bg-neutral-900 text-neutral-300 border border-neutral-800 hover:text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reader Modal */}
      <BlogModal
        post={activePost}
        onClose={() => setActivePost(null)}
        onOpenBriefUs={onOpenBriefUs}
      />

      {/* Write Blog Modal */}
      <WriteBlogModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onAddBlog={(newBlog) => {
          onAddBlog(newBlog);
          setIsWriteModalOpen(false);
          // Set as active post to preview immediately
          setActivePost(newBlog);
        }}
      />
    </section>
  );
};
