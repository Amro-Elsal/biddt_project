// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  auth, 
  onAuthChange, 
  getUser, 
  createUser, 
  updateUser,
  phoneSignIn,
  verifyOtp,
  logoutUser
} from '../services/firebase';
import { User } from '../types';

const USER_STORAGE_KEY = '@biddt_user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        // Get user data from Firestore
        const userData = await getUser(fbUser.uid);
        if (userData) {
          const userObj = userData as User;
          setUser(userObj);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendOtp = useCallback(async (phoneNumber: string, appVerifier: any) => {
    try {
      const confirmationResult = await phoneSignIn(phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const confirmOtp = useCallback(async (otp: string) => {
    if (!verificationId) {
      return { success: false, error: 'No verification ID found' };
    }
    
    try {
      const result = await verifyOtp(verificationId, otp);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [verificationId]);

  const completeProfile = useCallback(async (profileData: Partial<User>) => {
    if (!firebaseUser) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const userData: User = {
        id: firebaseUser.uid,
        phoneNumber: firebaseUser.phoneNumber || '',
        displayName: profileData.displayName || '',
        avatar: profileData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        verified: false,
        trustScore: 50,
        soldCount: 0,
        activeBids: 0,
        replyTime: '<1hr',
        createdAt: new Date(),
        walletBalance: 0,
        buyingPower: 0,
        ...profileData,
      };

      await createUser(firebaseUser.uid, userData);
      setUser(userData);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [firebaseUser]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return { success: false, error: 'No user' };

    try {
      await updateUser(user.id, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
      setFirebaseUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    sendOtp,
    confirmOtp,
    completeProfile,
    updateProfile,
    logout,
  };
};
