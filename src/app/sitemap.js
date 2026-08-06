// src/app/sitemap.js
import { getProducts } from "../lib/contentful"; 

export default async function sitemap() {
  const baseUrl = 'https://aurelian-ecommerce.vercel.app/';

  const staticRoutes = [
    '',
    '/our-story',
    '/faq',
    '/shipping-policy',
    '/returns-exchanges',
    '/privacy-policy',
    '/terms-conditions'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dynamicRoutes = [];
  
  try {
    const products = await getProducts(); 
    
    if (products && products.length > 0) {
      // 🎯 ফিল্টার করে শুধু সেই প্রোডাক্টগুলো নেওয়া হচ্ছে যেগুলোর slug আছে
      dynamicRoutes = products
        .filter((product) => product.slug || (product.fields && product.fields.slug))
        .map((product) => {
          // 🎯 Contentful-এর স্ট্রাকচার অনুযায়ী সঠিক slug বের করার লজিক
          const slug = product.slug || product.fields.slug;

          return {
            url: `${baseUrl}/product/${slug}`,
            lastModified: new Date(product.sys?.updatedAt || new Date()).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.9,
          };
        });
    }
  } catch (error) {
    console.error("Sitemap Generation Error: Contentful থেকে প্রোডাক্ট আনতে সমস্যা হয়েছে।", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}