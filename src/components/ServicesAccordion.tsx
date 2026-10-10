import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { BrandOffering } from '../types';

interface ServicesAccordionProps {
  brands: BrandOffering[];
  onSelectBrand?: (brand: BrandOffering) => void;
  onOpenContact: () => void;
}

export const ServicesAccordion: React.FC<ServicesAccordionProps> = ({
  brands,
  onSelectBrand,
  onOpenContact,
}) => {
  const [activeBrandId, setActiveBrandId] = useState<string>(brands[0]?.id || 'creative');
  const [selectedBrandForModal, setSelectedBrandForModal] = useState<BrandOffering | null>(null);

  const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];

  return (
    <section id="brands" className="py-20 sm:py-28 bg-[#0a0a0a] relative overflow-hidden border-b border-neutral-900 scroll-mt-20">
      <div id="work" className="absolute -top-24 left-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center text-xs font-bold uppercase tracking-[0.25em] text-[#F9CE00] mb-3">
              <span>Our Specialised Brands</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-black text-white tracking-tight uppercase">
              Seven Brands. <br className="hidden sm:inline" />
              <span className="text-neutral-400">One Integrated Powerhouse.</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 max-w-md">
            Whether you need an agile social lab, high-tier creator partnerships, or end-to-end multi-channel creative, our dedicated units operate seamlessly as one team.
          </p>
        </div>

        {/* Desktop Interactive Expanding Accordion Panels */}
        <div className="hidden lg:flex w-full h-[620px] gap-2 rounded-2xl overflow-hidden p-2 bg-neutral-950 border border-neutral-800">
          {brands.map((brand, idx) => {
            const isActive = brand.id === activeBrandId;
            return (
              <motion.div
                key={brand.id}
                layout
                onClick={() => setActiveBrandId(brand.id)}
                onMouseEnter={() => setActiveBrandId(brand.id)}
                className={`relative h-full rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between ${
                  isActive ? 'flex-[4] shadow-2xl' : 'flex-1 hover:flex-[1.2]'
                }`}
              >
                {/* Background Image with Dark Gradient */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={brand.bgImage}
                    alt={brand.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isActive ? 'scale-105 filter brightness-75' : 'filter brightness-40 grayscale group-hover:grayscale-0'
                    }`}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive
                        ? 'bg-gradient-to-t from-black via-black/60 to-black/30'
                        : 'bg-black/80 hover:bg-black/60'
                    }`}
                  />
                </div>

                {/* Vertical Pill Tag (Shown when collapsed) */}
                {!isActive && (
                  <div className="relative z-10 h-full flex flex-col items-center justify-between py-8 px-2">
                    <span className="text-xs font-mono font-bold text-[#F9CE00]">
                      0{idx + 1}
                    </span>
                    <span className="text-sm font-syne font-bold text-neutral-300 uppercase tracking-widest -rotate-90 whitespace-nowrap">
                      {brand.shortName}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-neutral-700" />
                  </div>
                )}

                {/* Expanded Content (Shown when active) */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 h-full p-8 flex flex-col justify-between"
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#F9CE00] text-black text-xs font-black tracking-widest uppercase">
                        0{idx + 1} // {brand.shortName}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBrandForModal(brand);
                        }}
                        className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-[#F9CE00] hover:text-black hover:border-[#F9CE00] transition-colors"
                        title="View Full Brand Capabilities"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Bottom Details */}
                    <div className="space-y-4 max-w-xl">
                      <h3 className="text-3xl xl:text-4xl font-syne font-extrabold text-white tracking-tight uppercase leading-none">
                        {brand.name}
                      </h3>
                      <p className="text-lg font-semibold text-[#F9CE00] leading-snug">
                        {brand.tagline}
                      </p>
                      <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                        {brand.description}
                      </p>

                      {/* Capabilities pills */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {brand.capabilities.map((cap) => (
                          <span
                            key={cap}
                            className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-xs font-medium text-neutral-200"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrandForModal(brand);
                          }}
                          className="px-5 py-2.5 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-[#F9CE00] transition-colors"
                        >
                          Learn More &rarr;
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenContact();
                          }}
                          className="px-5 py-2.5 rounded-full bg-black/60 border border-neutral-600 text-neutral-200 font-syne font-bold text-xs uppercase tracking-wider hover:border-white hover:text-white transition-colors"
                        >
                          Brief This Brand
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Accordion (Stack layout) */}
        <div className="lg:hidden flex flex-col gap-3">
          {brands.map((brand, idx) => {
            const isOpen = brand.id === activeBrandId;
            return (
              <div
                key={brand.id}
                className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 transition-colors"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setActiveBrandId(isOpen ? '' : brand.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#F9CE00]">
                      0{idx + 1}
                    </span>
                    <span className="font-syne font-extrabold text-base sm:text-lg text-white uppercase tracking-tight">
                      {brand.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-90 text-[#F9CE00]' : ''
                    }`}
                  />
                </button>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-neutral-800/80"
                    >
                      <div className="relative p-5">
                        <div className="relative z-10 space-y-3">
                          <p className="text-sm font-semibold text-[#F9CE00]">
                            {brand.tagline}
                          </p>
                          <p className="text-xs text-neutral-300 leading-relaxed">
                            {brand.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {brand.capabilities.map((c) => (
                              <span
                                key={c}
                                className="px-2.5 py-0.5 rounded bg-black/80 border border-neutral-700 text-[11px] text-neutral-300"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => setSelectedBrandForModal(brand)}
                              className="px-4 py-2 rounded-full bg-[#F9CE00] text-black text-xs font-bold uppercase tracking-wider"
                            >
                              Explore Capabilities
                            </button>
                            <button
                              onClick={onOpenContact}
                              className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-white text-xs font-bold uppercase tracking-wider"
                            >
                              Enquire
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Capability Modal */}
      <AnimatePresence>
        {selectedBrandForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedBrandForModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              >
                &times;
              </button>

              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#F9CE00] mb-2 tracking-widest">
                Division Profile
              </div>
              <h3 className="text-3xl font-syne font-black text-white uppercase mb-2">
                {selectedBrandForModal.name}
              </h3>
              <p className="text-base text-[#F9CE00] font-semibold mb-4">
                {selectedBrandForModal.tagline}
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                {selectedBrandForModal.description}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Core Deliverables & Capabilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {selectedBrandForModal.capabilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs font-medium text-neutral-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#F9CE00] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedBrandForModal(null);
                    onOpenContact();
                  }}
                  className="flex-1 py-3 px-6 rounded-full bg-[#F9CE00] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors text-center"
                >
                  Request {selectedBrandForModal.shortName} Proposal
                </button>
                <button
                  onClick={() => setSelectedBrandForModal(null)}
                  className="py-3 px-6 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white font-syne font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
