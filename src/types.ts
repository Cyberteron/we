/**
 * Types and interfaces for Akaar Agency
 * Modular, extensible definitions for easy customization.
 */

export interface BrandOffering {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  bgImage: string;
  logoSvg?: string;
  color?: string;
  capabilities: string[];
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string;
  category?: string;
  linkUrl?: string; // Website or collaborator link
  isCollaborator?: boolean; // Collaborator flag/status
  collaboratorRole?: string; // Role e.g., 'Brand Collaborator', 'Production Partner'
}

export interface InfluencerPartner {
  id: string;
  name: string;
  logoUrl: string; // Avatar photo or emblem
  category: 'Sports & Outdoors' | 'Fashion & Streetwear' | 'Tech, Media & Audio' | 'Lifestyle & Wellness' | 'Energy, Auto & Education' | string;
  tagline?: string;
  linkUrl?: string; // Collaborator social or portfolio link
  isCollaborator?: boolean; // Collaborator option
  collaboratorRole?: string; // e.g., 'Featured Creator', 'Lead Collaborator', 'Creator Squad'
  accentColor?: string;
  badge?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  posterUrl: string;
  videoUrl?: string;
  collaboratorLink?: string; // Collaborator link or credits URL
  collaboratorName?: string; // Collaborator / co-producer name
  featured?: boolean;
  year?: string;
  galleryImages?: string[]; // Multi-image gallery for portfolio project
}

export interface PortfolioMediaItem {
  id: string;
  title: string;
  client?: string;
  caption?: string;
  category: string;
  imageUrl: string;
  tags?: string[];
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  featured?: boolean;
  year?: string;
  caseStudyId?: string; // Associated case study ID if linked
  createdAt?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
}

export interface OfficeLocation {
  city: string;
  address: string;
  state: string;
  phone: string;
  email: string;
  mapUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface AgencyData {
  hero: {
    headline: string;
    subheadline: string;
    awardBadge: string;
    experienceYears: string;
    videoUrl: string;
    posterUrl: string;
    heroImageUrl?: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  brandSettings?: {
    logoUrl?: string;
    logoText?: string;
    agencySubtitle?: string;
    logoTheme?: 'gold' | 'liquid-gold' | 'cyber-white' | 'neon-glow' | 'dual-tone' | 'blueprint' | 'minimal';
    logoIconStyle?: 'prism-a' | 'architectural' | 'facets' | 'monogram' | 'geometric-minimal' | 'wordmark-only';
    logoGlow?: 'none' | 'subtle' | 'high' | 'laser';
    logoAccentColor?: string;
    logoFilter?: string;
    logoSize?: 'sm' | 'md' | 'lg' | 'xl';
    customDomain?: string;
    isCustomDomainActive?: boolean;
    showDomainBanner?: boolean;
    freeSubdomain?: string;
    faviconUrl?: string;
  };
  brands: BrandOffering[];
  clients: ClientLogo[];
  influencerPartners?: InfluencerPartner[];
  caseStudies: CaseStudy[];
  portfolioGallery?: PortfolioMediaItem[];
  blogs?: BlogPost[];
  testimonials: Testimonial[];
  newsletter: {
    title: string;
    subtitle: string;
    directions: string;
    sideEffects: string;
    badge: string;
    imageUrl: string;
  };
  offices: OfficeLocation[];
  socialLinks: {
    name: string;
    url: string;
  }[];
}
