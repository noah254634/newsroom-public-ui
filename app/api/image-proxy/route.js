/**
 * Image Proxy API Route
 * 
 * Fetches backend-uploaded images server-side so they work from any client
 * (phone via ngrok, remote browsers, etc.) without exposing localhost URLs.
 * 
 * Usage: /api/image-proxy?url=http://127.0.0.1:8000/uploads/file.jpg
 */

import { NextResponse } from 'next/server';
import { getBackendUrl } from '../../../lib/api';

function getBackendBaseUrl() {
  const apiUrl = getBackendUrl();
  return apiUrl.replace(/\/api\/?$/, '');
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Allow proxying image URLs over http or https
  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return new NextResponse('Invalid URL protocol', { status: 400 });
  }

  try {
    const res = await fetch(imageUrl, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    });
  } catch (e) {
    console.error('[image-proxy] fetch failed:', e.message);
    return new NextResponse('Failed to fetch image', { status: 502 });
  }
}
