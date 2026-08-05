// src/app/returns/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Exchanges | Aurelian',
  description: 'Learn about Aurelian’s return and exchange policies.',
};

export default function ReturnsPolicy() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light text-white tracking-[0.2em] uppercase mb-4">
            Returns & Exchanges
          </h1>
          <div className="w-16 h-[1px] bg-amber-600 mx-auto"></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl space-y-10 text-gray-300 font-light leading-relaxed">
          
          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">Our Promise</h2>
            <p>
              At Aurelian, we take pride in the quality and craftsmanship of our Panjabis. If you are not entirely satisfied with your purchase, we are here to help. We accept returns and exchanges within 3 days of order delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">Conditions for Returns</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The item must be unused, unwashed, and in the same condition that you received it.</li>
              <li>The item must have original tags attached and be in the original packaging.</li>
              <li>A receipt or proof of purchase is required.</li>
              <li>Items purchased during promotional sales (e.g., discounted items) are strictly non-refundable and non-exchangeable unless there is a manufacturing defect.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl text-white tracking-widest uppercase mb-4 font-medium">How to Request an Exchange</h2>
            <p className="mb-4">
              To initiate a return or size exchange, please follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Contact our customer service team at <a href="mailto:talhabelal62@gmail.com" className="text-amber-500 hover:underline">talhabelal62@gmail.com</a> or message us on our official Facebook/Instagram page within 3 days of receiving your item.</li>
              <li>Provide your order number and the reason for the return/exchange.</li>
              <li>Once approved, you will be instructed on how to send the package back to us.</li>
            </ol>
            <p className="mt-4 text-sm text-gray-400">
              * Please note: Customers are responsible for paying their own shipping costs for returning items. Shipping costs are non-refundable.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">Ready to shop again?</p>
            <Link href="/" className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs uppercase tracking-widest rounded transition-colors shadow-lg">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}