# Biddt Mobile App

A complete functional mobile marketplace app built with React Native + Expo, featuring real-time bidding, payments, QR code exchanges, and ratings.

## Features

### Authentication
- Phone OTP authentication (Firebase Auth)
- Profile setup with avatar upload

### Core Marketplace
- Browse live auctions with glassmorphism cards
- Category filtering (Sneakers, Tech, Vintage, Streetwear, etc.)
- Search functionality
- Product detail with image carousel, 360° view badge, timer, bid history

### Bidding System
- Real-time bidding
- Bid history tracking
- Auto-bid support
- "Buy Now" option

### Payments & Wallet
- Wallet/Buying Power system
- Multiple payment methods (Card, PayPal, Apple Pay, Google Pay)
- Transaction history

### Safe Exchange
- QR code generation for secure meetups
- Exchange verification system

### Chat
- Real-time messaging between buyers and sellers
- Item preview in chat

### Seller Dashboard
- Active listings management
- Sales analytics
- Sold items tracking
- Quick listing creation

### User Profile
- Trust Score system
- Verification badges
- Reviews and ratings
- Stats (sold items, active bids, reply time)

## Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React hooks + AsyncStorage
- **UI**: Custom components with Stitch design system
- **Icons**: Ionicons

## Design System

Based on Stitch designs:
- **Background**: #f8f8f5 (Pearl White)
- **Primary**: #ffd900 (Spark Gold)
- **Font**: Plus Jakarta Sans
- **Dark Mode**: Full support

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # All app screens
├── hooks/          # Custom React hooks
├── services/       # Firebase integration
├── theme/          # Light/Dark theme configuration
├── types/          # TypeScript type definitions
└── data/           # Mock data and database helpers
```

## Screens

1. **Onboarding** - App introduction slides
2. **PhoneAuth** - Phone number + OTP verification
3. **ProfileSetup** - Create user profile
4. **Home** - Browse auctions, categories, search
5. **ProductDetail** - Item details, bidding, seller info
6. **CreateListing** - Multi-step listing creation
7. **Profile** - User profile, wallet, menu
8. **SellerDashboard** - Seller analytics and management
9. **ChatList** - Conversations list
10. **Chat** - Individual conversation
11. **Payment** - Add funds to wallet
12. **QRCode** - Safe exchange QR code

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project
   - Add your Firebase config to `src/services/firebase.ts`
   - Enable Phone Authentication
   - Set up Firestore and Storage

3. Start the app:
```bash
npx expo start
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add an Android/iOS app
4. Copy the config object and replace in `src/services/firebase.ts`
5. Enable Authentication > Sign-in method > Phone
6. Create Firestore database
7. Enable Storage

## Environment Variables

Create a `.env` file:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## License

MIT
