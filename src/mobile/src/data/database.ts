import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatar?: string;
  rating: number;
  transactions: number;
  verified: boolean;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currentBid: number;
  bidCount: number;
  image: string;
  images: string[];
  seller: User;
  timeLeft: string;
  isLive: boolean;
  category: string;
  condition: string;
  bids: Bid[];
  status: 'active' | 'ended' | 'sold';
  winner?: User;
}

export interface Bid {
  id: string;
  listingId: string;
  bidder: User;
  amount: number;
  timestamp: string;
}

export interface Transaction {
  id: string;
  listing: Listing;
  buyer: User;
  seller: User;
  amount: number;
  status: 'pending' | 'paid' | 'qr_generated' | 'scanned' | 'completed' | 'disputed';
  qrCode: string;
  qrExpiresAt: string;
  meetupLocation: string;
  buyerRating?: number;
  sellerRating?: number;
  buyerReview?: string;
  sellerReview?: string;
  createdAt: string;
  completedAt?: string;
}

class AppDatabase {
  private static instance: AppDatabase;
  
  private constructor() {}
  
  static getInstance(): AppDatabase {
    if (!AppDatabase.instance) {
      AppDatabase.instance = new AppDatabase();
    }
    return AppDatabase.instance;
  }

  // User operations
  async setCurrentUser(user: User): Promise<void> {
    await AsyncStorage.setItem('@biddt_current_user', JSON.stringify(user));
  }

  async getCurrentUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem('@biddt_current_user');
    return data ? JSON.parse(data) : null;
  }

  async clearCurrentUser(): Promise<void> {
    await AsyncStorage.removeItem('@biddt_current_user');
  }

  // Listings operations
  async getListings(): Promise<Listing[]> {
    const data = await AsyncStorage.getItem('@biddt_listings');
    if (data) return JSON.parse(data);
    
    // Default listings
    const defaultListings: Listing[] = [
      {
        id: '1',
        title: 'Vintage Nike Air Jordan 1 Chicago',
        description: 'Original 1985 release. Great condition with original box. Size 10.5. Authenticated by StockX.',
        price: 45000,
        currentBid: 42000,
        bidCount: 12,
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
        images: [
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
        ],
        seller: {
          id: 'seller1',
          phone: '+1234567890',
          name: 'SneakerKing',
          rating: 4.9,
          transactions: 156,
          verified: true,
          createdAt: new Date().toISOString(),
        },
        timeLeft: '2h 15m',
        isLive: true,
        category: 'sneakers',
        condition: 'Like New',
        bids: [],
        status: 'active',
      },
      {
        id: '2',
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        description: 'Brand new, sealed in box. Never opened. Full Apple warranty.',
        price: 120000,
        currentBid: 115000,
        bidCount: 8,
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',
        images: [
          'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=600',
        ],
        seller: {
          id: 'seller2',
          phone: '+1234567891',
          name: 'TechDeals',
          rating: 4.8,
          transactions: 89,
          verified: true,
          createdAt: new Date().toISOString(),
        },
        timeLeft: '5h 30m',
        isLive: true,
        category: 'tech',
        condition: 'New',
        bids: [],
        status: 'active',
      },
      {
        id: '3',
        title: 'Vintage Leather Jacket - 90s Style',
        description: 'Genuine leather, vintage 90s style. Perfect condition. Size M.',
        price: 15000,
        currentBid: 12000,
        bidCount: 5,
        image: 'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=600',
        images: [
          'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=600',
        ],
        seller: {
          id: 'seller3',
          phone: '+1234567892',
          name: 'VintageFinds',
          rating: 4.7,
          transactions: 45,
          verified: false,
          createdAt: new Date().toISOString(),
        },
        timeLeft: '1d 3h',
        isLive: true,
        category: 'fashion',
        condition: 'Good',
        bids: [],
        status: 'active',
      },
    ];
    
    await AsyncStorage.setItem('@biddt_listings', JSON.stringify(defaultListings));
    return defaultListings;
  }

  async updateListing(listing: Listing): Promise<void> {
    const listings = await this.getListings();
    const index = listings.findIndex(l => l.id === listing.id);
    if (index >= 0) {
      listings[index] = listing;
      await AsyncStorage.setItem('@biddt_listings', JSON.stringify(listings));
    }
  }

  // Transaction operations
  async createTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem('@biddt_transactions', JSON.stringify(transactions));
  }

  async getTransactions(): Promise<Transaction[]> {
    const data = await AsyncStorage.getItem('@biddt_transactions');
    return data ? JSON.parse(data) : [];
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
      await AsyncStorage.setItem('@biddt_transactions', JSON.stringify(transactions));
    }
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const transactions = await this.getTransactions();
    return transactions.find(t => t.id === id) || null;
  }

  // Wallet operations (fake)
  async getWalletBalance(): Promise<number> {
    const data = await AsyncStorage.getItem('@biddt_wallet_balance');
    return data ? parseInt(data) : 50000; // Default $500
  }

  async updateWalletBalance(amount: number): Promise<void> {
    await AsyncStorage.setItem('@biddt_wallet_balance', amount.toString());
  }

  // Clear all data
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      '@biddt_current_user',
      '@biddt_listings',
      '@biddt_transactions',
      '@biddt_wallet_balance',
    ]);
  }
}

export const db = AppDatabase.getInstance();

// Helper functions
export const generateId = () => Math.random().toString(36).substring(2, 15);

export const generateQRCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BIDDT-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toLocaleString()}`;
};

export const formatTimeLeft = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};
