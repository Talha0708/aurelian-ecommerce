// src/components/CartDrawer.jsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, toggleDrawer }) {
  const { 
    cartItems, removeFromCart, toggleItemSelection, 
    toggleAllSelection, updateQuantity, getCartTotal, getSelectedItems 
  } = useCart();

  const subtotal = getCartTotal();
  const selectedItemsCount = getSelectedItems().length;
  const isAllSelected = cartItems?.length > 0 && selectedItemsCount === cartItems.length;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleDrawer}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 bg-black/40">
          <h2 className="text-xl font-light tracking-[0.2em] text-white uppercase">Your Cart</h2>
          <button onClick={toggleDrawer} className="text-gray-400 hover:text-amber-500 text-2xl transition-colors">&times;</button>
        </div>

        {/* Select All Bar */}
        {cartItems?.length > 0 && (
          <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={(e) => toggleAllSelection(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-black/50 cursor-pointer accent-amber-500"
              />
              <span className="text-sm text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">Select All</span>
            </label>
            <span className="text-xs text-gray-500 uppercase">{selectedItemsCount} item(s) selected</span>
          </div>
        )}

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {(!cartItems || cartItems.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <span className="text-5xl">🛒</span>
              <p className="uppercase tracking-widest text-sm">Cart is empty</p>
            </div>
          ) : (
            // এখানে index অ্যাড করা হয়েছে ফলব্যাক key হিসেবে
            cartItems.map((item, index) => (
              <div 
                key={item.cartId || `fallback-key-${index}`} 
                className={`flex gap-4 items-center bg-white/5 p-4 rounded-xl border transition-all duration-300 ${item.isSelected ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5 hover:border-white/10'}`}
              >
                
                {/* Item Checkbox */}
                <input 
                  type="checkbox" 
                  checked={item.isSelected || false}
                  onChange={() => toggleItemSelection(item.cartId)}
                  className="w-5 h-5 rounded border-gray-600 text-amber-500 bg-black/50 cursor-pointer accent-amber-500"
                />

                {/* Image */}
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-black/50 flex-shrink-0 border border-white/10">
                  {item.image ? (
                    <Image src={item.image} alt={item.title || "Product"} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500 uppercase text-center">No Image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <h3 className="text-white text-sm font-medium tracking-wider line-clamp-1">{item.title}</h3>
                  <div className="text-gray-400 text-xs mt-1 uppercase tracking-widest flex items-center gap-3">
                    <span>Size: {item.selectedSize || 'N/A'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="text-amber-500">৳ {item.price}</span>
                  </div>
                  
                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 bg-black/40 rounded border border-white/10 px-2 py-1 w-fit">
                      <button onClick={() => updateQuantity(item.cartId, 'decrease')} className="text-gray-400 hover:text-white px-2">-</button>
                      <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 'increase')} className="text-gray-400 hover:text-white px-2">+</button>
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFromCart(item.cartId)} 
                      className="text-gray-500 hover:text-red-500 p-2 transition-colors rounded-full hover:bg-red-500/10"
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems?.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/60 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 text-white">
              <span className="uppercase tracking-widest text-sm text-gray-400">Total ({selectedItemsCount} items)</span>
              <span className="text-2xl font-medium text-amber-500">৳ {subtotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={(e) => {
                if (selectedItemsCount === 0) {
                  e.preventDefault();
                  alert("Please select at least one item to checkout.");
                } else {
                  toggleDrawer();
                }
              }}
              className={`flex justify-center items-center w-full py-4 uppercase tracking-[0.2em] font-medium rounded-lg transition-all duration-300 ${
                selectedItemsCount === 0 
                  ? 'bg-amber-800/50 text-gray-400 cursor-not-allowed' 
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30'
              }`}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}