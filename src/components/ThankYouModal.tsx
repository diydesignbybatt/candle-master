import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseMs?: number; // default 5000 (5s)
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  autoCloseMs = 5000,
}) => {
  // ESC key handler
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Auto-dismiss after autoCloseMs
  React.useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      try {
        onClose();
      } catch (err) {
        console.error('[ThankYouModal] Auto-close error:', err);
      }
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay thankyou-overlay"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-labelledby="thankyou-modal-title"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="thankyou-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="upgrade-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Sparkle ring */}
            <div className="thankyou-sparkle-ring">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="thankyou-sparkle-orbit"
              >
                <Sparkles size={20} className="thankyou-sparkle-icon" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="thankyou-sparkle-orbit thankyou-sparkle-orbit-inner"
              >
                <Sparkles size={14} className="thankyou-sparkle-icon thankyou-sparkle-icon-small" />
              </motion.div>

              {/* Mascot */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="thankyou-mascot-wrap"
              >
                <img
                  src="/uncle-mascot.webp"
                  alt="Candle Master"
                  className="thankyou-mascot"
                />
              </motion.div>
            </div>

            {/* Text */}
            <motion.h2
              id="thankyou-modal-title"
              className="thankyou-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              Welcome to PRO! 🎉
            </motion.h2>

            <motion.p
              className="thankyou-subtitle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              You now have lifetime access to all features
            </motion.p>

            {/* CTA */}
            <motion.button
              type="button"
              className="upgrade-modal-btn thankyou-btn"
              onClick={onClose}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles size={18} />
              <span>Let's Trade!</span>
            </motion.button>
          </motion.div>

          <style>{THANKYOU_MODAL_STYLES}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const THANKYOU_MODAL_STYLES = `
  .thankyou-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
  }

  .thankyou-card {
    position: relative;
    width: 100%;
    max-width: 380px;
    margin: 16px;
    padding: 40px 28px 32px;
    border-radius: 24px;
    background: var(--bg-secondary, #1a1a1a);
    border: 1px solid rgba(197, 160, 89, 0.25);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(197, 160, 89, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    overflow: hidden;
  }

  /* Sparkle ring container */
  .thankyou-sparkle-ring {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thankyou-sparkle-orbit {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .thankyou-sparkle-orbit-inner {
    inset: 12px;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .thankyou-sparkle-icon {
    color: #C5A059;
    opacity: 0.9;
    filter: drop-shadow(0 0 4px rgba(197, 160, 89, 0.6));
  }

  .thankyou-sparkle-icon-small {
    opacity: 0.7;
  }

  /* Mascot */
  .thankyou-mascot-wrap {
    position: relative;
    z-index: 1;
    width: 88px;
    height: 88px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #C5A059;
    box-shadow: 0 0 20px rgba(197, 160, 89, 0.45);
    background: var(--bg-tertiary, #2a2a2a);
  }

  .thankyou-mascot {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }

  /* Title */
  .thankyou-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: #C5A059;
    margin: 0;
    letter-spacing: -0.3px;
    line-height: 1.2;
  }

  /* Subtitle */
  .thankyou-subtitle {
    font-size: 0.88rem;
    color: var(--color-text-secondary, #aaa);
    margin: 0;
    line-height: 1.5;
    max-width: 260px;
  }

  /* CTA button */
  .thankyou-btn {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 260px;
    justify-content: center;
  }

  /* Mobile full-width card */
  @media (max-width: 400px) {
    .thankyou-card {
      margin: 0 12px;
      padding: 36px 20px 28px;
    }
  }
`;

export default ThankYouModal;
