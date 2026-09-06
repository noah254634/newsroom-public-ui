/**
 * Next.js API proxy for /api/featured
 * Fetches featured articles from the FastAPI backend server-side.
 */

import { NextResponse } from 'next/server';
import { getBackendUrl } from '../../../lib/api';

export async function GET() {
  try {
    const backend = getBackendUrl();
    const res = await fetch(`${backend}/published/featured`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (e) {
    console.error('[/api/featured] fetch failed:', e.message);
  }
  return NextResponse.json([]);
}
