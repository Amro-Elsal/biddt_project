// src/types/index.ts

export interface User {
  id: string;
  phoneNumber: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  trustScore: number;
  soldCount: number;
  activeBids: number;
  replyTime: string;
  createdAt: Date;
  walletBalance: number;
  buyingPower: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: Category;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  startingPrice: number;
  currentPrice: number;
  buyNowPrice?: number;
  reservePrice?: number;
  seller: User;
  lotNumber: string;
  startTime: Date;
  endTime: Date;
  status: 'draft' | 'live' | 'ending_soon' | 'ended' | 'sold';
  bids: Bid[];
  watchers: number;
  views: number;
  location: string;
  shipping: {
    cost: number;
    methods: string[];
  };
  createdAt: Date;
}

export type Category = 'all' | 'sneakers' | 'tech' | 'vintage' | 'streetwear' | 'collectibles' | 'watches' | 'art';

export interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  bidder: User;
  amount: number;
  timestamp: Date;
  isAutoBid: boolean;
  maxAutoBid?: number;
}

export interface Chat {
  id: string;
  participants: User[];
  listingId?: string;
  listing?: Listing;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  sender: User;
  text: string;
  images?: string[];
  timestamp: Date;
  read: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bid_hold' | 'bid_release' | 'purchase' | 'sale';
  amount: number;
  userId: string;
  listingId?: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  listingId: string;
  listing: Listing;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface SafeExchange {
  id: string;
  listingId: string;
  listing: Listing;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  qrCode: string;
  status: 'pending' | 'confirmed' | 'completed' | 'disputed';
  meetupLocation?: string;
  meetupTime?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'outbid' | 'auction_ending' | 'auction_won' | 'auction_lost' | 'bid_placed' | 'message' | 'sale' | 'purchase' | 'verification';
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}
