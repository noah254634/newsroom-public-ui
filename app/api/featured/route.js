/**
 * Next.js API proxy for /api/featured
 * Fetches featured articles from the FastAPI backend server-side.
 */

import { NextResponse } from 'next/server';
import { getBackendUrl } from '../../../lib/api';

export async function GET() {
  try {
    const backend = getBackendUrl();
    const url = `${backend}/published/featured`;
    const res = await fetch(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'UgatuziTerminal/1.0',
      },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      console.error(`[/api/featured] Backend status ${res.status} calling: ${url}`);
    }
  } catch (e) {
    console.error('[/api/featured] fetch error calling:', e.message);
  }
  return NextResponse.json([]);
}
