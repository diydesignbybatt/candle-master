# 📱 Capacitor Setup Guide - Candle Master

## ✅ Setup เสร็จสิ้น!

โปรเจคพร้อมสำหรับ Native App แล้ว 🚀

---

## 📋 สิ่งที่ได้ติดตั้งแล้ว

### Core Packages
- ✅ `@capacitor/core` - Core functionality
- ✅ `@capacitor/cli` - Command line tools
- ✅ `@capacitor/android` - Android platform
- ✅ `@capacitor/ios` - iOS platform

### Plugins
- ✅ `@capacitor/app` - App lifecycle hooks
- ✅ `@capacitor/status-bar` - Status bar styling
- ✅ `@capacitor/splash-screen` - Splash screen
- ✅ `@capacitor/haptics` - Vibration feedback

### Features
- ✅ **Dual-mode data fetching**: รองรับทั้ง web (CORS proxy) และ native (direct API)
- ✅ **Capacitor HTTP**: ดึงข้อมูล Stooq ฟรีใน native app โดยไม่มีปัญหา CORS
- ✅ **Platform detection**: ตรวจจับ platform อัตโนมัติ

---

## 🚀 คำสั่งที่ใช้งาน

### Development
```bash
# รัน web development server (ปกติ)
npm run dev

# Build โปรเจค
npm run build
```

### Capacitor Commands
```bash
# Sync web assets ไปยัง native platforms
npm run cap:sync

# เปิด Android Studio
npm run cap:android

# เปิด Xcode (macOS เท่านั้น)
npm run cap:ios

# รันบน Android device/emulator
npm run cap:run:android

# รันบน iOS device/simulator (macOS เท่านั้น)
npm run cap:run:ios
```

### Manual Commands
```bash
# Sync manually
npx cap sync

# เปิด native IDEs
npx cap open android
npx cap open ios

# รันบน device
npx cap run android
npx cap run ios --target="iPhone 15 Pro"

# Check installed plugins
npx cap ls
```

---

## 📱 การรันบน Device จริง

### Android

#### ข้อกำหนด
1. ติดตั้ง [Android Studio](https://developer.android.com/studio)
2. ติดตั้ง Android SDK (API 33+)
3. เปิด USB Debugging บนมือถือ

#### วิธีรัน
```bash
# 1. Build และ sync
npm run build
npx cap sync

# 2. เปิด Android Studio
npm run cap:android

# 3. เลือก device และกด Run ▶️
# หรือใช้คำสั่ง:
npx cap run android
```

---

### iOS

#### ข้อกำหนด
1. ติดตั้ง [Xcode](https://developer.apple.com/xcode/) (macOS เท่านั้น)
2. ลง Xcode Command Line Tools
3. Apple Developer Account (สำหรับรันบน device จริง)

#### วิธีรัน
```bash
# 1. Build และ sync
npm run build
npx cap sync

# 2. เปิด Xcode
npm run cap:ios

# 3. เลือก simulator/device และกด Run ▶️
# หรือใช้คำสั่ง:
npx cap run ios --target="iPhone 15 Pro"
```

---

## ⚙️ Configuration

### `capacitor.config.ts`

ไฟล์ config หลัก:

```typescript
{
  appId: 'com.candlemaster.app',
  appName: 'Candle Master',
  webDir: 'dist',

  // Android scheme (ใช้ HTTPS)
  server: {
    androidScheme: 'https'
  },

  // Plugin settings
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1A1A1A',
      // ... other options
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1A1A1A',
    }
  }
}
```

---

## 🔧 การ Debug

### Web Browser (ง่ายสุด)
```bash
npm run dev
# เปิด http://localhost:5173
# ใช้ Chrome DevTools ปกติ
```

### Android Device
```bash
# เปิด Chrome Remote Debugging
chrome://inspect#devices

# หรือใช้ adb logcat
adb logcat | grep -i capacitor
```

### iOS Device
```bash
# เปิด Safari Web Inspector
Safari > Develop > [Your iPhone] > localhost
```

---

## 📦 Build สำหรับ Production

### Android APK/AAB

```bash
# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. เปิด Android Studio
npx cap open android

# 4. Build > Generate Signed Bundle/APK
# เลือก: Android App Bundle (.aab) สำหรับ Play Store
#        APK สำหรับแจกเอง
```

### iOS IPA

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. เปิด Xcode
npx cap open ios

# 4. Product > Archive
# 5. Distribute App > App Store Connect / Ad Hoc
```

---

## 🐛 Troubleshooting

### ปัญหา: Android build ล้มเหลว
```bash
# ล้าง cache
cd android
./gradlew clean
cd ..

# Sync อีกครั้ง
npx cap sync android
```

### ปัญหา: Data ไม่โหลด
- ตรวจสอบ network permissions ใน AndroidManifest.xml
- เช็ค console logs: `chrome://inspect#devices`
- ทดสอบว่า Stooq API ทำงานไหม

### ปัญหา: iOS build ล้มเหลว
```bash
# Update pods
cd ios/App
pod install
cd ../..

# Sync อีกครั้ง
npx cap sync ios
```

### ปัญหา: White screen
- ตรวจสอบ `webDir: 'dist'` ใน capacitor.config.ts
- รัน `npm run build` ก่อน sync
- ลบ android/ios folders แล้ว add ใหม่:
  ```bash
  rm -rf android ios
  npx cap add android
  npx cap add ios
  ```

---

## 📚 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor HTTP Plugin](https://capacitorjs.com/docs/apis/http)
- [Android Studio Download](https://developer.android.com/studio)
- [Xcode Download](https://developer.apple.com/xcode/)

---

## 🎯 Next Steps

### ขั้นต่อไป (Optional):

1. **Service Worker** - เพิ่ม offline support
   ```bash
   npm install vite-plugin-pwa -D
   ```

2. **App Icons & Splash Screens**
   ```bash
   # Generate icons automatically
   npm install @capacitor/assets -D
   npx capacitor-assets generate
   ```

3. **Push Notifications**
   ```bash
   npm install @capacitor/push-notifications
   ```

4. **Share API**
   ```bash
   npm install @capacitor/share
   ```

5. **In-App Purchases** (สำหรับ Pro subscription)
   ```bash
   npm install @capacitor-community/in-app-purchases
   ```

---

## ✅ สรุป

โปรเจค Candle Master พร้อมสำหรับ Native App แล้ว!

**ข้อดี:**
- ✅ ยังใช้ Stooq API ฟรีได้ (Capacitor HTTP)
- ✅ ทำงานทั้ง web และ native app
- ✅ ไม่มีปัญหา CORS ใน native
- ✅ PWA-ready

**Happy Trading! 📈🚀**
