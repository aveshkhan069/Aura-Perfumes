import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Award, Truck, ShieldCheck } from 'lucide-react';
import { productsData } from '../data/perfumes';
import { ProductCard } from '../components/ProductCard';
import { HeroSection } from '../components/HeroSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { Product } from '../types';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onQuickView }) => {
  const navigate = useNavigate();

  // Curated best seller perfumes:
  // AURA Noir, Velvet Rose, Citrus Dream, Ocean Breeze
  const bestSellers = productsData
    .filter((p) => ['aura-noir', 'velvet-rose', 'citrus-dream', 'ocean-breeze'].includes(p.id))
    .slice(0, 4);

  return (
    <div className="bg-[#faf9f5]">
      {/* 1. COMPLETE REDESIGNED AURA LUXURY HERO SECTION */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY — Scroll-Revealed with Staggered Entrance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-300/80 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-bold block mb-1">
                OLFACTORY DOMAINS
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-stone-900 tracking-tight">
                Shop by Category
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-md">
                Master fragrance compositions tailored for distinct presence and moods.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 hover:text-[#c5a880] flex items-center gap-1.5 transition-colors group"
            >
              <span>View All Fragrances</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 3 Category Cards with Staggered Delays & Image Masking */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Men Category Card */}
          <ScrollReveal direction="up" delay={100}>
            <div
              onClick={() => navigate('/shop/men')}
              className="group relative aspect-4/3 sm:aspect-3/4 md:aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer border border-stone-200/90 shadow-md"
            >
              <img
                src="/src/assets/images/category_men_perfume_1790347553937.jpg"
                alt="Men Fragrance Collection"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 opacity-80 group-hover:opacity-95"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono mb-1">
                  01 · NOBLE WOODS
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium tracking-wide">
                  Men
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300 mt-1.5 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300 font-semibold">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Women Category Card */}
          <ScrollReveal direction="up" delay={200}>
            <div
              onClick={() => navigate('/shop/women')}
              className="group relative aspect-4/3 sm:aspect-3/4 md:aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer border border-stone-200/90 shadow-md"
            >
              <img
                src="/src/assets/images/category_women_perfume_1790347565593.jpg"
                alt="Women Fragrance Collection"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 opacity-80 group-hover:opacity-95"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono mb-1">
                  02 · SENSUAL FLORALS
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium tracking-wide">
                  Women
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300 mt-1.5 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300 font-semibold">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Unisex Category Card */}
          <ScrollReveal direction="up" delay={300}>
            <div
              onClick={() => navigate('/shop/unisex')}
              className="group relative aspect-4/3 sm:aspect-3/4 md:aspect-4/3 overflow-hidden bg-stone-950 cursor-pointer border border-stone-200/90 shadow-md"
            >
              <img
                src="/src/assets/images/category_unisex_perfume_1790347576595.jpg"
                alt="Unisex Niche Perfume Collection"
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 opacity-80 group-hover:opacity-95"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-mono mb-1">
                  03 · PRIVATE BLENDS
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-medium tracking-wide">
                  Unisex
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-300 mt-1.5 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform duration-300 font-semibold">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5 text-[#c5a880]" />
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. BEST SELLERS — Staggered Product Cards Scroll Entrance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-300/80 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a880] font-bold block mb-1">
                CURATED SELECTION
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-medium text-stone-900 tracking-tight">
                Best Sellers
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-md">
                Our most celebrated and sought-after fragrance formulations worldwide.
              </p>
            </div>
            <Link
              to="/shop?filter=bestseller"
              className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900 hover:text-[#c5a880] flex items-center gap-1.5 transition-colors group"
            >
              <span>Explore All Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 4 Staggered Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bestSellers.map((product, idx) => (
            <ScrollReveal key={product.id} direction="up" delay={idx * 100}>
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                animationDelay={idx * 80}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 4. VALUE PILLARS & TRUST BAR */}
      <section className="bg-white border-y border-stone-200/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <ScrollReveal direction="up" delay={50} className="flex flex-col items-center p-3">
              <Clock className="w-6 h-6 text-[#c5a880] mb-2 stroke-[1.5]" />
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">
                Long Lasting
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">20%+ Eau de Parfum concentration</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={120} className="flex flex-col items-center p-3 pt-6 md:pt-3">
              <Award className="w-6 h-6 text-[#c5a880] mb-2 stroke-[1.5]" />
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">
                Master Formulation
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Grasse botanicals & raw woods</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={190} className="flex flex-col items-center p-3 pt-6 md:pt-3">
              <Truck className="w-6 h-6 text-[#c5a880] mb-2 stroke-[1.5]" />
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">
                Express Delivery
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Complimentary across India over ₹999</p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={260} className="flex flex-col items-center p-3 pt-6 md:pt-3">
              <ShieldCheck className="w-6 h-6 text-[#c5a880] mb-2 stroke-[1.5]" />
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-900">
                100% Authentic
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Direct from certified ateliér vaults</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL SPOTLIGHT BANNER — Side-based Scroll Entrance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="bg-[#0c0c0d] border border-stone-800 text-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl relative">
          {/* Subtle noise and light streak */}
          <div className="absolute inset-0 bg-grain pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Content Slides from LEFT */}
          <ScrollReveal
            direction="left"
            delay={100}
            className="lg:col-span-6 p-8 sm:p-14 lg:p-18 flex flex-col justify-center space-y-6 relative z-10"
          >
            <div className="flex flex-col">
              <span className="font-serif-luxury text-2xl tracking-[0.3em] text-[#c5a880] font-medium uppercase">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.4em] text-stone-400 uppercase font-mono">
                HAUTE PARFUMERIE
              </span>
            </div>

            <h3 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.15] text-[#f7f4ed]">
              Luxury fragrances crafted for the modern you.
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg">
              We reject transient synthetic top-notes in favor of rich, multi-layered harmonies that
              warm and develop with your body temperature. Experience effortless longevity that leaves
              a discreet yet magnetic memory wherever you arrive.
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-white hover:text-[#c5a880] transition-colors border-b border-white hover:border-[#c5a880] pb-1.5"
              >
                <span>Read Our Heritage</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Right Image Slides from RIGHT */}
          <ScrollReveal
            direction="right"
            delay={200}
            className="lg:col-span-6 aspect-4/3 lg:aspect-auto relative overflow-hidden"
          >
            <img
              src="/src/assets/images/editorial_aura_model_1790347587954.jpg"
              alt="AURA Luxury Campaign Editorial"
              className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-104"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
