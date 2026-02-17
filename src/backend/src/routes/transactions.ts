import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../index.js';
import { transactions, listings, bids, users, wallets, notifications } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';

// Validation schemas
const createTransactionSchema = z.object({
  listingId: z.string().uuid(),
});

const payTransactionSchema = z.object({
  paymentMethodId: z.string(),
});

export async function transactionRoutes(app: FastifyInstance) {
  // Middleware to verify JWT
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Create transaction (winner pays)
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { listingId } = createTransactionSchema.parse(request.body);
    
    // Get listing and winning bid
    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, listingId));
    
    if (!listing) {
      return reply.status(404).send({ error: 'Listing not found' });
    }
    
    if (listing.status !== 'ended') {
      return reply.status(400).send({ error: 'Auction has not ended' });
    }
    
    // Get winning bid
    const [winningBid] = await db
      .select()
      .from(bids)
      .where(eq(bids.listingId, listingId))
      .orderBy(desc(bids.amountCents))
      .limit(1);
    
    if (!winningBid || winningBid.bidderId !== userId) {
      return reply.status(403).send({ error: 'You are not the winning bidder' });
    }
    
    // Check if transaction already exists
    const [existing] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.listingId, listingId));
    
    if (existing) {
      return reply.status(400).send({ 
        error: 'Transaction already exists',
        transactionId: existing.id,
      });
    }
    
    // Calculate fees
    const amountCents = winningBid.amountCents;
    const platformFeeCents = Math.round(amountCents * 0.06); // 6% commission
    const escrowFeeCents = 199; // $1.99 flat fee
    const totalChargedCents = amountCents + platformFeeCents + escrowFeeCents;
    
    // Create transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        listingId,
        buyerId: userId,
        sellerId: listing.sellerId,
        winningBidId: winningBid.id,
        amountCents,
        platformFeeCents,
        escrowFeeCents,
        totalChargedCents,
        status: 'pending_payment',
      })
      .returning();
    
    return {
      success: true,
      transaction: {
        id: transaction.id,
        amountCents: transaction.amountCents,
        feesCents: platformFeeCents + escrowFeeCents,
        totalCents: totalChargedCents,
        status: transaction.status,
        expiresAt: addHours(new Date(), 24), // 24h to pay
      },
    };
  });

  // Get my transactions (buyer or seller)
  app.get('/my-transactions', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    
    const myTransactions = await db
      .select({
        transaction: transactions,
        listing: {
          id: listings.id,
          title: listings.title,
          images: listings.images,
        },
        buyer: {
          id: users.id,
          displayName: users.displayName,
        },
      })
      .from(transactions)
      .leftJoin(listings, eq(transactions.listingId, listings.id))
      .leftJoin(users, eq(transactions.buyerId, users.id))
      .where(sql`${transactions.buyerId} = ${userId} OR ${transactions.sellerId} = ${userId}`)
      .orderBy(desc(transactions.createdAt));
    
    return {
      transactions: myTransactions.map(t => ({
        ...t.transaction,
        listing: t.listing,
        role: t.transaction.buyerId === userId ? 'buyer' : 'seller',
      })),
    };
  });

  // Get single transaction
  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    const [result] = await db
      .select({
        transaction: transactions,
        listing: listings,
        buyer: {
          id: users.id,
          displayName: users.displayName,
          phoneNumber: users.phoneNumber,
        },
      })
      .from(transactions)
      .leftJoin(listings, eq(transactions.listingId, listings.id))
      .leftJoin(users, eq(transactions.buyerId, users.id))
      .where(eq(transactions.id, id));
    
    if (!result) {
      return reply.status(404).send({ error: 'Transaction not found' });
    }
    
    // Only buyer or seller can view
    if (result.transaction.buyerId !== userId && result.transaction.sellerId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' });
    }
    
    return {
      ...result.transaction,
      listing: result.listing,
      buyer: result.buyer,
      role: result.transaction.buyerId === userId ? 'buyer' : 'seller',
    };
  });

  // Generate QR code (buyer)
  app.get('/:id/qr', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    if (!transaction) {
      return reply.status(404).send({ error: 'Transaction not found' });
    }
    
    if (transaction.buyerId !== userId) {
      return reply.status(403).send({ error: 'Only buyer can generate QR' });
    }
    
    if (transaction.status !== 'in_escrow') {
      return reply.status(400).send({ error: 'Payment not completed' });
    }
    
    // Generate or reuse QR code
    let qrCode = transaction.qrCode;
    if (!qrCode || (transaction.qrExpiresAt && transaction.qrExpiresAt < new Date())) {
      qrCode = uuidv4();
      const expiresAt = addHours(new Date(), 24);
      
      await db
        .update(transactions)
        .set({ qrCode, qrExpiresAt: expiresAt })
        .where(eq(transactions.id, id));
    }
    
    // Generate QR image
    const qrDataUrl = await QRCode.toDataURL(qrCode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0A0E1A',
        light: '#FFFFFF',
      },
    });
    
    return {
      qrCode,
      qrImage: qrDataUrl,
      expiresAt: transaction.qrExpiresAt,
    };
  });

  // Verify QR code (seller scans)
  app.post('/:id/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    const { qrCode } = request.body as { qrCode: string };
    
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    if (!transaction) {
      return reply.status(404).send({ error: 'Transaction not found' });
    }
    
    if (transaction.sellerId !== userId) {
      return reply.status(403).send({ error: 'Only seller can verify' });
    }
    
    if (transaction.status !== 'in_escrow') {
      return reply.status(400).send({ error: 'Invalid transaction status' });
    }
    
    if (transaction.qrCode !== qrCode) {
      return reply.status(400).send({ error: 'Invalid QR code' });
    }
    
    if (transaction.qrExpiresAt && transaction.qrExpiresAt < new Date()) {
      return reply.status(400).send({ error: 'QR code expired' });
    }
    
    // Update transaction
    await db
      .update(transactions)
      .set({
        status: 'verified',
        verifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, id));
    
    // Release funds to seller (in production, this would trigger Stripe transfer)
    // For now, mark as released
    await db
      .update(transactions)
      .set({
        status: 'released',
        releasedAt: new Date(),
      })
      .where(eq(transactions.id, id));
    
    // Update seller wallet
    await db
      .update(wallets)
      .set({
        balanceCents: sql`${wallets.balanceCents} + ${transaction.amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, transaction.sellerId));
    
    // Notify both parties
    await db.insert(notifications).values({
      userId: transaction.buyerId,
      type: 'payment_released',
      title: 'Transaction complete!',
      body: 'Your item has been verified. Enjoy your purchase!',
      data: { transactionId: id },
    });
    
    await db.insert(notifications).values({
      userId: transaction.sellerId,
      type: 'payment_released',
      title: 'Funds released!',
      body: `Payment of $${(transaction.amountCents / 100).toFixed(2)} has been added to your wallet.`,
      data: { transactionId: id },
    });
    
    return {
      success: true,
      message: 'Transaction verified and funds released',
    };
  });
}
