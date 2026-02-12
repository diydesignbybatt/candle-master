/**
 * Cloudflare Pages Function - Stripe Customer Portal
 *
 * Creates a Stripe Billing Portal session so users can manage/cancel subscriptions.
 * Route: POST /api/stripe/portal
 * Body: { userId: string }
 * Returns: { url: string }
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  SUBSCRIPTIONS: KVNamespace;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      userId: string;
    };

    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Look up stripeCustomerId from KV
    const data = await context.env.SUBSCRIPTIONS.get(userId);

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const record = JSON.parse(data);

    if (!record.stripeCustomerId) {
      return new Response(
        JSON.stringify({ error: 'No Stripe customer found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Determine return URL (same pattern as checkout.ts)
    const origin = new URL(context.request.url).origin;
    const appUrl = origin.includes('localhost')
      ? origin
      : 'https://app.candlemaster.app';

    // Create Stripe Billing Portal session via REST API
    const params = new URLSearchParams();
    params.append('customer', record.stripeCustomerId);
    params.append('return_url', appUrl);

    const stripeResponse = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeResponse.json() as { url?: string; error?: { message: string } };

    if (!stripeResponse.ok || !session.url) {
      console.error('Stripe Portal error:', session.error?.message);
      return new Response(
        JSON.stringify({ error: session.error?.message || 'Failed to create portal session' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );

  } catch (error) {
    console.error('Portal error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
