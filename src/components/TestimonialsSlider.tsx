import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = testimonials[currentIndex] || testimonials[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#0b0b0b] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Yellow Card Container matching Hello Agency's Section 8 */}
        <div className="relative rounded-3xl bg-[#F9CE00] text-black overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10">
              <div>
                {/* Header Lockup */}
                <div className="mb-8">
                  <h4 className="text-sm sm:text-base font-syne font-bold uppercase tracking-[0.2em] text-black/70">
                    CMOs give
                  </h4>
                  <h2 className="text-5xl sm:text-7xl font-syne font-black uppercase text-black tracking-tight leading-none">
                    Akaar
                  </h2>
                </div>

                {/* Animated Testimonial Quote */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.35 }}
                    className="relative"
                  >
                    <Quote className="w-10 h-10 sm:w-14 sm:h-14 text-black/15 absolute -top-6 -left-4 -z-10" />
                    <p className="text-xl sm:text-2xl md:text-3xl font-syne font-extrabold text-black leading-snug sm:leading-tight mb-8">
                      “{current.quote}”
                    </p>
                    <div className="border-t-2 border-black/15 pt-4">
                      <div className="text-base sm:text-lg font-syne font-black uppercase tracking-wide text-black">
                        {current.author}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-black/75">
                        {current.role} — <span className="font-bold">{current.company}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Navigation Controls */}
              <div className="flex items-center gap-4 mt-8 pt-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    id="testimonial-prev-btn"
                    className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F9CE00] transition-colors"
                    aria-label="Previous Testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    id="testimonial-next-btn"
                    className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-[#F9CE00] transition-colors"
                    aria-label="Next Testimonial"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="text-xs font-mono font-bold tracking-widest text-black/70">
                  0{currentIndex + 1} / 0{testimonials.length}
                </div>
              </div>
            </div>

            {/* Right Image Column */}
            <div className="lg:col-span-5 relative bg-neutral-900 overflow-hidden min-h-[320px] lg:min-h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={current.avatarUrl}
                  alt={current.author}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover object-center filter contrast-110"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white font-syne font-bold text-xs">
                {current.author} // {current.company}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
