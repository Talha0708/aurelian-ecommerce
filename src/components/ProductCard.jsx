// src/components/ProductCard.jsx
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Contentful-এর স্ট্রাকচার অনুযায়ী ডেটা ডিস্ট্রাকচারিং 
  const { title, price, slug, image } = product.fields;
  const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : '/placeholder.jpg';

  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-amber-600/50 transition-all duration-500 shadow-lg hover:shadow-amber-600/20">
      
      {/* Product Image Section */}
      <div className="relative h-80 w-full overflow-hidden bg-black/40">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500"></div>
      </div>

      {/* Product Info Section */}
      <div className="p-6 text-center flex flex-col items-center">
        <h3 className="text-xl font-light text-white mb-2 tracking-wide">{title}</h3>
        <p className="text-amber-500 text-lg mb-6 font-medium">৳ {price}</p>
        
        <Link
          href={`/product/${slug}`}
          className="w-full inline-block border border-white/20 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}