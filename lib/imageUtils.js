import { getBackendUrl } from './api';

function getBackendBaseUrl() {
  const apiUrl = getBackendUrl();
  return apiUrl.replace(/\/api\/?$/, '');
}

/**
 * Rewrites backend upload URLs (http://localhost:8000/uploads/..., relative /uploads/..., local IPs)
 * to go through the Next.js image proxy so phones/remote devices can load them without trying
 * to connect to 127.0.0.1 on the phone itself (which hangs infinitely).
 */
export function resolveImageUrl(url) {
  if (!url) return null;
  
  // Local Next.js public static assets (e.g. /nairobi_skyline.png, /central_bank.png) return as-is
  if (typeof url === 'string' && (url.startsWith('/') || !url.startsWith('http')) && !url.includes('/uploads/')) {
    return url;
  }

  const backendBase = getBackendBaseUrl();

  // Handle relative upload paths e.g. "/uploads/img.jpg" or "uploads/img.jpg"
  if (typeof url === 'string' && (url.startsWith('/uploads/') || url.startsWith('uploads/'))) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    const fullBackendUrl = `${backendBase}${cleanPath}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullBackendUrl)}`;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.host;

    // Direct Cloudflare R2 S3 URLs pass straight through directly
    if (host.endsWith('.r2.dev') || host.includes('r2.cloudflarestorage.com')) {
      return url;
    }
    
    // Check if URL points to backend host, local port 8000, or contains /uploads/
    let baseHost = '';
    try { baseHost = new URL(backendBase).host; } catch {}

    const isBackendHost = baseHost && host === baseHost;
    const isUploadPath = parsed.pathname.includes('/uploads/');
    
    if (isBackendHost || isUploadPath) {
      const targetUrl = `${backendBase}${parsed.pathname}${parsed.search}`;
      return `/api/image-proxy?url=${encodeURIComponent(targetUrl)}`;
    }
  } catch {
    // Malformed or relative URL — return as-is
  }
  return url;
}


