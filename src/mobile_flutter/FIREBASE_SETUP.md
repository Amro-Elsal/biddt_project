# Biddt MVP - Firebase Setup Guide

## Overview
This guide will help you set up Firebase for the Biddt MVP to make it production-ready.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- FlutterFire CLI installed (`dart pub global activate flutterfire_cli`)
- A Firebase project created at https://console.firebase.google.com/

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Create Project"
3. Name it "biddt-app" (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Complete the setup

## Step 2: Configure Firebase in Flutter

### Using FlutterFire CLI (Recommended)

```bash
# Login to Firebase
firebase login

# Configure FlutterFire
cd src/mobile_flutter
flutterfire configure

# Select your Firebase project
# This will generate firebase_options.dart
```

### Manual Configuration

If not using FlutterFire CLI:

1. **Android Setup:**
   - In Firebase Console, add Android app
   - Package name: `com.biddt.app`
   - Download `google-services.json`
   - Place in: `android/app/google-services.json`

2. **iOS Setup:**
   - In Firebase Console, add iOS app
   - Bundle ID: `com.biddt.app`
   - Download `GoogleService-Info.plist`
   - Place in: `ios/Runner/GoogleService-Info.plist`

## Step 3: Enable Firebase Services

### Authentication
1. Go to Authentication → Sign-in method
2. Enable "Phone" provider
3. Add test phone numbers for development:
   - +1 650-555-0100 (code: 123456)
   - +1 650-555-0101 (code: 123456)

### Firestore Database
1. Go to Firestore Database
2. Create database
3. Start in **test mode** for development
4. Choose region closest to your users (e.g., us-central)

### Storage
1. Go to Storage
2. Enable storage
3. Start in **test mode** for development

### Cloud Messaging (Push Notifications)
1. Go to Project Settings → Cloud Messaging
2. Note the Server Key (for backend)
3. For iOS: Upload APNs certificates

## Step 4: Firestore Security Rules

### Development Rules (Test Mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production Rules (After Testing)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listings collection
    match /listings/{listingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.sellerId;
    }
    
    // Bids collection
    match /bids/{bidId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        request.auth.uid == resource.data.bidderId;
    }
    
    // Wallets collection
    match /wallets/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only cloud functions can write
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Only cloud functions can write
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages subcollection
    match /chats/{chatId}/messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## Step 5: Firebase Storage Rules

### Development
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Production
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listing images
    match /listings/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat images
    match /chats/{chatId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Cloud Functions (Optional but Recommended)

Deploy these Cloud Functions for security:

```bash
# Initialize Cloud Functions
firebase init functions

# Deploy functions
firebase deploy --only functions
```

### Recommended Functions:
1. `processPayment` - Handle Stripe payments securely
2. `finalizeAuction` - End auctions and transfer funds
3. `sendNotification` - Send push notifications
4. `updateTrustScore` - Calculate user trust scores

## Step 7: Stripe Integration (For Payments)

1. Create Stripe account at https://stripe.com
2. Get API keys from Dashboard
3. Set up Stripe Connect for sellers
4. Add Stripe publishable key to app
5. Use Cloud Functions for server-side Stripe operations

## Step 8: Testing

```bash
# Run Flutter app
flutter run

# Check Firebase connection
# Look for "Firebase initialized successfully" in console

# Test authentication
# Try phone number sign-in

# Test Firestore
# Create a listing and verify it appears
```

## Step 9: Production Checklist

Before launching:

- [ ] Update Firestore rules to production
- [ ] Update Storage rules to production
- [ ] Enable App Check for security
- [ ] Set up Firebase Analytics
- [ ] Configure Crashlytics
- [ ] Set up Firebase Performance Monitoring
- [ ] Enable Firebase Remote Config (for feature flags)
- [ ] Configure Firebase Cloud Messaging for push notifications
- [ ] Set up Firebase Dynamic Links (for sharing)
- [ ] Enable Firebase App Distribution (for beta testing)

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**
   - Run `flutterfire configure` again
   - Ensure `google-services.json` and `GoogleService-Info.plist` are in correct locations

2. **"Permission denied"**
   - Check Firestore rules
   - Ensure user is authenticated

3. **Phone auth not working**
   - Enable Phone provider in Firebase Console
   - Add SHA-1 fingerprint for Android
   - Add test phone numbers for development

## Support

- Firebase Documentation: https://firebase.google.com/docs
- FlutterFire: https://firebase.flutter.dev/
- Firebase Console: https://console.firebase.google.com/
