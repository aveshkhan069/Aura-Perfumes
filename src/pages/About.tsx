import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Sparkles, HeartHandshake, Compass, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#faf9f5] min-h-screen">
      {/* 1. Header Banner - Exact Match to Wireframe Panel 07 */}
      <div className="bg-[#111111] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-stone-800">
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
          About Us
        </h1>
        <div className="flex items-center justify-center text-xs text-stone-400 mt-2 space-x-2 font-medium">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#c5a880]">About Us</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* 2. Our Story Section - Wireframe Panel 07 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#c5a880] font-bold block">
              The Genesis of Aura
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-stone-900 leading-tight">
              Our Story
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              AURA Perfumes was born from a simple belief — that fragrance is more than just a scent,
              it’s an emotion. We create luxury perfumes that tell your story, celebrate your individuality,
              and leave a lasting impression.
            </p>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Founded by master olfactory curators, AURA unites centuries-old Grasse extraction
              techniques with modern architectural bottle craft. Each formulation undergoes months of
              maturation to ensure seamless sillage, complex pyramid transitions, and exceptional skin longevity.
            </p>

            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 transition-colors cursor-pointer"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image from Wireframe */}
          <div className="lg:col-span-6">
            <div className="aspect-4/3 overflow-hidden rounded-xs border border-stone-300 shadow-xl bg-stone-900">
              <img
                src="/src/assets/images/hero_aura_perfume_1790347541852.jpg"
                alt="AURA Luxury Flacon Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3. Three Value Pillars - Wireframe Panel 07 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-stone-300">
          {/* Card 1 */}
          <div className="bg-white p-8 border border-stone-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] mb-4">
              <Award className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">
              Premium Quality
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Only the finest ingredients sourced directly from certified organic fields in France,
              Italy, and India.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 border border-stone-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] mb-4">
              <Sparkles className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">
              Elegant Packaging
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Luxury in every detail. Heavy crystal flacons, precision atomizers, and weighted
              magnetic closures.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 border border-stone-200 shadow-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#f4f2ee] flex items-center justify-center text-[#c5a880] mb-4">
              <HeartHandshake className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">
              Customer Focus
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your olfactory satisfaction matters. Complimentary sample vials and hassle-free returns
              on all private orders.
            </p>
          </div>
        </div>

        {/* 4. Craftsmanship & Natural Ethics */}
        <div className="bg-[#111111] text-white p-8 sm:p-14 border border-stone-800 shadow-lg grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#c5a880] font-bold">
              The Artisan Standard
            </span>
            <h3 className="font-serif-luxury text-3xl font-medium">
              Pure Concentrates · Zero Shortcuts
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Every AURA perfume features an Eau de Parfum or Extrait oil concentration between 20%
              and 28%. We avoid artificial fixatives that cause sensory fatigue, designing our scents
              to stay vibrant, skin-intimate, and harmonious throughout the day.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" /> Cruelty Free
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c5a880]" /> IFRA Certified
              </span>
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#c5a880]" /> Sustainably Harvested
              </span>
            </div>
          </div>

          <div className="aspect-4/3 overflow-hidden border border-stone-800">
            <img
              src="/src/assets/images/editorial_aura_model_1790347587954.jpg"
              alt="AURA Campaign Model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
