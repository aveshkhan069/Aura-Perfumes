import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { LoginRegister } from './pages/LoginRegister';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Account } from './pages/Account';
import { OrderHistory } from './pages/OrderHistory';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import { Product } from './types';

export default function App() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <ToastProvider>
              <div className="min-h-screen flex flex-col bg-[#faf9f5] text-[#111111]">
                {/* Header Navigation */}
                <Header onOpenSearch={() => setIsSearchOpen(true)} />

                {/* Main View Router */}
                <main className="flex-1">
                  <Routes>
                    <Route
                      path="/"
                      element={<Home onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route
                      path="/shop"
                      element={<Shop onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route
                      path="/shop/men"
                      element={<Shop forcedCategory="Men" onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route
                      path="/shop/women"
                      element={<Shop forcedCategory="Women" onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route
                      path="/shop/unisex"
                      element={<Shop forcedCategory="Unisex" onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route
                      path="/product/:id"
                      element={<ProductDetail onQuickView={(p) => setQuickViewProduct(p)} />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<LoginRegister />} />
                    <Route path="/register" element={<LoginRegister />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                {/* Footer */}
                <Footer />

                {/* Global Overlays */}
                <CartDrawer />
                <QuickViewModal
                  product={quickViewProduct}
                  onClose={() => setQuickViewProduct(null)}
                />
                <SearchModal
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                />
              </div>
            </ToastProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
