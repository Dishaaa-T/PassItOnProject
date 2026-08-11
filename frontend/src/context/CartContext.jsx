import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('passiton_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem('passiton_cart');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('passiton_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === product._id);
      if (existing) return prev;
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.length;

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
