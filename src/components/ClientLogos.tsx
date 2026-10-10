import React, { useState, useRef, useMemo } from 'react';
import {
  LayoutGrid,
  Repeat,
  Plus,
  Handshake,
  ArrowRight,
  ShieldCheck,
  Upload,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Check,
  Sparkles,
  Search,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ClientLogo } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { INFLUENCER_SELECTED_PARTNERS, InfluencerPartnerWithSvg } from '../data/influencerPartnersData';
import { PartnerLogoBadge, BrandVectorLogo, resolveBrandId } from './PartnerLogoBadge';
import {
  sanitizeInput,
  sanitizeSvg,
  isSafeImageUrl,
  validateImageUpload,
} from '../utils/security';

interface ClientLogosProps {
  clients: ClientLogo[];
  onOpenContact?: () => void;
  onOpenPartnerPage?: () => void;
  onAddPartner?: (newPartner: ClientLogo) => void;
  onAddMultiplePartners?: (newPartners: ClientLogo[]) => void;
  onDeletePartner?: (partnerId: string) => void;
  onClearAllPartners?: () => void;
}

export const ClientLogos: React.FC<ClientLogosProps> = ({
  clients = [],
  onOpenContact,
  onOpenPartnerPage,
  onAddPartner,
  onAddMultiplePartners,
  onDeletePartner,
  onClearAllPartners,
}) => {
  const { isAdmin, openAuthModal } = useAdminAuth();
  const [viewMode, setViewMode] = useState<'marquee' | 'grid'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'influencer' | 'custom'>('influencer');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Brand Partners Picker State
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Form State
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLink, setNewPartnerLink] = useState('');
  const [newPartnerIsCollab, setNewPartnerIsCollab] = useState(false);
  const [newPartnerCollabRole, setNewPartnerCollabRole] = useState('Brand Collaborator');
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url' | 'monogram'>('upload');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [brandColor, setBrandColor] = useState('#F9CE00');
  const [isDragging, setIsDragging] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set of existing client names and IDs for instant lookup
  const existingClientIds = useMemo(() => {
    return new Set(clients.map((c) => c.id.toLowerCase()));
  }, [clients]);

  const existingClientNames = useMemo(() => {
    return new Set(clients.map((c) => c.name.toLowerCase().trim()));
  }, [clients]);

  // Filter influencer partners in modal by search query
  const filteredInfluencerPartners = useMemo(() => {
    if (!searchQuery.trim()) return INFLUENCER_SELECTED_PARTNERS;
    const query = searchQuery.toLowerCase().trim();
    return INFLUENCER_SELECTED_PARTNERS.filter((partner) => {
      return (
        partner.name.toLowerCase().includes(query) ||
        (partner.tagline && partner.tagline.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Fallback to INFLUENCER_SELECTED_PARTNERS so Client Ecosystem is ALWAYS populated and visible to viewers
  const effectiveClients =
    clients && clients.length > 0
      ? clients
      : INFLUENCER_SELECTED_PARTNERS.map((p) => ({
          id: p.id,
          name: p.name,
          logoUrl: p.logoUrl || '',
        }));

  // Duplicate for seamless infinite marquee loop
  const marqueeClients =
    effectiveClients.length > 0
      ? effectiveClients.length < 5
        ? [...effectiveClients, ...effectiveClients, ...effectiveClients, ...effectiveClients]
        : [...effectiveClients, ...effectiveClients]
      : [];

  const handleFileChange = (file: File) => {
    if (!file) return;

    const validation = validateImageUpload(file);
    if (!validation.isValid) {
      alert(validation.error || 'Please select a valid image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isSafeImageUrl(result)) {
        setLogoDataUrl(result);
      } else {
        alert('Security Alert: The uploaded image failed security validation.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const getEffectiveLogo = (): string => {
    if (logoInputType === 'upload' && logoDataUrl) {
      return isSafeImageUrl(logoDataUrl) ? logoDataUrl : '';
    }
    if (logoInputType === 'url' && logoUrlInput.trim()) {
      const sanitizedUrl = sanitizeInput(logoUrlInput.trim());
      return isSafeImageUrl(sanitizedUrl) ? sanitizedUrl : '';
    }
    // Monogram fallback SVG as data URI
    const sanitizedName = sanitizeInput(newPartnerName);
    const initials =
      sanitizedName
        .trim()
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('') || 'CP';

    const safeColor =
      brandColor.startsWith('#') && brandColor.length <= 9 ? brandColor : '#F9CE00';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60"><rect width="100%" height="100%" rx="12" fill="#171717"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="22" fill="${safeColor}" letter-spacing="2">${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(sanitizeSvg(svg))}`;
  };

  // Add a partner from the curated partners catalog
  const handleToggleInfluencerPartner = (partner: InfluencerPartnerWithSvg) => {
    if (!isAdmin) {
      openAuthModal();
      return;
    }

    const isAlreadyAdded =
      existingClientIds.has(partner.id.toLowerCase()) ||
      existingClientNames.has(partner.name.toLowerCase().trim());

    if (isAlreadyAdded) {
      // Find matching client to delete
      const match = clients.find(
        (c) =>
          c.id.toLowerCase() === partner.id.toLowerCase() ||
          c.name.toLowerCase().trim() === partner.name.toLowerCase().trim()
      );
      if (match) {
        onDeletePartner?.(match.id);
      }
    } else {
      const newEntry: ClientLogo = {
        id: partner.id,
        name: partner.name,
        logoUrl: partner.logoUrl || '',
      };
      onAddPartner?.(newEntry);
    }
  };

  // Bulk add all 30 Brand Partners
  const handleAddAllInfluencerPartners = () => {
    if (!isAdmin) {
      openAuthModal();
      return;
    }

    const toAdd: ClientLogo[] = INFLUENCER_SELECTED_PARTNERS.filter(
      (p) =>
        !existingClientIds.has(p.id.toLowerCase()) &&
        !existingClientNames.has(p.name.toLowerCase().trim())
    ).map((p) => ({
      id: p.id,
      name: p.name,
      logoUrl: p.logoUrl || '',
    }));

    if (toAdd.length > 0) {
      if (onAddMultiplePartners) {
        onAddMultiplePartners(toAdd);
      } else {
        toAdd.forEach((item) => onAddPartner?.(item));
      }
    }
    setShowAddModal(false);
  };

  // Create custom client partner
  const handleCreateCustomPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      openAuthModal();
      return;
    }

    const cleanName = sanitizeInput(newPartnerName);
    if (!cleanName) return;

    const finalLogo = getEffectiveLogo();

    const newEntry: ClientLogo = {
      id: `client-${Date.now()}`,
      name: cleanName,
      logoUrl: finalLogo,
      linkUrl: newPartnerLink.trim() || undefined,
      isCollaborator: newPartnerIsCollab,
      collaboratorRole: newPartnerIsCollab ? (newPartnerCollabRole.trim() || 'Brand Collaborator') : undefined,
    };

    onAddPartner?.(newEntry);
    setNewPartnerName('');
    setLogoDataUrl('');
    setLogoUrlInput('');
    setNewPartnerLink('');
    setNewPartnerIsCollab(false);
    setNewPartnerCollabRole('Brand Collaborator');
    setShowAddModal(false);
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Helper to match an influencer partner for authentic vector rendering
  const findMatchingInfluencerPartner = (client: ClientLogo) => {
    const canonicalId = resolveBrandId(client.id, client.name);
    return INFLUENCER_SELECTED_PARTNERS.find((p) => p.id === canonicalId);
  };

  const renderClientLogoGraphic = (client: ClientLogo, mode: 'grid' | 'ticker' = 'grid') => {
    // 1. If custom user-uploaded logo (data URL or regular URL/path), render that directly
    if (client.logoUrl && client.logoUrl.trim() !== '') {
      return (
        <img
          src={client.logoUrl}
          alt={client.name}
          className={
            mode === 'grid'
              ? 'max-h-12 max-w-[85%] object-contain rounded-lg'
              : 'h-8 max-w-[120px] object-contain rounded-lg'
          }
          loading="lazy"
        />
      );
    }

    // 2. Unify with PartnerLogoBadge so Client Ecosystem and Influencer Partners share the exact same rendering
    const matched = findMatchingInfluencerPartner(client);
    const partnerRepresentation: InfluencerPartnerWithSvg = {
      id: matched?.id || client.id,
      name: client.name || matched?.name || 'Partner',
      logoUrl: client.logoUrl || matched?.logoUrl || '',
      category: matched?.category || 'Client Partner',
      tagline: matched?.tagline || client.name,
      accentColor: matched?.accentColor || '#F9CE00',
    };

    return <PartnerLogoBadge partner={partnerRepresentation} mode={mode} />;
  };

  return (
    <section
      id="clients"
      className="py-16 sm:py-24 bg-[#0d0d0d] border-b border-neutral-800/80 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#F9CE00] block">
                Client Ecosystem
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight">
              Backed by the best.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 max-w-2xl">
              Enterprise brands, culture creators, and institutions that scale their cultural reach with Akaar.
            </p>
          </div>

          {/* Action & View Switcher Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Direct Add Brand Option - Only visible to Studio Owner / Admin, hidden from viewers */}
            {isAdmin && (
              <button
                id="client-ecosystem-add-brand-btn"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-syne font-black uppercase tracking-wider bg-[#F9CE00] hover:bg-white text-black transition-all shadow-md shadow-[#F9CE00]/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Brand</span>
              </button>
            )}

            {effectiveClients.length > 0 && (
              <>
                <button
                  id="client-view-marquee-btn"
                  onClick={() => setViewMode('marquee')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'marquee'
                      ? 'bg-[#F9CE00] text-black font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Ticker</span>
                </button>
                <button
                  id="client-view-grid-btn"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#F9CE00] text-black font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid ({effectiveClients.length})</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ADMIN-ONLY MANAGEMENT BAR: VISIBLE ONLY TO ADMIN                          */}
        {/* ========================================================================= */}
        {isAdmin && (
          <div
            id="client-ecosystem-admin-bar"
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-[#F9CE00]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-black/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F9CE00]/10 border border-[#F9CE00]/40 text-[#F9CE00] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-syne font-bold uppercase text-white tracking-wide">
                    Client Ecosystem Admin Manager
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F9CE00]/15 text-[#F9CE00] border border-[#F9CE00]/30">
                    <span>Studio Edit Mode</span>
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Manage client brand logos and names using curated brand libraries or upload custom brand logos.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto justify-end">
              {/* Pick from Brand Library */}
              <button
                id="admin-pick-influencer-partners-btn"
                onClick={() => {
                  setAddModalTab('influencer');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-syne font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-[#F9CE00]/60 transition-all shadow-sm"
              >
                <span>Pick from Brand Library</span>
              </button>

              {/* Upload Brand Logo & Name */}
              <button
                id="admin-add-custom-partner-btn"
                onClick={() => {
                  setAddModalTab('custom');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-syne font-black uppercase tracking-wider bg-[#F9CE00] hover:bg-white text-black transition-all shadow-md shadow-[#F9CE00]/20"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Upload Brand Logo &amp; Name</span>
              </button>

              {/* Clear All Brands */}
              {clients.length > 0 && (
                showClearConfirm ? (
                  <div className="flex items-center gap-1.5 bg-neutral-950 border border-red-500/50 rounded-full px-2.5 py-1">
                    <span className="text-[10px] text-red-400 font-mono">Remove all?</span>
                    <button
                      onClick={() => {
                        onClearAllPartners?.();
                        setShowClearConfirm(false);
                      }}
                      className="px-2 py-0.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-2 py-0.5 text-neutral-400 hover:text-white text-[10px]"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-1 px-3 py-2 rounded-full text-xs text-neutral-400 hover:text-red-400 bg-neutral-900 border border-neutral-800 hover:border-red-900/50 transition-all"
                    title="Remove all client brand logos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ZERO CLIENTS VIEW: SPLIT BY ADMIN vs. PUBLIC WEBSITE VIEWER               */}
      {/* ========================================================================= */}
      {effectiveClients.length === 0 ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {isAdmin ? (
            /* ADMIN ONBOARDING VIEW */
            <div
              id="client-ecosystem-onboarding-box"
              className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/90 text-center relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#F9CE00] flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Handshake className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-400 text-xs font-mono mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F9CE00]" />
                <span>Admin View: Add Brands to Client Ecosystem</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-syne font-black uppercase text-white tracking-tight mb-3">
                Build Your Client Ecosystem
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed mb-6">
                Choose from our pre-configured curated brand catalog (RedBull, Decathlon, Converse, boAt, Puma, Apple, Spotify, etc.) or upload your own custom brand logos and names.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="onboarding-pick-influencer-btn"
                  onClick={() => {
                    setAddModalTab('influencer');
                    setShowAddModal(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-syne font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-neutral-700 hover:border-[#F9CE00]"
                >
                  <span>Pick from Brand Library (30)</span>
                </button>

                <button
                  id="onboarding-add-custom-btn"
                  onClick={() => {
                    setAddModalTab('custom');
                    setShowAddModal(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F9CE00]/10"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Upload Brand Logo &amp; Name</span>
                </button>
              </div>
            </div>
          ) : (
            /* PUBLIC VISITOR VIEW */
            <div
              id="client-ecosystem-visitor-box"
              className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/90 text-center relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-[#F9CE00] flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Handshake className="w-7 h-7" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[#F9CE00] text-xs font-mono mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F9CE00]" />
                <span>Simple &amp; Direct Collaborations</span>
              </div>

              <h3 className="text-xl sm:text-3xl font-syne font-black uppercase text-white tracking-tight mb-3">
                Partner With Akaar Agency
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
                Whether you&apos;re an ambitious local brand, a growing startup, or an established business looking for fresh creative ideas, we&apos;d love to work together. We help businesses create standout campaigns, social content, and experiences that actually connect with real people.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="client-explore-partner-page-btn"
                  onClick={onOpenPartnerPage}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F9CE00]/10"
                >
                  <span>Explore Partnership Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="client-partner-inquire-btn"
                  onClick={onOpenContact}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-neutral-900 text-white border border-neutral-800 hover:border-neutral-700 text-xs font-syne font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Quick Message</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : viewMode === 'marquee' ? (
        /* INFINITE MARQUEE MODE */
        <div className="space-y-6 relative z-10">
          <div className="relative w-full overflow-hidden select-none py-4 border-y border-neutral-800/50 bg-neutral-950/60 backdrop-blur-sm">
            <div className="animate-marquee-infinite flex items-center gap-8 sm:gap-12">
              {marqueeClients.map((client, index) => (
                <div
                  key={`marquee-${client.id}-${index}`}
                  className="flex items-center justify-center h-16 shrink-0 px-6 py-2 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-[#F9CE00]/60 transition-all cursor-pointer group"
                  title={client.name}
                >
                  <div className="h-10 w-32 flex items-center justify-center">
                    {renderClientLogoGraphic(client, 'ticker')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* GRID MODE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {effectiveClients.map((client) => (
              <div
                key={client.id}
                id={`client-card-${client.id}`}
                className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#F9CE00]/60 hover:bg-neutral-900/90 transition-all duration-300 h-[164px] w-full overflow-hidden box-border"
              >
                {/* Delete button on hover - ADMIN ONLY */}
                {isAdmin && onDeletePartner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePartner(client.id);
                    }}
                    title="Remove partner"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-neutral-950/90 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Collaborator Badge & Link */}
                {(client.isCollaborator || client.linkUrl) && (
                  <div className="w-full flex items-center justify-between px-1 mb-0.5 z-10">
                    {client.isCollaborator ? (
                      <span className="text-[9px] font-mono font-bold text-[#F9CE00] bg-[#F9CE00]/15 px-1.5 py-0.5 rounded border border-[#F9CE00]/30 truncate max-w-[75%]">
                        {client.collaboratorRole || 'Collaborator'}
                      </span>
                    ) : <span />}
                    {client.linkUrl && (
                      <a
                        href={client.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-500 hover:text-[#F9CE00] transition-colors p-0.5 ml-auto"
                        title="Open brand website"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Logo Stage */}
                <div className="w-full flex-1 flex items-center justify-center p-2 overflow-hidden">
                  {renderClientLogoGraphic(client, 'grid')}
                </div>

                {/* Brand Name - Isolated bottom compartment */}
                <div className="w-full pt-2.5 pb-0.5 border-t border-neutral-800/70 text-center overflow-hidden">
                  <span
                    className="text-xs font-syne font-bold text-neutral-200 group-hover:text-white transition-colors leading-tight line-clamp-2 w-full px-1 break-words"
                    title={client.name}
                  >
                    {client.name}
                  </span>
                </div>
              </div>
            ))}

            {/* Add Brand Action Card - ONLY VISIBLE TO ADMIN, HIDDEN FROM VIEWERS */}
            {isAdmin && (
              <div
                id="client-grid-add-brand-card"
                onClick={() => setShowAddModal(true)}
                className="group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 border-dashed border-neutral-800 hover:border-[#F9CE00] bg-neutral-900/30 hover:bg-[#F9CE00]/5 transition-all duration-300 h-[164px] w-full cursor-pointer text-center select-none"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 group-hover:border-[#F9CE00] flex items-center justify-center text-neutral-400 group-hover:text-[#F9CE00] mb-2 transition-colors">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-syne font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white">
                  Add Brand
                </span>
                <span className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  + Logo &amp; Name
                </span>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenPartnerPage}
              className="inline-flex items-center gap-2 text-xs font-syne font-bold uppercase tracking-wider text-neutral-400 hover:text-[#F9CE00] transition-colors"
            >
              <span>Interested in partnering with us?</span>
              <span className="underline underline-offset-4 text-[#F9CE00]">Learn how we collaborate</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F9CE00]" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD BRAND MODAL: BRAND LIBRARY (30) + UPLOAD CUSTOM BRAND LOGO & NAME     */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-7 max-w-2xl w-full relative shadow-2xl max-h-[92vh] flex flex-col text-left">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#F9CE00]">
                    Client Ecosystem
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#F9CE00]/10 text-[#F9CE00] border border-[#F9CE00]/20">
                    Add Brand Partner
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-syne font-black uppercase text-white tracking-tight">
                  Add Brand to Client Ecosystem
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Pick from the 30 popular curated brands or upload any custom brand logo &amp; name.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 pt-3 pb-3 border-b border-neutral-800/80">
              <button
                onClick={() => setAddModalTab('influencer')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all ${
                  addModalTab === 'influencer'
                    ? 'bg-[#F9CE00] text-black shadow-md shadow-[#F9CE00]/20'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <span>Pick from Brand Library ({INFLUENCER_SELECTED_PARTNERS.length})</span>
              </button>

              <button
                onClick={() => setAddModalTab('custom')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all ${
                  addModalTab === 'custom'
                    ? 'bg-[#F9CE00] text-black shadow-md shadow-[#F9CE00]/20'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Upload Brand Logo &amp; Name</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
              {/* ---------------------------------------------------- */}
              {/* TAB 1: PICK FROM BRAND LIBRARY                       */}
              {/* ---------------------------------------------------- */}
              {addModalTab === 'influencer' && (
                <div className="space-y-4">
                  {/* Search and Bulk Controls */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search brand by name (e.g. RedBull, Decathlon, BoAt, Puma, Apple, Spotify)..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#F9CE00]"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={handleAddAllInfluencerPartners}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-[#F9CE00] text-neutral-200 hover:text-black font-syne font-bold text-xs uppercase tracking-wider transition-all border border-neutral-700 flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add All 30 Brands</span>
                    </button>
                  </div>

                  {/* Partner Brand Selection Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {filteredInfluencerPartners.map((partner) => {
                      const isAdded =
                        existingClientIds.has(partner.id.toLowerCase()) ||
                        existingClientNames.has(partner.name.toLowerCase().trim());

                      return (
                        <div
                          key={partner.id}
                          onClick={() => handleToggleInfluencerPartner(partner)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between items-center text-center relative group select-none ${
                            isAdded
                              ? 'bg-[#F9CE00]/10 border-[#F9CE00] shadow-md shadow-[#F9CE00]/10'
                              : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950'
                          }`}
                        >
                          {/* Top Status Pill */}
                          <div className="w-full flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider truncate max-w-[70%] text-left">
                              {partner.badge || 'Brand Partner'}
                            </span>
                            {isAdded ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#F9CE00] bg-[#F9CE00]/20 px-1.5 py-0.5 rounded-full">
                                <Check className="w-2.5 h-2.5" /> Added
                              </span>
                            ) : (
                              <span className="text-[9px] text-neutral-500 group-hover:text-white font-mono">
                                + Add
                              </span>
                            )}
                          </div>

                          {/* Logo Graphic */}
                          <div className="w-full h-12 flex items-center justify-center my-1 px-2">
                            <BrandVectorLogo
                              partnerId={partner.id}
                              name={partner.name}
                              accentColor={partner.accentColor}
                              mode="grid"
                            />
                          </div>

                          {/* Brand Name */}
                          <div className="w-full pt-1.5 border-t border-neutral-800/80">
                            <span className="text-xs font-syne font-bold text-white block truncate">
                              {partner.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-neutral-500 italic">
                    Click any brand to instantly add or remove it from your Client Ecosystem. Added brands will display with their authentic vector logos.
                  </p>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* TAB 2: UPLOAD CUSTOM BRAND LOGO & NAME               */}
              {/* ---------------------------------------------------- */}
              {addModalTab === 'custom' && (
                <form onSubmit={handleCreateCustomPartner} className="space-y-4">
                  {/* Brand Name */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      placeholder="e.g. Nike, Apple, Tata Motors, Red Bull, Spotify..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  {/* Logo Input Method Tabs */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">
                      Logo Source
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setLogoInputType('upload')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          logoInputType === 'upload'
                            ? 'bg-[#F9CE00] text-black font-bold'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputType('url')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          logoInputType === 'url'
                            ? 'bg-[#F9CE00] text-black font-bold'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Image Link</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputType('monogram')}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                          logoInputType === 'monogram'
                            ? 'bg-[#F9CE00] text-black font-bold'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Vector Mark</span>
                      </button>
                    </div>

                    {/* Upload Zone */}
                    {logoInputType === 'upload' && (
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/png, image/jpeg, image/svg+xml, image/webp"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] && handleFileChange(e.target.files[0])
                          }
                        />
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-[#F9CE00] bg-[#F9CE00]/10'
                              : logoDataUrl
                              ? 'border-emerald-500/50 bg-emerald-500/5'
                              : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950'
                          }`}
                        >
                          {logoDataUrl ? (
                            <div className="flex flex-col items-center">
                              <img
                                src={logoDataUrl}
                                alt="Preview"
                                className="max-h-14 max-w-[80%] object-contain mb-2"
                              />
                              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Image uploaded successfully
                              </span>
                              <span className="text-[10px] text-neutral-500 mt-1">
                                Click or drag another image to replace
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="w-7 h-7 text-neutral-500 mb-2" />
                              <span className="text-xs text-neutral-300 font-medium">
                                Drag &amp; drop brand logo here or{' '}
                                <span className="text-[#F9CE00] underline">browse</span>
                              </span>
                              <span className="text-[10px] text-neutral-500 mt-1">
                                Supports PNG, SVG, JPG, WebP with transparency
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* URL Input */}
                    {logoInputType === 'url' && (
                      <div>
                        <input
                          type="text"
                          value={logoUrlInput}
                          onChange={(e) => setLogoUrlInput(e.target.value)}
                          placeholder="https://example.com/brand-logo.png"
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#F9CE00]"
                        />
                        <p className="text-[10px] text-neutral-500 mt-1">
                          Tip: For best reliability, direct file upload above is recommended.
                        </p>
                      </div>
                    )}

                    {/* Monogram Color Options */}
                    {logoInputType === 'monogram' && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-neutral-400 block">
                          Accent Color:
                        </span>
                        <div className="flex gap-2">
                          {['#F9CE00', '#0082C3', '#ED1C24', '#10B981', '#8B5CF6', '#FFFFFF'].map(
                            (color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setBrandColor(color)}
                                style={{ backgroundColor: color }}
                                className={`w-7 h-7 rounded-full transition-transform ${
                                  brandColor === color
                                    ? 'scale-125 ring-2 ring-white'
                                    : 'opacity-70 hover:opacity-100'
                                }`}
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collaborator Option & Link */}
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-syne font-bold text-white block">
                          Collaborator Option
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          Mark this brand as a featured creative or media collaborator
                        </span>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={newPartnerIsCollab}
                          onChange={(e) => setNewPartnerIsCollab(e.target.checked)}
                          className="w-4 h-4 accent-[#F9CE00] rounded"
                        />
                        <span className="text-xs font-mono font-bold text-[#F9CE00]">Collaborator</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                          Brand Website / Collaborator Link
                        </label>
                        <input
                          type="text"
                          value={newPartnerLink}
                          onChange={(e) => setNewPartnerLink(e.target.value)}
                          placeholder="https://brand.com"
                          className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F9CE00] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                          Collaborator Role / Tag
                        </label>
                        <input
                          type="text"
                          value={newPartnerCollabRole}
                          onChange={(e) => setNewPartnerCollabRole(e.target.value)}
                          disabled={!newPartnerIsCollab}
                          placeholder="e.g. Creative Partner"
                          className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-neutral-600 disabled:opacity-40 focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Card Alignment Preview */}
                  <div className="pt-2">
                    <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                      Live Card Alignment Preview
                    </label>
                    <div className="flex justify-center p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <div className="w-36 h-[160px] rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between items-center p-3.5 text-center overflow-hidden">
                        <div className="w-full flex-1 flex items-center justify-center p-1 overflow-hidden">
                          <img
                            src={getEffectiveLogo()}
                            alt="Preview"
                            className="max-h-10 max-w-[85%] object-contain"
                          />
                        </div>
                        <div className="w-full pt-2 pb-0.5 border-t border-neutral-800 text-center overflow-hidden">
                          <span className="text-xs font-syne font-bold text-white block truncate">
                            {newPartnerName.trim() || 'Brand Name'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-full text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newPartnerName.trim()}
                      className="px-6 py-2.5 rounded-full bg-[#F9CE00] disabled:opacity-40 text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md shadow-[#F9CE00]/10"
                    >
                      Save Brand Partner
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>{clients.length} brands currently in ecosystem</span>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
