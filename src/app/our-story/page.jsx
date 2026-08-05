// src/app/our-story/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Our Story | Aurelian',
  description: 'Discover the story behind Aurelian - Redefining premium Panjabis and classic timepieces for the modern gentleman in Bangladesh.',
};

export default function OurStoryPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-5xl font-light text-white tracking-[0.3em] uppercase mb-6">
            The Aurelian Story
          </h1>
          <div className="w-20 h-[1px] bg-amber-600 mx-auto"></div>
          <p className="mt-8 text-gray-400 tracking-widest uppercase text-sm font-light">
            Crafting Elegance • Defining Time
          </p>
        </div>

        {/* Story Content */}
        <div className="glass-panel p-8 md:p-16 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl space-y-20">
          
          {/* Section 1: The Genesis */}
          <section className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl text-white tracking-[0.2em] uppercase mb-6 font-medium">
                The Genesis
              </h2>
              <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base text-justify">
                Founded in October 2025, Aurelian was born out of a profound appreciation for classic menswear and a desire to elevate it for the modern era. We noticed a distinct gap in the market for attire that truly balances uncompromising quality with an accessible premium feel. Aurelian was created to bridge that gap, starting with our signature line of meticulously crafted Panjabis that celebrate both heritage and contemporary style.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border border-white/10 rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>

          {/* Section 2: The Evolution (Adding Watches) */}
          <section className="flex flex-col md:flex-row-reverse gap-10 items-center">
            <div className="flex-1 text-center md:text-right">
              <h2 className="text-2xl text-white tracking-[0.2em] uppercase mb-6 font-medium">
                Beyond Attire: The Evolution
              </h2>
              <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base text-justify md:text-right">
                As our journey progressed, we realized that a gentleman's ensemble is never truly complete without the perfect timepiece. A watch is more than just a tool to tell time; it is a reflection of character, punctuality, and refined taste. This realization led to the expansion of the Aurelian portfolio. Today, alongside our premium Panjabis, we proudly offer a curated collection of classic watches designed to perfectly complement your attire and elevate your everyday presence.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="flex justify-center">
            <div className="w-8 h-8 border border-white/10 rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            </div>
          </div>

          {/* Section 3: The Craftsmanship */}
          <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl text-white tracking-[0.2em] uppercase mb-6 font-medium">
              Uncompromising Craftsmanship
            </h2>
            <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
              Whether it is the breathable, carefully selected fabric of our Panjabis or the precise engineering and elegant dials of our watches, our commitment to craftsmanship remains unwavering. We believe that true luxury lies in the subtleties—the perfect stitch, the ideal drape, the weight of a watch on your wrist, and the feeling of absolute confidence when you step into a room. 
            </p>
          </section>

          {/* Section 4: Our Vision */}
          <section className="text-center max-w-3xl mx-auto bg-black/20 p-8 md:p-12 rounded-2xl border border-white/5">
            <h2 className="text-xl md:text-2xl text-amber-500 tracking-[0.2em] uppercase mb-6 font-medium">
              Our Vision
            </h2>
            <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
              Our vision is simple yet ambitious: to be the definitive destination for men's lifestyle and fashion in Bangladesh. We are constantly innovating, refining our designs, and ensuring our platforms provide a seamless, world-class shopping experience. When you choose Aurelian, you are not just making a purchase; you are embracing a lifestyle of timeless elegance.
            </p>
          </section>

          {/* Call to Action */}
          <div className="pt-12 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-8 tracking-wider uppercase">
              Experience the craftsmanship for yourself.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                href="/#panjabis" 
                className="px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium uppercase tracking-[0.2em] rounded transition-all duration-300 shadow-[0_0_20px_rgba(217,119,6,0.2)] hover:shadow-[0_0_30px_rgba(217,119,6,0.4)]"
              >
                Shop Panjabis
              </Link>
              <Link 
                href="/#watches" 
                className="px-10 py-4 bg-transparent border border-white/20 hover:border-amber-500 hover:text-amber-500 text-white text-xs font-medium uppercase tracking-[0.2em] rounded transition-all duration-300"
              >
                Explore Watches
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}