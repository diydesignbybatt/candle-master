# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Candle Master v3.0.0** is a **Trading Simulator Game & Education Platform**.
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
- [x] **Stripe (PWA)**: Checkout Sessions for Monthly ($3.99) + Yearly ($19.99) via Cloudflare Workers
- [x] **Stripe Live Mode**: ✅ Switched from test → live keys (Feb 2026)
- [x] **Stripe Webhook**: Webhook endpoint configured → `https://app.candlemaster.app/api/stripe/webhook`
- [x] **Cloudflare KV**: SUBSCRIPTIONS namespace created + env vars set (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRO_MONTHLY_PRICE_ID, STRIPE_PRO_YEARLY_PRICE_ID)
- [x] **Security Hardening v1**: Firebase Auth middleware, CORS lockdown, input validation, webhook idempotency, security headers (Feb 2026)
- [x] **Lifetime → Yearly Migration**: เปลี่ยนทุกไฟล์จาก lifetime เป็น yearly (useSubscription, stripeService, App.tsx, webhook, checkout, status)
- [x] **Firebase Auth (Web)**: Real Google Sign-In via `signInWithPopup` + `prompt: 'select_account'`
- [x] **Thank You Modal**: Full-screen modal after Stripe payment (mascot + celebration animation)
- [x] **Auto PRO Upgrade**: Retry logic (5x, 2s interval) for webhook timing after payment
- [x] **Stripe Return Fix**: Save `?stripe=success` to React state before URL cleanup (fixes race with Firebase Auth)
- [x] **Welcome Screen**: Uncle teaching mascot (circular) + Geist font + gold "CANDLE MASTER" title
- [x] **Landing Page Payment Links**: Stripe Payment Links on landing page (Monthly + Lifetime)
- [x] **Favicon**: Uncle mascot favicon for both App and Landing Page
- [x] **Web Audio API**: BGM volume control via GainNode (dB-based), SFX 0dB / BGM 0dB
- [x] **Music Default On**: BGM enabled by default for new users, autoplay unlock on first interaction
- [x] **Music Toggle on Chart**: Small 28x28 button below zoom controls on trade screen
- [x] **PRO Badge Fix**: Lifetime badge aligned right, ∞ icon golden, Star icon forced gold on Sandstone
- [x] **Test PRO Toggle**: Dashed "Activate Test PRO / FOR TEST" button on Profile for testers
- [x] **OG Image Updated**: Uncle mascot teaching trade image for social sharing (landing page)
- [x] **RevenueCat**: ✅ Fully configured — Products imported, Entitlement `pro` created, Offering `default` with Monthly + Yearly packages
- [x] **Google Play Subscriptions**: ✅ `candle_master_pro_monthly` ($3.99/mo) + `candle_master_pro_yearly` ($19.99/yr) created & active
- [x] **Google Cloud Pub/Sub**: ✅ API enabled + Service Account has Pub/Sub Admin role
- [x] **Stripe Live Mode**: ✅ Switched from test → live keys
- [x] **Favicon**: Uncle mascot favicon for both App and Landing Page
- [x] **Install Page Icon**: Uncle mascot replaces candlestick SVG on install pages
- [ ] **iOS Testing**: Requires Mac + Xcode

## PRO Features

| Feature | Free | PRO Lifetime ฿99 |
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
| Payment | — | One-time ฿99 (TH) / $3.99 (USD) via Play Store |

## Account Management

| Platform | Email | หมายเหตุ |
|----------|-------|----------|
| **Apple Developer** | battia14@gmail.com | ✅ สมัครแล้ว ($99/ปี) |
| **Google Play Console** | pathofmeow.dev@gmail.com | สมัครแล้ว ($25) |
| **Firebase** | diydesignbybatt@gmail.com | เจ้าของ project (candle-master-d4bbd) |
| **Cloudflare** | diydesignbybatt@gmail.com | Pages + Workers + KV |
| **GitHub** | diydesignbybatt@gmail.com | candle-master repo |

**หมายเหตุ**: ใช้หลาย email แต่ไม่มีปัญหาทางเทคนิค — RevenueCat เชื่อม Google Play ด้วย Service Account Key (ไม่ผูกกับ email)

---

## Authentication & Services

### Firebase (Google Sign-In)
- **Project**: candle-master-d4bbd
- **Google Cloud Project**: candle-master (ID: candle-master-d4bbd)
- **authDomain**: `candle-master-d4bbd.firebaseapp.com` (ใช้ default — custom domain ต้อง setup reverse proxy)
- **Android SHA-1**: `43:12:BE:1E:37:14:05:37:4A:98:71:80:80:E5:38:66:AD:3D:79:8E`
- **Web Client ID**: `951460493496-cs5h9e7e517m4lea6q9lcd49jplfvhv5.apps.googleusercontent.com`
- **OAuth Redirect URIs** (ตั้งใน Google Cloud Console → Credentials → Web client):
  - `https://candle-master-d4bbd.firebaseapp.com/__/auth/handler`
  - `https://candlemaster.app/__/auth/handler`
- **Authorized JavaScript Origins**:
  - `http://localhost`, `http://localhost:5000`
  - `https://candle-master-d4bbd.firebaseapp.com`
  - `https://candlemaster.app`
- **Firebase Authorized Domains**: `candlemaster.app` (เพิ่มใน Firebase Console → Authentication → Settings)
- **Config Files**:
  - Web: `src/config/firebase.ts`
  - Android: `android/app/google-services.json`
  - iOS: `ios/App/App/GoogleService-Info.plist`
- **API Key Security**: Firebase API key (`AIzaSy...`) เป็น public key ปลอดภัย — ควรเพิ่ม HTTP referrer restrictions ใน Google Cloud Console
- **Web Auth Flow**: `signInWithPopup(auth, googleProvider)` ใน `src/contexts/AuthContext.tsx`

### RevenueCat (Subscription - ✅ Fully Configured)
- **Service File**: `src/services/revenueCatService.ts`
- **Hook**: `src/hooks/useSubscription.ts`
- **Status**: ✅ Code complete + Dashboard fully configured
- **Android API Key**: `goog_peJadJCRMfojllXEemlRszrhyep`
- **RevenueCat App ID**: `app866dc003da`
- **Package**: `com.candlemaster.app`
- **Service Account**: `revenuecat@candle-master-d4bbd.iam.gserviceaccount.com` (Pub/Sub Admin ✅)
- **Entitlement**: `pro` ✅ (created, all 4 products attached)
- **Offering**: `default` ✅ (RevenueCat ID: `ofrngf2f1708a7d`)
- **Products (Google Play)**:
  - `candle_master_pro_monthly:monthly-base` — $3.99/mo ✅
  - `candle_master_pro_yearly:yearly-base` — $19.99/yr ✅
- **Products (Test Store)**:
  - `monthly` (test) ✅
  - `yearly` (test) ✅
- **Packages**: `$rc_monthly` + `$rc_annual` ✅

### Per-User Subscription Scoping
- **localStorage keys scoped by userId**: `candle_master_subscription_${userId}`, `candle_master_plan_${userId}`
- **เหตุผล**: ป้องกัน PRO status leak ข้าม Google accounts บนเครื่องเดียวกัน
- **Migration**: เมื่อ user login → ย้าย key เก่า (un-scoped) ไปเป็น per-user key อัตโนมัติ แล้วลบ key เก่าทิ้ง
- **useEffect re-run**: เมื่อ userId เปลี่ยน (sign-in/sign-out) → reset state เป็น free → ตรวจ subscription ใหม่
- **Hook call**: `useSubscription(user?.id ?? null)` ใน App.tsx

### Payment Architecture (v3.0+)

**สถานะ**: ✅ Migrated to lifetime model (May 2026) — Stripe banned, no web payment

**Plans:**
| Plan | Product ID (RevenueCat) | ราคา | หมายเหตุ |
|------|------------------------|------|----------|
| PRO Lifetime | `candle_master_pro_lifetime` | ฿99 (TH) / $3.99 (USD) | One-time purchase, no expiration |

**แยกช่องทางตาม Platform:**
| Platform | Payment Provider | สถานะ |
|----------|-----------------|----------|
| **Web/PWA** | ❌ ไม่มี — แสดง "Get on App Store / Play Store" CTA | Stripe banned, web revenue skipped |
| **Android** | **RevenueCat** → Google Play Managed Product | ⚠️ ต้องสร้าง `candle_master_pro_lifetime` product ใน Play Console |
| **iOS** | **RevenueCat** → Apple IAP (Non-Consumable) | รอ Mac/CodeMagic + Apple Sign-In |

**หลักการ:**
- ใช้ `Capacitor.isNativePlatform()` แยก flow ระหว่าง Web vs Native (Web fallback = info card, Native = RevenueCat)
- Lifetime = one-time purchase, ไม่มี subscription cancellation/renewal logic
- ไม่มี Customer Portal, ไม่มี cancel_at_period_end tracking
- หลังซื้อสำเร็จ → แสดง ThankYouModal celebration (5s auto-dismiss)

**Removed (v3.0):**
- Stripe Checkout, Stripe Webhook, Customer Portal
- Monthly + Yearly subscription products
- `proPlan`, `purchaseProWeb`, `openManageSubscription`, `willRenew`, `expirationDate` from useSubscription
- All `functions/api/stripe/*` Cloudflare Functions
- All Stripe env vars in Cloudflare Pages

### Subscription Roadmap (Phased)

| Phase | Feature | Status |
|-------|---------|--------|
| **1** | Stripe Checkout (PWA) — ซื้อ PRO ได้ | ✅ Done + Deployed (Live) |
| **2** | Cancellation (App) — Manage Subscription → Stripe Customer Portal | ✅ Done |
| 3 | Landing Page Profile — Login/Profile บน landing page ดูสถานะ + ยกเลิก | ⬜ |
| 4 | Lemon Squeezy Affiliate — referral/affiliate system | ⬜ |
| 5 | RevenueCat Native — iOS/Android payment | ⬜ |

### Security Hardening (Feb 2026) ✅

**สถานะ**: ✅ Deployed to production — Soft enforcement mode (log warnings, ยังอนุญาตผ่าน)

**ปัญหาที่แก้:**
1. ❌ API endpoints ทั้งหมดไม่มี authentication → ✅ Firebase Auth middleware
2. ❌ CORS เปิดกว้าง `*` → ✅ Origin allowlist (app.candlemaster.app, candlemaster.app, localhost)
3. ❌ ไม่มี input validation → ✅ Regex validation สำหรับ symbol, userId, priceId
4. ❌ Webhook scan O(n) → ✅ Reverse index `stripe_customer:{customerId}` → O(1) lookup
5. ❌ ไม่มี idempotency → ✅ Event ID tracking ด้วย TTL 24 ชม.
6. ❌ Error messages expose Stripe errors → ✅ Generic error messages (log server-side only)
7. ❌ Guest ID ใช้ `Date.now()` (guessable) → ✅ `crypto.randomUUID()`

**ไฟล์ที่สร้างใหม่:**
| ไฟล์ | หน้าที่ |
|------|--------|
| `functions/api/_shared/auth.ts` | Firebase token verifier (Google JWKS + Web Crypto RS256) |
| `functions/api/_shared/cors.ts` | CORS origin allowlist utility |
| `functions/api/_shared/validation.ts` | Input validation (symbol, userId) |
| `public/_headers` | Security headers (HSTS, X-Frame-Options, etc.) |

**ไฟล์ที่แก้ไข:**
- `functions/api/stripe/checkout.ts` — auth check, priceId allowlist, CORS, error sanitize
- `functions/api/stripe/status.ts` — auth check, userId validation, CORS
- `functions/api/stripe/portal.ts` — auth check, userId validation, CORS, error sanitize
- `functions/api/stripe/webhook.ts` — reverse index, idempotency, try-catch hardening
- `functions/api/stock.ts` — symbol validation, `new URL()` (SSRF prevention), CORS
- `src/contexts/AuthContext.tsx` — เพิ่ม `getIdToken()`, แก้ guest ID
- `src/services/stripeService.ts` — ส่ง `Authorization: Bearer` header
- `src/hooks/useSubscription.ts` — รับ `getIdToken` parameter, ส่ง token ไปทุก API call
- `src/App.tsx` — ส่ง `getIdToken` ให้ `useSubscription()`

**⚠️ TODO (ต้องทำภายหลัง):**
- [x] **Cloudflare Rate Limiting**: ตั้งค่าแล้ว — 5 req/10s สำหรับ `/api/stripe/*` (Free plan, 1 rule)

**CORS Allowed Origins:**
```
https://app.candlemaster.app
https://candlemaster.app
http://localhost:5173
http://localhost:8788
capacitor://localhost
http://localhost
```

**Auth Flow:**
1. Frontend: `AuthContext.getIdToken()` → `auth.currentUser?.getIdToken()`
2. Frontend: ส่ง `Authorization: Bearer <token>` header ในทุก Stripe API call
3. Backend: `_middleware.ts` → verify token ด้วย Google JWKS
4. Backend: แต่ละ endpoint ตรวจ `authenticatedUser.uid === userId`
5. Webhook: ไม่ใช้ auth (ใช้ Stripe signature verification แทน)

**Android/iOS ไม่กระทบ:**
- Native app ใช้ RevenueCat (ไม่เรียก Stripe API)
- Stock API ไม่ต้อง auth
- CORS allowlist มี `capacitor://localhost` แล้ว

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
    - **Event Mode (PRO)**: 1/7 chance → picks historical crisis event → fetches event-era stock data (dynamic window: min 200, preferred 250 candles).
    - **Fallback**: Generates mock geometric brownian motion data if API fails.

### Application Structure
- **Core Logic (`App.tsx`)**: ~1,900 lines. Contains gameplay, tab navigation, Pattern Academy (incl. Money & Mind with Lucide icons), Game Over, crisis banner, Tablet layout, isPro race condition fix.
- **Styles (`src/styles/appStyles.ts`)**: ~2,200 lines. Centralized CSS constants including TABLET_STYLES + mobile landscape `@media` query.
- **Constants (`src/constants/`)**:
    - `patterns.tsx`: `ACADEMY_PATTERNS` (20 candlestick) + `CHART_PATTERNS` (image-based)
    - `guides.ts`: Money & Mind academy — 9 categories, 30 guide cards with Lucide icons (gold `#D4A017`)
    - `characters.ts`: 13 character tiers (39 images) + 6 boss variants for Game Over judge (random variant per tier based on P&L + trades)
- **Services**:
    - `soundService.ts`: Sound effects + multi-track BGM system (Web Audio API GainNode, dB-based volume, 2 normal + 2 boss tracks, fade out via linearRamp, autoplay unlock, pause/resume)
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
- **Audio**: `public/sounds/` — bgm-1.mp3, bgm-3.mp3 (normal), boss-1/2.mp3 (event), BGM 0dB / SFX 0dB (Web Audio API), AudioContext resume for Android WebView

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
E:\CANDLE-MASTER\PROJECT\Candle-Master-app
```

**Do NOT use the old folder:**
```
D:\000 BATT\เรียนสร้าง Application\Candle Master
E:\CANDLE MASTER\PROJECT\Candle Master
```
(Thai characters cause Gradle build issues)

## Git Branches

| Branch | Purpose | Deployment |
|--------|---------|------------|
| `dev-lab` | **Production** | Cloudflare Pages (auto-deploy to app.candlemaster.app) |
| `main` | Integration/Staging | Cloudflare Pages (Preview only) |

**⚠️ IMPORTANT: `dev-lab` = Production branch ใน Cloudflare Pages**

**Workflow**:
1. Develop and commit on `main`
2. Merge `main` → `dev-lab` แล้ว push `dev-lab` เพื่อ deploy Production
3. `git checkout dev-lab && git merge main && git push origin dev-lab && git checkout main`

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

### Release Build (.aab for Play Store)
```bash
npm run build                    # Build web assets
npx cap sync android             # Sync to Android
cd android && ./gradlew clean bundleRelease   # Build signed .aab
```
- **Output**: `android/app/build/outputs/bundle/release/app-release.aab`
- **⚠️ ต้องเพิ่ม versionCode ใน `android/app/build.gradle` ทุกครั้งก่อนอัปโหลด Play Console**
- **Signing**: ใช้ `release.keystore` (alias: candle-master, password: CandleMaster2026)

### Debug Build (.apk for local testing)
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```
- **Output**: `android/app/build/outputs/apk/debug/app-debug.apk`

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
- **Location**: `E:\CANDLE-MASTER\PROJECT\candle-master-landing`

### PWA (Cloudflare Pages) — Primary
- **Live URL**: https://app.candlemaster.app (production)
- **Pages URL**: https://candle-master.pages.dev/
- **Auto-deploy**: Push to `dev-lab` branch → Cloudflare Pages deploys Production automatically
- **⚠️ Production branch = `dev-lab`** (ไม่ใช่ main! push main จะได้แค่ Preview)
- **GitHub Repo**: https://github.com/diydesignbybatt/candle-master (public)
- **Dashboard**: https://dash.cloudflare.com/ → Workers & Pages → candle-master
- **Functions**: `/functions/api/stock.ts` (Cloudflare Workers format)
- **Config**: `wrangler.toml`

### Cloudflare Pages Commands
```bash
npm run pages:dev      # Local dev with Wrangler
npm run build && npx wrangler pages deploy dist --project-name=candle-master   # Build + Deploy to Cloudflare
```

**Wrangler Project Names** (ตรวจด้วย `npx wrangler pages project list`):
| Project Name | Domain | ใช้สำหรับ |
|-------------|--------|----------|
| `candle-master` | app.candlemaster.app | React PWA App |
| `candle-master-landing` | candlemaster.app | Astro Landing Page |

**Note**: ไม่ใช้ Vercel แล้ว — ใช้ Cloudflare Pages เท่านั้น (unlimited bandwidth, Workers edge functions)
**Note**: ต้อง `npx wrangler login` ครั้งแรก (เปิด browser กด Allow) — login ครั้งเดียวพอ

### Important URLs & Deployment Notes
- **App URL**: `https://app.candlemaster.app` (React PWA) — Stripe redirect ต้องชี้ที่นี่
- **Landing URL**: `https://candlemaster.app` (Astro) — Payment Links ของ Stripe ไม่ redirect กลับ
- **Stripe Checkout success_url**: `https://app.candlemaster.app/?stripe=success&session_id={CHECKOUT_SESSION_ID}`
- **Stripe Checkout cancel_url**: `https://app.candlemaster.app/?stripe=cancel`
- **Build command ที่ Cloudflare ใช้**: `tsc -b` (strict กว่า `tsc --noEmit` — ตรวจ unused variables)
- **Geist font**: โหลดจาก CDN ใน `index.html` — ใช้ทั้ง Welcome Screen และ Thank You Modal

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
- **API keys**: Server-side only, never in frontend code (Stripe secret key อยู่ใน Cloudflare env vars เท่านั้น)
- **CORS**: Origin allowlist ใน `functions/api/_shared/cors.ts` — ห้ามเปลี่ยนเป็น `*`
- **Auth**: Firebase token verification ใน `functions/api/_shared/auth.ts` — ใช้ Google JWKS (ไม่ใช่ firebase-admin)
- **Validation**: Backend validation ใน `functions/api/_shared/validation.ts` — symbol regex, userId format
- **Error messages**: ห้าม expose Stripe/internal errors ให้ client — ใช้ generic message, log server-side
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

---

## iOS Development Plan (ไม่มี Mac)

### แผนที่เลือก: Codemagic (Free Tier) + TestFlight

**ค่าใช้จ่าย**: ~$99/ปี (Apple Developer Program เท่านั้น)

| รายการ | ค่าใช้จ่าย |
|--------|-----------|
| Apple Developer Program | $99/ปี |
| Codemagic CI/CD (500 min ฟรี/เดือน, ~33 builds) | $0 |
| TestFlight (ทดสอบบน iPhone) | $0 |

### ขั้นตอน Setup
1. สมัคร Apple Developer Program ($99) ที่ developer.apple.com
2. สร้าง App Record ใน App Store Connect (ผ่านเว็บ)
3. สร้าง App Store Connect API Key (.p8 file) ผ่านเว็บ
4. สมัคร Codemagic → เชื่อม GitHub repo (candle-master)
5. Codemagic จัดการ certificates + provisioning profiles อัตโนมัติ
6. Push code → Codemagic build .ipa → อัปโหลดขึ้น TestFlight
7. ทดสอบบน iPhone ผ่าน TestFlight
8. Submit ขึ้น App Store ผ่าน App Store Connect เว็บ

### ก่อน Submit ต้องทำ
- [ ] **Apple Sign-In**: Apple บังคับ — ถ้ามี Google Sign-In ต้องมี Apple Sign-In ด้วย
- [ ] **RevenueCat (iOS IAP)**: Apple บังคับใช้ In-App Purchase สำหรับ digital goods — ใช้ Stripe ไม่ได้บน iOS native → ใช้ RevenueCat ที่ scaffold พร้อมแล้ว
- [ ] **Privacy Policy**: จำเป็นสำหรับ App Store submission

### ทางเลือกสำรอง (ถ้าต้องการ Mac จริงๆ)
| Service | ราคา | หมายเหตุ |
|---------|------|----------|
| Scaleway (เช่ารายชั่วโมง) | ~$0.21/ชม. | ถูกสุด จ่ายตามใช้ |
| Macly.io (เช่ารายวัน) | $14.99/วัน | เหมาะ setup ครั้งเดียว |
| MacinCloud (เช่ารายเดือน) | ~$25-65/เดือน | มี Xcode พร้อม |
| GitHub Actions (public repo) | ฟรี | ต้อง config workflow เอง |
| Xcode Cloud (แถม dev account) | ฟรี 25 ชม./เดือน | setup ครั้งแรกต้องใช้ Mac |
| Capawesome Cloud | $9/เดือน | สร้างมาเพื่อ Capacitor โดยเฉพาะ |

---

## Google Play Store Submission Checklist

### สถานะ: Internal Testing บน Google Play ✅ | รอ Google Approve Bank Account ⏳

### ✅ Blockers ที่แก้แล้ว

**1. Signing Configuration ✅**
- [x] Generate release keystore (`android/app/release.keystore`)
  - Alias: `candle-master` | Password: `CandleMaster2026`
  - SHA-1 (Upload): `21:3F:43:DD:B5:85:53:01:CB:40:67:47:26:76:64:21:47:9D:08:F8`
  - ⚠️ **ห้ามหาย! Backup ไว้ที่ปลอดภัย**
- [x] เพิ่ม signingConfigs ใน `android/app/build.gradle`
- [x] เก็บ keystore ใน `android/app/` (อยู่ใน .gitignore)

**2. Code Obfuscation ✅**
- [x] เปลี่ยน `minifyEnabled` เป็น `true` ใน release build
- [x] ทดสอบว่า ProGuard ไม่ทำ app พัง

**3. Play App Signing ✅**
- [x] Enroll ใน Play App Signing (Google จัดการ signing key)
- [x] Play App Signing SHA-1: `2E:C8:54:E3:F0:EA:23:D5:8A:E9:80:85:BC:8C:12:7C:EE:B5:66:C1`
- [x] เพิ่ม SHA-1 เข้า Firebase Console → google-services.json อัปเดตแล้ว
- [x] Google Sign-In ทำงานได้บน production build

**4. Internal Testing ✅**
- [x] อัปโหลด .aab ขึ้น Play Console (Internal Testing track)
- [x] ทดสอบการติดตั้ง + Google Sign-In บน device จริง
- [x] Version ล่าสุด: 2.4.0 (versionCode 11)

### 🔴 Blockers ที่เหลือ (ต้องแก้ก่อน Production)

**1. RevenueCat (Native IAP) — ✅ Dashboard Complete, รอทดสอบ**
- [x] สมัคร RevenueCat → ใส่ API key (`goog_peJadJCRMfojllXEemlRszrhyep`)
- [x] สร้าง Google Play Service Account + JSON key + อัปโหลดไป RevenueCat
- [x] Service Account invite ใน Play Console + ให้สิทธิ์ financial data + manage subscriptions
- [x] Google Cloud Pub/Sub API enabled + Service Account มี Pub/Sub Admin role
- [x] Implement `revenueCatService.ts` — code สมบูรณ์แล้ว
- [x] เปลี่ยน Lifetime → Yearly ทุกไฟล์ (frontend + backend)
- [x] สร้าง Subscription Products ใน Play Console:
  - `candle_master_pro_monthly` ($3.99/mo, base plan: `monthly-base`)
  - `candle_master_pro_yearly` ($19.99/yr, base plan: `yearly-base`)
- [x] สร้าง Entitlements & Offerings ใน RevenueCat Dashboard:
  - Entitlement: `pro` ✅ (4 products attached)
  - Offering: `default` ✅ ($rc_monthly + $rc_annual packages)
- [x] Cloudflare env var: STRIPE_PRO_YEARLY_PRICE_ID ✅
- [x] Stripe: Live mode with Monthly + Yearly prices ✅
- [ ] Build AAB v2.5.0(14) + อัปโหลด Play Console (Internal Testing)
- [ ] เพิ่ม License Testers ใน Play Console
- [ ] ทดสอบ purchase flow บน device จริง

### ⚠️ Closed Testing Requirement (สำคัญมาก!)
- Google Play **บังคับ** personal account ต้อง **Closed Test กับ tester 12 คน ขึ้นไป เป็นเวลา 14 วัน** ก่อนจะ apply production release ได้
- [x] สร้าง Internal Testing track ✅ (ใช้ทดสอบก่อน → ค่อย promote เป็น Closed Testing)
- [ ] สร้าง Closed Testing track + เชิญ tester อย่างน้อย 12 คน
- [ ] รอ 14 วันก่อน submit production
- 💡 **กลยุทธ์**: เก็บปุ่ม "Test PRO" ไว้ระหว่าง testing เพื่อให้ tester เข้าถึง PRO features ได้

### 📸 Store Listing Assets (เตรียมก่อน submit)

| Asset | Spec | สถานะ |
|-------|------|--------|
| App Icon | 512x512 px, PNG | ⬜ ต้องเตรียม |
| Feature Graphic | 1024x500 px | ⬜ ต้องเตรียม |
| Phone Screenshots | 2-8 รูป, ภาพจาก app จริง (ห้ามใส่ device frame) | ⬜ ต้องเตรียม |
| Tablet Screenshots | 2-8 รูป (แนะนำ) | ⬜ ต้องเตรียม |
| Short Description | max 80 ตัวอักษร | ⬜ ต้องเขียน |
| Full Description | max 4,000 ตัวอักษร + disclaimer | ⬜ ต้องเขียน |

### 📋 App Content Declarations (กรอกใน Play Console)

- [ ] **Privacy Policy URL**: candlemaster.app/privacy ✅ มีแล้ว
- [ ] **Data Safety Form**: ต้องแจ้ง Firebase Auth, RevenueCat, device IDs
- [ ] **Financial Features Declaration**: บังคับ — แจ้งว่าเป็น simulator/education ไม่ใช่ real trading
- [ ] **Content Rating (IARC)**: ทำ questionnaire → คาดว่าได้ PEGI 12 / Teen
- [ ] **Target Audience**: ตั้งเป็น 13+ (หลีกเลี่ยง COPPA)
- [ ] **Ads Declaration**: ไม่มี ads
- [ ] **App Access**: ต้องให้ test credentials / วิธี login สำหรับ reviewer

### 📦 Technical (ที่มีแล้ว ✅)

| Item | สถานะ |
|------|--------|
| App ID: `com.candlemaster.app` | ✅ ตรงกันทุกที่ |
| targetSdkVersion: 36 | ✅ เกินเกณฑ์ (ต้องการ 35+) |
| compileSdkVersion: 36 | ✅ |
| App Icons (mipmap ทุก density) | ✅ |
| Firebase google-services.json | ✅ |
| AndroidManifest.xml | ✅ |
| Build format: .aab (App Bundle) | ✅ ใช้ `./gradlew bundleRelease` |

### ⚠️ สิ่งที่ต้องระวัง (เหตุผลที่อาจโดน reject)
- **WebView-only app**: Google อาจ reject ถ้าแอปแค่แสดงเว็บ PWA → ต้องมี native feature เพิ่ม (push notification, offline mode)
- **Financial disclaimer**: ต้องมีข้อความชัดเจนใน app + store listing ว่า "Educational only, no real money, not financial advice"
- **Subscription terms**: ต้องแสดงราคา, auto-renew, วิธียกเลิก ให้ชัดเจนก่อนซื้อ

### Version Info
- `package.json`: v3.0.0
- `build.gradle`: versionName "3.0.0" / versionCode 20
- `App.tsx`: Profile page → `<p className="app-version">v3.0.0</p>`
- **หมายเหตุ**: `android/` อยู่ใน `.gitignore` — versionCode ต้องเพิ่มเอง manual ทุกครั้งก่อนอัปโหลด Play Console

### ⚠️ Version Bump Checklist (ทำทุกครั้งก่อน build release)
1. `package.json` → `"version": "x.y.z"`
2. `android/app/build.gradle` → `versionName "x.y.z"` + `versionCode` +1
3. `src/App.tsx` → Profile page `app-version` text → `vx.y.z`

### Changes ใน v3.0.0 (Major Release — May 2026)
- 🚨 **Stripe Removed**: Account was banned. All Cloudflare Functions + frontend service deleted.
- 💎 **Pricing**: Subscription (Monthly/Yearly) → **Lifetime ฿99 / $3.99 one-time purchase**
- 📱 **Native-Only Payment**: RevenueCat via Apple IAP / Google Play Billing
- 🌐 **Web Pricing Modal**: Now shows "Get on App Store / Play Store" instead of buy buttons
- ✨ **New Components**: `PricingModal.tsx`, `ThankYouModal.tsx` (replaces inline modals in App.tsx)
- 🧹 **App.tsx Cleanup**: -178 lines (removed all Stripe code paths, plan badges, manage subscription)
- 🎨 **PRO Badge**: Simplified to "PRO ∞" (no plan distinction)
- 🔒 **Subscription Status**: Simplified to `{ isPro, productId, purchaseDate }` (removed expirationDate, willRenew, plan)
- 💀 **Dead CSS Cleanup**: -139 lines from appStyles.ts (removed Stripe/thankyou/manage classes)

### Changes ใน v2.5.5
- ✅ Version bump only: v2.5.5 (versionCode 19) — rebuild AAB สำหรับ Google Play Console (versionCode ซ้ำกับ v2.5.4 ไม่ได้)

### Changes ใน v2.5.4
- ✅ Fix Volume Bars: proportional volumeHeight (20% of chart, min 60 max 120px), volumeY positioning, padding-bottom fix, overflow-y visible
- ✅ Fix iPhone PWA Landscape: `manifest.json` orientation "portrait" → "any" (PWA ไม่ยอมหมุนจอ)
- ✅ Fix iPhone Landscape Layout Routing: `isTabletLandscape` ใช้ `isTablet` (short side ≥ 768) แทน `isWideScreen` (width ≥ 768) — iPhone landscape กลับไปใช้ mobile layout เดิมที่สวยงาม
- ✅ Version bump: v2.5.4 (versionCode 18)

### Changes ใน v2.5.3
- ✅ Fix Crisis Event Race Condition: `isPro` เริ่ม `false` แล้ว resolve เป็น `true` หลัง initial load → เพิ่ม `prevIsProRef` + แยก useEffect เป็น mount-once + isPro transition guard
- ✅ Fix Crisis Event Date Range: COVID-19, Oil 2014, China 2015 มี candles ไม่ถึง 350 → ขยาย date range + ลด minWindow จาก 350 → 200
- ✅ Fix Crisis Banner on Desktop/Tablet: Banner มีแค่ใน mobile layout → เพิ่มใน tablet layout ด้วย
- ✅ Mobile Landscape Clean Chart: ซ่อน floating controls ด้วย CSS `@media (max-height: 500px) and (orientation: landscape)` เพื่อแสดงแค่ Chart
- ✅ Version bump: v2.5.3 (versionCode 17)

### Changes ใน v2.5.2
- ✅ Tablet/Desktop Responsive Layout: แยก layout สำหรับ tablet landscape (isWideScreen >= 768px)
- ✅ Android Purchase Flow Fix: Capacitor import + purchase button routing
- ✅ Mobile Landscape Full Chart Mode: initial landscape detection

### Changes ใน v2.5.1
- ✅ RevenueCat: เปลี่ยน test API key → production key (`goog_peJadJCRMfojllXEemlRszrhyep`)
- ✅ Stripe Customer Portal: `functions/api/stripe/portal.ts` — สร้าง Billing Portal session
- ✅ Manage Subscription: ปุ่ม "Manage Subscription" ในหน้า Profile (PRO users)
- ✅ Webhook: Track `cancel_at_period_end` + `current_period_end` ใน KV
- ✅ Status API: Expose `cancelAtPeriodEnd` field
- ✅ Platform-aware: Web→Stripe Portal, Android→Play Store, iOS→App Store
- ✅ Stripe Dashboard: Customer Portal configured (cancel at period end + collect reason)

### Changes ใน v2.5.0
- ✅ Stripe Live Mode — switched from sandbox to live keys
- ✅ Stripe Live Prices — Monthly $3.99 (`price_1SzX9500THgK6a8eMmajk8sQ`) + Yearly $19.99 (`price_1SzX9X00THgK6a8eQ6GfnYnn`)
- ✅ Stripe Webhook live endpoint configured
- ✅ Cloudflare env vars updated (4 values + KV namespace)
- ✅ Google Play Subscriptions created (`candle_master_pro_monthly` + `candle_master_pro_yearly`)
- ✅ RevenueCat fully configured (Products, Entitlement `pro`, Offering `default`)
- ✅ Google Cloud Pub/Sub API enabled + Service Account Pub/Sub Admin role
- ✅ Landing page: Lifetime → Yearly pricing migration (all pages)
- ✅ Landing page: Uncle mascot favicon + install page icon
- ✅ Landing page: Checkout buttons redirect to PWA app instead of Stripe Payment Links
- ✅ Yearly price changed from $29.99 → $19.99

### Changes ใน v2.4.2
- ✅ Price update: Yearly $29.99 → $19.99 in App.tsx (tablet + mobile layouts)
- ✅ stripeService.ts updated with live price IDs
- ✅ Version bump for pricing changes

### Changes ใน v2.4.1
- ✅ Fix PRO 50-move limit → เพิ่ม windowSize 250→450 (PRO) / 300 (Free)
- ✅ Fix Android SFX → AudioBuffer + BufferSourceNode แทน HTMLAudioElement
- ✅ เพิ่ม User-Agent header ใน CapacitorHttp สำหรับ Stooq
- ✅ กลับไปใช้ tradeopen.mp3 สำหรับปุ่ม Long/Short
- ✅ เพิ่ม Start New Game confirmation modal กันเผลอกด
- ✅ เพิ่ม app version ล่างสุดหน้า Profile

### Changes ใน v2.4.0
- ✅ อัปเดตภาพ character judge ทั้ง 39 รูป (crop ใหม่ + ลบ background + แปลง webp ใหม่)
- ✅ ภาพ boss 6 รูปอัปเดตด้วย (wizard, Santa, zombie, wild hair, cowboy, stress eating)

### Bugs ที่แก้แล้วใน v2.3.4
- ✅ PRO stock pool ไม่ปลดล็อค (อ่าน localStorage key ผิด → เปลี่ยนเป็นส่ง isPro parameter)
- ✅ Crisis event ไม่โผล่สำหรับ PRO (สาเหตุเดียวกัน)
- ✅ ปุ่ม CLOSE ALL ล้นจอเมื่อมี 5 ปุ่ม (เพิ่ม has-close-all CSS)
- ✅ BGM เบาเกินไปบน Android (-6dB → 0dB)
- ✅ Sound effect Long/Short ไม่ดังบน Android (เปลี่ยนเป็น click sound + AudioContext resume)
- ✅ Google Sign-In ไม่ทำงานบน production (เพิ่ม Play App Signing SHA-1 ใน Firebase)
