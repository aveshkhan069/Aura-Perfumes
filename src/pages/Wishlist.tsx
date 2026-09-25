import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addToCart(product, product.size || '100ml', 1);
    removeFromWishlist(product.id);
    showToast(`Added ${product.name} to your bag`);
  };

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((p) => {
      addToCart(p, p.size || '100ml', 1);
    });
    clearWishlist();
    showToast('All wishlist items moved to your bag');
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header - Wireframe Panel 09 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-300 gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
              My Wishlist
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {wishlist.length} saved fragrance {wishlist.length === 1 ? 'creation' : 'creations'}
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-4 py-2.5 transition-colors cursor-pointer"
              >
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white p-12 text-center border border-stone-200 shadow-xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center text-stone-400 mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              Explore our luxury fragrance catalog and tap the heart icon on any scent to save it
              to your personal wishlist.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#252525] transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          /* Wishlist Items List - Exact Match to Wireframe Panel 09 */
          <div className="bg-white border border-stone-200 shadow-xs divide-y divide-stone-200">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 text-[11px] uppercase tracking-widest font-semibold text-stone-400 border-b border-stone-200 bg-stone-50/50">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Price</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {/* Rows */}
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
              >
                {/* Product Col */}
                <div className="sm:col-span-6 flex items-center gap-4">
                  <button
                    onClick={() => {
                      removeFromWishlist(product.id);
                      showToast('Removed from wishlist');
                    }}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <img
                    src={product.images?.[0] || '/src/assets/images/hero_aura_perfume_1790347541852.jpg'}
                    alt={product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-stone-100 shrink-0 border border-stone-200"
                  />

                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold block">
                      {product.brand}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="font-serif-luxury text-base font-semibold text-stone-900 hover:text-[#c5a880] transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {product.category} {product.concentration} · {product.size}
                    </p>
                  </div>
                </div>

                {/* Price Col */}
                <div className="sm:col-span-3 sm:text-center flex sm:justify-center items-baseline gap-2">
                  <span className="text-base font-bold text-stone-950 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-stone-400 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Actions Col */}
                <div className="sm:col-span-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="w-full sm:w-auto bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-5 py-2.5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
