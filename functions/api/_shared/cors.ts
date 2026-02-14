/**
 * CORS Utility
 *
 * Returns proper CORS headers based on request origin.
 * Only allows whitelisted origins instead of wildcard (*).
 */

const ALLOWED_ORIGINS = [
  'https://app.candlemaster.app',
  'https://candlemaster.app',
  'http://localhost:5173', // Vite dev server
  'http://localhost:8788', // Wrangler pages dev
  'capacitor://localhost', // Capacitor Android/iOS
  'http://localhost', // Capacitor fallback
];

/**
 * Get CORS headers for the given request.
 * Checks the Origin header against the allowlist.
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]; // Default to production domain

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
