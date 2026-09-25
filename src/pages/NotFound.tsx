import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-[#faf9f5] min-h-[75vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-lg w-full bg-white p-10 sm:p-14 border border-stone-200 shadow-sm text-center">
        <span className="font-serif-luxury text-7xl sm:text-8xl font-bold text-stone-900 tracking-tight block">
          404
        </span>
        <div className="w-12 h-0.5 bg-[#c5a880] mx-auto my-4" />
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          The Fragrance Has Dissipated
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed mb-8 max-w-sm mx-auto">
          The page or private reserve fragrance collection you requested is unavailable or has been
          archived.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3.5 transition-colors"
          >
            <span>Explore Fragrances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-semibold px-6 py-3.5 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
