import React from 'react';
import { ArrowUp, Mail, Phone, MapPin, Instagram, Linkedin, Facebook, ShieldCheck, Sparkles, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { OfficeLocation } from '../types';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AkaarBrandLogo } from './AkaarBrandLogo';

interface FooterProps {
  offices: OfficeLocation[];
  onOpenContact: () => void;
  onOpenPartnerPage?: () => void;
  onOpenLogoStudio?: () => void;
  brandSettings?: {
    logoUrl?: string;
    logoText?: string;
    agencySubtitle?: string;
    logoTheme?: any;
    logoIconStyle?: any;
    logoGlow?: any;
    logoAccentColor?: string;
    logoFilter?: string;
    customDomain?: string;
  };
}

export const Footer: React.FC<FooterProps> = ({ offices, onOpenContact, onOpenPartnerPage, onOpenLogoStudio, brandSettings }) => {
  const { isAdmin, toggleAdmin } = useAdminAuth();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="offices" className="bg-[#050505] text-white pt-20 pb-12 border-t border-neutral-800/80 relative scroll-mt-20 overflow-hidden">
      {/* Subtle Golden Ambient Backdrop Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F9CE00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Giant Heroic Footer Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-neutral-800 pb-16 mb-16"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-5xl md:text-6xl font-syne font-black tracking-tighter uppercase text-neutral-500 leading-none block">
                  Come Give
                </span>
                <button
                  type="button"
                  onClick={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
                  className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-[#F9CE00] text-neutral-400 hover:text-black border border-neutral-800 text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Customize Akaar logo theme"
                >
                  <Palette className="w-3 h-3 text-[#F9CE00]" />
                  <span>Theme Logo</span>
                </button>
              </div>

              <div
                onClick={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
                className="cursor-pointer inline-block group"
                title="Click to customize Akaar logo"
              >
                <AkaarBrandLogo
                  logoUrl={brandSettings?.logoUrl}
                  logoText={brandSettings?.logoText}
                  agencySubtitle={brandSettings?.agencySubtitle}
                  logoTheme={brandSettings?.logoTheme}
                  logoIconStyle={brandSettings?.logoIconStyle}
                  logoGlow={brandSettings?.logoGlow}
                  logoAccentColor={brandSettings?.logoAccentColor}
                  logoFilter={brandSettings?.logoFilter}
                  size="giant"
                  showSubtitle={false}
                  showEmblem={true}
                  showWordmark={true}
                  interactive={true}
                  onOpenEditor={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
                />
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                Ready to transform your brand with culture-defining campaigns, creator programs, and high-octane performance media? Let’s talk.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenContact}
                  id="footer-start-project-btn"
                  className="px-8 py-4 rounded-full bg-[#F9CE00] text-black font-syne font-black text-xs uppercase tracking-wider hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(249,206,0,0.3)] inline-block cursor-pointer"
                >
                  Start A Project &rarr;
                </button>
                {onOpenPartnerPage && (
                  <button
                    onClick={onOpenPartnerPage}
                    id="footer-partner-btn"
                    className="px-6 py-4 rounded-full bg-neutral-900 border border-neutral-700 hover:border-[#F9CE00] text-white hover:text-[#F9CE00] font-syne font-bold text-xs uppercase tracking-wider transition-all inline-block cursor-pointer"
                  >
                    Partner With Us
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Studio Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16 text-left">
          {/* Pune Studio */}
          {offices[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-[#F9CE00]/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00] animate-pulse" />
                <h4 className="text-xl font-syne font-black uppercase text-white">
                  {offices[0].city}
                </h4>
              </div>
              <div className="space-y-2 text-xs text-neutral-400 font-sans">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#F9CE00] shrink-0 mt-0.5" />
                  <span>{offices[0].address}<br />{offices[0].state}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#F9CE00] shrink-0" />
                  <a href={`tel:${offices[0].phone}`} className="hover:text-white transition-colors">
                    {offices[0].phone}
                  </a>
                </p>
              </div>
            </motion.div>
          )}

          {/* Mumbai Studio */}
          {offices[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-[#F9CE00]/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F9CE00] animate-pulse" />
                <h4 className="text-xl font-syne font-black uppercase text-white">
                  {offices[1].city}
                </h4>
              </div>
              <div className="space-y-2 text-xs text-neutral-400 font-sans">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#F9CE00] shrink-0 mt-0.5" />
                  <span>{offices[1].address}<br />{offices[1].state}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#F9CE00] shrink-0" />
                  <a href={`tel:${offices[1].phone}`} className="hover:text-white transition-colors">
                    {offices[1].phone}
                  </a>
                </p>
              </div>
            </motion.div>
          )}

          {/* Direct Inquiries & Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-[#F9CE00]/40 transition-colors"
          >
            <h4 className="text-xl font-syne font-black uppercase text-white mb-3">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F9CE00] shrink-0" />
                <a href="mailto:akaar.entertainment@gmail.com" className="hover:text-white transition-colors">
                  akaar.entertainment@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F9CE00] shrink-0" />
                <a href="tel:+919975312398" className="hover:text-white transition-colors">
                  +91 9975312398
                </a>
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                <a href="#faq" className="text-neutral-400 hover:text-[#F9CE00] underline">
                  FAQs &rarr;
                </a>
                <span className="text-neutral-700">&bull;</span>
                <a href="#blogs" className="text-neutral-400 hover:text-[#F9CE00] underline">
                  Blogs &amp; Insights &rarr;
                </a>
              </div>
            </div>
          </motion.div>

          {/* Socials & Accreditations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 hover:border-[#F9CE00]/40 transition-colors"
          >
            <h4 className="text-xl font-syne font-black uppercase text-white mb-3">
              Follow Culture
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://www.instagram.com/akaar.entertainment?igsi=d2U5eGhzM3l6dmh2"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#F9CE00] hover:border-[#F9CE00] transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/akaar-agency/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#F9CE00] hover:border-[#F9CE00] transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/akaaragency/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-black hover:bg-[#F9CE00] hover:border-[#F9CE00] transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <div className="text-[11px] text-[#F9CE00] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Believe in a client-oriented ideology.</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom copyright & Back to top */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span>
              &copy; {new Date().getFullYear()} {brandSettings?.logoText || 'Akaar'} Agency. Believe in a client-oriented ideology.
            </span>
            {isAdmin && (
              <>
                <span className="text-neutral-700 hidden sm:inline">&bull;</span>
                <button
                  onClick={toggleAdmin}
                  id="footer-admin-gateway-btn"
                  title="Toggle Studio Edit Access (Ctrl+Shift+A)"
                  className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-[#F9CE00] transition-colors"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-mono">Edit Mode (Click to View as Visitor)</span>
                </button>
              </>
            )}
          </div>

          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className="flex items-center gap-2 text-neutral-400 hover:text-[#F9CE00] transition-colors uppercase tracking-widest text-[11px] font-bold group cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
