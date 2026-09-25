import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ShieldCheck, CreditCard, Smartphone, Banknote, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShippingAddress, OrderItem } from '../types';

export const Checkout: React.FC = () => {
  const { items, subtotal, shippingFee, discount, grandTotal, clearCart } = useCart();
  const { user, updateUserAddresses } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Multi-step Checkout State: 1 = Shipping, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Shipping Form State
  const defaultAddress = user?.savedAddresses?.[0];
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    fullName: defaultAddress?.fullName || user?.name || '',
    phone: defaultAddress?.phone || user?.phone || '',
    email: defaultAddress?.email || user?.email || '',
    address: defaultAddress?.address || '',
    apartment: defaultAddress?.apartment || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    pinCode: defaultAddress?.pinCode || '',
    country: 'India',
  });
  const [saveAddress, setSaveAddress] = useState(true);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 ···· ···· 8921',
    cardHolder: 'Avesh Khan',
    expiry: '10/28',
    cvv: '891',
  });
  const [upiId, setUpiId] = useState('avesh@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="bg-[#faf9f5] min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white p-10 border border-stone-200 text-center">
          <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-2">
            No items to checkout
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Please add fragrances to your shopping bag before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.pinCode) {
      showToast('Please fill out all mandatory shipping fields', 'error');
      return;
    }
    if (saveAddress) {
      const result = await updateUserAddresses(shippingData);
      if (!result.success) showToast(result.message, 'error');
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      size: item.selectedSize,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.product.images?.[0] || '/product-placeholder.svg',
    }));

    const orderPayload = {
      items: orderItems,
      shippingAddress: shippingData,
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      tax: 0,
      grandTotal,
      userId: user?.id || 'guest',
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      setIsProcessing(false);

      if (data.success && data.order) {
        clearCart();
        // Save latest order in localStorage for confirmation page
        localStorage.setItem('aura_latest_order', JSON.stringify(data.order));
        showToast('Order confirmed! Generating your luxury dispatch slip...');
        navigate('/order-success');
      } else {
        showToast(data.message || 'Error processing order', 'error');
      }
    } catch {
      // Fallback
      setIsProcessing(false);
      const fallbackOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `AURA-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: new Date().toISOString(),
        items: orderItems,
        shippingAddress: shippingData,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid',
        orderStatus: 'Confirmed',
        subtotal,
        discount,
        shippingFee,
        tax: 0,
        grandTotal,
        estimatedDelivery: '3-5 business days',
      };
      localStorage.setItem('aura_latest_order', JSON.stringify(fallbackOrder));
      clearCart();
      navigate('/order-success');
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title & Step Header - Wireframe Panel 06 */}
        <div className="mb-8">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
            Checkout
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} items in your luxury order
          </p>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-4 mt-6 max-w-lg">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep > step.num
                        ? 'bg-black text-white'
                        : currentStep === step.num
                        ? 'bg-[#c5a880] text-black ring-4 ring-[#c5a880]/20'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {currentStep > step.num ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </div>
                  <span
                    className={`text-xs uppercase tracking-wider font-semibold ${
                      currentStep === step.num ? 'text-black' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 2 && <div className="flex-1 h-px bg-stone-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Multi-Step Forms - Wireframe Panel 06 */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Shipping Information */}
            {currentStep === 1 && (
              <form
                onSubmit={handleShippingSubmit}
                className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5 animate-in fade-in"
              >
                <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                      placeholder="Enter phone number"
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={shippingData.email}
                    onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                    placeholder="For order dispatch tracking"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                    House / Flat / Building Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingData.address}
                    onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                    placeholder="Street address, building name"
                    className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.city}
                      onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      State *
                    </label>
                    <select
                      value={shippingData.state}
                      onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Punjab">Punjab</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingData.pinCode}
                      onChange={(e) => setShippingData({ ...shippingData, pinCode: e.target.value })}
                      placeholder="e.g. 400050"
                      className="w-full bg-[#faf9f5] border border-stone-300 p-2.5 text-xs text-stone-900 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="accent-black"
                  />
                  <span>Save this address for next time</span>
                </label>

                <div className="pt-4 border-t border-stone-200">
                  <button
                    type="submit"
                    className="w-full bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <form
                onSubmit={handlePaymentSubmit}
                className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h2 className="font-serif-luxury text-xl font-bold text-stone-900">
                    Payment Method
                  </h2>
                  <span className="text-[11px] text-stone-400 font-medium">
                    Simulated Sandbox Mode
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Card Option */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-black bg-stone-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#c5a880]" />
                          Credit / Debit Card
                        </span>
                        <span className="text-[10px] text-stone-500">Visa, Mastercard, Amex</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Encrypted and authenticated transactions.
                      </p>

                      {paymentMethod === 'card' && (
                        <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-3 text-xs">
                          <div className="col-span-2">
                            <label className="block text-[11px] text-stone-600 mb-1">
                              Card Number (Demo)
                            </label>
                            <input
                              type="text"
                              value={cardDetails.cardNumber}
                              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                              className="w-full bg-white border border-stone-300 p-2 text-xs text-stone-900 focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">Expiry</label>
                            <input
                              type="text"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              className="w-full bg-white border border-stone-300 p-2 text-xs text-stone-900 focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">CVV</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              className="w-full bg-white border border-stone-300 p-2 text-xs text-stone-900 focus:outline-none focus:border-black font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* UPI Option */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-black bg-stone-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 accent-black"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#c5a880]" />
                          UPI Instant Payment
                        </span>
                        <span className="text-[10px] text-stone-500">GPay, PhonePe, Paytm</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Instant payment via Virtual Payment Address or QR code.
                      </p>

                      {paymentMethod === 'upi' && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                          <label className="block text-[11px] text-stone-600 mb-1">
                            UPI ID (VPA)
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full bg-white border border-stone-300 p-2 text-xs text-stone-900 focus:outline-none focus:border-black font-mono"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-stone-50/70 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-black"
                    />
                    <div className="flex-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#c5a880]" />
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Pay cash upon delivery. Inspect tamper-evident wax seal prior to acceptance.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="border border-stone-300 text-stone-700 px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:border-black transition-colors"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Review & Place Order */}
            {currentStep === 3 && (
              <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 animate-in fade-in">
                <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Review & Confirm Your Order
                </h2>

                {/* Shipping Summary */}
                <div className="p-4 bg-[#faf9f5] border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="uppercase tracking-wider text-stone-900">
                      Deliver To:
                    </strong>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-[#c5a880] underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-medium text-stone-900">{shippingData.fullName} ({shippingData.phone})</p>
                  <p className="text-stone-600">{shippingData.address}, {shippingData.apartment}</p>
                  <p className="text-stone-600">{shippingData.city}, {shippingData.state} - {shippingData.pinCode}</p>
                </div>

                {/* Payment Summary */}
                <div className="p-4 bg-[#faf9f5] border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="uppercase tracking-wider text-stone-900">
                      Payment Mode:
                    </strong>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-[#c5a880] underline font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-medium text-stone-900 uppercase">
                    {paymentMethod === 'card'
                      ? 'Credit / Debit Card'
                      : paymentMethod === 'upi'
                      ? 'UPI Payment'
                      : 'Cash on Delivery'}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="border border-stone-300 text-stone-700 px-5 py-3.5 text-xs uppercase tracking-wider font-semibold hover:border-black transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-widest font-semibold py-3.5 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    {isProcessing ? (
                      <span>Securing Fragrance Order...</span>
                    ) : (
                      <>
                        <span>Place Demo Order · ₹{grandTotal.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary - Exact Match to Wireframe Panel 06 */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 border border-stone-200 shadow-xs space-y-5 sticky top-24">
              <h2 className="font-serif-luxury text-xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1 space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="pt-3 flex gap-3 items-center justify-between"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.product.images?.[0] || '/product-placeholder.svg'}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover bg-stone-100 shrink-0 border border-stone-200"
                      />
                      <div>
                        <h4 className="font-serif-luxury text-sm font-semibold text-stone-900 truncate max-w-[170px]">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          {item.selectedSize} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  <span>Express Shipping</span>
                  <span className="tabular-nums text-stone-900">
                    {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#faf9f5] border border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span>Private delivery in velvet-lined gift boxes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
