/**
 * Stripe Service — Frontend API calls for PWA payment
 *
 * ใช้สำหรับ web/PWA เท่านั้น (native ใช้ RevenueCat)
 * Secret key อยู่ใน Cloudflare Worker — ไม่มีใน frontend code
 */

// Price IDs (live mode) — public keys safe to expose
export const STRIPE_PRICES = {
  MONTHLY: 'price_1SzX9500THgK6a8eMmajk8sQ',
  YEARLY: 'price_1SzX9X00THgK6a8eQ6GfnYnn',
} as const;

export interface SubscriptionStatus {
  isPro: boolean;
  plan: 'monthly' | 'yearly' | null;
  expiresAt: string | null;
  cancelAtPeriodEnd?: boolean;
}

/**
 * Build request headers with optional auth token.
 */
function buildHeaders(idToken?: string | null): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }
  return headers;
}

/**
 * สร้าง Stripe Checkout Session แล้ว redirect ไปหน้าชำระเงิน
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  email?: string | null,
  idToken?: string | null
): Promise<void> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: buildHeaders(idToken),
    body: JSON.stringify({
      priceId,
      userId,
      email: email || undefined,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((error as { error: string }).error || 'Failed to create checkout session');
  }

  const { url } = await res.json() as { url: string };

  if (url) {
    window.location.href = url;
  } else {
    throw new Error('No checkout URL returned');
  }
}

/**
 * ตรวจสถานะ subscription จาก Cloudflare KV
 */
export async function checkSubscriptionStatus(
  userId: string,
  idToken?: string | null
): Promise<SubscriptionStatus> {
  try {
    const headers: Record<string, string> = {};
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }

    const res = await fetch(`/api/stripe/status?userId=${userId}`, { headers });

    if (!res.ok) {
      console.warn('Failed to check subscription status:', res.status);
      return { isPro: false, plan: null, expiresAt: null };
    }

    return await res.json() as SubscriptionStatus;
  } catch (error) {
    console.warn('Subscription status check failed:', error);
    return { isPro: false, plan: null, expiresAt: null };
  }
}

/**
 * สร้าง Stripe Customer Portal session เพื่อจัดการ/ยกเลิก subscription
 * Return URL สำหรับ redirect ไป Stripe Portal
 */
export async function createPortalSession(
  userId: string,
  idToken?: string | null
): Promise<string> {
  const res = await fetch('/api/stripe/portal', {
    method: 'POST',
    headers: buildHeaders(idToken),
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((error as { error: string }).error || 'Failed to create portal session');
  }

  const { url } = await res.json() as { url: string };

  if (!url) {
    throw new Error('No portal URL returned');
  }

  return url;
}
