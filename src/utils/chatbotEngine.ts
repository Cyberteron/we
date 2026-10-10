export type NavigationTarget =
  | { type: 'section'; sectionId: 'work' | 'brands' | 'influencer-partners' | 'clients' | 'testimonials' | 'blogs' | 'faq' | 'offices' | 'newsletter'; label: string }
  | { type: 'page'; page: 'partner'; label: string }
  | { type: 'modal'; modal: 'brief-us'; service?: string; budget?: string; message?: string; label: string }
  | { type: 'modal'; modal: 'offices'; label: string }
  | { type: 'modal'; modal: 'showreel'; label: string };

export interface PackageSuggestion {
  title: string;
  priceRange: string;
  service: string;
  budgetTier: string;
  summary: string;
  ctaLabel?: string;
}

export interface QueryAnalysis {
  detectedTopic: string;
  intent: string;
  isPackageRelated: boolean;
}

export interface QueryAnalysisResult {
  analysis: QueryAnalysis;
  answer: string;
  pageRedirect?: NavigationTarget;
  suggestedPackage?: PackageSuggestion;
  quickReplies?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  analysis?: QueryAnalysis;
  pageRedirect?: NavigationTarget;
  suggestedPackage?: PackageSuggestion;
  quickReplies?: string[];
}

/**
 * Advanced query analyzer:
 * 1. Analyzes the user query precisely (intent, topic, entity).
 * 2. Gives the answer in simple, direct, conversational form.
 * 3. Redirects the user for the related page / section ONLY.
 * 4. Only suggests the package at the end if relevant to the user's intent.
 */
export function analyzeUserQuery(input: string): QueryAnalysisResult {
  const clean = (input || '').toLowerCase().trim();

  // 1. Direct command to open Give Akaar brief tab
  if (
    clean === 'open brief' ||
    clean === 'give akaar' ||
    clean === 'brief us' ||
    clean.includes('open brief form') ||
    clean.includes('open contact') ||
    clean.includes('take me to brief')
  ) {
    return {
      analysis: {
        detectedTopic: 'Project Brief Initiation',
        intent: 'Direct Form Access',
        isPackageRelated: true
      },
      answer: `Opening the **Give Akaar — Brief Us** tab for you now. Here you can submit your project goals, required capabilities, and timeline directly to our studio directors.`,
      pageRedirect: {
        type: 'modal',
        modal: 'brief-us',
        service: 'Creative Strategy',
        budget: 'Rs 50,000 - Rs 1,00,000',
        label: 'Open Give Akaar (Brief Us Tab)'
      },
      quickReplies: ['Video Editing Package', 'Video Shoot Package', 'Pune Studio Address']
    };
  }

  // 1b. Direct inquiry about partnering with Akaar Agency
  if (
    clean.includes('partner') ||
    clean.includes('partnership') ||
    clean.includes('collaborate') ||
    clean.includes('work together') ||
    clean.includes('become a partner')
  ) {
    return {
      analysis: {
        detectedTopic: 'Agency Partnership & Collaboration',
        intent: 'Partnership Exploration',
        isPackageRelated: true
      },
      answer: `We welcome partnerships with ambitious local businesses, growing startups, and established brands. We keep our collaboration simple, grounded, and transparent—with direct access to our creative team and clear upfront pricing.`,
      pageRedirect: {
        type: 'page',
        page: 'partner',
        label: 'Open Partner With Akaar Page'
      },
      suggestedPackage: {
        title: 'Creative Partnership Sprint',
        priceRange: 'Flexible / Based on Scope',
        service: 'Brand Partnership',
        budgetTier: 'Starter to Enterprise',
        summary: 'Direct collaboration with our creative strategists and designers tailored to your specific goals and budget.'
      },
      quickReplies: ['How partnering works', 'Do I need a big budget?', 'Start a partnership form']
    };
  }

  // 2. FAQ / Project Questions
  if (
    clean.includes('faq') ||
    clean.includes('frequently asked') ||
    clean.includes('common questions') ||
    clean.includes('how does it work')
  ) {
    return {
      analysis: {
        detectedTopic: 'Frequently Asked Questions & Project Guide',
        intent: 'FAQ Exploration',
        isPackageRelated: false
      },
      answer: `We’ve answered the most frequent client queries on our page—covering **video editing packages**, commercial **shoot equipment**, 24–48 hour **turnaround SLAs**, **2 review rounds**, and monthly **creative retainers**.

You can review the interactive FAQ section directly at the bottom of our page.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'faq',
        label: 'View Frequently Asked Questions (Go to #faq)'
      },
      suggestedPackage: {
        title: 'Project Scope Brief',
        priceRange: 'From ₹25,000',
        service: 'Creative Strategy',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Have a specific scope question? Brief our directors directly.',
        ctaLabel: 'Open Give Akaar (Brief Us)'
      },
      quickReplies: ['Video Editing Packages', 'Video Shoot Pricing', 'Where are your studios?']
    };
  }

  // 3. Blogs & Insights
  if (
    clean.includes('blog') ||
    clean.includes('article') ||
    clean.includes('insight') ||
    clean.includes('journal') ||
    clean.includes('reading') ||
    clean.includes('thought leadership')
  ) {
    return {
      analysis: {
        detectedTopic: 'Akaar Insights & Blogs',
        intent: 'Blog Reading & Publishing',
        isPackageRelated: false
      },
      answer: `Explore **Akaar Insights & Blogs**! Our directors share strategic breakdowns on creator micro-communities, high-retention audio mastering, and 48-hour commercial shoot workflows.

You can also write and publish your own articles directly in the blog section using the **Write & Add Blog** button.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'blogs',
        label: 'Explore Insights & Blogs (Go to #blogs)'
      },
      quickReplies: ['Show me past work (#work)', 'Where are your studios?', 'What services do you offer?']
    };
  }

  // 3. Case Studies, Portfolio, Past Work & Campaigns
  if (
    clean.includes('case stud') ||
    clean.includes('work') ||
    clean.includes('portfolio') ||
    clean.includes('campaign') ||
    clean.includes('example') ||
    clean.includes('project you did') ||
    clean.includes('what have you made') ||
    clean.includes('previous work')
  ) {
    return {
      analysis: {
        detectedTopic: 'Client Case Studies & Past Campaigns',
        intent: 'Portfolio & Creative Proof',
        isPackageRelated: false
      },
      answer: `We've crafted high-impact cultural moments and digital campaigns for brands like **Tyro Payments**, **Uber Moto**, **Swiggy Instamart**, and **Tinder India**. 

Our portfolio covers everything from viral reel series and documentary films to full 360° brand identity transformations. You can explore full video case studies and metrics directly on our Work section.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'work',
        label: 'Explore Case Studies on Page (Go to #work)'
      },
      suggestedPackage: {
        title: 'Creative Content Sprint',
        priceRange: '₹50,000 – ₹1,00,000',
        service: 'Content Production',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Inspired by our past work? Let’s design a case-study worthy campaign for your brand.',
        ctaLabel: 'Scope Project (Give Akaar Tab)'
      },
      quickReplies: ['Watch Showreel', 'Who are your clients?', 'What services do you offer?']
    };
  }

  // 3. Showreel / Video Highlights
  if (
    clean.includes('showreel') ||
    clean.includes('reel') && (clean.includes('watch') || clean.includes('video') || clean.includes('show'))
  ) {
    return {
      analysis: {
        detectedTopic: 'Agency 2025 Showreel',
        intent: 'Interactive Video Preview',
        isPackageRelated: false
      },
      answer: `Our showreel showcases our latest cinematic cuts, creator collaborations, and visual productions from the Pune and Mumbai studios. You can launch the interactive full-screen player right away.`,
      pageRedirect: {
        type: 'modal',
        modal: 'showreel',
        label: 'Watch Interactive Showreel (Full Screen)'
      },
      suggestedPackage: {
        title: 'Cinematic Video Package',
        priceRange: '₹50,000 – ₹1,00,000',
        service: 'Video Shoot',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Want visuals like in our showreel? You can brief our production team directly.',
        ctaLabel: 'Brief Us for Video'
      },
      quickReplies: ['View Case Studies (#work)', 'Video Shoot Pricing', 'Where is your studio?']
    };
  }

  // 4. Studios, Locations & Addresses (Pune & Mumbai)
  if (
    clean.includes('where') ||
    clean.includes('location') ||
    clean.includes('pune') ||
    clean.includes('mumbai') ||
    clean.includes('address') ||
    clean.includes('office') ||
    clean.includes('studio') ||
    clean.includes('visit')
  ) {
    return {
      analysis: {
        detectedTopic: 'Physical Studio Locations',
        intent: 'Office Inquiry & Studio Visit',
        isPackageRelated: false
      },
      answer: `Akaar operates two creative studios in Maharashtra:

• **Pune Studio (HQ):** Level 4, Akaar Creative Hub, FC Road, Shivaji Nagar, Pune — houses our Video Editing Lab, Motion Graphics team, and Audio recording booth.
• **Mumbai Studio:** 5th Floor, Media Bay, Linking Road, Bandra West, Mumbai — home to our commercial shoot floors, creator casting room, and experiential activations.

You can view complete maps, visiting hours, and studio contact details in our footer section.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'offices',
        label: 'View Studio Details on Page (Go to #offices)'
      },
      suggestedPackage: {
        title: 'Studio Shoot & Edit Day',
        priceRange: '₹50,000 – ₹1,00,000',
        service: 'Video Shoot',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Reserve studio shoot floors or edit bays in Pune or Mumbai.',
        ctaLabel: 'Book Studio (Give Akaar Tab)'
      },
      quickReplies: ['What services do you offer?', 'Contact Phone Number', 'Our Clients']
    };
  }

  // 5. Agency Divisions & Services Overview
  if (
    clean.includes('service') ||
    clean.includes('capabilities') ||
    clean.includes('what do you do') ||
    clean.includes('what can you do') ||
    clean.includes('divisions') ||
    clean.includes('offer')
  ) {
    return {
      analysis: {
        detectedTopic: 'Agency Capabilities & Divisions',
        intent: 'Services Overview',
        isPackageRelated: false
      },
      answer: `We are a creative agency structured across 7 specialized divisions:

1. **Video Production & Shoots** (Cinema 4K/6K multi-cam crews in Pune & Mumbai)
2. **High-Retention Video Editing** (Kinetic pacing, sound design, hooks)
3. **Creative Strategy** (Brand positioning, viral concepts, cultural angles)
4. **Content Production** (3D motion graphics, commercial photography)
5. **Social Media & Paid Performance** (Paid ad scaling and community building)
6. **Talent & Influencer Sourcing** (Creator contracts and celebrity amplification)
7. **Experiential Events & Cultural PR**

You can inspect the full interactive breakdown of each division on our Brands section.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'brands',
        label: 'Inspect All 7 Divisions (Go to #brands)'
      },
      suggestedPackage: {
        title: 'Custom Brand Retainer',
        priceRange: '₹1,00,000 – ₹2,50,000',
        service: 'Creative Strategy',
        budgetTier: 'Rs 1,00,000 - Rs 2,50,000',
        summary: 'Need a dedicated creative team handling multiple services each month?',
        ctaLabel: 'Explore Retainer in Give Akaar'
      },
      quickReplies: ['Video Editing details', 'Video Shoot details', 'View Case Studies (#work)']
    };
  }

  // 6. Influencer Selected Partners
  if (
    clean.includes('influencer partner') ||
    clean.includes('selected partner') ||
    clean.includes('influencer selected') ||
    clean.includes('redbull') ||
    clean.includes('decathlon') ||
    clean.includes('converse') ||
    clean.includes('lenskart') ||
    clean.includes('being human') ||
    clean.includes('jack & jones') ||
    clean.includes('cottonworld') ||
    clean.includes('snapchat') ||
    clean.includes('jbl') ||
    clean.includes('urban monkey') ||
    clean.includes('comet') ||
    clean.includes('pune university') ||
    clean.includes('bpcl') ||
    clean.includes('mak lubricants')
  ) {
    return {
      analysis: {
        detectedTopic: 'Influencer Selected Partners (30+ Brands)',
        intent: 'Creator & Brand Collaborations',
        isPackageRelated: false
      },
      answer: `Our creator squad partners with 30+ category-defining brands for influencer marketing, shoots, and cultural campaigns—including **RedBull, Decathlon, Converse, Lenskart, Being Human, Jack & Jones, Cottonworld, Snapchat, JBL, Urban Monkey, Comet, BPCL / Mak Lubricants, Pune University**, and more!
      
You can explore the live Marquee Ticker and interactive Grid in the **Influencer Selected Partners** section.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'influencer-partners',
        label: 'Explore 30+ Influencer Selected Partners (Go to #influencer-partners)'
      },
      suggestedPackage: {
        title: 'Influencer Campaign Sprint',
        priceRange: '₹50,000 – ₹1,00,000',
        service: 'Creator & Influencer Marketing',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Activate high-impact creator campaigns and talent partnerships tailored to your niche.',
        ctaLabel: 'Brief Us for Influencer Campaigns'
      },
      quickReplies: ['Video Editing Packages', 'Video Shoot Pricing', 'Where is your studio?']
    };
  }

  // 7. Clients & Enterprise Brand Roster
  if (
    clean.includes('client') ||
    clean.includes('brand') ||
    clean.includes('who trusts you') ||
    clean.includes('partners')
  ) {
    return {
      analysis: {
        detectedTopic: 'Client Ecosystem & Enterprise Onboarding',
        intent: 'Brand Validation & Industry Credibility',
        isPackageRelated: false
      },
      answer: `We are currently curating and onboarding our next 2025–2026 cohort of enterprise client partners in the **Client Ecosystem**. Meanwhile, over 30 leading brands are actively featured in our **Influencer Selected Partners** section above it!`,
      pageRedirect: {
        type: 'section',
        sectionId: 'clients',
        label: 'View Client Ecosystem (Go to #clients)'
      },
      suggestedPackage: {
        title: 'Partner With Akaar',
        priceRange: 'Starting from ₹50,000',
        service: 'Creative Strategy',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Ready to join our upcoming roster of enterprise brand partners?',
        ctaLabel: 'Submit Brand Brief (Give Akaar)'
      },
      quickReplies: ['Influencer Selected Partners', 'Read CMO Reviews (#testimonials)', 'View Case Studies (#work)']
    };
  }

  // 7. Testimonials & Client Reviews
  if (
    clean.includes('testimonial') ||
    clean.includes('review') ||
    clean.includes('feedback') ||
    clean.includes('rating') ||
    clean.includes('cmo')
  ) {
    return {
      analysis: {
        detectedTopic: 'CMO Feedback & Testimonials',
        intent: 'Client Validation & Satisfaction',
        isPackageRelated: false
      },
      answer: `CMOs and brand leaders highlight our ability to turn complex product propositions into culturally resonant stories that convert. 

Clients frequently commend our fast delivery cycles, transparent communication, and high-retention post-production. You can read verified client statements in our Testimonials slider.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'testimonials',
        label: 'Read CMO Testimonials (Go to #testimonials)'
      },
      suggestedPackage: {
        title: 'Growth Partnership',
        priceRange: '₹1,00,000 – ₹2,50,000',
        service: 'Creative Strategy',
        budgetTier: 'Rs 1,00,000 - Rs 2,50,000',
        summary: 'Let’s achieve award-winning results for your next marketing quarter.',
        ctaLabel: 'Brief Our Team'
      },
      quickReplies: ['Explore Case Studies (#work)', 'Where are your studios?', 'How do you work?']
    };
  }

  // 8. Turnaround Times, Speed & Revision Process
  if (
    clean.includes('turnaround') ||
    clean.includes('time') ||
    clean.includes('fast') ||
    clean.includes('deadline') ||
    clean.includes('how long') ||
    clean.includes('process') ||
    clean.includes('revision')
  ) {
    return {
      analysis: {
        detectedTopic: 'Workflow, Timelines & Delivery Speed',
        intent: 'Process & SLA Evaluation',
        isPackageRelated: false
      },
      answer: `We design our workflows around modern social timelines:

• **Reels & Short-Form Video Edits:** Initial cuts delivered in 24 to 48 hours.
• **Studio Shoots:** Final master package delivered within 3 to 5 business days post-wrap.
• **Full Brand Campaigns:** 2 to 3 weeks including script, pre-production, filming, and distribution assets.
• **Revisions:** Every project includes 2 rounds of creative revisions to ensure it hits your exact vision.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'brands',
        label: 'Review Production Workflows (Go to #brands)'
      },
      suggestedPackage: {
        title: 'Sprint Delivery Package',
        priceRange: '₹25,000 – ₹50,000',
        service: 'Video Editing',
        budgetTier: 'Rs 25,000 - Rs 50,000',
        summary: 'Need rapid delivery for an upcoming product launch or event?',
        ctaLabel: 'Submit Fast-Track Brief (Give Akaar)'
      },
      quickReplies: ['Video Editing Package', 'Video Shoot Package', 'Pune Studio Address']
    };
  }

  // 9. Weekly Drip Newsletter
  if (
    clean.includes('newsletter') ||
    clean.includes('weekly drip') ||
    clean.includes('subscribe') ||
    clean.includes('insights') ||
    clean.includes('tips')
  ) {
    return {
      analysis: {
        detectedTopic: 'The Weekly Drip Newsletter',
        intent: 'Content Subscription & Knowledge',
        isPackageRelated: false
      },
      answer: `We write **The Weekly Drip**—our Friday newsletter dissecting internet culture, viral campaign breakdowns, and growth tactics read by 14,000+ founders and marketers. 

It is completely free with zero spam. You can sign up directly on the newsletter section of our page.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'newsletter',
        label: 'Jump to Newsletter Form (Go to #newsletter)'
      },
      // Note: No package suggested here because user just wants the newsletter!
      quickReplies: ['View Case Studies (#work)', 'Where are your studios?', 'What services do you offer?']
    };
  }

  // 10. Advanced Query: Video Editing Package / Pricing
  if (
    clean.includes('edit') ||
    clean.includes('editing') ||
    clean.includes('reels') ||
    clean.includes('shorts') ||
    clean.includes('youtube')
  ) {
    const isPricingSpecific =
      clean.includes('package') ||
      clean.includes('price') ||
      clean.includes('cost') ||
      clean.includes('how much') ||
      clean.includes('rate') ||
      clean.includes('quote') ||
      clean.includes('budget');

    return {
      analysis: {
        detectedTopic: 'High-Retention Video Editing',
        intent: isPricingSpecific ? 'Video Editing Package & Pricing' : 'Video Editing Capability Details',
        isPackageRelated: true
      },
      answer: `Our video editing division specializes in high-retention social content. We craft sharp visual hooks in the first 3 seconds, kinetic motion text, licensed audio tracks, and broadcast-grade color grading for Reels, TikTok, Shorts, and long-form YouTube documentaries.

You can inspect our post-production process on our Brands section.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'brands',
        label: 'View Video Editing Division (Go to #brands)'
      },
      suggestedPackage: {
        title: 'High-Retention Video Editing Package',
        priceRange: '₹25,000 – ₹50,000',
        service: 'Video Editing',
        budgetTier: 'Rs 25,000 - Rs 50,000',
        summary: 'Includes 8–12 optimized reels/shorts with hooks, kinetic titles, sound design, and 48-hour turnarounds.',
        ctaLabel: 'Lock In Video Editing Package (Give Akaar Tab)'
      },
      quickReplies: ['What about Video Shoots?', 'What is turnaround time?', 'Explore Case Studies (#work)']
    };
  }

  // 11. Advanced Query: Video Shoot & Commercial Production
  if (
    clean.includes('shoot') ||
    clean.includes('filming') ||
    clean.includes('production') ||
    clean.includes('camera') ||
    clean.includes('commercial') ||
    clean.includes('dop')
  ) {
    const isPricingSpecific =
      clean.includes('package') ||
      clean.includes('price') ||
      clean.includes('cost') ||
      clean.includes('how much') ||
      clean.includes('rate') ||
      clean.includes('quote') ||
      clean.includes('budget');

    return {
      analysis: {
        detectedTopic: 'Commercial Video Shoot & Production',
        intent: isPricingSpecific ? 'Shoot Production Package & Pricing' : 'Shoot Capabilities & Equipment',
        isPackageRelated: true
      },
      answer: `Our production crew provides cinema 4K/6K camera rigs, professional lighting setups, gaffers, audio engineers, and art direction on location or inside our Pune and Mumbai soundstages.

Whether you need a creator day shoot or a multi-day commercial advertising film, we take care of casting, styling, filming, and direction.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'brands',
        label: 'View Production Division (Go to #brands)'
      },
      suggestedPackage: {
        title: 'Shoot + Edit Production Package',
        priceRange: '₹50,000 – ₹1,00,000',
        service: 'Video Shoot',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: '1 full shoot day with DoP, lighting kit, wireless sound, plus complete post-production and grading.',
        ctaLabel: 'Book Video Shoot Package (Give Akaar Tab)'
      },
      quickReplies: ['Video Editing Package', 'Where is Pune Studio?', 'View Case Studies (#work)']
    };
  }

  // 12. Advanced Query: General Package, Pricing, Hiring, or Custom Quote
  if (
    clean.includes('package') ||
    clean.includes('packages') ||
    clean.includes('price') ||
    clean.includes('pricing') ||
    clean.includes('cost') ||
    clean.includes('how much') ||
    clean.includes('rate') ||
    clean.includes('hire') ||
    clean.includes('quote') ||
    clean.includes('budget') ||
    clean.includes('estimate') ||
    clean.includes('retainer')
  ) {
    return {
      analysis: {
        detectedTopic: 'Agency Production Tiers & Rates',
        intent: 'Package Evaluation & Project Onboarding',
        isPackageRelated: true
      },
      answer: `We structure our engagements around flexible project sprints and monthly creative retainers:

• **Starter Content / Editing Sprint:** ₹25,000 – ₹50,000 for rapid social video packs.
• **Shoot + Post-Production Package:** ₹50,000 – ₹1,00,000 for studio/location shoot days + finished deliverables.
• **Monthly Growth Retainer:** ₹1,00,000 – ₹2,50,000 for ongoing multi-channel strategy, regular shoots, and content cadence.
• **Full Brand Commercial Campaign:** ₹2,50,000 – ₹10,00,000+ for 360° enterprise brand productions.

To get an accurate proposal tailored to your specific goals, the best route is our Brief Us form.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'brands',
        label: 'Compare Capabilities (Go to #brands)'
      },
      suggestedPackage: {
        title: 'Tailored Agency Project Scope',
        priceRange: 'Custom Estimate (From ₹25,000)',
        service: 'Creative Strategy',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Tell us your exact goals and our studio leads will deliver a customized proposal within 24 hours.',
        ctaLabel: 'Open Give Akaar — Brief Us Form'
      },
      quickReplies: ['Video Editing Package', 'Video Shoot Package', 'Pune & Mumbai Studios']
    };
  }

  // 13. Contact Details / Direct Phone & Email
  if (
    clean.includes('contact') ||
    clean.includes('phone') ||
    clean.includes('email') ||
    clean.includes('number') ||
    clean.includes('call')
  ) {
    return {
      analysis: {
        detectedTopic: 'Studio Contact Channels',
        intent: 'Direct Communication',
        isPackageRelated: false
      },
      answer: `You can reach our team directly via:

• **Email:** \`akaar.entertainment@gmail.com\`
• **Studio Phones:** +91 98220 12389 / +91 98200 45678
• **Working Hours:** Monday to Saturday, 10:00 AM – 7:30 PM IST

You can also view our full office directory and studio maps at the bottom of the page.`,
      pageRedirect: {
        type: 'section',
        sectionId: 'offices',
        label: 'View Contact & Offices (Go to #offices)'
      },
      suggestedPackage: {
        title: 'Direct Creative Consultation',
        priceRange: 'Free Scope Review',
        service: 'Creative Strategy',
        budgetTier: 'Rs 50,000 - Rs 1,00,000',
        summary: 'Prefer a structured discussion? Submit your brief for an assigned Client Partner call.',
        ctaLabel: 'Submit Project Brief'
      },
      quickReplies: ['Where are your studios?', 'View Case Studies (#work)', 'Video Editing Package']
    };
  }

  // 14. Default Conversational Fallback with Precise Multi-Intent Analysis
  return {
    analysis: {
      detectedTopic: 'General Inquiry',
      intent: 'Exploratory Discussion',
      isPackageRelated: false
    },
    answer: `I can help guide you across our work and studio resources:

• **Explore Past Work:** View video case studies for Uber, Swiggy, and Tinder in **#work**.
• **Capabilities:** Discover our Video Shoot, Video Editing, Strategy, and Social divisions in **#brands**.
• **Studios:** Find our Pune (FC Road) and Mumbai (Bandra West) studio addresses in **#offices**.
• **Packages:** When you're ready, I can help you scope a video shoot or editing package.

What would you like to explore first?`,
    pageRedirect: {
      type: 'section',
      sectionId: 'brands',
      label: 'Explore Our Capabilities (Go to #brands)'
    },
    suggestedPackage: {
      title: 'Akaar Creative Package',
      priceRange: 'From ₹25,000',
      service: 'Creative Strategy',
      budgetTier: 'Rs 50,000 - Rs 1,00,000',
      summary: 'Have a specific brand brief in mind? Jump to our brief tab whenever you wish.',
      ctaLabel: 'Open Give Akaar (Brief Us)'
    },
    quickReplies: [
      'Show me past work (#work)',
      'Where are your studios?',
      'Video Editing packages',
      'What is your turnaround time?'
    ]
  };
}
