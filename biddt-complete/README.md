# Biddt - Complete Mobile Bidding Marketplace

A premium mobile marketplace app for iOS and Android with live bidding, Buying Power wallet system, and safe exchanges.

![Biddt Logo](frontend/assets/logo/logo.png)

## Features

### Core Features
- **Live Auctions** - Real-time bidding with countdown timers
- **Buying Power Wallet** - 10% deposit system with escrow
- **Safe Exchange** - QR code verification at safe zones
- **Trust Score** - User verification and rating system
- **Messaging** - In-app chat between buyers and sellers
- **Seller Dashboard** - Analytics and listing management

### Authentication
- Phone number verification
- Google Sign-In
- Apple Sign-In
- Identity verification

### Screens (24 Total)
1. Splash Screen with animated logo
2. Onboarding (3 slides)
3. Auth Options
4. Phone Input & Verification
5. Identity Verification
6. Home Feed with live auctions
7. Search & Discovery
8. Notifications
9. Product Detail
10. Place Bid
11. Winning Reveal
12. Wallet/Buying Power
13. Add Funds
14. Transaction History
15. Seller Dashboard
16. Create Listing
17. My Listings
18. Profile
19. Edit Profile
20. Public Profile
21. Chat List
22. Chat Detail
23. Safe Exchange
24. 360° Product View

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Flutter 3.16+ |
| Backend | Firebase |
| Database | Cloud Firestore |
| Auth | Firebase Auth |
| Storage | Firebase Storage |
| Functions | Cloud Functions (TypeScript) |
| State Management | BLoC Pattern |
| Navigation | go_router |

## Project Structure

```
biddt-complete/
├── frontend/                    # Flutter application
│   ├── lib/
│   │   ├── main.dart           # App entry point
│   │   ├── config/             # Theme, routes, constants
│   │   ├── features/           # All feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── home/          # Home feed
│   │   │   ├── product/       # Product detail & bidding
│   │   │   ├── wallet/        # Buying Power wallet
│   │   │   ├── selling/       # Seller features
│   │   │   ├── profile/       # User profile
│   │   │   └── messaging/     # Chat system
│   │   └── shared/            # Shared widgets & utils
│   ├── assets/                # Images, icons, logo
│   └── pubspec.yaml           # Dependencies
│
├── backend/                     # Firebase backend
│   └── functions/              # Cloud Functions
│       └── src/
│           └── index.ts       # All cloud functions
│
└── docs/                        # Documentation
```

## Quick Start

### Prerequisites
- Flutter SDK 3.16+
- Firebase CLI
- Node.js 18+ (for backend)

### 1. Setup Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
cd backend
firebase init
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Phone, Google, Apple)
3. Enable Firestore Database
4. Enable Storage
5. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
6. Place them in:
   - `frontend/android/app/google-services.json`
   - `frontend/ios/Runner/GoogleService-Info.plist`

### 3. Run Flutter App

```bash
cd frontend

# Get dependencies
flutter pub get

# Run on iOS simulator
flutter run

# Run on Android emulator
flutter run
```

### 4. Deploy Backend

```bash
cd backend

# Deploy functions
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy storage rules
firebase deploy --only storage:rules
```

## Demo Accounts

| Email | Password | Display Name | Trust Score | Buying Power |
|-------|----------|--------------|-------------|--------------|
| alex@biddt.test | TestPass123! | Alex 'The Hunter' M. | 98 | $5,000 |
| sarah@biddt.test | TestPass123! | Sarah J. | 92 | $2,500 |
| mike@biddt.test | TestPass123! | Mike T. | 75 | $800 |
| emma@biddt.test | TestPass123! | Emma W. | 88 | $3,500 |
| david@biddt.test | TestPass123! | David L. | 95 | $8,000 |

## Cloud Functions

### Authentication
- `onUserCreated` - Initialize user profile and wallet

### Bidding
- `placeBid` - Place bid with deposit validation
- `scheduledEndAuction` - Auto-end expired auctions

### Wallet
- `topUpWallet` - Add funds to Buying Power

### Listings
- `createListing` - Create new auction listing

### Real-time
- `getLiveAuctions` - Get active auctions
- `getTrendingListings` - Get trending items

## Key Features Explained

### Buying Power System
- 10% refundable deposit required to bid
- Funds held in escrow
- Automatic refunds when outbid
- Top-up via multiple payment methods

### Live Auctions
- Real-time countdown timers
- Live bid updates
- Bid history
- Watchlist functionality

### Safe Exchange
- Verified safe zones
- QR code verification
- In-app meeting coordination
- Safety monitoring

## Building for Production

### Android
```bash
cd frontend
flutter build apk --release
flutter build appbundle --release
```

### iOS
```bash
cd frontend
flutter build ios --release
```

## Deployment

### Firebase Hosting (Web)
```bash
cd frontend
flutter build web --release
firebase deploy --only hosting
```

### App Stores
1. Build release version
2. Upload to Google Play Console (Android)
3. Upload to App Store Connect (iOS)

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Flutter & Firebase**
