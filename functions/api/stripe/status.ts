/**
 * Cloudflare Pages Function - Subscription Status Check
 *
 * Returns the subscription status for a given user.
 * Route: GET /api/stripe/status?userId=xxx
 * Returns: { isPro: boolean, plan: 'monthly' | 'yearly' | null, expiresAt: string | null }
 */

interface Env {
  SUBSCRIPTIONS: KVNamespace;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const data = await context.env.SUBSCRIPTIONS.get(userId);

    if (!data) {
      return new Response(
        JSON.stringify({ isPro: false, plan: null, expiresAt: null }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const record = JSON.parse(data);

    return new Response(
      JSON.stringify({
        isPro: record.isPro || false,
        plan: record.plan || null,
        expiresAt: record.expiresAt || null,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );

  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check status' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
