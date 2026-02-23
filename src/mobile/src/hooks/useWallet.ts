import { useState, useEffect } from 'react';
import {
  getWalletBalance,
  updateWallet,
  getCurrentUser,
} from '../services/localStorage';

export const useWallet = () => {
  const [balance, setBalance] = useState(5000);
  const [buyingPower, setBuyingPower] = useState(5000);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const user = await getCurrentUser();
      if (user?.id) {
        const bal = await getWalletBalance(user.id);
        setBalance(bal);
        setBuyingPower(user.wallet?.buyingPower || bal);
      } else {
        // Default for demo
        setBalance(5000);
        setBuyingPower(5000);
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
    } else {
      setBalance((prev) => prev + amount);
      setBuyingPower((prev) => prev + amount);
    }
  };

  const deductFunds = async (amount: number) => {
    const user = await getCurrentUser();
    if (user?.id) {
      await updateWallet(user.id, -amount);
      await fetchBalance();
    } else {
      setBalance((prev) => Math.max(0, prev - amount));
      setBuyingPower((prev) => Math.max(0, prev - amount));
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    balance,
    buyingPower,
    loading,
    addFunds,
    deductFunds,
    refresh: fetchBalance,
  };
};
