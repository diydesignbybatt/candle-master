/**
 * Cloudflare Pages Function - Stripe Checkout Session
 *
 * Creates a Stripe Checkout Session for PRO subscription.
 * Route: POST /api/stripe/checkout
 * Body: { priceId: string, userId: string, email?: string }
 * Returns: { url: string }
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_PRO_MONTHLY_PRICE_ID: string;
  STRIPE_PRO_LIFETIME_PRICE_ID: string;
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
      priceId: string;
      userId: string;
      email?: string;
    };

    const { priceId, userId, email } = body;

    if (!priceId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing priceId or userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Determine mode based on price ID
    const isSubscription = priceId === context.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    const mode = isSubscription ? 'subscription' : 'payment';
    const plan = isSubscription ? 'monthly' : 'lifetime';

    // Determine base URL for redirects
    const origin = new URL(context.request.url).origin;
    const appUrl = origin.includes('localhost')
      ? origin
      : 'https://app.candlemaster.app';

    // Create Stripe Checkout Session via REST API (no SDK needed in Workers)
    const params = new URLSearchParams();
    params.append('mode', mode);
    params.append('success_url', `${appUrl}/?stripe=success&session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${appUrl}/?stripe=cancel`);
    params.append('line_items[0][price]', priceId);
    params.append('line_items[0][quantity]', '1');
    params.append('metadata[userId]', userId);
    params.append('metadata[plan]', plan);
    params.append('client_reference_id', userId);

    if (email) {
      params.append('customer_email', email);
    }

    // Allow promotional codes for discount campaigns
    params.append('allow_promotion_codes', 'true');

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeResponse.json() as { url?: string; error?: { message: string } };

    if (!stripeResponse.ok || !session.url) {
      console.error('Stripe error:', session.error?.message);
      return new Response(
        JSON.stringify({ error: session.error?.message || 'Failed to create checkout session' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
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
