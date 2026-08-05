// src/app/faq/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'FAQ | Aurelian',
  description: 'Frequently asked questions about Aurelian products and policies.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Orders inside Dhaka are typically delivered within 1 to 2 business days. Deliveries outside Dhaka usually take 3 to 5 business days, depending on your exact location."
    },
    {
      question: "What are your delivery charges?",
      answer: "We charge ৳70 for deliveries inside Dhaka and ৳110 for deliveries anywhere else in Bangladesh."
    },
    {
      question: "How can I find my Panjabi size?",
      answer: "Each of our product pages includes a detailed size chart in the description. We highly recommend measuring your chest and length and comparing it with our chart before placing an order."
    },
    {
      question: "Do you have a physical store?",
      answer: "Currently, Aurelian operates exclusively online to bring you premium Panjabis directly at the best prices. You can place your orders through our website."
    },
    {
      question: "Can I exchange my item if it doesn't fit?",
      answer: "Yes, we accept size exchanges within 3 days of delivery, provided the item is unworn, unwashed, and has all original tags attached. Please check our Returns & Exchanges page for full details."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach out to us via email at talhabelal62@gmail.com, call us at +8801987573397, or send us a message on our official Facebook or Instagram pages."
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-panel p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-amber-500/30 transition-colors"
            >
              <h3 className="text-lg text-white font-medium tracking-wide mb-4">
                {faq.question}
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center glass-panel p-10 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl text-white tracking-widest uppercase mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-8 text-sm">Our support team is always here to help you out.</p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-amber-600/20">
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  );
}