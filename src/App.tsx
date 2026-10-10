import React, { useState, useEffect } from 'react';
import { defaultAgencyData } from './data/agencyData';
import { AgencyData, CaseStudy, BlogPost } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandMarquee } from './components/BrandMarquee';
import { ServicesAccordion } from './components/ServicesAccordion';
import { InfluencerPartners } from './components/InfluencerPartners';
import { ClientLogos } from './components/ClientLogos';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ShowreelModal } from './components/ShowreelModal';
import { BlogSection } from './components/BlogSection';
import { TestimonialsSlider } from './components/TestimonialsSlider';
import { FAQSection } from './components/FAQSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ContactModal } from './components/ContactModal';
import { Footer } from './components/Footer';
import { LiveEditorDrawer, LiveEditorTab } from './components/LiveEditorDrawer';
import { AkaarChatbot } from './components/AkaarChatbot';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminFloatingShield } from './components/AdminFloatingShield';
import { PartnerPage } from './components/PartnerPage';
import { LogoThemeStudioModal } from './components/LogoThemeStudioModal';

export default function App() {
  // Load initial data from localStorage if available, or fallback to default
  const [data, setData] = useState<AgencyData>(() => {
    try {
      // Collect all candidate storage keys to recover user uploaded logos & names
      const storageKeys = [
        'akaar_agency_v6_data',
        'akaar_agency_v5_data',
        'akaar_agency_v4_data',
        'akaar_agency_v3_data',
        'akaar_agency_v2_data',
        'akaar_agency_custom_data',
      ];

      // Maps to aggregate any uploaded logos or custom names the user saved
      const savedPartnerMap = new Map<string, any>();
      const savedClientMap = new Map<string, any>();
      let primaryParsed: any = null;

      for (const key of storageKeys) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (!primaryParsed && parsed) {
              primaryParsed = parsed;
            }
            if (Array.isArray(parsed?.influencerPartners)) {
              for (const p of parsed.influencerPartners) {
                if (p?.id && !savedPartnerMap.has(p.id)) savedPartnerMap.set(p.id, p);
                if (p?.name && !savedPartnerMap.has(p.name.toLowerCase().trim())) {
                  savedPartnerMap.set(p.name.toLowerCase().trim(), p);
                }
              }
            }
            if (Array.isArray(parsed?.clients)) {
              for (const c of parsed.clients) {
                if (c?.id && !savedClientMap.has(c.id)) savedClientMap.set(c.id, c);
                if (c?.name && !savedClientMap.has(c.name.toLowerCase().trim())) {
                  savedClientMap.set(c.name.toLowerCase().trim(), c);
                }
              }
            }
          } catch {
            // ignore
          }
        }
      }

      if (primaryParsed) {
        // Merge default influencer partners while strictly preserving all user-uploaded logos and custom names
        const defaultPartnerIds = new Set(defaultAgencyData.influencerPartners.map((p) => p.id));
        const mergedPartners = defaultAgencyData.influencerPartners.map((dp) => {
          const saved = savedPartnerMap.get(dp.id) || savedPartnerMap.get(dp.name.toLowerCase().trim());
          return {
            ...dp,
            name: saved?.name || dp.name,
            logoUrl: (saved?.logoUrl && saved.logoUrl.trim() !== '') ? saved.logoUrl : (dp.logoUrl || ''),
            category: saved?.category || dp.category,
            tagline: saved?.tagline || dp.tagline,
          };
        });
        // Include any additional partners added by user
        const parsedPartners = Array.isArray(primaryParsed.influencerPartners) ? primaryParsed.influencerPartners : [];
        const extraPartners = parsedPartners.filter((p: any) => !defaultPartnerIds.has(p.id));

        // Merge default client brands while strictly preserving all user-uploaded logos and custom names
        const defaultClientIds = new Set(defaultAgencyData.clients.map((c) => c.id));
        const mergedClients = defaultAgencyData.clients.map((dc) => {
          const saved = savedClientMap.get(dc.id) || savedClientMap.get(dc.name.toLowerCase().trim());
          return {
            ...dc,
            name: saved?.name || dc.name,
            logoUrl: (saved?.logoUrl && saved.logoUrl.trim() !== '') ? saved.logoUrl : (dc.logoUrl || ''),
            category: saved?.category || dc.category,
          };
        });
        // Include any additional clients added by user
        const parsedClients = Array.isArray(primaryParsed.clients) ? primaryParsed.clients : [];
        const extraClients = parsedClients.filter((c: any) => !defaultClientIds.has(c.id));

        return {
          ...defaultAgencyData,
          ...primaryParsed,
          hero: {
            ...defaultAgencyData.hero,
            ...primaryParsed.hero,
            videoUrl:
              primaryParsed.hero?.videoUrl &&
              !primaryParsed.hero.videoUrl.includes('HELLO_REEL') &&
              !primaryParsed.hero.videoUrl.includes('tyro-big-buyout')
                ? primaryParsed.hero.videoUrl
                : defaultAgencyData.hero.videoUrl,
            posterUrl:
              primaryParsed.hero?.posterUrl &&
              !primaryParsed.hero.posterUrl.includes('fruity-icy')
                ? primaryParsed.hero.posterUrl
                : defaultAgencyData.hero.posterUrl,
            awardBadge:
              primaryParsed.hero?.awardBadge && !primaryParsed.hero.awardBadge.includes('Campaign Asia')
                ? primaryParsed.hero.awardBadge
                : 'Believe in a client-oriented ideology',
          },
          clients: [...mergedClients, ...extraClients],
          influencerPartners: [...mergedPartners, ...extraPartners],
          brandSettings: {
            ...defaultAgencyData.brandSettings,
            ...primaryParsed.brandSettings,
          },
          portfolioGallery: Array.isArray(primaryParsed.portfolioGallery) && primaryParsed.portfolioGallery.length > 0
            ? primaryParsed.portfolioGallery
            : defaultAgencyData.portfolioGallery,
        };
      }
    } catch {
      // ignore
    }
    return defaultAgencyData;
  });

  // Cross-tab real-time sync for changes made in studio mode
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (
        e.key === 'akaar_agency_v6_data' ||
        e.key === 'akaar_agency_v5_data' ||
        e.key === 'akaar_agency_custom_data'
      ) {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed) {
              setData((prev) => ({
                ...prev,
                ...parsed,
              }));
            }
          } catch {
            // ignore
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const [isMuted, setIsMuted] = useState(true);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInitialTab, setContactInitialTab] = useState<'portal' | 'form' | 'offices'>('portal');
  const [contactInitialService, setContactInitialService] = useState<string | undefined>(undefined);
  const [contactInitialBudget, setContactInitialBudget] = useState<string | undefined>(undefined);
  const [contactInitialMessage, setContactInitialMessage] = useState<string | undefined>(undefined);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<LiveEditorTab>('cases');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [partnerPageOpen, setPartnerPageOpen] = useState(false);
  const [isLogoStudioOpen, setIsLogoStudioOpen] = useState(false);

  // Allow opening logo studio via custom event
  useEffect(() => {
    const handleOpenLogoStudio = () => setIsLogoStudioOpen(true);
    window.addEventListener('open-logo-theme-studio', handleOpenLogoStudio);
    return () => {
      window.removeEventListener('open-logo-theme-studio', handleOpenLogoStudio);
    };
  }, []);

  // Sync browser document.title with brand and domain
  useEffect(() => {
    const brand = data.brandSettings?.logoText || 'AKAAR';
    const domain = data.brandSettings?.customDomain ? ` (${data.brandSettings.customDomain})` : '';
    document.title = `${brand} | Creative Agency & Media Production${domain}`;
  }, [data.brandSettings]);

  // Persistent User Published Blogs (Demo blogs removed - starts empty until user writes & publishes)
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      // Clear legacy storage that had demo posts forced
      localStorage.removeItem('akaar_agency_blogs_v2');

      const saved = localStorage.getItem('akaar_agency_published_blogs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Keep only user-written blogs, purge any demo items
          return parsed.filter(
            (b: any) => b && b.id && b.id !== 'blog-1' && b.id !== 'blog-2' && b.id !== 'blog-3'
          );
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const handleAddBlog = (newBlog: BlogPost) => {
    setBlogs((prev) => {
      const updated = [newBlog, ...prev];
      try {
        localStorage.setItem('akaar_agency_published_blogs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleDeleteBlog = (blogId: string) => {
    setBlogs((prev) => {
      const updated = prev.filter((b) => b.id !== blogId);
      try {
        localStorage.setItem('akaar_agency_published_blogs', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleOpenEditorWithTab = (tab: LiveEditorTab) => {
    setEditorTab(tab);
    setEditorOpen(true);
  };

  // Auto-open partner page or Give Akaar Inbound portal based on URL params or hash
  useEffect(() => {
    const handleUrlRouting = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const portalParam = searchParams.get('portal');
      const tabParam = searchParams.get('tab');
      const hash = window.location.hash.toLowerCase();

      if (
        portalParam === 'inbound' ||
        tabParam === 'inbound' ||
        tabParam === 'give-akaar' ||
        hash === '#give-akaar' ||
        hash === '#inbound' ||
        hash === '#portal' ||
        hash === '#contact'
      ) {
        setContactInitialTab('portal');
        setContactOpen(true);
      } else if (hash === '#partner' || hash === '#partner-with-us' || hash === '#collaborate') {
        setPartnerPageOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  const handleOpenBriefUs = (options?: { service?: string; budget?: string; message?: string }) => {
    setContactInitialTab('form');
    if (options?.service) setContactInitialService(options.service);
    if (options?.budget) setContactInitialBudget(options.budget);
    if (options?.message) setContactInitialMessage(options.message);
    setContactOpen(true);
  };

  const handleOpenPartner = () => {
    setPartnerPageOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePartner = () => {
    setPartnerPageOpen(false);
    if (window.location.hash.toLowerCase().includes('partner') || window.location.hash.toLowerCase().includes('collaborate')) {
      window.history.replaceState(null, '', ' ');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOfficesModal = () => {
    setContactInitialTab('offices');
    setContactOpen(true);
  };

  // Sync edits to localStorage
  const handleUpdateData = (newData: AgencyData) => {
    setData(newData);
    try {
      const serialized = JSON.stringify(newData);
      localStorage.setItem('akaar_agency_v6_data', serialized);
      localStorage.setItem('akaar_agency_v5_data', serialized);
      localStorage.setItem('akaar_agency_custom_data', serialized);
    } catch {
      // ignore
    }
  };

  const handleResetData = () => {
    setData(defaultAgencyData);
    try {
      localStorage.removeItem('akaar_agency_v6_data');
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Dedicated Partner With Akaar Agency Page View
  if (partnerPageOpen) {
    return (
      <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col selection:bg-[#F9CE00] selection:text-black">
        <PartnerPage
          onBack={handleClosePartner}
          onOpenContactModal={() => {
            handleOpenBriefUs({
              service: 'Brand Partnership',
              budget: 'Rs 1,00,000 - Rs 2,50,000',
              message: 'Partnership inquiry initiated from the Partner page.'
            });
          }}
        />

        {/* Contact brief modal */}
        <ContactModal
          isOpen={contactOpen}
          onClose={() => {
            setContactOpen(false);
            setContactInitialTab('form');
            setContactInitialService(undefined);
            setContactInitialBudget(undefined);
            setContactInitialMessage(undefined);
          }}
          offices={data.offices}
          initialTab={contactInitialTab}
          initialService={contactInitialService}
          initialBudget={contactInitialBudget}
          initialMessage={contactInitialMessage}
        />

        {/* Advanced AI Chatbot */}
        <AkaarChatbot
          onOpenBriefUs={handleOpenBriefUs}
          onOpenReel={() => setShowreelOpen(true)}
          onOpenOffices={handleOpenOfficesModal}
          onOpenPartnerPage={handleOpenPartner}
        />

        {/* Cyber Security Admin Auth Modal & Floating Status Shield */}
        <AdminAuthModal />
        <AdminFloatingShield
          onToggleEditor={() => setEditorOpen(!editorOpen)}
          isEditorOpen={editorOpen}
          onOpenEditorWithTab={handleOpenEditorWithTab}
        />
        <LiveEditorDrawer
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          data={data}
          onUpdateData={handleUpdateData}
          onResetData={handleResetData}
          initialTab={editorTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col selection:bg-[#F9CE00] selection:text-black">
      {/* Fixed Navigation Bar */}
      <Navbar
        onOpenReel={() => setShowreelOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onOpenPartnerPage={handleOpenPartner}
        onToggleEditor={() => setEditorOpen(!editorOpen)}
        isEditorOpen={editorOpen}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenLogoStudio={() => setIsLogoStudioOpen(true)}
        brandSettings={data.brandSettings}
      />

      {/* Hero with Video Loop & Agency of the Year Yellow Callout */}
      <Hero
        data={data.hero}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenReel={() => setShowreelOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        brandLogoUrl={data.brandSettings?.logoUrl}
      />

      {/* Brand Ticker Marquee */}
      <BrandMarquee text="GIVE AKAAR TO YOUR BRAND" />

      {/* 7 Specialized Agency Divisions Accordion */}
      <ServicesAccordion
        brands={data.brands}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Influencer Selected Partners: 30+ Brands in Ticker Marquee & Grid */}
      <InfluencerPartners
        partners={data.influencerPartners}
        onOpenBriefUs={handleOpenBriefUs}
        onAddPartner={(newPartner) => {
          const updated = {
            ...data,
            influencerPartners: [newPartner, ...(data.influencerPartners || [])],
          };
          handleUpdateData(updated);
        }}
        onDeletePartner={(id) => {
          const updated = {
            ...data,
            influencerPartners: (data.influencerPartners || []).filter((p) => p.id !== id),
          };
          handleUpdateData(updated);
        }}
      />

      {/* Backed by the Best (Client Ecosystem - ready for new partners) */}
      <ClientLogos
        clients={data.clients}
        onOpenContact={() =>
          handleOpenBriefUs({
            service: 'Brand Partnership',
            budget: 'Rs 1,00,000 - Rs 2,50,000',
            message: 'Inquiry to join the Akaar Client Ecosystem.',
          })
        }
        onOpenPartnerPage={handleOpenPartner}
        onAddPartner={(newPartner) => {
          const updated = {
            ...data,
            clients: [...data.clients, newPartner],
          };
          handleUpdateData(updated);
        }}
        onAddMultiplePartners={(newPartners) => {
          // Avoid duplicate ids
          const existingIds = new Set(data.clients.map((c) => c.id));
          const toAdd = newPartners.filter((p) => !existingIds.has(p.id));
          const updated = {
            ...data,
            clients: [...data.clients, ...toAdd],
          };
          handleUpdateData(updated);
        }}
        onDeletePartner={(partnerId) => {
          const updated = {
            ...data,
            clients: data.clients.filter((c) => c.id !== partnerId),
          };
          handleUpdateData(updated);
        }}
        onClearAllPartners={() => {
          const updated = {
            ...data,
            clients: [],
          };
          handleUpdateData(updated);
        }}
      />

      {/* Reverse Marquee Separator */}
      <BrandMarquee text="CREATIVE INTELLIGENCE IN ACTION" reverse />

      {/* CMOs Give Akaar Testimonials Slider */}
      <TestimonialsSlider testimonials={data.testimonials} />

      {/* Akaar Insights & Blogs Section (Read & Write Articles) */}
      <BlogSection
        blogs={blogs}
        onAddBlog={handleAddBlog}
        onDeleteBlog={handleDeleteBlog}
        onOpenBriefUs={handleOpenBriefUs}
      />

      {/* Frequently Asked Questions at the bottom of the page */}
      <FAQSection
        onOpenBriefUs={handleOpenBriefUs}
        onOpenChatbot={() => window.dispatchEvent(new CustomEvent('open-akaar-chat'))}
      />

      {/* Weekly Drip Newsletter Pill Section */}
      <NewsletterSection data={data.newsletter} />

      {/* Global Footer with Pune & Mumbai Studios */}
      <Footer
        offices={data.offices}
        onOpenContact={() => setContactOpen(true)}
        onOpenPartnerPage={handleOpenPartner}
        onOpenLogoStudio={() => setIsLogoStudioOpen(true)}
        brandSettings={data.brandSettings}
      />

      {/* Modals & Overlays */}
      <CaseStudyModal
        study={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onOpenContact={() => {
          setSelectedCaseStudy(null);
          setContactOpen(true);
        }}
      />

      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        videoUrl={data.hero.videoUrl}
      />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => {
          setContactOpen(false);
          setContactInitialTab('portal');
          setContactInitialService(undefined);
          setContactInitialBudget(undefined);
          setContactInitialMessage(undefined);
        }}
        offices={data.offices}
        initialTab={contactInitialTab}
        initialService={contactInitialService}
        initialBudget={contactInitialBudget}
        initialMessage={contactInitialMessage}
      />

      {/* Advanced AI Chatbot with Query Analysis, Simple Answers, Page Redirects & End Packages */}
      <AkaarChatbot
        onOpenBriefUs={handleOpenBriefUs}
        onOpenReel={() => setShowreelOpen(true)}
        onOpenOffices={handleOpenOfficesModal}
        onOpenPartnerPage={handleOpenPartner}
      />

      <LiveEditorDrawer
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        data={data}
        onUpdateData={handleUpdateData}
        onResetData={handleResetData}
        initialTab={editorTab}
      />

      {/* Cyber Security Admin Auth Modal & Floating Status Shield */}
      <AdminAuthModal />
      <AdminFloatingShield
        onToggleEditor={() => setEditorOpen(!editorOpen)}
        isEditorOpen={editorOpen}
        onOpenEditorWithTab={handleOpenEditorWithTab}
      />

      {/* Akaar Logo Theme Studio & Customizer Modal */}
      <LogoThemeStudioModal
        isOpen={isLogoStudioOpen}
        onClose={() => setIsLogoStudioOpen(false)}
        data={data}
        onUpdateData={handleUpdateData}
      />
    </div>
  );
}
