import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { AkaarBrandLogo, LogoThemeType, LogoIconStyle, LogoGlowType } from './AkaarBrandLogo';

interface WebsiteStartAnimationProps {
  logoUrl?: string;
  logoText?: string;
  subtitle?: string;
  logoTheme?: LogoThemeType;
  logoIconStyle?: LogoIconStyle;
  logoGlow?: LogoGlowType;
  logoAccentColor?: string;
  logoFilter?: string;
  onComplete: () => void;
}

export const WebsiteStartAnimation: React.FC<WebsiteStartAnimationProps> = ({
  logoUrl,
  logoText = 'AKAAR',
  subtitle = 'IDEAS GET A FORM. // AKAAR ENTERTAINMENTS',
  logoTheme = 'gold',
  logoIconStyle = 'prism-a',
  logoGlow = 'laser',
  logoAccentColor = '#F9CE00',
  logoFilter = '',
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'revealing' | 'ready' | 'exit'>('revealing');

  useEffect(() => {
    // Smooth progress counter simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate near the end
        const increment = prev < 50 ? 3 : prev < 85 ? 5 : 8;
        return Math.min(100, prev + increment);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setStage('ready');
      const timer = setTimeout(() => {
        setStage('exit');
        const exitTimer = setTimeout(() => {
          onComplete();
        }, 600);
        return () => clearTimeout(exitTimer);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          key="website-start-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            filter: 'blur(12px)',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F9CE00]/12 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#F9CE00]/20 rounded-full blur-[80px]" />
          </div>

          {/* Delicate Geometric Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Center Brand Identity Container */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
            {/* Logo Graphic or Geometric Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
                {/* Outer Golden Concentric Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-[#F9CE00]/40"
                />
                {/* Counter Rotating Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2.5 rounded-full border border-neutral-800"
                />

                {/* Center Theme-Matched Akaar Logo Emblem */}
                <div className="relative z-10 flex items-center justify-center p-2">
                  <AkaarBrandLogo
                    logoUrl={logoUrl}
                    logoText={logoText}
                    logoTheme={logoTheme}
                    logoIconStyle={logoIconStyle}
                    logoGlow={logoGlow}
                    logoAccentColor={logoAccentColor}
                    logoFilter={logoFilter}
                    size="xl"
                    showSubtitle={false}
                    showEmblem={true}
                    showWordmark={false}
                  />
                </div>

                {/* Corner Accent Dots */}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F9CE00] animate-ping" />
              </div>
            </motion.div>

            {/* Kinetic Typography Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-2 mb-8"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-400">
                  COME GIVE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#F9CE00]" />
              </div>

              <div className="flex items-center justify-center">
                <AkaarBrandLogo
                  logoUrl=""
                  logoText={logoText}
                  logoTheme={logoTheme}
                  logoGlow={logoGlow}
                  logoAccentColor={logoAccentColor}
                  size="xl"
                  showSubtitle={false}
                  showEmblem={false}
                  showWordmark={true}
                />
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-xs sm:text-sm font-mono text-[#F9CE00] font-medium tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F9CE00] animate-pulse" />
                <span>{subtitle}</span>
              </div>
            </motion.div>

            {/* Sleek Golden Progress Engine */}
            <div className="w-full max-w-xs space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F9CE00] animate-pulse" />
                  <span className="text-neutral-300">
                    {progress < 40
                      ? 'INITIALIZING STUDIOS...'
                      : progress < 80
                      ? 'SYNCING CREATIVE ENGINE...'
                      : 'EXPERIENCE READY'}
                  </span>
                </span>
                <span className="text-[#F9CE00] font-bold">{progress}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#F9CE00] via-yellow-300 to-[#F9CE00] rounded-full shadow-[0_0_12px_rgba(249,206,0,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* Studio Locations Tag */}
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest pt-1">
                PUNE &bull; MUMBAI &bull; DIGITAL CULTURE
              </div>
            </div>
          </div>

          {/* Quick Skip Button in Corner */}
          <button
            type="button"
            onClick={() => {
              setStage('exit');
              setTimeout(onComplete, 300);
            }}
            className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Skip &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
