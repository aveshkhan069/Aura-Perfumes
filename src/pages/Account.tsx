import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut, ArrowRight, ShieldCheck, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ShippingAddress } from '../types';

export const Account: React.FC = () => {
  const { user, logout, updateUserAddresses } = useAuth();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'settings'>('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: '+91 98765 43210',
    email: user?.email || '',
    address: '',
    apartment: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '',
    country: 'India',
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.address || !newAddress.pinCode) {
      showToast('Please fill out address fields', 'error');
      return;
    }
    updateUserAddresses(newAddress);
    setIsAddingAddress(false);
    showToast('New delivery address saved');
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out of AURA account');
    navigate('/');
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 pb-4 border-b border-stone-300 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900">
              Account Dashboard
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Welcome back, {user?.name || 'Valued Connoisseur'} · Member since {user?.joinedDate || '2026'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-2">
            <div className="bg-white border border-stone-200 p-2 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <User className="w-4 h-4" /> Profile Overview
              </button>

              <Link
                to="/orders"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" /> My Orders
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                to="/wishlist"
                className="w-full flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" /> My Wishlist
                </div>
                <span className="text-[11px] font-bold text-[#c5a880] tabular-nums">
                  {wishlistCount}
                </span>
              </Link>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <MapPin className="w-4 h-4" /> Saved Addresses
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold text-left transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
            </div>

            {user?.role === 'admin' && (
              <div className="p-4 bg-[#141414] text-white border border-stone-800 shadow-xs">
                <span className="text-[10px] uppercase tracking-widest text-[#c5a880] font-bold block mb-1">
                  Concierge Access
                </span>
                <p className="text-xs text-stone-300 mb-3">
                  You have administrative privileges to manage products and orders.
                </p>
                <Link
                  to="/admin"
                  className="block text-center bg-[#c5a880] text-black text-xs uppercase tracking-widest font-semibold py-2 hover:bg-[#ebdcc9] transition-colors"
                >
                  Admin Dashboard
                </Link>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-8 lg:col-span-9">
            {/* Tab: Profile Overview */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                  <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                    Profile Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                        Full Name
                      </span>
                      <strong className="text-stone-900 text-sm mt-0.5 block">
                        {user?.name || 'Avesh Khan'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                        Email Address
                      </span>
                      <strong className="text-stone-900 text-sm mt-0.5 block">
                        {user?.email || 'aveshkhan069@gmail.com'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                        Account Tier
                      </span>
                      <strong className="text-stone-900 text-sm mt-0.5 block text-[#c5a880]">
                        AURA VIP Inner Circle Member
                      </strong>
                    </div>

                    <div>
                      <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                        Registration Date
                      </span>
                      <strong className="text-stone-900 text-sm mt-0.5 block">
                        {user?.joinedDate || 'January 2026'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Quick Link Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                        Past Fragrance Orders
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Track deliveries, view invoices and reorder
                      </p>
                    </div>
                    <Link
                      to="/orders"
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="bg-white p-5 border border-stone-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                        Wishlist ({wishlistCount})
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Saved scents awaiting your private collection
                      </p>
                    </div>
                    <Link
                      to="/wishlist"
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h2 className="font-serif-luxury text-2xl font-bold text-stone-900">
                    Saved Delivery Addresses
                  </h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-[#252525] text-white text-xs uppercase tracking-wider font-semibold px-3.5 py-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleSaveAddress} className="p-4 bg-stone-50 border border-stone-200 space-y-4 text-xs">
                    <h3 className="font-semibold text-stone-900 uppercase tracking-wider">
                      Add New Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="w-full bg-white border border-stone-300 p-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={newAddress.pinCode}
                          onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                          className="w-full bg-white border border-stone-300 p-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="bg-black text-white px-4 py-2 font-semibold hover:bg-stone-800"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="border border-stone-300 px-4 py-2 hover:bg-stone-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(user?.savedAddresses && user.savedAddresses.length > 0 ? user.savedAddresses : [
                    {
                      fullName: user?.name || 'Avesh Khan',
                      phone: '+91 98765 43210',
                      email: user?.email || 'aveshkhan069@gmail.com',
                      address: '42, Hill Road, Bandra West',
                      apartment: 'Apt 4B, Sea View Towers',
                      city: 'Mumbai',
                      state: 'Maharashtra',
                      pinCode: '400050',
                      country: 'India'
                    }
                  ]).map((addr, idx) => (
                    <div key={idx} className="p-4 border border-stone-200 bg-[#faf9f5] text-xs space-y-1 relative">
                      <span className="text-[10px] uppercase font-bold text-[#c5a880] block mb-1">
                        Default Shipping
                      </span>
                      <p className="font-semibold text-stone-900">{addr.fullName}</p>
                      <p className="text-stone-600">{addr.address}, {addr.apartment}</p>
                      <p className="text-stone-600">{addr.city}, {addr.state} - {addr.pinCode}</p>
                      <p className="text-stone-500 pt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
                <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 pb-3 border-b border-stone-200">
                  Preferences & Security
                </h2>

                <div className="space-y-4 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-black" />
                    <span>Receive private invites to limited edition flacon launches</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-black" />
                    <span>SMS notifications for dispatch and courier delivery tracking</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="accent-black" />
                    <span>Two-Factor Authentication (2FA) on login</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <button
                    onClick={() => showToast('Account preferences updated')}
                    className="bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold px-6 py-2.5 hover:bg-[#252525] transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
