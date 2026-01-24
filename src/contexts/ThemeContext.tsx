import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'midnight' | 'sandstone' | 'solarized';
export type ResolvedTheme = 'midnight' | 'sandstone' | 'solarized';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'candle_master_theme';

function getSavedTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'midnight' || saved === 'sandstone' || saved === 'solarized') {
      return saved;
    }
  }
  return 'sandstone';
}


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(getSavedTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getSavedTheme);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
    setResolvedTheme(newMode);
  }, []);

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
      // Default to sandstone if somehow nothing matches
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
