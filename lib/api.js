/**
 * Public API module for Ugatuzi Terminal.
 * 
 * Supports both:
 * 1. Server Component direct fetching with ISR (revalidate: 30s) for lightning fast TTFB.
 * 2. Client Component proxy fetching (/api/*) for interactive actions.
 */

export function getBackendUrl() {
  let raw = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://127.0.0.1:8000/api';
  raw = raw.trim().replace(/\/+$/, '');
  if (!raw.endsWith('/api')) {
    raw += '/api';
  }
  return raw;
}

// ── SERVER-SIDE FETCHING (Used in React Server Components for 0ms loads) ──

export async function fetchArticlesServer(status = 'PUBLISHED', revalidateSec = 30) {
  try {
    const backend = getBackendUrl();
    const url = status && status !== 'ALL'
      ? `${backend}/published?status=${status}`
      : `${backend}/published`;

    const res = await fetch(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'UgatuziTerminal/1.0',
      },
      next: { revalidate: revalidateSec },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const seen = new Set();
      return (data || []).filter(art => {
        const key = (art.headline || art.title || '').toLowerCase().trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
  } catch (e) {
    console.error('[Server Fetch] fetchArticlesServer failed:', e.message);
  }
  return [];
}

export async function fetchArticleByIdServer(articleId, revalidateSec = 30) {
  try {
    const backend = getBackendUrl();
    const res = await fetch(`${backend}/published/${articleId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'UgatuziTerminal/1.0',
      },
      next: { revalidate: revalidateSec },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(`[Server Fetch] fetchArticleByIdServer(${articleId}) failed:`, e.message);
  }
  return null;
}


// ── CLIENT-SIDE FETCHING (Used in Client Components) ──

export const fetchArticles = async (status = 'PUBLISHED') => {
  try {
    const url = status && status !== 'ALL'
      ? `/api/articles?status=${status}`
      : `/api/articles`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('fetchArticles failed:', e);
  }
  return [];
};

export const fetchArticleById = async (articleId) => {
  try {
    const res = await fetch(`/api/articles/${articleId}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(`fetchArticleById(${articleId}) failed:`, e);
  }
  return null;
};

export const vectorSearch = async (query, limit = 6) => {
  try {
    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('vectorSearch failed:', e);
  }
  return { results: [] };
};

export const fetchProvenanceTree = async (articleId) => {
  try {
    const res = await fetch(`/api/provenance/${articleId}`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(`fetchProvenanceTree(${articleId}) failed:`, e);
  }
  return null;
};
