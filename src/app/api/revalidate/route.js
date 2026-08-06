import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // সিক্রেট টোকেন চেক করা (যাতে অন্য কেউ আপনার সাইট আপডেট করতে না পারে)
    const secret = request.headers.get('x-revalidate-secret');
    
    if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
    }

    // পুরো ওয়েবসাইটের ক্যাশ ক্লিয়ার করে নতুন ডেটা ফেচ করা
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, time: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}