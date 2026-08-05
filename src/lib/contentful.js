// src/lib/contentful.js
import { createClient } from 'contentful';

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// ১. সব প্রোডাক্ট ফেচ করার জন্য 
export const getProducts = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'product', 
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching products from Contentful:", error);
    return [];
  }
};

// ২. নির্দিষ্ট স্লাগ দিয়ে একটি সিঙ্গেল প্রোডাক্ট ফেচ করা (Product Details Page এর জন্য)
export const getProductBySlug = async (slug) => {
  try {
    const entries = await client.getEntries({
      content_type: 'product',
      'fields.slug': slug, // শুধু এই স্লাগের প্রোডাক্টটি খুঁজবে
      limit: 1,
    });

    if (!entries.items || entries.items.length === 0) return null;

    const item = entries.items[0].fields;

    // 🎯 Gallery থেকে একাধিক ছবির array তৈরি করা
    let productImages = [];
    if (item.gallery && item.gallery.length > 0) {
      productImages = item.gallery.map(img => `https:${img.fields.file.url}`);
    } else if (item.image?.fields?.file?.url) {
      productImages = [`https:${item.image.fields.file.url}`];
    } else {
      productImages = ['https://placehold.co/800x1000/111111/cccccc?text=Product+Image'];
    }

    const finalRegularPrice = item.regularPrice || 799; 
    const finalSalePrice = item.salePrice || finalRegularPrice;

    // ক্লায়েন্ট কম্পোনেন্ট ঠিক যেভাবে ডেটা চাচ্ছে, সেভাবে স্ট্রাকচার করে পাঠানো হচ্ছে
    return {
      title: item.title,
      regularPrice: finalRegularPrice,
      salePrice: finalSalePrice,
      category: item.category || 'apparel',
      sizes: item.stockInfo ? Object.keys(item.stockInfo) : [],
      description: item.description,
      images: productImages, // 🎯 image এর বদলে 'images' (Array) পাঠানো হচ্ছে
      stockInfo: item.stockInfo || null,
      offerEndsAt: item.offerEndsAt || null,
      inStock: item.inStock ?? true,
      slug: item.slug,
    };
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
};

// ৩. স্ট্যাটিক পাথ জেনারেট করার জন্য সব স্লাগ ফেচ করা (generateStaticParams এর জন্য)
export const getAllProductSlugs = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'product',
      select: 'fields.slug', // পারফরম্যান্স অপটিমাইজেশন: পুরো প্রোডাক্ট না এনে শুধু স্লাগ আনবো
    });
    
    return entries.items.map((item) => item.fields.slug);
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
};

// ৪. Announcement Bar-এর ডেটা ফেচ করার ফাংশন
export const getAnnouncementHeadlines = async () => {
  try {
    const entries = await client.getEntries({
      content_type: 'announcementBar', // ⚠️ Contentful-এ Content Type ID এটাই হতে হবে
      limit: 1,
    });

    if (entries.items && entries.items.length > 0) {
      // Contentful থেকে 'headlines' ফিল্ড (List of short texts) রিটার্ন করা হচ্ছে
      return entries.items[0].fields.headlines || ["🔥 GET PREMIUM PANJABIS AT JUST 799 TAKA"];
    }
    
    // এন্ট্রি না থাকলে ডিফল্ট হেডলাইন
    return ["🔥 GET PREMIUM PANJABIS AT JUST 799 TAKA", "⚡ NEW COLLECTION OUT NOW"];
  } catch (error) {
    console.error("Error fetching announcement headlines:", error);
    return ["🔥 GET PREMIUM PANJABIS AT JUST 799 TAKA"];
  }
};