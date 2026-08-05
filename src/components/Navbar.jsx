// src/components/Navbar.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext'; 

export default function Navbar({ toggleCartDrawer }) {
  const { cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 40px স্ক্রল হলে Navbar উপরে উঠে যাবে এবং গ্লাস ইফেক্ট ট্রানজিশন হবে
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cartItems?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <nav 
      className={`fixed left-0 w-full z-30 transition-all duration-300 border-b border-white/5 ${
        isScrolled 
          ? "top-0 bg-black/30 backdrop-blur-md shadow-lg" // 🎯 পরিবর্তন: bg-black/90 থেকে bg-black/30 করা হয়েছে নিখুঁত গ্লাস ইফেক্টের জন্য
          : "top-10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm" 
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-light tracking-[0.3em] text-white uppercase hover:text-amber-500 transition-colors">
          Aurelian
        </Link>

        {/* Navigation Links & Cart Trigger */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium tracking-widest text-gray-300 hover:text-white uppercase transition-colors hidden md:block">
            Collection
          </Link>
          
          {/* 🛒 কার্ট বাটন - ক্লিক করলে ড্রয়ার ওপেন হবে */}
          <button 
            onClick={toggleCartDrawer}
            className="relative group flex items-center gap-2 text-gray-300 hover:text-amber-500 transition-colors bg-transparent border-none cursor-pointer"
          >
            <span className="text-sm font-medium tracking-widest uppercase">Cart</span>
            
            {/* Cart Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            {/* Cart Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-amber-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg group-hover:bg-amber-500 transition-colors">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        
      </div>
    </nav>
  );
}