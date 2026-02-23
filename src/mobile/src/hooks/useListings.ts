import { useState, useEffect, useCallback } from 'react';
import {
  getListings,
  getListing,
  createListing as createListingService,
  getBids,
  placeBid as placeBidService,
  subscribeToListings,
  subscribeToBids,
} from '../services/localStorage';

export const useListings = (filters?: { category?: string }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
    const unsubscribe = subscribeToListings((updatedListings) => {
      if (filters?.category && filters.category !== 'all') {
        setListings(updatedListings.filter((l) => l.category === filters.category));
      } else {
        setListings(updatedListings);
      }
    });
    return () => unsubscribe();
  }, [filters?.category]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await getListings(filters);
      setListings(data);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listingData: any) => {
    const id = await createListingService(listingData);
    await loadListings();
    return id;
  };

  return { listings, loading, createListing, refresh: loadListings };
};

export const useListing = (listingId: string) => {
  const [listing, setListing] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (listingId) {
      loadListing();
      loadBids();
      
      const unsubscribeBids = subscribeToBids(listingId, (updatedBids) => {
        setBids(updatedBids);
      });
      
      return () => unsubscribeBids();
    }
  }, [listingId]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const data = await getListing(listingId);
      setListing(data);
    } catch (error) {
      console.error('Error loading listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    try {
      const data = await getBids(listingId);
      setBids(data);
    } catch (error) {
      console.error('Error loading bids:', error);
    }
  };

  const placeBid = async (amount: number, userId: string, userName: string) => {
    await placeBidService(listingId, {
      amount,
      bidderId: userId,
      bidderName: userName,
    });
    await loadListing();
    await loadBids();
  };

  return { listing, bids, loading, placeBid, refresh: loadListing };
};
