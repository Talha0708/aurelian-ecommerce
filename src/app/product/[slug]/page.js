// src/app/product/[slug]/page.js
import { notFound } from 'next/navigation';
import { createClient } from 'contentful';
// 🎯 @ এর বদলে রিলেটিভ পাথ ব্যবহার করা হলো
import ProductClient from '../../../components/ProductClient'; 

export const revalidate = 60; 

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

function extractPlainText(richText) {
  if (typeof richText === 'string') return richText; 
  if (!richText || !richText.content) return ''; 
  
  return richText.content
    .map(node => {
      if (node.content) {
        return node.content.map(textNode => textNode.value || '').join('');
      }
      return '';
    })
    .join('\n'); 
}

async function getProduct(slug) {
  try {
    const res = await client.getEntries({
      content_type: 'product', 
      'fields.slug': slug,
      limit: 1,
    });
    
    if (res.items.length === 0) return null;
    return res.items[0];
  } catch (error) {
    console.error("Error fetching product from Contentful:", error);
    return null;
  }
}

// 🎯 রিলেটেড প্রোডাক্ট ফেচ করার জন্য নতুন ফাংশন
async function getRelatedProducts(category, currentSlug) {
  if (!category) return [];
  try {
    const res = await client.getEntries({
      content_type: 'product',
      'fields.category': category,
      'fields.slug[ne]': currentSlug, // বর্তমান প্রোডাক্ট বাদ দিয়ে অন্যগুলো আনবে
      limit: 4, // সাজেশনে সর্বোচ্চ ৪টি প্রোডাক্ট দেখাবে
    });
    return res.items;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productItem = await getProduct(slug);

  if (!productItem) {
    return {
      title: 'Product Not Found | Aurelian',
      description: 'The requested product could not be found.',
    };
  }

  const { title, description, image, gallery } = productItem.fields;
  const plainDescription = extractPlainText(description);
  
  // 🎯 Metadata-র জন্য gallery-র প্রথম ছবি অথবা image ব্যবহার করা হচ্ছে
  let imageUrl = 'https://placehold.co/800x1000/111111/cccccc?text=Product+Image';
  if (gallery && gallery.length > 0) {
    imageUrl = `https:${gallery[0].fields.file.url}`;
  } else if (image?.fields?.file?.url) {
    imageUrl = `https:${image.fields.file.url}`;
  }

  return {
    title: `${title} | Aurelian`,
    description: plainDescription || 'Premium quality apparel and accessories by Aurelian.',
    openGraph: {
      title: `${title} | Aurelian`,
      description: plainDescription || 'Premium quality apparel and accessories by Aurelian.',
      images: [imageUrl],
    },
  };
}

export default async function ProductDetails({ params }) {
  const { slug } = await params;
  const productItem = await getProduct(slug);

  if (!productItem) {
    notFound(); 
  }

  const { 
    title, 
    regularPrice,
    salePrice,
    offerEndsAt,
    stockInfo,
    category, 
    description, 
    image,
    gallery // 🎯 নতুন তৈরি করা gallery (Media, many files) ফিল্ড যুক্ত করা হলো
  } = productItem.fields;

  const productCategory = category ? category.toLowerCase() : 'apparel';

  let formattedSizes = [];
  if (productCategory === 'apparel' && stockInfo) {
    formattedSizes = Object.keys(stockInfo); 
  }

  const finalRegularPrice = regularPrice || 799; 
  const finalSalePrice = salePrice || finalRegularPrice; 
  const discountAmount = finalRegularPrice - finalSalePrice;

  // 🎯 Gallery থেকে একাধিক ছবির array তৈরি করা
  let productImages = [];
  if (gallery && gallery.length > 0) {
    productImages = gallery.map(img => `https:${img.fields.file.url}`);
  } else if (image?.fields?.file?.url) {
    // যদি গ্যালারি না থাকে, তবে পুরনো সিঙ্গেল ইমেজটাই Array-তে রাখবে
    productImages = [`https:${image.fields.file.url}`]; 
  } else {
    productImages = ['https://placehold.co/800x1000/111111/cccccc?text=Product+Image'];
  }

  const currentProduct = {
    slug: slug,
    title: title || 'AURELIAN EXCLUSIVE',
    regularPrice: finalRegularPrice,
    salePrice: finalSalePrice,
    discountAmount: discountAmount > 0 ? discountAmount : 0,
    offerEndsAt: offerEndsAt || null,
    category: productCategory,
    sizes: formattedSizes, 
    stockInfo: stockInfo || null, 
    description: extractPlainText(description) || '', 
    images: productImages, // 🎯 image এর বদলে 'images' array পাঠানো হচ্ছে জুম গ্যালারির জন্য
  };

  // 🎯 Related Products ফরম্যাট করে তৈরি করা
  const relatedItems = await getRelatedProducts(category, slug);
  const relatedProductsFormatted = relatedItems.map(item => {
    const relImage = item.fields.image?.fields?.file?.url ? `https:${item.fields.image.fields.file.url}` : 'https://placehold.co/800x1000/111111/cccccc?text=Product+Image';
    const relFinalRegular = item.fields.regularPrice || 799;
    return {
      title: item.fields.title,
      slug: item.fields.slug,
      salePrice: item.fields.salePrice || relFinalRegular,
      image: relImage
    };
  });

  // 🎯 ProductClient-এ product এবং relatedProducts দুটোই পাঠানো হলো
  return <ProductClient product={currentProduct} relatedProducts={relatedProductsFormatted} />;
}