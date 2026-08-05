// src/app/page.js
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, client } from '../lib/contentful'; 
import Hero from '../components/Hero'; 
import CountdownTimer from '../components/CountdownTimer';

// 🎯 Contentful থেকে সরাসরি ইমেজ লিংক (Text List) ফেচ করার ফাংশন
async function getHeroImages() {
  try {
    const response = await client.getEntries({ content_type: 'heroSlider' }); 
    
    if (response.items && response.items.length > 0) {
      // Contentful-এর imageUrls লিস্ট সরাসরি রিটার্ন করছি
      return response.items[0].fields.imageUrls || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  const heroImages = await getHeroImages();

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-amber-500 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* 🎯 Contentful থেকে পাওয়া লিংকের লিস্ট Hero-তে পাঠানো হলো */}
        <Hero heroImages={heroImages} />
        
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center mt-12">
          <h2 className="text-amber-500 tracking-[0.3em] uppercase text-xs md:text-sm font-medium mb-4 animate-fade-in-up">
            Elevating Modern Fashion 
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-widest uppercase mb-6 drop-shadow-2xl">
            Aurelian
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl font-light mb-10 tracking-wide drop-shadow-md">
            Timeless Elegance. Redefining premium Fashion and lifestyle essentials in Bangladesh.
          </p>

          <Link 
            href="#collection" 
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-white/5 backdrop-blur-md border border-amber-600/50 overflow-hidden rounded-md transition-all duration-500 hover:border-amber-500 hover:bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.1)] hover:shadow-[0_0_30px_rgba(217,119,6,0.2)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-600/20 to-amber-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative text-white font-medium text-sm md:text-base tracking-widest uppercase group-hover:text-amber-400 transition-colors">
              Explore Collection
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="collection" className="py-24 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-3xl md:text-4xl text-white font-light tracking-[0.2em] uppercase mb-4 text-center">
              Featured Pieces
            </h2>
            <div className="w-16 h-[1px] bg-amber-600"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const { title, slug, regularPrice, salePrice, image, stockInfo, category, offerEndsAt } = product.fields;
              const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '/placeholder-image.jpg';
              
              const finalRegularPrice = regularPrice || 799;
              const finalSalePrice = salePrice || finalRegularPrice;

              let totalStock = 0;
              if (stockInfo) {
                Object.values(stockInfo).forEach((qty) => {
                  totalStock += (typeof qty === 'number' ? qty : 0);
                });
              }
              const isOutOfStock = totalStock === 0;

              return (
                <Link href={`/product/${slug}`} key={product.sys.id} className="group cursor-pointer">
                  <div className="relative glass-panel bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20 h-full flex flex-col">
                    
                    {category && (
                      <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md border border-amber-500/30 px-3 py-1.5 rounded-full text-[10px] text-amber-500 uppercase tracking-widest shadow-lg">
                        {category}
                      </div>
                    )}

                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/50">
                      <Image
                        src={imageUrl}
                        alt={title || 'Aurelian Product'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 group-hover:opacity-100'}`}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                      
                      {!isOutOfStock && offerEndsAt && (
                        <CountdownTimer offerEndsAt={offerEndsAt} />
                      )}
                      
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <span className="bg-red-900/80 border border-red-500/50 text-white px-6 py-2 rounded-md text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-t from-black/40 to-transparent">
                      <div>
                        <h3 className="text-white text-sm font-light tracking-wider uppercase mb-2 line-clamp-2 transition-colors group-hover:text-amber-400">
                          {title}
                        </h3>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-lg ${isOutOfStock ? 'text-gray-500' : 'text-amber-500'}`}>
                            ৳ {finalSalePrice}
                          </span>
                          {finalRegularPrice > finalSalePrice && !isOutOfStock && (
                            <span className="text-xs text-gray-500 line-through">
                              ৳ {finalRegularPrice}
                            </span>
                          )}
                        </div>

                        <span className={`text-xs tracking-widest uppercase flex items-center gap-1 transition-colors ${isOutOfStock ? 'text-gray-600' : 'text-gray-500 group-hover:text-white'}`}>
                          View 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

    </main>
  );
}