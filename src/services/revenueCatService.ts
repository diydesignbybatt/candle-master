/**
 * RevenueCat Service
 *
 * เตรียมไว้สำหรับเชื่อมต่อ RevenueCat subscription management
 *
 * Setup Steps:
 * 1. สมัคร RevenueCat: https://app.revenuecat.com/signup
 * 2. สร้าง Project ใน RevenueCat Dashboard
 * 3. เชื่อม App Store Connect (iOS) และ Google Play Console (Android)
 * 4. สร้าง Products และ Entitlements
 * 5. Copy API Keys มาใส่ด้านล่าง
 *
 * Documentation: https://docs.revenuecat.com/docs
 */

import { Capacitor } from '@capacitor/core';

// ============================================
// CONFIGURATION - ใส่ API Keys ตรงนี้
// ============================================
const REVENUECAT_CONFIG = {
  // Get these from RevenueCat Dashboard > Project > API Keys
  ios: {
    apiKey: '', // ใส่ iOS API Key ตรงนี้
  },
  android: {
    apiKey: '', // ใส่ Android API Key ตรงนี้
  },
  // Entitlement identifier ที่สร้างใน RevenueCat
  entitlements: {
    pro: 'pro', // ชื่อ entitlement สำหรับ PRO subscription
  },
  // Product identifiers (ต้องตรงกับที่สร้างใน App Store / Play Store)
  products: {
    monthly: 'candle_master_pro_monthly',
    yearly: 'candle_master_pro_yearly',
    lifetime: 'candle_master_pro_lifetime',
  },
};

// ============================================
// TYPES
// ============================================
export interface SubscriptionStatus {
  isPro: boolean;
  expirationDate: Date | null;
  productId: string | null;
  willRenew: boolean;
}

export interface Product {
  identifier: string;
  title: string;
  description: string;
  price: number;
  priceString: string;
  currencyCode: string;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
}

// ============================================
// SERVICE CLASS
// ============================================
class RevenueCatService {
  private initialized = false;

  /**
   * Check if RevenueCat is configured
   */
  isConfigured(): boolean {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      return !!REVENUECAT_CONFIG.ios.apiKey;
    } else if (platform === 'android') {
      return !!REVENUECAT_CONFIG.android.apiKey;
    }
    return false;
  }

  /**
   * Initialize RevenueCat SDK
   * Call this on app startup after user authentication
   */
  async initialize(userId?: string): Promise<void> {
    if (this.initialized) return;

    const platform = Capacitor.getPlatform();

    // Skip on web
    if (platform === 'web') {
      console.log('[RevenueCat] Skipping initialization on web');
      return;
    }

    if (!this.isConfigured()) {
      console.warn('[RevenueCat] API Key not configured. Please add your API key.');
      return;
    }

    try {
      // TODO: Import and initialize RevenueCat Capacitor plugin
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      //
      // const apiKey = platform === 'ios'
      //   ? REVENUECAT_CONFIG.ios.apiKey
      //   : REVENUECAT_CONFIG.android.apiKey;
      //
      // await Purchases.configure({
      //   apiKey,
      //   appUserID: userId || null, // null = anonymous user
      // });

      this.initialized = true;
      console.log('[RevenueCat] Initialized successfully', userId ? `for user: ${userId}` : '(anonymous)');
    } catch (error) {
      console.error('[RevenueCat] Initialization failed:', error);
    }
  }

  /**
   * Login user (link purchases to user account)
   */
  async login(userId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize(userId);
      return;
    }

    try {
      // TODO: Implement login
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // await Purchases.logIn({ appUserID: userId });

      console.log('[RevenueCat] User logged in:', userId);
    } catch (error) {
      console.error('[RevenueCat] Login failed:', error);
    }
  }

  /**
   * Logout user (switch to anonymous)
   */
  async logout(): Promise<void> {
    try {
      // TODO: Implement logout
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // await Purchases.logOut();

      console.log('[RevenueCat] User logged out');
    } catch (error) {
      console.error('[RevenueCat] Logout failed:', error);
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const defaultStatus: SubscriptionStatus = {
      isPro: false,
      expirationDate: null,
      productId: null,
      willRenew: false,
    };

    if (!this.initialized || !this.isConfigured()) {
      return defaultStatus;
    }

    try {
      // TODO: Implement subscription check
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // const { customerInfo } = await Purchases.getCustomerInfo();
      //
      // const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];
      //
      // if (proEntitlement) {
      //   return {
      //     isPro: true,
      //     expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : null,
      //     productId: proEntitlement.productIdentifier,
      //     willRenew: proEntitlement.willRenew,
      //   };
      // }

      return defaultStatus;
    } catch (error) {
      console.error('[RevenueCat] Failed to get subscription status:', error);
      return defaultStatus;
    }
  }

  /**
   * Get available products for purchase
   */
  async getProducts(): Promise<Product[]> {
    if (!this.initialized || !this.isConfigured()) {
      return [];
    }

    try {
      // TODO: Implement get products
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // const { products } = await Purchases.getProducts({
      //   productIdentifiers: Object.values(REVENUECAT_CONFIG.products),
      // });
      //
      // return products.map(p => ({
      //   identifier: p.identifier,
      //   title: p.title,
      //   description: p.description,
      //   price: p.price,
      //   priceString: p.priceString,
      //   currencyCode: p.currencyCode,
      // }));

      return [];
    } catch (error) {
      console.error('[RevenueCat] Failed to get products:', error);
      return [];
    }
  }

  /**
   * Purchase a product
   */
  async purchase(_productId: string): Promise<PurchaseResult> {
    if (!this.initialized || !this.isConfigured()) {
      return { success: false, error: 'RevenueCat not initialized' };
    }

    try {
      // TODO: Implement purchase (will use _productId)
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // const { customerInfo } = await Purchases.purchaseProduct({
      //   productIdentifier: productId,
      // });
      //
      // const isPro = !!customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];
      // return { success: isPro };

      return { success: false, error: 'Purchase not implemented yet' };
    } catch (error: any) {
      console.error('[RevenueCat] Purchase failed:', error);

      // Handle user cancellation
      if (error?.userCancelled) {
        return { success: false, error: 'Purchase cancelled' };
      }

      return { success: false, error: error?.message || 'Purchase failed' };
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<SubscriptionStatus> {
    const defaultStatus: SubscriptionStatus = {
      isPro: false,
      expirationDate: null,
      productId: null,
      willRenew: false,
    };

    if (!this.initialized || !this.isConfigured()) {
      return defaultStatus;
    }

    try {
      // TODO: Implement restore
      // import { Purchases } from '@revenuecat/purchases-capacitor';
      // const { customerInfo } = await Purchases.restorePurchases();
      //
      // const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];
      //
      // if (proEntitlement) {
      //   return {
      //     isPro: true,
      //     expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : null,
      //     productId: proEntitlement.productIdentifier,
      //     willRenew: proEntitlement.willRenew,
      //   };
      // }

      return defaultStatus;
    } catch (error) {
      console.error('[RevenueCat] Restore failed:', error);
      return defaultStatus;
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

// Export config for reference
export { REVENUECAT_CONFIG };
