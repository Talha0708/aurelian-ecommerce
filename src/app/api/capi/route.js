// src/app/api/capi/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { eventName, eventData, url } = body;

    // তোমার .env ফাইল থেকে Pixel ID এবং Access Token নিবে
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error("Missing META_PIXEL_ID or META_ACCESS_TOKEN in environment variables");
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    // 🎯 ব্রাউজার থেকে ক্লায়েন্টের IP এবং User Agent সংগ্রহ করা
    const clientIpAddress = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '0.0.0.0';
    const clientUserAgent = req.headers.get('user-agent') || '';

    // 🎯 কুকি থেকে Facebook-এর fbp এবং fbc সংগ্রহ করা
    const cookieHeader = req.headers.get('cookie') || '';
    const fbpMatch = cookieHeader.match(/_fbp=([^;]+)/);
    const fbcMatch = cookieHeader.match(/_fbc=([^;]+)/);
    
    const fbp = fbpMatch ? fbpMatch[1] : undefined;
    const fbc = fbcMatch ? fbcMatch[1] : undefined;

    // Facebook Conversions API-তে পাঠানোর জন্য ডাটা পে-লোড
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000), // বর্তমান সময় (Unix timestamp)
          action_source: 'website',
          event_source_url: url,
          user_data: {
            client_ip_address: clientIpAddress,
            client_user_agent: clientUserAgent,
            ...(fbp && { fbp }),
            ...(fbc && { fbc }),
          },
          custom_data: {
            currency: 'BDT',
            value: eventData.value || 0,
            content_name: eventData.content_name,
            content_ids: eventData.content_ids,
            content_type: 'product',
          },
        },
      ],
    };

    // Facebook Graph API-তে রিকোয়েস্ট পাঠানো
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.error) {
      console.error('Meta CAPI Error:', result.error);
      return NextResponse.json({ error: 'CAPI Request Failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, result }, { status: 200 });

  } catch (error) {
    console.error('CAPI Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}