import React, { useState, useEffect, useRef } from 'react';
import { Play, Menu, X, Sliders, ArrowUpRight, Volume2, VolumeX, ChevronDown, Users, Briefcase, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AkaarBrandLogo } from './AkaarBrandLogo';

interface NavbarProps {
  onOpenReel: () => void;
  onOpenContact: () => void;
  onOpenPartnerPage?: () => void;
  onToggleEditor: () => void;
  isEditorOpen: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
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
    isCustomDomainActive?: boolean;
    showDomainBanner?: boolean;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReel,
  onOpenContact,
  onOpenPartnerPage,
  onToggleEditor,
  isEditorOpen,
  isMuted,
  onToggleMute,
  onOpenLogoStudio,
  brandSettings,
}) => {
  const { isAdmin } = useAdminAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);
  const [mobilePartnersOpen, setMobilePartnersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPartnersDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (targetId: string) => {
    setMobileMenuOpen(false);
    setPartnersDropdownOpen(false);
    setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href.substring(1));
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800/60 py-3 shadow-xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Theme Studio Trigger */}
        <div className="flex items-center gap-2">
          <div
            id="nav-logo"
            onClick={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
            className="group flex items-center gap-2.5 cursor-pointer focus:outline-none"
            title="Akaar Logo - Click to customize and match theme with website"
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
              size="md"
              interactive={true}
              onOpenEditor={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
            />
          </div>

          {/* Quick Theme Logo Badge Button */}
          <button
            type="button"
            onClick={onOpenLogoStudio || (() => window.dispatchEvent(new CustomEvent('open-logo-theme-studio')))}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-900/90 hover:bg-[#F9CE00] text-neutral-400 hover:text-black border border-neutral-800 text-[10px] font-mono transition-all duration-200 cursor-pointer shadow-sm group"
            title="Open Logo Theme Studio & Customizer"
          >
            <Palette className="w-3 h-3 text-[#F9CE00] group-hover:text-black transition-colors" />
            <span className="font-bold">Theme Logo</span>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-neutral-300">
          {/* Work */}
          <a
            href="#work"
            onClick={(e) => handleNavClick(e, '#work')}
            id="nav-link-work"
            className="relative py-1 hover:text-white transition-colors duration-200 group"
          >
            Work
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Brands */}
          <a
            href="#brands"
            onClick={(e) => handleNavClick(e, '#brands')}
            id="nav-link-brands"
            className="relative py-1 hover:text-white transition-colors duration-200 group"
          >
            Brands
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Single Unified "Partners & Clients" Dropdown Tab */}
          <div
            ref={dropdownRef}
            className="relative py-1"
            onMouseEnter={() => setPartnersDropdownOpen(true)}
            onMouseLeave={() => setPartnersDropdownOpen(false)}
          >
            <button
              type="button"
              id="nav-link-partners-clients"
              onClick={() => setPartnersDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 cursor-pointer group focus:outline-none"
            >
              <span>Partners &amp; Clients</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-[#F9CE00] transition-transform duration-200 ${
                  partnersDropdownOpen ? 'rotate-180 text-[#F9CE00]' : ''
                }`}
              />
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {partnersDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-56 bg-[#111111] border border-neutral-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50"
                >
                  <button
                    onClick={() => scrollToSection('influencer-partners')}
                    id="nav-sublink-partners"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold text-neutral-300 hover:text-black hover:bg-[#F9CE00] transition-all duration-150 cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 group-hover:bg-black/20 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
                    </div>
                    <div>
                      <div className="font-syne font-bold uppercase tracking-wide">Influencer Partners</div>
                      <div className="text-[10px] text-neutral-400 group-hover:text-neutral-800 font-mono">
                        30+ Creators &amp; Brands
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('clients')}
                    id="nav-sublink-clients"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold text-neutral-300 hover:text-black hover:bg-[#F9CE00] transition-all duration-150 cursor-pointer group mt-1"
                  >
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 group-hover:bg-black/20 flex items-center justify-center shrink-0">
                      <Briefcase className="w-3.5 h-3.5 text-[#F9CE00] group-hover:text-black" />
                    </div>
                    <div>
                      <div className="font-syne font-bold uppercase tracking-wide">Client Ecosystem</div>
                      <div className="text-[10px] text-neutral-400 group-hover:text-neutral-800 font-mono">
                        Global Brands &amp; Collabs
                      </div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Blogs Tab (Replaced FAQ on upper tab) */}
          <a
            href="#blogs"
            onClick={(e) => handleNavClick(e, '#blogs')}
            id="nav-link-blogs"
            className="relative py-1 hover:text-white transition-colors duration-200 group flex items-center gap-1.5"
          >
            <span>Blogs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE00]" />
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Offices */}
          <a
            href="#offices"
            onClick={(e) => handleNavClick(e, '#offices')}
            id="nav-link-offices"
            className="relative py-1 hover:text-white transition-colors duration-200 group"
          >
            Offices
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
          </a>

          {/* Partner With Us Button */}
          {onOpenPartnerPage && (
            <button
              onClick={onOpenPartnerPage}
              id="nav-partner-link"
              className="relative py-1 text-[#F9CE00] hover:text-white transition-colors duration-200 group font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-1"
            >
              <span>Partner With Us</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F9CE00] transition-all duration-300 group-hover:w-full" />
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Sound Toggle */}
          <button
            onClick={onToggleMute}
            id="nav-mute-toggle"
            title={isMuted ? 'Unmute Background Audio' : 'Mute Background Audio'}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-all duration-200 cursor-pointer"
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#F9CE00]" />}
          </button>

          {/* Quick Showreel Button */}
          <button
            onClick={onOpenReel}
            id="nav-watch-reel-btn"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-neutral-900/90 text-neutral-200 border border-neutral-700 hover:border-[#F9CE00] hover:text-[#F9CE00] transition-all duration-200 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current text-[#F9CE00]" />
            <span>Showreel</span>
          </button>

          {/* Live Editor Toggle (Owner/Admin Only) */}
          {isAdmin && (
            <button
              onClick={onToggleEditor}
              id="nav-edit-mode-btn"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                isEditorOpen
                  ? 'bg-[#F9CE00] text-black border-[#F9CE00] font-bold shadow-md shadow-[#F9CE00]/20'
                  : 'bg-neutral-900/90 text-[#F9CE00] border-[#F9CE00]/50 hover:bg-[#F9CE00] hover:text-black'
              }`}
              title="Admin Mode: Toggle Live Content Editor"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Edit Content</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
          )}

          {/* Contact / Get In Touch CTA */}
          <button
            onClick={onOpenContact}
            id="nav-get-in-touch-btn"
            className="flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight uppercase bg-[#F9CE00] text-black hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <span>Give Akaar</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white bg-neutral-900/80 border border-neutral-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0e0e0e] border-b border-neutral-800 px-6 py-6 shadow-2xl overflow-hidden"
          >
            <nav className="flex flex-col gap-3 text-base font-semibold">
              {/* Work */}
              <a
                href="#work"
                onClick={(e) => handleNavClick(e, '#work')}
                className="text-neutral-300 hover:text-[#F9CE00] py-2 border-b border-neutral-800/80 flex items-center justify-between"
              >
                <span>Work</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              {/* Brands */}
              <a
                href="#brands"
                onClick={(e) => handleNavClick(e, '#brands')}
                className="text-neutral-300 hover:text-[#F9CE00] py-2 border-b border-neutral-800/80 flex items-center justify-between"
              >
                <span>Brands</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              {/* Partners & Clients Collapsible in Mobile */}
              <div className="border-b border-neutral-800/80 py-2">
                <button
                  type="button"
                  onClick={() => setMobilePartnersOpen(!mobilePartnersOpen)}
                  className="w-full flex items-center justify-between text-neutral-300 hover:text-[#F9CE00]"
                >
                  <span className="font-semibold">Partners &amp; Clients</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 text-neutral-400 ${
                      mobilePartnersOpen ? 'rotate-180 text-[#F9CE00]' : ''
                    }`}
                  />
                </button>

                <div className={`mt-2.5 ml-3 pl-3 border-l-2 border-[#F9CE00]/30 space-y-2.5 ${mobilePartnersOpen ? 'block' : 'hidden'}`}>
                  <button
                    onClick={() => scrollToSection('influencer-partners')}
                    className="w-full text-left text-sm text-neutral-400 hover:text-white flex items-center justify-between py-1"
                  >
                    <span>↳ Influencer Partners</span>
                    <span className="text-[10px] font-mono text-[#F9CE00]">30+ Brands</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('clients')}
                    className="w-full text-left text-sm text-neutral-400 hover:text-white flex items-center justify-between py-1"
                  >
                    <span>↳ Client Ecosystem</span>
                    <span className="text-[10px] font-mono text-neutral-500">Collaborations</span>
                  </button>
                </div>
              </div>

              {/* Blogs */}
              <a
                href="#blogs"
                onClick={(e) => handleNavClick(e, '#blogs')}
                className="text-neutral-300 hover:text-[#F9CE00] py-2 border-b border-neutral-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>Blogs &amp; Insights</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#F9CE00] text-black font-bold uppercase">
                    New
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              {/* Offices */}
              <a
                href="#offices"
                onClick={(e) => handleNavClick(e, '#offices')}
                className="text-neutral-300 hover:text-[#F9CE00] py-2 border-b border-neutral-800/80 flex items-center justify-between"
              >
                <span>Offices</span>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              {/* Logo Theme Studio Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenLogoStudio) {
                    onOpenLogoStudio();
                  } else {
                    window.dispatchEvent(new CustomEvent('open-logo-theme-studio'));
                  }
                }}
                className="text-[#F9CE00] hover:text-white py-2 border-b border-neutral-800/80 flex items-center justify-between text-left font-syne font-bold uppercase text-sm"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#F9CE00]" />
                  <span>Logo Theme Studio</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#F9CE00] text-black font-bold">
                  Edit
                </span>
              </button>

              {/* Partner With Us */}
              {onOpenPartnerPage && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPartnerPage();
                  }}
                  className="text-[#F9CE00] hover:text-white py-2 border-b border-neutral-800/80 flex items-center justify-between text-left font-syne font-bold uppercase text-sm"
                >
                  <span>Partner With Us</span>
                  <ArrowUpRight className="w-4 h-4 text-[#F9CE00]" />
                </button>
              )}

              {/* CTA buttons */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReel();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 text-neutral-200 border border-neutral-700 text-sm font-bold uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current text-[#F9CE00]" />
                  Watch 2025 Showreel
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  className="w-full py-3 rounded-lg bg-[#F9CE00] text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                >
                  Give Akaar
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

