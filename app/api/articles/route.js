const BACKEND = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');

  const url = status && status !== 'ALL'
    ? `${BACKEND}/published?status=${status}`
    : `${BACKEND}/published`;

  try {
    const res = await fetch(url, { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } });
    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    }
  } catch (err) {
    console.error('[API /api/articles] fetch failed:', err.message);
  }
  return Response.json([]);
}
