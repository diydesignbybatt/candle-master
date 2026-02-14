/**
 * Cloudflare Pages Function - Stripe Checkout Session
 *
 * Creates a Stripe Checkout Session for PRO subscription.
 * Route: POST /api/stripe/checkout
 * Body: { priceId: string, userId: string, email?: string }
 * Returns: { url: string }
 *
 * Security: Requires Firebase auth token. Validates userId matches token.
 */

import { getCorsHeaders } from '../_shared/cors';
import { isValidFirebaseUid } from '../_shared/validation';
import type { DecodedToken } from '../_shared/auth';

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_PRO_MONTHLY_PRICE_ID: string;
  STRIPE_PRO_YEARLY_PRICE_ID: string;
  SUBSCRIPTIONS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = getCorsHeaders(context.request);

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

    // Validate priceId against allowed values
    const allowedPriceIds = [
      context.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      context.env.STRIPE_PRO_YEARLY_PRICE_ID,
    ];
    if (!allowedPriceIds.includes(priceId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid price ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Determine mode based on price ID
    const isMonthly = priceId === context.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    const mode = 'subscription'; // Both monthly and yearly are subscriptions now
    const plan = isMonthly ? 'monthly' : 'yearly';

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
        JSON.stringify({ error: 'Failed to create checkout session. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async (context) => {
  return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
};
