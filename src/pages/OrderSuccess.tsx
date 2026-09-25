import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Order } from '../types';

export const OrderSuccess: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura_latest_order');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!order) {
    return (
      <div className="bg-[#faf9f5] min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 max-w-md w-full border border-stone-200 text-center">
          <CheckCircle2 className="w-12 h-12 text-[#c5a880] mx-auto mb-3" />
          <h2 className="font-serif-luxury text-2xl font-bold mb-2">Order Confirmed</h2>
          <p className="text-xs text-stone-500 mb-6">
            Your fragrance order has been received and is being prepared in our climate-controlled vault.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Card Header */}
        <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-sm text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#f4f2ee] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#c5a880]" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.25em] text-[#c5a880] font-bold">
            Order Confirmation
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 mt-1 mb-2">
            Thank You For Your Order
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            Your bespoke fragrance package is confirmed. We will notify you once your order is dispatched
            with private tracking.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-6 py-3 px-6 bg-[#faf9f5] border border-stone-200 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Order Number</span>
              <strong className="text-stone-900 font-mono text-sm">{order.orderNumber}</strong>
            </div>
            <div className="h-6 w-px bg-stone-300 hidden sm:block" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Order Date</span>
              <strong className="text-stone-900">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <div className="h-6 w-px bg-stone-300 hidden sm:block" />
            <div>
              <span className="text-stone-400 block text-[10px] uppercase">Estimated Delivery</span>
              <strong className="text-stone-900">3-5 Business Days</strong>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Purchased Items List */}
          <div className="md:col-span-7 bg-white p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-200 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#c5a880]" />
              Fragrance Items ({order.items.length})
            </h2>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || '/product-placeholder.svg'}
                      alt={item.productName}
                      className="w-16 h-16 object-cover bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-base font-semibold text-stone-900">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {item.brand} · {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-stone-900">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount</span>
                  <span className="tabular-nums">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Insured Shipping</span>
                <span className="tabular-nums text-stone-900">
                  {order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Total Paid</span>
                <span className="tabular-nums">
                  ₹{order.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-1.5 pb-2 border-b border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" /> Shipping Destination
              </h3>
              <div className="text-xs text-stone-600 leading-relaxed">
                <p className="font-semibold text-stone-900">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.apartment}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
                <p className="mt-1 text-stone-500">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="bg-white p-6 border border-stone-200 shadow-xs space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-1.5 pb-2 border-b border-stone-200">
                <CreditCard className="w-3.5 h-3.5 text-[#c5a880]" /> Payment Mode
              </h3>
              <div className="text-xs text-stone-600">
                <p className="font-semibold text-stone-900 uppercase">
                  {order.paymentMethod === 'card'
                    ? 'Credit / Debit Card'
                    : order.paymentMethod === 'upi'
                    ? 'UPI Instant'
                    : 'Cash on Delivery'}
                </p>
                <p className="text-stone-500 mt-0.5">Status: {order.paymentStatus}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/shop"
                className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/orders"
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-semibold py-3 flex items-center justify-center transition-colors"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
