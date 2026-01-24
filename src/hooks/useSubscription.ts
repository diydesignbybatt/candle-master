import { useState, useEffect, useCallback } from 'react';

// Subscription tiers
export type SubscriptionTier = 'free' | 'pro';

// Feature limits for each tier
export const TIER_LIMITS = {
  free: {
    gamesPerDay: 3,
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
 * TODO: Integrate with RevenueCat for real payments
 */
export const useSubscription = () => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [gamesToday, setGamesToday] = useState(0);

  // Load subscription state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'pro') {
      setTier('pro');
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
  const hasAccess = useCallback((feature: 'chartPatterns' | 'allStocks' | 'allThemes') => {
    if (tier === 'pro') return true;

    switch (feature) {
      case 'chartPatterns':
        return limits.chartPatterns;
      case 'allStocks':
        return limits.stockAccess === 'all';
      case 'allThemes':
        return false;
      default:
        return false;
    }
  }, [tier, limits]);

  // TODO: Integrate RevenueCat
  // For now, this is a mock upgrade function
  const upgradeToPro = useCallback(() => {
    // In production: RevenueCat.purchaseProduct('pro_monthly')
    console.log('TODO: Integrate RevenueCat for real payments');
    setTier('pro');
    localStorage.setItem(STORAGE_KEY, 'pro');
  }, []);

  // For testing: Reset to free
  const resetToFree = useCallback(() => {
    setTier('free');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    tier,
    isPro: tier === 'pro',
    limits,
    canPlayGame,
    gamesToday,
    gamesRemaining: Math.max(0, limits.gamesPerDay - gamesToday),
    recordGamePlayed,
    hasAccess,
    upgradeToPro,
    resetToFree, // For testing only
  };
};
