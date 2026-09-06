const BACKEND = process.env.BACKEND_API_URL || 'http://127.0.0.1:8000/api';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${BACKEND}/published/${id}`, {
      cache: 'no-store',
      headers: { 'ngrok-skip-browser-warning': 'true' },
    });
    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    }
  } catch (err) {
    console.error(`[API /api/articles/${id}] fetch failed:`, err.message);
  }
  return Response.json(null);
}
