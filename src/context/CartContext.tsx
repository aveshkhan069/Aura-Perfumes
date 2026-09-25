import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const previousUserId = useRef<string | null>(null);
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (previousUserId.current && !user) {
      setItems([]);
      setAppliedPromo(null);
      localStorage.removeItem('aura_cart');
    }
    previousUserId.current = user?.id || null;
  }, [isAuthLoading, user]);

  const addToCart = (product: Product, size?: string, quantity: number = 1) => {
    const selectedSize = size || product.size || '100ml';
    const sizeConfig = product.availableSizes.find(s => s.size === selectedSize);
    const unitPrice = sizeConfig ? sizeConfig.price : product.price;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, selectedSize, unitPrice, quantity }];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 999 || items.length === 0 ? 0 : 99;

  let discount = 0;
  if (appliedPromo === 'AURA10') {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo === 'LUXURY20' && subtotal >= 3000) {
    discount = Math.round(subtotal * 0.2);
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'AURA10') {
      setAppliedPromo('AURA10');
      return { success: true, message: '10% discount applied to your order!' };
    }
    if (clean === 'LUXURY20') {
      if (subtotal < 3000) {
        return { success: false, message: 'Code LUXURY20 requires minimum order of ₹3,000' };
      }
      setAppliedPromo('LUXURY20');
      return { success: true, message: '20% VIP privilege discount applied!' };
    }
    return { success: false, message: 'Invalid or expired promotional voucher' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        discount,
        grandTotal,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
