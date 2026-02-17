import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../index.js';
import { listings, bids, users, watchlist } from '../db/schema.js';
import { eq, and, gt, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas
const createListingSchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().max(2000).optional(),
  category: z.string(),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  images: z.array(z.string().url()).min(1).max(10),
  startingPriceCents: z.number().int().positive(),
  reservePriceCents: z.number().int().positive().optional(),
  buyNowPriceCents: z.number().int().positive().optional(),
  listingType: z.enum(['auction', 'fixed', 'both']).default('auction'),
  durationHours: z.number().int().min(1).max(168).default(72), // Max 7 days
  locationLat: z.number(),
  locationLng: z.number(),
  locationName: z.string(),
});

const listingQuerySchema = z.object({
  category: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radius: z.coerce.number().default(50), // km
  status: z.enum(['active', 'ending_soon', 'all']).default('active'),
  sort: z.enum(['newest', 'ending_soon', 'price_low', 'price_high']).default('newest'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().max(50).default(20),
});

export async function listingRoutes(app: FastifyInstance) {
  // Middleware to verify JWT
  app.addHook('onRequest', async (request, reply) => {
    if (request.routerPath === '/listings' && request.method === 'GET') {
      return; // Public endpoint
    }
    
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Create listing
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const data = createListingSchema.parse(request.body);
    
    const now = new Date();
    const endsAt = new Date(now.getTime() + data.durationHours * 60 * 60 * 1000);
    
    const [listing] = await db
      .insert(listings)
      .values({
        sellerId: userId,
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        images: data.images,
        startingPriceCents: data.startingPriceCents,
        reservePriceCents: data.reservePriceCents,
        buyNowPriceCents: data.buyNowPriceCents,
        listingType: data.listingType,
        status: 'active',
        startsAt: now,
        endsAt,
        locationLat: data.locationLat.toString(),
        locationLng: data.locationLng.toString(),
        locationName: data.locationName,
      })
      .returning();
    
    return {
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        status: listing.status,
        endsAt: listing.endsAt,
      },
    };
  });

  // Get listings (browse)
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = listingQuerySchema.parse(request.query);
    
    let whereClause = sql`1=1`;
    
    if (query.status === 'active') {
      whereClause = sql`${listings.status} = 'active' AND ${listings.endsAt} > NOW()`;
    } else if (query.status === 'ending_soon') {
      const soon = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      whereClause = sql`${listings.status} = 'active' AND ${listings.endsAt} <= ${soon} AND ${listings.endsAt} > NOW()`;
    }
    
    if (query.category) {
      whereClause = sql`${whereClause} AND ${listings.category} = ${query.category}`;
    }
    
    // TODO: Add geospatial filtering
    
    const offset = (query.page - 1) * query.limit;
    
    const results = await db
      .select({
        listing: listings,
        seller: {
          id: users.id,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(listings)
      .leftJoin(users, eq(listings.sellerId, users.id))
      .where(whereClause)
      .orderBy(desc(listings.createdAt))
      .limit(query.limit)
      .offset(offset);
    
    return {
      listings: results.map(r => ({
        ...r.listing,
        seller: r.seller,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        hasMore: results.length === query.limit,
      },
    };
  });

  // Get single listing
  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    
    const [result] = await db
      .select({
        listing: listings,
        seller: {
          id: users.id,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(listings)
      .leftJoin(users, eq(listings.sellerId, users.id))
      .where(eq(listings.id, id));
    
    if (!result) {
      return reply.status(404).send({ error: 'Listing not found' });
    }
    
    // Get bid history
    const bidHistory = await db
      .select({
        id: bids.id,
        amountCents: bids.amountCents,
        createdAt: bids.createdAt,
        bidder: {
          id: users.id,
          displayName: users.displayName,
        },
      })
      .from(bids)
      .leftJoin(users, eq(bids.bidderId, users.id))
      .where(eq(bids.listingId, id))
      .orderBy(desc(bids.amountCents))
      .limit(10);
    
    // Increment view count
    await db
      .update(listings)
      .set({ viewCount: sql`${listings.viewCount} + 1` })
      .where(eq(listings.id, id));
    
    return {
      ...result.listing,
      seller: result.seller,
      bidHistory,
    };
  });

  // Watch/unwatch listing
  app.post('/:id/watch', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    // Check if already watching
    const [existing] = await db
      .select()
      .from(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.listingId, id)
      ));
    
    if (existing) {
      // Unwatch
      await db
        .delete(watchlist)
        .where(eq(watchlist.id, existing.id));
      
      await db
        .update(listings)
        .set({ watchCount: sql`${listings.watchCount} - 1` })
        .where(eq(listings.id, id));
      
      return { watching: false };
    } else {
      // Watch
      await db.insert(watchlist).values({
        userId,
        listingId: id,
      });
      
      await db
        .update(listings)
        .set({ watchCount: sql`${listings.watchCount} + 1` })
        .where(eq(listings.id, id));
      
      return { watching: true };
    }
  });

  // Delete listing (seller only, if no bids)
  app.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, id));
    
    if (!listing) {
      return reply.status(404).send({ error: 'Listing not found' });
    }
    
    if (listing.sellerId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' });
    }
    
    if (listing.bidCount > 0) {
      return reply.status(400).send({ error: 'Cannot delete listing with bids' });
    }
    
    await db
      .update(listings)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(listings.id, id));
    
    return { success: true };
  });
}
