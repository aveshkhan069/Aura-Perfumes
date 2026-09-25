import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ShieldAlert } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { itemCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/shop?category=All' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#111111] text-[#e8dfd3] py-2 px-4 text-center text-[11px] uppercase tracking-[0.2em] font-medium border-b border-[#252525]">
        Complimentary luxury samples with all orders · Free shipping across India over ₹999
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#111111]/95 text-white backdrop-blur-md border-b border-stone-800 shadow-md py-3.5'
            : 'bg-[#111111] text-white border-b border-[#222222] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-stone-300 hover:text-white transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Brand Logo — Inline SVG mark + wordmark */}
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="AURA Perfumes – Home">
              {/* Flame icon mark */}
              <svg
                width="28"
                height="36"
                viewBox="0 0 28 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="hFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#f0e0c0"/>
                    <stop offset="55%"  stopColor="#c5a880"/>
                    <stop offset="100%" stopColor="#8a6d42"/>
                  </linearGradient>
                </defs>
                {/* Outer flame */}
                <path
                  d="M14 1 C14 1 3 13 3 21 C3 28.2 7.9 33.5 14 35 C20.1 33.5 25 28.2 25 21 C25 13 14 1 14 1Z"
                  fill="url(#hFlame)"
                />
                {/* Inner cutout for depth/glow */}
                <path
                  d="M14 9 C14 9 9.5 17 9.5 21.5 C9.5 24.5 11.4 26.5 14 27.5 C16.6 26.5 18.5 24.5 18.5 21.5 C18.5 17 14 9 14 9Z"
                  fill="#111111"
                  opacity="0.45"
                />
              </svg>

              {/* Text portion */}
              <div className="flex flex-col leading-none">
                <span className="font-serif-luxury text-[1.6rem] tracking-[0.22em] font-semibold text-white group-hover:text-[#c5a880] transition-colors duration-300 uppercase">
                  AURA
                </span>
                <span className="text-[8px] tracking-[0.4em] text-[#c5a880] uppercase font-sans mt-0.5 opacity-80">
                  PARFUMS DE LUXE
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-medium text-stone-300">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-1 hover:text-white transition-colors ${
                      isActive ? 'text-[#c5a880] font-semibold' : ''
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#c5a880]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5 text-stone-200">
              {/* Search Icon */}
              <button
                type="button"
                onClick={onOpenSearch || (() => navigate('/shop'))}
                className="p-1 hover:text-[#c5a880] transition-colors"
                title="Search perfumes"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-1 hover:text-[#c5a880] transition-colors flex items-center gap-1"
                  title="Account"
                  aria-label="Account"
                >
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#181818] border border-stone-800 rounded shadow-2xl py-2 text-xs text-stone-200 z-50 animate-in fade-in slide-in-from-top-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-stone-800 text-stone-400">
                          <p className="font-semibold text-white truncate">{user?.name}</p>
                          <p className="text-[11px] truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="block px-4 py-2.5 hover:bg-[#252525] hover:text-[#c5a880] transition-colors"
                        >
                          Account Dashboard
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 hover:bg-[#252525] hover:text-[#c5a880] transition-colors"
                        >
                          Order History
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2.5 hover:bg-[#252525] hover:text-[#c5a880] transition-colors"
                        >
                          My Wishlist ({wishlistCount})
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2.5 text-[#c5a880] hover:bg-[#252525] transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> Admin Concierge
                          </Link>
                        )}
                        <div className="border-t border-stone-800 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#252525] transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2.5 hover:bg-[#252525] hover:text-[#c5a880] transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2.5 hover:bg-[#252525] hover:text-[#c5a880] transition-colors"
                        >
                          Create Account
                        </Link>
                        <div className="border-t border-stone-800 my-1" />
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-stone-400 hover:text-stone-200 hover:bg-[#252525] transition-colors text-[11px]"
                        >
                          Demo Admin Dashboard
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="p-1 hover:text-[#c5a880] transition-colors relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c5a880] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCartDrawer}
                className="p-1 hover:text-[#c5a880] transition-colors relative"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c5a880] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-800 bg-[#141414] px-4 pt-4 pb-6 space-y-3 animate-in fade-in duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-sm uppercase tracking-[0.18em] font-medium text-stone-200 hover:text-[#c5a880] py-2 border-b border-stone-800/60"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2 text-xs">
              <Link
                to="/wishlist"
                className="flex items-center justify-between text-stone-300 py-1.5 hover:text-white"
              >
                <span>Wishlist</span>
                <span className="bg-[#242424] text-[#c5a880] px-2 py-0.5 rounded text-[11px]">
                  {wishlistCount} items
                </span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-between text-stone-300 py-1.5 hover:text-white"
              >
                <span>Shopping Bag</span>
                <span className="bg-[#242424] text-[#c5a880] px-2 py-0.5 rounded text-[11px]">
                  {itemCount} items
                </span>
              </Link>
              <Link
                to="/admin"
                className="text-[#c5a880] py-1.5 hover:underline"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
