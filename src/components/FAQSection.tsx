import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  category: 'Packages & Pricing' | 'Video & Shoots' | 'Workflow & Delivery' | 'Retainers & Contracts';
  answer: string;
  recommendedService?: string;
  recommendedBudget?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'What packages do you offer for video editing and commercial shoots?',
    category: 'Packages & Pricing',
    answer:
      'We structure video solutions across three primary tiers: Starter Social Video Editing packs (₹25,000–₹50,000 for 8–12 high-retention reels/shorts with sound design & hooks), Full Studio/Location Shoot + Edit packages (₹50,000–₹1,00,000 with camera crew, lighting, audio & post-production), and Dedicated Monthly Creative Retainers (₹1,00,000–₹2,50,000+ for ongoing high-volume brand production). You can lock in your desired tier directly in the Give Akaar — Brief Us form.',
    recommendedService: 'Video Editing',
    recommendedBudget: 'Rs 50,000 - Rs 1,00,000',
  },
  {
    id: 'faq-2',
    question: 'How does the project process work once I submit the Give Akaar — Brief Us form?',
    category: 'Workflow & Delivery',
    answer:
      'Once you submit the Give Akaar — Brief Us form, our creative directors review your scope within 4 to 12 hours. We schedule a 20-minute alignment call to finalize the creative treatment, storyboard, and deliverables list. Upon signing the project sprint agreement, our Pune or Mumbai studio team begins pre-production immediately.',
    recommendedService: 'Creative Strategy',
    recommendedBudget: 'Rs 50,000 - Rs 1,00,000',
  },
  {
    id: 'faq-3',
    question: 'What are your turnaround times for video editing, shoots, and campaigns?',
    category: 'Workflow & Delivery',
    answer:
      'Turnaround times depend on project scale: Short-form video editing (Reels, TikToks, Shorts) has a rapid 24 to 48-hour delivery window. Full commercial video shoots are mastered and delivered within 3 to 5 business days post-wrap. Comprehensive 360° brand advertising campaigns typically run on a 2 to 3-week sprint cycle including casting, location scouting, and grading.',
    recommendedService: 'Video Editing',
    recommendedBudget: 'Rs 25,000 - Rs 50,000',
  },
  {
    id: 'faq-4',
    question: 'What is included in an Akaar Video Shoot package?',
    category: 'Video & Shoots',
    answer:
      'Every shoot package includes our professional camera crew (Director of Photography, Camera Operator, Gaffer, and Audio Engineer), cinema 4K/6K camera rigs, wireless Sennheiser/Røde audio systems, cinematic lighting kit, art direction, and studio soundstage access in Pune (FC Road) or Mumbai (Bandra West), followed by complete color grading and master export.',
    recommendedService: 'Video Shoot',
    recommendedBudget: 'Rs 50,000 - Rs 1,00,000',
  },
  {
    id: 'faq-5',
    question: 'Can we hire Akaar on a monthly retainer instead of one-off projects?',
    category: 'Retainers & Contracts',
    answer:
      'Yes! Over 60% of our partner brands work on monthly creative retainers. Retainers guarantee prioritized studio shoot days, a dedicated post-production squad, bi-weekly performance reviews, and predictable monthly content drops without having to negotiate separate contracts for every asset.',
    recommendedService: 'Creative Strategy',
    recommendedBudget: 'Rs 1,00,000 - Rs 2,50,000',
  },
  {
    id: 'faq-6',
    question: 'How many revisions are included in our project scope?',
    category: 'Workflow & Delivery',
    answer:
      'Every project milestone includes 2 structured rounds of creative revisions. We use timestamped review tools (Frame.io) where your stakeholders can drop exact notes and frame comments directly onto the video cuts to ensure fast, frictionless turnaround.',
    recommendedService: 'Content Production',
    recommendedBudget: 'Rs 50,000 - Rs 1,00,000',
  },
  {
    id: 'faq-7',
    question: 'Can you shoot on location at our office or outside Pune/Mumbai?',
    category: 'Video & Shoots',
    answer:
      'Absolutely. While our primary soundstages are in Pune and Mumbai, our traveling production crews frequently deploy across Delhi, Bengaluru, Goa, Hyderabad, and international locations. We manage all travel logistics, permits, and equipment transit seamlessly.',
    recommendedService: 'Video Shoot',
    recommendedBudget: 'Rs 1,00,000 - Rs 2,50,000',
  },
  {
    id: 'faq-8',
    question: 'How do we get started with a customized project quotation?',
    category: 'Packages & Pricing',
    answer:
      'Simply click the "Give Akaar — Brief Us" button, select the capabilities you need (such as Video Shoot, Video Editing, or Creative Strategy), outline your approximate budget and timeline, and our studio director will send a tailored proposal with itemized deliverables within 24 hours.',
    recommendedService: 'Creative Strategy',
    recommendedBudget: 'Rs 50,000 - Rs 1,00,000',
  },
];

const CATEGORIES = [
  'All Queries',
  'Packages & Pricing',
  'Video & Shoots',
  'Workflow & Delivery',
  'Retainers & Contracts',
] as const;

interface FAQSectionProps {
  onOpenBriefUs: (options?: { service?: string; budget?: string; message?: string }) => void;
  onOpenChatbot?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBriefUs, onOpenChatbot }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Queries');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs =
    selectedCategory === 'All Queries'
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-black text-white overflow-hidden border-t border-neutral-900 scroll-mt-24">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#F9CE00]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[#F9CE00] text-xs font-mono mb-4 tracking-wider uppercase">
            <span>Project Intelligence & Answers</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-black uppercase tracking-tight text-white mb-6 leading-tight">
            Frequently Asked <span className="text-[#F9CE00]">Questions</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our production workflows, studio locations, package tiers, and how to kick off a project with Akaar.
          </p>

          {/* Category Filter Pills - Mobile & Desktop friendly */}
          <div className="flex items-center sm:justify-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 mt-8 max-w-full touch-pan-x">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`faq-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono transition-all min-h-[38px] cursor-pointer touch-manipulation ${
                    isActive
                      ? 'bg-[#F9CE00] text-black font-bold shadow-md shadow-[#F9CE00]/20'
                      : 'bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div id="faq-accordion" className="max-w-4xl mx-auto space-y-3 mb-14">
          {filteredFaqs.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={`faq-item-${item.id}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-neutral-950 border-[#F9CE00]/40 shadow-xl shadow-black/60'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <button
                  id={`faq-btn-${item.id}`}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-syne font-bold text-white group-hover:text-[#F9CE00] transition-colors leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all mt-1 ${
                      isOpen
                        ? 'bg-[#F9CE00] text-black border-[#F9CE00] rotate-180'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 group-hover:text-white group-hover:border-neutral-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-content-${item.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-900 space-y-4">
                        <p>{item.answer}</p>

                        {/* Inline Brief Us action bridge */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
                          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F9CE00]" />
                            <span>Relevant capability: <strong className="text-white">{item.recommendedService}</strong></span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenBriefUs({
                                service: item.recommendedService,
                                budget: item.recommendedBudget,
                                message: `Inquiry regarding FAQ: "${item.question}"`,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-syne font-bold text-[#F9CE00] hover:text-white transition-colors underline decoration-[#F9CE00]/40 hover:decoration-white"
                          >
                            <span>Brief us on this capability</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
