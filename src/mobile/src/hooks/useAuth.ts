import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCurrentUser,
  updateUser as updateUserService,
  getWalletBalance,
  updateWallet,
} from '../services/localStorage';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: any) => {
    if (user?.id) {
      await updateUserService(user.id, data);
      const updated = await getCurrentUser();
      setUser(updated);
    }
  };

  return { user, loading, updateUser, refreshUser: loadUser };
};

export const useWallet = () => {
  const [balance, setBalance] = useState(0);
  const [buyingPower, setBuyingPower] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const user = await getCurrentUser();
      if (user?.id) {
        const bal = await getWalletBalance(user.id);
        setBalance(bal);
        setBuyingPower(user.wallet?.buyingPower || bal);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFunds = async (amount: number) => {
    const user = await getCurrentUser();
    if (user?.id) {
      await updateWallet(user.id, amount);
      await fetchBalance();
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return { balance, buyingPower, loading, addFunds, refresh: fetchBalance };
};
