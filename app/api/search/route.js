import { getBackendUrl } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const backend = getBackendUrl();
    const res = await fetch(`${backend}/knowledge/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    }
  } catch (err) {
    console.error('[API /api/search] fetch failed:', err.message);
  }
  return Response.json({ results: [] });
}
