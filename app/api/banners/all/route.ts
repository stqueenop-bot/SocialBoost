import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/** GET /api/banners/all — returns all banners (including inactive) for admin use */
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/banners/all`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('[API /banners/all] Error:', error);
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  }
}
