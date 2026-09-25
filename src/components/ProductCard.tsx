import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  animationDelay?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  animationDelay = 0,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Keep product cards on the primary product image; alternate angles can look inconsistent on hover.
  const productImage = product.primaryImage || product.images?.[0] || '';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(isFavorited ? 'Removed from wishlist' : 'Added to your wishlist');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.size || '100ml', 1);
    showToast(`Added ${product.name} to your bag`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div
      style={{ transitionDelay: `${animationDelay}ms` }}
      className="group relative flex flex-col bg-white border border-stone-200/90 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-xl hover:-translate-y-1 select-none"
    >
      {/* Product Image */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-[#f4f2ee]"
      >
        <Link to={`/product/${product.id}`} className="block w-full h-full relative">
          {productImage ? (
            <>
              {/* Primary image */}
              <img
                src={productImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-[#f4f2ee] flex items-center justify-center">
              <span className="font-serif-luxury text-stone-400 text-base">{product.name}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
              <span className="font-serif-luxury text-stone-400 text-sm tracking-widest uppercase">
                {product.brand}
              </span>
            </div>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isFavorited
              ? 'bg-[#111111] text-[#c5a880] shadow-sm'
              : 'bg-white/90 text-stone-700 hover:text-black hover:bg-white backdrop-blur-xs shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={handleQuickView}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-2 shadow-lg backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-[#c5a880] flex items-center gap-1.5 cursor-pointer whitespace-nowrap translate-y-2 group-hover:translate-y-0 z-10"
          >
            <Eye className="w-3.5 h-3.5 text-[#c5a880]" /> Quick View
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Size */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-[0.2em] font-mono mb-1">
          <span>{product.brand}</span>
          <span>{product.size}</span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="group-hover:text-[#c5a880] transition-colors">
          <h3 className="font-serif-luxury text-lg font-semibold text-stone-900 leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px] text-stone-500 font-sans mt-0.5 mb-2 line-clamp-1">
          {product.category} {product.concentration}
        </p>

        {/* Price & Rating */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-950 tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-[#c5a880]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-[#c5a880]' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-stone-700 ml-0.5 tabular-nums">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Add to Cart CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3.5 w-full bg-[#111111] hover:bg-[#252525] text-white text-[11px] uppercase tracking-[0.2em] font-semibold py-2.5 transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center hover:shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
