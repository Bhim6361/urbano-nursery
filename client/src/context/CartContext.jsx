import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('urbano_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('urbano_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock`, 'error');
      return;
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock`, 'warning');
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        showToast(`Updated quantity of ${product.name} to ${newQty}`, 'success');
        return updated;
      } else {
        if (qty > product.stock) {
          showToast(`Only ${product.stock} units available in stock`, 'warning');
          return prevItems;
        }
        showToast(`Added ${product.name} to your garden cart!`, 'success');
        return [...prevItems, { product, quantity: qty }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          if (qty > item.product.stock) {
            showToast(`Max available stock is ${item.product.stock}`, 'warning');
            return { ...item, quantity: item.product.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((i) => i.product._id === productId);
      if (target) {
        showToast(`Removed ${target.product.name} from cart`, 'info');
      }
      return prevItems.filter((i) => i.product._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  // Free shipping above 999 INR, otherwise 99 INR
  const shippingFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
