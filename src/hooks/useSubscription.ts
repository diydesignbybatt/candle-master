import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { revenueCatService, type SubscriptionStatus, type Product } from '../services/revenueCatService';
import { createCheckoutSession, checkSubscriptionStatus as checkStripeStatus, createPortalSession, STRIPE_PRICES } from '../services/stripeService';

// Subscription tiers
export type SubscriptionTier = 'free' | 'pro';

// Feature limits for each tier
export const TIER_LIMITS = {
  free: {
    gamesPerDay: 10,
    stockAccess: 'free', // Only stocks in 'free' tier
    candlePatterns: 10,
    chartPatterns: false,
    themes: ['sandstone'],
    historyLimit: 5,
  },
  pro: {
    gamesPerDay: Infinity,
    stockAccess: 'all',
    candlePatterns: 20,
    chartPatterns: true,
    themes: ['sandstone', 'midnight', 'solarized'],
    historyLimit: Infinity,
  },
} as const;

const GAMES_TODAY_KEY = 'candle_master_games_today';
const GAMES_DATE_KEY = 'candle_master_games_date';

/**
 * Per-user storage keys — scoped by userId to prevent PRO leaking across accounts
 */
function getStorageKey(userId: string | null): string {
  return userId ? `candle_master_subscription_${userId}` : 'candle_master_subscription';
}
function getPlanStorageKey(userId: string | null): string {
  return userId ? `candle_master_plan_${userId}` : 'candle_master_plan';
}

/**
 * Subscription hook - manages free/pro access
 * Integrates with RevenueCat when configured, falls back to localStorage for testing
 *
 * @param userId - Current user ID (from AuthContext). Subscription status is scoped per-user.
 * @param getIdToken - Optional function to get Firebase ID token for authenticated API calls.
 */
export const useSubscription = (userId: string | null = null, getIdToken?: () => Promise<string | null>) => {
  // Derive storage keys from userId
  const storageKey = getStorageKey(userId);
  const planStorageKey = getPlanStorageKey(userId);

  // One-time migration: move old un-scoped keys to per-user keys
  if (userId) {
    const oldSub = localStorage.getItem('candle_master_subscription');
    const oldPlan = localStorage.getItem('candle_master_plan');
    if (oldSub === 'pro' && !localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, oldSub);
      if (oldPlan) localStorage.setItem(planStorageKey, oldPlan);
    }
    // Clean up old un-scoped keys
    localStorage.removeItem('candle_master_subscription');
    localStorage.removeItem('candle_master_plan');
  }

  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [proPlan, setProPlan] = useState<'monthly' | 'yearly' | null>(() => {
    const key = getPlanStorageKey(userId);
    const saved = localStorage.getItem(key);
    // Migrate old 'lifetime' to 'yearly'
    if (saved === 'lifetime') {
      localStorage.setItem(key, 'yearly');
      return 'yearly';
    }
    return saved === 'monthly' || saved === 'yearly' ? saved : null;
  });
  const [gamesToday, setGamesToday] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  // Initialize and check subscription status — re-runs when userId changes
  useEffect(() => {
    // Reset state when user changes (prevents PRO leaking across accounts)
    setTier('free');
    setProPlan(null);
    setSubscriptionStatus(null);

    const initSubscription = async () => {
      // Check RevenueCat if configured
      if (revenueCatService.isConfigured()) {
        await revenueCatService.initialize();
        const status = await revenueCatService.getSubscriptionStatus();
        setSubscriptionStatus(status);
        if (status.isPro) {
          setTier('pro');
        }

        // Load available products
        const availableProducts = await revenueCatService.getProducts();
        setProducts(availableProducts);
      } else if (!Capacitor.isNativePlatform()) {
        // Web/PWA: check per-user subscription status from localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved === 'pro') {
          setTier('pro');
        }
        // Restore plan type
        const savedPlan = localStorage.getItem(planStorageKey);
        if (savedPlan === 'monthly' || savedPlan === 'yearly') {
          setProPlan(savedPlan);
        }

        // Also verify with server if user is logged in (not guest)
        if (userId && !userId.startsWith('guest_')) {
          try {
            const token = getIdToken ? await getIdToken() : null;
            const stripeStatus = await checkStripeStatus(userId, token);
            if (stripeStatus.isPro) {
              setTier('pro');
              localStorage.setItem(storageKey, 'pro');
              if (stripeStatus.plan) {
                setProPlan(stripeStatus.plan);
                localStorage.setItem(planStorageKey, stripeStatus.plan);
              }
            }
          } catch (e) {
            console.warn('Failed to check Stripe status:', e);
          }
        }
      } else {
        // Native without RevenueCat configured — fallback to per-user localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved === 'pro') {
          setTier('pro');
        }
      }

      // Load games played today
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem(GAMES_DATE_KEY);

      if (savedDate === today) {
        const count = parseInt(localStorage.getItem(GAMES_TODAY_KEY) || '0');
        setGamesToday(count);
      } else {
        // New day, reset counter
        localStorage.setItem(GAMES_DATE_KEY, today);
        localStorage.setItem(GAMES_TODAY_KEY, '0');
        setGamesToday(0);
      }
    };

    initSubscription();
  }, [userId, storageKey, planStorageKey]);

  // Get current limits
  const limits = TIER_LIMITS[tier];

  // Check if can play more games today
  const canPlayGame = tier === 'pro' || gamesToday < limits.gamesPerDay;

  // Increment game counter
  const recordGamePlayed = useCallback(() => {
    const newCount = gamesToday + 1;
    setGamesToday(newCount);
    localStorage.setItem(GAMES_TODAY_KEY, newCount.toString());
  }, [gamesToday]);

  // Check feature access
  const hasAccess = useCallback((feature: 'chartPatterns' | 'allStocks' | 'allThemes' | 'calculator' | 'academy') => {
    if (tier === 'pro') return true;

    switch (feature) {
      case 'chartPatterns':
        return limits.chartPatterns;
      case 'allStocks':
        return limits.stockAccess === 'all';
      case 'allThemes':
        return false;
      case 'calculator':
        return false; // PRO only
      case 'academy':
        return false; // PRO only
      default:
        return false;
    }
  }, [tier, limits]);

  /**
   * Purchase PRO subscription
   * Uses RevenueCat if configured, otherwise mock for testing
   */
  const purchasePro = useCallback(async (productId?: string) => {
    setIsLoading(true);

    try {
      if (revenueCatService.isConfigured()) {
        // Real purchase via RevenueCat
        const targetProduct = productId || products[0]?.identifier;
        if (!targetProduct) {
          console.error('No product available for purchase');
          return { success: false, error: 'No products available' };
        }

        const result = await revenueCatService.purchase(targetProduct);

        if (result.success) {
          setTier('pro');
          const status = await revenueCatService.getSubscriptionStatus();
          setSubscriptionStatus(status);
        }

        return result;
      } else {
        // Mock purchase for testing
        console.log('[useSubscription] Mock purchase - RevenueCat not configured');
        setTier('pro');
        localStorage.setItem(storageKey, 'pro');
        return { success: true };
      }
    } finally {
      setIsLoading(false);
    }
  }, [products, storageKey]);

  /**
   * Restore previous purchases
   */
  const restorePurchases = useCallback(async () => {
    setIsLoading(true);

    try {
      if (revenueCatService.isConfigured()) {
        const status = await revenueCatService.restorePurchases();
        setSubscriptionStatus(status);
        if (status.isPro) {
          setTier('pro');
        }
        return status.isPro;
      } else {
        // Check per-user localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved === 'pro') {
          setTier('pro');
          return true;
        }
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  /**
   * Purchase PRO via Stripe (Web/PWA)
   * Redirects to Stripe Checkout — user returns to app after payment
   */
  const purchaseProWeb = useCallback(async (plan: 'monthly' | 'yearly', userId: string, email?: string | null) => {
    const priceId = plan === 'monthly' ? STRIPE_PRICES.MONTHLY : STRIPE_PRICES.YEARLY;
    const token = getIdToken ? await getIdToken() : null;
    await createCheckoutSession(priceId, userId, email, token);
    // User is redirected to Stripe — no code runs after this
  }, [getIdToken]);

  /**
   * Open subscription management — platform-aware
   * Web → Stripe Customer Portal
   * Android → Google Play subscription management
   * iOS → Apple subscription management
   */
  const openManageSubscription = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      if (platform === 'android') {
        window.open('https://play.google.com/store/account/subscriptions', '_blank');
      } else if (platform === 'ios') {
        window.open('https://apps.apple.com/account/subscriptions', '_blank');
      }
      return;
    }

    // Web/PWA: Stripe Customer Portal
    if (!userId || userId.startsWith('guest_')) {
      console.warn('[useSubscription] Cannot open portal: no userId');
      return;
    }

    setIsLoading(true);
    try {
      const token = getIdToken ? await getIdToken() : null;
      const url = await createPortalSession(userId, token);
      window.location.href = url;
    } catch (error) {
      console.error('[useSubscription] Failed to open subscription portal:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getIdToken]);

  /**
   * Upgrade to PRO — testing helper (mock toggle, no real purchase)
   * Always uses localStorage regardless of platform
   */
  const upgradeToPro = useCallback(() => {
    console.log('[useSubscription] Test upgrade to PRO (mock)');
    setTier('pro');
    localStorage.setItem(storageKey, 'pro');
  }, [storageKey]);

  /**
   * Reset to free (for testing only)
   */
  const resetToFree = useCallback(() => {
    setTier('free');
    setProPlan(null);
    setSubscriptionStatus(null);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(planStorageKey);
  }, [storageKey, planStorageKey]);

  /**
   * Link user account for subscription sync
   */
  const linkUser = useCallback(async (userId: string) => {
    if (revenueCatService.isConfigured()) {
      await revenueCatService.login(userId);
      // Refresh subscription status after linking
      const status = await revenueCatService.getSubscriptionStatus();
      setSubscriptionStatus(status);
      if (status.isPro) {
        setTier('pro');
      }
    }
  }, []);

  /**
   * Unlink user (logout from RevenueCat)
   */
  const unlinkUser = useCallback(async () => {
    if (revenueCatService.isConfigured()) {
      await revenueCatService.logout();
    }
  }, []);

  return {
    // Tier info
    tier,
    isPro: tier === 'pro',
    proPlan,
    limits,

    // Game limits
    canPlayGame,
    gamesToday,
    gamesRemaining: tier === 'pro' ? Infinity : Math.max(0, limits.gamesPerDay - gamesToday),
    recordGamePlayed,

    // Feature access
    hasAccess,

    // Purchase & Restore & Manage
    products,
    isLoading,
    purchasePro,
    purchaseProWeb,
    openManageSubscription,
    restorePurchases,

    // Testing helpers (remove in production)
    upgradeToPro,
    resetToFree,

    // User linking
    linkUser,
    unlinkUser,

    // Subscription details
    subscriptionStatus,
    expirationDate: subscriptionStatus?.expirationDate,
    willRenew: subscriptionStatus?.willRenew,
  };
};
