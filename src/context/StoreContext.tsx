// src/context/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // unique composite key: `${productId}-${color}-${size}`
  productId: string;
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  appliedCoupon: Coupon | null;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setSearchQuery: (query: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  WELCOME15: 15,
  SETHI20: 20,
  FIRSTDROP: 10,
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sethizzz_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'p001-black-M',
          productId: 'p001',
          slug: 'oversized-heavyweight-tee-black',
          name: 'Oversized Heavyweight Tee',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=90&auto=format',
          color: 'Black',
          size: 'M',
          price: 1199,
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sethizzz_wishlist');
      return saved ? JSON.parse(saved) : ['p002'];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('sethizzz_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('sethizzz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sethizzz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('sethizzz_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('sethizzz_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.color}-${item.size}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const applyCoupon = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (COUPONS[upper]) {
      const coupon = { code: upper, discountPercent: COUPONS[upper] };
      setAppliedCoupon(coupon);
      return { success: true, message: `Coupon applied: ${COUPONS[upper]}% off!` };
    }
    return { success: false, message: 'Invalid coupon code. Try SAVE10 or SETHI20' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        setSearchQuery,
        applyCoupon,
        removeCoupon,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
