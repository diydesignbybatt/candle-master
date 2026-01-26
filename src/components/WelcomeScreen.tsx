import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Platform detection for showing Apple Sign-In only on iOS
const isIOS = () => {
  if (typeof navigator !== 'undefined') {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }
  return false;
};

export const WelcomeScreen: React.FC = () => {
  const { signInWithGoogle, signInWithApple, continueAsGuest, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    try {
      await signInWithApple();
    } catch (err) {
      setError('Failed to sign in with Apple. Please try again.');
    }
  };

  const handleGuestContinue = () => {
    setError(null);
    continueAsGuest();
  };

  return (
    <div className="welcome-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="welcome-content"
      >
        {/* Logo/Title */}
        <div className="welcome-header">
          <div className="welcome-logo">🕯️</div>
          <h1 className="welcome-title">Candle Master</h1>
          <p className="welcome-subtitle">Master the Art of Trading</p>
        </div>

        {/* Sign-in Buttons */}
        <div className="welcome-buttons">
          {/* Google Sign-In */}
          <button
            className="welcome-btn google-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="btn-spinner" size={20} />
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Apple Sign-In - Only show on iOS/macOS */}
          {isIOS() && (
            <button
              className="welcome-btn apple-btn"
              onClick={handleAppleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="btn-spinner" size={20} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              <span>Continue with Apple</span>
            </button>
          )}

          {/* Divider */}
          <div className="welcome-divider">
            <span>or</span>
          </div>

          {/* Guest Mode */}
          <button
            className="welcome-btn guest-btn"
            onClick={handleGuestContinue}
            disabled={isLoading}
          >
            <span>Play as Guest</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="welcome-error"
          >
            {error}
          </motion.p>
        )}

        {/* Guest Notice */}
        <p className="welcome-notice">
          Guest mode won't sync PRO subscription across devices
        </p>
      </motion.div>

      <style>{WELCOME_STYLES}</style>
    </div>
  );
};

const WELCOME_STYLES = `
  .welcome-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
    padding: 24px;
    padding-top: calc(var(--safe-area-top, 0px) + 24px);
    padding-bottom: calc(var(--safe-area-bottom, 0px) + 24px);
  }

  .welcome-content {
    width: 100%;
    max-width: 360px;
    text-align: center;
  }

  .welcome-header {
    margin-bottom: 48px;
  }

  .welcome-logo {
    font-size: 4rem;
    margin-bottom: 16px;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  .welcome-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 8px 0;
    font-family: 'Cormorant Garamond', serif;
    letter-spacing: -0.02em;
  }

  .welcome-subtitle {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0;
    font-weight: 500;
  }

  .welcome-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .welcome-btn {
    width: 100%;
    height: 52px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.2s;
    border: none;
  }

  .welcome-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .welcome-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .google-btn {
    background: #FFFFFF;
    color: #1F1F1F;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .google-btn:hover:not(:disabled) {
    background: #F8F8F8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .apple-btn {
    background: #000000;
    color: #FFFFFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .apple-btn:hover:not(:disabled) {
    background: #1a1a1a;
  }

  .guest-btn {
    background: var(--bg-tertiary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .guest-btn:hover:not(:disabled) {
    background: var(--color-border);
  }

  .btn-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .welcome-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 8px 0;
  }

  .welcome-divider::before,
  .welcome-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }

  .welcome-divider span {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  .welcome-error {
    color: var(--color-red);
    font-size: 0.875rem;
    margin: 0 0 16px 0;
  }

  .welcome-notice {
    font-size: 0.75rem;
    color: var(--color-text-tertiary);
    margin: 0;
    line-height: 1.5;
  }
`;

export default WelcomeScreen;
