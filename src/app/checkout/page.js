// src/app/checkout/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { getSelectedItems, getCartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const checkoutItems = getSelectedItems(); 
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryZone: '',
    district: '',
    thana: '',
    address: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const deliveryCharge = formData.deliveryZone === 'dhaka' ? 70 : (formData.deliveryZone === 'outside' ? 110 : 0);
  const subtotal = getCartTotal();
  const totalAmount = subtotal + deliveryCharge;

  // 🎯 InitiateCheckout Tracking (GA4 + Meta CAPI)
  useEffect(() => {
    if (checkoutItems?.length > 0 && !orderSuccess) {
      // 1. GA4 Begin Checkout Event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'BDT',
          value: subtotal,
          items: checkoutItems.map(item => ({
            item_name: item.title,
            price: item.price,
            quantity: item.quantity
          }))
        });
      }

      // 2. Meta CAPI InitiateCheckout Event
      fetch('/api/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'InitiateCheckout',
          url: window.location.href,
          eventData: {
            value: subtotal,
            content_name: 'Checkout',
            content_ids: checkoutItems.map(i => i.title).join(', '),
          }
        })
      }).catch(err => console.error('CAPI InitiateCheckout Error:', err));
    }
  }, []); // শুধু পেইজ লোড হওয়ার সময় একবার কল হবে

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (checkoutItems?.length === 0) {
      alert("No items selected for checkout!");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          deliveryZone: formData.deliveryZone === 'dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳110)',
          district: formData.district,
          thana: formData.thana,
          address: formData.address,
          cartItems: checkoutItems,
          totalAmount: totalAmount, 
        }),
      });

      if (response.ok) {
        setOrderSuccess(true);
        
        // 🎯 Purchase Tracking (GA4 + Meta CAPI)
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'purchase', {
            currency: 'BDT',
            transaction_id: `ORD-${Date.now()}`,
            value: totalAmount,
            shipping: deliveryCharge,
            items: checkoutItems.map(item => ({
              item_name: item.title,
              price: item.price,
              quantity: item.quantity
            }))
          });
        }

        fetch('/api/capi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Purchase',
            url: window.location.href,
            eventData: {
              value: totalAmount,
              content_name: 'Order Placement',
              content_ids: checkoutItems.map(i => i.title).join(', '),
            }
          })
        }).catch(err => console.error('CAPI Purchase Error:', err));

        clearCart(); 
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Failed to place order. Check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-20">
        <div className="glass-panel p-10 md:p-16 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-center max-w-lg">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl text-white font-light tracking-wider mb-4 uppercase">Order Confirmed</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Thank you for choosing Aurelian. Your order has been successfully placed. We will contact you shortly for delivery updates.
          </p>
          <Link 
            href="/" 
            className="inline-block w-full py-4 bg-amber-600 hover:bg-amber-700 text-white uppercase tracking-[0.2em] font-medium rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-10 border-b border-white/10 pb-6">
          Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Shipping Form */}
          <div className="w-full lg:w-3/5 glass-panel p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
            <h2 className="text-xl text-white tracking-widest uppercase mb-8">Shipping Information</h2>
            
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. 01XXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">Delivery Zone</label>
                <select 
                  name="deliveryZone"
                  required
                  value={formData.deliveryZone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Delivery Zone...</option>
                  <option value="dhaka">Inside Dhaka (৳ 70)</option>
                  <option value="outside">Outside Dhaka (৳ 110)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">District / Zilla</label>
                  <input 
                    type="text" 
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">Thana / Upazila</label>
                  <input 
                    type="text" 
                    name="thana"
                    required
                    value={formData.thana}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="e.g. Demra"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs tracking-widest uppercase mb-2">Detailed Address</label>
                <textarea 
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="House, Road, Block, Area..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || checkoutItems?.length === 0}
                className={`w-full py-4 mt-6 uppercase tracking-[0.2em] font-medium rounded-lg transition-all duration-300 ${
                  isSubmitting || checkoutItems?.length === 0
                    ? 'bg-amber-800/50 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-amber-600/30 active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? 'Processing Order...' : 'Confirm Order'}
              </button>
            </form>
          </div>

          {/* Order Summary Panel */}
          <div className="w-full lg:w-2/5 glass-panel p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-amber-600/20 shadow-xl lg:sticky lg:top-28">
            <h2 className="text-xl text-white tracking-widest uppercase mb-8">Order Summary</h2>
            
            {checkoutItems?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">No items selected.</p>
                <Link href="/" className="text-amber-500 hover:underline text-sm uppercase tracking-widest">
                  Back to Shop
                </Link>
              </div>
            ) : (
              <div className="space-y-6 mb-8 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems?.map((item, index) => (
                  <div key={item.cartId || `checkout-item-${index}`} className="flex gap-4 items-center bg-black/20 p-3 rounded-lg border border-white/5">
                    
                    {/* Image */}
                    <div className="relative w-16 h-20 rounded-md overflow-hidden bg-black/50 flex-shrink-0 border border-white/10">
                      {item.image && item.image.trim() !== "" ? (
                        <Image src={item.image} alt={item.title || "Product"} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 uppercase text-center leading-tight p-1">No Image</div>
                      )}
                    </div>

                    {/* Details & Controls */}
                    <div className="flex-grow">
                      <h3 className="text-white text-sm tracking-wider line-clamp-1">{item.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">Size: {item.selectedSize || 'N/A'}</p>
                      <p className="text-amber-500 font-medium text-xs mt-1">৳ {item.price} each</p>
                      
                      {/* Quantity & Delete buttons inside checkout */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-black/40 rounded border border-white/10 px-2 py-0.5 w-fit">
                          <button onClick={() => updateQuantity(item.cartId, 'decrease')} className="text-gray-400 hover:text-white px-1.5 text-sm">-</button>
                          <span className="text-white text-xs w-3 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 'increase')} className="text-gray-400 hover:text-white px-1.5 text-sm">+</button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.cartId)} 
                          className="text-gray-500 hover:text-red-500 text-xs uppercase tracking-wider transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>৳ {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Charge</span>
                <span className={deliveryCharge > 0 ? "text-amber-500" : ""}>
                  {deliveryCharge > 0 ? `৳ ${deliveryCharge}` : 'Select Zone'}
                </span>
              </div>
              <div className="flex justify-between text-xl text-white font-medium pt-4 border-t border-white/10">
                <span className="tracking-widest uppercase">Total</span>
                <span className="text-amber-500">৳ {totalAmount}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}