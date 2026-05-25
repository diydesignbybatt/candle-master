import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Smartphone, Sparkles, Loader2, Star } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export type UpgradeTrigger = 'calc' | 'learn' | 'general';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => Promise<void>;
  isLoading: boolean;
  isPro: boolean;
  trigger?: UpgradeTrigger;
}

/**
 * Detect display currency by timezone (best-effort, no network calls).
 * - Asia/Bangkok → THB
 * - All other timezones → USD
 */
function detectCurrency(): 'USD' | 'THB' {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Bangkok') return 'THB';
  } catch {
    /* fallback to USD */
  }
  return 'USD';
}

const PRICE_DISPLAY = {
  USD: { price: '$3.99', period: 'One-time payment' },
  THB: { price: '฿99', period: 'จ่ายครั้งเดียว' },
} as const;

const PRO_FEATURES: string[] = [
  '250 trading days per game (vs 100 free)',
  '500+ legendary stocks worldwide',
  'Full Academy access',
  'All chart themes',
  'Crisis Event boss stages',
  'Position Calculator',
  'All future updates',
];

const HEADLINES: Record<UpgradeTrigger, string> = {
  calc: 'Unlock Position Calculator with PRO',
  learn: 'Unlock Full Academy with PRO',
  general: 'Upgrade to PRO Lifetime',
};

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  onPurchase,
  isLoading,
  isPro,
  trigger = 'general',
}) => {
  const isNative = Capacitor.isNativePlatform();
  const currency = detectCurrency();
  const { price, period } = PRICE_DISPLAY[currency];

  const handlePurchase = async () => {
    if (isLoading || isPro) return;
    await onPurchase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="upgrade-modal pricing-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="upgrade-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="upgrade-modal-icon">
              {isPro ? <Sparkles size={48} /> : <Star size={48} fill="currentColor" />}
            </div>

            {isPro ? (
              <>
                <h2 className="upgrade-modal-title">You're already PRO</h2>
                <p className="upgrade-modal-subtitle">Thanks for supporting Candle Master</p>
                <button
                  type="button"
                  className="upgrade-modal-btn"
                  onClick={onClose}
                  style={{ marginTop: 16 }}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <h2 className="upgrade-modal-title">{HEADLINES[trigger]}</h2>
                <p className="upgrade-modal-subtitle">Lifetime Access</p>

                {/* Single Lifetime card */}
                <div className="pricing-cards pricing-cards-single">
                  <div className="pricing-card pricing-card-best pricing-card-lifetime">
                    <span className="pricing-best-badge">BEST VALUE</span>
                    <span className="pricing-label">PRO Lifetime</span>
                    <span className="pricing-price">{price}</span>
                    <span className="pricing-period">{period}</span>

                    <ul className="pricing-features">
                      {PRO_FEATURES.map((feature) => (
                        <li key={feature}>
                          <span className="pricing-feature-check">
                            <Check size={14} strokeWidth={3} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA: native vs web */}
                {isNative ? (
                  <button
                    type="button"
                    className="upgrade-modal-btn pricing-cta-btn"
                    onClick={handlePurchase}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="pricing-spinner" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        <span>Upgrade to PRO {price}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="pricing-store-buttons">
                    <p className="pricing-store-note">
                      Buy lifetime PRO inside the mobile app:
                    </p>
                    <div className="pricing-store-row">
                      <a
                        className="pricing-store-btn"
                        href="https://play.google.com/store/apps/details?id=com.candlemaster.app"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Smartphone size={18} />
                        <span>Get on Play Store</span>
                      </a>
                      <a
                        className="pricing-store-btn pricing-store-btn-secondary"
                        href="https://candlemaster.app"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Smartphone size={18} />
                        <span>Get on App Store</span>
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}

            <style>{PRICING_MODAL_STYLES}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Component-scoped styles — extend existing .upgrade-modal / .pricing-* classes
const PRICING_MODAL_STYLES = `
  .pricing-modal {
    max-width: 360px;
  }

  .pricing-cards-single {
    grid-template-columns: 1fr;
    margin-top: 20px;
    margin-bottom: 16px;
  }

  .pricing-card-lifetime {
    padding: 18px 16px 16px;
    gap: 6px;
    text-align: left;
    align-items: stretch;
  }

  .pricing-card-lifetime .pricing-label,
  .pricing-card-lifetime .pricing-price,
  .pricing-card-lifetime .pricing-period {
    text-align: center;
  }

  .pricing-card-lifetime .pricing-price {
    font-size: 2rem;
    margin-top: 4px;
  }

  .pricing-features {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .pricing-features li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--color-text, #333);
    line-height: 1.4;
  }

  .pricing-feature-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    min-width: 18px;
    height: 18px;
    margin-top: 1px;
    border-radius: 50%;
    background: #C5A059;
    color: #fff;
  }

  .pricing-cta-btn {
    margin-top: 4px;
  }

  .pricing-cta-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .pricing-spinner {
    animation: pricing-spin 1s linear infinite;
  }

  @keyframes pricing-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .pricing-store-buttons {
    width: 100%;
    margin-top: 8px;
  }

  .pricing-store-note {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #888);
    margin: 0 0 10px 0;
    text-align: center;
  }

  .pricing-store-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pricing-store-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, #C5A059 0%, #E6C775 50%, #C5A059 100%);
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(197, 160, 89, 0.4);
  }

  .pricing-store-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(197, 160, 89, 0.5);
  }

  .pricing-store-btn-secondary {
    background: var(--bg-tertiary, #2a2a2a);
    color: var(--color-text, #fff);
    box-shadow: none;
    border: 1px solid var(--color-border, rgba(128,128,128,0.2));
  }

  .pricing-store-btn-secondary:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export default PricingModal;
