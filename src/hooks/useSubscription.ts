import { useState, useEffect, useCallback } from 'react';
import { revenueCatService, type SubscriptionStatus, type Product } from '../services/revenueCatService';

export type SubscriptionTier = 'free' | 'pro';

export const TIER_LIMITS = {
  free: {
    gamesPerDay: 10,
    stockAccess: 'free',
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

function getStorageKey(userId: string | null): string {
  return userId ? `candle_master_subscription_${userId}` : 'candle_master_subscription';
}

/**
 * Subscription hook — lifetime model (no monthly/yearly distinction)
 * - Native (Android/iOS): RevenueCat
 * - Web/PWA: localStorage only (no payment available — drives users to mobile apps)
 */
export const useSubscription = (userId: string | null = null) => {
  const storageKey = getStorageKey(userId);

  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [gamesToday, setGamesToday] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    // Migration: clear old un-scoped keys + old subscription plan keys
    if (userId) {
      localStorage.removeItem('candle_master_subscription');
      localStorage.removeItem('candle_master_plan');
      localStorage.removeItem(`candle_master_plan_${userId}`);
    }

    setTier('free');
    setSubscriptionStatus(null);

    const initSubscription = async () => {
      if (revenueCatService.isConfigured()) {
        await revenueCatService.initialize(userId || undefined);
        if (!mounted) return;
        const status = await revenueCatService.getSubscriptionStatus();
        if (!mounted) return;
        setSubscriptionStatus(status);
        if (status.isPro) setTier('pro');
        const availableProducts = await revenueCatService.getProducts();
        if (!mounted) return;
        setProducts(availableProducts);
      } else {
        // Web fallback: localStorage only (testing helper)
        const saved = localStorage.getItem(storageKey);
        if (saved === 'pro') setTier('pro');
      }

      // Daily game counter
      if (!mounted) return;
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem(GAMES_DATE_KEY);
      if (savedDate === today) {
        const count = parseInt(localStorage.getItem(GAMES_TODAY_KEY) || '0');
        setGamesToday(count);
      } else {
        localStorage.setItem(GAMES_DATE_KEY, today);
        localStorage.setItem(GAMES_TODAY_KEY, '0');
        setGamesToday(0);
      }
    };

    initSubscription();

    return () => { mounted = false; };
  }, [userId, storageKey]);

  const limits = TIER_LIMITS[tier];
  const canPlayGame = tier === 'pro' || gamesToday < limits.gamesPerDay;

  const recordGamePlayed = useCallback(() => {
    const newCount = gamesToday + 1;
    setGamesToday(newCount);
    localStorage.setItem(GAMES_TODAY_KEY, newCount.toString());
  }, [gamesToday]);

  const hasAccess = useCallback((feature: 'chartPatterns' | 'allStocks' | 'allThemes' | 'calculator' | 'academy') => {
    if (tier === 'pro') return true;
    switch (feature) {
      case 'chartPatterns': return limits.chartPatterns;
      case 'allStocks': return limits.stockAccess === 'all';
      case 'allThemes': return false;
      case 'calculator': return false;
      case 'academy': return false;
      default: return false;
    }
  }, [tier, limits]);

  /**
   * Purchase PRO Lifetime via RevenueCat (native only)
   * Web users see "Get on App Store / Play Store" CTA instead
   */
  const purchasePro = useCallback(async (productId?: string) => {
    if (!revenueCatService.isConfigured()) {
      console.warn('[useSubscription] Purchase unavailable on web — direct user to mobile app');
      return { success: false, error: 'Please install the mobile app to upgrade to PRO' };
    }

    setIsLoading(true);
    try {
      const targetProduct = productId || products[0]?.identifier;
      if (!targetProduct) {
        return { success: false, error: 'No products available' };
      }

      const result = await revenueCatService.purchase(targetProduct);
      if (result.success) {
        setTier('pro');
        const status = await revenueCatService.getSubscriptionStatus();
        setSubscriptionStatus(status);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  const restorePurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      if (revenueCatService.isConfigured()) {
        const status = await revenueCatService.restorePurchases();
        setSubscriptionStatus(status);
        if (status.isPro) setTier('pro');
        return status.isPro;
      }
      const saved = localStorage.getItem(storageKey);
      if (saved === 'pro') { setTier('pro'); return true; }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  // Testing helpers — kept intentionally for closed testing period (remove before public release)
  const upgradeToPro = useCallback(() => {
    setTier('pro');
    localStorage.setItem(storageKey, 'pro');
  }, [storageKey]);

  const resetToFree = useCallback(() => {
    setTier('free');
    setSubscriptionStatus(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const linkUser = useCallback(async (newUserId: string) => {
    if (revenueCatService.isConfigured()) {
      await revenueCatService.login(newUserId);
      const status = await revenueCatService.getSubscriptionStatus();
      setSubscriptionStatus(status);
      if (status.isPro) setTier('pro');
    }
  }, []);

  const unlinkUser = useCallback(async () => {
    if (revenueCatService.isConfigured()) {
      await revenueCatService.logout();
    }
  }, []);

  return {
    tier,
    isPro: tier === 'pro',
    limits,
    canPlayGame,
    gamesToday,
    gamesRemaining: tier === 'pro' ? Infinity : Math.max(0, limits.gamesPerDay - gamesToday),
    recordGamePlayed,
    hasAccess,
    products,
    isLoading,
    purchasePro,
    restorePurchases,
    upgradeToPro,
    resetToFree,
    linkUser,
    unlinkUser,
    subscriptionStatus,
    purchaseDate: subscriptionStatus?.purchaseDate,
  };
};
