/**
 * Cloudflare Pages Function - Subscription Status Check
 *
 * Returns the subscription status for a given user.
 * Route: GET /api/stripe/status?userId=xxx
 * Returns: { isPro: boolean, plan: 'monthly' | 'yearly' | null, expiresAt: string | null }
 *
 * Security: Requires Firebase auth token. Validates userId matches token.
 */

import { getCorsHeaders } from '../_shared/cors';
import { isValidFirebaseUid } from '../_shared/validation';
import type { DecodedToken } from '../_shared/auth';

interface Env {
  SUBSCRIPTIONS: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = getCorsHeaders(context.request);

  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Authorization: verify userId matches authenticated user
    const authedUser = context.data.authenticatedUser as DecodedToken | null;
    if (authedUser && authedUser.uid !== userId) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Validate userId format
    if (!isValidFirebaseUid(userId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid userId format' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await context.env.SUBSCRIPTIONS.get(userId);

    if (!data) {
      return new Response(
        JSON.stringify({ isPro: false, plan: null, expiresAt: null }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const record = JSON.parse(data);

    return new Response(
      JSON.stringify({
        isPro: record.isPro || false,
        plan: record.plan || null,
        expiresAt: record.expiresAt || null,
        cancelAtPeriodEnd: record.cancelAtPeriodEnd || false,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check status' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
};
