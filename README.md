# RenPay 💳✨

**RenPay** is a full-stack, dummy transaction and digital wallet mobile application engineered for seamless peer-to-peer (P2P) simulated payments, modern fintech UI/UX, and bank-grade authentication flows.

Built with **React Native (v0.87)**, **TypeScript**, and a **Node.js/Express + PostgreSQL** backend, RenPay replicates core payment mechanisms such as QR scanning, recipient discovery, real-time balance checks, secure MPIN authorization, and custom gesture-driven payment confirmation.

---

## 📱 App Previews & Screenshots

The application features a sleek dark fintech design system tailored for responsive performance across iOS and Android devices.

| Home Dashboard | Recipient Search / Pay | Swipe Payment |
| :---: | :---: | :---: |
| ![Home Screen](./ProjectImages/Home.png) | ![Payment Recipient](./ProjectImages/Payment1.png) | ![Swipe to Pay](./ProjectImages/Payment2.png) |

| Personal QR Code | Real-time QR Scanner |
| :---: | :---: |
| ![My QR Code](./ProjectImages/BarCode.png) | ![QR Scanner](./ProjectImages/QRScanner.png) |

---

## 🚀 Key Features

### 1. 🔐 Robust Authentication & Security
- **Google OAuth 2.0 Integration**: Fast sign-in powered by `@react-native-google-signin/google-signin` and validated via Google Auth Library on the backend.
- **Bi-Level Session Management**: Access tokens (JWT, short-lived) and Refresh tokens (stored in PostgreSQL).
- **Encrypted Local Storage**: Sensitive tokens stored via `react-native-keychain` and fast local cache using `react-native-mmkv`.
- **6-Digit MPIN Validation**: Custom numeric pin validation with shake animation feedback (`Animated` API), haptics, and `bcrypt` password hashing on the server.

### 2. 💸 Simulated P2P Transactions & Atomic Transfers
- **ACID-Compliant PostgreSQL Transactions**: Transfers use PostgreSQL row locks (`SELECT ... FOR UPDATE`) to prevent double-spending or race conditions.
- **Idempotency Protection**: Every transaction creates and tracks a unique `idempotency_key` ensuring duplicate requests never execute twice.
- **Dynamic Keypad & Real-Time Balance Validation**: Built-in 3x4 keypad with currency formatting (INR ₹), 2-decimal precision limits, and live balance deficit warnings.
- **Interactive "Swipe-to-Pay" Knob**: Gesture-driven confirmation built with React Native's `PanResponder`, animated translation, and haptic feedback.

### 3. 📷 QR Code Generation & Scanning
- **Custom QR Generator**: Generates personal static and dynamic UPI/P2P QR codes using `react-native-qrcode-svg`.
- **Real-Time Camera Scanner**: Powered by `react-native-camera-kit` to scan recipient QR codes and auto-fill transfer targets instantly.

### 4. 📊 Analytics & Wallet Insights
- **Interactive Charts**: Financial metrics visualized using `react-native-gifted-charts`.
- **Recent Activity Ledger**: Transaction timeline tracking credits, debits, failure reasons, and timestamps.

### 5. 🔔 Push Notifications *(Upcoming Feature)*
- **Firebase Cloud Messaging (FCM)**: Integration planned for immediate transaction alerts, credit/debit notifications, and login security alerts.

---

## 🛠️ Architecture & Tech Stack

### Frontend (`/RenPay`)
- **Framework**: React Native 0.87 (React 19, New Architecture ready)
- **Language**: TypeScript 6.0
- **Navigation**: React Navigation (Native Stack v7)
- **State & Storage**: React Context API, `react-native-mmkv`, `react-native-keychain`
- **Gestures & Animations**: React Native `Animated`, `PanResponder`, `react-native-haptic-feedback`
- **Visuals & Charts**: `react-native-svg`, `react-native-gifted-charts`, `react-native-vector-icons`
- **Hardware Interop**: `react-native-camera-kit` (QR Scanner)

### Backend (`/Backend`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5.x
- **Database**: PostgreSQL (`pg` pool)
- **Security & Cryptography**: `jsonwebtoken`, `bcryptjs`, `crypto`
- **Background Tasks**: Scheduled cron jobs (`node-cron`) for token expiration and housekeeping

---

## 📂 Project Structure

```text
Ren-Pay/
├── ProjectImages/              # UI screenshots & preview assets
│   ├── Home.png
│   ├── Payment1.png
│   ├── Payment2.png
│   ├── BarCode.png
│   └── QRScanner.png
├── Backend/                    # Node.js + Express API server
│   ├── src/
│   │   ├── Config/             # PostgreSQL pool & environment config
│   │   ├── Features/           # Modular controllers (Auth, Payment, Account)
│   │   ├── Middlewares/        # JWT Authentication middleware
│   │   ├── Models/             # Database schema types & models
│   │   ├── Routes/             # Express routes (/auth, /payment, /account)
│   │   └── corn/               # Scheduled background cron jobs
│   └── package.json
└── RenPay/                     # React Native mobile application
    ├── src/
    │   ├── App/
    │   │   ├── Home/           # Dashboard, Analytics, and Action Cards
    │   │   ├── Payment/        # Send, Recipient Search, QR, Keypad, Result
    │   │   └── SharedComponents/
    │   ├── Authentication/     # Google OAuth, MPIN setup, Pin Validator
    │   ├── Extras/             # Contexts, MMKV, KeyStore, Theme constants
    │   └── RootNavigator.tsx   # Stack navigation & routing gates
    └── package.json
```

---

## ⚡ Getting Started

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   npm install
   ```
2. Configure your `.env` file:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/renpay_db
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_web_client_id
   GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
   GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### 2. Mobile App Setup
1. Navigate to the mobile app directory:
   ```bash
   cd RenPay
   npm install
   ```
2. Install CocoaPods (iOS only):
   ```bash
   npm run ios:pod
   ```
3. Reverse ADB ports (Android only):
   ```bash
   npm run port
   ```
4. Start Metro and launch:
   ```bash
   npm start
   # In another terminal:
   npm run ios     # Run on iOS Simulator
   # or
   npm run android # Run on Android Emulator
   ```

---

## ⚠️ Disclaimer

**RenPay is a simulation / dummy transaction project** built strictly for educational, portfolio, and prototype experimentation purposes. No real money, banking networks, or financial institution APIs are handled.
