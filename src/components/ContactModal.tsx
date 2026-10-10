import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Globe,
  Sparkles,
  ExternalLink,
  Check,
  Zap,
} from 'lucide-react';
import { OfficeLocation } from '../types';
import { validateEmail, validatePhone } from '../utils/validation';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  offices: OfficeLocation[];
  initialTab?: 'portal' | 'form' | 'offices';
  initialService?: string;
  initialBudget?: string;
  initialMessage?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  offices,
  initialTab = 'portal',
  initialService,
  initialBudget,
  initialMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'portal' | 'form' | 'offices'>(initialTab);

  // Inbound Intake Native State
  const [inboundPackageTier, setInboundPackageTier] = useState<string>('starter');
  const [inboundTimeline, setInboundTimeline] = useState<string>('2-4 Weeks (Standard)');
  const [inboundReferenceUrl, setInboundReferenceUrl] = useState<string>('');
  const [inboundSubmitted, setInboundSubmitted] = useState<boolean>(false);
  const [inboundTicketId, setInboundTicketId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: initialBudget || 'Rs 50,000 - Rs 1,00,000',
    message: initialMessage || '',
    services: initialService ? [initialService] : [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      if (initialService) {
        setFormData((prev) => ({
          ...prev,
          services: prev.services.includes(initialService) ? prev.services : [...prev.services, initialService],
          budget: initialBudget || prev.budget,
          message: initialMessage ? initialMessage : prev.message,
        }));
      }
    }
  }, [isOpen, initialTab, initialService, initialBudget, initialMessage]);

  const availableServices = [
    'Creative Strategy',
    'Video Editing',
    'Video Shoot',
    'Content Production',
    'Social Media',
    'Talent & Creators',
    'PR & Buzz',
    'Paid Performance Media',
    'Experiential / Events',
  ];

  const toggleService = (srv: string) => {
    setFormData((prev) => {
      const nextServices = prev.services.includes(srv)
        ? prev.services.filter((s) => s !== srv)
        : [...prev.services, srv];
      if (nextServices.length > 0 && errors.services) {
        setErrors((prevErr) => {
          const updated = { ...prevErr };
          delete updated.services;
          return updated;
        });
      }
      return { ...prev, services: nextServices };
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErr) => {
        const updated = { ...prevErr };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // 1. Capabilities (Compulsory)
    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one capability needed.';
    }

    // 2. Name (Compulsory)
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }

    // 3. Company (Compulsory)
    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = 'Please enter your brand, company, or startup name.';
    }

    // 4. Genuine Email (Compulsory & No Temp Mails)
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      newErrors.email = emailCheck.error || 'Please enter a genuine work or personal email address.';
    }

    // 5. Genuine Phone (Compulsory & No Dummy Numbers)
    const phoneCheck = validatePhone(formData.phone);
    if (!phoneCheck.isValid) {
      newErrors.phone = phoneCheck.error || 'Please enter a valid 10-digit contact phone number.';
    }

    // 6. Budget (Compulsory)
    if (!formData.budget.trim()) {
      newErrors.budget = 'Please select an estimated budget range.';
    }

    // 7. Message / Brief (Compulsory)
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a project overview or brief (minimum 10 characters).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Persist to local storage for zero-loss lead capture
    try {
      const raw = localStorage.getItem('akaar_contact_briefs');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        services: formData.services,
        budget: formData.budget,
        message: formData.message.trim(),
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      });
      localStorage.setItem('akaar_contact_briefs', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save brief locally:', err);
    }

    try {
      await fetch('https://formsubmit.co/ajax/akaar.entertainment@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Project Brief from ${formData.name.trim()} (${formData.company.trim()}) - Phone: ${formData.phone.trim()}`,
          _template: 'table',
          _captcha: 'false',
          'Client Name': formData.name.trim(),
          'Phone Number': formData.phone.trim(),
          'Email Address': formData.email.trim(),
          'Company / Brand': formData.company.trim(),
          'Capabilities Selected': formData.services.join(', '),
          'Estimated Budget': formData.budget,
          'Project Overview': formData.message.trim(),
          'Submitted At': new Date().toLocaleString(),
          Source: 'Akaar Agency Website (Give Akaar Section)'
        })
      });
    } catch (err) {
      console.error('Failed to submit brief:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`relative z-10 w-full ${
            activeTab === 'portal'
              ? 'max-w-4xl max-h-[92vh]'
              : 'max-w-3xl max-h-[94vh]'
          } bg-[#111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-left flex flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#F9CE00]" />
              <h2 className="text-lg sm:text-xl font-syne font-black uppercase text-white tracking-tight">
                Give Akaar
              </h2>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
              <button
                id="contact-tab-portal"
                type="button"
                onClick={() => setActiveTab('portal')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer touch-manipulation flex items-center gap-1.5 ${
                  activeTab === 'portal'
                    ? 'bg-[#F9CE00] text-black font-black shadow-sm'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Inbound Portal</span>
              </button>
              <button
                id="contact-tab-brief-us"
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer touch-manipulation flex items-center gap-1.5 ${
                  activeTab === 'form'
                    ? 'bg-[#F9CE00] text-black font-black shadow-sm'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Brief Us</span>
              </button>
              <button
                id="contact-tab-offices"
                type="button"
                onClick={() => setActiveTab('offices')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors min-h-[36px] cursor-pointer touch-manipulation flex items-center gap-1.5 ${
                  activeTab === 'offices'
                    ? 'bg-[#F9CE00] text-black font-black shadow-sm'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Offices</span>
              </button>

              <button
                id="contact-modal-close-btn"
                type="button"
                onClick={onClose}
                className="p-2 ml-1 rounded-full bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className={`overflow-y-auto ${activeTab === 'portal' ? 'p-4 sm:p-6 flex-1 flex flex-col' : 'p-6 sm:p-8'}`}>
            {activeTab === 'portal' ? (
              <div className="flex-1 p-4 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-y-auto">
                {inboundSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-10 text-center space-y-5 max-w-lg mx-auto"
                      >
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#F9CE00]/20 border-2 border-[#F9CE00] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-[#F9CE00]" />
                        </div>
                        <div>
                          <span className="text-xs font-mono text-[#F9CE00] font-bold uppercase tracking-wider">
                            Direct In-Window Portal Confirmed
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white mt-1">
                            Inbound Brief Logged!
                          </h3>
                        </div>

                        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-left font-mono text-xs space-y-1.5">
                          <div className="flex justify-between text-neutral-400">
                            <span>Reference Code:</span>
                            <span className="text-[#F9CE00] font-bold">{inboundTicketId}</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Client / Brand:</span>
                            <span className="text-white">{formData.company} ({formData.name})</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Package Tier:</span>
                            <span className="text-white capitalize">{inboundPackageTier}</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Target Timeline:</span>
                            <span className="text-white">{inboundTimeline}</span>
                          </div>
                          <div className="flex justify-between text-neutral-400">
                            <span>Contact Phone:</span>
                            <span className="text-white">{formData.phone}</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Your project parameters have been synced directly to the Give Akaar creative studio pod. A creative producer will reach out within 12 hours.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setInboundSubmitted(false);
                              onClose();
                            }}
                            className="px-6 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                          >
                            Return to Website
                          </button>
                          <a
                            href={`https://wa.me/919920198083?text=${encodeURIComponent(
                              `Hi Akaar Agency Studio! We just submitted our inbound brief on the website [Ticket: ${inboundTicketId}]. Brand: ${formData.company}, Name: ${formData.name}. Looking forward to connecting!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                          >
                            <span>WhatsApp Studio Pod</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const newErrors: Record<string, string> = {};

                          if (!formData.company.trim()) {
                            newErrors.company = 'Please enter your brand or company name.';
                          }
                          if (!formData.name.trim()) {
                            newErrors.name = 'Please enter your full name.';
                          }
                          const emailCheck = validateEmail(formData.email);
                          if (!emailCheck.isValid) {
                            newErrors.email = emailCheck.error || 'Please enter a valid work email.';
                          }
                          const phoneCheck = validatePhone(formData.phone);
                          if (!phoneCheck.isValid) {
                            newErrors.phone = phoneCheck.error || 'Please enter a valid phone number.';
                          }
                          if (formData.services.length === 0) {
                            newErrors.services = 'Please select at least one creative capability.';
                          }

                          if (Object.keys(newErrors).length > 0) {
                            setErrors(newErrors);
                            return;
                          }

                          setIsSubmitting(true);
                          const generatedId = `AKAAR-INB-${Math.floor(100000 + Math.random() * 900000)}`;
                          setInboundTicketId(generatedId);

                          try {
                            const entry = {
                              id: generatedId,
                              timestamp: new Date().toISOString(),
                              company: formData.company,
                              name: formData.name,
                              email: formData.email,
                              phone: formData.phone,
                              tier: inboundPackageTier,
                              timeline: inboundTimeline,
                              budget: formData.budget,
                              services: formData.services,
                              referenceUrl: inboundReferenceUrl,
                              message: formData.message,
                            };
                            const existing = JSON.parse(localStorage.getItem('akaar_inbound_leads') || '[]');
                            localStorage.setItem('akaar_inbound_leads', JSON.stringify([entry, ...existing]));
                          } catch {
                            // ignore
                          }

                          setTimeout(() => {
                            setIsSubmitting(false);
                            setInboundSubmitted(true);
                          }, 600);
                        }}
                        className="space-y-6"
                      >
                        {/* Title Header */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00]" />
                              <span className="font-mono text-xs text-[#F9CE00] uppercase font-bold tracking-wider">
                                Give Akaar — Studio Inbound Scope
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveTab('form')}
                              className="text-xs font-mono text-neutral-400 hover:text-[#F9CE00] transition-colors"
                            >
                              Standard Brief Form &rarr;
                            </button>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-syne font-black uppercase text-white">
                            Lock In Your Scope &amp; Deliverables
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1">
                            Choose your package tier, required creative capabilities, and timeline below.
                          </p>
                        </div>

                        {/* Package Tier Selection Cards */}
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2 font-semibold">
                            1. Select Package Tier:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {[
                              {
                                id: 'starter',
                                title: 'Starter Video Pack',
                                price: '₹25,000 – ₹50,000',
                                desc: '8–12 high-retention social reels/shorts with sound design & hooks.',
                              },
                              {
                                id: 'studio_shoot',
                                title: 'Studio Shoot + Edit',
                                price: '₹50,000 – ₹1,00,000',
                                desc: '4K camera crew, cinema lighting, on-set sound & end-to-end post.',
                              },
                              {
                                id: 'creative_pod',
                                title: 'Monthly Retainer Pod',
                                price: '₹1,00,000 – ₹2,50,000+',
                                desc: 'Dedicated creative pod: editor, strategist & ongoing brand production.',
                              },
                              {
                                id: 'custom_sprint',
                                title: 'Custom 360 Sprint',
                                price: 'Custom Quote',
                                desc: 'Strategic TVC, brand overhaul, launch campaign & experiential.',
                              },
                            ].map((tier) => {
                              const isSelected = inboundPackageTier === tier.id;
                              return (
                                <button
                                  type="button"
                                  key={tier.id}
                                  onClick={() => {
                                    setInboundPackageTier(tier.id);
                                    setFormData((prev) => ({ ...prev, budget: tier.price }));
                                  }}
                                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-neutral-900 border-[#F9CE00] ring-1 ring-[#F9CE00]'
                                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-syne font-bold text-xs text-white uppercase truncate">
                                      {tier.title}
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#F9CE00]" />}
                                  </div>
                                  <div className="font-mono text-xs font-bold text-[#F9CE00] mb-1">
                                    {tier.price}
                                  </div>
                                  <p className="text-[11px] text-neutral-400 leading-snug">
                                    {tier.desc}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Capabilities Needed */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
                              2. Required Creative Capabilities <span className="text-[#F9CE00]">*</span>
                            </label>
                            {formData.services.length > 0 && (
                              <span className="text-[11px] font-mono text-[#F9CE00]">
                                {formData.services.length} selected
                              </span>
                            )}
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                            <div className="flex flex-wrap gap-2">
                              {availableServices.map((srv) => {
                                const isSelected = formData.services.includes(srv);
                                return (
                                  <button
                                    type="button"
                                    key={srv}
                                    onClick={() => toggleService(srv)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#F9CE00] text-black font-bold shadow-md shadow-[#F9CE00]/20'
                                        : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                                    }`}
                                  >
                                    {srv}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          {errors.services && (
                            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {errors.services}
                            </p>
                          )}
                        </div>

                        {/* Timeline & Budget row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-semibold">
                              3. Target Timeline:
                            </label>
                            <select
                              value={inboundTimeline}
                              onChange={(e) => setInboundTimeline(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                            >
                              <option value="Urgent Sprint (< 7 Days)">Urgent Sprint (&lt; 7 Days)</option>
                              <option value="2-4 Weeks (Standard)">2–4 Weeks (Standard)</option>
                              <option value="Next Month Launch">Next Month Launch</option>
                              <option value="Monthly Creative Retainer">Monthly Creative Retainer</option>
                              <option value="Flexible / Exploring">Flexible / Exploring</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-semibold">
                              4. Budget Range:
                            </label>
                            <input
                              type="text"
                              value={formData.budget}
                              onChange={(e) => handleFieldChange('budget', e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                              placeholder="e.g. ₹50,000 - ₹1,00,000"
                            />
                          </div>
                        </div>

                        {/* Brand & Contact Information */}
                        <div className="space-y-3 pt-1">
                          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold border-b border-neutral-800/80 pb-1">
                            5. Brand &amp; Contact Details:
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleFieldChange('company', e.target.value)}
                                placeholder="Brand / Company Name *"
                                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-white text-xs focus:outline-none focus:border-[#F9CE00] ${
                                  errors.company ? 'border-rose-500' : 'border-neutral-800'
                                }`}
                              />
                              {errors.company && (
                                <p className="text-[11px] text-rose-400 mt-1">{errors.company}</p>
                              )}
                            </div>

                            <div>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                placeholder="Your Full Name *"
                                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-white text-xs focus:outline-none focus:border-[#F9CE00] ${
                                  errors.name ? 'border-rose-500' : 'border-neutral-800'
                                }`}
                              />
                              {errors.name && (
                                <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>
                              )}
                            </div>

                            <div>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                placeholder="Work Email Address *"
                                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-white text-xs focus:outline-none focus:border-[#F9CE00] ${
                                  errors.email ? 'border-rose-500' : 'border-neutral-800'
                                }`}
                              />
                              {errors.email && (
                                <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
                              )}
                            </div>

                            <div>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                placeholder="Phone / WhatsApp Number *"
                                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border text-white text-xs focus:outline-none focus:border-[#F9CE00] ${
                                  errors.phone ? 'border-rose-500' : 'border-neutral-800'
                                }`}
                              />
                              {errors.phone && (
                                <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Reference Link & Project Description */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1 font-semibold">
                              6. Reference Link (Figma, Notion, Google Drive, Brand Deck):
                            </label>
                            <input
                              type="url"
                              value={inboundReferenceUrl}
                              onChange={(e) => setInboundReferenceUrl(e.target.value)}
                              placeholder="https://drive.google.com/... or https://figma.com/..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-[#F9CE00]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1 font-semibold">
                              7. Project Brief &amp; Goals:
                            </label>
                            <textarea
                              rows={3}
                              value={formData.message}
                              onChange={(e) => handleFieldChange('message', e.target.value)}
                              placeholder="Briefly describe what you want to achieve, deliverables, or inspiration..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-[#F9CE00] resize-none"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            id="submit-inbound-portal-btn"
                            disabled={isSubmitting}
                            className="w-full py-3.5 px-6 rounded-xl bg-[#F9CE00] hover:bg-white text-black font-syne font-black text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting Inbound Scope...</span>
                              </>
                            ) : (
                              <>
                                <span>Lock In Scope &amp; Submit to Give Akaar Studio</span>
                                <ArrowRight className="w-4 h-4 stroke-[3]" />
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
              </div>
            ) : activeTab === 'form' ? (
              submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4 max-w-md mx-auto"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#F9CE00]/20 border-2 border-[#F9CE00] flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#F9CE00]" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white">
                    Brief Received!
                  </h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Thanks <span className="text-[#F9CE00] font-bold">{formData.name || 'there'}</span>. Your brief for <span className="text-white font-semibold">{formData.company}</span> (Contact: <span className="text-white font-mono">{formData.phone}</span>) has been securely logged. One of our Client Partners from the Pune or Mumbai studio will review your requirements and reach out within 24 hours.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      Back to Website
                    </button>
                    <a
                      href={`mailto:akaar.entertainment@gmail.com?subject=${encodeURIComponent(`Project Brief from ${formData.name} (${formData.company})`)}&body=${encodeURIComponent(
                        `Client Name: ${formData.name}\nCompany / Brand: ${formData.company}\nPhone Number: ${formData.phone}\nWork Email: ${formData.email}\nCapabilities: ${formData.services.join(', ')}\nBudget: ${formData.budget}\n\nProject Brief:\n${formData.message}`
                      )}`}
                      className="px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold hover:text-white transition-colors"
                    >
                      Send Direct Copy via Mail
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-syne font-black uppercase text-white">
                      Let’s make something memorable.
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                      Tell us about your brand goals. Every section below is compulsory so our creative team can evaluate your brief effectively.
                    </p>
                  </div>

                  {/* Section 1: Capabilities Multi-Select (Compulsory) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300">
                        1. Select Capabilities Needed <span className="text-[#F9CE00] font-bold">* (Compulsory)</span>
                      </label>
                      {formData.services.length > 0 && (
                        <span className="text-[11px] font-mono text-[#F9CE00]">
                          {formData.services.length} selected
                        </span>
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl bg-neutral-950 border transition-all ${
                      errors.services ? 'border-rose-500/80 bg-rose-950/10' : 'border-neutral-800'
                    }`}>
                      <div className="flex flex-wrap gap-2">
                        {availableServices.map((srv) => {
                          const isSelected = formData.services.includes(srv);
                          return (
                            <button
                              type="button"
                              key={srv}
                              onClick={() => toggleService(srv)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'bg-[#F9CE00] text-black font-bold shadow-md shadow-[#F9CE00]/20'
                                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                              }`}
                            >
                              {srv}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {errors.services && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.services}</span>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Contact Details (Compulsory) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                        2. Contact & Brand Details <span className="text-[#F9CE00] font-bold">* (All Compulsory)</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase font-mono">Genuine Info Only</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Your Full Name <span className="text-[#F9CE00]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          placeholder="e.g. Andy Morley"
                          className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors ${
                            errors.name ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                          }`}
                        />
                        {errors.name && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Company / Brand */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Company / Brand <span className="text-[#F9CE00]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleFieldChange('company', e.target.value)}
                          placeholder="e.g. Uber / Tyro / Unilever"
                          className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors ${
                            errors.company ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                          }`}
                        />
                        {errors.company && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.company}</span>
                          </div>
                        )}
                      </div>

                      {/* Work Email (Genuine only, no temp mails) */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center justify-between">
                          <span>Work Email <span className="text-[#F9CE00]">*</span></span>
                          <span className="text-[10px] text-neutral-500 font-normal">No temp/disposable mail</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            placeholder="e.g. andy@company.com"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors ${
                              errors.email ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                            }`}
                          />
                          <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                        {errors.email && (
                          <div className="mt-1 flex items-start gap-1 text-xs text-rose-400 leading-tight">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Phone Number */}
                      <div>
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center justify-between">
                          <span>Contact Phone Number <span className="text-[#F9CE00]">*</span></span>
                          <span className="text-[10px] text-neutral-500 font-normal">Genuine 10-digit mobile</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            placeholder="e.g. +91 98220 12389"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors font-mono ${
                              errors.phone ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                            }`}
                          />
                          <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                        </div>
                        {errors.phone && (
                          <div className="mt-1 flex items-start gap-1 text-xs text-rose-400 leading-tight">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Estimated Budget */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                          Estimated Budget <span className="text-[#F9CE00]">*</span>
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => handleFieldChange('budget', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white text-sm focus:outline-none transition-colors ${
                            errors.budget ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                          }`}
                        >
                          <option value="Rs 25,000 - Rs 50,000">Rs 25,000 – Rs 50,000 (Video Edit / Starter Campaign)</option>
                          <option value="Rs 50,000 - Rs 1,00,000">Rs 50,000 – Rs 1,00,000 (Shoot + Edit Package)</option>
                          <option value="Rs 1,00,000 - Rs 2,50,000">Rs 1,00,000 – Rs 2,50,000 (Rs 1L – 2.5L Growth Retainer)</option>
                          <option value="Rs 2,50,000 - Rs 10,00,000">Rs 2,50,000 – Rs 10,00,000 (Rs 2.5L – 10L Full Production)</option>
                          <option value="Rs 10,00,000+">Rs 10,00,000+ (Rs 10L+ Enterprise 360° Brand Campaign)</option>
                        </select>
                        {errors.budget && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.budget}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Project Overview / Brief (Compulsory) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-mono uppercase text-neutral-400">
                        3. Project Overview / Brief <span className="text-[#F9CE00] font-bold">* (Compulsory)</span>
                      </label>
                      <span className="text-[10px] text-neutral-500 font-mono">Min. 10 characters</span>
                    </div>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      placeholder="Tell us what you want to achieve (e.g. 10 reel shoots in Pune, high-retention video editing, or YouTube brand documentary)..."
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-900 border text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors ${
                        errors.message ? 'border-rose-500 bg-rose-950/10 focus:border-rose-400' : 'border-neutral-800 focus:border-[#F9CE00]'
                      }`}
                    />
                    {errors.message && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Compulsory Validation Warning Banner */}
                  {Object.keys(errors).length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-rose-300">Every section is compulsory to submit this brief.</span>
                        <p className="text-[11px] text-rose-300/80 mt-0.5">
                          Please ensure all sections above are filled with a genuine contact phone number and valid work/personal email (temp mail addresses will not be accepted).
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Validating & Submitting Brief...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Brief to Akaar Agency</span>
                      </>
                    )}
                  </button>
                </form>
              )
            ) : (
              /* Offices View */
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-syne font-black uppercase text-white">
                    Our Studios
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Drop in for a coffee or a whiteboard session in Pune or Mumbai.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offices.map((office) => (
                    <div
                      key={office.city}
                      className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-syne font-black uppercase text-white">
                          {office.city}
                        </h4>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00]" />
                      </div>

                      <div className="space-y-2 text-xs text-neutral-300">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#F9CE00] shrink-0 mt-0.5" />
                          <span>{office.address}, {office.state}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#F9CE00] shrink-0" />
                          <a href={`tel:${office.phone}`} className="hover:text-white transition-colors">
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#F9CE00] shrink-0" />
                          <a href={`mailto:${office.email}`} className="hover:text-white transition-colors">
                            {office.email}
                          </a>
                        </div>
                      </div>

                      <a
                        href={office.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F9CE00] hover:underline pt-2 uppercase tracking-wider"
                      >
                        <span>Open in Google Maps</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
