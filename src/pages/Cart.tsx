import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    discount,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyPromoCode(promoCodeInput);
    if (res.success) {
      showToast(res.message, 'success');
      setPromoCodeInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleMoveToWishlist = (item: any) => {
    if (!isInWishlist(item.product.id)) {
      toggleWishlist(item.product);
    }
    removeFromCart(item.product.id, item.selectedSize);
    showToast(`Moved ${item.product.name} to your wishlist`);
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#faf9f5] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white p-10 border border-stone-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center text-stone-400 mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif-luxury text-3xl font-bold text-stone-900 mb-2">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed mb-6">
            You haven't selected any fragrances yet. Explore our curated collections to find your
            signature scent.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition-colors"
          >
            Discover Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 pb-4 border-b border-stone-300">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
            Shopping Bag ({items.length} items)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your chosen fragrances before proceeding to private checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-stone-200 shadow-xs divide-y divide-stone-200">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Product Details */}
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product.primaryImage || item.product.images?.[0] || ''}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />

                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
                        {item.product.brand} · {item.selectedSize}
                      </span>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="block font-serif-luxury text-lg font-semibold text-stone-900 hover:text-[#c5a880] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {item.product.category} {item.product.concentration}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="text-stone-500 hover:text-black text-xs inline-flex items-center gap-1 font-medium transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                    <span className="text-base font-bold text-stone-900 tabular-nums">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-400 tabular-nums hidden sm:block">
                      ₹{item.unitPrice.toLocaleString('en-IN')} each
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-stone-300 bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="p-1.5 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to="/shop"
                className="text-xs uppercase tracking-widest font-semibold text-stone-700 hover:text-black flex items-center gap-1.5"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 border border-stone-200 shadow-xs space-y-6 sticky top-24">
              <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700">
                  Promotional Voucher
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try 'AURA10' or 'LUXURY20'"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-300 px-3 py-2 text-xs uppercase text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-black text-white text-xs px-4 py-2 font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 border border-emerald-200 mt-2">
                    <span>Code: <strong>{appliedPromo}</strong></span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-rose-600 text-[11px] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Totals Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Privilege Discount</span>
                    <span className="tabular-nums">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Insured Shipping</span>
                  <span className="tabular-nums text-stone-900">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Taxes (GST 18%)</span>
                  <span className="tabular-nums text-stone-500">Included in Price</span>
                </div>

                <div className="flex justify-between text-base font-bold text-stone-950 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-4 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2 text-center">
                <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                <span>256-bit SSL Encrypted · Tamper-proof packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
