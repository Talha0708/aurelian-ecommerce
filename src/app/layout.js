// src/app/layout.js
import ClientWrapper from "../components/ClientWrapper";
import Footer from "../components/Footer";
import AnnouncementBar from "../components/AnnouncementBar";
import Script from 'next/script';
import "./globals.css";

// 🎯 Contentful থেকে ডেটা আনার ফাংশন ইমপোর্ট
import { getAnnouncementHeadlines } from "../lib/contentful"; 

export const metadata = {
  // 🎯 আপনার আসল ডোমেইন নাম এখানে বসাবেন (যেমন: https://aurelian.com.bd)
  metadataBase: new URL('https://www.aurelian.com'), 
  title: {
    default: 'Aurelian | Premium Menswear & Timepieces',
    template: '%s | Aurelian'
  },
  description: 'Discover Aurelian, redefining premium Panjabis and classic timepieces for the modern gentleman in Bangladesh. Timeless elegance meets modern craftsmanship.',
  openGraph: {
    title: 'Aurelian | Premium Menswear & Timepieces',
    description: 'Redefining premium Panjabis and classic timepieces for the modern gentleman in Bangladesh.',
    url: 'https://www.aurelian.com',
    siteName: 'Aurelian',
    images: [
      {
        url: '/opengraph-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'Aurelian Premium Collection Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurelian | Premium Menswear & Timepieces',
    description: 'Redefining premium Panjabis and classic timepieces in Bangladesh.',
    images: ['/opengraph-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({ children }) {
  // 🎯 সার্ভার সাইডে হেডলাইনগুলো ফেচ করা হচ্ছে
  const headlines = await getAnnouncementHeadlines();

  return (
    // 🎯 Next.js এর Warning দূর করতে data-scroll-behavior="smooth" যোগ করা হলো
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        {/* META PIXEL BASE CODE */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1518042049641368');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased flex flex-col min-h-screen">
        
        {/* GOOGLE ANALYTICS (GA4) BASE CODE */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-B3DYEV4SQ0`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-B3DYEV4SQ0', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* 🎯 Contentful থেকে পাওয়া ডেটা প্রপস হিসেবে পাঠানো হলো */}
        <AnnouncementBar headlines={headlines} />

        <ClientWrapper>
          {children}
        </ClientWrapper>
        
        <Footer />
        
      </body>
    </html>
  );
}