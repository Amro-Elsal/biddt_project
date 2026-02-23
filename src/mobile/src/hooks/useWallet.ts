// src/hooks/useWallet.ts
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTransaction, getTransactions, updateUser } from '../services/firebase';
import { Transaction } from '../types';

const WALLET_KEY = '@biddt_wallet';

export const useWallet = (userId: string) => {
  const [balance, setBalance] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(`${WALLET_KEY}_${userId}`);
      if (stored) {
        const data = JSON.parse(stored);
        setBalance(data.balance || 0);
        setBuyingPower(data.buyingPower || 0);
      }
      
      // Load transactions from Firebase
      const txs = await getTransactions(userId);
      setTransactions(txs as Transaction[]);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  }, [userId]);

  const saveWallet = useCallback(async (newBalance: number, newBuyingPower: number) => {
    try {
      await AsyncStorage.setItem(
        `${WALLET_KEY}_${userId}`,
        JSON.stringify({ balance: newBalance, buyingPower: newBuyingPower })
      );
      
      // Update Firebase
      await updateUser(userId, { 
        walletBalance: newBalance, 
        buyingPower: newBuyingPower 
      });
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  }, [userId]);

  const deposit = useCallback(async (amount: number, paymentMethod: string) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newBalance = balance + amount;
      const newBuyingPower = buyingPower + amount;
      
      setBalance(newBalance);
      setBuyingPower(newBuyingPower);
      await saveWallet(newBalance, newBuyingPower);
      
      // Create transaction record
      await createTransaction(userId, {
        type: 'deposit',
        amount,
        status: 'completed',
        description: `Deposit via ${paymentMethod}`,
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [balance, buyingPower, saveWallet, userId]);

  const holdForBid = useCallback(async (amount: number, listingId: string) => {
    if (buyingPower < amount) {
      return { success: false, error: 'Insufficient buying power' };
    }

    try {
      const newBuyingPower = buyingPower - amount;
      setBuyingPower(newBuyingPower);
      await saveWallet(balance, newBuyingPower);
      
      await createTransaction(userId, {
        type: 'bid_hold',
        amount: -amount,
        listingId,
        status: 'completed',
        description: 'Bid hold',
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [balance, buyingPower, saveWallet, userId]);

  const releaseHold = useCallback(async (amount: number, listingId: string) => {
    try {
      const newBuyingPower = buyingPower + amount;
      setBuyingPower(newBuyingPower);
      await saveWallet(balance, newBuyingPower);
      
      await createTransaction(userId, {
        type: 'bid_release',
        amount,
        listingId,
        status: 'completed',
        description: 'Bid hold released',
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [balance, buyingPower, saveWallet, userId]);

  return {
    balance,
    buyingPower,
    transactions,
    loading,
    loadWallet,
    deposit,
    holdForBid,
    releaseHold,
  };
};
