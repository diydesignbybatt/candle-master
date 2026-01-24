# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Candle Master v1.5.1** is a **Trading Simulator Game & Education Platform**.
- **Core Concept**: Users practice trading on historical data without knowing the stock beforehand (Blind Trading).
- **Gameplay**:
    - Users see candlesticks, MA indicators (20/50), and Volume.
    - Can open up to **3 positions** simultaneously (`MAX_POSITIONS = 3`).
    - Session starts at candle 100 (`startIndex = 99`) with **100 moves forward** (`maxMoves = 100`).
    - Trades execute at the **close price** of the current candle.
    - Commission: 0.15% per trade.
- **Philosophy**: Focus on **Market Direction & Strategy**, not clicking speed.
- **Platform**: Designed for fluid experience across devices (PWA/Mobile).

## Current Status (Active Development)

- [x] Core Trading Engine (Blind historical trading)
- [x] Basic Mobile/Desktop UI
- [ ] **Tablet Support**: Currently unimplemented.
- [ ] **Tablet Design Goal**: **Landscape Mode ONLY** for optimal UI layout.

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
    - source: **Stooq API** (Free historical data).
    - Method:
        - **Web**: Uses `corsproxy.io` to bypass CORS.
        - **Native**: Uses `CapacitorHttp` for direct requests.
    - **Fallback**: Generates mock geometric brownian motion data if API fails.

### Application Structure
- **Core Logic (`App.tsx`)**: Significantly refactored and slimmed down (under 1000 lines). Contains active gameplay logic, tab navigation, and Game Over logic.
- **Styles (`src/styles/appStyles.ts`)**: Centralized style repository containing Global, UI, and Modal CSS constants.
- **Components**:
    - `Chart.tsx`: SVG-based candlestick chart with MA20/MA50 lines, volume bars, theme-aware colors, horizontal scroll.
    - `PositionSizeCalculator.tsx`: Risk management tool.
- **Hooks**:
    - `useTradingSession.ts`: Core trading state (positions, balance, P&L, game over logic).
    - `useOrientation.ts`: Device orientation detection.
- **Theme**: Managed via `ThemeContext`. Supported themes: **Sandstone** (Default), **Midnight**, and **Solarized**.

## Common Commands

```bash
npm run dev              # Start Vite dev server
npm run build            # Type check + Build
npm run lint             # Linting
npm run cap:sync         # Sync to Capacitor
npm run cap:run:android  # Run on Android
npm run cap:run:ios      # Run on iOS
```

## Deployment Info
- **Android/iOS**: Native projects in `android/` and `ios/`.
- **Always** run `npm run cap:sync` after building for mobile.

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
