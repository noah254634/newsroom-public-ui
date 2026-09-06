/**
 * Image Proxy API Route
 * 
 * Fetches backend-uploaded images server-side so they work from any client
 * (phone via ngrok, remote browsers, etc.) without exposing localhost URLs.
 * 
 * Usage: /api/image-proxy?url=http://127.0.0.1:8000/uploads/file.jpg
 */

import { NextResponse } from 'next/server';

const BACKEND_BASE = process.env.BACKEND_API_URL
  ? process.env.BACKEND_API_URL.replace('/api', '')
  : 'http://127.0.0.1:8000';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Security: allow proxying backend upload URLs
  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  const host = parsedUrl.host || '';
  const isBackend = host.includes(':8000') || host === 'localhost' || host === '127.0.0.1' || parsedUrl.pathname.includes('/uploads/');
  if (!isBackend) {
    return new NextResponse('Forbidden: external image hosts not allowed', { status: 403 });
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
