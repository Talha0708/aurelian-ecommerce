// src/app/terms/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Aurelian',
  description: 'Terms and conditions for shopping at Aurelian.',
};

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-4">
            Terms of Service
          </h1>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-10 text-gray-300 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">1. Overview</h2>
            <p>
              This website is operated by Aurelian. Throughout the site, the terms "we", "us" and "our" refer to Aurelian. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">2. Products and Pricing</h2>
            <p>
              We have made every effort to display as accurately as possible the colors and images of our Panjabis that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate. Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">3. Accuracy of Billing and Account Information</h2>
            <p>
              We reserve the right to refuse any order you place with us. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and phone number, so that we can complete your transactions and contact you as needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">4. Limitation of Liability</h2>
            <p>
              In no case shall Aurelian, our directors, officers, employees, or affiliates be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind arising from your use of any of the service or any products procured using the service.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}