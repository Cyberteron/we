import React, { useState } from 'react';
import { Pill, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AgencyData } from '../types';
import { validateEmail } from '../utils/validation';

interface NewsletterSectionProps {
  data: AgencyData['newsletter'];
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ data }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const saveSubscriberLocally = (subName: string, subEmail: string) => {
    try {
      const raw = localStorage.getItem('akaar_newsletter_subscribers');
      const list = raw ? JSON.parse(raw) : [];
      const entry = {
        id: Date.now().toString(),
        name: subName,
        email: subEmail,
        date: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };
      if (!list.some((item: any) => item.email === subEmail)) {
        list.unshift(entry);
        localStorage.setItem('akaar_newsletter_subscribers', JSON.stringify(list));
      }
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    const emailCheck = validateEmail(cleanEmail);
    if (!emailCheck.isValid) {
      setEmailError(emailCheck.error || 'Please enter a genuine email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmittedName(cleanName);
    setSubmittedEmail(cleanEmail);
    saveSubscriberLocally(cleanName, cleanEmail);

    try {
      await fetch('https://formsubmit.co/ajax/akaar.entertainment@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `This profile subscribed to your website: ${cleanName || cleanEmail}`,
          _template: 'table',
          _captcha: 'false',
          Notification: 'This profile subscribed to your website',
          'Subscriber Name': cleanName || 'Website Visitor',
          'Email Address': cleanEmail,
          Status: 'Subscribed to Akaar Newsletter',
          'Subscribed At': new Date().toLocaleString(),
          Source: 'Akaar Agency Website (Newsletter Subscribe)'
        })
      });
    } catch (err) {
      console.error('Newsletter submission notification:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setIsSubmitted(false);
  };

  return (
    <section id="newsletter" className="py-20 sm:py-28 bg-[#090909] border-t border-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-2xl relative">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F9CE00]/5 blur-3xl pointer-events-none" />

          {/* Left Column: Pill & Medical Aesthetic */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="relative w-64 sm:w-80 max-w-full drop-shadow-[0_20px_40px_rgba(249,206,0,0.15)]">
              <img
                src={data.imageUrl}
                alt="Akaar Drip Prescription Bottle"
                className="w-full h-auto object-contain transform hover:rotate-2 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F9CE00] uppercase">
              <Pill className="w-4 h-4" />
              <span>Prescribed by Akaar Cultural Lab</span>
            </div>
          </div>

          {/* Right Column: Copy & Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-syne font-bold uppercase tracking-[0.25em] text-neutral-400 block mb-1">
                {data.subtitle}
              </span>
              <h2 className="text-4xl sm:text-6xl font-syne font-black uppercase tracking-tight text-white leading-none">
                {data.title}
              </h2>
            </div>

            {/* Directions for Use Card */}
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F9CE00]" />
                <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-200">
                  {data.directions}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-bold">
                {data.sideEffects}
              </p>
            </div>

            {/* Subscription States & Form */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-[#F9CE00] text-black space-y-3"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 shrink-0 text-black mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight">
                      Thanks for subscribing{submittedName ? `, ${submittedName}` : ''}!
                    </h3>
                    <p className="text-xs sm:text-sm text-black/90 font-medium leading-relaxed">
                      We’ve added <span className="font-bold underline">{submittedEmail}</span> to the Akaar Weekly Drip. Expect fresh cultural teardowns and viral case breakdowns in your inbox.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold text-black/70">
                    Akaar Cultural Lab
                  </span>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-xs font-syne font-black uppercase text-black hover:underline tracking-wider"
                  >
                    Subscribe another profile →
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full sm:w-2/5 px-5 py-3.5 rounded-full bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#F9CE00] transition-colors disabled:opacity-50"
                  />
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="Your Email Address"
                    className="w-full sm:flex-1 px-5 py-3.5 rounded-full bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#F9CE00] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                {emailError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 px-3 py-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span>No spam ever. 14,000+ marketers and founders read every week.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
