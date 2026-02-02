# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Candle Master v1.9.2** is a **Trading Simulator Game & Education Platform**.
- **Core Concept**: Users practice trading on historical data without knowing the stock beforehand (Blind Trading).
- **Gameplay**:
    - Users see candlesticks, MA indicators (20/50), and Volume.
    - Can open up to **3 positions** simultaneously (`MAX_POSITIONS = 3`).
    - Session starts at candle 200 (`startIndex = 199`) with trading days based on subscription.
    - **Free**: 100 trading days | **PRO**: 200 trading days
    - Starting capital: **$100,000** | Default trade amount: **$20,000**
    - Trades execute at the **close price** of the current candle.
    - Commission: 0.15% per trade.
- **Philosophy**: Focus on **Market Direction & Strategy**, not clicking speed.
- **Platform**: Designed for fluid experience across devices (PWA/Mobile/Tablet).

## Current Status (Active Development)

- [x] Core Trading Engine (Blind historical trading)
- [x] Basic Mobile/Desktop UI
- [x] Pattern Academy with tabs (Candlestick + Chart Patterns + Risk Management)
- [x] Chart Patterns with theme-aware images (`public/patterns/`)
- [x] **Authentication**: Google Sign-In (Firebase) - working on Android
- [x] **Safe Area**: Android/iOS notch/camera cutout support
- [x] **Onboarding Tutorial**: 9-slide tutorial for new users
- [x] **Tablet Support**: Landscape mode with optimized UI
- [x] **Theme System**: Background color follows theme across all screens
- [x] **PWA Deployment**: Live on Vercel (auto-deploy from GitHub)
- [x] **Random Time Window**: Fixed data sorting for true random historical periods
- [ ] **Apple Sign-In**: Required by Apple (if Google Sign-In exists)
- [ ] **Subscription System**: RevenueCat scaffold ready, needs API keys
- [ ] **iOS Testing**: Requires Mac + Xcode

## PRO Features

| Feature | Free | PRO |
|---------|------|-----|
| Trading Days/Game | 100 | 200 |
| Stocks | 20 | 300+ |
| Academy (Learn) | Locked | Full Access |
| Position Calculator | Locked | Full Access |
| Reset Game Data | Locked | Available |
| Themes | Sandstone only | All themes |

## Authentication & Services

### Firebase (Google Sign-In)
- **Project**: candle-master-d4bbd
- **Android SHA-1**: `43:12:BE:1E:37:14:05:37:4A:98:71:80:80:E5:38:66:AD:3D:79:8E`
- **Web Client ID**: `951460493496-cs5h9e7e517m4lea6q9lcd49jplfvhv5.apps.googleusercontent.com`
- **Config Files**:
  - Android: `android/app/google-services.json`
  - iOS: `ios/App/App/GoogleService-Info.plist`

### RevenueCat (Subscription - Scaffold Ready)
- **Service File**: `src/services/revenueCatService.ts`
- **Hook**: `src/hooks/useSubscription.ts`
- **Status**: Scaffold ready, needs API keys from RevenueCat dashboard

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Mobile Runtime**: Capacitor 8 (Android/iOS)
- **State Management**: Local State + Context + localStorage (No external Redux/Zustand)
- **Charting**: Custom SVG-based candlestick renderer (see `Chart.tsx`)
- **Styling**: Vanilla CSS + Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Data Sources & Architecture

### Stock Data (`src/utils/`)
- **Stock List**: `stocks.json`
    - Separated into `free` (20 stocks) and `pro` (287 stocks) tiers.
    - Covers global markets: US, HK, JP, TH, UK, EU, etc.
- **Data Fetching**: `data.ts`
    - Source: **Stooq API** (Free historical data).
    - Method:
        - **Web**: Uses `corsproxy.io` to bypass CORS.
        - **Native**: Uses `CapacitorHttp` for direct requests.
    - **Data Processing**: Sorts candles by date ascending (Stooq returns descending).
    - **Random Window**: Selects random 250-candle window from full history.
    - **Fallback**: Generates mock geometric brownian motion data if API fails.

### Application Structure
- **Core Logic (`App.tsx`)**: ~1,800 lines. Contains gameplay, tab navigation, Pattern Academy, Game Over, Tablet layout.
- **Styles (`src/styles/appStyles.ts`)**: ~2,100 lines. Centralized CSS constants including TABLET_STYLES.
- **Constants (`src/constants/patterns.tsx`)**:
    - `ACADEMY_PATTERNS`: 20 candlestick patterns (SVG-based)
    - `CHART_PATTERNS`: Image-based patterns (webp in `public/patterns/`)
- **Components**:
    - `Chart.tsx`: SVG candlestick chart with MA20/MA50, volume bars.
    - `PositionSizeCalculator.tsx`: Risk management tool (PRO feature).
- **Hooks**:
    - `useTradingSession.ts`: Core trading state, accepts `isPro` for dynamic maxMoves.
    - `useOrientation.ts`: Device orientation detection.
    - `useSubscription.ts`: PRO subscription state.
- **Theme**: `ThemeContext` - Sandstone (default), Midnight, Solarized.

### Chart Pattern Images
- Location: `public/patterns/`
- Format: `{pattern-name}-l.webp` (light) / `{pattern-name}-d.webp` (dark)
- Size: 600 x 360 px
- Tap-to-expand: Each pattern has detailed usage info (When to use, Confirmation, Target)
- **14 patterns**: double-top, double-bottom, head-shoulders, invert-head-shoulders, diamond-top, diamond-bottom, round-top, round-bottom, ascending-triangle, descending-triangle, bull-flag, bear-flag, rising-wedge, cup-handle

## Important: Working Directory

**Use this folder (no Thai characters in path):**
```
D:\CANDLE MASTER\PROJECT\Candle Master
```

**Do NOT use the old folder:**
```
D:\000 BATT\เรียนสร้าง Application\Candle Master
```
(Thai characters cause Gradle build issues)

## Common Commands

```bash
npm run dev              # Start Vite dev server
npm run dev -- --host    # Dev server accessible from mobile
npm run build            # Type check + Build
npm run lint             # Linting
npm run cap:sync         # Sync to Capacitor
npx cap sync android     # Sync Android only
npx cap sync ios         # Sync iOS only
```

## Android Build Steps

1. `npm run build` - Build web assets
2. `npx cap sync android` - Sync to Android
3. Open Android Studio: `D:\CANDLE MASTER\PROJECT\Candle Master\android`
4. Wait for Gradle Sync
5. Build → Clean Project
6. Build → Build APK(s)
7. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Deployment Info

### PWA (Vercel)
- **Live URL**: https://candle-master.vercel.app/
- **Auto-deploy**: Push to `main` branch → Vercel deploys automatically
- **GitHub Repo**: https://github.com/diydesignbybatt/candle-master (public)

### Android/iOS
- Native projects in `android/` and `ios/`.
- **Always** run `npm run build && npx cap sync` after code changes for mobile.

---

## Skills & Best Practices

> Full skill files: `docs/skills/*.skill`

### 🐛 Debug Master
- **Workflow**: Reproduce → Console → Isolate → Fix
- **Hook issues**: Never call hooks conditionally; use functional updates for stale closures (`setCount(prev => prev + 1)`)
- **State not updating?** State updates are async - use `useEffect` to react to changes
- **Object/Array updates**: Always create new references (`setItems([...items, newItem])`)
- **Quick checklist**: Console errors → Imports → File paths → TypeScript (`npx tsc --noEmit`) → Clear cache

### 🏗️ Project Architect
- **Small** (<10 components): Flat structure
- **Medium** (10-50): Group by type (`components/`, `hooks/`, `services/`)
- **Large** (50+): Feature-first (`features/auth/`, `features/game/`)
- **Use index files** for clean imports: `export { GameBoard } from './components/GameBoard'`
- **Path aliases**: Configure `@/*` in tsconfig for `./src/*`

### 🔒 Security Guard
- **XSS**: Never use `dangerouslySetInnerHTML` without `DOMPurify.sanitize()`
- **API keys**: Server-side only, never in frontend code
- **Passwords**: `bcrypt.hash(password, 12)`, never store plain text
- **CORS**: Specific origins only, never `origin: '*'` in production
- **Validation**: Always validate on backend, frontend validation is UX only
- **Run regularly**: `npm audit` for dependency vulnerabilities

### 📱 React Native Specialist
- **No HTML tags**: `<View>`, `<Text>`, `<Image>` instead of `<div>`, `<span>`, `<img>`
- **All text in `<Text>`**: Bare strings cause runtime errors
- **Flexbox defaults**: RN uses `flex: 0`, always set `flex: 1` explicitly
- **Long lists**: Use `FlatList` not `ScrollView.map()`
- **Platform code**: `Platform.OS === 'ios'` or `*.ios.tsx` / `*.android.tsx` files
- **Always clean up**: Remove listeners in `useEffect` cleanup

### ⚡ Mobile Performance Optimizer
- **Prevent re-renders**: `React.memo()`, `useMemo()`, `useCallback()`
- **FlatList props**: `initialNumToRender={10}`, `removeClippedSubviews={true}`, `getItemLayout`
- **Animations**: Always `useNativeDriver: true` (only for `opacity`, `transform`)
- **Memory leaks**: Check `isMounted` before `setState` in async operations
- **Battery**: Pause updates when `AppState === 'background'`
- **Targets**: Startup <2s, FPS=60, Bundle <20MB Android/<50MB iOS

### 🎨 Mobile UI/UX Designer
- **Touch targets**: Min 44pt (iOS) / 48dp (Android)
- **SafeAreaView**: Always wrap for notched devices
- **Typography**: iOS 17pt body / Android 16sp body
- **Dark mode**: Use `useColorScheme()` and theme context
- **Accessibility**: `accessibilityLabel`, `accessibilityRole` on all interactive elements

### 📦 App Store Publisher
- **Pre-submission**: Privacy Policy required, all features tested, no crashes
- **Screenshots**: Show best feature first, add text overlays
- **Version**: `Major.Minor.Patch` (1.0.0 = redesign, 1.1.0 = features, 1.0.1 = fixes)
- **Common rejections**: Crashes, incomplete features, misleading metadata, unnecessary permissions
- **ASO**: Include primary keyword in title, update keywords based on performance

### 📝 Thai Doc Commenter
- **Tone**: เป็นทางการแต่เข้าใจง่าย (professional but approachable)
- **Tech terms**: Keep English for common terms (React, API, Git)
- **Comment priority**: Why > What - explain reasoning, not obvious code
- **JSDoc format**: `@param`, `@returns`, `@example` in Thai
- **Bad**: `// เพิ่มตัวเลข 1` | **Good**: `// เพิ่มจำนวนครั้งเพื่อติดตามพฤติกรรม`
