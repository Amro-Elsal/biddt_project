import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../index.js';
import { users, wallets, listings, bids } from '../db/schema.js';
import { eq, desc, count } from 'drizzle-orm';
import { z } from 'zod';

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

export async function userRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Get my profile
  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    
    // Get wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    
    // Get stats
    const [listingStats] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.sellerId, userId));
    
    const [bidStats] = await db
      .select({ count: count() })
      .from(bids)
      .where(eq(bids.bidderId, userId));
    
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
      wallet: wallet ? {
        balanceCents: wallet.balanceCents,
        holdCents: wallet.holdCents,
        currency: wallet.currency,
      } : null,
      stats: {
        listingsCount: listingStats.count,
        bidsCount: bidStats.count,
      },
    };
  });

  // Update profile
  app.patch('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const data = updateProfileSchema.parse(request.body);
    
    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return {
      success: true,
      user: {
        id: updated.id,
        displayName: updated.displayName,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
      },
    };
  });

  // Get public profile
  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    
    const [user] = await db
      .select({
        id: users.id,
        displayName: users.displayName,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));
    
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }
    
    // Get public stats
    const [listingStats] = await db
      .select({ count: count() })
      .from(listings)
      .where(eq(listings.sellerId, id));
    
    return {
      ...user,
      stats: {
        listingsCount: listingStats.count,
      },
    };
  });
}
