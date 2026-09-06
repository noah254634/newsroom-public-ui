const BACKEND = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND}/knowledge/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!res.ok) {
      return Response.json(
        { error: `Backend returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error('[API /api/search] fetch failed:', err.message);
    return Response.json({ error: 'Failed to reach backend' }, { status: 503 });
  }
}
