import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.candlemaster.app',
  appName: 'Candle Master',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // Uncomment for local dev testing:
    // url: 'http://192.168.1.x:5173',
    // cleartext: true
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A1A1A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1A1A1A',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '951460493496-cs5h9e7e517m4lea6q9lcd49jplfvhv5.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
