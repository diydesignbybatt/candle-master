import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { revenueCatService, type SubscriptionStatus, type Product } from '../services/revenueCatService';
import { createCheckoutSession, checkSubscriptionStatus as checkStripeStatus, STRIPE_PRICES } from '../services/stripeService';

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

const STORAGE_KEY = 'candle_master_subscription';
const GAMES_TODAY_KEY = 'candle_master_games_today';
const GAMES_DATE_KEY = 'candle_master_games_date';

/**
 * Subscription hook - manages free/pro access
 * Integrates with RevenueCat when configured, falls back to localStorage for testing
 */
export const useSubscription = () => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [gamesToday, setGamesToday] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  // Initialize and check subscription status
  useEffect(() => {
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
        // Web/PWA: check Stripe subscription status via Cloudflare KV
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'pro') {
          setTier('pro');
        }

        // Also verify with server if user is logged in
        const authData = localStorage.getItem('candle_master_auth');
        if (authData) {
          try {
            const user = JSON.parse(authData);
            if (user?.id && !user.id.startsWith('guest_')) {
              const stripeStatus = await checkStripeStatus(user.id);
              if (stripeStatus.isPro) {
                setTier('pro');
                localStorage.setItem(STORAGE_KEY, 'pro');
              }
            }
          } catch (e) {
            console.warn('Failed to check Stripe status:', e);
          }
        }
      } else {
        // Native without RevenueCat configured — fallback to localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
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
  }, []);

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
        localStorage.setItem(STORAGE_KEY, 'pro');
        return { success: true };
      }
    } finally {
      setIsLoading(false);
    }
  }, [products]);

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
        // Check localStorage for testing
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'pro') {
          setTier('pro');
          return true;
        }
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Purchase PRO via Stripe (Web/PWA)
   * Redirects to Stripe Checkout — user returns to app after payment
   */
  const purchaseProWeb = useCallback(async (plan: 'monthly' | 'lifetime', userId: string, email?: string | null) => {
    const priceId = plan === 'monthly' ? STRIPE_PRICES.MONTHLY : STRIPE_PRICES.LIFETIME;
    await createCheckoutSession(priceId, userId, email);
    // User is redirected to Stripe — no code runs after this
  }, []);

  /**
   * Upgrade to PRO — platform-aware
   * Web → opens Pricing Modal (handled in App.tsx)
   * Native → RevenueCat
   */
  const upgradeToPro = useCallback(() => {
    if (Capacitor.isNativePlatform() && revenueCatService.isConfigured()) {
      purchasePro();
    } else {
      // Web: mock upgrade for testing (real flow uses purchaseProWeb via Pricing Modal)
      console.log('[useSubscription] Mock upgrade to PRO');
      setTier('pro');
      localStorage.setItem(STORAGE_KEY, 'pro');
    }
  }, [purchasePro]);

  /**
   * Reset to free (for testing only)
   */
  const resetToFree = useCallback(() => {
    setTier('free');
    setSubscriptionStatus(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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
    limits,

    // Game limits
    canPlayGame,
    gamesToday,
    gamesRemaining: tier === 'pro' ? Infinity : Math.max(0, limits.gamesPerDay - gamesToday),
    recordGamePlayed,

    // Feature access
    hasAccess,

    // Purchase & Restore
    products,
    isLoading,
    purchasePro,
    purchaseProWeb,
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
