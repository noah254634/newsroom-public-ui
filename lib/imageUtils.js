/**
 * Rewrites backend upload URLs (http://localhost:8000/uploads/..., relative /uploads/..., local IPs)
 * to go through the Next.js image proxy so phones/remote devices can load them without trying
 * to connect to 127.0.0.1 on the phone itself (which hangs infinitely).
 */
export function resolveImageUrl(url) {
  if (!url) return null;
  
  // Handle relative upload paths e.g. "/uploads/img.jpg" or "uploads/img.jpg"
  if (typeof url === 'string' && (url.startsWith('/uploads/') || url.startsWith('uploads/'))) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    const fullBackendUrl = `http://127.0.0.1:8000${cleanPath}`;
    return `/api/image-proxy?url=${encodeURIComponent(fullBackendUrl)}`;
  }

  try {
    const parsed = new URL(url);
    const host = parsed.host; // e.g. "127.0.0.1:8000", "localhost:8000", "192.168.x.x:8000", "0.0.0.0:8000"
    
    // Check if URL points to backend port 8000 or contains /uploads/
    const isBackendHost = host.includes(':8000') || host === 'localhost' || host === '127.0.0.1';
    const isUploadPath = parsed.pathname.includes('/uploads/');
    
    if (isBackendHost || isUploadPath) {
      // Standardize target to 127.0.0.1:8000 for server-side Next.js fetch proxy
      const targetUrl = `http://127.0.0.1:8000${parsed.pathname}${parsed.search}`;
      return `/api/image-proxy?url=${encodeURIComponent(targetUrl)}`;
    }
  } catch {
    // Malformed URL — return as-is
  }
  return url;
}

