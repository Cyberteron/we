import React from 'react';

interface BrandMarqueeProps {
  text?: string;
  reverse?: boolean;
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({
  text = 'GIVE AKAAR TO YOUR BRAND',
  reverse = false,
}) => {
  const items = Array.from({ length: 8 });

  // Format highlighted word
  const renderFormattedText = (str: string) => {
    const uppercaseStr = str.toUpperCase();
    if (uppercaseStr.includes('YOUR BRAND')) {
      const parts = str.split(/your brand/i);
      return (
        <>
          {parts[0]}
          <em className="text-[#F9CE00] not-italic underline decoration-neutral-700 decoration-2">
            YOUR BRAND
          </em>
          {parts[1] || ''}
        </>
      );
    }
    if (uppercaseStr.includes('OUR BRANDS')) {
      const parts = str.split(/our brands/i);
      return (
        <>
          {parts[0]}
          <em className="text-[#F9CE00] not-italic underline decoration-neutral-700 decoration-2">
            YOUR BRAND
          </em>
          {parts[1] || ''}
        </>
      );
    }
    return str;
  };

  return (
    <div className="relative w-full bg-[#0a0a0a] border-y border-neutral-800/80 py-4 sm:py-6 overflow-hidden select-none">
      <div className={reverse ? 'animate-marquee-reverse' : 'animate-marquee-infinite'}>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-6 sm:gap-10 px-4 sm:px-6 shrink-0">
            <span className="text-2xl sm:text-4xl md:text-5xl font-syne font-black tracking-tight uppercase text-neutral-300">
              {renderFormattedText(text)}
            </span>
            {/* Custom Hello Wave Icon SVG */}
            <svg
              className="w-10 h-8 sm:w-14 sm:h-12 text-[#F9CE00] fill-current shrink-0"
              viewBox="0 0 138 117"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M66.2717 20.4116C39.9184 21.0539 16.785 39.0575 18.3926 55.8523C18.5031 57.0236 19.6696 60.5899 23.2097 60.5899C26.908 60.5899 28.2628 57.3466 28.2712 56.1641C28.4332 41.7052 43.2104 33.2769 67.5647 30.0514C68.7313 29.8998 71.9446 28.2182 71.263 24.1922C70.6198 20.4116 67.4514 20.3872 66.2717 20.4116Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M137.096 45.4681C135.47 18.4884 103.511 -1.54506 65.7335 0.0886611C27.9564 1.72238 -0.999863 24.3985 0.626487 51.3782C2.25284 78.3579 33.8475 99.3094 71.6246 97.6757C109.402 96.042 138.722 72.4478 137.096 45.4681Z"
                fill="currentColor"
                fillOpacity="0.15"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
