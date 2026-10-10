import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Upload, Image as ImageIcon, Eye, Edit3, Check, AlertCircle } from 'lucide-react';
import { BlogPost } from '../types';

interface WriteBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlog: (newPost: BlogPost) => void;
}

const PRESET_COVERS = [
  { label: 'Creator Studio', url: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Film & Cine Gear', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Creative Strategy', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Sound & Audio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Street Culture', url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Neon Cyber Lab', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80' },
];

const CATEGORIES = [
  'Creator Economy',
  'Video Production',
  'Creative Strategy',
  'Social Lab',
  'Brand Growth',
  'Experiential & PR',
  'Custom',
];

export const WriteBlogModal: React.FC<WriteBlogModalProps> = ({ isOpen, onClose, onAddBlog }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Creator Economy');
  const [customCategory, setCustomCategory] = useState('');
  const [authorName, setAuthorName] = useState('Akaar Editorial Team');
  const [authorRole, setAuthorRole] = useState('Creative Intelligence Lead');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [imageMode, setImageMode] = useState<'preset' | 'url' | 'upload'>('preset');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Creator Economy, Culture, Strategy');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [error, setError] = useState('');

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 2MB.');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getEffectiveCover = (): string => {
    if (imageMode === 'url' && customCoverUrl.trim()) return customCoverUrl.trim();
    return coverImage;
  };

  // Estimate read time
  const calculateReadTime = (): string => {
    const wordCount = (excerpt + ' ' + content).trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    return `${minutes} min read`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your blog post.');
      return;
    }
    if (!content.trim()) {
      setError('Please write some content for the article.');
      return;
    }

    const finalCategory = category === 'Custom' ? customCategory.trim() || 'Insights' : category;
    const finalExcerpt = excerpt.trim() || content.trim().substring(0, 160) + '...';

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt: finalExcerpt,
      content: content.trim(),
      category: finalCategory,
      coverImage: getEffectiveCover(),
      author: {
        name: authorName.trim() || 'Akaar Studio Team',
        role: authorRole.trim() || 'Creative Intelligence',
      },
      publishedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: calculateReadTime(),
      tags: parsedTags.length > 0 ? parsedTags : ['Agency', 'Creative'],
    };

    onAddBlog(newPost);
    // Reset form
    setTitle('');
    setExcerpt('');
    setContent('');
    setTags('Strategy, Culture');
    setError('');
    onClose();
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

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#F9CE00]" />
              <h2 className="text-xl font-syne font-black uppercase text-white tracking-tight">
                Write New Blog Article
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex p-0.5 rounded-full bg-neutral-900 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    activeTab === 'editor' ? 'bg-[#F9CE00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    activeTab === 'preview' ? 'bg-[#F9CE00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                id="write-blog-close-btn"
                className="p-1.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form / Content */}
          <div className="overflow-y-auto p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'editor' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., The Future of Creator Economy: Turning Eyeballs into Loyal Customers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors"
                  />
                </div>

                {/* Category & Tags Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#F9CE00] transition-colors"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {category === 'Custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full mt-2 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00]"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="TikTok, Strategy, Gen Z, Viral"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors"
                    />
                  </div>
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                      Author Role / Title
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors"
                    />
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div>
                  <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageMode('preset')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        imageMode === 'preset' ? 'bg-[#F9CE00] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        imageMode === 'url' ? 'bg-[#F9CE00] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        imageMode === 'upload' ? 'bg-[#F9CE00] text-black font-bold' : 'bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      Upload File
                    </button>
                  </div>

                  {imageMode === 'preset' && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_COVERS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all group ${
                            coverImage === preset.url ? 'border-[#F9CE00] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-[10px] font-mono text-white p-1 text-center font-bold">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {imageMode === 'url' && (
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={customCoverUrl}
                      onChange={(e) => setCustomCoverUrl(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00]"
                    />
                  )}

                  {imageMode === 'upload' && (
                    <div className="border-2 border-dashed border-neutral-800 rounded-xl p-6 text-center hover:border-neutral-700 transition-colors">
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400 mb-2">Upload JPG, PNG, or WebP (Max 2MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#F9CE00] file:text-black hover:file:bg-white cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-syne font-black uppercase tracking-wider text-neutral-300 mb-2">
                    Short Excerpt / Hook
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A concise 1-2 sentence hook that explains why someone must read this piece..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors"
                  />
                </div>

                {/* Main Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-syne font-black uppercase tracking-wider text-neutral-300">
                      Article Content *
                    </label>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Tip: Use "### Heading" for subtitles &amp; separate paragraphs with blank lines
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    required
                    placeholder="Write the full article here...&#10;&#10;### The Problem&#10;Explain the industry context and key takeaways.&#10;&#10;### The Strategic Solution&#10;Detail actionable insights, metrics, or frameworks."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F9CE00] transition-colors font-mono"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="publish-blog-submit-btn"
                    className="px-8 py-3 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Blog Article</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Preview Tab */
              <div className="space-y-6">
                <div className="text-xs font-mono text-[#F9CE00] uppercase tracking-wider flex items-center gap-2">
                  <span>Previewing:</span>
                  <span className="text-white">{title || 'Untitled Article'}</span>
                </div>

                {getEffectiveCover() && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-900 border border-neutral-800">
                    <img src={getEffectiveCover()} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span className="px-3 py-1 rounded-full bg-[#F9CE00] text-black font-bold uppercase">
                    {category === 'Custom' ? customCategory || 'General' : category}
                  </span>
                  <span>{authorName} &bull; {calculateReadTime()}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white tracking-tight">
                  {title || 'Article Title Preview'}
                </h1>

                {excerpt && (
                  <div className="p-4 rounded-xl bg-neutral-950 border-l-4 border-[#F9CE00] text-sm text-neutral-300 italic">
                    "{excerpt}"
                  </div>
                )}

                <div className="whitespace-pre-line text-sm text-neutral-300 leading-relaxed">
                  {content || 'Article content will appear here...'}
                </div>

                <div className="pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('editor')}
                    className="px-6 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase tracking-wider"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
