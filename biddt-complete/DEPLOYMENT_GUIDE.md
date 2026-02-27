# Biddt - Deployment Guide

## Complete Application Overview

The Biddt mobile bidding marketplace is now complete with:

### Frontend (Flutter)
- ✅ 24 screens with full UI/UX
- ✅ Real-time auction timers (updates every second)
- ✅ Animated Biddt diamond logo
- ✅ Live bidding functionality
- ✅ Buying Power wallet system
- ✅ Dark theme with gold accents
- ✅ Responsive design

### Backend (Firebase)
- ✅ 20+ Cloud Functions
- ✅ Firestore database schema
- ✅ Authentication (Phone, Google, Apple)
- ✅ Real-time bid processing
- ✅ Automatic auction ending
- ✅ Push notifications
- ✅ Demo data seeding

## Project Location

All files are in: `/mnt/okcomputer/output/biddt-complete/`

## Quick Deployment Steps

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project"
3. Name it "biddt-app"
4. Enable Google Analytics (optional)

### Step 2: Enable Firebase Services

In your Firebase project:

1. **Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Phone" provider
   - Enable "Google" provider
   - Enable "Apple" provider (requires Apple Developer account)

2. **Firestore Database**
   - Go to Firestore Database → Create database
   - Start in production mode
   - Choose region (us-central recommended)

3. **Storage**
   - Go to Storage → Get started
   - Start in production mode

### Step 3: Download Config Files

1. Go to Project Settings → General
2. Click "Add app" → Android
   - Package name: `com.biddt.app`
   - Download `google-services.json`
   - Place in `frontend/android/app/`

3. Click "Add app" → iOS
   - Bundle ID: `com.biddt.app`
   - Download `GoogleService-Info.plist`
   - Place in `frontend/ios/Runner/`

### Step 4: Deploy Backend

```bash
cd /mnt/okcomputer/output/biddt-complete/backend

# Install dependencies
npm install

# Login to Firebase
firebase login

# Initialize project (if not done)
firebase init

# Deploy everything
firebase deploy

# Or deploy specific services:
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Step 5: Seed Demo Data

```bash
# In backend directory
npm run seed

# Or call the HTTP function directly (emulator mode only)
curl https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/seedDemoData
```

### Step 6: Run Flutter App

```bash
cd /mnt/okcomputer/output/biddt-complete/frontend

# Get dependencies
flutter pub get

# Run on device
flutter run

# Or build for release:
# Android APK
flutter build apk --release

# Android App Bundle (for Play Store)
flutter build appbundle --release

# iOS (requires Mac + Xcode)
flutter build ios --release
```

## Demo Accounts

After seeding, these accounts are available:

| Email | Password | Display Name | Trust Score | Buying Power |
|-------|----------|--------------|-------------|--------------|
| alex@biddt.test | TestPass123! | Alex 'The Hunter' M. | 98 | $5,000 |
| sarah@biddt.test | TestPass123! | Sarah J. | 92 | $2,500 |
| mike@biddt.test | TestPass123! | Mike T. | 75 | $800 |
| emma@biddt.test | TestPass123! | Emma W. | 88 | $3,500 |
| david@biddt.test | TestPass123! | David L. | 95 | $8,000 |

## Testing the App

### Test Flow 1: Browse & Bid
1. Open app → See splash screen with animated logo
2. Swipe through onboarding
3. Sign in with demo account
4. Browse live auctions on home
5. Tap an item to view details
6. Place a bid (10% deposit held)

### Test Flow 2: Sell an Item
1. Tap diamond "+" FAB
2. Create listing with photos
3. Set starting bid and duration
4. Publish listing
5. View in "My Listings"

### Test Flow 3: Wallet Management
1. Go to Profile → Wallet
2. View Buying Power balance
3. Tap "Top Up" to add funds
4. View transaction history
5. See locked funds in active bids

### Test Flow 4: Real-time Features
1. Open two devices/emulators
2. Sign in as different users
3. Both view same auction
4. User A places bid
5. User B sees updated bid in real-time
6. Timer counts down every second

## Cloud Functions Reference

### Authentication
| Function | Trigger | Description |
|----------|---------|-------------|
| `onUserCreated` | Auth user created | Creates user profile & wallet |

### Bidding
| Function | Trigger | Description |
|----------|---------|-------------|
| `placeBid` | HTTPS Callable | Places bid with deposit validation |
| `scheduledEndAuction` | Pub/Sub (1 min) | Auto-ends expired auctions |

### Wallet
| Function | Trigger | Description |
|----------|---------|-------------|
| `topUpWallet` | HTTPS Callable | Adds funds to Buying Power |

### Listings
| Function | Trigger | Description |
|----------|---------|-------------|
| `createListing` | HTTPS Callable | Creates new auction |
| `getLiveAuctions` | HTTPS Callable | Returns active auctions |
| `getTrendingListings` | HTTPS Callable | Returns trending items |

### Messaging
| Function | Trigger | Description |
|----------|---------|-------------|
| `sendMessage` | HTTPS Callable | Sends chat message |

## Firestore Collections

```
users/{userId}
  - id, username, displayName, email, avatar
  - trustScore, badges, verificationStatus
  - buyingPower: { total, locked, available }
  - stats: { transactions, responseRate, responseTime, joinedAt }

listings/{listingId}
  - id, title, description, category, condition
  - images[], startingBid, currentBid, bidCount
  - sellerId, seller{}, status, endTime
  - location{}, watchers, watcherIds[]

bids/{bidId}
  - id, listingId, bidderId, bidder{}
  - amount, depositAmount, status, createdAt

walletTransactions/{transactionId}
  - id, userId, type, amount
  - description, status, relatedListingId, createdAt

conversations/{conversationId}
  - id, participants[], lastMessage
  - lastMessageTime, unreadCount{}

messages/{messageId}
  - id, conversationId, senderId
  - content, type, createdAt, read

notifications/{notificationId}
  - id, userId, type, title, message
  - listingId, read, createdAt
```

## Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Listings are readable by all, writable by owner
    match /listings/{listingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.sellerId;
    }
    
    // Bids are append-only
    match /bids/{bidId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if false;
    }
    
    // Wallet transactions are system-managed
    match /walletTransactions/{transactionId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false;
    }
    
    // Messages only visible to conversation participants
    match /messages/{messageId} {
      allow read: if request.auth.uid in get(/databases/$(database)/documents/conversations/$(resource.data.conversationId)).data.participants;
      allow create: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues

**1. Flutter build fails**
```bash
# Clean and rebuild
cd frontend
flutter clean
flutter pub get
flutter run
```

**2. Firebase functions fail to deploy**
```bash
# Check TypeScript compilation
cd backend/functions
npm run build

# Deploy with verbose logging
firebase deploy --only functions --debug
```

**3. Firestore permission denied**
- Check security rules in Firebase Console
- Ensure user is authenticated
- Verify rules are deployed: `firebase deploy --only firestore:rules`

**4. Images not loading**
- Check Storage rules allow public read
- Verify image URLs are correct
- Check CORS configuration

## Next Steps

1. **Add Payment Integration**
   - Integrate Stripe for real payments
   - Add Apple Pay / Google Pay

2. **Add Maps**
   - Show safe exchange locations
   - Add directions

3. **Add Analytics**
   - Firebase Analytics
   - Custom events tracking

4. **Add Deep Links**
   - Share listings via links
   - Universal app links

5. **Optimize Performance**
   - Image caching
   - Pagination
   - Lazy loading

## Support

For issues or questions:
1. Check Firebase documentation
2. Check Flutter documentation
3. Review Cloud Functions logs in Firebase Console

---

**Your Biddt app is ready to deploy! 🚀**
