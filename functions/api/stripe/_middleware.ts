/**
 * Authentication Middleware for Stripe API endpoints
 *
 * Runs before all /api/stripe/* handlers.
 * - Skips auth for OPTIONS (CORS preflight) and webhook (uses Stripe signature)
 * - Verifies Firebase ID token from Authorization header
 * - Attaches decoded user to context.data for downstream handlers
 *
 * Deploy strategy:
 *   Phase 1 (soft enforcement): Log warning but allow unauthenticated requests
 *   Phase 2 (hard enforcement): Change SOFT_ENFORCEMENT to false to reject
 */

import { verifyFirebaseToken } from '../_shared/auth';

// Set to false after frontend is updated to send auth tokens
const SOFT_ENFORCEMENT = true;

export const onRequest: PagesFunction = async (context) => {
  // Skip auth for CORS preflight
  if (context.request.method === 'OPTIONS') {
    return context.next();
  }

  // Skip auth for webhook (uses its own Stripe signature verification)
  const url = new URL(context.request.url);
  if (url.pathname.endsWith('/webhook')) {
    return context.next();
  }

  // Verify Firebase ID token
  const authHeader = context.request.headers.get('Authorization');
  const decoded = await verifyFirebaseToken(authHeader);

  if (!decoded) {
    if (SOFT_ENFORCEMENT) {
      // Soft enforcement: log warning but allow through
      console.warn(
        `[AUTH] Unauthenticated request to ${url.pathname} from ${context.request.headers.get('cf-connecting-ip')}`,
      );
      context.data.authenticatedUser = null;
      return context.next();
    }

    // Hard enforcement: reject unauthenticated requests
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Attach authenticated user to context for downstream handlers
  context.data.authenticatedUser = decoded;
  return context.next();
};
