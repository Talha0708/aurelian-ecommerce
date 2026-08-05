// src/components/Footer.jsx
"use client";

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-32 md:pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Top Section: Newsletter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-white/10 pb-12 mb-12 gap-8">
          <div className="max-w-md text-left">
            <h3 className="text-xl md:text-2xl text-white font-light tracking-[0.2em] uppercase mb-3">
              Join The Aurelian Club
            </h3>
            <p className="text-gray-400 text-sm font-light tracking-wide">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
          </div>
          <div className="w-full lg:w-auto flex-1 max-w-lg">
            <form className="flex relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-l-md focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-600 placeholder:tracking-widest placeholder:text-xs"
                required
              />
              <button 
                type="submit"
                className="bg-amber-600 text-white px-8 py-4 rounded-r-md text-xs font-medium uppercase tracking-[0.2em] hover:bg-amber-700 transition-colors shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start text-left">
            <h2 className="text-2xl md:text-3xl text-white font-light tracking-[0.3em] uppercase mb-6">
              Aurelian
            </h2>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Redefining premium fashion and lifestyle essentials in Bangladesh. Timeless elegance for the modern individual.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex flex-col items-start text-left">
            <h4 className="text-white text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Explore
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light">
              <li><Link href="/" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Home</Link></li>
              <li><Link href="/#collection" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Latest Collection</Link></li>
              {/* 🎯 এখানে /about এর জায়গায় /our-story করে দেওয়া হয়েছে */}
              <li><Link href="/our-story" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Our Story</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-span-1 flex flex-col items-start text-left">
            <h4 className="text-white text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light">
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">FAQ</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start text-left">
            <h4 className="text-white text-xs font-medium tracking-[0.2em] uppercase mb-6">
              Connect
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light mb-6">
              <li><a href="https://www.facebook.com/aurelianwaves" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Facebook</a></li>
              <li><a href="https://instagram.com/aurelian" target="_blank" rel="noreferrer" className="hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">Instagram</a></li>
            </ul>
            <div className="flex flex-col items-start gap-3">
              <a href="tel:01987573397" className="text-gray-400 hover:text-amber-500 text-xs tracking-widest transition-colors">
                +88 01987573397
              </a>
              <a href="mailto:talhabelal62@gmail.com" className="text-gray-400 hover:text-amber-500 text-xs tracking-widest transition-colors lowercase">
                talhabelal62@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Developer Credit */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-gray-600 uppercase tracking-widest font-light gap-6 relative z-10">
          <div className="flex-1 text-center lg:text-left">
            <p>&copy; {new Date().getFullYear()} AURELIAN. All Rights Reserved.</p>
          </div>
          
          <div className="flex-1 text-center">
            <p>
              Developed by{' '}
              <a 
                href="tel:01987573397" 
                className="text-amber-600 font-medium tracking-[0.2em] hover:text-amber-500 hover:underline underline-offset-4 transition-all duration-300 relative z-20"
                title="Call Developer"
              >
                Talha Belal
              </a>
            </p>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end gap-6">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}