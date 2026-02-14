/**
 * Cloudflare Pages Function - Stripe Webhook Handler
 *
 * Receives Stripe webhook events and updates subscription status in KV.
 * Route: POST /api/stripe/webhook
 *
 * Events handled:
 * - checkout.session.completed → activate PRO
 * - customer.subscription.deleted → deactivate PRO (monthly cancel)
 * - customer.subscription.updated → update status (renewal, etc.)
 *
 * Security:
 * - Webhook signature verification (HMAC-SHA256)
 * - Timestamp validation (5-minute window)
 * - Idempotency via event ID tracking
 * - Reverse index for O(1) customer lookup
 */

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SUBSCRIPTIONS: KVNamespace;
}

interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      mode?: string;
      metadata?: { userId?: string; plan?: string };
      client_reference_id?: string;
      customer?: string;
      subscription?: string;
      payment_status?: string;
      status?: string;
      cancel_at_period_end?: boolean;
      current_period_end?: number;
    };
  };
}

interface SubscriptionRecord {
  isPro: boolean;
  plan: 'monthly' | 'yearly' | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  activatedAt: string;
  expiresAt: string | null;
  cancelAtPeriodEnd?: boolean;
}

// Verify Stripe webhook signature using Web Crypto API
async function verifyWebhookSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  try {
    const parts = sigHeader.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
    const signature = parts.find(p => p.startsWith('v1='))?.slice(3);

    if (!timestamp || !signature) return false;

    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > 300) return false;

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(signedPayload)
    );
    const expectedSig = Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedSig === signature;
  } catch {
    return false;
  }
}

/**
 * Look up userId by Stripe customer ID using reverse index.
 * Falls back to O(n) scan if reverse index doesn't exist yet.
 */
async function findUserByCustomerId(
  kv: KVNamespace,
  customerId: string,
): Promise<{ userId: string; record: SubscriptionRecord } | null> {
  // Fast path: reverse index lookup O(1)
  const userId = await kv.get(`stripe_customer:${customerId}`);
  if (userId) {
    const data = await kv.get(userId);
    if (data) {
      try {
        return { userId, record: JSON.parse(data) };
      } catch {
        return null;
      }
    }
  }

  // Fallback: scan KV (for records created before reverse index existed)
  const list = await kv.list();
  for (const key of list.keys) {
    // Skip reverse index keys and event tracking keys
    if (key.name.startsWith('stripe_customer:') || key.name.startsWith('stripe_event:')) {
      continue;
    }
    const data = await kv.get(key.name);
    if (data) {
      try {
        const record: SubscriptionRecord = JSON.parse(data);
        if (record.stripeCustomerId === customerId) {
          // Create reverse index for next time
          await kv.put(`stripe_customer:${customerId}`, key.name);
          return { userId: key.name, record };
        }
      } catch {
        continue;
      }
    }
  }

  return null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const payload = await context.request.text();
    const sigHeader = context.request.headers.get('stripe-signature') || '';

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(
      payload,
      sigHeader,
      context.env.STRIPE_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const event: StripeEvent = JSON.parse(payload);
    console.log(`Stripe webhook: ${event.type} (${event.id})`);

    // Idempotency: skip already-processed events
    const eventKey = `stripe_event:${event.id}`;
    const alreadyProcessed = await context.env.SUBSCRIPTIONS.get(eventKey);
    if (alreadyProcessed) {
      console.log(`Skipping duplicate event ${event.id}`);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId || session.client_reference_id;
        const plan = session.metadata?.plan as 'monthly' | 'yearly' || 'monthly';

        if (!userId) {
          console.error('No userId in checkout session');
          break;
        }

        const record: SubscriptionRecord = {
          isPro: true,
          plan,
          stripeCustomerId: session.customer || null,
          stripeSubscriptionId: session.subscription || null,
          activatedAt: new Date().toISOString(),
          expiresAt: null, // Expiry managed by Stripe for both monthly and yearly
        };

        await context.env.SUBSCRIPTIONS.put(userId, JSON.stringify(record));

        // Create reverse index: customerId -> userId (O(1) lookup)
        if (session.customer) {
          await context.env.SUBSCRIPTIONS.put(
            `stripe_customer:${session.customer}`,
            userId,
          );
        }

        console.log(`PRO activated for user ${userId} (${plan})`);
        break;
      }

      case 'customer.subscription.deleted': {
        // Monthly subscription cancelled/expired
        const subscription = event.data.object;
        const customerId = subscription.customer;

        if (customerId) {
          const result = await findUserByCustomerId(
            context.env.SUBSCRIPTIONS,
            customerId,
          );

          if (result) {
            result.record.isPro = false;
            result.record.plan = null;
            result.record.stripeSubscriptionId = null;
            await context.env.SUBSCRIPTIONS.put(
              result.userId,
              JSON.stringify(result.record),
            );
            console.log(
              `PRO deactivated for user ${result.userId} (subscription deleted)`,
            );
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status;
        const customerId = subscription.customer;

        if (customerId) {
          const result = await findUserByCustomerId(
            context.env.SUBSCRIPTIONS,
            customerId,
          );

          if (result) {
            // Track cancel_at_period_end (user cancelled but sub still active until period end)
            if (subscription.cancel_at_period_end !== undefined) {
              result.record.cancelAtPeriodEnd = subscription.cancel_at_period_end;
            }

            // Update expiresAt from current_period_end
            if (subscription.current_period_end) {
              result.record.expiresAt = new Date(
                subscription.current_period_end * 1000,
              ).toISOString();
            }

            // If subscription becomes active (e.g., payment succeeded after failed)
            if (status === 'active') {
              result.record.isPro = true;
            }

            await context.env.SUBSCRIPTIONS.put(
              result.userId,
              JSON.stringify(result.record),
            );
            console.log(
              `Subscription updated for user ${result.userId}: status=${status}, cancelAtPeriodEnd=${result.record.cancelAtPeriodEnd}`,
            );
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark event as processed (TTL 24 hours to prevent KV bloat)
    await context.env.SUBSCRIPTIONS.put(eventKey, 'processed', {
      expirationTtl: 86400,
    });

    // Always return 200 to Stripe to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
