import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// ==================== TYPES ====================
interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  trustScore: number;
  badges: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  buyingPower: {
    total: number;
    locked: number;
    available: number;
  };
  stats: {
    transactions: number;
    responseRate: number;
    responseTime: string;
    joinedAt: Date;
  };
  fcmToken?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  images: string[];
  startingBid: number;
  currentBid: number;
  bidCount: number;
  reservePrice?: number;
  sellerId: string;
  seller: User;
  status: 'draft' | 'active' | 'ended' | 'sold';
  endTime: Date;
  location: {
    city: string;
    state: string;
  };
  watchers: number;
  watcherIds: string[];
  createdAt: Date;
}

interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidder: User;
  amount: number;
  depositAmount: number;
  status: 'active' | 'outbid' | 'won' | 'lost';
  createdAt: Date;
}

interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'bid_hold' | 'refund' | 'payout' | 'withdrawal';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  relatedListingId?: string;
  createdAt: Date;
}

// ==================== AUTH FUNCTIONS ====================

export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const userData: User = {
    id: user.uid,
    username: user.email?.split('@')[0] || `user_${user.uid.slice(0, 8)}`,
    displayName: user.displayName || 'New User',
    email: user.email || '',
    avatar: user.photoURL || '',
    trustScore: 50,
    badges: ['new_seller'],
    verificationStatus: 'pending',
    buyingPower: {
      total: 0,
      locked: 0,
      available: 0,
    },
    stats: {
      transactions: 0,
      responseRate: 100,
      responseTime: '< 1 hour',
      joinedAt: new Date(),
    },
  };

  await db.collection('users').doc(user.uid).set(userData);
  
  // Create welcome notification
  await db.collection('notifications').add({
    userId: user.uid,
    type: 'welcome',
    title: 'Welcome to Biddt!',
    message: 'Start discovering hidden gems and bidding on treasures.',
    read: false,
    createdAt: new Date(),
  });
});

// ==================== BIDDING FUNCTIONS ====================

export const placeBid = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { listingId, amount } = data;
  const userId = context.auth.uid;

  return db.runTransaction(async (transaction) => {
    // Get listing
    const listingRef = db.collection('listings').doc(listingId);
    const listingDoc = await transaction.get(listingRef);
    
    if (!listingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Listing not found');
    }
    
    const listing = listingDoc.data() as Listing;
    
    if (listing.status !== 'active') {
      throw new functions.https.HttpsError('failed-precondition', 'Auction is not active');
    }
    
    if (listing.endTime.toDate() < new Date()) {
      throw new functions.https.HttpsError('failed-precondition', 'Auction has ended');
    }
    
    if (amount <= listing.currentBid) {
      throw new functions.https.HttpsError('invalid-argument', 'Bid must be higher than current bid');
    }
    
    // Get user
    const userRef = db.collection('users').doc(userId);
    const userDoc = await transaction.get(userRef);
    const user = userDoc.data() as User;
    
    const depositAmount = amount * 0.1;
    
    if (user.buyingPower.available < depositAmount) {
      throw new functions.https.HttpsError('failed-precondition', 'Insufficient buying power');
    }
    
    // Check for existing active bid
    const existingBidsQuery = await db.collection('bids')
      .where('listingId', '==', listingId)
      .where('bidderId', '==', userId)
      .where('status', '==', 'active')
      .get();
    
    // Refund previous deposit if exists
    if (!existingBidsQuery.empty) {
      const existingBid = existingBidsQuery.docs[0].data() as Bid;
      transaction.update(userRef, {
        'buyingPower.locked': admin.firestore.FieldValue.increment(-existingBid.depositAmount),
        'buyingPower.available': admin.firestore.FieldValue.increment(existingBid.depositAmount),
      });
      
      transaction.update(existingBidsQuery.docs[0].ref, { status: 'outbid' });
      
      // Create refund transaction
      const refundTransaction: WalletTransaction = {
        id: uuidv4(),
        userId: userId,
        type: 'refund',
        amount: existingBid.depositAmount,
        description: `Refund for outbid on "${listing.title}"`,
        status: 'completed',
        relatedListingId: listingId,
        createdAt: new Date(),
      };
      transaction.set(db.collection('walletTransactions').doc(refundTransaction.id), refundTransaction);
    }
    
    // Create new bid
    const bid: Bid = {
      id: uuidv4(),
      listingId,
      bidderId: userId,
      bidder: user,
      amount,
      depositAmount,
      status: 'active',
      createdAt: new Date(),
    };
    
    transaction.set(db.collection('bids').doc(bid.id), bid);
    
    // Update listing
    transaction.update(listingRef, {
      currentBid: amount,
      bidCount: admin.firestore.FieldValue.increment(1),
    });
    
    // Lock deposit
    transaction.update(userRef, {
      'buyingPower.locked': admin.firestore.FieldValue.increment(depositAmount),
      'buyingPower.available': admin.firestore.FieldValue.increment(-depositAmount),
    });
    
    // Create bid hold transaction
    const holdTransaction: WalletTransaction = {
      id: uuidv4(),
      userId: userId,
      type: 'bid_hold',
      amount: -depositAmount,
      description: `Bid hold for "${listing.title}"`,
      status: 'completed',
      relatedListingId: listingId,
      createdAt: new Date(),
    };
    transaction.set(db.collection('walletTransactions').doc(holdTransaction.id), holdTransaction);
    
    // Notify previous highest bidder if exists
    const previousBidsQuery = await db.collection('bids')
      .where('listingId', '==', listingId)
      .where('status', '==', 'active')
      .orderBy('amount', 'desc')
      .limit(2)
      .get();
    
    if (previousBidsQuery.docs.length > 1) {
      const previousBidder = previousBidsQuery.docs[1].data() as Bid;
      if (previousBidder.bidderId !== userId) {
        await db.collection('notifications').add({
          userId: previousBidder.bidderId,
          type: 'outbid',
          title: 'You\'ve been outbid!',
          message: `Someone placed a higher bid on "${listing.title}"`,
          listingId,
          read: false,
          createdAt: new Date(),
        });
        
        // Send push notification
        const previousBidderDoc = await db.collection('users').doc(previousBidder.bidderId).get();
        const previousBidderData = previousBidderDoc.data() as User;
        if (previousBidderData.fcmToken) {
          await messaging.send({
            token: previousBidderData.fcmToken,
            notification: {
              title: 'You\'ve been outbid!',
              body: `Someone placed a higher bid on "${listing.title}"`,
            },
            data: { listingId, type: 'outbid' },
          });
        }
      }
    }
    
    return { success: true, bidId: bid.id };
  });
});

// ==================== AUCTION ENDING ====================

export const scheduledEndAuction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();
  
  const endingAuctions = await db.collection('listings')
    .where('status', '==', 'active')
    .where('endTime', '<=', now)
    .get();
  
  for (const doc of endingAuctions.docs) {
    const listing = doc.data() as Listing;
    
    await db.runTransaction(async (transaction) => {
      // Get highest bid
      const highestBidQuery = await db.collection('bids')
        .where('listingId', '==', listing.id)
        .where('status', '==', 'active')
        .orderBy('amount', 'desc')
        .limit(1)
        .get();
      
      if (highestBidQuery.empty) {
        // No bids, just end auction
        transaction.update(doc.ref, { status: 'ended' });
        return;
      }
      
      const winningBid = highestBidQuery.docs[0].data() as Bid;
      
      // Update listing
      transaction.update(doc.ref, { 
        status: 'sold',
        winnerId: winningBid.bidderId,
        finalPrice: winningBid.amount,
      });
      
      // Update winning bid
      transaction.update(highestBidQuery.docs[0].ref, { status: 'won' });
      
      // Mark other bids as lost
      const otherBids = await db.collection('bids')
        .where('listingId', '==', listing.id)
        .where('status', '==', 'active')
        .get();
      
      for (const bidDoc of otherBids.docs) {
        if (bidDoc.id !== highestBidQuery.docs[0].id) {
          const bid = bidDoc.data() as Bid;
          transaction.update(bidDoc.ref, { status: 'lost' });
          
          // Refund deposit
          const userRef = db.collection('users').doc(bid.bidderId);
          transaction.update(userRef, {
            'buyingPower.locked': admin.firestore.FieldValue.increment(-bid.depositAmount),
            'buyingPower.available': admin.firestore.FieldValue.increment(bid.depositAmount),
          });
          
          // Create refund transaction
          const refundTransaction: WalletTransaction = {
            id: uuidv4(),
            userId: bid.bidderId,
            type: 'refund',
            amount: bid.depositAmount,
            description: `Refund for lost bid on "${listing.title}"`,
            status: 'completed',
            relatedListingId: listing.id,
            createdAt: new Date(),
          };
          transaction.set(db.collection('walletTransactions').doc(refundTransaction.id), refundTransaction);
        }
      }
      
      // Notify winner
      await db.collection('notifications').add({
        userId: winningBid.bidderId,
        type: 'won',
        title: 'You won! 🎉',
        message: `Congratulations! You won "${listing.title}" for $${winningBid.amount}`,
        listingId: listing.id,
        read: false,
        createdAt: new Date(),
      });
      
      // Notify seller
      await db.collection('notifications').add({
        userId: listing.sellerId,
        type: 'sold',
        title: 'Item Sold! 🎉',
        message: `Your "${listing.title}" sold for $${winningBid.amount}`,
        listingId: listing.id,
        read: false,
        createdAt: new Date(),
      });
      
      // Send push notifications
      const winnerDoc = await db.collection('users').doc(winningBid.bidderId).get();
      const winnerData = winnerDoc.data() as User;
      if (winnerData.fcmToken) {
        await messaging.send({
          token: winnerData.fcmToken,
          notification: {
            title: 'You won! 🎉',
            body: `Congratulations! You won "${listing.title}" for $${winningBid.amount}`,
          },
          data: { listingId: listing.id, type: 'won' },
        });
      }
      
      const sellerDoc = await db.collection('users').doc(listing.sellerId).get();
      const sellerData = sellerDoc.data() as User;
      if (sellerData.fcmToken) {
        await messaging.send({
          token: sellerData.fcmToken,
          notification: {
            title: 'Item Sold! 🎉',
            body: `Your "${listing.title}" sold for $${winningBid.amount}`,
          },
          data: { listingId: listing.id, type: 'sold' },
        });
      }
    });
  }
});

// ==================== WALLET FUNCTIONS ====================

export const topUpWallet = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { amount, paymentMethod } = data;
  const userId = context.auth.uid;

  if (amount < 10) {
    throw new functions.https.HttpsError('invalid-argument', 'Minimum top-up is $10');
  }

  // In production, integrate with Stripe here
  // For demo, we'll just add the funds directly

  const transaction: WalletTransaction = {
    id: uuidv4(),
    userId,
    type: 'deposit',
    amount,
    description: `Deposit via ${paymentMethod}`,
    status: 'completed',
    createdAt: new Date(),
  };

  await db.runTransaction(async (t) => {
    const userRef = db.collection('users').doc(userId);
    t.update(userRef, {
      'buyingPower.total': admin.firestore.FieldValue.increment(amount),
      'buyingPower.available': admin.firestore.FieldValue.increment(amount),
    });
    t.set(db.collection('walletTransactions').doc(transaction.id), transaction);
  });

  return { success: true, transactionId: transaction.id };
});

// ==================== LISTING FUNCTIONS ====================

export const createListing = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { title, description, category, condition, images, startingBid, reservePrice, duration } = data;
  const userId = context.auth.uid;

  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data() as User;

  const endTime = new Date();
  endTime.setDate(endTime.getDate() + (duration || 7));

  const listing: Listing = {
    id: uuidv4(),
    title,
    description,
    category,
    condition,
    images,
    startingBid,
    currentBid: startingBid,
    bidCount: 0,
    reservePrice,
    sellerId: userId,
    seller: user,
    status: 'active',
    endTime,
    location: { city: 'New York', state: 'NY' }, // Default, should be from user profile
    watchers: 0,
    watcherIds: [],
    createdAt: new Date(),
  };

  await db.collection('listings').doc(listing.id).set(listing);

  return { success: true, listingId: listing.id };
});

// ==================== REAL-TIME FUNCTIONS ====================

export const getLiveAuctions = functions.https.onCall(async (data, context) => {
  const now = admin.firestore.Timestamp.now();
  
  const auctions = await db.collection('listings')
    .where('status', '==', 'active')
    .where('endTime', '>', now)
    .orderBy('endTime', 'asc')
    .limit(20)
    .get();

  return auctions.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    endTime: doc.data().endTime.toDate().toISOString(),
  }));
});

export const getTrendingListings = functions.https.onCall(async (data, context) => {
  const listings = await db.collection('listings')
    .where('status', '==', 'active')
    .orderBy('bidCount', 'desc')
    .limit(20)
    .get();

  return listings.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    endTime: doc.data().endTime.toDate().toISOString(),
  }));
});

// ==================== WATCHLIST FUNCTIONS ====================

export const addToWatchlist = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { listingId } = data;
  const userId = context.auth.uid;

  await db.runTransaction(async (transaction) => {
    const listingRef = db.collection('listings').doc(listingId);
    const listingDoc = await transaction.get(listingRef);

    if (!listingDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Listing not found');
    }

    transaction.update(listingRef, {
      watchers: admin.firestore.FieldValue.increment(1),
      watcherIds: admin.firestore.FieldValue.arrayUnion(userId),
    });

    await db.collection('watchlists').doc(`${userId}_${listingId}`).set({
      userId,
      listingId,
      createdAt: new Date(),
    });
  });

  return { success: true };
});

// ==================== MESSAGING FUNCTIONS ====================

export const sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { conversationId, content, type = 'text' } = data;
  const senderId = context.auth.uid;

  const message = {
    id: uuidv4(),
    conversationId,
    senderId,
    content,
    type,
    createdAt: new Date(),
    read: false,
  };

  await db.collection('messages').doc(message.id).set(message);

  // Update conversation
  await db.collection('conversations').doc(conversationId).update({
    lastMessage: content,
    lastMessageTime: new Date(),
    [`unreadCount.${senderId}`]: admin.firestore.FieldValue.increment(1),
  });

  return { success: true, messageId: message.id };
});

// ==================== NOTIFICATION FUNCTIONS ====================

export const sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, title, body, data: payload } = data;

  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data() as User;

  if (user.fcmToken) {
    await messaging.send({
      token: user.fcmToken,
      notification: { title, body },
      data: payload,
    });
  }

  return { success: true };
});

// ==================== SEED DATA FUNCTION ====================

export const seedDemoData = functions.https.onRequest(async (req, res) => {
  // Only allow in emulator or development
  if (process.env.FUNCTIONS_EMULATOR !== 'true') {
    res.status(403).send('Only available in emulator mode');
    return;
  }

  try {
    // Create demo users
    const demoUsers = [
      { id: 'alex_demo', username: 'alexhunter', displayName: "Alex 'The Hunter' M.", email: 'alex@biddt.test', trustScore: 98, buyingPower: { total: 5000, locked: 0, available: 5000 } },
      { id: 'sarah_demo', username: 'sarahj', displayName: 'Sarah J.', email: 'sarah@biddt.test', trustScore: 92, buyingPower: { total: 2500, locked: 0, available: 2500 } },
      { id: 'mike_demo', username: 'miket', displayName: 'Mike T.', email: 'mike@biddt.test', trustScore: 75, buyingPower: { total: 800, locked: 0, available: 800 } },
      { id: 'emma_demo', username: 'emmaw', displayName: 'Emma W.', email: 'emma@biddt.test', trustScore: 88, buyingPower: { total: 3500, locked: 0, available: 3500 } },
      { id: 'david_demo', username: 'davidl', displayName: 'David L.', email: 'david@biddt.test', trustScore: 95, buyingPower: { total: 8000, locked: 0, available: 8000 } },
    ];

    for (const user of demoUsers) {
      await db.collection('users').doc(user.id).set({
        ...user,
        badges: ['verified_id', 'quick_reply'],
        verificationStatus: 'verified',
        stats: { transactions: 45, responseRate: 98, responseTime: '< 1 hour', joinedAt: new Date('2024-01-15') },
        avatar: `https://i.pravatar.cc/150?u=${user.id}`,
      });
    }

    // Create demo listings
    const demoListings = [
      {
        id: 'listing_1',
        title: 'Vintage Rolex Submariner 1967',
        description: 'Authentic vintage Rolex Submariner from 1967. Excellent condition, original parts.',
        category: 'Watches',
        condition: 'good',
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'],
        startingBid: 5000,
        currentBid: 8250,
        bidCount: 24,
        sellerId: 'alex_demo',
        status: 'active',
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000 + 32 * 60 * 1000 + 18000),
        location: { city: 'New York', state: 'NY' },
        watchers: 156,
      },
      {
        id: 'listing_2',
        title: 'Nike Air Jordan 1 Retro High OG',
        description: 'Deadstock Nike Air Jordan 1 Retro High OG Chicago. Size 10.5',
        category: 'Sneakers',
        condition: 'new',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        startingBid: 800,
        currentBid: 1850,
        bidCount: 18,
        sellerId: 'sarah_demo',
        status: 'active',
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000 + 42000),
        location: { city: 'Los Angeles', state: 'CA' },
        watchers: 89,
      },
      {
        id: 'listing_3',
        title: 'iPhone 15 Pro Max 512GB Natural Titanium',
        description: 'Brand new sealed iPhone 15 Pro Max 512GB in Natural Titanium.',
        category: 'Electronics',
        condition: 'new',
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
        startingBid: 1000,
        currentBid: 1200,
        bidCount: 12,
        sellerId: 'mike_demo',
        status: 'active',
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000 + 45 * 60 * 1000 + 33000),
        location: { city: 'Chicago', state: 'IL' },
        watchers: 67,
      },
      {
        id: 'listing_4',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Like new Sony WH-1000XM5 with original box and accessories.',
        category: 'Electronics',
        condition: 'like_new',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        startingBid: 200,
        currentBid: 320,
        bidCount: 8,
        sellerId: 'emma_demo',
        status: 'active',
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
        location: { city: 'Miami', state: 'FL' },
        watchers: 34,
      },
      {
        id: 'listing_5',
        title: 'Apple Watch Ultra 2 Titanium',
        description: 'Apple Watch Ultra 2 49mm Titanium Case with Orange Alpine Loop.',
        category: 'Electronics',
        condition: 'like_new',
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'],
        startingBid: 600,
        currentBid: 750,
        bidCount: 6,
        sellerId: 'david_demo',
        status: 'active',
        endTime: new Date(Date.now() + 18 * 60 * 60 * 1000),
        location: { city: 'Seattle', state: 'WA' },
        watchers: 42,
      },
    ];

    for (const listing of demoListings) {
      await db.collection('listings').doc(listing.id).set({
        ...listing,
        seller: demoUsers.find(u => u.id === listing.sellerId),
        watcherIds: [],
        createdAt: new Date(),
      });
    }

    res.status(200).json({ success: true, message: 'Demo data seeded successfully' });
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== REVIEW FUNCTIONS ====================

export const createReview = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId, rating, comment, listingId } = data;
  const reviewerId = context.auth.uid;

  // Check if user has completed a transaction with this person
  const exchangeQuery = await db.collection('exchanges')
    .where('buyerId', 'in', [reviewerId, userId])
    .where('sellerId', 'in', [reviewerId, userId])
    .where('status', '==', 'completed')
    .limit(1)
    .get();

  if (exchangeQuery.empty) {
    throw new functions.https.HttpsError('failed-precondition', 'You must complete a transaction before reviewing');
  }

  const review = {
    id: uuidv4(),
    reviewerId,
    userId,
    listingId,
    rating,
    comment,
    createdAt: new Date(),
  };

  await db.collection('reviews').doc(review.id).set(review);

  // Update user's trust score
  const userReviews = await db.collection('reviews')
    .where('userId', '==', userId)
    .get();

  const avgRating = userReviews.docs.reduce((sum, doc) => sum + doc.data().rating, 0) / userReviews.docs.length;
  const newTrustScore = Math.min(100, Math.round(50 + (avgRating * 10)));

  await db.collection('users').doc(userId).update({
    trustScore: newTrustScore,
  });

  return { success: true, reviewId: review.id };
});

// ==================== SAFE EXCHANGE FUNCTIONS ====================

export const scheduleExchange = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { listingId, safeZoneId, scheduledTime } = data;
  const userId = context.auth.uid;

  // Get listing
  const listingDoc = await db.collection('listings').doc(listingId).get();
  if (!listingDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Listing not found');
  }

  const listing = listingDoc.data() as Listing;

  // Verify user is winner
  const winningBidQuery = await db.collection('bids')
    .where('listingId', '==', listingId)
    .where('bidderId', '==', userId)
    .where('status', '==', 'won')
    .limit(1)
    .get();

  if (winningBidQuery.empty) {
    throw new functions.https.HttpsError('permission-denied', 'Only the winner can schedule exchange');
  }

  // Generate QR code data
  const qrCodeData = `BIDDT_EXCHANGE_${listingId}_${userId}_${Date.now()}`;

  const exchange = {
    id: uuidv4(),
    listingId,
    buyerId: userId,
    sellerId: listing.sellerId,
    safeZoneId,
    scheduledTime: new Date(scheduledTime),
    qrCode: qrCodeData,
    status: 'scheduled',
    createdAt: new Date(),
  };

  await db.collection('exchanges').doc(exchange.id).set(exchange);

  // Notify seller
  await db.collection('notifications').add({
    userId: listing.sellerId,
    type: 'exchange_scheduled',
    title: 'Exchange Scheduled',
    message: `The buyer has scheduled an exchange for "${listing.title}"`,
    listingId,
    read: false,
    createdAt: new Date(),
  });

  return { success: true, exchangeId: exchange.id, qrCode: qrCodeData };
});

export const verifyExchange = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { exchangeId, qrCode } = data;
  const userId = context.auth.uid;

  const exchangeDoc = await db.collection('exchanges').doc(exchangeId).get();
  if (!exchangeDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Exchange not found');
  }

  const exchange = exchangeDoc.data() as any;

  // Verify QR code
  if (exchange.qrCode !== qrCode) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid QR code');
  }

  // Verify seller
  if (exchange.sellerId !== userId) {
    throw new functions.https.HttpsError('permission-denied', 'Only the seller can verify exchange');
  }

  // Update exchange status
  await db.collection('exchanges').doc(exchangeId).update({
    status: 'completed',
    verifiedAt: new Date(),
  });

  // Update listing status
  await db.collection('listings').doc(exchange.listingId).update({
    status: 'completed',
  });

  // Transfer payment to seller
  const listingDoc = await db.collection('listings').doc(exchange.listingId).get();
  const listing = listingDoc.data() as Listing;

  await db.runTransaction(async (t) => {
    const sellerRef = db.collection('users').doc(exchange.sellerId);
    t.update(sellerRef, {
      'buyingPower.total': admin.firestore.FieldValue.increment(listing.finalPrice || listing.currentBid),
      'buyingPower.available': admin.firestore.FieldValue.increment(listing.finalPrice || listing.currentBid),
      'stats.transactions': admin.firestore.FieldValue.increment(1),
    });
  });

  // Create payout transaction
  const payoutTransaction: WalletTransaction = {
    id: uuidv4(),
    userId: exchange.sellerId,
    type: 'payout',
    amount: listing.finalPrice || listing.currentBid,
    description: `Payout for "${listing.title}"`,
    status: 'completed',
    relatedListingId: exchange.listingId,
    createdAt: new Date(),
  };
  await db.collection('walletTransactions').doc(payoutTransaction.id).set(payoutTransaction);

  // Notify both parties
  await db.collection('notifications').add({
    userId: exchange.buyerId,
    type: 'exchange_completed',
    title: 'Exchange Completed!',
    message: `Your exchange for "${listing.title}" has been verified`,
    listingId: exchange.listingId,
    read: false,
    createdAt: new Date(),
  });

  await db.collection('notifications').add({
    userId: exchange.sellerId,
    type: 'exchange_completed',
    title: 'Exchange Completed!',
    message: `You received payment for "${listing.title}"`,
    listingId: exchange.listingId,
    read: false,
    createdAt: new Date(),
  });

  return { success: true };
});

// ==================== ANALYTICS FUNCTIONS ====================

export const getSellerAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { period = 'month' } = data;

  // Get listings
  const listingsQuery = await db.collection('listings')
    .where('sellerId', '==', userId)
    .get();

  const listings = listingsQuery.docs.map(doc => doc.data() as Listing);

  // Calculate metrics
  const totalEarnings = listings
    .filter(l => l.status === 'sold')
    .reduce((sum, l) => sum + (l.finalPrice || l.currentBid), 0);

  const activeListings = listings.filter(l => l.status === 'active').length;
  const soldListings = listings.filter(l => l.status === 'sold').length;
  const totalViews = listings.reduce((sum, l) => sum + (l.watchers || 0), 0);

  // Get daily sales for chart
  const salesByDay: { [key: string]: number } = {};
  const now = new Date();
  const days = period === 'week' ? 7 : 30;

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    salesByDay[date.toISOString().split('T')[0]] = 0;
  }

  listings
    .filter(l => l.status === 'sold')
    .forEach(l => {
      const date = l.createdAt.toDate().toISOString().split('T')[0];
      if (salesByDay[date] !== undefined) {
        salesByDay[date] += l.finalPrice || l.currentBid;
      }
    });

  return {
    totalEarnings,
    activeListings,
    soldListings,
    totalViews,
    salesByDay,
  };
});

// ==================== TRUST SCORE FUNCTIONS ====================

export const calculateTrustScore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { userId } = data;

  // Get user's reviews
  const reviewsQuery = await db.collection('reviews')
    .where('userId', '==', userId)
    .get();

  const reviews = reviewsQuery.docs.map(doc => doc.data());

  // Get user's transactions
  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data() as User;

  // Calculate base score
  let trustScore = 50;

  // Add points for verification
  if (user.verificationStatus === 'verified') {
    trustScore += 15;
  }

  // Add points for reviews
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    trustScore += Math.round(avgRating * 5);
  }

  // Add points for transactions
  trustScore += Math.min(20, user.stats.transactions * 2);

  // Add points for response rate
  trustScore += Math.round(user.stats.responseRate / 10);

  // Cap at 100
  trustScore = Math.min(100, trustScore);

  // Update user's trust score
  await db.collection('users').doc(userId).update({ trustScore });

  return { success: true, trustScore };
});

// ==================== BADGE FUNCTIONS ====================

export const checkAndAwardBadges = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const userDoc = await db.collection('users').doc(userId).get();
  const user = userDoc.data() as User;

  const newBadges: string[] = [];

  // Check for Power Seller badge (10+ sales)
  if (user.stats.transactions >= 10 && !user.badges.includes('power_seller')) {
    newBadges.push('power_seller');
  }

  // Check for Top Rated badge (trust score >= 90)
  if (user.trustScore >= 90 && !user.badges.includes('top_rated')) {
    newBadges.push('top_rated');
  }

  // Check for Quick Shipper badge (response time < 1 hour)
  if (user.stats.responseTime === '< 1 hour' && !user.badges.includes('quick_shipper')) {
    newBadges.push('quick_shipper');
  }

  // Award new badges
  if (newBadges.length > 0) {
    await db.collection('users').doc(userId).update({
      badges: admin.firestore.FieldValue.arrayUnion(...newBadges),
    });

    // Create notifications for new badges
    for (const badge of newBadges) {
      await db.collection('notifications').add({
        userId,
        type: 'badge_earned',
        title: 'New Badge Earned!',
        message: `Congratulations! You've earned the "${badge.replace('_', ' ').toUpperCase()}" badge.`,
        read: false,
        createdAt: new Date(),
      });
    }
  }

  return { success: true, newBadges };
});
