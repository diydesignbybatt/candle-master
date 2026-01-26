import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

// User type
export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoUrl: string | null;
  provider: 'google' | 'apple' | 'guest';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  hasSeenWelcome: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  continueAsGuest: () => void;
  signOut: () => void;
  linkAccount: (provider: 'google' | 'apple') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'candle_master_auth';
const WELCOME_SEEN_KEY = 'candle_master_welcome_seen';

// Load saved auth state
function getSavedAuth(): User | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

function getWelcomeSeen(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(WELCOME_SEEN_KEY) === 'true';
  }
  return false;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getSavedAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(getWelcomeSeen);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // Native Google Sign-In
        const { GoogleAuth } = await import('@southdevs/capacitor-google-auth');
        await GoogleAuth.initialize({
          clientId: '951460493496-cs5h9e7e517m4lea6q9lcd49jplfvhv5.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
        const result = await (GoogleAuth as any).signIn();

        setUser({
          id: result.id || result.userId || result.user?.id || '',
          email: result.email || result.user?.email || null,
          displayName: result.name || result.givenName || result.user?.name || null,
          photoUrl: result.imageUrl || result.user?.imageUrl || null,
          provider: 'google',
        });
      } else {
        // Web fallback - mock for development
        console.log('Google Sign-In not available on web. Using mock.');
        setUser({
          id: 'google_mock_' + Date.now(),
          email: 'demo@gmail.com',
          displayName: 'Demo User',
          photoUrl: null,
          provider: 'google',
        });
      }

      setHasSeenWelcome(true);
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // Native Apple Sign-In
        const { SignInWithApple } = await import('@capacitor-community/apple-sign-in');
        const result = await SignInWithApple.authorize({
          clientId: '', // Will be configured
          redirectURI: '',
          scopes: 'email name',
        });

        setUser({
          id: result.response.user || '',
          email: result.response.email || null,
          displayName: result.response.givenName
            ? `${result.response.givenName} ${result.response.familyName || ''}`.trim()
            : null,
          photoUrl: null, // Apple doesn't provide photo
          provider: 'apple',
        });
      } else {
        // Web fallback - mock for development
        console.log('Apple Sign-In not available on web. Using mock.');
        setUser({
          id: 'apple_mock_' + Date.now(),
          email: 'demo@icloud.com',
          displayName: 'Apple User',
          photoUrl: null,
          provider: 'apple',
        });
      }

      setHasSeenWelcome(true);
      localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    } catch (error) {
      console.error('Apple Sign-In error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser({
      id: 'guest_' + Date.now(),
      email: null,
      displayName: 'Guest Player',
      photoUrl: null,
      provider: 'guest',
    });
    setHasSeenWelcome(true);
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
  }, []);

  const signOut = useCallback(async () => {
    try {
      if (user?.provider === 'google' && Capacitor.isNativePlatform()) {
        const { GoogleAuth } = await import('@southdevs/capacitor-google-auth');
        await GoogleAuth.signOut();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
    // Don't reset hasSeenWelcome - they already know about the app
  }, [user]);

  const linkAccount = useCallback(async (provider: 'google' | 'apple') => {
    // For guest users who want to link their account later
    if (provider === 'google') {
      await signInWithGoogle();
    } else {
      await signInWithApple();
    }
  }, [signInWithGoogle, signInWithApple]);

  const isAuthenticated = user !== null;
  const isGuest = user?.provider === 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        isLoading,
        hasSeenWelcome,
        signInWithGoogle,
        signInWithApple,
        continueAsGuest,
        signOut,
        linkAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
