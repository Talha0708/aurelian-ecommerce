// src/components/ClientWrapper.jsx
"use client";

import { useState } from "react";
import { CartProvider } from "../context/CartContext";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import WhatsAppWidget from "./WhatsAppWidget";

export default function ClientWrapper({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCartDrawer = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartProvider>
      {/* ন্যাভবারে ড্রয়ার ওপেন করার ফাংশন পাস করা হলো */}
      <Navbar toggleCartDrawer={toggleCartDrawer} />
      
      {/* মেইন পেজ কনটেন্ট (যা সার্ভার থেকে আসবে) */}
      <main className="flex-grow">
        {children}
      </main>

      {/* ডান পাশের স্লাইডিং কার্ট ড্রয়ার */}
      <CartDrawer isOpen={isCartOpen} toggleDrawer={toggleCartDrawer} />
      
      {/* ফ্লোটিং হোয়াটসঅ্যাপ সাপোর্ট উইজেট */}
      <WhatsAppWidget />
    </CartProvider>
  );
}