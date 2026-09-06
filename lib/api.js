/**
 * Public API module for Ugatuzi Terminal.
 * 
 * Supports both:
 * 1. Server Component direct fetching with ISR (revalidate: 30s) for lightning fast TTFB.
 * 2. Client Component proxy fetching (/api/*) for interactive actions.
 */

export function getBackendUrl() {
  const isDev = process.env.ENVIRONMENT === 'dev' || process.env.NODE_ENV === 'development';
  let raw = isDev
    ? (process.env.DEV_BACKEND_URL || process.env.NEXT_PUBLIC_DEV_BACKEND_URL || process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL)
    : (process.env.PROD_BACKEND_URL || process.env.BACKEND_URL || process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL);

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return '';
  }

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
      signal: AbortSignal.timeout(15000),
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
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(`[Server Fetch] fetchArticleByIdServer(${articleId}) failed:`, e.message);
  }
  return null;
}


// ── CLIENT-SIDE FETCHING (Used in Client Components with Direct Fallback) ──

export const fetchArticles = async (status = 'PUBLISHED') => {
  try {
    const url = status && status !== 'ALL'
      ? `/api/articles?status=${status}`
      : `/api/articles`;
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('[Client Fetch] /api/articles proxy failed, trying direct backend...', e);
  }

  try {
    const backend = getBackendUrl();
    const directUrl = status && status !== 'ALL'
      ? `${backend}/published?status=${status}`
      : `${backend}/published`;
    const directRes = await fetch(directUrl, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });
    if (directRes.ok) return await directRes.json();
  } catch (e) {
    console.error('[Client Fetch] Direct fetchArticles failed:', e);
  }

  return [];
};

export const fetchArticleById = async (articleId) => {
  try {
    const res = await fetch(`/api/articles/${articleId}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (e) {
    console.warn(`[Client Fetch] /api/articles/${articleId} proxy failed, trying direct backend...`, e);
  }

  try {
    const backend = getBackendUrl();
    const directRes = await fetch(`${backend}/published/${articleId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });
    if (directRes.ok) return await directRes.json();
  } catch (e) {
    console.error(`[Client Fetch] Direct fetchArticleById(${articleId}) failed:`, e);
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
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.results) && data.results.length > 0) return data;
    }
  } catch (e) {
    console.warn('[Client Fetch] /api/search proxy failed, trying direct backend...', e);
  }

  try {
    const backend = getBackendUrl();
    const directRes = await fetch(`${backend}/knowledge/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ query, limit }),
      cache: 'no-store',
    });
    if (directRes.ok) return await directRes.json();
  } catch (e) {
    console.error('[Client Fetch] Direct vectorSearch failed:', e);
  }

  return { results: [] };
};

export const fetchProvenanceTree = async (articleId) => {
  try {
    const res = await fetch(`/api/provenance/${articleId}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (e) {
    console.warn(`[Client Fetch] /api/provenance/${articleId} proxy failed, trying direct backend...`, e);
  }

  try {
    const backend = getBackendUrl();
    const directRes = await fetch(`${backend}/knowledge/provenance/${articleId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      cache: 'no-store',
    });
    if (directRes.ok) return await directRes.json();
  } catch (e) {
    console.error(`[Client Fetch] Direct fetchProvenanceTree(${articleId}) failed:`, e);
  }

  return null;
};
