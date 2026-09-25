import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    // Trigger progressive luxury entrance sequence
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);

    // Scroll listener for fluid scroll-driven parallax and depth transition
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(loadTimer);
      mediaQuery.removeEventListener('change', motionListener);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Subtle Mouse Parallax Handler (Desktop only)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion || window.innerWidth < 1024) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  // Scroll depth calculations (0 to 1 over first 700px of scrolling)
  const scrollProgress = Math.min(1, Math.max(0, scrollY / 700));

  return (
    <section
      id="hero-campaign"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[100svh] min-h-[640px] max-h-[1150px] bg-[#080809] text-white overflow-hidden select-none"
      aria-label="AURA Haute Parfumerie Campaign"
    >
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. IMMERSIVE FULL-WIDTH CINEMATIC CAMPAIGN PHOTOGRAPHY
          Single seamless composition from LEFT EDGE to RIGHT EDGE.
          No vertical panels, no split cuts, no disjointed boxes.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1400 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `scale(${1 + scrollProgress * 0.07}) translate3d(${mousePos.x * -14}px, ${
                mousePos.y * -10 - scrollProgress * 30
              }px, 0)`,
          transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 1400ms ease-out',
        }}
      >
        <picture className="w-full h-full block">
          <img
            src="/src/assets/images/aura_campaign_hero_master.jpg"
            alt="AURA Haute Parfumerie Master Campaign"
            className="w-full h-full object-cover object-[76%_center] sm:object-[72%_center] md:object-[68%_center] lg:object-center xl:object-[58%_center] filter brightness-[0.98] contrast-[1.04]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </picture>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. ART-DIRECTED SUBTLE GRADIENT & LIGHTING LAYERS
          Blended organically into the photo to preserve realism
          while guaranteeing flawless typographic readability.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Layer A: Left Editorial Shadow (Dark-to-transparent) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#080809]/95 via-[#080809]/80 via-35% md:via-42% to-transparent pointer-events-none z-[2]"
        aria-hidden="true"
      />

      {/* Layer B: Mobile/Tablet Top & Bottom Softening Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#080809] via-transparent via-30% to-[#080809]/45 pointer-events-none z-[2]"
        aria-hidden="true"
      />

      {/* Layer C: Interactive Volumetric Amber Aura Behind Bottle */}
      <div
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${mousePos.x * 28}px, ${mousePos.y * 22}px, 0)`,
          transition: 'transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute top-[48%] right-[10%] sm:right-[15%] lg:right-[18%] -translate-y-1/2 w-[320px] sm:w-[480px] lg:w-[620px] h-[320px] sm:h-[480px] lg:h-[620px] rounded-full bg-gradient-to-br from-[#c5a880]/18 via-[#99774a]/8 to-transparent blur-[120px] pointer-events-none z-[3]"
        aria-hidden="true"
      />

      {/* Layer D: Cinematic 35mm Film Grain Texture */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-[3]" aria-hidden="true" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. REFINED EDITORIAL TYPOGRAPHY & CTAs (LEFT SIDE)
          Positioned naturally at left: 8–12% within the unified scene.
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative z-10 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 flex flex-col justify-center">
        <div
          style={{
            transform: prefersReducedMotion ? 'none' : `translate3d(0, ${scrollProgress * -35}px, 0)`,
            opacity: Math.max(0, 1 - scrollProgress * 1.35),
          }}
          className="max-w-md sm:max-w-xl lg:max-w-2xl space-y-6 sm:space-y-8 transition-opacity duration-300"
        >
          {/* Eyebrow: "THE ART OF FRAGRANCE" */}
          <div
            className={`flex items-center gap-3 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <span className="w-6 sm:w-10 h-px bg-[#c5a880]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#c5a880] font-semibold">
              THE ART OF FRAGRANCE
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">
              · HAUTE PARFUMERIE
            </span>
          </div>

          {/* Main Headline: "DEFINE YOUR SIGNATURE." Revealed Line-by-Line */}
          <div className="space-y-0.5 sm:space-y-1.5 md:space-y-2">
            {/* Line 1: DEFINE */}
            <div className="overflow-hidden">
              <h1
                className={`font-serif-luxury text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-light tracking-[-0.03em] leading-[0.94] text-[#f7f4ed] transition-all duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                }`}
                style={{ transitionDelay: '450ms' }}
              >
                DEFINE
              </h1>
            </div>

            {/* Line 2: YOUR */}
            <div className="overflow-hidden">
              <span
                className={`block font-serif-luxury text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-light tracking-[-0.03em] leading-[0.94] text-[#ede8df] transition-all duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                YOUR
              </span>
            </div>

            {/* Line 3: SIGNATURE. */}
            <div className="overflow-hidden">
              <span
                className={`block font-serif-luxury italic text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-light tracking-[-0.02em] leading-[0.94] text-[#c5a880] transition-all duration-1100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                }`}
                style={{ transitionDelay: '750ms' }}
              >
                SIGNATURE.
              </span>
            </div>
          </div>

          {/* Supporting Text */}
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            <p className="text-stone-300 text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-sm sm:max-w-md lg:max-w-lg">
              Discover fragrances crafted to leave an unforgettable impression. Formulated with rare
              botanicals, pure Grasse essences, and engineered for intimate, enduring presence.
            </p>
          </div>

          {/* CTA Buttons: Primary & Secondary */}
          <div
            className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: '1050ms' }}
          >
            {/* Primary CTA */}
            <Link
              to="/shop"
              className="group relative inline-flex items-center justify-center gap-3 bg-[#c5a880] text-[#09090a] hover:bg-[#dfcaa8] px-7 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA */}
            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 text-xs uppercase tracking-[0.22em] font-medium text-stone-300 hover:text-white border border-stone-700/80 hover:border-stone-400 transition-all duration-300 bg-black/40 backdrop-blur-xs cursor-pointer"
            >
              <span>DISCOVER AURA</span>
              <span className="w-0 group-hover:w-3 h-px bg-white transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. SUBTLE EDITORIAL DETAILS & SCROLL INDICATOR
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Top-Right Editorial Marker */}
      <aside
        className={`absolute top-8 right-6 sm:right-10 lg:right-16 z-20 hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] font-mono text-stone-400 transition-all duration-1200 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1200ms' }}
        aria-label="Collection metadata"
      >
        <span className="text-stone-300">AURA / 01</span>
        <span className="w-4 h-px bg-stone-700" />
        <span>EAU DE PARFUM</span>
        <span className="w-4 h-px bg-stone-700" />
        <span className="text-[#c5a880]">THE SIGNATURE COLLECTION</span>
      </aside>

      {/* Bottom Editorial Bar with Scroll Indicator and Page Number */}
      <div className="absolute bottom-6 left-0 right-0 z-20 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] font-mono text-stone-400 pointer-events-none">
        {/* Left: Edition */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. SEAMLESS TRANSITION TO NEXT SECTION
          Ultra-soft bottom atmospheric falloff into page background
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-transparent to-[#faf9f5]/15 pointer-events-none z-[4]"
        aria-hidden="true"
      />
    </section>
  );
};
