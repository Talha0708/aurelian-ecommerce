// src/components/ProductGallery.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images = [] }) {
  // যদি কোনো ইমেজ না থাকে, তবে ফলব্যাক ইমেজ দেখাবে
  const defaultImage = '/placeholder-image.jpg';
  const displayImages = images.length > 0 ? images : [defaultImage];
  
  const [activeImage, setActiveImage] = useState(displayImages[0]);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center center',
    transform: 'scale(1)'
  });

  // মাউস মুভমেন্ট ট্র্যাক করে জুম ইফেক্ট তৈরি করা
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)' // এখানে 2 মানে দ্বিগুণ জুম হবে
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (1-6 images) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible py-2 lg:py-0 w-full lg:w-24 shrink-0">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-24 lg:w-24 lg:h-32 rounded-md overflow-hidden border-2 transition-all duration-300 shrink-0 ${
              activeImage === img ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`Aurelian Product Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Image with Zoom Effect */}
      <div 
        className="relative w-full aspect-[4/5] bg-black/5 rounded-lg overflow-hidden cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={zoomStyle}
        >
          <Image
            src={activeImage}
            alt="Aurelian Premium Product"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}