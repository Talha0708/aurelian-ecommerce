// src/app/privacy/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Aurelian',
  description: 'How Aurelian collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-4">
            Privacy Policy
          </h1>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-10 text-gray-300 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">1. Information We Collect</h2>
            <p>
              When you visit Aurelian, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. This includes:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>Personal Information:</strong> Name, billing address, shipping address, email address, and phone number.</li>
              <li><strong>Device Information:</strong> Web browser version, IP address, time zone, cookie information, and how you interact with the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">2. How We Use Your Information</h2>
            <p>
              We use your personal Information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">3. Tracking Technologies & Marketing</h2>
            <p>
              We use standard tracking technologies like Google Analytics and Meta (Facebook) Pixel to understand how our customers use the Site and to deliver targeted advertisements. These tools may collect your IP address and browser behavior to help us optimize your shopping experience and measure the success of our marketing campaigns.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">4. Data Security</h2>
            <p>
              We implement reasonable security practices and procedures to help protect your personal information from unauthorized access, use, alteration, or disclosure. However, please remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">5. Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:talhabelal62@gmail.com" className="text-amber-500 hover:underline">talhabelal62@gmail.com</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}