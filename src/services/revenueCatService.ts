/**
 * RevenueCat Service
 *
 * จัดการ In-App Purchases ผ่าน RevenueCat SDK
 * ใช้สำหรับ native Android (Google Play Billing) และ iOS (Apple IAP)
 * Web/PWA ใช้ Stripe แทน (ไม่ผ่าน RevenueCat)
 *
 * Setup Steps:
 * 1. สมัคร RevenueCat: https://app.revenuecat.com/signup
 * 2. สร้าง Project → เพิ่ม Native Android app (com.candlemaster.app)
 * 3. เชื่อม Google Play Console (Service Account JSON key)
 * 4. สร้าง Products ใน Play Console → Import เข้า RevenueCat
 * 5. สร้าง Entitlement "pro" → ผูก products → สร้าง Offering "default"
 * 6. Copy API Key (goog_xxx) มาใส่ด้านล่าง
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
    pro: 'pro', // ชื่อ entitlement สำหรับ PRO subscription
  },
  // Product identifiers (ต้องตรงกับที่สร้างใน App Store / Play Store)
  products: {
    monthly: 'candle_master_pro_monthly',
    yearly: 'candle_master_pro_yearly',
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
  plan?: 'monthly' | 'yearly';
}

export interface Product {
  identifier: string;
  title: string;
  description: string;
  price: number;
  priceString: string;
  currencyCode: string;
  /** 'monthly' | 'yearly' — derived from package type or product id */
  planType?: 'monthly' | 'yearly';
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
   * Check if RevenueCat is configured (has API key for current platform)
   * ถ้า return false → useSubscription จะ fallback ไป localStorage/Stripe
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
      expirationDate: null,
      productId: null,
      willRenew: false,
    };

    if (!this.initialized || !this.isConfigured()) {
      return defaultStatus;
    }

    try {
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.getCustomerInfo();

      const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];

      if (proEntitlement) {
        // Derive plan type from product identifier
        const plan = this.derivePlanType(proEntitlement.productIdentifier);

        return {
          isPro: true,
          expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : null,
          productId: proEntitlement.productIdentifier,
          willRenew: proEntitlement.willRenew,
          plan,
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

      // Map available packages → Product[]
      const products: Product[] = [];

      // Monthly package
      if (currentOffering.monthly) {
        const pkg = currentOffering.monthly;
        products.push({
          identifier: pkg.product.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.price,
          priceString: pkg.product.priceString,
          currencyCode: pkg.product.currencyCode,
          planType: 'monthly',
        });
      }

      // Annual package
      if (currentOffering.annual) {
        const pkg = currentOffering.annual;
        products.push({
          identifier: pkg.product.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.price,
          priceString: pkg.product.priceString,
          currencyCode: pkg.product.currencyCode,
          planType: 'yearly',
        });
      }

      // Fallback: ถ้าไม่มี named packages → iterate availablePackages
      if (products.length === 0 && currentOffering.availablePackages.length > 0) {
        for (const pkg of currentOffering.availablePackages) {
          products.push({
            identifier: pkg.product.identifier,
            title: pkg.product.title,
            description: pkg.product.description,
            price: pkg.product.price,
            priceString: pkg.product.priceString,
            currencyCode: pkg.product.currencyCode,
            planType: this.derivePlanType(pkg.product.identifier),
          });
        }
      }

      console.log(`[RevenueCat] Loaded ${products.length} products:`, products.map(p => `${p.planType}: ${p.priceString}`));
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
    } catch (error: any) {
      console.error('[RevenueCat] Purchase failed:', error);

      // Handle user cancellation gracefully
      if (error?.code === '1' || error?.userCancelled) {
        return { success: false, error: 'Purchase cancelled' };
      }

      return { success: false, error: error?.message || 'Purchase failed' };
    }
  }

  /**
   * Restore previous purchases
   * สำคัญสำหรับ App Store / Play Store compliance — ต้องมีปุ่ม restore
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
      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.restorePurchases();

      const proEntitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlements.pro];

      if (proEntitlement) {
        const plan = this.derivePlanType(proEntitlement.productIdentifier);
        console.log(`[RevenueCat] Restore successful — PRO: true, plan: ${plan}`);

        return {
          isPro: true,
          expirationDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : null,
          productId: proEntitlement.productIdentifier,
          willRenew: proEntitlement.willRenew,
          plan,
        };
      }

      console.log('[RevenueCat] Restore completed — no PRO entitlement found');
      return defaultStatus;
    } catch (error) {
      console.error('[RevenueCat] Restore failed:', error);
      return defaultStatus;
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Derive plan type from product identifier
   * candle_master_pro_monthly → 'monthly'
   * candle_master_pro_yearly → 'yearly'
   */
  private derivePlanType(productId: string): 'monthly' | 'yearly' | undefined {
    if (productId.includes('monthly')) return 'monthly';
    if (productId.includes('yearly') || productId.includes('annual')) return 'yearly';
    return undefined;
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();

// Export config for reference
export { REVENUECAT_CONFIG };
