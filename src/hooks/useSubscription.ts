import { useState, useEffect, useCallback } from 'react';
import { revenueCatService, type SubscriptionStatus, type Product } from '../services/revenueCatService';

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
      } else {
        // Fallback to localStorage for testing
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
   * Mock upgrade for testing (when RevenueCat not configured)
   */
  const upgradeToPro = useCallback(() => {
    if (revenueCatService.isConfigured()) {
      // If RevenueCat is configured, use purchasePro instead
      purchasePro();
    } else {
      // Mock upgrade for testing
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
