import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  Download,
  Copy,
  Check,
  Video,
  Type,
  Briefcase,
  MessageSquare,
  Mail,
  ExternalLink,
  RefreshCw,
  Trash2,
  Users,
  Handshake,
  Plus,
  Search,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Edit3,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Globe,
  Sliders,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { AgencyData, ClientLogo, InfluencerPartner, CaseStudy, PortfolioMediaItem } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { INFLUENCER_SELECTED_PARTNERS } from '../data/influencerPartnersData';
import { PartnerLogoBadge } from './PartnerLogoBadge';
import { AkaarBrandLogo } from './AkaarBrandLogo';

export type LiveEditorTab =
  | 'branding'
  | 'media'
  | 'cases'
  | 'clients'
  | 'influencers'
  | 'hero'
  | 'brands'
  | 'testimonials'
  | 'subscribers';

interface LiveEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgencyData;
  onUpdateData: (newData: AgencyData) => void;
  onResetData: () => void;
  initialTab?: LiveEditorTab;
}

export const LiveEditorDrawer: React.FC<LiveEditorDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
  onResetData,
  initialTab = 'cases',
}) => {
  const { isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<LiveEditorTab>(initialTab);

  // Sync initialTab when opened
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form State: Add New Video / Project
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoClient, setNewVideoClient] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoPoster, setNewVideoPoster] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Commercial Production');
  const [newVideoTags, setNewVideoTags] = useState('Creative Strategy, Production, VFX');
  const [newVideoCollaboratorName, setNewVideoCollaboratorName] = useState('');
  const [newVideoCollaboratorLink, setNewVideoCollaboratorLink] = useState('');
  const [newVideoSummary, setNewVideoSummary] = useState('');
  const [newVideoMetric1, setNewVideoMetric1] = useState('+240%');
  const [newVideoLabel1, setNewVideoLabel1] = useState('Engagement');
  const [newVideoMetric2, setNewVideoMetric2] = useState('14M');
  const [newVideoLabel2, setNewVideoLabel2] = useState('Impressions');

  // Video edit state
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoSearch, setVideoSearch] = useState('');

  // Form State: Add Brand
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [newBrandLink, setNewBrandLink] = useState('');
  const [newBrandIsCollab, setNewBrandIsCollab] = useState(false);
  const [newBrandCollabRole, setNewBrandCollabRole] = useState('Brand Partner');
  const [brandSearch, setBrandSearch] = useState('');
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

  // Form State: Add Influencer
  const [newInfName, setNewInfName] = useState('');
  const [newInfLogo, setNewInfLogo] = useState('');
  const [newInfLink, setNewInfLink] = useState('');
  const [newInfIsCollab, setNewInfIsCollab] = useState(true);
  const [newInfCollabRole, setNewInfCollabRole] = useState('Creator Collaborator');
  const [newInfCategory, setNewInfCategory] = useState('Sports & Outdoors');
  const [newInfTagline, setNewInfTagline] = useState('Cultural Storyteller • Creator Squad');
  const [infSearch, setInfSearch] = useState('');
  const [editingInfId, setEditingInfId] = useState<string | null>(null);

  // General state
  const [copied, setCopied] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [briefs, setBriefs] = useState<any[]>([]);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [testingPing, setTestingPing] = useState(false);

  const videoPosterFileRef = useRef<HTMLInputElement>(null);
  const brandLogoFileRef = useRef<HTMLInputElement>(null);
  const infPhotoFileRef = useRef<HTMLInputElement>(null);
  const agencyLogoFileRef = useRef<HTMLInputElement>(null);
  const heroImageFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  // Media Tab Management State
  const mediaUploadFileRef = useRef<HTMLInputElement>(null);
  const mediaReplaceFileRef = useRef<HTMLInputElement>(null);
  const [mediaUploadDestination, setMediaUploadDestination] = useState<'case_project' | 'gallery_visual' | 'assign_existing'>('case_project');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaClient, setNewMediaClient] = useState('');
  const [newMediaImageUrl, setNewMediaImageUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('Content Production');
  const [newMediaTags, setNewMediaTags] = useState('Creative Strategy, Visuals, Film');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [mediaAssignCaseId, setMediaAssignCaseId] = useState('');
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaFilterTab, setMediaFilterTab] = useState<'all' | 'cases' | 'gallery'>('all');
  const [editingMediaTarget, setEditingMediaTarget] = useState<{ id: string; type: 'case' | 'gallery' } | null>(null);
  const [editMediaTitle, setEditMediaTitle] = useState('');
  const [editMediaClient, setEditMediaClient] = useState('');
  const [editMediaCategory, setEditMediaCategory] = useState('');
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [domainNotice, setDomainNotice] = useState<string | null>(null);
  const [mediaCopiedUrl, setMediaCopiedUrl] = useState<string | null>(null);
  const [mediaReplaceTarget, setMediaReplaceTarget] = useState<{ id: string; type: 'case' | 'gallery' } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStorageData();
    }
  }, [isOpen]);

  if (!isOpen || !isAdmin) return null;

  const loadStorageData = () => {
    try {
      const subRaw = localStorage.getItem('akaar_newsletter_subscribers');
      if (subRaw) setSubscribers(JSON.parse(subRaw));
      const briefRaw = localStorage.getItem('akaar_contact_briefs');
      if (briefRaw) setBriefs(JSON.parse(briefRaw));
    } catch (e) {
      console.error(e);
    }
  };

  // Helper file upload reader
  const handleFileUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // MEDIA TAB HANDLERS & COMPUTED LIST
  // ==========================================
  const allPortfolioImages = [
    ...(data.caseStudies || []).map((cs) => ({
      id: cs.id,
      title: cs.title,
      client: cs.client,
      category: cs.category,
      imageUrl: cs.posterUrl,
      type: 'case' as const,
      tags: cs.tags || [],
      summary: cs.summary,
      featured: cs.featured,
    })),
    ...(data.portfolioGallery || []).map((mg) => ({
      id: mg.id,
      title: mg.title,
      client: mg.client || 'Portfolio Artwork',
      category: mg.category,
      imageUrl: mg.imageUrl,
      type: 'gallery' as const,
      tags: mg.tags || [],
      summary: mg.caption,
      featured: mg.featured,
    })),
  ];

  const handlePublishNewMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaImageUrl.trim()) {
      setMediaNotice('⚠️ Please upload or paste an image URL first.');
      return;
    }

    const title = newMediaTitle.trim() || 'Visual Campaign Work';
    const client = newMediaClient.trim() || 'Akaar Studio';
    const category = newMediaCategory.trim() || 'Content Production';
    const tags = newMediaTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (mediaUploadDestination === 'case_project') {
      const newStudy: CaseStudy = {
        id: `case-${Date.now()}`,
        title,
        client,
        category,
        tags: tags.length > 0 ? tags : ['Creative Strategy', 'Visuals'],
        summary: newMediaCaption.trim() || `Visual artwork and portfolio showcase developed for ${client}.`,
        challenge: 'Elevating aesthetic storytelling and visual brand presence across modern digital channels.',
        solution: 'Bespoke creative direction, premium art direction, and high-impact still visuals.',
        results: [
          { metric: '+260%', label: 'Visual Engagement' },
          { metric: '10M+', label: 'Organic Impressions' },
        ],
        posterUrl: newMediaImageUrl.trim(),
        featured: true,
        year: new Date().getFullYear().toString(),
      };

      const updatedCases = [newStudy, ...(data.caseStudies || [])];
      onUpdateData({
        ...data,
        caseStudies: updatedCases,
      });
      setMediaNotice(`✅ Published "${title}" as a new project card to the portfolio!`);
    } else if (mediaUploadDestination === 'gallery_visual') {
      const newGalleryItem: PortfolioMediaItem = {
        id: `media-${Date.now()}`,
        title,
        client,
        category,
        imageUrl: newMediaImageUrl.trim(),
        tags,
        caption: newMediaCaption.trim(),
        featured: true,
        year: new Date().getFullYear().toString(),
      };

      const updatedGallery = [newGalleryItem, ...(data.portfolioGallery || [])];
      onUpdateData({
        ...data,
        portfolioGallery: updatedGallery,
      });
      setMediaNotice(`✅ Added "${title}" to the portfolio visual media gallery!`);
    } else if (mediaUploadDestination === 'assign_existing' && mediaAssignCaseId) {
      const targetCase = data.caseStudies?.find((c) => c.id === mediaAssignCaseId);
      if (targetCase) {
        const updatedCases = (data.caseStudies || []).map((cs) => {
          if (cs.id === mediaAssignCaseId) {
            return {
              ...cs,
              posterUrl: newMediaImageUrl.trim(),
              galleryImages: [newMediaImageUrl.trim(), ...(cs.galleryImages || [])],
            };
          }
          return cs;
        });
        onUpdateData({
          ...data,
          caseStudies: updatedCases,
        });
        setMediaNotice(`✅ Updated poster for project "${targetCase.title}" with new image!`);
      }
    }

    // Reset form
    setNewMediaTitle('');
    setNewMediaClient('');
    setNewMediaImageUrl('');
    setNewMediaCaption('');
    setTimeout(() => setMediaNotice(null), 5000);
  };

  const handleExecuteMediaReplace = (newUrl: string) => {
    if (!mediaReplaceTarget || !newUrl) return;

    if (mediaReplaceTarget.type === 'case') {
      const updatedCases = (data.caseStudies || []).map((cs) => {
        if (cs.id === mediaReplaceTarget.id) {
          return { ...cs, posterUrl: newUrl };
        }
        return cs;
      });
      onUpdateData({ ...data, caseStudies: updatedCases });
      setMediaNotice('✅ Portfolio project poster image replaced successfully!');
    } else {
      const updatedGallery = (data.portfolioGallery || []).map((mg) => {
        if (mg.id === mediaReplaceTarget.id) {
          return { ...mg, imageUrl: newUrl };
        }
        return mg;
      });
      onUpdateData({ ...data, portfolioGallery: updatedGallery });
      setMediaNotice('✅ Visual gallery image replaced successfully!');
    }
    setMediaReplaceTarget(null);
    setTimeout(() => setMediaNotice(null), 4000);
  };

  const handleDeleteMedia = (id: string, type: 'case' | 'gallery') => {
    if (type === 'case') {
      if (confirm('Are you sure you want to remove this project card from the portfolio?')) {
        const updatedCases = (data.caseStudies || []).filter((cs) => cs.id !== id);
        onUpdateData({ ...data, caseStudies: updatedCases });
        setMediaNotice('Project removed from portfolio.');
      }
    } else {
      if (confirm('Are you sure you want to delete this image from the visual gallery?')) {
        const updatedGallery = (data.portfolioGallery || []).filter((mg) => mg.id !== id);
        onUpdateData({ ...data, portfolioGallery: updatedGallery });
        setMediaNotice('Image removed from media gallery.');
      }
    }
    setTimeout(() => setMediaNotice(null), 4000);
  };

  const handleSetHeroFromMedia = (url: string) => {
    onUpdateData({
      ...data,
      hero: {
        ...data.hero,
        heroImageUrl: url,
      },
    });
    setMediaNotice('🌟 Set image as homepage Hero background!');
    setTimeout(() => setMediaNotice(null), 4000);
  };

  const handleSaveMediaEdit = () => {
    if (!editingMediaTarget) return;
    if (editingMediaTarget.type === 'case') {
      const updated = (data.caseStudies || []).map((cs) => {
        if (cs.id === editingMediaTarget.id) {
          return {
            ...cs,
            title: editMediaTitle || cs.title,
            client: editMediaClient || cs.client,
            category: editMediaCategory || cs.category,
          };
        }
        return cs;
      });
      onUpdateData({ ...data, caseStudies: updated });
    } else {
      const updated = (data.portfolioGallery || []).map((mg) => {
        if (mg.id === editingMediaTarget.id) {
          return {
            ...mg,
            title: editMediaTitle || mg.title,
            client: editMediaClient || mg.client,
            category: editMediaCategory || mg.category,
          };
        }
        return mg;
      });
      onUpdateData({ ...data, portfolioGallery: updated });
    }
    setEditingMediaTarget(null);
    setMediaNotice('✅ Project information updated.');
    setTimeout(() => setMediaNotice(null), 4000);
  };

  // ==========================================
  // VIDEOS HANDLERS
  // ==========================================
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoClient.trim()) return;

    const newStudy: CaseStudy = {
      id: `case-${Date.now()}`,
      title: newVideoTitle.trim(),
      client: newVideoClient.trim(),
      category: newVideoCategory.trim() || 'Production',
      tags: newVideoTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      summary:
        newVideoSummary.trim() ||
        `High-impact video campaign crafted for ${newVideoClient.trim()}.`,
      challenge: 'Capturing Gen Z attention with cultural relevance and high retention.',
      solution: 'A fast-paced, high-aesthetic video production with sound design.',
      results: [
        { metric: newVideoMetric1 || '+180%', label: newVideoLabel1 || 'Engagement' },
        { metric: newVideoMetric2 || '8.5M', label: newVideoLabel2 || 'Impressions' },
      ],
      posterUrl:
        newVideoPoster.trim() ||
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=80',
      videoUrl: newVideoUrl.trim() || undefined,
      collaboratorName: newVideoCollaboratorName.trim() || undefined,
      collaboratorLink: newVideoCollaboratorLink.trim() || undefined,
      featured: true,
      year: `${new Date().getFullYear()}`,
    };

    onUpdateData({
      ...data,
      caseStudies: [newStudy, ...(data.caseStudies || [])],
    });

    // Reset inputs
    setNewVideoTitle('');
    setNewVideoClient('');
    setNewVideoUrl('');
    setNewVideoPoster('');
    setNewVideoCollaboratorName('');
    setNewVideoCollaboratorLink('');
    setNewVideoSummary('');
  };

  const handleDeleteVideo = (id: string) => {
    onUpdateData({
      ...data,
      caseStudies: (data.caseStudies || []).filter((s) => s.id !== id),
    });
  };

  const handleUpdateExistingVideo = (id: string, updates: Partial<CaseStudy>) => {
    onUpdateData({
      ...data,
      caseStudies: (data.caseStudies || []).map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  // ==========================================
  // BRANDS HANDLERS
  // ==========================================
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const matched = INFLUENCER_SELECTED_PARTNERS.find(
      (p) => p.name.toLowerCase() === newBrandName.trim().toLowerCase()
    );

    const newBrand: ClientLogo = {
      id: matched ? matched.id : `client-${Date.now()}`,
      name: newBrandName.trim(),
      logoUrl: newBrandLogo.trim() || (matched ? matched.logoUrl || '' : ''),
      linkUrl: newBrandLink.trim() || undefined,
      isCollaborator: newBrandIsCollab,
      collaboratorRole: newBrandIsCollab
        ? newBrandCollabRole.trim() || 'Brand Partner'
        : undefined,
    };

    onUpdateData({
      ...data,
      clients: [...(data.clients || []), newBrand],
    });

    setNewBrandName('');
    setNewBrandLogo('');
    setNewBrandLink('');
    setNewBrandIsCollab(false);
  };

  const handleDeleteBrand = (id: string) => {
    onUpdateData({
      ...data,
      clients: (data.clients || []).filter((c) => c.id !== id),
    });
  };

  const handleUpdateExistingBrand = (id: string, updates: Partial<ClientLogo>) => {
    onUpdateData({
      ...data,
      clients: (data.clients || []).map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const handleImportAllBrands = () => {
    const existingIds = new Set((data.clients || []).map((c) => c.id.toLowerCase()));
    const toAdd: ClientLogo[] = INFLUENCER_SELECTED_PARTNERS.filter(
      (p) => !existingIds.has(p.id.toLowerCase())
    ).map((p) => ({
      id: p.id,
      name: p.name,
      logoUrl: p.logoUrl || '',
    }));

    onUpdateData({
      ...data,
      clients: [...(data.clients || []), ...toAdd],
    });
  };

  // ==========================================
  // INFLUENCERS HANDLERS
  // ==========================================
  const currentInfluencers =
    data.influencerPartners && data.influencerPartners.length > 0
      ? data.influencerPartners
      : INFLUENCER_SELECTED_PARTNERS;

  const handleAddInfluencer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInfName.trim()) return;

    const newPartner: InfluencerPartner = {
      id: `inf-${Date.now()}`,
      name: newInfName.trim(),
      category: newInfCategory,
      badge: newInfCollabRole || 'Featured Creator',
      tagline: newInfTagline.trim() || 'Culture Storyteller',
      logoUrl: newInfLogo.trim() || '',
      linkUrl: newInfLink.trim() || undefined,
      isCollaborator: newInfIsCollab,
      collaboratorRole: newInfIsCollab ? newInfCollabRole.trim() : undefined,
    };

    onUpdateData({
      ...data,
      influencerPartners: [newPartner, ...currentInfluencers],
    });

    setNewInfName('');
    setNewInfLogo('');
    setNewInfLink('');
    setNewInfIsCollab(true);
    setNewInfTagline('Cultural Storyteller • Creator Squad');
  };

  const handleDeleteInfluencer = (id: string) => {
    onUpdateData({
      ...data,
      influencerPartners: currentInfluencers.filter((p) => p.id !== id),
    });
  };

  const handleUpdateExistingInfluencer = (id: string, updates: Partial<InfluencerPartner>) => {
    onUpdateData({
      ...data,
      influencerPartners: currentInfluencers.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  const handleRestoreDefaultInfluencers = () => {
    onUpdateData({
      ...data,
      influencerPartners: INFLUENCER_SELECTED_PARTNERS,
    });
  };

  // ==========================================
  // EMAIL TEST PING
  // ==========================================
  const handleTestPing = async () => {
    setTestingPing(true);
    setTestStatus('Sending test ping to FormSubmit for akaar.entertainment@gmail.com...');
    try {
      const res = await fetch('https://formsubmit.co/ajax/akaar.entertainment@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: 'Akaar Agency - System Test Notification',
          _captcha: 'false',
          message: 'This is an inbox delivery test from your Akaar Agency website.',
          tested_at: new Date().toLocaleString(),
        }),
      });
      const resJson = await res.json().catch(() => null);
      if (resJson?.message && resJson.message.toLowerCase().includes('activation')) {
        setTestStatus(
          '⚠️ PENDING ACTIVATION: FormSubmit sent an activation email to akaar.entertainment@gmail.com. Please open Gmail and click "Activate Form" once.'
        );
      } else if (resJson?.success === 'true') {
        setTestStatus(
          '✓ SUCCESS: FormSubmit is active! Emails are being forwarded to akaar.entertainment@gmail.com.'
        );
      } else {
        setTestStatus(`Response: ${JSON.stringify(resJson || 'Ping dispatched')}`);
      }
    } catch (err: any) {
      setTestStatus(`Notice: ${err?.message || 'Check browser network & adblockers.'}`);
    } finally {
      setTestingPing(false);
    }
  };

  const handleHeroChange = (field: keyof AgencyData['hero'], value: string) => {
    onUpdateData({
      ...data,
      hero: {
        ...data.hero,
        [field]: value,
      },
    });
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'akaar-agency-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredVideos = (data.caseStudies || []).filter(
    (s) =>
      s.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      s.client.toLowerCase().includes(videoSearch.toLowerCase()) ||
      (s.collaboratorName &&
        s.collaboratorName.toLowerCase().includes(videoSearch.toLowerCase()))
  );

  const filteredBrands = (data.clients || []).filter((c) =>
    c.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredInfluencers = currentInfluencers.filter(
    (p) =>
      p.name.toLowerCase().includes(infSearch.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(infSearch.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative z-10 w-full max-w-2xl h-full bg-[#111] border-l border-neutral-800 flex flex-col shadow-2xl text-left"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00]" />
                <h3 className="font-syne font-black uppercase text-white text-base">
                  Studio Live Editor
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                  Studio Owner Mode
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload your agency logo, banner images, videos, and brands. Changes save instantly and viewers on the public website see them with editing disabled.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-800 bg-neutral-900/60 px-3 pt-2 gap-1 overflow-x-auto text-xs shrink-0">
            <button
              onClick={() => setActiveTab('branding')}
              id="editor-tab-branding-btn"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'branding'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Logo &amp; Brand</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              id="editor-tab-media-btn"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'media'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Media ({allPortfolioImages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cases')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'cases'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Videos ({data.caseStudies?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'clients'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Brands ({data.clients?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('influencers')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'influencers'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Influencers ({currentInfluencers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'hero'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Hero &amp; Reel</span>
            </button>

            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'brands'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>7 Divisions</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'testimonials'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'subscribers'
                  ? 'bg-[#111] text-[#F9CE00] border-t-2 border-[#F9CE00]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Mail &amp; Briefs</span>
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-xs">
            {/* ============================================================== */}
            {/* TAB: LOGO, IMAGES & BRAND SETTINGS (STUDIO OWNER ONLY)          */}
            {/* ============================================================== */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                {/* Agency Brand Logo Upload Card */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-[#F9CE00]/30 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#F9CE00]" />
                      <span>Agency Logo &amp; Identity</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 px-2 py-0.5 rounded">
                      Studio Exclusive
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Upload your agency's logo image (PNG, SVG, or JPG). This logo appears in the top navigation bar and footer across your website.
                  </p>

                  {/* Logo Preview with Theme Matcher Launch */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="w-24 h-16 rounded-lg bg-black border border-neutral-700 flex items-center justify-center p-2 overflow-hidden shrink-0">
                      <AkaarBrandLogo
                        logoUrl={data.brandSettings?.logoUrl}
                        logoText={data.brandSettings?.logoText}
                        agencySubtitle={data.brandSettings?.agencySubtitle}
                        logoTheme={data.brandSettings?.logoTheme}
                        logoIconStyle={data.brandSettings?.logoIconStyle}
                        logoGlow={data.brandSettings?.logoGlow}
                        logoAccentColor={data.brandSettings?.logoAccentColor}
                        logoFilter={data.brandSettings?.logoFilter}
                        size="md"
                        showSubtitle={false}
                        showEmblem={true}
                        showWordmark={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-syne font-bold text-white truncate">
                          {data.brandSettings?.logoText || 'AKAAR'}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F9CE00]/10 text-[#F9CE00] border border-[#F9CE00]/30 uppercase">
                          Theme: {data.brandSettings?.logoTheme || 'Gold'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        Harmonized with website aesthetic ({data.brandSettings?.logoAccentColor || '#F9CE00'})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('open-logo-theme-studio'));
                        }, 200);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F9CE00] text-black hover:bg-white text-xs font-syne font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      title="Open Logo Theme Studio"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Theme Studio</span>
                    </button>

                    {data.brandSettings?.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData({
                            ...data,
                            brandSettings: {
                              ...data.brandSettings,
                              logoUrl: '',
                              logoFilter: '',
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-700 transition-colors"
                        title="Remove custom logo image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* File Upload & URL input */}
                  <div>
                    <label className="block text-neutral-300 font-mono mb-1.5">
                      Upload Logo Image File (PNG, SVG, JPG, WebP)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={agencyLogoFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], (url) => {
                              onUpdateData({
                                ...data,
                                brandSettings: {
                                  ...data.brandSettings,
                                  logoUrl: url,
                                },
                              });
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        id="studio-upload-logo-file-btn"
                        onClick={() => agencyLogoFileRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Choose Logo Image</span>
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste direct image URL (https://...)"
                        value={data.brandSettings?.logoUrl || ''}
                        onChange={(e) => {
                          onUpdateData({
                            ...data,
                            brandSettings: {
                              ...data.brandSettings,
                              logoUrl: e.target.value,
                            },
                          });
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  {/* Agency Name & Subtitle inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-900">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">
                        Brand / Agency Name
                      </label>
                      <input
                        type="text"
                        value={data.brandSettings?.logoText || 'AKAAR'}
                        onChange={(e) => {
                          onUpdateData({
                            ...data,
                            brandSettings: {
                              ...data.brandSettings,
                              logoText: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                        placeholder="e.g. AKAAR"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">
                        Tagline / Subtitle
                      </label>
                      <input
                        type="text"
                        value={data.brandSettings?.agencySubtitle || 'Agency'}
                        onChange={(e) => {
                          onUpdateData({
                            ...data,
                            brandSettings: {
                              ...data.brandSettings,
                              agencySubtitle: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                        placeholder="e.g. Agency"
                      />
                    </div>
                  </div>

                  {/* Start Animation Preview Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id="preview-start-animation-btn"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          window.dispatchEvent(new CustomEvent('replay-start-animation'));
                        }, 250);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-xs font-syne font-bold text-neutral-200 uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
                      <span>Play Website Start Animation With Logo</span>
                    </button>
                  </div>
                </div>

                {/* Hero Background Banner Image Upload */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#F9CE00]" />
                      <span>Hero Header Background Image</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                      Visual Cover
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    Set a custom hero banner image for the website header. When set, this image appears in place of or fallback to the background video.
                  </p>

                  {/* Image Preview */}
                  {data.hero.heroImageUrl && (
                    <div className="relative rounded-xl overflow-hidden border border-neutral-800 h-32 bg-black">
                      <img
                        src={data.hero.heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateData({
                            ...data,
                            hero: {
                              ...data.hero,
                              heroImageUrl: '',
                            },
                          });
                        }}
                        className="absolute top-2 right-2 p-1 rounded-lg bg-black/80 hover:bg-red-950 text-neutral-300 hover:text-red-400 border border-neutral-700"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={heroImageFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], (url) => {
                            onUpdateData({
                              ...data,
                              hero: {
                                ...data.hero,
                                heroImageUrl: url,
                              },
                            });
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      id="studio-upload-hero-image-btn"
                      onClick={() => heroImageFileRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-[#F9CE00] hover:text-black text-neutral-200 font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border border-neutral-700 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Hero Image</span>
                    </button>
                    <input
                      type="text"
                      placeholder="Or enter direct image URL"
                      value={data.hero.heroImageUrl || ''}
                      onChange={(e) => {
                        onUpdateData({
                          ...data,
                          hero: {
                            ...data.hero,
                            heroImageUrl: e.target.value,
                          },
                        });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>
                </div>

                {/* Custom Web Address & Free Domain Branding */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#F9CE00]" />
                      <span>Custom Web Address &amp; Free Domain Branding</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      100% Free Forever
                    </span>
                  </div>

                  {domainNotice && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{domainNotice}</span>
                      </span>
                      <button onClick={() => setDomainNotice(null)} className="text-emerald-400 hover:text-white ml-2 text-xs font-mono">
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Active Domain Live Status Bar */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                        Live Custom Address Status:
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        CONNECTED &amp; ACTIVE (0 COST)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-neutral-800 text-xs font-mono">
                      <span className="text-emerald-400">🔒 https://</span>
                      <span className="text-white font-bold tracking-wide">
                        {data.brandSettings?.customDomain || 'akaaragency.com'}
                      </span>
                      <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        Free SSL Active
                      </span>
                    </div>

                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Your custom branded web address replaces any default host URL and is reflected live across the <strong>Navbar</strong>, <strong>Page Header Banner</strong>, <strong>Footer</strong>, and <strong>Metadata</strong>.
                    </p>
                  </div>

                  {/* Custom Domain Input & Quick Presets */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-neutral-300 font-mono text-xs mb-1 font-semibold">
                        Enter Your Custom Brand Web Address / Domain:
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-500 font-mono text-xs">
                          https://
                        </div>
                        <input
                          type="text"
                          value={data.brandSettings?.customDomain || ''}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
                            onUpdateData({
                              ...data,
                              brandSettings: {
                                ...data.brandSettings,
                                customDomain: cleaned,
                                isCustomDomainActive: true,
                              },
                            });
                          }}
                          placeholder="e.g. youragency.com or akaaragency.com"
                          className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                    </div>

                    {/* Quick 1-Click Free Subdomain Options */}
                    <div>
                      <span className="block text-[11px] font-mono text-neutral-400 mb-1.5">
                        Don't own a domain yet? Choose an Instant 100% Free Web Address (No purchase needed):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const brandSlug = (data.brandSettings?.logoText || 'akaar').toLowerCase().replace(/[^a-z0-9]/g, '');
                            const domain = `${brandSlug || 'mybrand'}.akaar.agency`;
                            onUpdateData({
                              ...data,
                              brandSettings: {
                                ...data.brandSettings,
                                customDomain: domain,
                                isCustomDomainActive: true,
                                showDomainBanner: true,
                              },
                            });
                            setDomainNotice(`Free branded web address set to https://${domain}!`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-300 text-[11px] font-mono transition-colors"
                        >
                          + {(data.brandSettings?.logoText || 'brand').toLowerCase()}.akaar.agency (Free)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const brandSlug = (data.brandSettings?.logoText || 'portfolio').toLowerCase().replace(/[^a-z0-9]/g, '');
                            const domain = `${brandSlug || 'studio'}.portfolio.free`;
                            onUpdateData({
                              ...data,
                              brandSettings: {
                                ...data.brandSettings,
                                customDomain: domain,
                                isCustomDomainActive: true,
                                showDomainBanner: true,
                              },
                            });
                            setDomainNotice(`Free branded web address set to https://${domain}!`);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-300 text-[11px] font-mono transition-colors"
                        >
                          + {(data.brandSettings?.logoText || 'studio').toLowerCase()}.portfolio.free (Free)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateData({
                              ...data,
                              brandSettings: {
                                ...data.brandSettings,
                                customDomain: 'akaaragency.com',
                                isCustomDomainActive: true,
                                showDomainBanner: true,
                              },
                            });
                            setDomainNotice('Restored official domain: https://akaaragency.com');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#F9CE00] hover:text-black border border-neutral-800 text-neutral-300 text-[11px] font-mono transition-colors"
                        >
                          + akaaragency.com (Default)
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons: Activate, Copy, Test, Toggle Banner */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const domain = data.brandSettings?.customDomain || 'akaaragency.com';
                          onUpdateData({
                            ...data,
                            brandSettings: {
                              ...data.brandSettings,
                              customDomain: domain,
                              isCustomDomainActive: true,
                              showDomainBanner: true,
                            },
                          });
                          setDomainNotice(`✅ Free Web Address https://${domain} is activated and connected with zero cost!`);
                        }}
                        className="flex-1 min-w-[160px] py-2 px-3 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Activate Free Web Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const domain = data.brandSettings?.customDomain || 'akaaragency.com';
                          navigator.clipboard.writeText(`https://${domain}`);
                          setDomainNotice(`📋 Copied https://${domain} to clipboard!`);
                          setTimeout(() => setDomainNotice(null), 3000);
                        }}
                        className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const domain = data.brandSettings?.customDomain || 'akaaragency.com';
                          window.open(`https://${domain}`, '_blank');
                        }}
                        className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit</span>
                      </button>
                    </div>

                    {/* Free DNS Setup Records Instructions Card */}
                    <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#F9CE00] font-bold flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          <span>Free DNS Connection Records (0 Cost):</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">Zero Charges</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Add either record at your DNS host (Cloudflare, GoDaddy, Namecheap, Vercel, or GitHub Pages) to route your domain for free:
                      </p>

                      <div className="space-y-1.5 font-mono text-[11px]">
                        <div className="p-2 rounded-lg bg-black/50 border border-neutral-850 flex items-center justify-between">
                          <span className="text-neutral-400">Type: <strong className="text-white">CNAME</strong> | Host: <strong className="text-white">@ or www</strong></span>
                          <span className="text-[#F9CE00]">cname.akaar.agency</span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/50 border border-neutral-850 flex items-center justify-between">
                          <span className="text-neutral-400">Type: <strong className="text-white">A Record</strong> | Host: <strong className="text-white">@</strong></span>
                          <span className="text-[#F9CE00]">76.76.21.21</span>
                        </div>
                      </div>
                      <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Free automatic SSL certificate provisioned with zero renewal costs.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: MEDIA & PORTFOLIO GALLERY                                 */}
            {/* ============================================================== */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                {/* Stats Overview Card */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#F9CE00]" />
                      <span>Portfolio Media &amp; Gallery Manager</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Live Gallery Sync
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Upload and manage high-resolution images, artworks, and project stills. Any photo or artwork added or replaced here is instantly reflected across the main portfolio gallery components on the website!
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-lg font-bold text-[#F9CE00]">{allPortfolioImages.length}</div>
                      <div className="text-[10px] text-neutral-400 uppercase">Total Media</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-lg font-bold text-white">{data.caseStudies?.length || 0}</div>
                      <div className="text-[10px] text-neutral-400 uppercase">Case Projects</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                      <div className="text-lg font-bold text-emerald-400">{data.portfolioGallery?.length || 0}</div>
                      <div className="text-[10px] text-neutral-400 uppercase">Visual Showcase</div>
                    </div>
                  </div>
                </div>

                {/* Media Notification Toast */}
                {mediaNotice && (
                  <div className="p-3 rounded-xl bg-[#F9CE00]/15 border border-[#F9CE00]/40 text-[#F9CE00] text-xs flex items-center justify-between font-mono">
                    <span>{mediaNotice}</span>
                    <button onClick={() => setMediaNotice(null)} className="text-white hover:text-[#F9CE00] text-xs">
                      ✕
                    </button>
                  </div>
                )}

                {/* Hidden File Input for Replace */}
                <input
                  type="file"
                  ref={mediaReplaceFileRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0], (url) => {
                        handleExecuteMediaReplace(url);
                      });
                    }
                  }}
                />

                {/* Upload & Publish Media Form */}
                <form
                  onSubmit={handlePublishNewMedia}
                  className="p-4 rounded-2xl bg-neutral-950 border border-[#F9CE00]/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Upload className="w-4 h-4 text-[#F9CE00]" />
                      <span>Upload New Image to Portfolio</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 px-2 py-0.5 rounded">
                      Instant Publish
                    </span>
                  </div>

                  {/* Destination Selector */}
                  <div>
                    <label className="block text-neutral-300 font-mono text-xs mb-1 font-semibold">
                      Publish Destination in Main Portfolio:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setMediaUploadDestination('case_project')}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                          mediaUploadDestination === 'case_project'
                            ? 'bg-[#F9CE00]/15 border-[#F9CE00] text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="font-syne uppercase text-[11px] text-[#F9CE00]">1. New Project Card</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">Creates a primary card in portfolio grid</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMediaUploadDestination('gallery_visual')}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                          mediaUploadDestination === 'gallery_visual'
                            ? 'bg-[#F9CE00]/15 border-[#F9CE00] text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="font-syne uppercase text-[11px] text-[#F9CE00]">2. Visual Showcase</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">Adds to media gallery showcase view</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaUploadDestination('assign_existing');
                          if (!mediaAssignCaseId && data.caseStudies?.[0]) {
                            setMediaAssignCaseId(data.caseStudies[0].id);
                          }
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                          mediaUploadDestination === 'assign_existing'
                            ? 'bg-[#F9CE00]/15 border-[#F9CE00] text-white font-bold'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="font-syne uppercase text-[11px] text-[#F9CE00]">3. Assign to Existing</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">Replaces poster of an existing project</div>
                      </button>
                    </div>
                  </div>

                  {/* If Assign Existing: Select Project */}
                  {mediaUploadDestination === 'assign_existing' && (
                    <div>
                      <label className="block text-neutral-300 font-mono text-xs mb-1">
                        Select Project to Assign this Image to:
                      </label>
                      <select
                        value={mediaAssignCaseId}
                        onChange={(e) => setMediaAssignCaseId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      >
                        {(data.caseStudies || []).map((cs) => (
                          <option key={cs.id} value={cs.id}>
                            {cs.title} ({cs.client})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Image Upload / Dropzone & URL Input */}
                  <div className="space-y-2">
                    <label className="block text-neutral-300 font-mono text-xs mb-1 font-semibold">
                      Choose Image File or Direct URL *
                    </label>

                    {/* Image Preview Box */}
                    {newMediaImageUrl && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black border border-neutral-700 max-h-52">
                        <img
                          src={newMediaImageUrl}
                          alt="Uploaded Media Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewMediaImageUrl('')}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-red-950 text-neutral-300 hover:text-red-400 border border-neutral-700"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F9CE00]">
                          Ready to Publish
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={mediaUploadFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            if (!newMediaTitle) {
                              setNewMediaTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                            }
                            handleFileUpload(file, (url) => {
                              setNewMediaImageUrl(url);
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        id="media-file-upload-btn"
                        onClick={() => mediaUploadFileRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-[#F9CE00] hover:text-black text-neutral-200 font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all border border-neutral-700 shrink-0"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste direct image URL (https://...)"
                        value={newMediaImageUrl}
                        onChange={(e) => setNewMediaImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-mono text-xs mb-1">
                        Image / Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Puma Nitro SS25 Campaign"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-mono text-xs mb-1">
                        Client / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Puma, Nike, Tyro, or Studio"
                        value={newMediaClient}
                        onChange={(e) => setNewMediaClient(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-mono text-xs mb-1">
                        Category
                      </label>
                      <select
                        value={newMediaCategory}
                        onChange={(e) => setNewMediaCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      >
                        <option value="Content Production">Content Production</option>
                        <option value="Creative Strategy">Creative Strategy</option>
                        <option value="Photography & Stills">Photography &amp; Stills</option>
                        <option value="3D & Visuals">3D &amp; Visuals</option>
                        <option value="PR & Social">PR &amp; Social</option>
                        <option value="Experiential">Experiential</option>
                        <option value="Brand Identity">Brand Identity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-mono text-xs mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Editorial, Print, Billboard"
                        value={newMediaTags}
                        onChange={(e) => setNewMediaTags(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono text-xs mb-1">
                      Caption / Short Summary
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief description of the visual work..."
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  <button
                    type="submit"
                    id="media-publish-submit-btn"
                    className="w-full py-3 px-4 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Publish Image to Main Portfolio Gallery</span>
                  </button>
                </form>

                {/* Portfolio Media Management Library */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#F9CE00]" />
                      <span>Manage Gallery Images ({allPortfolioImages.length})</span>
                    </span>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                      <button
                        onClick={() => setMediaFilterTab('all')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                          mediaFilterTab === 'all' ? 'bg-[#F9CE00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        All ({allPortfolioImages.length})
                      </button>
                      <button
                        onClick={() => setMediaFilterTab('cases')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                          mediaFilterTab === 'cases' ? 'bg-[#F9CE00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Projects ({data.caseStudies?.length || 0})
                      </button>
                      <button
                        onClick={() => setMediaFilterTab('gallery')}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] ${
                          mediaFilterTab === 'gallery' ? 'bg-[#F9CE00] text-black font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Visuals ({data.portfolioGallery?.length || 0})
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search gallery images by title, client, category..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  {/* Media Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {allPortfolioImages
                      .filter((item) => {
                        if (mediaFilterTab === 'cases' && item.type !== 'case') return false;
                        if (mediaFilterTab === 'gallery' && item.type !== 'gallery') return false;
                        if (mediaSearch.trim()) {
                          const q = mediaSearch.toLowerCase();
                          return (
                            item.title.toLowerCase().includes(q) ||
                            item.client.toLowerCase().includes(q) ||
                            item.category.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3 group"
                        >
                          {/* Image Thumbnail */}
                          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-neutral-900">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#F9CE00]">
                                {item.client}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-neutral-300">
                                {item.type === 'case' ? 'Project Card' : 'Visual Showcase'}
                              </span>
                            </div>
                          </div>

                          {/* Info & Edit Area */}
                          {editingMediaTarget?.id === item.id ? (
                            <div className="space-y-2 p-2 rounded-xl bg-neutral-900/90 border border-neutral-800">
                              <input
                                type="text"
                                value={editMediaTitle}
                                onChange={(e) => setEditMediaTitle(e.target.value)}
                                placeholder="Title"
                                className="w-full px-2 py-1 rounded bg-black border border-neutral-700 text-white text-xs font-mono"
                              />
                              <input
                                type="text"
                                value={editMediaClient}
                                onChange={(e) => setEditMediaClient(e.target.value)}
                                placeholder="Client"
                                className="w-full px-2 py-1 rounded bg-black border border-neutral-700 text-white text-xs font-mono"
                              />
                              <input
                                type="text"
                                value={editMediaCategory}
                                onChange={(e) => setEditMediaCategory(e.target.value)}
                                placeholder="Category"
                                className="w-full px-2 py-1 rounded bg-black border border-neutral-700 text-white text-xs font-mono"
                              />
                              <div className="flex gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleSaveMediaEdit}
                                  className="flex-1 py-1 rounded bg-[#F9CE00] text-black font-bold text-xs"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingMediaTarget(null)}
                                  className="px-3 py-1 rounded bg-neutral-800 text-neutral-400 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-syne font-bold text-xs text-white uppercase tracking-tight line-clamp-1">
                                    {item.title}
                                  </h4>
                                  <span className="text-[10px] text-neutral-400 font-mono">
                                    {item.category}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingMediaTarget({ id: item.id, type: item.type });
                                    setEditMediaTitle(item.title);
                                    setEditMediaClient(item.client);
                                    setEditMediaCategory(item.category);
                                  }}
                                  className="p-1 rounded bg-neutral-900 text-neutral-400 hover:text-white"
                                  title="Edit title & metadata"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Quick Action Buttons */}
                          <div className="pt-2 border-t border-neutral-900 flex items-center justify-between gap-1 text-[11px] font-mono">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaReplaceTarget({ id: item.id, type: item.type });
                                mediaReplaceFileRef.current?.click();
                              }}
                              className="px-2 py-1 rounded bg-neutral-900 hover:bg-[#F9CE00] hover:text-black text-neutral-300 transition-colors flex items-center gap-1"
                              title="Replace this image with a new uploaded photo"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Replace</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSetHeroFromMedia(item.imageUrl)}
                              className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
                              title="Set as Hero background"
                            >
                              <Sparkles className="w-3 h-3 text-[#F9CE00]" />
                              <span>Hero</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.imageUrl);
                                setMediaCopiedUrl(item.id);
                                setTimeout(() => setMediaCopiedUrl(null), 2500);
                              }}
                              className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                              title="Copy Image URL"
                            >
                              {mediaCopiedUrl === item.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(item.id, item.type)}
                              className="p-1 rounded bg-neutral-900 hover:bg-red-950 text-neutral-500 hover:text-red-400 transition-colors"
                              title="Delete from portfolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: VIDEOS & CASE STUDIES                                     */}
            {/* ============================================================== */}
            {activeTab === 'cases' && (
              <div className="space-y-6">
                {/* Add Video Form Card */}
                <form
                  onSubmit={handleAddVideo}
                  className="p-4 rounded-2xl bg-neutral-950 border border-[#F9CE00]/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#F9CE00]" />
                      <span>Add New Video to Portfolio</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 px-2 py-0.5 rounded">
                      Studio Option
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">
                        Video / Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Puma Nitro Speed Campaign"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">
                        Client / Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Puma / Red Bull"
                        value={newVideoClient}
                        onChange={(e) => setNewVideoClient(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  {/* Video Link */}
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">
                      Video URL / Link (MP4, YouTube, Vimeo)
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/video.mp4 or https://youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Supports direct MP4 links, YouTube URLs, and Vimeo URLs with embedded playback!
                    </span>
                  </div>

                  {/* Poster Thumbnail Image */}
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">
                      Poster / Thumbnail Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/thumbnail.jpg"
                        value={newVideoPoster}
                        onChange={(e) => setNewVideoPoster(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      />
                      <input
                        type="file"
                        ref={videoPosterFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], setNewVideoPoster);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => videoPosterFileRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Collaborator Option & Link */}
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2.5">
                    <span className="font-syne font-bold text-xs text-[#F9CE00] uppercase block">
                      Collaborator Option &amp; Link
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Collaborator Name / Role
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Director / Creative Partner"
                          value={newVideoCollaboratorName}
                          onChange={(e) => setNewVideoCollaboratorName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Collaborator Link (URL)
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/... or portfolio"
                          value={newVideoCollaboratorLink}
                          onChange={(e) => setNewVideoCollaboratorLink(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">Category</label>
                      <input
                        type="text"
                        value={newVideoCategory}
                        onChange={(e) => setNewVideoCategory(e.target.value)}
                        placeholder="Commercial, 3D CGI, Narrative..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={newVideoTags}
                        onChange={(e) => setNewVideoTags(e.target.value)}
                        placeholder="Commercial, 4K Master, Sound Design"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">Summary / Brief</label>
                    <textarea
                      rows={2}
                      value={newVideoSummary}
                      onChange={(e) => setNewVideoSummary(e.target.value)}
                      placeholder="Brief description of the campaign and visual impact..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Video to Portfolio</span>
                  </button>
                </form>

                {/* Manage Existing Videos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase">
                      Current Portfolio Videos ({data.caseStudies?.length || 0})
                    </span>
                    <div className="relative w-48">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={videoSearch}
                        onChange={(e) => setVideoSearch(e.target.value)}
                        placeholder="Search video..."
                        className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {filteredVideos.map((study) => {
                      const isEditing = editingVideoId === study.id;

                      return (
                        <div
                          key={study.id}
                          className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {study.posterUrl && (
                                <img
                                  src={study.posterUrl}
                                  alt={study.title}
                                  className="w-14 h-10 rounded-lg object-cover bg-black shrink-0 border border-neutral-800"
                                />
                              )}
                              <div className="overflow-hidden">
                                <span className="font-syne font-bold text-white text-xs uppercase block truncate">
                                  {study.title}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-mono text-[#F9CE00]">
                                    {study.client}
                                  </span>
                                  {study.collaboratorName && (
                                    <span className="text-[9px] font-mono text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                                      Collab: {study.collaboratorName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingVideoId(isEditing ? null : study.id)
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                                  isEditing
                                    ? 'bg-[#F9CE00] text-black'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                }`}
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isEditing ? 'Done' : 'Change'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVideo(study.id)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                                title="Delete video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Change / Edit Form */}
                          {isEditing && (
                            <div className="pt-3 border-t border-neutral-800/80 space-y-2.5">
                              <div>
                                <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                  Project Title
                                </label>
                                <input
                                  type="text"
                                  value={study.title}
                                  onChange={(e) =>
                                    handleUpdateExistingVideo(study.id, {
                                      title: e.target.value,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                    Client Name
                                  </label>
                                  <input
                                    type="text"
                                    value={study.client}
                                    onChange={(e) =>
                                      handleUpdateExistingVideo(study.id, {
                                        client: e.target.value,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                    Category
                                  </label>
                                  <input
                                    type="text"
                                    value={study.category}
                                    onChange={(e) =>
                                      handleUpdateExistingVideo(study.id, {
                                        category: e.target.value,
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                  Video URL (MP4, YouTube, Vimeo)
                                </label>
                                <input
                                  type="text"
                                  value={study.videoUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingVideo(study.id, {
                                      videoUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                  placeholder="https://..."
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                  Poster Thumbnail URL
                                </label>
                                <input
                                  type="text"
                                  value={study.posterUrl}
                                  onChange={(e) =>
                                    handleUpdateExistingVideo(study.id, {
                                      posterUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                    Collaborator Name
                                  </label>
                                  <input
                                    type="text"
                                    value={study.collaboratorName || ''}
                                    onChange={(e) =>
                                      handleUpdateExistingVideo(study.id, {
                                        collaboratorName: e.target.value,
                                      })
                                    }
                                    placeholder="e.g. Director / Lead"
                                    className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                    Collaborator Link URL
                                  </label>
                                  <input
                                    type="text"
                                    value={study.collaboratorLink || ''}
                                    onChange={(e) =>
                                      handleUpdateExistingVideo(study.id, {
                                        collaboratorLink: e.target.value,
                                      })
                                    }
                                    placeholder="https://..."
                                    className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs font-mono"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                                  Summary Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={study.summary}
                                  onChange={(e) =>
                                    handleUpdateExistingVideo(study.id, {
                                      summary: e.target.value,
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: BRANDS & CLIENT ECOSYSTEM                                 */}
            {/* ============================================================== */}
            {activeTab === 'clients' && (
              <div className="space-y-6">
                {/* Add Brand Form Card */}
                <form
                  onSubmit={handleAddBrand}
                  className="p-4 rounded-2xl bg-neutral-950 border border-[#F9CE00]/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Handshake className="w-4 h-4 text-[#F9CE00]" />
                      <span>Add Brand to Client Ecosystem</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 px-2 py-0.5 rounded">
                      Studio Option
                    </span>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nike, Decathlon, boAt, Puma..."
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  {/* Logo Image URL or File */}
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">
                      Brand Logo Image (URL or File)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={newBrandLogo}
                        onChange={(e) => setNewBrandLogo(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      />
                      <input
                        type="file"
                        ref={brandLogoFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], setNewBrandLogo);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => brandLogoFileRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Collaborator Link & Option */}
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-bold text-xs text-[#F9CE00] uppercase block">
                        Collaborator Option &amp; Link
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newBrandIsCollab}
                          onChange={(e) => setNewBrandIsCollab(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#F9CE00] rounded"
                        />
                        <span className="text-[11px] font-mono text-neutral-300">
                          Mark as Collaborator
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Brand Website / Collaborator Link
                        </label>
                        <input
                          type="text"
                          placeholder="https://brand-website.com"
                          value={newBrandLink}
                          onChange={(e) => setNewBrandLink(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Collaborator Role / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Official Brand Collaborator"
                          value={newBrandCollabRole}
                          onChange={(e) => setNewBrandCollabRole(e.target.value)}
                          disabled={!newBrandIsCollab}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs disabled:opacity-50 focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Brand to Ecosystem</span>
                  </button>
                </form>

                {/* Quick Bulk Tools */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleImportAllBrands}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-[#F9CE00] text-neutral-200 hover:text-black font-syne font-bold text-xs uppercase tracking-wider transition-all border border-neutral-700"
                  >
                    Import All 30 Partner Brands
                  </button>
                  {data.clients && data.clients.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Clear all client brand logos?')) {
                          onUpdateData({ ...data, clients: [] });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-neutral-900 border border-red-900/50 hover:bg-red-950 text-red-400 text-xs font-mono"
                    >
                      Clear All ({data.clients.length})
                    </button>
                  )}
                </div>

                {/* Manage Existing Brands */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase">
                      Current Brands in Ecosystem ({data.clients?.length || 0})
                    </span>
                    <div className="relative w-48">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        placeholder="Search brand..."
                        className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {filteredBrands.map((brand) => {
                      const isEditing = editingBrandId === brand.id;

                      return (
                        <div
                          key={brand.id}
                          className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black shrink-0 border border-neutral-800 overflow-hidden p-0.5">
                                <PartnerLogoBadge
                                  partner={{
                                    id: brand.id,
                                    name: brand.name,
                                    logoUrl: brand.logoUrl || '',
                                    category: 'Client Partner',
                                    tagline: brand.name,
                                    accentColor: '#F9CE00',
                                  }}
                                  mode="grid"
                                />
                              </div>
                              <span className="font-syne font-bold text-white text-xs truncate">
                                {brand.name}
                              </span>
                              {brand.isCollaborator && (
                                <span className="text-[9px] font-mono text-[#F9CE00] bg-[#F9CE00]/15 px-1.5 py-0.5 rounded border border-[#F9CE00]/30 shrink-0">
                                  {brand.collaboratorRole || 'Collaborator'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingBrandId(isEditing ? null : brand.id)
                                }
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                                  isEditing
                                    ? 'bg-[#F9CE00] text-black'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                }`}
                              >
                                <Edit3 className="w-3 h-3 inline mr-1" />
                                {isEditing ? 'Done' : 'Change'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBrand(brand.id)}
                                className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="pt-2 border-t border-neutral-800 space-y-2">
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Brand Name
                                </label>
                                <input
                                  type="text"
                                  value={brand.name}
                                  onChange={(e) =>
                                    handleUpdateExistingBrand(brand.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Logo URL
                                </label>
                                <input
                                  type="text"
                                  value={brand.logoUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingBrand(brand.id, {
                                      logoUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Collaborator Website Link
                                </label>
                                <input
                                  type="text"
                                  value={brand.linkUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingBrand(brand.id, {
                                      linkUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                  placeholder="https://..."
                                />
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={brand.isCollaborator || false}
                                    onChange={(e) =>
                                      handleUpdateExistingBrand(brand.id, {
                                        isCollaborator: e.target.checked,
                                      })
                                    }
                                    className="w-3.5 h-3.5 accent-[#F9CE00]"
                                  />
                                  <span className="text-[11px] text-neutral-300">
                                    Collaborator
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  value={brand.collaboratorRole || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingBrand(brand.id, {
                                      collaboratorRole: e.target.value,
                                    })
                                  }
                                  placeholder="Collaborator Role..."
                                  className="flex-1 px-2 py-1 rounded bg-black border border-neutral-800 text-white text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: INFLUENCERS & CULTURE COLLABORATORS                       */}
            {/* ============================================================== */}
            {activeTab === 'influencers' && (
              <div className="space-y-6">
                {/* Add Influencer Form Card */}
                <form
                  onSubmit={handleAddInfluencer}
                  className="p-4 rounded-2xl bg-neutral-950 border border-[#F9CE00]/30 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#F9CE00]" />
                      <span>Add Influencer / Creator</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#F9CE00] bg-[#F9CE00]/10 px-2 py-0.5 rounded">
                      Studio Option
                    </span>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">
                      Influencer / Creator Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sakshi Shivdasani, Tanmay Bhat, Ranveer Allahbadia..."
                      value={newInfName}
                      onChange={(e) => setNewInfName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                    />
                  </div>

                  {/* Image / Photo URL or File */}
                  <div>
                    <label className="block text-neutral-400 font-mono mb-1">
                      Profile Photo / Image (URL or File)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://example.com/avatar.jpg"
                        value={newInfLogo}
                        onChange={(e) => setNewInfLogo(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                      />
                      <input
                        type="file"
                        ref={infPhotoFileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(e.target.files[0], setNewInfLogo);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => infPhotoFileRef.current?.click()}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1.5 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Collaborator Link & Option */}
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-bold text-xs text-[#F9CE00] uppercase block">
                        Collaborator Option &amp; Link
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newInfIsCollab}
                          onChange={(e) => setNewInfIsCollab(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#F9CE00] rounded"
                        />
                        <span className="text-[11px] font-mono text-neutral-300">
                          Featured Collaborator
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Collaborator Profile Link (Instagram / YouTube / TikTok)
                        </label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/creator"
                          value={newInfLink}
                          onChange={(e) => setNewInfLink(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 font-mono mb-1">
                          Collaborator Role / Badge
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Creator Collaborator / Squad Lead"
                          value={newInfCollabRole}
                          onChange={(e) => setNewInfCollabRole(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">Category</label>
                      <select
                        value={newInfCategory}
                        onChange={(e) => setNewInfCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      >
                        <option value="Sports & Outdoors">Sports &amp; Outdoors</option>
                        <option value="Fashion & Streetwear">Fashion &amp; Streetwear</option>
                        <option value="Tech, Media & Audio">Tech, Media &amp; Audio</option>
                        <option value="Lifestyle & Wellness">Lifestyle &amp; Wellness</option>
                        <option value="Energy, Auto & Education">Energy, Auto &amp; Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-400 font-mono mb-1">Tagline / Reach</label>
                      <input
                        type="text"
                        placeholder="e.g. 3.2M Followers • Lifestyle & Comedy"
                        value={newInfTagline}
                        onChange={(e) => setNewInfTagline(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Influencer Partner</span>
                  </button>
                </form>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultInfluencers}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-[#F9CE00] text-neutral-200 hover:text-black font-syne font-bold text-xs uppercase tracking-wider transition-all border border-neutral-700"
                  >
                    Restore 30 Default Creators
                  </button>
                </div>

                {/* Manage Existing Influencers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase">
                      Current Influencers &amp; Creators ({currentInfluencers.length})
                    </span>
                    <div className="relative w-48">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={infSearch}
                        onChange={(e) => setInfSearch(e.target.value)}
                        placeholder="Search influencer..."
                        className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {filteredInfluencers.map((inf) => {
                      const isEditing = editingInfId === inf.id;

                      return (
                        <div
                          key={inf.id}
                          className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black shrink-0 border border-neutral-800 overflow-hidden p-0.5">
                                <PartnerLogoBadge partner={inf} mode="grid" />
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-syne font-bold text-white text-xs truncate block">
                                  {inf.name}
                                </span>
                                <span className="text-[10px] text-neutral-400 font-mono block truncate">
                                  {inf.category}
                                </span>
                              </div>
                              {inf.isCollaborator && (
                                <span className="text-[9px] font-mono text-[#F9CE00] bg-[#F9CE00]/15 px-1.5 py-0.5 rounded border border-[#F9CE00]/30 shrink-0">
                                  {inf.collaboratorRole || 'Collaborator'}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingInfId(isEditing ? null : inf.id)
                                }
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                                  isEditing
                                    ? 'bg-[#F9CE00] text-black'
                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                                }`}
                              >
                                <Edit3 className="w-3 h-3 inline mr-1" />
                                {isEditing ? 'Done' : 'Change'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInfluencer(inf.id)}
                                className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {isEditing && (
                            <div className="pt-2 border-t border-neutral-800 space-y-2">
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Creator Name
                                </label>
                                <input
                                  type="text"
                                  value={inf.name}
                                  onChange={(e) =>
                                    handleUpdateExistingInfluencer(inf.id, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Photo / Image URL
                                </label>
                                <input
                                  type="text"
                                  value={inf.logoUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingInfluencer(inf.id, {
                                      logoUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                  Collaborator Profile Link
                                </label>
                                <input
                                  type="text"
                                  value={inf.linkUrl || ''}
                                  onChange={(e) =>
                                    handleUpdateExistingInfluencer(inf.id, {
                                      linkUrl: e.target.value,
                                    })
                                  }
                                  className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-[11px] font-mono"
                                  placeholder="https://instagram.com/..."
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                    Collaborator Role
                                  </label>
                                  <input
                                    type="text"
                                    value={inf.collaboratorRole || ''}
                                    onChange={(e) =>
                                      handleUpdateExistingInfluencer(inf.id, {
                                        collaboratorRole: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-neutral-400 font-mono mb-0.5">
                                    Category
                                  </label>
                                  <input
                                    type="text"
                                    value={inf.category || ''}
                                    onChange={(e) =>
                                      handleUpdateExistingInfluencer(inf.id, {
                                        category: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1 rounded bg-black border border-neutral-800 text-white text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: HERO & SHOWREEL                                           */}
            {/* ============================================================== */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-300 font-mono uppercase mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={data.hero.headline}
                    onChange={(e) => handleHeroChange('headline', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-mono uppercase mb-1">
                    Subheadline
                  </label>
                  <textarea
                    rows={3}
                    value={data.hero.subheadline}
                    onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-mono uppercase mb-1">
                    Hero Ideology Badge Text
                  </label>
                  <input
                    type="text"
                    value={data.hero.awardBadge}
                    onChange={(e) => handleHeroChange('awardBadge', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-neutral-300 font-mono uppercase text-xs">
                      Background Video URL (.mp4 file)
                    </label>
                  </div>
                  <input
                    type="text"
                    value={data.hero.videoUrl}
                    placeholder="https://.../video.mp4 or /assets/video.mp4"
                    onChange={(e) => handleHeroChange('videoUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-[11px] font-mono focus:outline-none focus:border-[#F9CE00]"
                  />
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Direct video file renders fast with high quality native playback.
                  </p>
                </div>

                <div>
                  <label className="block text-neutral-300 font-mono uppercase mb-1">
                    Poster Fallback Image URL
                  </label>
                  <input
                    type="text"
                    value={data.hero.posterUrl}
                    onChange={(e) => handleHeroChange('posterUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-[11px] font-mono focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-900">
                  <label className="block text-neutral-300 font-mono uppercase mb-1">
                    Hero Custom Background Image (Overrides / Replaces Video)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter image URL or upload below"
                      value={data.hero.heroImageUrl || ''}
                      onChange={(e) => handleHeroChange('heroImageUrl', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-[11px] font-mono focus:outline-none focus:border-[#F9CE00]"
                    />
                    <button
                      type="button"
                      onClick={() => heroImageFileRef.current?.click()}
                      className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-[#F9CE00] hover:text-black text-neutral-300 text-xs font-syne font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: 7 BRANDS DIVISIONS                                        */}
            {/* ============================================================== */}
            {activeTab === 'brands' && (
              <div className="space-y-4">
                <p className="text-neutral-400">
                  Edit the 7 specialized agency divisions in the interactive accordion:
                </p>
                {data.brands.map((brand, idx) => (
                  <div
                    key={brand.id}
                    className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2"
                  >
                    <span className="font-syne font-bold text-[#F9CE00] text-xs uppercase">
                      0{idx + 1}. {brand.name}
                    </span>
                    <input
                      type="text"
                      value={brand.tagline}
                      onChange={(e) => {
                        const newBrands = [...data.brands];
                        newBrands[idx].tagline = e.target.value;
                        onUpdateData({ ...data, brands: newBrands });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                      placeholder="Tagline..."
                    />
                    <textarea
                      rows={2}
                      value={brand.description}
                      onChange={(e) => {
                        const newBrands = [...data.brands];
                        newBrands[idx].description = e.target.value;
                        onUpdateData({ ...data, brands: newBrands });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                      placeholder="Description..."
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: TESTIMONIALS                                              */}
            {/* ============================================================== */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <p className="text-neutral-400">
                  CMO endorsements that power the animated quote card:
                </p>
                {data.testimonials.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-bold text-[#F9CE00] text-xs uppercase">
                        {t.author}
                      </span>
                      <span className="text-[10px] text-neutral-400">{t.company}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const newT = [...data.testimonials];
                        newT[idx].quote = e.target.value;
                        onUpdateData({ ...data, testimonials: newT });
                      }}
                      className="w-full px-2.5 py-1.5 rounded bg-black border border-neutral-800 text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: SUBSCRIBERS & BRIEFS                                      */}
            {/* ============================================================== */}
            {activeTab === 'subscribers' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-neutral-900 border border-[#F9CE00]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-syne font-bold text-sm text-white uppercase flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#F9CE00]" />
                      <span>Gmail Delivery Setup</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F9CE00]/20 text-[#F9CE00] border border-[#F9CE00]/40">
                      Target: akaar.entertainment@gmail.com
                    </span>
                  </div>

                  <p className="text-neutral-400 text-xs leading-relaxed">
                    All website newsletter subscriptions and contact briefs are dispatched via FormSubmit directly to <strong className="text-white">akaar.entertainment@gmail.com</strong>.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestPing}
                      disabled={testingPing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                      <span>{testingPing ? 'Testing...' : 'Test Connection Status'}</span>
                    </button>
                  </div>

                  {testStatus && (
                    <div className="p-2.5 rounded bg-black border border-neutral-800 text-[11px] font-mono text-neutral-200">
                      {testStatus}
                    </div>
                  )}
                </div>

                {/* Stored Newsletter Subscribers */}
                <div className="space-y-3">
                  <span className="font-syne font-bold text-sm text-white uppercase block">
                    Newsletter Subscribers ({subscribers.length})
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {subscribers.length === 0 ? (
                      <p className="text-neutral-500 italic">No subscribers recorded yet.</p>
                    ) : (
                      subscribers.map((s, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                        >
                          <span className="text-white font-mono">{s.email}</span>
                          <span className="text-[10px] text-neutral-500">
                            {s.formattedDate || s.date}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                title="Copy all content as JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                title="Download JSON file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetData}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 flex items-center gap-1.5 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
