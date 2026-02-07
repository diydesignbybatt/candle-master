/**
 * Stripe Service — Frontend API calls for PWA payment
 *
 * ใช้สำหรับ web/PWA เท่านั้น (native ใช้ RevenueCat)
 * Secret key อยู่ใน Cloudflare Worker — ไม่มีใน frontend code
 */

// Price IDs (test mode) — public keys safe to expose
export const STRIPE_PRICES = {
  MONTHLY: 'price_1Sy1nW16LYJ3RyorkLS7LxMG',
  LIFETIME: 'price_1Sy1oM16LYJ3Ryorh9we4HXg',
} as const;

export interface SubscriptionStatus {
  isPro: boolean;
  plan: 'monthly' | 'lifetime' | null;
  expiresAt: string | null;
}

/**
 * สร้าง Stripe Checkout Session แล้ว redirect ไปหน้าชำระเงิน
 */
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  email?: string | null
): Promise<void> {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
export async function checkSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    const res = await fetch(`/api/stripe/status?userId=${userId}`);

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
