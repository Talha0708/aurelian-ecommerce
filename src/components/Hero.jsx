// src/components/Hero.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Hero({ heroImages = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brokenSet, setBrokenSet] = useState(new Set());
  const intervalRef = useRef(null);

  // 🎯 Contentful থেকে ডাটা না আসলে বা লোড হতে দেরি হলে এই ব্যাকআপ ইমেজগুলো দেখাবে
  const fallbackImages = [
    "https://images.unsplash.com/photo-1528139494595-a848e52c6335?q=80&w=2000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1708651145401-6be804cd02d4?q=80&w=2000&auto=format&fit=crop"
  ];

  const displayImages = heroImages.length > 0 ? heroImages : fallbackImages;

  useEffect(() => {
    if (displayImages.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        let next = (prev + 1) % displayImages.length;
        let safety = 0;
        
        while (brokenSet.has(next) && safety < displayImages.length) {
          next = (next + 1) % displayImages.length;
          safety++;
        }
        
        return next;
      });
    }, 4500);

    return () => clearInterval(intervalRef.current);
  }, [brokenSet, displayImages.length]);

  const handleError = (index) => {
    setBrokenSet((prev) => new Set(prev).add(index));
  };

  if (!displayImages || displayImages.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      {displayImages.map((src, index) => {
        if (brokenSet.has(index)) return null;
        const isActive = index === currentIndex;
        
        // 🎯 Unsplash লিংকে https:// থাকেই, তাই এক্সট্রা যোগ করার দরকার নেই
        const imageUrl = src.startsWith('http') ? src : `https:${src}`;

        return (
          <div
            key={imageUrl + index}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${
              isActive ? 'opacity-60 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              transform: isActive ? 'scale(1.02)' : 'scale(1)',
              transition: 'opacity 1800ms ease-in-out, transform 6000ms ease-in-out',
            }}
          >
            <Image
              src={imageUrl}
              alt={`Aurelian Luxury Collection ${index + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0 || index === 1}
              onError={() => handleError(index)}
            />
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-[#0a0a0a] z-20 pointer-events-none"></div>
    </div>
  );
}