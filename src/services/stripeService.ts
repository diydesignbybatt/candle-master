/**
 * Stripe Service — Frontend API calls for PWA payment
 *
 * ใช้สำหรับ web/PWA เท่านั้น (native ใช้ RevenueCat)
 * Secret key อยู่ใน Cloudflare Worker — ไม่มีใน frontend code
 */

// Price IDs (live mode) — public keys safe to expose
export const STRIPE_PRICES = {
  USD: {
    MONTHLY: 'price_1SzX9500THgK6a8eMmajk8sQ',
    YEARLY: 'price_1SzX9X00THgK6a8eQ6GfnYnn',
  },
  THB: {
    MONTHLY: 'price_1T0Zxj00THgK6a8eOrAd2QU5',
    YEARLY: 'price_1T0ZyZ00THgK6a8e3M13GCnH',
  },
} as const;

export type StripeCurrency = 'USD' | 'THB';

/**
 * ตรวจ locale ของ user แล้วเลือก currency ที่เหมาะสม
 * ถ้า locale เป็น th หรือ th-TH → ใช้ THB, ไม่งั้นใช้ USD
 */
export function detectCurrency(): StripeCurrency {
  try {
    const lang = navigator.language || navigator.languages?.[0] || '';
    if (lang.startsWith('th')) return 'THB';
  } catch { /* fallback */ }
  return 'USD';
}

/**
 * ข้อมูลราคาสำหรับแสดงผลใน UI
 */
export const PRICE_DISPLAY = {
  USD: {
    monthly: { price: '$3.99', period: '/mo', original: '$4.99', symbol: '$' },
    yearly: { price: '$19.99', period: '/yr', original: '$47.88', symbol: '$' },
  },
  THB: {
    monthly: { price: '฿139', period: '/mo', original: '฿179', symbol: '฿' },
    yearly: { price: '฿690', period: '/yr', original: '฿1,668', symbol: '฿' },
  },
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
