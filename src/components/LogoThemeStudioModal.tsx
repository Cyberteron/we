import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Download,
  Upload,
  Check,
  Palette,
  Eye,
  Sliders,
  Play,
  RotateCcw,
  Sun,
  Moon,
  Layers,
  Wand2,
  Maximize2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  AkaarBrandLogo,
  LogoThemeType,
  LogoIconStyle,
  LogoGlowType,
} from './AkaarBrandLogo';
import { AgencyData } from '../types';

interface LogoThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AgencyData;
  onUpdateData: (updated: AgencyData) => void;
}

export const LogoThemeStudioModal: React.FC<LogoThemeStudioModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
}) => {
  // Current settings state
  const currentBrand = data.brandSettings || {};

  const [logoTheme, setLogoTheme] = useState<LogoThemeType>(
    currentBrand.logoTheme || 'gold'
  );
  const [logoIconStyle, setLogoIconStyle] = useState<LogoIconStyle>(
    currentBrand.logoIconStyle || 'prism-a'
  );
  const [logoGlow, setLogoGlow] = useState<LogoGlowType>(
    currentBrand.logoGlow || 'high'
  );
  const [logoAccentColor, setLogoAccentColor] = useState<string>(
    currentBrand.logoAccentColor || '#F9CE00'
  );
  const [logoText, setLogoText] = useState<string>(
    currentBrand.logoText || 'AKAAR'
  );
  const [agencySubtitle, setAgencySubtitle] = useState<string>(
    currentBrand.agencySubtitle || 'Agency'
  );
  const [logoUrl, setLogoUrl] = useState<string>(currentBrand.logoUrl || '');
  const [logoFilter, setLogoFilter] = useState<string>(
    currentBrand.logoFilter || ''
  );

  // Preview stage state
  const [previewBg, setPreviewBg] = useState<'obsidian' | 'black' | 'charcoal' | 'light'>(
    'obsidian'
  );
  const [previewSize, setPreviewSize] = useState<'md' | 'lg' | 'xl' | 'giant'>('xl');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Preset themes to easily match with the website
  const themePresets = [
    {
      id: 'gold' as LogoThemeType,
      name: 'Akaar Signature Gold',
      desc: 'Deep Obsidian & #F9CE00 Electric Gold (Website Core Theme)',
      icon: '⚡',
      color: '#F9CE00',
      apply: () => {
        setLogoTheme('gold');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('high');
      },
    },
    {
      id: 'liquid-gold' as LogoThemeType,
      name: 'Liquid Gold Luxury',
      desc: 'Shimmering metallic gradient with ambient gold aura',
      icon: '✨',
      color: '#FFD700',
      apply: () => {
        setLogoTheme('liquid-gold');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('laser');
      },
    },
    {
      id: 'cyber-white' as LogoThemeType,
      name: 'Cyber Minimalist White',
      desc: 'Crisp editorial white typography with #F9CE00 focal dot',
      icon: '⚪',
      color: '#FFFFFF',
      apply: () => {
        setLogoTheme('cyber-white');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('subtle');
      },
    },
    {
      id: 'neon-glow' as LogoThemeType,
      name: 'Radiant Laser Neon',
      desc: 'Pulsing cyber outline with intense kinetic glow',
      icon: '🌟',
      color: '#FFEA00',
      apply: () => {
        setLogoTheme('neon-glow');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('laser');
      },
    },
    {
      id: 'dual-tone' as LogoThemeType,
      name: 'Dual-Tone Architectural',
      desc: 'Interlocking stark white structural beams and gold core',
      icon: '🌓',
      color: '#FFF176',
      apply: () => {
        setLogoTheme('dual-tone');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('high');
      },
    },
    {
      id: 'blueprint' as LogoThemeType,
      name: 'Blueprint Wireframe',
      desc: 'Precision drafting lines inspired by "Akaar" (Form/Structure)',
      icon: '📐',
      color: '#F9CE00',
      apply: () => {
        setLogoTheme('blueprint');
        setLogoAccentColor('#F9CE00');
        setLogoGlow('subtle');
      },
    },
  ];

  // Emblem icon geometries
  const emblemStyles = [
    { id: 'prism-a' as LogoIconStyle, label: 'Prism Apex "A"', desc: 'Geometric angular apex with light facet' },
    { id: 'architectural' as LogoIconStyle, label: 'Monolith Tower', desc: 'Towering structural silhouette' },
    { id: 'facets' as LogoIconStyle, label: '3D Origami Facet', desc: 'Multi-plane dynamic volume' },
    { id: 'monogram' as LogoIconStyle, label: 'Drafting Monogram', desc: 'Precision interlocking glyph' },
    { id: 'geometric-minimal' as LogoIconStyle, label: 'Pure Minimalist', desc: 'Clean high-fashion icon' },
    { id: 'wordmark-only' as LogoIconStyle, label: 'Wordmark Only', desc: 'Typographic purity without emblem' },
  ];

  // Color Swatches matching website palette
  const colorSwatches = [
    { label: 'Signature Akaar Gold', hex: '#F9CE00' },
    { label: 'Cyber Yellow', hex: '#FFEA00' },
    { label: 'Warm Sunlight', hex: '#FFB300' },
    { label: 'Amber Flame', hex: '#F59E0B' },
    { label: 'Pure White', hex: '#FFFFFF' },
    { label: 'Platinum Silver', hex: '#E2E8F0' },
  ];

  // Image Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Auto theme matcher filters for uploaded images (e.g. AKAAR LOGO.jpeg)
  const applyImageThemeFilter = (type: 'gold-tint' | 'dark-invert' | 'high-contrast' | 'none') => {
    switch (type) {
      case 'gold-tint':
        // Sepia + hue rotate to match gold #F9CE00
        setLogoFilter('sepia(1) saturate(5) hue-rotate(5deg) brightness(1.2)');
        break;
      case 'dark-invert':
        // Invert white background into transparent dark mode
        setLogoFilter('invert(1) hue-rotate(180deg) brightness(1.1)');
        break;
      case 'high-contrast':
        setLogoFilter('contrast(1.6) brightness(1.1)');
        break;
      case 'none':
      default:
        setLogoFilter('');
        break;
    }
  };

  // Save changes to application
  const handleApplyToWebsite = () => {
    const updatedData: AgencyData = {
      ...data,
      brandSettings: {
        ...data.brandSettings,
        logoText,
        agencySubtitle,
        logoUrl,
        logoTheme,
        logoIconStyle,
        logoGlow,
        logoAccentColor,
        logoFilter,
      },
    };

    onUpdateData(updatedData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  // Export SVG file
  const handleDownloadSvg = () => {
    const svgCode = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="800" height="240">
  <defs>
    <linearGradient id="akaar-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFF9C4" />
      <stop offset="50%" stopColor="${logoAccentColor}" />
      <stop offset="100%" stopColor="#D97706" />
    </linearGradient>
    <filter id="akaar-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#050505" rx="16" />
  <g transform="translate(40, 20)">
    <!-- Akaar Emblem -->
    <polygon points="40,8 72,72 8,72" stroke="${logoAccentColor}" stroke-width="3.5" fill="none" stroke-linejoin="round" filter="url(#akaar-glow)" />
    <line x1="22" y1="52" x2="58" y2="52" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" />
    <polygon points="40,24 50,42 40,46 30,42" fill="${logoAccentColor}" />
  </g>
  <!-- Wordmark -->
  <text x="135" y="68" font-family="Syne, sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="2">
    ${logoText}
  </text>
  <!-- Punctuation Node -->
  <circle cx="310" cy="56" r="5" fill="${logoAccentColor}" filter="url(#akaar-glow)" />
  <!-- Subtitle -->
  <text x="138" y="90" font-family="monospace" font-size="12" font-weight="700" fill="#A3A3A3" letter-spacing="4">
    ${agencySubtitle.toUpperCase()}
  </text>
</svg>`.trim();

    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${logoText.toLowerCase()}-brand-logo.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PNG file via canvas
  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw emblem
    ctx.save();
    ctx.translate(120, 80);
    ctx.strokeStyle = logoAccentColor;
    ctx.lineWidth = 14;
    ctx.shadowColor = logoAccentColor;
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.moveTo(160, 40);
    ctx.lineTo(280, 280);
    ctx.lineTo(40, 280);
    ctx.closePath();
    ctx.stroke();

    // Crossbar
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(90, 200);
    ctx.lineTo(230, 200);
    ctx.stroke();

    // Center facet
    ctx.fillStyle = logoAccentColor;
    ctx.beginPath();
    ctx.moveTo(160, 100);
    ctx.lineTo(200, 170);
    ctx.lineTo(160, 190);
    ctx.lineTo(120, 170);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 160px sans-serif';
    ctx.shadowColor = logoAccentColor;
    ctx.shadowBlur = 18;
    ctx.fillText(logoText, 520, 260);

    // Node
    ctx.fillStyle = logoAccentColor;
    ctx.beginPath();
    const textWidth = ctx.measureText(logoText).width;
    ctx.arc(520 + textWidth + 20, 230, 18, 0, Math.PI * 2);
    ctx.fill();

    // Subtitle
    ctx.fillStyle = '#A3A3A3';
    ctx.font = '700 42px monospace';
    ctx.shadowBlur = 0;
    ctx.fillText(agencySubtitle.toUpperCase(), 530, 340);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${logoText.toLowerCase()}-brand-logo-4k.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[#F9CE00]/30 rounded-3xl shadow-[0_0_80px_rgba(249,206,0,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-neutral-200"
        >
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0d0d0d] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F9CE00] text-black flex items-center justify-center shadow-md">
                <Palette className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-syne font-black text-white uppercase tracking-tight">
                    AKAAR Logo Theme Studio
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F9CE00]/20 text-[#F9CE00] border border-[#F9CE00]/30">
                    Theme Matcher
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  Edit &amp; harmonize this logo to match Give Akaar&apos;s dark gold website aesthetic
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Close Logo Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN WORKSPACE BODY */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
            {/* LEFT / CENTER: INTERACTIVE PREVIEW STAGE (7 Cols) */}
            <div className="lg:col-span-7 p-6 flex flex-col space-y-5 bg-gradient-to-b from-[#090909] to-[#050505]">
              {/* Preview Stage Controls */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Eye className="w-3.5 h-3.5 text-[#F9CE00]" />
                  Live Website Preview Canvas
                </span>

                <div className="flex items-center gap-2">
                  {/* Background Selector */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setPreviewBg('obsidian')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                        previewBg === 'obsidian'
                          ? 'bg-[#F9CE00] text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Website Obsidian (#050505)"
                    >
                      Obsidian
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('black')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                        previewBg === 'black'
                          ? 'bg-[#F9CE00] text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Pure Black (#000000)"
                    >
                      Pitch Black
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewBg('light')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors ${
                        previewBg === 'light'
                          ? 'bg-[#F9CE00] text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                      title="Light Mode Contrast Check"
                    >
                      Light Test
                    </button>
                  </div>

                  {/* Size Switcher */}
                  <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
                    {(['md', 'lg', 'xl', 'giant'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPreviewSize(s)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-colors ${
                          previewSize === s
                            ? 'bg-neutral-700 text-white font-bold'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Interactive Stage Box */}
              <div
                className={`relative flex-1 min-h-[280px] sm:min-h-[340px] rounded-2xl border flex flex-col items-center justify-center p-8 transition-colors duration-300 overflow-hidden shadow-inner ${
                  previewBg === 'obsidian'
                    ? 'bg-[#050505] border-neutral-800'
                    : previewBg === 'black'
                    ? 'bg-black border-neutral-800'
                    : previewBg === 'charcoal'
                    ? 'bg-[#141414] border-neutral-800'
                    : 'bg-[#F3F4F6] border-neutral-300 text-neutral-900'
                }`}
              >
                {/* Subtle Geometric Background Grid */}
                <div
                  className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${
                      previewBg === 'light' ? '#000000' : '#ffffff'
                    } 1px, transparent 1px), linear-gradient(to bottom, ${
                      previewBg === 'light' ? '#000000' : '#ffffff'
                    } 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                  }}
                />

                {/* Ambient Radial Golden Glow */}
                {logoGlow !== 'none' && previewBg !== 'light' && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-300"
                    style={{
                      backgroundColor:
                        logoGlow === 'laser'
                          ? 'rgba(249, 206, 0, 0.22)'
                          : 'rgba(249, 206, 0, 0.12)',
                    }}
                  />
                )}

                {/* RENDERED THEME-MATCHED LOGO */}
                <div className="relative z-10 py-6">
                  <AkaarBrandLogo
                    logoUrl={logoUrl}
                    logoText={logoText}
                    agencySubtitle={agencySubtitle}
                    logoTheme={logoTheme}
                    logoIconStyle={logoIconStyle}
                    logoGlow={logoGlow}
                    logoAccentColor={logoAccentColor}
                    logoFilter={logoFilter}
                    size={previewSize}
                    showSubtitle={true}
                    showEmblem={true}
                    showWordmark={true}
                  />
                </div>

                {/* Interactive Status Indicator */}
                <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-mono text-neutral-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE00] animate-pulse" />
                  <span>THEME: {logoTheme.toUpperCase()}</span>
                  <span>&bull;</span>
                  <span>ACCENT: {logoAccentColor}</span>
                  <span>&bull;</span>
                  <span>GLOW: {logoGlow.toUpperCase()}</span>
                </div>
              </div>

              {/* Quick Preset Selector Cards (1-Click Theme Match) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-300 font-bold flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-[#F9CE00]" />
                    1-Click Presets: Match Website Aesthetic
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Click to instantly apply
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {themePresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={preset.apply}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        logoTheme === preset.id
                          ? 'bg-[#151515] border-[#F9CE00] shadow-[0_0_15px_rgba(249,206,0,0.2)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{preset.icon}</span>
                        <span className="text-xs font-bold text-white truncate font-syne">
                          {preset.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 leading-snug">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: DETAILED CONTROLS & ASSET EXPORT (5 Cols) */}
            <div className="lg:col-span-5 p-6 flex flex-col space-y-6 bg-[#0a0a0a]">
              {/* SECTION 1: EMBLEM GEOMETRY */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5 uppercase">
                  <Layers className="w-3.5 h-3.5 text-[#F9CE00]" />
                  Logo Icon / Emblem Geometry
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {emblemStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setLogoIconStyle(style.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        logoIconStyle === style.id
                          ? 'bg-neutral-900 border-[#F9CE00] text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold font-syne">{style.label}</div>
                      <div className="text-[10px] text-neutral-500 line-clamp-1">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: GLOW & AURA */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#F9CE00]" />
                  Ambient Glow &amp; Aura
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'subtle', 'high', 'laser'] as const).map((glow) => (
                    <button
                      key={glow}
                      type="button"
                      onClick={() => setLogoGlow(glow)}
                      className={`py-2 rounded-xl text-xs font-mono capitalize transition-all border ${
                        logoGlow === glow
                          ? 'bg-[#F9CE00] text-black font-bold border-[#F9CE00]'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {glow}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 3: COLOR PALETTE */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-300 font-bold flex items-center gap-1.5 uppercase">
                  <Zap className="w-3.5 h-3.5 text-[#F9CE00]" />
                  Accent Color (Theme Harmony)
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => setLogoAccentColor(swatch.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                        logoAccentColor.toLowerCase() === swatch.hex.toLowerCase()
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.label}
                    >
                      {logoAccentColor.toLowerCase() === swatch.hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="text-[10px] font-mono text-neutral-400">Custom:</span>
                    <input
                      type="color"
                      value={logoAccentColor}
                      onChange={(e) => setLogoAccentColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: TEXT CONTENT */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Wordmark Text
                  </label>
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-syne font-bold text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={agencySubtitle}
                    onChange={(e) => setAgencySubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono text-xs focus:outline-none focus:border-[#F9CE00]"
                  />
                </div>
              </div>

              {/* SECTION 5: CUSTOM IMAGE / LOGO UPLOAD (e.g. AKAAR LOGO.jpeg) */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#F9CE00]" />
                    Upload / Replace Image (AKAAR LOGO)
                  </span>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl('');
                        setLogoFilter('');
                      }}
                      className="text-[10px] font-mono text-red-400 hover:underline"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-syne font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#F9CE00]" />
                    <span>Choose AKAAR LOGO File</span>
                  </button>
                </div>

                {logoUrl && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      Auto Theme-Match Filter for Uploaded Image:
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => applyImageThemeFilter('gold-tint')}
                        className="py-1 px-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-center"
                      >
                        Gold Tint
                      </button>
                      <button
                        type="button"
                        onClick={() => applyImageThemeFilter('dark-invert')}
                        className="py-1 px-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-center"
                      >
                        Dark Invert
                      </button>
                      <button
                        type="button"
                        onClick={() => applyImageThemeFilter('high-contrast')}
                        className="py-1 px-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-center"
                      >
                        Hi-Contrast
                      </button>
                      <button
                        type="button"
                        onClick={() => applyImageThemeFilter('none')}
                        className="py-1 px-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-center"
                      >
                        Original
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 space-y-2 mt-auto">
                <button
                  type="button"
                  onClick={handleApplyToWebsite}
                  className="w-full py-3.5 rounded-2xl bg-[#F9CE00] hover:bg-yellow-400 text-black font-syne font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(249,206,0,0.4)] transition-all cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Applied to Website Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>Apply Theme to Entire Website</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Download vector SVG"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F9CE00]" />
                    <span>Download SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Download high-resolution 4K PNG"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F9CE00]" />
                    <span>Download 4K PNG</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
