import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import './index.css'
import App from './App.tsx'

// Setup safe area for Android
const setupSafeArea = async () => {
  const platform = Capacitor.getPlatform();
  const root = document.documentElement;

  if (platform === 'android') {
    // Android: Set fixed safe area values
    // Status bar is typically 24dp (about 34px on most devices)
    // Navigation bar is typically 48dp (about 68px)
    root.style.setProperty('--safe-area-top', '34px');
    root.style.setProperty('--safe-area-bottom', '20px');

    // Make status bar transparent
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#00000000' });
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
      console.log('StatusBar setup error:', e);
    }
  } else if (platform === 'ios') {
    // iOS: env() works natively, but set fallback
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 47px)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 34px)');
  } else {
    // Web: No safe area needed
    root.style.setProperty('--safe-area-top', '0px');
    root.style.setProperty('--safe-area-bottom', '0px');
  }
};

// Initialize safe area before render
setupSafeArea().then(() => {
  createRoot(document.getElementById('root')!).render(
    <App />
  )
});
