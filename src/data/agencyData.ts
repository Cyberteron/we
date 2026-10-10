import { AgencyData } from '../types';
import { INFLUENCER_SELECTED_PARTNERS } from './influencerPartnersData';

/**
 * Default Content Configuration for Hello Agency
 * All texts, videos, images, brand divisions, and case studies are editable here.
 */
export const defaultAgencyData: AgencyData = {
  hero: {
    headline: "Give Akaar to award winning integrated experiences for the digital era!",
    subheadline: "We’ve been around for 13 years, and pride ourselves on delivering creative, talent, earned, paid media and experiential marketing programs that work for your objectives. We call this creative intelligence.",
    awardBadge: "Believe in a client-oriented ideology",
    experienceYears: "13 Years of Impact",
    videoUrl: "https://youtu.be/epDa2WSMzIU",
    posterUrl: "/assets/akaar-poster.jpg",
    heroImageUrl: "",
    ctaPrimary: "GET IN TOUCH",
    ctaSecondary: "WATCH SHOWREEL"
  },
  brandSettings: {
    logoUrl: "",
    logoText: "AKAAR",
    agencySubtitle: "Agency",
    logoTheme: "gold",
    logoIconStyle: "prism-a",
    logoGlow: "high",
    logoAccentColor: "#F9CE00",
    customDomain: "akaaragency.com",
    isCustomDomainActive: true,
    showDomainBanner: true,
    freeSubdomain: "akaar.portfolio.free",
    faviconUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/06/favicon-1.png",
  },
  brands: [
    {
      id: "creative",
      name: "AKAAR CREATIVE",
      shortName: "Creative",
      tagline: "Award winning creative ideas that can live everywhere.",
      description: "Big, platform-agnostic ideas built for modern attention spans. We merge high-velocity cultural insights with world-class art direction and production.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/tyro-big-buyout-hero-optimised-v2-1.jpg",
      capabilities: ["Brand Strategy", "Campaign Conceptualization", "Hero Content", "Copywriting", "Art Direction"]
    },
    {
      id: "social",
      name: "AKAAR SOCIAL",
      shortName: "Social",
      tagline: "India's premier culture-defining social media agency.",
      description: "Organic, paid, community, and social-first creative that earns engagement. We turn passive scrolling audiences into active brand disciples.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/THUMB-Cooked-Ads-16x9-2.jpg",
      capabilities: ["Social Strategy", "Always-On Content", "Community Management", "TikTok & Reels Growth", "Social Listening"]
    },
    {
      id: "create",
      name: "AKAAR CREATE",
      shortName: "Create",
      tagline: "Content, production & design that packs a punch.",
      description: "Agile, in-house production and creator lab turning concepts into broadcast-quality live-action, 3D animations, and social native visual assets in hours.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/reversible-scaled.jpg",
      capabilities: ["Video Production", "Motion & 3D Animation", "Studio Photography", "Post-Production & VFX", "Design Systems"]
    },
    {
      id: "talent",
      name: "AKAAR TALENT",
      shortName: "Talent",
      tagline: "Influencer, creator & celeb partnerships with purpose.",
      description: "Authentic talent matchmaking driven by proprietary performance data. From micro-creator networks to A-list cultural icons.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/PR-Shot-scaled.jpg",
      capabilities: ["Creator Matchmaking", "Celebrity Partnerships", "End-to-End Contracting", "Influencer Gifting", "Performance Whitelisting"]
    },
    {
      id: "pr",
      name: "AKAAR PR",
      shortName: "PR",
      tagline: "Integrated brand experiences that drive PR & social chatter.",
      description: "Earned media strategies that land front-page headlines and fuel organic talkability. We engineer buzz that traditional press releases cannot touch.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/1E2A9692-scaled.jpg",
      capabilities: ["Media Relations", "Crisis Management", "Earned Storytelling", "Press Stunts", "Thought Leadership"]
    },
    {
      id: "media",
      name: "AKAAR MEDIA",
      shortName: "Media",
      tagline: "Data-driven media campaigns based on your objectives.",
      description: "Precision performance and brand media planning. We ensure high-impact creative gets served to high-intent audiences with zero wasted spend.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/Xero_PayItDontDelayIt_16x9_Thumb-Ugg.jpg",
      capabilities: ["Paid Social", "Programmatic & CTV", "Search (SEM/SEO)", "Audience Segmentation", "Conversion Optimization"]
    },
    {
      id: "experiential",
      name: "AKAAR EXPERIENTIAL",
      shortName: "Events",
      tagline: "Experiences that drive brand love, attention & fame.",
      description: "Unforgettable physical, immersive, and hybrid activations that people queue up for, photograph, and talk about for months.",
      bgImage: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/04/fruity-icy.jpg",
      capabilities: ["Brand Activations", "Pop-Ups & Installations", "Festival Sponsorships", "Immersive Technology", "Event Production"]
    }
  ],
  clients: INFLUENCER_SELECTED_PARTNERS.map((p) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl || '',
  })),
  influencerPartners: INFLUENCER_SELECTED_PARTNERS,
  caseStudies: [
    {
      id: "tyros-big-buyout",
      title: "Tyro’s Big Buyout",
      client: "Tyro Payments",
      category: "Creative Strategy & Production",
      tags: ["Creative Strategy", "Content Production", "Post-Production", "OOH"],
      summary: "How a high-growth fintech bought out local businesses' transaction fees for local merchants and transformed business sentiment.",
      challenge: "Tyro needed to break through traditional banking complacency and show local hospitality businesses that Tyro champions their bottom line.",
      solution: "We launched 'The Big Buyout', taking over merchant terminals across prominent beachside cafes, waiving customer surcharge fees live on camera, backed by hyper-local social broadcasts.",
      results: [
        { metric: "+310%", label: "Merchant Terminal Inquiries" },
        { metric: "18.4M", label: "National Impressions" },
        { metric: "99.4%", label: "Positive Brand Sentiment" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/tyro-big-buyout-hero-optimised-v2-1.jpg",
      videoUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/tyro-big-buyout-upsouth-bondi-15sec-cap.mp4",
      featured: true,
      year: "2025"
    },
    {
      id: "lynx-fragrance",
      title: "Fine Fragrance Collection",
      client: "Lynx / Unilever",
      category: "Content & Social Disruption",
      tags: ["Creative Strategy", "Content Production", "Creator Culture", "TikTok"],
      summary: "Blind smell tests and high-energy social disruption proving that Lynx smells as luxury as Rs 25,000 designer fragrances.",
      challenge: "Overcoming legacy perceptions among Gen Z and proving that the new Lynx Fine Fragrance collection rivals premium French colognes.",
      solution: "Cooked ads, unhinged TikTok blind tests, and comedic influencer showdowns putting Lynx head-to-head with iconic luxury fragrances on the streets of Pune & Mumbai.",
      results: [
        { metric: "24.8M", label: "Organic TikTok Views" },
        { metric: "#1", label: "Fastest Selling New Fragrance SKU" },
        { metric: "+46%", label: "Gen Z Brand Affinity" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/THUMB-Cooked-Ads-16x9-2.jpg",
      videoUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/Lynx_Magestic-Animals_16x9_06sec.mp4",
      featured: true,
      year: "2025"
    },
    {
      id: "xero-pay-it",
      title: "Pay It Don’t Delay It",
      client: "Xero",
      category: "Integrated Campaign & PR",
      tags: ["Campaign Strategy & Idea", "Content", "PR & Earned", "Social"],
      summary: "A culture-driven rally crying against late payments, helping Australian small business owners get paid on time.",
      challenge: "Late invoice payments choke over Rs 10,000+ Crore of small business cash flow every month across Australia.",
      solution: "We launched an irreverent, bold campaign featuring iconic Australian footwear (custom UGG boots) and humorous guilt-tripping content reminding big corporates that small businesses have bills too.",
      results: [
        { metric: "42M+", label: "Earned Media Reach" },
        { metric: "+28%", label: "Reduction in Late Payment Invoices" },
        { metric: "Gold", label: "Spikes Asia & Effie Finalist" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/Xero_PayItDontDelayIt_16x9_Thumb-Ugg.jpg",
      videoUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/Xero_PayItDontDelayIt_Hero_16x9_Delivery_12mb.mp4",
      featured: true,
      year: "2024"
    },
    {
      id: "eat-local",
      title: "EAT LOCAL",
      client: "Uber Eats",
      category: "Grassroots & Community Strategy",
      tags: ["Campaign Strategy & Idea", "Content", "PR", "Community Advocacy"],
      summary: "Saving cultural institutions and local eateries with viral community activations, pop-ups, and fan mobilization.",
      challenge: "Historic local restaurants were facing rising operating costs and commercial pressures in Pune & Mumbai's bustling cultural corridors.",
      solution: "We activated the community around beloved local culinary hotspots with late-night food events, local merchandise, and dedicated delivery promos that turned regular patrons into vocal advocates.",
      results: [
        { metric: "100%", label: "Council Permit Retained" },
        { metric: "140K+", label: "Petition Signatures Mobilized" },
        { metric: "Top 5", label: "Most Discussed Australian PR Campaigns" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/PR-Shot-scaled.jpg",
      featured: false,
      year: "2024"
    },
    {
      id: "insurance-solved",
      title: "Insurance Solved",
      client: "Budget Direct",
      category: "Content Production & Motion",
      tags: ["Creative Strategy", "Content Production", "Reversible Design"],
      summary: "Demystifying complex insurance policies through witty, reversible visual storytelling and interactive bite-sized digital assets.",
      challenge: "Insurance ads are traditionally viewed as tedious, bureaucratic, and easily forgotten by everyday Australians.",
      solution: "Created snappy, eye-popping animations and live-action skits showing how unexpected misadventures transform into seamless claims in seconds.",
      results: [
        { metric: "+38%", label: "Quote Completion Rate" },
        { metric: "2.8x", label: "Ad Recall vs Financial Services Benchmark" },
        { metric: "12M", label: "Digital Video Views" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/reversible-scaled.jpg",
      featured: false,
      year: "2024"
    },
    {
      id: "uber-pride-ride",
      title: "UBER PRIDE RIDE",
      client: "Uber Australia",
      category: "Experiential & Social Impact",
      tags: ["Campaign Strategy & Idea", "Experiential", "Content", "PR & Social"],
      summary: "Turning everyday Uber rides into dazzling mobile celebrations for global WorldPride.",
      challenge: "Creating an authentic, celebratory activation for global WorldPride that was genuinely joyful, community-led, and unmissable.",
      solution: "Transformed iconic Uber vehicles into glittering disco sanctuaries with voguing queens, karaoke systems, and interactive photo booths roving the city.",
      results: [
        { metric: "100M+", label: "Global Reach Across 28 Countries" },
        { metric: "100%", label: "Driver & Rider 5-Star Reviews" },
        { metric: "Grand Prix", label: "Australian Marketing Institute Winner" }
      ],
      posterUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/1E2A9692-scaled.jpg",
      videoUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/Pride-ride-video.mp4",
      featured: true,
      year: "2024"
    }
  ],
  portfolioGallery: [
    {
      id: "media-1",
      title: "Tyro Bondi Beach Takeover",
      client: "Tyro Payments",
      category: "Content Production",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/tyro-big-buyout-hero-optimised-v2-1.jpg",
      tags: ["Creative Strategy", "OOH", "Photography"],
      aspectRatio: "landscape",
      featured: true,
      caseStudyId: "tyros-big-buyout"
    },
    {
      id: "media-2",
      title: "Lynx Fine Fragrance Street Stunt",
      client: "Lynx / Unilever",
      category: "Creative Strategy",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/THUMB-Cooked-Ads-16x9-2.jpg",
      tags: ["Social", "TikTok", "Creative Strategy"],
      aspectRatio: "landscape",
      featured: true,
      caseStudyId: "lynx-fragrance"
    },
    {
      id: "media-3",
      title: "Xero Small Business Advocacy",
      client: "Xero",
      category: "Content Production",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/Xero_PayItDontDelayIt_16x9_Thumb-Ugg.jpg",
      tags: ["Advocacy", "Film", "Content Production"],
      aspectRatio: "landscape",
      featured: true,
      caseStudyId: "xero-pay-it"
    },
    {
      id: "media-4",
      title: "Indian Home Diner Cultural Save",
      client: "Uber Eats",
      category: "Experiential",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/PR-Shot-scaled.jpg",
      tags: ["Community", "PR", "Experiential"],
      aspectRatio: "landscape",
      featured: false,
      caseStudyId: "eat-local"
    },
    {
      id: "media-5",
      title: "Reversible Visual Identity",
      client: "Budget Direct",
      category: "Creative Strategy",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/reversible-scaled.jpg",
      tags: ["Design", "Animation", "Creative Strategy"],
      aspectRatio: "landscape",
      featured: false,
      caseStudyId: "insurance-solved"
    },
    {
      id: "media-6",
      title: "Uber WorldPride Mobile Disco",
      client: "Uber Australia",
      category: "Experiential",
      imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/1E2A9692-scaled.jpg",
      tags: ["Experiential", "PR & Social", "Activation"],
      aspectRatio: "landscape",
      featured: true,
      caseStudyId: "uber-pride-ride"
    }
  ],
  testimonials: [
    {
      id: "uber-andy",
      quote: "The crew at Akaar have helped us create moments of magic over the last 5 years together. We helped save The Indian Home Diner with a truly grassroots campaign… and who doesn’t love a rave + a juicy kebab after…",
      author: "ANDY MORLEY",
      role: "Director of Marketing",
      company: "Uber & Uber Eats Australia & New Zealand",
      avatarUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2025/02/slider-img.webp"
    },
    {
      id: "tyro-marketing",
      quote: "Akaar doesn't bring ordinary advertising decks; they bring cultural hooks that stop people dead in their tracks. The Big Buyout transformed how small business merchants perceive Tyro overnight.",
      author: "STEPHANIE GOWAN",
      role: "Head of Brand & Growth",
      company: "Tyro Payments",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "unilever-marketing",
      quote: "Their social intuition is second to none in this market. Akaar proved to our global leadership team that authentic, creator-led TikTok chaos drives higher sales conversion than traditional TVC ever could.",
      author: "MARCUS CHEN",
      role: "Global Brand Director",
      company: "Unilever Personal Care",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
    }
  ],
  newsletter: {
    title: "NEWSLETTER",
    subtitle: "SIGN UP TO OUR",
    directions: "DIRECTIONS FOR USE: Adults and children over 12 years: Take one drip every week as required.",
    sideEffects: "Side effects may include: Going viral, impressing your boss, winning new business. Keep your finger on the pulse with the Akaar Weekly Drip.",
    badge: "100% FRESH CULTURAL INSIGHTS",
    imageUrl: "https://bunny-wp-pullzone-ujjrkz8rw8.b-cdn.net/wp-content/uploads/2024/05/newsletter-img.png"
  },
  offices: [
    {
      city: "Pune",
      address: "Business Bay, 4th Floor, Bund Garden / Koregaon Park",
      state: "Pune, Maharashtra 411001",
      phone: "+91 9975312398",
      email: "akaar.entertainment@gmail.com",
      mapUrl: "https://maps.google.com/?q=Business+Bay+Pune+Maharashtra+India"
    },
    {
      city: "Mumbai",
      address: "One BKC, 5th Floor, G Block, Bandra Kurla Complex",
      state: "Mumbai, Maharashtra 400051",
      phone: "+91 9975312398",
      email: "akaar.entertainment@gmail.com",
      mapUrl: "https://maps.google.com/?q=One+BKC+Bandra+Kurla+Complex+Mumbai+India"
    }
  ],
  socialLinks: [
    { name: "Instagram", url: "https://www.instagram.com/akaar.entertainment?igsi=d2U5eGhzM3l6dmh2" },
    { name: "LinkedIn", url: "https://www.linkedin.com/company/akaar-agency/" },
    { name: "Facebook", url: "https://www.facebook.com/akaaragency/" },
    { name: "TikTok", url: "https://www.tiktok.com/@akaaragency" }
  ]
};
