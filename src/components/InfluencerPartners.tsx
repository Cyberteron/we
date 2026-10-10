import React, { useState, useRef } from 'react';
import {
  LayoutGrid,
  Repeat,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Trash2,
  X,
  Upload,
  Sparkles,
  Check,
  Image as ImageIcon,
  Palette,
  Link as LinkIcon,
} from 'lucide-react';
import { INFLUENCER_SELECTED_PARTNERS } from '../data/influencerPartnersData';
import { PartnerLogoBadge } from './PartnerLogoBadge';
import { InfluencerPartner } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';

interface InfluencerPartnersProps {
  partners?: InfluencerPartner[];
  onOpenBriefUs?: (options?: { service?: string; budget?: string; message?: string }) => void;
  onAddPartner?: (newPartner: InfluencerPartner) => void;
  onDeletePartner?: (id: string) => void;
}

const COLOR_PRESETS = [
  { label: 'Akaar Gold', hex: '#F9CE00' },
  { label: 'Crimson Red', hex: '#ED1C24' },
  { label: 'Decathlon Blue', hex: '#0082C3' },
  { label: 'Cyber Violet', hex: '#7C3AED' },
  { label: 'Emerald Green', hex: '#10B981' },
  { label: 'Neon Pink', hex: '#EC4899' },
  { label: 'Tangerine', hex: '#FF5A00' },
  { label: 'Sky Blue', hex: '#38BDF8' },
  { label: 'Pure White', hex: '#FFFFFF' },
];

const STANDARD_CATEGORIES = [
  'Sports & Outdoors',
  'Fashion & Streetwear',
  'Tech, Media & Audio',
  'Lifestyle & Wellness',
  'Energy, Auto & Education',
];

export const InfluencerPartners: React.FC<InfluencerPartnersProps> = ({
  partners,
  onOpenBriefUs,
  onAddPartner,
  onDeletePartner,
}) => {
  const { isAdmin, openAuthModal } = useAdminAuth();
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('marquee');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for Add Influencer
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Sports & Outdoors');
  const [customCategory, setCustomCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [badge, setBadge] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isCollaborator, setIsCollaborator] = useState(true);
  const [collaboratorRole, setCollaboratorRole] = useState('Featured Creator');
  const [accentColor, setAccentColor] = useState('#F9CE00');
  const [logoSource, setLogoSource] = useState<'upload' | 'url' | 'monogram'>('upload');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allPartners = partners && partners.length > 0 ? partners : INFLUENCER_SELECTED_PARTNERS;

  const categories = [
    'All',
    'Sports & Outdoors',
    'Fashion & Streetwear',
    'Tech, Media & Audio',
    'Lifestyle & Wellness',
    'Energy, Auto & Education',
  ];

  const filteredPartners =
    selectedCategory === 'All'
      ? allPartners
      : allPartners.filter((p) => p.category === selectedCategory);

  // Dynamic looped lists for the infinite marquee based on active category
  const activeMarqueeSource = filteredPartners.length > 0 ? filteredPartners : allPartners;
  const loopCount = Math.max(2, Math.ceil(12 / Math.max(1, activeMarqueeSource.length)));
  const marqueeList = Array(loopCount).fill(activeMarqueeSource).flat();
  const half = Math.ceil(marqueeList.length / 2);
  const row1 = marqueeList.slice(0, half);
  const row2 = marqueeList.slice(half);

  const handleOpenAddModal = () => {
    if (!isAdmin) {
      openAuthModal();
      return;
    }
    setShowAddModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedPreview(base64);
        setLogoUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUploadedPreview(base64);
        setLogoUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory =
      category === 'Custom' ? customCategory.trim() || 'Culture & Media' : category;

    const finalLogoUrl =
      logoSource === 'monogram' ? '' : logoSource === 'upload' ? uploadedPreview || '' : logoUrl.trim();

    const newPartner: InfluencerPartner = {
      id: `inf-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      category: finalCategory,
      tagline: tagline.trim() || undefined,
      badge: badge.trim() || (isCollaborator ? collaboratorRole || 'Featured Creator' : undefined),
      logoUrl: finalLogoUrl,
      linkUrl: linkUrl.trim() || undefined,
      isCollaborator: isCollaborator,
      collaboratorRole: isCollaborator ? collaboratorRole.trim() || 'Featured Creator' : undefined,
      accentColor: accentColor,
    };

    if (onAddPartner) {
      onAddPartner(newPartner);
    }

    // Reset Form
    setName('');
    setCategory('Sports & Outdoors');
    setCustomCategory('');
    setTagline('');
    setBadge('');
    setLinkUrl('');
    setIsCollaborator(true);
    setCollaboratorRole('Featured Creator');
    setAccentColor('#F9CE00');
    setLogoSource('upload');
    setLogoUrl('');
    setUploadedPreview(null);
    setShowAddModal(false);
  };

  // Live preview dummy partner for modal
  const previewPartner: InfluencerPartner = {
    id: 'preview-partner',
    name: name.trim() || 'Creator / Brand Name',
    category: category === 'Custom' ? customCategory.trim() || 'Culture' : category,
    tagline: tagline.trim() || 'Cultural Storytelling & Social Reach',
    badge: badge.trim() || (isCollaborator ? collaboratorRole || 'Featured Creator' : 'Partner'),
    logoUrl:
      logoSource === 'monogram' ? '' : logoSource === 'upload' ? uploadedPreview || '' : logoUrl.trim(),
    linkUrl: linkUrl.trim() || undefined,
    isCollaborator: isCollaborator,
    collaboratorRole: isCollaborator ? collaboratorRole.trim() || 'Featured Creator' : undefined,
    accentColor: accentColor,
  };

  return (
    <section
      id="influencer-partners"
      className="py-16 sm:py-24 bg-[#0a0a0a] border-b border-neutral-800/80 overflow-hidden relative scroll-mt-24"
    >
      {/* Glow Accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F9CE00]/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Container Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F9CE00]">
                Influencer Selected Partners
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
                {allPartners.length} Brands &amp; Creators
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight">
              Creator &amp; Culture Collaborations.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-2xl leading-relaxed">
              Over {allPartners.length} trailblazing brands partnered with Akaar’s creator squads for
              influencer marketing, commercial shoots, and high-retention social campaigns.
            </p>
          </div>

          {/* Action & View Switcher Controls */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end shrink-0 flex-wrap sm:flex-nowrap">
            <div className="inline-flex p-1 rounded-full bg-neutral-900 border border-neutral-800 shrink-0">
              <button
                id="influencer-view-marquee-btn"
                onClick={() => setViewMode('marquee')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                  viewMode === 'marquee'
                    ? 'bg-[#F9CE00] text-black shadow-md font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Ticker</span>
              </button>
              <button
                id="influencer-view-grid-btn"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                  viewMode === 'grid'
                    ? 'bg-[#F9CE00] text-black shadow-md font-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid ({filteredPartners.length})</span>
              </button>
            </div>

            {isAdmin && (
              <button
                id="influencer-add-partner-btn"
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-syne font-black uppercase tracking-wider bg-[#F9CE00] hover:bg-white text-black transition-all shadow-md shadow-[#F9CE00]/20 cursor-pointer min-h-[36px] shrink-0"
                title="Add a new creator or influencer partner to the roster"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Influencer</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile & Desktop Friendly Category Filter Tabs */}
        <div className="w-full mt-6 pt-5 border-t border-neutral-800/80">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 max-w-full touch-pan-x">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? allPartners.length
                    : allPartners.filter((p) => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`partner-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 whitespace-nowrap px-3.5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all min-h-[38px] flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#F9CE00] text-black shadow-md shadow-[#F9CE00]/20 font-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isSelected
                          ? 'bg-black/20 text-black font-black'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs font-mono text-[#F9CE00] hover:underline flex items-center gap-1 shrink-0 py-1 cursor-pointer"
              >
                <span>Reset to All ({allPartners.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'marquee' ? (
        <div className="space-y-6 relative z-10 mt-4">
          {/* Marquee Row 1 */}
          <div className="relative w-full overflow-hidden select-none py-3 border-y border-neutral-800/60 bg-neutral-950/70 backdrop-blur-sm">
            <div className="animate-marquee-infinite flex items-center gap-4 sm:gap-6">
              {row1.map((partner, index) => (
                <div
                  key={`row1-${partner.id}-${index}`}
                  className="w-[170px] sm:w-[195px] h-[140px] sm:h-[152px] p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-[#F9CE00] hover:bg-neutral-900 transition-all duration-300 flex flex-col items-center justify-between shrink-0 shadow-md group cursor-pointer"
                  title={`${partner.name} - ${partner.category}`}
                  onClick={() =>
                    onOpenBriefUs?.({
                      service: 'Creator & Influencer Marketing',
                      budget: 'Rs 50,000 - Rs 1,00,000',
                      message: `Inquiry regarding creator collaborations similar to our work with ${partner.name}.`,
                    })
                  }
                >
                  {/* Top: Large, recognizable logo */}
                  <div className="w-full flex-1 min-h-[75px] sm:min-h-[85px] flex items-center justify-center p-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800/40 group-hover:border-[#F9CE00]/40 transition-all">
                    <PartnerLogoBadge partner={partner} mode="ticker" />
                  </div>
                  {/* Bottom: Partner name clearly written below logo */}
                  <div className="w-full pt-2 pb-0.5 border-t border-neutral-800/80 flex flex-col items-center justify-center text-center">
                    <span className="text-xs sm:text-sm font-syne font-bold text-white group-hover:text-[#F9CE00] transition-colors leading-tight truncate w-full px-1">
                      {partner.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300 uppercase tracking-wider truncate max-w-full">
                      {partner.category || 'Creator Partner'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Row 2 (Reverse) */}
          <div className="relative w-full overflow-hidden select-none py-3 border-b border-neutral-800/60 bg-neutral-950/70 backdrop-blur-sm">
            <div className="animate-marquee-reverse flex items-center gap-4 sm:gap-6">
              {row2.map((partner, index) => (
                <div
                  key={`row2-${partner.id}-${index}`}
                  className="w-[170px] sm:w-[195px] h-[140px] sm:h-[152px] p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-[#F9CE00] hover:bg-neutral-900 transition-all duration-300 flex flex-col items-center justify-between shrink-0 shadow-md group cursor-pointer"
                  title={`${partner.name} - ${partner.category}`}
                  onClick={() =>
                    onOpenBriefUs?.({
                      service: 'Creator & Influencer Marketing',
                      budget: 'Rs 50,000 - Rs 1,00,000',
                      message: `Inquiry regarding creator collaborations similar to our work with ${partner.name}.`,
                    })
                  }
                >
                  {/* Top: Large, recognizable logo */}
                  <div className="w-full flex-1 min-h-[75px] sm:min-h-[85px] flex items-center justify-center p-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800/40 group-hover:border-[#F9CE00]/40 transition-all">
                    <PartnerLogoBadge partner={partner} mode="ticker" />
                  </div>
                  {/* Bottom: Partner name clearly written below logo */}
                  <div className="w-full pt-2 pb-0.5 border-t border-neutral-800/80 flex flex-col items-center justify-center text-center">
                    <span className="text-xs sm:text-sm font-syne font-bold text-white group-hover:text-[#F9CE00] transition-colors leading-tight truncate w-full px-1">
                      {partner.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300 uppercase tracking-wider truncate max-w-full">
                      {partner.category || 'Creator Partner'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Filterable Grid */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-2">
          {isAdmin && (
            <div className="mb-4 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Admin Studio: Hover card to remove • Click to visit link</span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4">
            {/* Quick Add Card (Visible to Admin in Grid) */}
            {isAdmin && (
              <div
                id="partner-quick-add-card"
                onClick={handleOpenAddModal}
                className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[#F9CE00]/40 hover:border-[#F9CE00] bg-[#F9CE00]/5 hover:bg-[#F9CE00]/10 transition-all duration-300 cursor-pointer text-center min-h-[200px] sm:min-h-[225px] w-full box-border shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-[#F9CE00]/20 text-[#F9CE00] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="font-syne font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                  Add Influencer
                </span>
                <span className="text-[10px] font-mono text-[#F9CE00] mt-0.5">
                  + New Creator
                </span>
              </div>
            )}

            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                id={`partner-card-${partner.id}`}
                onClick={() => {
                  if (partner.linkUrl && partner.linkUrl.trim() !== '') {
                    window.open(partner.linkUrl, '_blank', 'noopener,noreferrer');
                  } else {
                    onOpenBriefUs?.({
                      service: 'Creator & Influencer Marketing',
                      budget: 'Rs 50,000 - Rs 1,00,000',
                      message: `Campaign brief inspired by ${partner.name} partnership.`,
                    });
                  }
                }}
                className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-[#F9CE00] hover:bg-neutral-900 transition-all duration-300 cursor-pointer text-center min-h-[200px] sm:min-h-[225px] w-full overflow-hidden box-border shadow-md"
              >
                {/* Top Status & Collaborator Pill */}
                <div className="w-full flex items-center justify-between pointer-events-none z-10 px-0.5 mb-1.5">
                  {partner.isCollaborator ? (
                    <span className="text-[9px] font-mono font-bold text-[#F9CE00] bg-[#F9CE00]/15 px-2 py-0.5 rounded-full border border-[#F9CE00]/30 truncate max-w-[70%]">
                      {partner.collaboratorRole || 'Collaborator'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider truncate max-w-[70%] text-left">
                      {partner.badge || 'Partner'}
                    </span>
                  )}

                  <div className="flex items-center gap-1 pointer-events-auto">
                    {/* Inline Delete Button for Admins */}
                    {isAdmin && onDeletePartner && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (deleteConfirmId === partner.id) {
                            onDeletePartner(partner.id);
                            setDeleteConfirmId(null);
                          } else {
                            setDeleteConfirmId(partner.id);
                            setTimeout(() => setDeleteConfirmId(null), 3000);
                          }
                        }}
                        className={`p-1 rounded-md transition-colors ${
                          deleteConfirmId === partner.id
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100'
                        }`}
                        title={
                          deleteConfirmId === partner.id
                            ? 'Click again to permanently delete'
                            : 'Delete partner'
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    {partner.linkUrl ? (
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#F9CE00] transition-colors shrink-0" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#F9CE00] transition-colors shrink-0" />
                    )}
                  </div>
                </div>

                {/* Prominent Logo Stage */}
                <div className="w-full flex-1 min-h-[90px] sm:min-h-[105px] flex items-center justify-center p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/50 group-hover:border-[#F9CE00]/40 group-hover:bg-neutral-950 transition-all duration-300 group-hover:scale-105">
                  <PartnerLogoBadge partner={partner} mode="grid" />
                </div>

                {/* Name and Category container - clearly positioned below logo */}
                <div className="w-full pt-2.5 pb-0.5 border-t border-neutral-800/80 flex flex-col items-center justify-center overflow-hidden">
                  <span
                    className="text-xs sm:text-sm font-syne font-bold text-white group-hover:text-[#F9CE00] transition-colors leading-tight text-center line-clamp-1 w-full px-1"
                    title={partner.name}
                  >
                    {partner.name}
                  </span>
                  {partner.category && (
                    <span
                      className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-300 transition-colors uppercase tracking-wider mt-0.5 truncate max-w-full px-1"
                      title={partner.category}
                    >
                      {partner.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD INFLUENCER / CREATOR MODAL                                            */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 max-w-2xl w-full relative shadow-2xl max-h-[92vh] flex flex-col text-left overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9CE00]">
                    Creator Ecosystem
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#F9CE00]/10 text-[#F9CE00] border border-[#F9CE00]/20">
                    Portfolio Expansion
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-syne font-black uppercase text-white tracking-tight">
                  Add Influencer / Creator Partner
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Publish a new brand partner, talent squad member, or collaborator to Akaar’s
                  live roster.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitNewPartner} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Creator / Brand Name */}
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Creator or Brand Partner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Puma Motorsport, Tanmay Bhat..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  >
                    {STANDARD_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">+ Custom Category...</option>
                  </select>
                </div>
              </div>

              {category === 'Custom' && (
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gaming & Esports, Hospitality..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>
              )}

              {/* Tagline & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Tagline / Reach Metric
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4.5M Reach • Extreme Action Sports"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1">
                    Badge Pill Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Action Sports, Youth Fintech..."
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>
              </div>

              {/* Collaborator Options & External Profile Link */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-xs text-[#F9CE00] uppercase">
                    Culture Collaborator Status
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCollaborator}
                      onChange={(e) => setIsCollaborator(e.target.checked)}
                      className="w-4 h-4 accent-[#F9CE00] rounded"
                    />
                    <span className="text-xs font-mono text-neutral-200">
                      Mark as Featured Collaborator
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Collaborator Role / Credit
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Featured Creator, Squad Lead..."
                      value={collaboratorRole}
                      onChange={(e) => setCollaboratorRole(e.target.value)}
                      disabled={!isCollaborator}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00] disabled:opacity-40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Social or Portfolio Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/creator"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>
                </div>
              </div>

              {/* Creator Photo / Brand Emblem Input */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-neutral-300">
                  Visual Emblem / Photo
                </label>
                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoSource('upload')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      logoSource === 'upload'
                        ? 'bg-[#F9CE00] text-black font-bold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoSource('url')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      logoSource === 'url'
                        ? 'bg-[#F9CE00] text-black font-bold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <LinkIcon className="w-3 h-3" />
                    <span>Image URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoSource('monogram')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      logoSource === 'monogram'
                        ? 'bg-[#F9CE00] text-black font-bold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    <Palette className="w-3 h-3" />
                    <span>Stylized Monogram</span>
                  </button>
                </div>

                {/* Tab content */}
                {logoSource === 'upload' && (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-700 hover:border-[#F9CE00] rounded-2xl p-4 text-center cursor-pointer bg-neutral-950/60 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    {uploadedPreview ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={uploadedPreview}
                          alt="Preview"
                          className="w-12 h-12 rounded-xl object-contain bg-black border border-neutral-800"
                        />
                        <div className="text-left">
                          <span className="text-xs text-white font-mono block">Image loaded</span>
                          <span className="text-[10px] text-[#F9CE00] font-mono">
                            Click or drag to change
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-neutral-500" />
                        <span className="text-xs text-neutral-300 font-mono">
                          Drag &amp; drop creator photo or brand logo here, or browse
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          PNG, SVG, JPG, WEBP supported
                        </span>
                      </>
                    )}
                  </div>
                )}

                {logoSource === 'url' && (
                  <input
                    type="url"
                    placeholder="https://example.com/logo-or-photo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                  />
                )}

                {/* Accent Color Selection */}
                <div className="pt-2">
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                    Accent Color / Monogram Glow
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setAccentColor(color.hex)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          accentColor === color.hex
                            ? 'scale-125 border-white shadow-md'
                            : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      >
                        {accentColor === color.hex && (
                          <Check
                            className={`w-3 h-3 stroke-[3] ${
                              color.hex === '#FFFFFF' || color.hex === '#F9CE00'
                                ? 'text-black'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
                      title="Custom color picker"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-black border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#F9CE00] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Live Interactive Card Preview</span>
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500">Real-time preview</span>
                </div>

                <div className="flex items-center justify-center p-2">
                  <div className="w-44 h-[172px] rounded-2xl bg-neutral-900/90 border border-[#F9CE00]/60 p-3 flex flex-col items-center justify-between text-center box-border shadow-lg">
                    {/* Top status */}
                    <div className="w-full flex items-center justify-between px-0.5">
                      {previewPartner.isCollaborator ? (
                        <span className="text-[9px] font-mono font-bold text-[#F9CE00] bg-[#F9CE00]/15 px-2 py-0.5 rounded-full border border-[#F9CE00]/30 truncate max-w-[70%]">
                          {previewPartner.collaboratorRole || 'Collaborator'}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider truncate max-w-[70%] text-left">
                          {previewPartner.badge || 'Partner'}
                        </span>
                      )}
                      <ArrowUpRight className="w-3 h-3 text-[#F9CE00]" />
                    </div>

                    {/* Logo / Monogram */}
                    <div className="w-full flex-1 flex items-center justify-center py-1">
                      <PartnerLogoBadge partner={previewPartner} mode="grid" />
                    </div>

                    {/* Name & Category */}
                    <div className="w-full pt-2 pb-0.5 border-t border-neutral-800 flex flex-col items-center justify-center">
                      <span className="text-[11px] font-syne font-bold text-white truncate max-w-full">
                        {previewPartner.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#F9CE00] uppercase tracking-wider">
                        {previewPartner.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#F9CE00]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Save &amp; Publish Influencer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
