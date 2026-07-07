/**
 * RevenueCat Service
 *
 * Handles native in-app purchases through RevenueCat.
 * iOS uses Apple In-App Purchase. Android uses Google Play Billing.
 * Web/PWA does not process payments.
 *
 * Setup Steps:
 * 1. Create a RevenueCat project.
 * 2. Add the iOS app and configure Apple App Store Connect.
 * 3. Add a non-consumable product: candle_master_pro_lifetime.
 * 4. Attach it to the "pro" entitlement and the "default" offering.
 * 5. Copy the iOS API key (apple_xxx) into the config below.
 */

import { Capacitor } from '@capacitor/core';

// ============================================
// CONFIGURATION - ใส่ API Keys ตรงนี้
// ============================================
const REVENUECAT_CONFIG = {
  // Get these from RevenueCat Dashboard > Project > API Keys
  ios: {
    apiKey: '', // ใส่ iOS API Key ตรงนี้ (apple_xxx)
  },
  android: {
    apiKey: 'goog_peJadJCRMfojllXEemlRszrhyep', // RevenueCat Android API Key (Production)
  },
  // Entitlement identifier ที่สร้างใน RevenueCat
  entitlements: {
    pro: 'pro', // PRO lifetime unlock entitlement
  },
  // Product identifiers (ต้องตรงกับที่สร้างใน App Store / Play Store)
  products: {
    lifetime: 'candle_master_pro_lifetime', // One-time App Store / Play Store product
  },
};

// ============================================
// TYPES
// ============================================
export interface SubscriptionStatus {
  isPro: boolean;
  productId: string | null;
  purchaseDate: Date | null;
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

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Purchase failed';
}

function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybePurchaseError = error as { code?: unknown; userCancelled?: unknown };
  return maybePurchaseError.code === '1' || maybePurchaseError.userCancelled === true;
}

// ============================================
// SERVICE CLASS
// ============================================
class RevenueCatService {
  private initialized = false;

  /**
   * Check if RevenueCat is configured (has API key for current platform)
   * If false, useSubscription falls back to free mode or dev-only test unlocks.
   */
  isConfigured(): boolean {
    const platform = Capacitor.getPlatform();
    if (platform === 'ios') {
      return !!REVENUECAT_CONFIG.ios.apiKey;
    } else if (platform === 'android') {
      return !!REVENUECAT_CONFIG.android.apiKey;
    }
    return false; // web ไม่ใช้ RevenueCat
  }

  /**
   * Initialize RevenueCat SDK
   * ต้องเรียกก่อนใช้ method อื่น — ปกติเรียกตอน app startup
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
      console.warn('[RevenueCat] API Key not configured. Add your key in revenueCatService.ts');
      return;
    }

    try {
      const { Purchases, LOG_LEVEL } = await import('@revenuecat/purchases-capacitor');

      const apiKey = platform === 'ios'
        ? REVENUECAT_CONFIG.ios.apiKey
        : REVENUECAT_CONFIG.android.apiKey;

      // Enable debug logs in development
      if (import.meta.env.DEV) {
        await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      }

      await Purchases.configure({
        apiKey,
        appUserID: userId || null, // null = anonymous user
      });

      this.initialized = true;
      console.log('[RevenueCat] Initialized successfully', userId ? `for user: ${userId}` : '(anonymous)');
    } catch (error) {
      console.error('[RevenueCat] Initialization failed:', error);
    }
  }

  /**
   * Login user — links purchases to user account
   * เรียกเมื่อ user sign in (ไม่ใช่ guest)
   */
  async login(userId: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize(userId);
      return;
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.logIn({ appUserID: userId });
      console.log('[RevenueCat] User logged in:', userId, '| PRO:', !!customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro]);
    } catch (error) {
      console.error('[RevenueCat] Login failed:', error);
    }
  }

  /**
   * Logout user — switch back to anonymous
   * เรียกเมื่อ user sign out
   */
  async logout(): Promise<void> {
    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      await Purchases.logOut();
      console.log('[RevenueCat] User logged out');
    } catch (error) {
      console.error('[RevenueCat] Logout failed:', error);
    }
  }

  /**
   * Get current subscription status
   * ตรวจว่า user มี "pro" entitlement อยู่ไหม
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const defaultStatus: SubscriptionStatus = {
      isPro: false,
      productId: null,
      purchaseDate: null,
    };

    if (!this.initialized || !this.isConfigured()) {
      return defaultStatus;
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.getCustomerInfo();

      const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];

      if (proEntitlement) {
        return {
          isPro: true,
          productId: proEntitlement.productIdentifier,
          purchaseDate: proEntitlement.latestPurchaseDate ? new Date(proEntitlement.latestPurchaseDate) : null,
        };
      }

      return defaultStatus;
    } catch (error) {
      console.error('[RevenueCat] Failed to get subscription status:', error);
      return defaultStatus;
    }
  }

  /**
   * Get available products from RevenueCat Offerings
   * ดึง packages จาก "default" offering แล้ว map เป็น Product[]
   */
  async getProducts(): Promise<Product[]> {
    if (!this.initialized || !this.isConfigured()) {
      return [];
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const offerings = await Purchases.getOfferings();

      const currentOffering = offerings.current;
      if (!currentOffering) {
        console.warn('[RevenueCat] No current offering found');
        return [];
      }

      const products: Product[] = [];

      // Preferred: use the lifetime package from current offering
      if (currentOffering.lifetime) {
        const pkg = currentOffering.lifetime;
        products.push({
          identifier: pkg.product.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.price,
          priceString: pkg.product.priceString,
          currencyCode: pkg.product.currencyCode,
        });
      }

      // Fallback: iterate availablePackages if lifetime not named
      if (products.length === 0 && currentOffering.availablePackages.length > 0) {
        for (const pkg of currentOffering.availablePackages) {
          products.push({
            identifier: pkg.product.identifier,
            title: pkg.product.title,
            description: pkg.product.description,
            price: pkg.product.price,
            priceString: pkg.product.priceString,
            currencyCode: pkg.product.currencyCode,
          });
        }
      }

      console.log(`[RevenueCat] Loaded ${products.length} products`);
      return products;
    } catch (error) {
      console.error('[RevenueCat] Failed to get products:', error);
      return [];
    }
  }

  /**
   * Purchase a product by identifier
   * ใช้ purchaseStoreProduct — ต้องส่ง full product object
   */
  async purchase(productId: string): Promise<PurchaseResult> {
    if (!this.initialized || !this.isConfigured()) {
      return { success: false, error: 'RevenueCat not initialized' };
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');

      // Get offerings to find the package containing this product
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        return { success: false, error: 'No offering available' };
      }

      // Find matching package by product identifier
      const targetPackage = currentOffering.availablePackages.find(
        pkg => pkg.product.identifier === productId
      );

      let customerInfo;

      if (targetPackage) {
        // ✅ Preferred: purchase via package (RevenueCat tracks it better)
        const result = await Purchases.purchasePackage({
          aPackage: targetPackage,
        });
        customerInfo = result.customerInfo;
      } else {
        // Fallback: purchase via product identifier directly
        const { products } = await Purchases.getProducts({
          productIdentifiers: [productId],
        });

        if (products.length === 0) {
          return { success: false, error: 'Product not found' };
        }

        const result = await Purchases.purchaseStoreProduct({
          product: products[0],
        });
        customerInfo = result.customerInfo;
      }

      // Check if PRO entitlement is now active
      const isPro = !!customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];
      console.log(`[RevenueCat] Purchase result — PRO: ${isPro}, product: ${productId}`);

      return { success: isPro };
    } catch (error: unknown) {
      console.error('[RevenueCat] Purchase failed:', error);

      // Handle user cancellation gracefully
      if (isPurchaseCancelled(error)) {
        return { success: false, error: 'Purchase cancelled' };
      }

      return { success: false, error: getErrorMessage(error) };
    }
  }

  /**
   * Restore previous purchases
   * สำคัญสำหรับ App Store / Play Store compliance — ต้องมีปุ่ม restore
   */
  async restorePurchases(): Promise<SubscriptionStatus> {
    const defaultStatus: SubscriptionStatus = {
      isPro: false,
      productId: null,
      purchaseDate: null,
    };

    if (!this.initialized || !this.isConfigured()) {
      return defaultStatus;
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.restorePurchases();

      const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];

      if (proEntitlement) {
        console.log(`[RevenueCat] Restore successful — PRO active`);
        return {
          isPro: true,
          productId: proEntitlement.productIdentifier,
          purchaseDate: proEntitlement.latestPurchaseDate ? new Date(proEntitlement.latestPurchaseDate) : null,
        };
      }

      console.log('[RevenueCat] Restore completed — no PRO entitlement found');
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
