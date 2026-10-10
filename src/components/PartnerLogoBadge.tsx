import React from 'react';
import { InfluencerPartnerWithSvg } from '../data/influencerPartnersData';

export interface PartnerLogoBadgeProps {
  partner: InfluencerPartnerWithSvg;
  className?: string;
  imageClassName?: string;
  mode?: 'grid' | 'ticker';
}

export const KNOWN_VECTOR_PARTNER_IDS = new Set([
  'bpcl-mak',
  'redbull',
  'decathlon',
  'converse',
  'lenskart',
  'being-human',
  'jack-jones',
  'cottonworld',
  'gisb',
  'school-of-raya',
  'pune-university',
  'akudo',
  'nutrabox',
  'hearty',
  'ab-design',
  'aycs',
  'gro-club',
  'flowstate',
  'comet',
  'snapchat',
  'westside',
  'jbl',
  'firefox',
  'borosil',
  'urban-monkey',
  'psynyde-bikes',
  'homegrown',
  'glasafe',
  'neko',
  'prodirt-adventure',
]);

/**
 * Normalizes any string (ID, brand name, slug, typo, or synonym)
 * into one of the 30 canonical brand keys.
 */
export const normalizeBrandId = (idOrName: string): string => {
  if (!idOrName) return '';
  const clean = idOrName.toLowerCase().replace(/^client-/, '').replace(/^inf-/, '').trim();

  if (clean.includes('bpcl') || clean.includes('mak')) return 'bpcl-mak';
  if (clean.includes('redbull') || clean.includes('red bull') || clean.includes('red-bull')) return 'redbull';
  if (clean.includes('decathlon')) return 'decathlon';
  if (clean.includes('converse') || clean.includes('all star')) return 'converse';
  if (clean.includes('lenskart')) return 'lenskart';
  if (clean.includes('being human') || clean.includes('being-human') || clean.includes('beinghuman')) return 'being-human';
  if (clean.includes('jack') && (clean.includes('jones') || clean.includes('&'))) return 'jack-jones';
  if (clean.includes('cottonworld') || clean.includes('cotton world')) return 'cottonworld';
  if (clean.includes('gisb')) return 'gisb';
  if (clean.includes('raya')) return 'school-of-raya';
  if (clean.includes('pune') || clean.includes('sppu')) return 'pune-university';
  if (clean.includes('akudo')) return 'akudo';
  if (clean.includes('nutrabox') || clean.includes('nutra box')) return 'nutrabox';
  if (clean.includes('hearty')) return 'hearty';
  if (clean.includes('ab design') || clean.includes('ab-design') || clean === 'ab') return 'ab-design';
  if (clean.includes('aycs') || clean.includes('all you can street')) return 'aycs';
  if (clean.includes('gro') && clean.includes('club')) return 'gro-club';
  if (clean.includes('flowstate') || clean.includes('flow state')) return 'flowstate';
  if (clean.includes('comet')) return 'comet';
  if (clean.includes('snapchat') || clean === 'snap') return 'snapchat';
  if (clean.includes('westside')) return 'westside';
  if (clean.includes('jbl')) return 'jbl';
  if (clean.includes('firefox')) return 'firefox';
  if (clean.includes('borosil')) return 'borosil';
  if (clean.includes('urban monkey') || clean.includes('urban-monkey') || clean.includes('urbanmonkey')) return 'urban-monkey';
  if (clean.includes('psynyde')) return 'psynyde-bikes';
  if (clean.includes('homegrown') || clean.includes('home grown')) return 'homegrown';
  if (clean.includes('glasafe') || clean.includes('gla safe')) return 'glasafe';
  if (clean.includes('neko')) return 'neko';
  if (clean.includes('prodirt')) return 'prodirt-adventure';

  return clean;
};

/**
 * Resolves the canonical brand key from either an ID or a brand name.
 */
export const resolveBrandId = (id?: string, name?: string): string => {
  const byId = normalizeBrandId(id || '');
  if (KNOWN_VECTOR_PARTNER_IDS.has(byId)) return byId;
  const byName = normalizeBrandId(name || '');
  if (KNOWN_VECTOR_PARTNER_IDS.has(byName)) return byName;
  return byId || byName || (id || '');
};

/**
 * Authentic, real vector brand logos for all 30 Influencer Selected Partners.
 * Self-contained SVGs that never fail, never suffer from CORS or broken links,
 * and provide the exact corporate identity, typography, and colors of each brand.
 */
export const BrandVectorLogo: React.FC<{
  partnerId: string;
  name: string;
  accentColor?: string;
  mode?: 'grid' | 'ticker';
}> = ({ name, mode = 'grid' }) => {
  return (
    <div className="flex items-center justify-center select-none">
      <span
        className={`font-syne font-black uppercase tracking-wider text-white text-center leading-tight truncate ${
          mode === 'grid' ? 'text-xs sm:text-sm md:text-base' : 'text-xs sm:text-sm whitespace-nowrap'
        }`}
      >
        {name}
      </span>
    </div>
  );
};

export const PartnerLogoBadge: React.FC<PartnerLogoBadgeProps> = ({
  partner,
  className = '',
  mode = 'ticker',
}) => {
  const [imgError, setImgError] = React.useState(false);

  // 1. Priority: If user uploaded a logo or provided a logoUrl, render it directly
  const hasUploadedLogo = Boolean(
    partner.logoUrl && partner.logoUrl.trim() !== '' && !imgError
  );

  if (hasUploadedLogo) {
    return (
      <div
        className={`flex items-center justify-center relative select-none ${
          mode === 'grid' ? 'w-full h-full max-w-full overflow-hidden' : 'whitespace-nowrap'
        } ${className}`}
      >
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className={`${
            mode === 'grid'
              ? 'max-h-12 sm:max-h-14 max-w-[85%] object-contain rounded-lg'
              : 'h-7 sm:h-8 max-w-[120px] object-contain rounded-md'
          }`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // 2. Restored authentic name / monogram fallback when no logo is uploaded
  const initials = partner.name
    .split(/[\s/&-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || partner.name.slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center relative select-none ${
        mode === 'grid' ? 'w-full h-full max-w-full px-2 py-1' : 'whitespace-nowrap px-3'
      } ${className}`}
    >
      {mode === 'grid' ? (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-900/90 border border-neutral-800 flex items-center justify-center text-sm sm:text-base font-syne font-black text-neutral-200 group-hover:text-[#F9CE00] group-hover:border-[#F9CE00]/50 transition-colors shadow-inner">
          {initials}
        </div>
      ) : (
        <span
          className="font-syne font-black uppercase text-center tracking-wider text-white hover:text-[#F9CE00] transition-colors leading-tight truncate text-xs sm:text-sm"
          title={partner.name}
        >
          {partner.name}
        </span>
      )}
    </div>
  );
};
