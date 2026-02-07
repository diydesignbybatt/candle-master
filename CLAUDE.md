# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Candle Master v2.2.0** is a **Trading Simulator Game & Education Platform**.
- **Core Concept**: Users practice trading on historical data without knowing the stock beforehand (Blind Trading).
- **Gameplay**:
    - Users see candlesticks, MA indicators (20/50), and Volume.
    - Can open up to **3 positions** simultaneously (`MAX_POSITIONS = 3`).
    - Session starts at candle 200 (`startIndex = 199`) with trading days based on subscription.
    - **Free**: 100 trading days | **PRO**: 250 trading days (~1 year cycle)
    - Starting capital: **$100,000** | Default trade amount: **$20,000**
    - Trades execute at the **close price** of the current candle.
    - Commission: 0.15% per trade.
- **Philosophy**: Focus on **Market Direction & Strategy**, not clicking speed.
- **Platform**: Designed for fluid experience across devices (PWA/Mobile/Tablet).

## Current Status (Active Development)

- [x] Core Trading Engine (Blind historical trading)
- [x] Basic Mobile/Desktop UI
- [x] Pattern Academy with tabs (Candlestick + Chart Patterns + Money & Mind)
- [x] Chart Patterns with theme-aware images (`public/patterns/`)
- [x] **Authentication**: Google Sign-In (Firebase) - working on Android
- [x] **Safe Area**: Android/iOS notch/camera cutout support
- [x] **Onboarding Tutorial**: 9-slide tutorial for new users
- [x] **Tablet Support**: Landscape mode with optimized UI
- [x] **Theme System**: Background color follows theme across all screens
- [x] **PWA Deployment**: Live on Cloudflare Pages (auto-deploy from GitHub)
- [x] **Random Time Window**: Fixed data sorting for true random historical periods
- [x] **Onboarding Tutorial**: 9 slides with swipe gestures, 9:16 images
- [x] **PWA Icons**: PNG icons for iOS/Android home screen support
- [x] **Event Mode (PRO)**: 1/7 chance to play historical crisis events (5 events)
- [x] **Character Judge**: Cartoon character result at Game Over based on P&L
- [x] **Multi-Variant Characters**: 39 character images across 13 tiers + 6 boss variants, random selection per tier
- [x] **BGM Music**: Multi-track BGM (2 normal + 2 boss), fade out for boss, visibility pause/resume
- [x] **Crisis Banner**: Red "CRISIS EVENT!" banner animation when event mode triggers
- [x] **Tutorial Screenshots**: Updated 9 high-quality tutorial images (shared with landing page)
- [x] **Touch Swipe Fix**: `touch-action: pan-x` prevents vertical scroll during horizontal swipe
- [ ] **Apple Sign-In**: Required by Apple (if Google Sign-In exists)
- [ ] **Subscription System**: RevenueCat scaffold ready, needs API keys
- [ ] **Stripe (PWA)**: Payment integration for web users — next priority
- [ ] **iOS Testing**: Requires Mac + Xcode

## PRO Features

| Feature | Free | PRO |
|---------|------|-----|
| Trading Days/Game | 100 | 250 |
| Stocks | 20 | 491 (500+) |
| Academy (Learn) | Locked | Full Access |
| Position Calculator | Locked | Full Access |
| Reset Game Data | Locked | Available |
| Themes | Sandstone only | All themes |
| Event Mode | ❌ | 1/7 chance historical crisis |
| Boss Music | ❌ | Special BGM for crisis events |
| Upgrade Prompt | Every 3 games | ❌ |

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

### Subscription Strategy (Multi-Platform)

**สถานะ**: ยังไม่เปิดใช้งาน - รอทดสอบก่อน แต่โค้ดต้องพร้อมเปิดได้ทุกเมื่อ

**แผนการ (Plans):**
| Plan | Product ID (RevenueCat) | ราคา | หมายเหตุ |
|------|------------------------|------|----------|
| PRO Monthly | `candle_master_pro_monthly` | TBD | สมัครรายเดือน |
| PRO Lifetime | `candle_master_pro_lifetime` | TBD | จ่ายครั้งเดียว ใช้ตลอดชีพ |

**แยกช่องทางตาม Platform:**
| Platform | Payment Provider | หมายเหตุ |
|----------|-----------------|----------|
| **PWA (Web)** | **Stripe** | ยังไม่มีโค้ด Stripe ใน app เลย - ต้องสร้างใหม่ |
| **Android** | **RevenueCat** → Google Play Billing | Scaffold พร้อม รอ API keys |
| **iOS** | **RevenueCat** → Apple IAP | Scaffold พร้อม รอ API keys + Mac/Xcode |

**หลักการ:**
- ปุ่ม "Upgrade to PRO" ในหน้า Profile ต้องพร้อมเปลี่ยนเป็นปุ่มจริงได้ทุกเมื่อ
- PWA ต้อง redirect ไป Stripe Checkout (ไม่ผ่าน App Store/Play Store)
- Native apps ต้องใช้ RevenueCat (ข้อบังคับ Apple/Google)
- ใช้ `Capacitor.isNativePlatform()` แยก flow ระหว่าง Web vs Native
- Landing page มี pricing cards ทั้ง Monthly + Lifetime แล้ว → App ต้องมีให้ตรงกัน
- **Lifetime option**: มีใน Landing Page แล้ว แต่ยังไม่ได้ทำใน App → ต้องเพิ่มเมื่อพร้อม

**TODO เมื่อพร้อมเปิด:**
- [ ] สร้าง Stripe products/prices + Checkout Session (สำหรับ PWA)
- [ ] ใส่ RevenueCat API keys (สำหรับ Native)
- [ ] เปลี่ยนปุ่ม Profile จาก toggle mock → เปิด Pricing Modal จริง
- [ ] สร้าง Pricing Modal แสดง Monthly + Lifetime พร้อมปุ่มซื้อ
- [ ] ตรวจ platform แล้ว route ไป Stripe หรือ RevenueCat ตาม platform
- [ ] Sync subscription status ข้าม platform ผ่าน Firebase user ID

### Referral / Affiliate Program (แผนอนาคต)

**สถานะ**: ยังไม่เริ่ม - อยู่ระหว่างเลือก provider

**เป้าหมาย:** ให้ Finfluencer (Financial Influencer) ช่วยโปรโมท Candle Master ผ่าน referral link แล้วได้ commission จาก subscription ที่เกิดขึ้น

**Provider ที่พิจารณา:**
- **Lemon Squeezy** (มีโอกาสสูงสุด) - มี built-in affiliate system, จัดการ payout ให้
- อาจพิจารณา provider อื่นในอนาคต

**สิ่งที่ต้องเตรียมฝั่ง App:**
- [ ] เก็บ referral code / UTM parameter จาก URL เมื่อ user เข้า app ครั้งแรก
- [ ] ผูก referral code กับ Firebase user ID เมื่อสมัคร
- [ ] ส่ง referral attribution ไปยัง payment provider (Stripe/Lemon Squeezy) ตอน checkout
- [ ] Landing page: เพิ่มหน้า affiliate signup + dashboard (ยังไม่ทำ)

**หมายเหตุ:** ถ้าใช้ Lemon Squeezy อาจแทน Stripe สำหรับ PWA payment ได้เลย (Lemon Squeezy = payment + affiliate ในตัว) → ต้องประเมินอีกทีเมื่อถึงเวลา

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
    - Separated into `free` (20 stocks) and `pro` (491 stocks) tiers. Total: 511 stocks.
    - Covers global markets: US, HK, JP, TH, UK, EU, KR, AU, IN, SG, TW, CA, BR, etc.
- **Data Fetching**: `data.ts`
    - Source: **Stooq API** (Free historical data).
    - Method:
        - **Web**: Uses `corsproxy.io` to bypass CORS.
        - **Native**: Uses `CapacitorHttp` for direct requests.
    - **Data Processing**: Sorts candles by date ascending (Stooq returns descending).
    - **Random Window**: Selects random 250-candle window from full history.
    - **Event Mode (PRO)**: 1/7 chance → picks historical crisis event → fetches event-era stock data (dynamic window: min 150, preferred 250 candles).
    - **Fallback**: Generates mock geometric brownian motion data if API fails.

### Application Structure
- **Core Logic (`App.tsx`)**: ~1,900 lines. Contains gameplay, tab navigation, Pattern Academy (incl. Money & Mind with Lucide icons), Game Over, crisis banner, Tablet layout.
- **Styles (`src/styles/appStyles.ts`)**: ~2,200 lines. Centralized CSS constants including TABLET_STYLES.
- **Constants (`src/constants/`)**:
    - `patterns.tsx`: `ACADEMY_PATTERNS` (20 candlestick) + `CHART_PATTERNS` (image-based)
    - `guides.ts`: Money & Mind academy — 9 categories, 30 guide cards with Lucide icons (gold `#D4A017`)
    - `characters.ts`: 13 character tiers (39 images) + 6 boss variants for Game Over judge (random variant per tier based on P&L + trades)
- **Services**:
    - `soundService.ts`: Sound effects + multi-track BGM system (2 normal + 2 boss tracks, fade out, autoplay unlock, pause/resume)
- **Utils**:
    - `data.ts`: Stock data fetching, event mode logic, CSV parsing
    - `historicalEvents.ts`: 5 historical crisis events (Dot-Com, 2008, COVID, Oil, China)
- **Components**:
    - `Chart.tsx`: SVG candlestick chart with MA20/MA50, volume bars.
    - `PositionSizeCalculator.tsx`: Risk management tool (PRO feature).
- **Hooks**:
    - `useTradingSession.ts`: Core trading state, accepts `isPro` for dynamic maxMoves.
    - `useOrientation.ts`: Device orientation detection.
    - `useSubscription.ts`: PRO subscription state (`candle_master_subscription` key in localStorage).
    - **localStorage keys**: `candle_master_onboarding_complete`, `candle_master_history`, `candle_master_subscription`, `candle_master_games_today`, `candle_master_games_date`, `candle_master_games_played` (upgrade prompt counter)
- **Theme**: `ThemeContext` - Sandstone (default), Midnight, Solarized.
- **Audio**: `public/sounds/` — bgm-1.mp3, bgm-3.mp3 (normal), boss-1/2.mp3 (event), volume 0.15 (15%)

### Chart Pattern Images
- Location: `public/patterns/`
- Format: `{pattern-name}-l.webp` (light) / `{pattern-name}-d.webp` (dark)
- Size: 600 x 360 px
- Tap-to-expand: Each pattern has detailed usage info (When to use, Confirmation, Target)
- **14 patterns**: double-top, double-bottom, head-shoulders, invert-head-shoulders, diamond-top, diamond-bottom, round-top, round-bottom, ascending-triangle, descending-triangle, bull-flag, bear-flag, rising-wedge, cup-handle

### Money & Mind Academy (`src/constants/guides.ts`)
- **Tab label**: "Money & Mind" (Academy tab → 3rd sub-tab)
- **9 categories** displayed in 3-column grid, each drills into a carousel of guide cards
- **30 total cards** with content fields: `bullets`, `keyPoint`, `proTips`, `dosDonts`, `warnings`, `examples`
- **Icons**: Lucide React components (gold color `#D4A017`), mapped via `GUIDE_ICONS` in App.tsx
- **Data-driven**: `RISK_CATEGORIES` registry + `RISK_GUIDE_MAP` lookup — add new categories by adding array + registry entry

| # | Category Key | Cards | Description |
|---|-------------|-------|-------------|
| 1 | `sizing` | 5 | Position Sizing — risk per trade, stop loss, R:R, diversification, leverage |
| 2 | `stoploss` | 4 | Stop Loss Strategy — why, types, placement, common mistakes |
| 3 | `riskReward` | 3 | Risk-Reward Ratio — understanding R:R, finding setups, expectancy |
| 4 | `drawdown` | 3 | Drawdown Management — recovery math, losing streaks, circuit breakers |
| 5 | `diversification` | 2 | Diversification — spreading risk, portfolio heat |
| 6 | `psychology` | 4 | Trading Psychology — fear/greed, discipline, losses, mindfulness |
| 7 | `preservation` | 2 | Capital Preservation — survival first, practical rules |
| 8 | `tradingPlan` | 3 | Trading Plan — why, components, daily routine/system |
| 9 | `scaling` | 4 | Scale In/Out — what/why, when, pullbacks, critical rules |

## Important: Working Directory

**Primary Working Folder:**
```
E:\CANDLE MASTER\PROJECT\Candle Master
```

**Do NOT use the old folder:**
```
D:\000 BATT\เรียนสร้าง Application\Candle Master
```
(Thai characters cause Gradle build issues)

## Git Branches

| Branch | Purpose | Deployment |
|--------|---------|------------|
| `main` | Production | Cloudflare Pages (auto-deploy) |
| `dev-lab` | Testing/Development | Cloudflare Pages |

**Workflow**:
1. Create feature branches from `dev-lab` for new features
2. Test on `dev-lab`, when stable merge to `main`
3. Push to `main` → Cloudflare Pages deploys automatically

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

### Domain Structure (candlemaster.app)
| Subdomain | Purpose | Repo | Platform | Status |
|-----------|---------|------|----------|--------|
| `candlemaster.app` | Landing Page (SEO) | candle-master-landing | Cloudflare Pages | ✅ Live |
| `app.candlemaster.app` | Mobile App (PWA) | candle-master | Cloudflare Pages | ✅ Live |
| `web.candlemaster.app` | Desktop/iPad App | candle-master-web | Cloudflare Pages | DNS Ready |

### Landing Page (Astro)
- **Live URL**: https://candlemaster.app
- **Repo**: https://github.com/diydesignbybatt/candle-master-landing
- **Framework**: Astro + Cloudflare adapter
- **Location**: `E:\CANDLE MASTER\PROJECT\candle-master-landing`

### PWA (Cloudflare Pages) — Primary
- **Live URL**: https://app.candlemaster.app (production)
- **Pages URL**: https://candle-master.pages.dev/
- **Auto-deploy**: Push to `main` branch → Cloudflare Pages deploys automatically
- **GitHub Repo**: https://github.com/diydesignbybatt/candle-master (public)
- **Dashboard**: https://dash.cloudflare.com/ → Workers & Pages → candle-master
- **Functions**: `/functions/api/stock.ts` (Cloudflare Workers format)
- **Config**: `wrangler.toml`

### Cloudflare Pages Commands
```bash
npm run pages:dev      # Local dev with Wrangler
npm run pages:deploy   # Build and deploy to Cloudflare
```

**Note**: ไม่ใช้ Vercel แล้ว — ใช้ Cloudflare Pages เท่านั้น (unlimited bandwidth, Workers edge functions)

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
