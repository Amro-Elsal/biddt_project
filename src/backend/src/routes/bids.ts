import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../index.js';
import { bids, listings, users, notifications } from '../db/schema.js';
import { eq, and, gt, desc, sql } from 'drizzle-orm';

// Validation schemas
const placeBidSchema = z.object({
  listingId: z.string().uuid(),
  amountCents: z.number().int().positive(),
  maxAmountCents: z.number().int().positive().optional(),
});

export async function bidRoutes(app: FastifyInstance) {
  // Middleware to verify JWT
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Place a bid
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { listingId, amountCents, maxAmountCents } = placeBidSchema.parse(request.body);
    
    // Get listing
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));
    
    if (!listing) {
      return reply.status(404).send({ error: 'Listing not found' });
    }
    
    if (listing.status !== 'active') {
      return reply.status(400).send({ error: 'Listing is not active' });
    }
    
    if (listing.endsAt <= new Date()) {
      return reply.status(400).send({ error: 'Auction has ended' });
    }
    
    if (listing.sellerId === userId) {
      return reply.status(400).send({ error: 'Cannot bid on your own listing' });
    }
    
    // Check minimum bid
    const minBid = listing.currentBidCents > 0 
      ? listing.currentBidCents + 100 // $1 minimum increment
      : listing.startingPriceCents;
    
    if (amountCents < minBid) {
      return reply.status(400).send({ 
        error: `Bid must be at least $${(minBid / 100).toFixed(2)}`,
        minBidCents: minBid,
      });
    }
    
    // Check if user is already highest bidder
    if (listing.currentBidCents > 0) {
      const [currentHighBid] = await db
        .select()
        .from(bids)
        .where(eq(bids.listingId, listingId))
        .orderBy(desc(bids.amountCents))
        .limit(1);
      
      if (currentHighBid?.bidderId === userId) {
        return reply.status(400).send({ error: 'You are already the highest bidder' });
      }
      
      // Notify previous highest bidder they've been outbid
      if (currentHighBid) {
        await db.insert(notifications).values({
          userId: currentHighBid.bidderId,
          type: 'outbid',
          title: 'You\'ve been outbid!',
          body: `Someone placed a higher bid on "${listing.title}"`,
          data: { listingId, newBidCents: amountCents },
        });
      }
    }
    
    // Create bid
    const [bid] = await db
      .insert(bids)
      .values({
        listingId,
        bidderId: userId,
        amountCents,
        maxAmountCents: maxAmountCents || amountCents,
        isAutoBid: !!maxAmountCents && maxAmountCents > amountCents,
        status: 'active',
      })
      .returning();
    
    // Update listing
    await db
      .update(listings)
      .set({
        currentBidCents: amountCents,
        bidCount: sql`${listings.bidCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(listings.id, listingId));
    
    // Notify seller
    await db.insert(notifications).values({
      userId: listing.sellerId,
      type: 'bid',
      title: 'New bid on your item!',
      body: `Someone bid $${(amountCents / 100).toFixed(2)} on "${listing.title}"`,
      data: { listingId, bidId: bid.id },
    });
    
    return {
      success: true,
      bid: {
        id: bid.id,
        amountCents: bid.amountCents,
        isHighBid: true,
      },
    };
  });

  // Get my bids
  app.get('/my-bids', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    
    const myBids = await db
      .select({
        bid: bids,
        listing: {
          id: listings.id,
          title: listings.title,
          images: listings.images,
          currentBidCents: listings.currentBidCents,
          endsAt: listings.endsAt,
          status: listings.status,
        },
      })
      .from(bids)
      .leftJoin(listings, eq(bids.listingId, listings.id))
      .where(eq(bids.bidderId, userId))
      .orderBy(desc(bids.createdAt));
    
    return {
      bids: myBids.map(b => ({
        ...b.bid,
        listing: b.listing,
        isWinning: b.bid.amountCents === b.listing?.currentBidCents && b.listing?.status === 'active',
      })),
    };
  });

  // Get bid history for a listing
  app.get('/listing/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    
    const bidHistory = await db
      .select({
        id: bids.id,
        amountCents: bids.amountCents,
        isAutoBid: bids.isAutoBid,
        createdAt: bids.createdAt,
        bidder: {
          id: users.id,
          displayName: users.displayName,
        },
      })
      .from(bids)
      .leftJoin(users, eq(bids.bidderId, users.id))
      .where(eq(bids.listingId, id))
      .orderBy(desc(bids.amountCents));
    
    return { bids: bidHistory };
  });
}
