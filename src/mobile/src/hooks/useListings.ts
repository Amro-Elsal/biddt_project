// src/hooks/useListings.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  getListings, 
  getListing, 
  createListing, 
  subscribeToListings,
  subscribeToListing,
  placeBid,
  getBids,
  subscribeToBids,
  uploadImage
} from '../services/firebase';
import { Listing, Bid, Category } from '../types';

export const useListings = (filters?: { category?: Category; status?: string }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Try to get cached data first
    const unsubscribe = subscribeToListings((data) => {
      setListings(data as Listing[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filters?.category, filters?.status]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getListings(filters);
      setListings(data as Listing[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  return { listings, loading, error, refresh };
};

export const useListing = (listingId: string) => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!listingId) return;

    const unsubscribe = subscribeToListing(listingId, (data) => {
      setListing(data as Listing);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listingId]);

  return { listing, loading, error };
};

export const useCreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (listingData: Partial<Listing>, imageUris: string[]) => {
    setLoading(true);
    setError(null);

    try {
      // Upload images
      const imageUrls = await Promise.all(
        imageUris.map((uri, index) =
          uploadImage(uri, `listings/${Date.now()}_${index}.jpg`)
        )
      );

      const listing = await createListing({
        ...listingData,
        images: imageUrls,
      });

      return { success: true, listingId: listing };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useBids = (listingId: string) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listingId) return;

    const unsubscribe = subscribeToBids(listingId, (data) => {
      setBids(data as Bid[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [listingId]);

  const placeNewBid = useCallback(async (bidData: Partial<Bid>) => {
    try {
      await placeBid(listingId, bidData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [listingId]);

  return { bids, loading, placeNewBid };
};
