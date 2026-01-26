import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import './index.css'
import App from './App.tsx'

// Detect if running on iOS (native or PWA/Safari)
const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Setup safe area for all platforms
const setupSafeArea = async () => {
  const platform = Capacitor.getPlatform();
  const root = document.documentElement;
  const isIOS = isIOSDevice();

  if (platform === 'android') {
    // Android Native: Set fixed safe area values
    root.style.setProperty('--safe-area-top', '48px');
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
    // iOS Native: Use env() for safe area
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 47px)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 34px)');

    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setOverlaysWebView({ overlay: true });
    } catch (e) {
      console.log('iOS StatusBar setup error:', e);
    }
  } else if (isIOS) {
    // iOS PWA/Safari: Use env() for safe area (works with viewport-fit=cover)
    root.style.setProperty('--safe-area-top', 'env(safe-area-inset-top, 47px)');
    root.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom, 34px)');
  } else {
    // Desktop Web: No safe area needed
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
