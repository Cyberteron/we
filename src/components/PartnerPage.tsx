import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Clock,
  ShieldCheck,
  Zap,
  Handshake,
  Layers,
  Video,
  Globe,
  Palette,
  Megaphone,
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
  Calendar,
  Building2,
} from 'lucide-react';
import { sanitizeInput } from '../utils/security';

interface PartnerPageProps {
  onBack: () => void;
  onOpenContactModal?: () => void;
}

interface PartnershipInquiry {
  name: string;
  email: string;
  phone: string;
  brand: string;
  services: string[];
  budgetRange: string;
  timeline: string;
  message: string;
}

export const PartnerPage: React.FC<PartnerPageProps> = ({ onBack, onOpenContactModal }) => {
  const [formData, setFormData] = useState<PartnershipInquiry>({
    name: '',
    email: '',
    phone: '',
    brand: '',
    services: ['Brand & Visual Identity'],
    budgetRange: 'Flexible / Let’s Discuss',
    timeline: 'Within 2–4 Weeks',
    message: '',
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const servicesList = [
    { id: 'brand', label: 'Brand & Visual Identity', icon: Palette },
    { id: 'social', label: 'Social Media & Content', icon: Video },
    { id: 'web', label: 'Website & Digital Experience', icon: Globe },
    { id: 'ads', label: 'Campaigns & Advertising', icon: Megaphone },
    { id: 'creators', label: 'Creator & Influencer Partnerships', icon: Handshake },
    { id: 'retainer', label: 'Full Monthly Creative Retainer', icon: Layers },
  ];

  const budgetOptions = [
    'Starter / Small Project',
    'Growing Brand (Mid-Scale)',
    'Enterprise / Comprehensive',
    'Flexible / Let’s Discuss',
  ];

  const timelineOptions = [
    'Immediate (Next 7–14 Days)',
    'Within 2–4 Weeks',
    'Planning Ahead (1–2 Months)',
    'Ongoing Partnership',
  ];

  const faqs = [
    {
      q: 'Do we need to be a large company to partner with Akaar?',
      a: 'Not at all. We believe the best creative work happens when working closely with passionate founders, growing businesses, and local creators. Whether you are launching your first product or scaling an established brand, our partnership models adapt to where you are.',
    },
    {
      q: 'How does the partnership kick off?',
      a: 'We keep things very simple. You send us a short message or submit the form on this page. We then hop on a friendly 20-minute discovery call to listen to your goals, review what you need, and send you a straightforward proposal with fixed timelines and clear deliverables.',
    },
    {
      q: 'Can we start with a small test project first?',
      a: 'Yes, absolutely. Many of our strongest long-term partnerships started with a single focused project—such as a visual identity refresh, a 3-part video reel series, or a high-converting landing page. Once you see the work and our communication style, we can expand together.',
    },
    {
      q: 'How will we communicate during our project?',
      a: 'You get direct access to the creative team working on your brand—no multi-layered account managers or endless phone tags. We use a shared Slack or WhatsApp channel for quick questions, alongside organized weekly milestone check-ins.',
    },
    {
      q: 'Who owns the final creative assets and code?',
      a: 'You do. Upon project completion and final sign-off, all source designs, original high-resolution video exports, and web assets belong 100% to your brand with zero hidden licensing fees.',
    },
  ];

  const handleToggleService = (serviceName: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceName);
      if (exists) {
        if (prev.services.length === 1) return prev; // Keep at least one
        return { ...prev, services: prev.services.filter((s) => s !== serviceName) };
      }
      return { ...prev, services: [...prev.services, serviceName] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.brand.trim()) {
      setErrorMsg('Please enter your name, email address, and brand name.');
      return;
    }

    setSubmitting(true);

    try {
      // Clean and sanitize input
      const sanitizedPayload = {
        id: `partner-req-${Date.now()}`,
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        brand: sanitizeInput(formData.brand),
        services: formData.services.map((s) => sanitizeInput(s)),
        budgetRange: sanitizeInput(formData.budgetRange),
        timeline: sanitizeInput(formData.timeline),
        message: sanitizeInput(formData.message),
        createdAt: new Date().toISOString(),
      };

      // Save to inquiries pipeline so admin can view
      const existingInquiries = JSON.parse(localStorage.getItem('akaar_partner_inquiries') || '[]');
      localStorage.setItem(
        'akaar_partner_inquiries',
        JSON.stringify([sanitizedPayload, ...existingInquiries])
      );

      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 600);
    } catch {
      setSubmitting(false);
      setErrorMsg('An unexpected error occurred. Please reach us directly via email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 selection:bg-[#F9CE00] selection:text-black">
      {/* Top Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-[#070707]/90 backdrop-blur-md border-b border-neutral-850 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            id="partner-page-back-btn"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-syne font-bold uppercase tracking-wider text-neutral-400 hover:text-[#F9CE00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back To Agency Home</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-500 uppercase tracking-widest">
              Partnership Inquiries Open
            </span>
            <a
              href="#inquiry-form"
              id="partner-page-nav-apply-btn"
              className="px-4 py-2 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md shadow-[#F9CE00]/10"
            >
              Start A Conversation
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-neutral-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#F9CE00]/10 via-[#F9CE00]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-[#F9CE00] text-xs font-mono uppercase tracking-wider mb-6">
            <span>Honest Collaboration &bull; Real Results</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-black uppercase text-white tracking-tight leading-[1.1] mb-6">
            Partner With <span className="text-[#F9CE00]">Akaar Agency</span>
          </h1>

          {/* Simple, grounded, non-corporate description */}
          <p className="text-base sm:text-xl text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto mb-10">
            Whether you&apos;re an ambitious local brand, a growing startup, or an established business looking for fresh creative ideas, we&apos;d love to work together. We help businesses create standout campaigns, social content, and experiences that actually connect with real people.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquiry-form"
              id="hero-scroll-inquiry-btn"
              className="px-8 py-4 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-xl shadow-[#F9CE00]/10"
            >
              <span>Tell Us About Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#how-it-works"
              id="hero-scroll-process-btn"
              className="px-7 py-4 rounded-full bg-neutral-900 text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-syne font-bold uppercase tracking-wider transition-all"
            >
              How Partnering Works
            </a>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-16 sm:mt-20">
          {[
            {
              title: 'Direct Creative Team',
              desc: 'Speak directly with the designers and strategists executing your vision.',
              icon: MessageSquare,
            },
            {
              title: 'No Jargon or Hidden Fees',
              desc: 'Straightforward estimates, honest recommendations, and zero surprises.',
              icon: ShieldCheck,
            },
            {
              title: 'Flexible Engagements',
              desc: 'Start with a one-time project or scale into an ongoing monthly partnership.',
              icon: Layers,
            },
            {
              title: 'Fast & Reliable Launch',
              desc: 'Agile sprints with weekly milestones so your work launches on schedule.',
              icon: Zap,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-850 flex flex-col justify-between"
            >
              <item.icon className="w-5 h-5 text-[#F9CE00] mb-3" />
              <div>
                <h2 className="text-sm font-syne font-bold text-white mb-1.5 uppercase">
                  {item.title}
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* How It Works (Simple 4 Steps) */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-mono text-[#F9CE00] uppercase tracking-widest block mb-2">
              Our Simple Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight mb-3">
              How Partnering Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              We eliminated bureaucratic agency red tape. Partnering with us is clear, fast, and structured around your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Say Hello',
                desc: 'Fill out our short form or reach out with your vision, target timeline, and the challenges you want to solve.',
              },
              {
                step: '02',
                title: '20-Min Discovery',
                desc: 'We get on a quick chat to understand your brand, clarify priorities, and see if we are the right match.',
              },
              {
                step: '03',
                title: 'Clear Roadmap',
                desc: 'You receive a clear proposal with explicit deliverables, milestones, and a fixed, fair quote.',
              },
              {
                step: '04',
                title: 'Build & Launch',
                desc: 'We execute the creative work, share drafts for feedback, and help you launch and measure impact.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 relative flex flex-col justify-between"
              >
                <div className="text-3xl font-syne font-black text-[#F9CE00]/30 mb-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-base font-syne font-bold uppercase text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Can Collaborate On */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-mono text-[#F9CE00] uppercase tracking-widest block mb-2">
              Partnership Scopes
            </span>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight mb-3">
              Ways We Can Work Together
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              Tailored creative solutions built for commercial impact—choose a single area or combine them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: 'Brand Identity',
                desc: 'Logo design, typography pairing, color psychology, packaging, and brand books that give your company a recognizable face.',
                tags: ['Visual Identity', 'Packaging', 'Guidelines'],
              },
              {
                icon: Video,
                title: 'Social & Video Content',
                desc: 'Short-form Reels, TikToks, YouTube shorts, and photography shot and edited specifically for modern social feeds.',
                tags: ['Reels / Shorts', 'Photography', 'Feed Strategy'],
              },
              {
                icon: Globe,
                title: 'Websites & Digital',
                desc: 'Fast, responsive websites that tell your story clearly and make it effortless for your customers to take action.',
                tags: ['UI/UX Design', 'Modern Code', 'Mobile Ready'],
              },
              {
                icon: Megaphone,
                title: 'Launch Campaigns',
                desc: 'Cohesive multi-channel campaigns for product launches, seasonal promotions, or brand repositioning.',
                tags: ['Campaign Creative', 'Ad Concepts', 'Print & Digital'],
              },
              {
                icon: Handshake,
                title: 'Creator Activations',
                desc: 'Connecting your brand with relevant, authentic creators who have real trust with their communities.',
                tags: ['Influencer Match', 'Gifting / Paid', 'Deliverable Review'],
              },
              {
                icon: Layers,
                title: 'Monthly Retainer',
                desc: 'An ongoing extension of your internal marketing team handling continuous creative needs every month.',
                tags: ['Dedicated Hours', 'Priority Queue', 'Flexible Needs'],
              },
            ].map((collab, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#F9CE00]/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-[#F9CE00] mb-4">
                    <collab.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-syne font-bold uppercase text-white mb-2">
                    {collab.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-6">
                    {collab.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {collab.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono text-[#F9CE00] uppercase tracking-widest block mb-2">
              Get In Touch
            </span>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight mb-3">
              Start Your Partnership
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
              Tell us what you have in mind. We respond to every inquiry within 24 business hours.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl relative overflow-hidden">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#F9CE00]/10 border border-[#F9CE00]/30 text-[#F9CE00] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-syne font-black uppercase text-white">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. We have logged your partnership request for <strong className="text-[#F9CE00]">{formData.brand}</strong>. Our creative team will reach out directly to <strong className="text-white">{formData.email}</strong> shortly.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        brand: '',
                        services: ['Brand & Visual Identity'],
                        budgetRange: 'Flexible / Let’s Discuss',
                        timeline: 'Within 2–4 Weeks',
                        message: '',
                      });
                    }}
                    className="px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-mono uppercase text-neutral-300 hover:text-white"
                  >
                    Submit Another Inquiry
                  </button>
                  <button
                    onClick={onBack}
                    className="px-5 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase"
                  >
                    Return to Agency Home
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Your Name <span className="text-[#F9CE00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Maya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Email Address <span className="text-[#F9CE00]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maya@brand.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Brand Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Brand or Company Name <span className="text-[#F9CE00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. Bloom Organics"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Phone or WhatsApp (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* What can we help with? */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                    What can we collaborate on? (Select any)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {servicesList.map((svc) => {
                      const selected = formData.services.includes(svc.label);
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => handleToggleService(svc.label)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            selected
                              ? 'bg-[#F9CE00]/10 border-[#F9CE00] text-white'
                              : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                          }`}
                        >
                          <svc.icon
                            className={`w-4 h-4 shrink-0 ${
                              selected ? 'text-[#F9CE00]' : 'text-neutral-500'
                            }`}
                          />
                          <span className="text-xs font-medium">{svc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Estimated Budget Range
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    >
                      {budgetOptions.map((opt, i) => (
                        <option key={i} value={opt} className="bg-neutral-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Target Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:border-[#F9CE00] outline-none transition-colors"
                    >
                      {timelineOptions.map((opt, i) => (
                        <option key={i} value={opt} className="bg-neutral-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message / Brief */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Tell us about your brand &amp; what you want to build
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us a little bit about your product, what you’re currently trying to improve, or any reference brands you like..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:border-[#F9CE00] outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  id="submit-partnership-inquiry-btn"
                  className="w-full py-4 rounded-full bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#F9CE00]/10 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Partnership Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-neutral-500 text-center font-sans">
                  Zero spam. We keep your contact and brand details confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Practical FAQs */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-neutral-900 bg-neutral-950/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono text-[#F9CE00] uppercase tracking-widest block mb-2">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-syne font-black uppercase text-white tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans">
              Clear answers to the questions partners ask us most often.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-900/50 border border-neutral-800/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-syne font-bold text-white uppercase tracking-tight">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#F9CE00] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed border-t border-neutral-800/40 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer / Quick Actions */}
      <footer className="py-12 px-4 sm:px-8 bg-[#070707] text-center border-t border-neutral-900">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-syne font-bold uppercase text-white">
              Akaar Agency Partnerships
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Available for collaborations in Pune, Mumbai, and Worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-syne font-bold uppercase text-neutral-300 hover:text-white transition-colors"
            >
              Agency Home
            </button>
            <a
              href="#inquiry-form"
              className="px-5 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase hover:bg-white transition-colors"
            >
              Inquire Now
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
