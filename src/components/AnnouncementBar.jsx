// src/components/AnnouncementBar.jsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";

/**
 * Continuous marquee — halka black (#1A1A1A) background, white text.
 * JS/requestAnimationFrame দিয়ে scroll করানো হয় (CSS @keyframes নয়) — তাই
 * component re-render হলেও animation কখনো 0%-এ restart হয় না, position
 * সবসময় continuous থাকে। Unit width সরাসরি DOM থেকে মাপা হয়, তাই কোনো
 * sub-pixel/font mismatch থেকেও gap তৈরি হয় না।
 */
export default function AnnouncementBar({ headlines = [] }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const trackRef = useRef(null);
  const unitWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);

  const displayHeadlines =
    headlines.length > 0
      ? headlines
      : ["GET PREMIUM PANJABIS AT JUST 799 TAKA"];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const SEPARATOR = "\u00A0\u00A0\u00A0•\u00A0\u00A0\u00A0";
  const unitText = displayHeadlines.join(SEPARATOR) + SEPARATOR;

  // px/sec স্পিড — কন্টেন্টের length অনুযায়ী auto, কিন্তু এখন duration না, সরাসরি speed (slow করা হয়েছে)
  const speed = useMemo(() => {
    const totalChars = displayHeadlines.reduce((s, t) => s + t.length, 0);
    return Math.max(22, Math.min(50, 500 / Math.max(1, totalChars * 0.05)));
  }, [displayHeadlines]);

  useEffect(() => {
    if (reducedMotion) return;

    const measure = () => {
      // trackRef-এ এখন ৩ কপি unit আছে; unit width বের করতে scrollWidth/3 নেওয়া হচ্ছে
      if (trackRef.current) {
        unitWidthRef.current = trackRef.current.scrollWidth / 3;
      }
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    const step = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const unitWidth = unitWidthRef.current;
      if (unitWidth > 0) {
        offsetRef.current += speed * dt;
        // offset unit width ছাড়িয়ে গেলে wrap করে দাও — কিন্তু কখনো 0-তে hard reset না,
        // বরং exact modulo দিয়ে, তাই কোনো frame drop/gap চোখে পড়ে না
        if (offsetRef.current >= unitWidth) {
          offsetRef.current -= unitWidth;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lastTimeRef.current = null;
    };
  }, [speed, reducedMotion, unitText]);

  if (!displayHeadlines || displayHeadlines.length === 0) return null;

  return (
    <div
      className="relative w-full h-10 overflow-hidden z-40"
      style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
    >
      <div
        ref={trackRef}
        className="flex h-10 items-center whitespace-nowrap"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          transform: reducedMotion ? "none" : "translate3d(0,0,0)",
        }}
      >
        {/* ৩ কপি রাখা হয়েছে (২ না) — যাতে বড় স্ক্রিনে বা কম কন্টেন্টেও measure/wrap
            সবসময় নির্ভুল থাকে এবং কখনো ফাঁকা জায়গা দেখা না যায় */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block pl-6 md:pl-10 text-xs md:text-sm font-medium tracking-[0.2em] uppercase shrink-0"
          >
            {unitText}
          </span>
        ))}
      </div>
    </div>
  );
}