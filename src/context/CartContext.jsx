// src/context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('aurelian_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parse error");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('aurelian_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  // ১. শুধু কার্টে অ্যাড হবে, কোথাও রিডাইরেক্ট করবে না
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.slug === product.slug && item.selectedSize === product.selectedSize
      );

      if (existingItemIndex >= 0) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += (product.quantity || 1);
        updated[existingItemIndex].isSelected = true;
        return updated;
      } else {
        const cartId = `${product.slug}-${product.selectedSize}-${Date.now()}`;
        return [...prev, { ...product, cartId, isSelected: true }];
      }
    });
  };

  // ২. অর্ডার নাউ (কার্টে যোগ করে চেকআউটে পাঠাবে, কিন্তু আগের প্রোডাক্ট মুছবে না)
  const buyNow = (product) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.slug === product.slug && item.selectedSize === product.selectedSize
      );

      let updated;
      if (existingItemIndex >= 0) {
        updated = [...prev];
        updated[existingItemIndex].quantity += (product.quantity || 1);
        updated[existingItemIndex].isSelected = true;
      } else {
        const cartId = `${product.slug}-${product.selectedSize}-${Date.now()}`;
        updated = [...prev, { ...product, cartId, isSelected: true }];
      }
      return updated;
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, action) => {
    setCartItems((prev) => prev.map((item) => {
      if (item.cartId === cartId) {
        let newQty = item.quantity;
        if (action === 'increase') newQty += 1;
        if (action === 'decrease' && newQty > 1) newQty -= 1;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleItemSelection = (cartId) => {
    setCartItems((prev) => prev.map((item) => 
      item.cartId === cartId ? { ...item, isSelected: !item.isSelected } : item
    ));
  };

  const toggleAllSelection = (status) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, isSelected: status })));
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => item.isSelected);
  };

  const getCartTotal = () => {
    return cartItems.filter(item => item.isSelected).reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems((prev) => prev.filter(item => !item.isSelected));
  };

  if (!isMounted) return null;

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, buyNow, removeFromCart, updateQuantity,
      toggleItemSelection, toggleAllSelection, getSelectedItems, getCartTotal, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);