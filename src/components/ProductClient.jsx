"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

// 🎯 Contentful Rich Text Imports
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';

// 🎯 Contentful Render Options (UI স্টাইলিংয়ের জন্য)
const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold text-white">{text}</strong>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="text-gray-400 font-light leading-relaxed mb-5 text-lg">
        {children}
      </p>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-5 mb-5 text-gray-400 font-light leading-relaxed space-y-2 text-lg">
        {children}
      </ul>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li>{children}</li>
    ),
  },
};

export default function ProductClient({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 🎯 Gallery & Modal State
  const defaultImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/800x1000/111111/cccccc?text=Product+Image';
  
  const [activeImage, setActiveImage] = useState(defaultImage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isApparel = product.category === 'apparel';
  const requiresSize = isApparel && product.sizes && product.sizes.length > 0;

  // ==========================================
  // ⏳ COUNTDOWN TIMER LOGIC
  // ==========================================
  useEffect(() => {
    if (!product.offerEndsAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(product.offerEndsAt).getTime() - now;

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
  }, [product.offerEndsAt]);

  // ==========================================
  // 📦 DYNAMIC STOCK LOGIC
  // ==========================================
  const getCurrentStock = () => {
    if (!product.stockInfo) return 0; 
    
    if (isApparel) {
      if (!selectedSize) return null; 
      return product.stockInfo[selectedSize] !== undefined ? product.stockInfo[selectedSize] : 0;
    } else {
      return product.stockInfo['default'] !== undefined ? product.stockInfo['default'] : 0; 
    }
  };

  const currentStock = getCurrentStock();
  const isOutOfStock = currentStock === 0;

  // ==========================================
  // 🎯 TRACKING LOGIC
  // ==========================================
  const sendCAPIEvent = async (eventName, eventData) => {
    try {
      await fetch('/api/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, eventData, url: window.location.href }),
      });
    } catch (error) {
      console.error('CAPI Event Error:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const trackData = {
        currency: 'BDT',
        value: product.salePrice,
        items: [{
          item_id: product.slug,
          item_name: product.title,
          item_category: product.category,
          price: product.salePrice,
          quantity: 1
        }]
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'view_item', ecommerce: trackData });

      if (window.fbq) {
        window.fbq('track', 'ViewContent', {
          content_name: product.title,
          content_ids: [product.slug],
          content_type: 'product',
          value: product.salePrice,
          currency: 'BDT'
        });
      }

      sendCAPIEvent('ViewContent', {
        content_name: product.title,
        content_ids: [product.slug],
        value: product.salePrice
      });
    }
  }, [product]);

  // ==========================================
  // 🛒 HANDLERS
  // ==========================================
  const handleAddToCart = () => {
    if (requiresSize && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    if (isOutOfStock) {
      alert("Sorry, this item is out of stock.");
      return;
    }
    
    const finalSize = requiresSize ? selectedSize : null;
    addToCart({ ...product, selectedSize: finalSize, quantity: 1, price: product.salePrice });
    
    if (typeof window !== 'undefined') {
      const trackData = {
        currency: 'BDT',
        value: product.salePrice,
        items: [{
          item_id: product.slug,
          item_name: product.title,
          item_category: product.category,
          price: product.salePrice,
          quantity: 1,
          item_variant: finalSize || 'N/A'
        }]
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'add_to_cart', ecommerce: trackData });

      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_name: product.title,
          content_ids: [product.slug],
          content_type: 'product',
          value: product.salePrice,
          currency: 'BDT'
        });
      }

      sendCAPIEvent('AddToCart', {
        content_name: product.title,
        content_ids: [product.slug],
        value: product.salePrice
      });
    }
    
    alert("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (requiresSize && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    if (isOutOfStock) {
      alert("Sorry, this item is out of stock.");
      return;
    }
    
    const finalSize = requiresSize ? selectedSize : null;
    buyNow({ ...product, selectedSize: finalSize, quantity: 1, price: product.salePrice });
    
    if (typeof window !== 'undefined') {
      const trackData = {
        currency: 'BDT',
        value: product.salePrice,
        items: [{
          item_id: product.slug,
          item_name: product.title,
          item_category: product.category,
          price: product.salePrice,
          quantity: 1,
          item_variant: finalSize || 'N/A'
        }]
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'begin_checkout', ecommerce: trackData });

      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: product.title,
          content_ids: [product.slug],
          content_type: 'product',
          value: product.salePrice,
          currency: 'BDT'
        });
      }

      sendCAPIEvent('InitiateCheckout', {
        content_name: product.title,
        content_ids: [product.slug],
        value: product.salePrice
      });
    }
    
    router.push('/checkout');
  };

  return (
    <>
      {/* ========================================== */}
      {/* 🖼️ Full Screen Modal for Image */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-amber-500 transition-colors z-50 bg-white/5 p-3 rounded-full border border-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative w-full max-w-5xl h-full max-h-[85vh]">
            <Image 
              src={activeImage} 
              alt="Full View" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* ========================================== */}
            {/* 📸 Left Side: Fluid Gallery */}
            {/* ========================================== */}
            <div className="flex flex-col gap-4 w-full">
              {/* 🎯 Main Image View - Fluid Layout */}
              <div 
                onClick={() => setIsModalOpen(true)}
                className="relative w-full rounded-xl overflow-hidden cursor-zoom-in group shadow-2xl bg-black border border-white/5"
              >
                  <Image 
                    src={activeImage} 
                    alt={product.title} 
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="transition-opacity duration-300 group-hover:opacity-90"
                    priority
                  />
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur border border-white/10 text-white/70 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Click to Enlarge
                  </div>
              </div>

              {/* 🎯 Thumbnail Navigation */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((imgUrl, index) => (
                    <button 
                      key={index} 
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-24 md:w-24 md:h-32 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 border-2 bg-black
                        ${activeImage === imgUrl ? 'border-amber-500 opacity-100 shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/30'}`}
                    >
                      <Image 
                        src={imgUrl} 
                        alt={`Thumbnail ${index + 1}`} 
                        fill 
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================== */}
            {/* 📝 Right Side: Product Information */}
            {/* ========================================== */}
            <div className="flex flex-col justify-center lg:sticky lg:top-28">
              
              <Link href="/" className="text-gray-500 hover:text-amber-500 text-xs uppercase tracking-widest mb-6 transition-colors flex items-center gap-2 w-fit">
                <span>&larr;</span> Back to Collection
              </Link>
              
              <span className="text-amber-500 text-xs font-medium uppercase tracking-[0.3em] mb-2 block">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-5xl font-light tracking-widest text-white uppercase mb-4 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-medium text-amber-500">৳ {product.salePrice}</span>
                {product.discountAmount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">৳ {product.regularPrice}</span>
                    <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-xs font-semibold uppercase tracking-wider rounded-full border border-amber-500/20">
                      Save ৳ {product.discountAmount}
                    </span>
                  </>
                )}
              </div>

              {/* 🎯 Updated Contentful Rich Text Description */}
              <div className="mb-8">
                {product?.description 
                  ? documentToReactComponents(product.description, renderOptions) 
                  : null}
              </div>

              {/* Countdown Timer */}
              {product.offerEndsAt && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
                 <div className="mb-8 p-5 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-widest text-amber-500 font-medium flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                       Flash Sale Ends In
                    </span>
                    <div className="flex gap-3 text-center">
                      <div className="bg-black/60 px-4 py-2.5 rounded-lg border border-white/5"><span className="block font-semibold text-white text-lg">{timeLeft.days}</span><span className="text-[10px] text-gray-500 uppercase">Days</span></div>
                      <div className="bg-black/60 px-4 py-2.5 rounded-lg border border-white/5"><span className="block font-semibold text-white text-lg">{timeLeft.hours}</span><span className="text-[10px] text-gray-500 uppercase">Hrs</span></div>
                      <div className="bg-black/60 px-4 py-2.5 rounded-lg border border-white/5"><span className="block font-semibold text-white text-lg">{timeLeft.minutes}</span><span className="text-[10px] text-gray-500 uppercase">Min</span></div>
                      <div className="bg-black/60 px-4 py-2.5 rounded-lg border border-white/5"><span className="block font-semibold text-white text-lg">{timeLeft.seconds}</span><span className="text-[10px] text-gray-500 uppercase">Sec</span></div>
                    </div>
                 </div>
              )}

              {/* Size Selection System */}
              {requiresSize && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                    <span>Select Size <span className="text-amber-500">*</span></span>
                    <button className="text-xs text-amber-500 underline hover:text-amber-400 transition-colors">Size Guide</button>
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {product.sizes.map((size) => {
                      const sizeStock = product.stockInfo && product.stockInfo[size] !== undefined ? product.stockInfo[size] : 0;
                      const isSizeOutOfStock = sizeStock === 0;

                      return (
                        <button
                          key={size}
                          onClick={() => !isSizeOutOfStock && setSelectedSize(size)}
                          disabled={isSizeOutOfStock}
                          className={`w-16 h-16 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 font-medium relative overflow-hidden text-lg
                            ${isSizeOutOfStock 
                              ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/5 text-gray-600' : 
                              selectedSize === size
                                ? 'border-amber-500 bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.2)] scale-105'
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <span>{size}</span>
                          {isSizeOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-[120%] h-[1px] bg-red-500/50 rotate-45"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div className="mb-8 h-6">
                {isApparel && !selectedSize ? (
                  <span className="text-gray-500 text-xs tracking-wider uppercase">Select a size to view availability</span>
                ) : isOutOfStock ? (
                  <span className="flex items-center gap-2 text-red-500 text-sm tracking-wider uppercase font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Out of Stock
                  </span>
                ) : currentStock > 0 && currentStock <= 8 ? (
                  <span className="flex items-center gap-2 text-amber-500 text-sm tracking-wider uppercase font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> 
                    Only {currentStock} left in stock - Order Soon!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-green-500 text-sm tracking-wider uppercase font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> In Stock & Ready to Ship
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-white/10">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-5 px-6 border border-amber-600 text-amber-500 uppercase tracking-widest text-sm font-medium rounded-xl transition-all duration-300 active:scale-[0.98]
                    ${isOutOfStock 
                      ? 'opacity-50 cursor-not-allowed border-gray-700 text-gray-500' 
                      : 'hover:bg-amber-600 hover:text-white'}`}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-5 px-6 uppercase tracking-widest text-sm font-medium rounded-xl transition-all duration-300 active:scale-[0.98]
                    ${isOutOfStock 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)]'}`}
                >
                  Order Now
                </button>
              </div>

              {/* Premium Trust Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Premium Quality
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Fast Delivery
                </div>
              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* 🛍️ Related Products Section */}
          {/* ========================================== */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-white/10">
              <h2 className="text-2xl md:text-3xl font-light tracking-widest text-white uppercase mb-12 text-center">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((rp) => (
                  <Link key={rp.slug} href={`/product/${rp.slug}`} className="group block">
                    <div className="relative w-full aspect-[4/5] bg-black rounded-xl border border-white/10 overflow-hidden mb-4">
                      <Image 
                        src={rp.image} 
                        alt={rp.title} 
                        fill 
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-light text-white uppercase tracking-wider mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">
                      {rp.title}
                    </h3>
                    <p className="text-amber-500 font-medium">৳ {rp.salePrice}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}