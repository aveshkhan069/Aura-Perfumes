import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.size || '100ml');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isFavorited = isInWishlist(product.id);

  const currentSizeObj = product.availableSizes.find(s => s.size === selectedSize);
  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const currentOrigPrice = currentSizeObj ? currentSizeObj.originalPrice : product.originalPrice;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    showToast(`Added ${quantity}x ${product.name} (${selectedSize}) to your bag`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white max-w-3xl w-full rounded-none overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-black bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square md:aspect-auto bg-[#f4f2ee] h-full flex items-center justify-center">
          <img
            src={product.images?.[0] || '/src/assets/images/hero_aura_perfume_1790347541852.jpg'}
            alt={product.name}
            className="w-full h-full object-cover max-h-[460px]"
          />
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-stone-500 mb-1">
              <span>{product.brand}</span>
              <span>{product.category} · {product.concentration}</span>
            </div>

            <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-[#c5a880]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-[#c5a880]' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-600 tabular-nums">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-2xl font-bold text-stone-950 tabular-nums">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentOrigPrice > currentPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ₹{currentOrigPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    {Math.round(((currentOrigPrice - currentPrice) / currentOrigPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-wider font-semibold text-stone-900 mb-2">
                Select Size
              </label>
              <div className="flex gap-2">
                {product.availableSizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-4 py-2 text-xs font-medium border transition-all cursor-pointer ${
                      selectedSize === s.size
                        ? 'border-black bg-stone-900 text-white'
                        : 'border-stone-300 text-stone-800 hover:border-black'
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleWishlist(product);
                  showToast(isFavorited ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className={`p-3 border transition-colors flex items-center justify-center ${
                  isFavorited
                    ? 'border-stone-900 bg-stone-900 text-[#c5a880]'
                    : 'border-stone-300 text-stone-700 hover:border-black'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-center block text-xs uppercase tracking-wider font-medium text-stone-700 hover:text-black hover:underline pt-1"
            >
              View Full Product Specifications & Fragrance Notes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
