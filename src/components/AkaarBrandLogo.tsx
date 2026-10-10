import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Edit3 } from 'lucide-react';

export type LogoThemeType = 'gold' | 'liquid-gold' | 'cyber-white' | 'neon-glow' | 'dual-tone' | 'blueprint' | 'minimal';
export type LogoIconStyle = 'prism-a' | 'architectural' | 'facets' | 'monogram' | 'geometric-minimal' | 'wordmark-only';
export type LogoGlowType = 'none' | 'subtle' | 'high' | 'laser';

export interface AkaarBrandLogoProps {
  logoUrl?: string;
  logoText?: string;
  agencySubtitle?: string;
  logoTheme?: LogoThemeType;
  logoIconStyle?: LogoIconStyle;
  logoGlow?: LogoGlowType;
  logoAccentColor?: string;
  logoFilter?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  showSubtitle?: boolean;
  showEmblem?: boolean;
  showWordmark?: boolean;
  interactive?: boolean;
  onOpenEditor?: () => void;
  className?: string;
}

export const AkaarBrandLogo: React.FC<AkaarBrandLogoProps> = ({
  logoUrl,
  logoText = 'AKAAR',
  agencySubtitle = 'Agency',
  logoTheme = 'gold',
  logoIconStyle = 'prism-a',
  logoGlow = 'high',
  logoAccentColor = '#F9CE00',
  logoFilter = '',
  size = 'md',
  showSubtitle = true,
  showEmblem = true,
  showWordmark = true,
  interactive = false,
  onOpenEditor,
  className = '',
}) => {
  // Theme-specific color palettes and glow filters
  const getThemeStyles = () => {
    switch (logoTheme) {
      case 'liquid-gold':
        return {
          primary: '#F9CE00',
          gradient: 'from-amber-200 via-[#F9CE00] to-yellow-500',
          svgFill: 'url(#akaar-liquid-gold)',
          stroke: '#F9CE00',
          glowColor: 'rgba(249, 206, 0, 0.6)',
          textColor: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#F9CE00] to-yellow-400',
          dotColor: '#F9CE00',
        };
      case 'cyber-white':
        return {
          primary: '#FFFFFF',
          gradient: 'from-white via-neutral-100 to-neutral-300',
          svgFill: '#FFFFFF',
          stroke: '#FFFFFF',
          glowColor: 'rgba(255, 255, 255, 0.4)',
          textColor: 'text-white',
          dotColor: logoAccentColor || '#F9CE00',
        };
      case 'neon-glow':
        return {
          primary: logoAccentColor || '#F9CE00',
          gradient: 'from-yellow-300 via-[#F9CE00] to-amber-400',
          svgFill: 'none',
          stroke: logoAccentColor || '#F9CE00',
          glowColor: 'rgba(249, 206, 0, 0.85)',
          textColor: 'text-white drop-shadow-[0_0_12px_rgba(249,206,0,0.8)]',
          dotColor: logoAccentColor || '#F9CE00',
        };
      case 'dual-tone':
        return {
          primary: logoAccentColor || '#F9CE00',
          gradient: 'from-white via-[#F9CE00] to-white',
          svgFill: 'url(#akaar-dual-tone)',
          stroke: '#FFFFFF',
          glowColor: 'rgba(249, 206, 0, 0.5)',
          textColor: 'text-white',
          dotColor: logoAccentColor || '#F9CE00',
        };
      case 'blueprint':
        return {
          primary: logoAccentColor || '#F9CE00',
          gradient: 'from-yellow-400 to-[#F9CE00]',
          svgFill: 'none',
          stroke: logoAccentColor || '#F9CE00',
          glowColor: 'rgba(249, 206, 0, 0.3)',
          textColor: 'text-neutral-100 font-mono tracking-widest',
          dotColor: logoAccentColor || '#F9CE00',
        };
      case 'minimal':
        return {
          primary: '#FFFFFF',
          gradient: 'from-white to-neutral-200',
          svgFill: '#FFFFFF',
          stroke: '#FFFFFF',
          glowColor: 'rgba(249, 206, 0, 0.15)',
          textColor: 'text-white',
          dotColor: logoAccentColor || '#F9CE00',
        };
      case 'gold':
      default:
        return {
          primary: logoAccentColor || '#F9CE00',
          gradient: 'from-yellow-300 via-[#F9CE00] to-yellow-500',
          svgFill: logoAccentColor || '#F9CE00',
          stroke: logoAccentColor || '#F9CE00',
          glowColor: 'rgba(249, 206, 0, 0.55)',
          textColor: 'text-white',
          dotColor: logoAccentColor || '#F9CE00',
        };
    }
  };

  const themeStyle = getThemeStyles();

  // Glow shadow map
  const getGlowFilter = () => {
    if (logoGlow === 'none') return 'none';
    if (logoGlow === 'subtle') return `drop-shadow(0 0 6px ${themeStyle.glowColor})`;
    if (logoGlow === 'laser') return `drop-shadow(0 0 16px ${themeStyle.glowColor}) drop-shadow(0 0 30px ${themeStyle.glowColor})`;
    // High default
    return `drop-shadow(0 0 12px ${themeStyle.glowColor})`;
  };

  // Dimensions based on size prop
  const sizeMap = {
    sm: {
      emblem: 'w-6 h-6',
      svg: 24,
      text: 'text-lg',
      sub: 'text-[9px]',
      dot: 'w-1.5 h-1.5',
      container: 'gap-1.5',
    },
    md: {
      emblem: 'w-8 h-8 sm:w-9 sm:h-9',
      svg: 34,
      text: 'text-2xl',
      sub: 'text-[11px]',
      dot: 'w-2 h-2',
      container: 'gap-2.5',
    },
    lg: {
      emblem: 'w-12 h-12 sm:w-14 sm:h-14',
      svg: 48,
      text: 'text-3xl sm:text-4xl',
      sub: 'text-xs',
      dot: 'w-2.5 h-2.5',
      container: 'gap-3.5',
    },
    xl: {
      emblem: 'w-16 h-16 sm:w-20 sm:h-20',
      svg: 68,
      text: 'text-4xl sm:text-6xl',
      sub: 'text-sm',
      dot: 'w-3 h-3',
      container: 'gap-4',
    },
    giant: {
      emblem: 'w-24 h-24 sm:w-32 sm:h-32',
      svg: 96,
      text: 'text-6xl sm:text-8xl md:text-9xl',
      sub: 'text-base sm:text-lg',
      dot: 'w-4 h-4',
      container: 'gap-6',
    },
  }[size];

  // Render vector emblem SVG
  const renderEmblemSvg = () => {
    switch (logoIconStyle) {
      case 'architectural':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: getGlowFilter() }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="akaar-arch-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="50%" stopColor={themeStyle.primary} />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Towering Monolithic Architectural Form */}
            <path
              d="M50 8 L88 88 L68 88 L50 48 L32 88 L12 88 Z"
              fill={logoTheme === 'liquid-gold' ? 'url(#akaar-arch-grad)' : themeStyle.svgFill}
              stroke={themeStyle.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Structural Cross-Lintel */}
            <rect
              x="30"
              y="60"
              width="40"
              height="6"
              fill={themeStyle.primary}
              rx="1"
            />
            {/* Luminous Apex Beacon */}
            <circle cx="50" cy="18" r="3" fill="#FFFFFF" />
          </svg>
        );

      case 'facets':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: getGlowFilter() }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="facet-l" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor={themeStyle.primary} />
              </linearGradient>
              <linearGradient id="facet-r" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={themeStyle.primary} />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
            {/* Faceted Origami 3D Geometry */}
            <polygon points="50,10 50,75 16,85" fill="url(#facet-l)" opacity="0.95" />
            <polygon points="50,10 84,85 50,75" fill="url(#facet-r)" opacity="0.85" />
            <polygon points="50,38 72,78 28,78" fill="#0A0A0A" />
            <polygon points="50,44 64,72 36,72" fill={themeStyle.primary} />
          </svg>
        );

      case 'monogram':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: getGlowFilter() }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Precision Interlocking 'A' with Drafting Marks */}
            <polygon
              points="50,12 88,86 12,86"
              stroke={themeStyle.stroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1="28" y1="58" x2="72" y2="58" stroke={themeStyle.primary} strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="38" r="5" fill={themeStyle.primary} />
            {/* Registration ticks */}
            <line x1="50" y1="4" x2="50" y2="10" stroke={themeStyle.primary} strokeWidth="2" />
            <line x1="90" y1="86" x2="96" y2="86" stroke={themeStyle.primary} strokeWidth="2" />
            <line x1="4" y1="86" x2="10" y2="86" stroke={themeStyle.primary} strokeWidth="2" />
          </svg>
        );

      case 'geometric-minimal':
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: getGlowFilter() }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ultra-pure Minimalist Glyph */}
            <path
              d="M50 14 L84 84 H68 L50 48 L32 84 H16 Z"
              fill={themeStyle.primary}
            />
            <circle cx="50" cy="62" r="4" fill="#FFFFFF" />
          </svg>
        );

      case 'prism-a':
      default:
        return (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ filter: getGlowFilter() }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="akaar-liquid-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9C4" />
                <stop offset="35%" stopColor="#F9CE00" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
              <linearGradient id="akaar-dual-tone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F9CE00" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Outer Glowing Triangular Apex */}
            <polygon
              points="50,10 90,85 10,85"
              stroke={themeStyle.stroke}
              strokeWidth="4"
              strokeLinejoin="round"
              className={logoTheme === 'neon-glow' ? 'animate-pulse' : ''}
            />
            {/* Architectural Crossbar */}
            <line
              x1="26"
              y1="60"
              x2="74"
              y2="60"
              stroke={logoTheme === 'cyber-white' ? '#FFFFFF' : '#FFFFFF'}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Central Light Prism Facet */}
            <polygon
              points="50,28 62,50 50,55 38,50"
              fill={themeStyle.primary}
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`group relative inline-flex items-center ${sizeMap.container} select-none ${className} ${
        interactive ? 'cursor-pointer' : ''
      }`}
      onClick={interactive && onOpenEditor ? onOpenEditor : undefined}
      title={interactive ? 'Customize Akaar Logo & Match Theme' : undefined}
    >
      {/* 1. EMBLEM / ICON (IF ENABLED OR IF CUSTOM LOGO URL) */}
      {showEmblem && logoIconStyle !== 'wordmark-only' && (
        <div className={`relative ${sizeMap.emblem} flex items-center justify-center shrink-0`}>
          {logoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={logoUrl}
                alt={logoText || 'Akaar Logo'}
                style={{
                  filter: logoFilter ? `${getGlowFilter()} ${logoFilter}` : getGlowFilter(),
                }}
                className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              {renderEmblemSvg()}
            </div>
          )}

          {/* Edit Badge Overlay if Interactive */}
          {interactive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F9CE00] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
              <Edit3 className="w-2.5 h-2.5" />
            </div>
          )}
        </div>
      )}

      {/* 2. TYPOGRAPHIC WORDMARK */}
      {showWordmark && (
        <div className="flex items-center gap-2">
          <span
            className={`font-syne font-black tracking-tighter uppercase leading-none ${sizeMap.text} ${themeStyle.textColor} transition-all duration-300`}
            style={{
              textShadow:
                logoGlow !== 'none'
                  ? `0 0 16px ${themeStyle.glowColor}`
                  : undefined,
            }}
          >
            {logoText || 'AKAAR'}
            {/* Signature Akaar Punctuation Node */}
            <span
              className={`inline-block ${sizeMap.dot} ml-1 rounded-full transition-transform duration-300 group-hover:scale-125`}
              style={{
                backgroundColor: themeStyle.dotColor,
                boxShadow: `0 0 10px ${themeStyle.dotColor}`,
              }}
            />
          </span>

          {/* Subtitle / Tagline pill */}
          {showSubtitle && agencySubtitle && (
            <span
              className={`font-mono tracking-widest uppercase border-l border-neutral-700/80 pl-2 text-neutral-400 font-bold hidden sm:inline-block ${sizeMap.sub}`}
            >
              {agencySubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
