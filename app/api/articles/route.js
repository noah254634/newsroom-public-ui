import { getBackendUrl } from '../../../lib/api';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');

  const backend = getBackendUrl();
  const url = status && status !== 'ALL'
    ? `${backend}/published?status=${status}`
    : `${backend}/published`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'UgatuziTerminal/1.0',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    } else {
      console.error(`[API /api/articles] Backend status ${res.status} calling: ${url}`);
    }
  } catch (err) {
    console.error('[API /api/articles] fetch error calling:', url, err.message);
  }
  return Response.json([]);
}
