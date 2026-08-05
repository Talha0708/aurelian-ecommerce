// src/app/shipping/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Shipping Policy | Aurelian',
  description: 'Shipping and delivery information for Aurelian orders across Bangladesh.',
};

export default function ShippingPolicy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-4">
            Shipping Policy
          </h1>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-10 text-gray-300 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">Order Processing</h2>
            <p>
              All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation. You will receive another notification when your order has shipped. 
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">Domestic Shipping Rates & Estimates</h2>
            <p className="mb-4">We offer reliable and fast delivery across Bangladesh. Shipping charges for your order will be calculated and displayed at checkout.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white text-sm uppercase tracking-wider">
                    <th className="py-3 pr-4 font-medium">Delivery Zone</th>
                    <th className="py-3 px-4 font-medium">Estimated Delivery Time</th>
                    <th className="py-3 pl-4 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/5">
                    <td className="py-4 pr-4">Inside Dhaka</td>
                    <td className="py-4 px-4">1 - 2 Business Days</td>
                    <td className="py-4 pl-4 text-right text-amber-500 font-medium">৳ 70</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4">Outside Dhaka</td>
                    <td className="py-4 px-4">3 - 5 Business Days</td>
                    <td className="py-4 pl-4 text-right text-amber-500 font-medium">৳ 110</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">Order Tracking</h2>
            <p>
              Once your order has been dispatched, our delivery partner will contact you directly via the phone number provided during checkout. For any urgent updates regarding your Panjabi delivery, you can always reach out to our support team.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">Have more questions?</p>
            <Link href="/contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest rounded transition-colors border border-white/10">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}