// src/app/api/order/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, deliveryZone, district, thana, address, cartItems, totalAmount } = body;

    // শুধুমাত্র Environment Variables থেকে টোকেন নেওয়া হচ্ছে
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // টোকেন মিসিং থাকলে সিকিউরিটি চেক
    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Telegram credentials are missing in environment variables.");
      return NextResponse.json(
        { success: false, error: "Server Configuration Error: Missing API Keys" }, 
        { status: 500 }
      );
    }

    let productsList = "";
    cartItems.forEach((item, index) => {
      productsList += `\n${index + 1}. *${item.title}*\n   - Size: \`${item.selectedSize || 'N/A'}\`\n   - Quantity: \`${item.quantity || 1}\`\n   - Price: \`৳${item.price}\`\n`;
    });

    const message = `🛍️ *NEW ORDER - AURELIAN* 🛍️\n\n` +
      `👤 *CUSTOMER INFORMATION*\n` +
      `• *Full Name:* ${name}\n` +
      `• *Phone Number:* \`${phone}\`\n` +
      `• *Delivery Zone:* ${deliveryZone || 'N/A'}\n` +
      `• *District / Zilla:* ${district || 'N/A'}\n` +
      `• *Thana / Upazila:* ${thana || 'N/A'}\n` +
      `• *Detailed Address:* ${address || 'N/A'}\n\n` +
      `📦 *ORDER SUMMARY*` +
      `${productsList}\n` +
      `💰 *Total Amount:* *৳${totalAmount}*`;

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error("Telegram API Error:", telegramData);
      return NextResponse.json(
        { success: false, error: "Failed to send telegram notification" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("Order API Server Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}