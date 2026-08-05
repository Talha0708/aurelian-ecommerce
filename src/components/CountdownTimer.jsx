// src/components/CountdownTimer.jsx
"use client";

import { useState, useEffect } from 'react';

export default function CountdownTimer({ offerEndsAt }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!offerEndsAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(offerEndsAt).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [offerEndsAt]);

  // Hydration error ফিক্স এবং অফার শেষ হলে বা না থাকলে লুকানোর লজিক
  if (!isMounted || !offerEndsAt) return null;
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-amber-500/30 py-2 flex justify-center items-center gap-2 z-20 transition-transform duration-500 group-hover:translate-y-0 translate-y-full md:translate-y-0">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      <span className="text-[10px] uppercase tracking-widest text-amber-500 font-medium">Ends In:</span>
      <span className="text-xs text-white font-medium tracking-wider">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}