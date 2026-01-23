import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'midnight' | 'sandstone' | 'solarized' | 'system';
export type ResolvedTheme = 'light' | 'dark' | 'midnight' | 'sandstone' | 'solarized';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'candle_master_theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getSavedTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'midnight' || saved === 'sandstone' || saved === 'solarized' || saved === 'system') {
      return saved;
    }
  }
  return 'system';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemTheme();
  }
  if (mode === 'midnight') {
    return 'midnight';
  }
  if (mode === 'sandstone') {
    return 'sandstone';
  }
  if (mode === 'solarized') {
    return 'solarized';
  }
  return mode;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(getSavedTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(getSavedTheme()));

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
    setResolvedTheme(resolveTheme(newMode));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (mode === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply midnight theme colors
    if (resolvedTheme === 'midnight') {
      root.style.setProperty('--bg-primary', '#0F172A');
      root.style.setProperty('--bg-secondary', '#1E293B');
      root.style.setProperty('--bg-tertiary', '#1E293B');
      root.style.setProperty('--color-text', '#F1F5F9');
      root.style.setProperty('--color-text-secondary', '#94A3B8');
      root.style.setProperty('--color-text-tertiary', '#64748B');
      root.style.setProperty('--color-border', '#334155');
      root.style.setProperty('--color-green', '#22c55e');
      root.style.setProperty('--color-red', '#ef4444');

      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else if (resolvedTheme === 'sandstone') {
      // Apply sandstone theme colors (luxury warm palette)
      root.style.setProperty('--bg-primary', '#F2EBE3');
      root.style.setProperty('--bg-secondary', '#E5DDD3');
      root.style.setProperty('--bg-tertiary', '#E5DDD3');
      root.style.setProperty('--color-text', '#4A443F');
      root.style.setProperty('--color-text-secondary', '#5A5350');
      root.style.setProperty('--color-text-tertiary', '#6B6360');
      root.style.setProperty('--color-border', '#D1C7BC');
      root.style.setProperty('--color-green', '#0E7C7B');
      root.style.setProperty('--color-red', '#D62246');

      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else if (resolvedTheme === 'solarized') {
      // Apply Solarized Dark theme colors (classic terminal theme)
      root.style.setProperty('--bg-primary', '#002b36');
      root.style.setProperty('--bg-secondary', '#073642');
      root.style.setProperty('--bg-tertiary', '#073642');
      root.style.setProperty('--color-text', '#93a1a1');
      root.style.setProperty('--color-text-secondary', '#839496');
      root.style.setProperty('--color-text-tertiary', '#657b83');
      root.style.setProperty('--color-border', '#586e75');
      root.style.setProperty('--color-green', '#22c55e');
      root.style.setProperty('--color-red', '#ef4444');

      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      // Clear custom properties for light/dark themes (use default CSS)
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--bg-tertiary');
      root.style.removeProperty('--color-text');
      root.style.removeProperty('--color-text-secondary');
      root.style.removeProperty('--color-text-tertiary');
      root.style.removeProperty('--color-border');
      root.style.removeProperty('--color-green');
      root.style.removeProperty('--color-red');

      root.setAttribute('data-theme', resolvedTheme);
      root.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
