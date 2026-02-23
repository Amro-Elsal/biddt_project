// src/services/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  PhoneAuthProvider, 
  signInWithCredential,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration - Replace with your own config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "biddt-app.firebaseapp.com",
  projectId: "biddt-app",
  storageBucket: "biddt-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth helpers
export const phoneSignIn = async (phoneNumber: string, appVerifier: any) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Phone sign in error:', error);
    throw error;
  }
};

export const verifyOtp = async (verificationId: string, otp: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const result = await signInWithCredential(auth, credential);
    return result;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  }
};

export const logoutUser = () => signOut(auth);

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore helpers
export const createUser = async (userId: string, userData: any) => {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (userId: string) => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateUser = async (userId: string, data: any) => {
  await updateDoc(doc(db, 'users', userId), data);
};

// Listings
export const createListing = async (listingData: any) => {
  const docRef = await addDoc(collection(db, 'listings'), {
    ...listingData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getListings = async (filters?: { category?: string; status?: string }) => {
  let q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
  
  if (filters?.category && filters.category !== 'all') {
    q = query(q, where('category', '==', filters.category));
  }
  
  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getListing = async (listingId: string) => {
  const docSnap = await getDoc(doc(db, 'listings', listingId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const subscribeToListing = (listingId: string, callback: (data: any) => void) => {
  return onSnapshot(doc(db, 'listings', listingId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const subscribeToListings = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// Bids
export const placeBid = async (listingId: string, bidData: any) => {
  const bidRef = await addDoc(collection(db, 'listings', listingId, 'bids'), {
    ...bidData,
    timestamp: serverTimestamp(),
  });
  
  // Update listing current price
  await updateDoc(doc(db, 'listings', listingId), {
    currentPrice: bidData.amount,
    updatedAt: serverTimestamp(),
  });
  
  return bidRef.id;
};

export const getBids = async (listingId: string) => {
  const q = query(
    collection(db, 'listings', listingId, 'bids'),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToBids = (listingId: string, callback: (bids: any[]) => void) => {
  const q = query(
    collection(db, 'listings', listingId, 'bids'),
    orderBy('timestamp', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const bids = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bids);
  });
};

// Chat
export const createChat = async (participants: string[], listingId?: string) => {
  const chatRef = await addDoc(collection(db, 'chats'), {
    participants,
    listingId,
    unreadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return chatRef.id;
};

export const getUserChats = async (userId: string) => {
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const sendMessage = async (chatId: string, messageData: any) => {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    ...messageData,
    timestamp: serverTimestamp(),
    read: false,
  });
  
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: messageData,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

// Storage
export const uploadImage = async (uri: string, path: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// Wallet/Transactions
export const createTransaction = async (userId: string, transactionData: any) => {
  const txRef = await addDoc(collection(db, 'users', userId, 'transactions'), {
    ...transactionData,
    createdAt: serverTimestamp(),
  });
  return txRef.id;
};

export const getTransactions = async (userId: string) => {
  const q = query(
    collection(db, 'users', userId, 'transactions'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Reviews
export const createReview = async (reviewData: any) => {
  const reviewRef = await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: serverTimestamp(),
  });
  return reviewRef.id;
};

export const getUserReviews = async (userId: string) => {
  const q = query(
    collection(db, 'reviews'),
    where('revieweeId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Safe Exchange
export const createSafeExchange = async (exchangeData: any) => {
  const exchangeRef = await addDoc(collection(db, 'safeExchanges'), {
    ...exchangeData,
    createdAt: serverTimestamp(),
  });
  return exchangeRef.id;
};

export const updateSafeExchange = async (exchangeId: string, data: any) => {
  await updateDoc(doc(db, 'safeExchanges', exchangeId), data);
};

export const getSafeExchange = async (exchangeId: string) => {
  const docSnap = await getDoc(doc(db, 'safeExchanges', exchangeId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export { serverTimestamp, Timestamp };
