// src/components/AddToCartButton.jsx
"use client";

// এখানে পাথ ঠিক করা হয়েছে (Relative Path)
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product, slug }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    // প্রোডাক্টের সাথে slug যুক্ত করে কার্টে পাঠানো হচ্ছে
    const productToAdd = { ...product, slug };
    addToCart(productToAdd);
    
    // বাটন ক্লিকের একটি ছোট্ট স্মুথ ইফেক্ট দেওয়ার জন্য
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full font-medium uppercase tracking-[0.2em] py-4 rounded-lg transition-all duration-300 mt-4 ${
        isAdding 
          ? 'bg-amber-800 text-gray-300 scale-[0.98]' 
          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-amber-600/30'
      }`}
    >
      {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
    </button>
  );
}