import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    // Sequential entrance trigger
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 80);

    // Scroll listener for cinematic scroll response
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Subtle Mouse Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Scroll depth ratio (0 to 1 over first 600px of scroll)
  const scrollProgress = Math.min(1, Math.max(0, scrollY / 700));

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[1100px] bg-[#09090a] text-white overflow-hidden select-none"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. FULL-WIDTH CINEMATIC BACKGROUND ENVIRONMENT
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        style={{
          transform: reducedMotion
            ? 'none'
            : `scale(${1 + scrollProgress * 0.06}) translate3d(${mousePos.x * -18}px, ${mousePos.y * -14}px, 0)`,
          transition: 'transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1400 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src="/src/assets/images/cinematic_luxury_hero_bg_1790350924621.jpg"
          alt="AURA Luxury Campaign Environment"
          className="w-full h-full object-cover object-center"
          loading="eager"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. MULTI-LAYERED PHOTOGRAPHIC GRADIENT OVERLAYS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Layer A: Left-to-Right Atmospheric Shadow for Pristine Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090a]/95 via-[#09090a]/75 via-45% to-transparent pointer-events-none z-1" />

      {/* Layer B: Vertical Top & Bottom Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090a] via-transparent to-[#09090a]/40 pointer-events-none z-1" />

      {/* Layer C: Dedicated Radial Amber Glow Behind Perfume Bottle */}
      <div
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)`,
          transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-1/2 right-[12%] sm:right-[16%] lg:right-[20%] w-[380px] sm:w-[500px] lg:w-[650px] h-[380px] sm:h-[500px] lg:h-[650px] -translate-y-1/2 rounded-full bg-gradient-to-br from-[#c5a880]/22 via-[#99774a]/12 to-transparent blur-[110px] pointer-events-none z-1"
      />

      {/* Layer D: Subtle Film Grain Noise Texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-2" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. INTEGRATED 3D PERFUME PRODUCT (RIGHT SIDE)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 
        Positioned as part of the ONE visual composition.
        Desktop: occupies right 35-45%.
        Mobile: positioned toward right-center / lower-right, seamlessly blending into the dark scene.
      */}
      <div
        style={{
          transform: reducedMotion
            ? 'none'
            : `translate3d(${mousePos.x * 32}px, ${mousePos.y * 32 - scrollProgress * 50}px, 0) scale(${
                isLoaded ? 1 : 1.04
              })`,
          transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1200ms ease-out',
        }}
        className={`absolute right-[-8%] sm:right-[2%] md:right-[5%] lg:right-[8%] xl:right-[11%] top-[48%] sm:top-1/2 -translate-y-1/2 z-10 w-[290px] sm:w-[380px] md:w-[460px] lg:w-[520px] xl:w-[580px] pointer-events-none transition-all duration-1200 ${
          isLoaded ? 'opacity-100' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="relative w-full flex flex-col items-center">
          {/* Main Perfume Bottle Image (Pitch Black Background Blends Seamlessly) */}
          <div className="relative w-full aspect-3/4 flex items-center justify-center">
            <img
              src="/src/assets/images/aura_flacon_isolated_1790350939418.jpg"
              alt="AURA Noir Extrait de Parfum"
              className="w-full h-full object-contain object-center mix-blend-screen drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] filter contrast-[1.08] brightness-[1.02]"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Realistic Floor Contact Shadow on Dark Marble Surface */}
          <div className="w-[65%] h-6 sm:h-8 bg-black/85 blur-lg rounded-full -mt-6 sm:-mt-8" />
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. REFINED EDITORIAL TYPOGRAPHY & CTAs (LEFT SIDE)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-20 h-full w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-center">
        <div
          style={{
            transform: reducedMotion ? 'none' : `translate3d(0, ${scrollProgress * -30}px, 0)`,
            opacity: 1 - scrollProgress * 1.2,
          }}
          className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8 transition-transform duration-300"
        >
          {/* Eyebrow with Editorial Marker */}
          <div
            className={`flex items-center gap-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <span className="w-8 h-px bg-[#c5a880]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#c5a880] font-semibold">
              THE ART OF FRAGRANCE
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">
              · HAUTE PARFUMERIE
            </span>
          </div>

          {/* Main Headline: "DEFINE YOUR SIGNATURE." Revealed Line-by-Line */}
          <div className="space-y-1 sm:space-y-2">
            {/* Line 1: DEFINE */}
            <div className="overflow-hidden">
              <h1
                className={`font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-light tracking-[-0.03em] leading-[0.98] text-[#f7f4ed] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[115%] opacity-0'
                }`}
                style={{ transitionDelay: '350ms' }}
              >
                DEFINE
              </h1>
            </div>

            {/* Line 2: YOUR */}
            <div className="overflow-hidden">
              <span
                className={`block font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-light tracking-[-0.03em] leading-[0.98] text-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[115%] opacity-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                YOUR
              </span>
            </div>

            {/* Line 3: SIGNATURE. (with luxury italic flair) */}
            <div className="overflow-hidden">
              <span
                className={`block font-serif-luxury italic text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-light tracking-[-0.02em] leading-[0.98] text-[#c5a880] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[115%] opacity-0'
                }`}
                style={{ transitionDelay: '650ms' }}
              >
                SIGNATURE.
              </span>
            </div>
          </div>

          {/* Short Refined Description */}
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            <p className="text-stone-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-md sm:max-w-lg">
              Discover fragrances crafted to leave an unforgettable impression. Sourced from Grasse,
              matured with rare botanicals, and formulated for intimate, enduring skin projection.
            </p>
          </div>

          {/* Two Refined Buttons */}
          <div
            className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '950ms' }}
          >
            {/* Primary CTA */}
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 bg-[#c5a880] text-[#09090a] hover:bg-[#e8d7c2] px-7 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 text-xs uppercase tracking-[0.22em] font-medium text-stone-300 hover:text-white border border-stone-800 hover:border-stone-600 transition-all duration-300 bg-black/40 backdrop-blur-xs cursor-pointer"
            >
              <span>DISCOVER AURA</span>
              <span className="w-0 group-hover:w-3 h-px bg-white transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. SUBTLE EDITORIAL DETAILS & SCROLL INDICATOR
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Top-Right Editorial Marker */}
      <div
        className={`absolute top-8 right-8 lg:right-14 z-20 hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] font-mono text-stone-400 transition-all duration-1200 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1100ms' }}
      >
        <span className="text-stone-300">AURA / 01</span>
        <span className="w-4 h-px bg-stone-700" />
        <span>EAU DE PARFUM</span>
        <span className="w-4 h-px bg-stone-700" />
        <span className="text-[#c5a880]">THE SIGNATURE COLLECTION</span>
      </div>

      {/* Bottom Editorial Bar with Scroll Indicator and Page Number */}
      <div className="absolute bottom-5 left-0 right-0 z-20 px-6 sm:px-10 lg:px-14 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-mono text-stone-400 pointer-events-none">
        {/* Left: Chapter / Edition */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
          <span>EDITION 2026</span>
        </div>

        {/* Center: Scroll Indicator */}
        <div className="flex items-center gap-1.5 animate-pulse">
          <span className="hidden sm:inline">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#c5a880]" />
        </div>

        {/* Right: Page Counter */}
        <div>
          <span>01 / 04</span>
        </div>
      </div>
    </section>
  );
};
