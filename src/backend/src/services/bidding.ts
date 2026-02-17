import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { bids, listings, notifications, transactions } from '../db/schema.js';
import { eq, desc, and, lte } from 'drizzle-orm';
import { addMinutes } from 'date-fns';

export class BiddingService {
  constructor(private db: NodePgDatabase) {}

  // Check and end expired auctions
  async processExpiredAuctions(): Promise<void> {
    const now = new Date();
    
    // Find expired active listings
    const expiredListings = await this.db
      .select()
      .from(listings)
      .where(and(
        eq(listings.status, 'active'),
        lte(listings.endsAt, now)
      ));
    
    for (const listing of expiredListings) {
      await this.endAuction(listing.id);
    }
  }

  // End a single auction
  async endAuction(listingId: string): Promise<void> {
    // Get highest bid
    const [winningBid] = await this.db
      .select()
      .from(bids)
      .where(eq(bids.listingId, listingId))
      .orderBy(desc(bids.amountCents))
      .limit(1);
    
    if (winningBid) {
      // Mark bid as won
      await this.db
        .update(bids)
        .set({ status: 'won' })
        .where(eq(bids.id, winningBid.id));
      
      // Mark other bids as lost
      await this.db
        .update(bids)
        .set({ status: 'outbid' })
        .where(and(
          eq(bids.listingId, listingId),
          eq(bids.status, 'active')
        ));
      
      // Update listing
      await this.db
        .update(listings)
        .set({ status: 'ended', updatedAt: new Date() })
        .where(eq(listings.id, listingId));
      
      // Notify winner
      await this.db.insert(notifications).values({
        userId: winningBid.bidderId,
        type: 'won',
        title: '🎉 You won!',
        body: 'You won the auction! Complete your payment to secure your item.',
        data: { listingId, bidId: winningBid.id },
      });
      
      // Notify seller
      const [listing] = await this.db
        .select()
        .from(listings)
        .where(eq(listings.id, listingId));
      
      if (listing) {
        await this.db.insert(notifications).values({
          userId: listing.sellerId,
          type: 'won',
          title: 'Auction ended!',
          body: `Your item sold for $${(winningBid.amountCents / 100).toFixed(2)}`,
          data: { listingId, bidId: winningBid.id },
        });
      }
    } else {
      // No bids - mark as ended without sale
      await this.db
        .update(listings)
        .set({ status: 'ended', updatedAt: new Date() })
        .where(eq(listings.id, listingId));
    }
  }

  // Auto-bid (proxy bidding)
  async processAutoBids(listingId: string, newBidAmount: number): Promise<void> {
    // Find auto-bids that should trigger
    const autoBids = await this.db
      .select()
      .from(bids)
      .where(and(
        eq(bids.listingId, listingId),
        eq(bids.isAutoBid, true),
        eq(bids.status, 'active')
      ))
      .orderBy(desc(bids.maxAmountCents));
    
    for (const autoBid of autoBids) {
      if (!autoBid.maxAmountCents) continue;
      
      // Calculate minimum bid needed
      const minBid = newBidAmount + 100; // $1 increment
      
      if (autoBid.maxAmountCents >= minBid) {
        // Place auto-bid
        const bidAmount = Math.min(autoBid.maxAmountCents, minBid);
        
        await this.db
          .update(bids)
          .set({ amountCents: bidAmount, updatedAt: new Date() })
          .where(eq(bids.id, autoBid.id));
        
        // Update listing
        await this.db
          .update(listings)
          .set({ currentBidCents: bidAmount, updatedAt: new Date() })
          .where(eq(listings.id, listingId));
        
        newBidAmount = bidAmount;
      }
    }
  }

  // Extend auction if bid in last 5 minutes (anti-sniping)
  async checkAuctionExtension(listingId: string): Promise<void> {
    const [listing] = await this.db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));
    
    if (!listing || listing.status !== 'active') return;
    
    const fiveMinutes = 5 * 60 * 1000;
    const timeRemaining = listing.endsAt.getTime() - Date.now();
    
    if (timeRemaining < fiveMinutes) {
      // Extend by 5 minutes
      const newEndTime = addMinutes(listing.endsAt, 5);
      
      await this.db
        .update(listings)
        .set({ endsAt: newEndTime, updatedAt: new Date() })
        .where(eq(listings.id, listingId));
      
      // Notify watchers
      // TODO: Get watchers and notify them
    }
  }
}
