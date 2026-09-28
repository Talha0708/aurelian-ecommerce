// src/app/page.js
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, client } from '../lib/contentful'; 
import Hero from '../components/Hero'; 
import CountdownTimer from '../components/CountdownTimer';

async function getHeroImages() {
  try {
    const response = await client.getEntries({ content_type: 'heroSlider' }); 
    
    if (response.items && response.items.length > 0) {
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

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.fields.category || 'Exclusive Collection'; 
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-amber-500 selection:text-black">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        <Hero heroImages={heroImages} />
        
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center mt-12">
          {/* 🎯 Updated Premium Sub-heading */}
          <h2 className="text-amber-500 tracking-[0.3em] uppercase text-xs md:text-sm font-medium mb-4 animate-fade-in-up">
            The Art of Modern Elegance
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-widest uppercase mb-6 drop-shadow-2xl">
            Aurelian
          </h1>
          {/* 🎯 Updated Premium Description */}
          <p className="text-gray-300 text-base md:text-lg max-w-2xl font-light mb-10 tracking-wide drop-shadow-md">
            Meticulously crafted apparel blending heritage with contemporary design. Redefining premium lifestyle in Bangladesh.
          </p>

          <Link 
            href="#collection" 
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-white/5 backdrop-blur-md border border-amber-600/50 overflow-hidden rounded-md transition-all duration-500 hover:border-amber-500 hover:bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.1)] hover:shadow-[0_0_30px_rgba(217,119,6,0.2)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-600/20 to-amber-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            {/* 🎯 Updated Button Text */}
            <span className="relative text-white font-medium text-sm md:text-base tracking-widest uppercase group-hover:text-amber-400 transition-colors">
              Discover the Collection
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section id="collection" className="py-20 px-4 md:px-12 lg:px-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col items-center mb-16 sm:mb-20">
            {/* 🎯 Updated Section Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-amber-500 font-light tracking-[0.2em] uppercase mb-3 text-center">
              Signature Collections
            </h2>
            {/* 🎯 Updated Section Subtitle */}
            <p className="text-gray-400 font-light tracking-wider text-[10px] sm:text-sm uppercase text-center">
              Masterfully crafted pieces for the modern wardrobe
            </p>
          </div>

          {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
            <div key={categoryName} className="mb-20 last:mb-0">
              
              <div className="flex flex-col items-start mb-8 sm:mb-10 border-b border-white/10 pb-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-light tracking-[0.15em] uppercase">
                  {categoryName}
                </h3>
                <div className="w-12 sm:w-16 h-[2px] bg-amber-600 mt-3 sm:mt-4"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
                {categoryProducts.map((product) => {
                  const { title, slug, regularPrice, salePrice, image, stockInfo, offerEndsAt } = product.fields;
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
                        
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/50">
                          <Image
                            src={imageUrl}
                            alt={title || 'Aurelian Product'}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-40 grayscale' : 'opacity-90 group-hover:opacity-100'}`}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                          
                          {!isOutOfStock && offerEndsAt && (
                            <CountdownTimer offerEndsAt={offerEndsAt} />
                          )}
                          
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <span className="bg-red-900/80 border border-red-500/50 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs uppercase tracking-[0.2em] backdrop-blur-sm">
                                Sold Out
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 sm:p-6 flex flex-col flex-grow justify-between bg-gradient-to-t from-black/40 to-transparent">
                          <div>
                            <h3 className="text-white text-[11px] sm:text-sm font-light tracking-wider uppercase mb-1.5 sm:mb-2 line-clamp-2 transition-colors group-hover:text-amber-400">
                              {title}
                            </h3>
                          </div>
                          <div className="mt-2 sm:mt-4 flex items-center justify-between">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                              <span className={`font-medium text-sm sm:text-lg ${isOutOfStock ? 'text-gray-500' : 'text-amber-500'}`}>
                                ৳ {finalSalePrice}
                              </span>
                              {finalRegularPrice > finalSalePrice && !isOutOfStock && (
                                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                  ৳ {finalRegularPrice}
                                </span>
                              )}
                            </div>

                            <span className={`hidden sm:flex text-[10px] sm:text-xs tracking-widest uppercase items-center gap-1 transition-colors ${isOutOfStock ? 'text-gray-600' : 'text-gray-500 group-hover:text-white'}`}>
                              Discover 
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          ))}

        </div>
      </section>

    </main>
  );
}