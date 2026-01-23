# Candle Master

A professional trading application with advanced candlestick chart analysis, technical indicators, and position calculator.

## Version

**v1.4.0**

## Features

- Interactive candlestick charts with zoom and pan
- Real-time price tracking for Thai stocks (SET)
- Technical indicators:
  - Moving Averages (MA)
  - Volume analysis
- Position calculator for risk management
- Dark mode support
- PWA (Progressive Web App) support
- Native mobile apps (iOS & Android) via Capacitor

## Tech Stack

- **Frontend**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 7.2.4
- **Charts**: Lightweight Charts 5.1.0
- **Mobile**: Capacitor 8.0.1
- **UI**: Framer Motion + Lucide Icons
- **Date Handling**: date-fns 4.1.0

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Mobile Development

### Android

```bash
# Build and sync
npm run cap:sync

# Open Android Studio
npm run cap:android

# Run on Android device
npm run cap:run:android
```

### iOS

```bash
# Build and sync
npm run cap:sync

# Open Xcode
npm run cap:ios

# Run on iOS device
npm run cap:run:ios
```

## Project Structure

```
candle-master/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── assets/           # Static assets
├── android/              # Android native project
├── ios/                  # iOS native project
├── public/               # Public assets
└── dist/                 # Production build output
```

## Deployment

### Web (PWA)
Build and deploy the `dist/` folder to any static hosting service.

### Android (Google Play Store)
1. Build the app: `npm run cap:sync`
2. Open Android Studio: `npm run cap:android`
3. Generate signed APK/Bundle
4. Upload to Google Play Console

### iOS (App Store)
1. Build the app: `npm run cap:sync`
2. Open Xcode: `npm run cap:ios`
3. Archive and upload to App Store Connect
4. Submit for review

## License

Private project

## Author

Developed with React, TypeScript, and Capacitor
