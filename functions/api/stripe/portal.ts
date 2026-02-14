/**
 * Cloudflare Pages Function - Stripe Customer Portal
 *
 * Creates a Stripe Billing Portal session so users can manage/cancel subscriptions.
 * Route: POST /api/stripe/portal
 * Body: { userId: string }
 * Returns: { url: string }
 *
 * Security: Requires Firebase auth token. Validates userId matches token.
 */

import { getCorsHeaders } from '../_shared/cors';
import { isValidFirebaseUid } from '../_shared/validation';
import type { DecodedToken } from '../_shared/auth';

interface Env {
  STRIPE_SECRET_KEY: string;
  SUBSCRIPTIONS: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = getCorsHeaders(context.request);

  try {
    const body = await context.request.json() as {
      userId: string;
    };

    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
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

    // Look up stripeCustomerId from KV
    const data = await context.env.SUBSCRIPTIONS.get(userId);

    if (!data) {
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const record = JSON.parse(data);

    if (!record.stripeCustomerId) {
      return new Response(
        JSON.stringify({ error: 'No Stripe customer found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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
        JSON.stringify({ error: 'Failed to create portal session. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Portal error:', error);
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
