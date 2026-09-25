import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    shippingFee,
    discount,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      showToast(res.message, 'success');
      setPromoInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf9f5] border-l border-stone-300 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-serif-luxury text-xl font-bold tracking-tight text-stone-900">
                Your Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-[#f2eee9] border-b border-stone-200 text-xs text-stone-700">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-emerald-800 font-medium">
                ✓ You have unlocked Complimentary Express Shipping!
              </p>
            ) : (
              <div>
                <p>
                  Add <strong className="tabular-nums">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for Complimentary Express Shipping
                </p>
                <div className="w-full bg-stone-300 h-1.5 mt-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#c5a880] h-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif-luxury text-xl text-stone-900 mb-2">
                  Your bag is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our luxury fragrance collections to discover your signature scent.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/shop');
                  }}
                  className="bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#252525] transition-colors"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-4 p-3 bg-white border border-stone-200/80 rounded shadow-xs"
                >
                  <img
                    src={item.product.images?.[0] || '/product-placeholder.svg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif-luxury text-sm font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        {item.product.brand} · {item.selectedSize}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-stone-900 tabular-nums">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. AURA10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-300 px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-black uppercase"
                />
                <button
                  type="submit"
                  className="bg-stone-900 text-white text-xs px-3 py-1.5 font-medium hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200">
                  <span>Applied: <strong>{appliedPromo}</strong></span>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
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
                  <span>Estimated Express Shipping</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/cart');
                  }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-semibold py-2.5 transition-colors cursor-pointer"
                >
                  View Full Bag
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>100% Secure Checkout · Authentic Luxury Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
