/**
 * Next.js API proxy for /api/featured
 * Fetches featured articles from the FastAPI backend server-side.
 */

import { NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/published/featured`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NextResponse.json([], { status: res.status });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[/api/featured] fetch failed:', e.message);
    return NextResponse.json([]);
  }
}
