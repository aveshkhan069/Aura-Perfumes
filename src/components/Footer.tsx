import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Welcome to the AURA Inner Circle');
  };

  return (
    <footer className="bg-[#111111] text-stone-300 border-t border-stone-800">
      {/* Newsletter Section as shown in Wireframe */}
      <div className="border-b border-stone-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="font-serif-luxury text-2xl text-white tracking-wide">
              Join Our Newsletter
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-sans">
              Get exclusive offers, private reserve launches, and updates on new fragrances.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md w-full gap-2">
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#c5a880] py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are subscribed to the AURA Fragrance Journal.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-[#1c1c1c] border border-stone-700 focus:border-[#c5a880] px-4 py-2.5 text-xs text-white placeholder-stone-500 rounded-none w-full focus:outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-[#c5a880] hover:text-white px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-luxury text-3xl tracking-[0.25em] text-white font-medium uppercase">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#c5a880] uppercase font-sans">
                PERFUMES
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Luxury fragrance house offering sophisticated perfumes crafted with noble naturals,
              timeless French craftsmanship, and magnetic modern elegance.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-stone-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c5a880] transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c5a880] transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c5a880] transition-colors p-1"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#c5a880] transition-colors p-1"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/shop/men" className="hover:text-white transition-colors">
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop/women" className="hover:text-white transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/shop/unisex" className="hover:text-white transition-colors">
                  Unisex Niche
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=new" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?filter=bestseller" className="hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER CARE */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/about#shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/about#returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact#faq" className="hover:text-white transition-colors">
                  Fragrance FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: LEGAL */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white mb-4">
              LEGAL & PRIVACY
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About AURA
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Terms & Conditions
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </span>
              </li>
              <li>
                <Link to="/admin" className="text-[#c5a880] hover:underline transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-stone-500 text-xs gap-4">
          <p>© 2026 AURA Perfumes. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>Mumbai · Grasse · Dubai · London</span>
            <span className="text-[#c5a880]">100% Authentic Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
