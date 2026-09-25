import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Order } from '../types';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch {
        // Fallback default
        const local = localStorage.getItem('aura_latest_order');
        if (local) {
          setOrders([JSON.parse(local)]);
        }
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 pb-4 border-b border-stone-300 flex items-center justify-between">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
              Order History
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Track past and current bespoke perfume shipments
            </p>
          </div>
          <Link
            to="/account"
            className="text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center border border-stone-200 shadow-xs max-w-md mx-auto">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h2 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2">
              No orders found
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              You have not placed any fragrance orders yet.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 hover:bg-[#252525]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-stone-200 shadow-xs overflow-hidden"
              >
                {/* Header bar of order card */}
                <div className="p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Order Number</span>
                      <strong className="text-stone-900 font-mono">{ord.orderNumber}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Placed On</span>
                      <strong className="text-stone-900">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">Total</span>
                      <strong className="text-stone-900 tabular-nums">
                        ₹{ord.grandTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-none ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="p-5 divide-y divide-stone-100">
                  {ord.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || '/src/assets/images/hero_aura_perfume_1790347541852.jpg'}
                          alt={item.productName}
                          className="w-14 h-14 object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-serif-luxury text-base font-semibold text-stone-900">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-stone-500">
                            {item.brand} · {item.size} · Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-xs font-semibold text-[#c5a880] hover:underline"
                        >
                          Buy Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer notes */}
                <div className="px-5 py-3 bg-stone-50/40 border-t border-stone-200 text-xs text-stone-500 flex justify-between items-center">
                  <span>Ship to: {ord.shippingAddress.fullName}, {ord.shippingAddress.city}</span>
                  <span className="text-stone-400">{ord.paymentMethod.toUpperCase()} · {ord.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
