// LOCAL MODE - No Firebase required
// Uses AsyncStorage for all data persistence

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock user data
const MOCK_USERS: Record<string, any> = {
  'user-1': {
    id: 'user-1',
    phoneNumber: '+1234567890',
    name: 'Jessica M.',
    email: 'jessica@example.com',
    avatar: null,
    trustScore: 98,
    location: 'San Francisco, CA',
    joinedAt: '2021-03-15',
    stats: {
      sold: 42,
      activeBids: 5,
      replyTime: '<1hr',
    },
    wallet: {
      balance: 5000,
      buyingPower: 5000,
    },
  },
};

// Mock listings data
const MOCK_LISTINGS = [
  {
    id: 'listing-1',
    title: 'Vintage Leica M3',
    subtitle: 'Mint condition, original lens',
    description: 'This vintage Leica M3 is in excellent condition. Original lens included. Perfect for collectors.',
    category: 'vintage',
    condition: 'Like New',
    startingPrice: 300,
    currentPrice: 450,
    originalPrice: 600,
    sellerId: 'user-2',
    sellerName: 'CameraCollector',
    sellerAvatar: null,
    sellerRating: 4.9,
    sellerReviews: 128,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours
    watchers: 12,
    bidCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-2',
    title: 'Air Jordan 1 Retro',
    subtitle: 'Size 10 US, Never Worn',
    description: 'Brand new Air Jordan 1 Retro. Original box included. Never worn, perfect condition.',
    category: 'sneakers',
    condition: 'New',
    startingPrice: 150,
    currentPrice: 210,
    sellerId: 'user-3',
    sellerName: 'SneakerKing',
    sellerAvatar: null,
    sellerRating: 4.8,
    sellerReviews: 256,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
    watchers: 8,
    bidCount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-3',
    title: 'Vintage Chronograph 1970',
    subtitle: 'Original box and papers included',
    description: 'This 1970 Vintage Chronograph is in mint condition. Original box and papers are included. The watch features a manual-wind movement, stainless steel case, and a beautiful patina on the dial.',
    category: 'watches',
    condition: 'Excellent',
    startingPrice: 800,
    currentPrice: 1250,
    originalPrice: 1500,
    sellerId: 'user-4',
    sellerName: 'John Doe',
    sellerAvatar: null,
    sellerRating: 4.9,
    sellerReviews: 128,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    watchers: 23,
    bidCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-4',
    title: 'Seiko 5 Sports',
    subtitle: 'Vintage 1980s',
    description: 'Classic Seiko 5 Sports from the 1980s. Working condition.',
    category: 'watches',
    condition: 'Good',
    startingPrice: 50,
    currentPrice: 85,
    sellerId: 'user-5',
    sellerName: 'WatchFinder',
    sellerRating: 4.7,
    sellerReviews: 89,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
    watchers: 5,
    bidCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-5',
    title: 'Gameboy Color',
    subtitle: 'Teal, Working',
    description: 'Original Gameboy Color in teal. Fully working condition.',
    category: 'tech',
    condition: 'Good',
    startingPrice: 80,
    currentPrice: 120,
    sellerId: 'user-6',
    sellerName: 'RetroGamer',
    sellerRating: 4.8,
    sellerReviews: 45,
    images: [
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes
    watchers: 3,
    bidCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing-6',
    title: 'Nike Air Max',
    subtitle: 'Red, Size 9',
    description: 'Nike Air Max in red. Size 9. Good condition.',
    category: 'sneakers',
    condition: 'Good',
    startingPrice: 60,
    currentPrice: 95,
    sellerId: 'user-7',
    sellerName: 'ShoeDealer',
    sellerRating: 4.6,
    sellerReviews: 34,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    ],
    status: 'active',
    endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(), // 1h 15m
    watchers: 4,
    bidCount: 5,
    createdAt: new Date().toISOString(),
  },
];

// Mock bids
const MOCK_BIDS: Record<string, any[]> = {
  'listing-1': [
    { id: 'bid-1', amount: 450, bidderId: 'user-8', bidderName: 'Bidder 8', timestamp: new Date().toISOString() },
    { id: 'bid-2', amount: 420, bidderId: 'user-9', bidderName: 'Bidder 7', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    { id: 'bid-3', amount: 400, bidderId: 'user-10', bidderName: 'Bidder 6', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  ],
  'listing-3': [
    { id: 'bid-4', amount: 1250, bidderId: 'user-11', bidderName: 'Bidder 12', timestamp: new Date().toISOString() },
    { id: 'bid-5', amount: 1200, bidderId: 'user-12', bidderName: 'Bidder 11', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 'bid-6', amount: 1150, bidderId: 'user-13', bidderName: 'Bidder 10', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  ],
};

// Mock chats
const MOCK_CHATS = [
  {
    id: 'chat-1',
    participants: ['user-1', 'user-4'],
    listingId: 'listing-3',
    listingTitle: 'Vintage Chronograph 1970',
    listingImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100',
    unreadCount: 1,
    lastMessage: {
      text: 'Tomorrow works great! How about 3pm at the police station?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      senderId: 'user-4',
    },
  },
];

// Mock messages
const MOCK_MESSAGES: Record<string, any[]> = {
  'chat-1': [
    { id: 'msg-1', text: 'Hi! Thanks for bidding on my watch. When would you like to meet?', senderId: 'user-4', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: true },
    { id: 'msg-2', text: 'Hey! I\'m excited about it. Would tomorrow afternoon work for you?', senderId: 'user-1', timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), read: true },
    { id: 'msg-3', text: 'Tomorrow works great! How about 3pm at the police station on Gottingen?', senderId: 'user-4', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), read: false },
  ],
};

// Mock reviews
const MOCK_REVIEWS = [
  {
    id: 'review-1',
    reviewerId: 'user-14',
    reviewerName: 'Sarah Jenkins',
    reviewerAvatar: null,
    revieweeId: 'user-1',
    rating: 5,
    text: 'Transaction was smooth and safe. Alex was super responsive and the item was exactly as described. Highly recommend!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'review-2',
    reviewerId: 'user-15',
    reviewerName: 'Mike Chen',
    reviewerAvatar: null,
    revieweeId: 'user-1',
    rating: 5,
    text: 'Great seller! Fast shipping and excellent communication.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: '@biddt_current_user',
  USERS: '@biddt_users',
  LISTINGS: '@biddt_listings',
  BIDS: '@biddt_bids',
  CHATS: '@biddt_chats',
  MESSAGES: '@biddt_messages',
  TRANSACTIONS: '@biddt_transactions',
  REVIEWS: '@biddt_reviews',
};

// Initialize storage with mock data
export const initializeStorage = async () => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (!existing) {
      await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(MOCK_LISTINGS));
    }
    
    const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    
    const existingBids = await AsyncStorage.getItem(STORAGE_KEYS.BIDS);
    if (!existingBids) {
      await AsyncStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(MOCK_BIDS));
    }
    
    const existingChats = await AsyncStorage.getItem(STORAGE_KEYS.CHATS);
    if (!existingChats) {
      await AsyncStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(MOCK_CHATS));
    }
    
    const existingMessages = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!existingMessages) {
      await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES));
    }
    
    const existingReviews = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!existingReviews) {
      await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(MOCK_REVIEWS));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Auth functions
export const phoneSignIn = async (phoneNumber: string) => {
  // Simulate OTP sent
  await AsyncStorage.setItem('@biddt_pending_phone', phoneNumber);
  return { verificationId: 'mock-verification-id' };
};

export const verifyOtp = async (verificationId: string, otp: string) => {
  // Mock verification - any 6-digit code works
  if (otp.length === 6) {
    const phoneNumber = await AsyncStorage.getItem('@biddt_pending_phone');
    const userId = 'user-' + generateId();
    const user = {
      id: userId,
      phoneNumber: phoneNumber || '+1234567890',
      name: '',
      email: '',
      avatar: null,
      trustScore: 0,
      location: '',
      joinedAt: new Date().toISOString(),
      stats: { sold: 0, activeBids: 0, replyTime: '<1hr' },
      wallet: { balance: 5000, buyingPower: 5000 },
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    
    const users = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    users[userId] = user;
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    return { user };
  }
  throw new Error('Invalid OTP');
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const updateUser = async (userId: string, data: any) => {
  const users = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  if (users[userId]) {
    users[userId] = { ...users[userId], ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const currentUser = await getCurrentUser();
    if (currentUser?.id === userId) {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userId]));
    }
  }
};

// Listings functions
export const getListings = async (filters?: { category?: string; status?: string }) => {
  const listings = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
  
  if (filters?.category && filters.category !== 'all') {
    return listings.filter((l: any) => l.category === filters.category);
  }
  
  return listings;
};

export const getListing = async (listingId: string) => {
  const listings = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
  return listings.find((l: any) => l.id === listingId) || null;
};

export const createListing = async (listingData: any) => {
  const listings = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
  const newListing = {
    id: 'listing-' + generateId(),
    ...listingData,
    createdAt: new Date().toISOString(),
    status: 'active',
    bidCount: 0,
    watchers: 0,
  };
  listings.unshift(newListing);
  await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  return newListing.id;
};

// Bids functions
export const getBids = async (listingId: string) => {
  const allBids = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.BIDS) || '{}');
  return allBids[listingId] || [];
};

export const placeBid = async (listingId: string, bidData: any) => {
  const allBids = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.BIDS) || '{}');
  if (!allBids[listingId]) {
    allBids[listingId] = [];
  }
  
  const newBid = {
    id: 'bid-' + generateId(),
    ...bidData,
    timestamp: new Date().toISOString(),
  };
  
  allBids[listingId].unshift(newBid);
  await AsyncStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(allBids));
  
  // Update listing price
  const listings = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
  const listingIndex = listings.findIndex((l: any) => l.id === listingId);
  if (listingIndex >= 0) {
    listings[listingIndex].currentPrice = bidData.amount;
    listings[listingIndex].bidCount = (listings[listingIndex].bidCount || 0) + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }
  
  return newBid.id;
};

// Chat functions
export const getUserChats = async (userId: string) => {
  const chats = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CHATS) || '[]');
  return chats.filter((c: any) => c.participants.includes(userId));
};

export const getMessages = async (chatId: string) => {
  const allMessages = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
  return allMessages[chatId] || [];
};

export const sendMessage = async (chatId: string, messageData: any) => {
  const allMessages = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES) || '{}');
  if (!allMessages[chatId]) {
    allMessages[chatId] = [];
  }
  
  const newMessage = {
    id: 'msg-' + generateId(),
    ...messageData,
    timestamp: new Date().toISOString(),
    read: false,
  };
  
  allMessages[chatId].push(newMessage);
  await AsyncStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
  
  // Update chat last message
  const chats = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.CHATS) || '[]');
  const chatIndex = chats.findIndex((c: any) => c.id === chatId);
  if (chatIndex >= 0) {
    chats[chatIndex].lastMessage = newMessage;
    await AsyncStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }
  
  return newMessage.id;
};

// Reviews functions
export const getUserReviews = async (userId: string) => {
  const reviews = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  return reviews.filter((r: any) => r.revieweeId === userId);
};

// Wallet functions
export const getWalletBalance = async (userId: string) => {
  const users = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  return users[userId]?.wallet?.balance || 0;
};

export const updateWallet = async (userId: string, amount: number) => {
  const users = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.USERS) || '{}');
  if (users[userId]) {
    users[userId].wallet.balance += amount;
    users[userId].wallet.buyingPower += amount;
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
};

// Safe exchange
export const createSafeExchange = async (exchangeData: any) => {
  const exchanges = JSON.parse(await AsyncStorage.getItem('@biddt_exchanges') || '[]');
  const newExchange = {
    id: 'exchange-' + generateId(),
    ...exchangeData,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  exchanges.push(newExchange);
  await AsyncStorage.setItem('@biddt_exchanges', JSON.stringify(exchanges));
  return newExchange.id;
};

// Subscribe functions (simulated with intervals)
export const subscribeToListings = (callback: (listings: any[]) => void) => {
  const checkUpdates = async () => {
    const listings = await getListings();
    callback(listings);
  };
  
  checkUpdates();
  const interval = setInterval(checkUpdates, 5000);
  
  return () => clearInterval(interval);
};

export const subscribeToBids = (listingId: string, callback: (bids: any[]) => void) => {
  const checkUpdates = async () => {
    const bids = await getBids(listingId);
    callback(bids);
  };
  
  checkUpdates();
  const interval = setInterval(checkUpdates, 3000);
  
  return () => clearInterval(interval);
};

export const subscribeToMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const checkUpdates = async () => {
    const messages = await getMessages(chatId);
    callback(messages);
  };
  
  checkUpdates();
  const interval = setInterval(checkUpdates, 2000);
  
  return () => clearInterval(interval);
};

// Mock server timestamp
export const serverTimestamp = () => new Date().toISOString();

// Initialize on import
initializeStorage();
