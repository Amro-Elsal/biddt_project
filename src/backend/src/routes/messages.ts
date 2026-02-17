import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../index.js';
import { messages, transactions, users } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function messageRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Get messages for a transaction
  app.get('/transaction/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    // Verify user is part of transaction
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    if (!transaction) {
      return reply.status(404).send({ error: 'Transaction not found' });
    }
    
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' });
    }
    
    const msgs = await db
      .select({
        id: messages.id,
        content: messages.content,
        messageType: messages.messageType,
        senderId: messages.senderId,
        readAt: messages.readAt,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.transactionId, id))
      .orderBy(desc(messages.createdAt));
    
    // Mark messages as read
    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(and(
        eq(messages.transactionId, id),
        eq(messages.senderId, transaction.buyerId === userId ? transaction.sellerId : transaction.buyerId)
      ));
    
    return { messages: msgs.reverse() };
  });

  // Send message
  app.post('/transaction/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    const { content } = sendMessageSchema.parse(request.body);
    
    // Verify user is part of transaction
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    
    if (!transaction) {
      return reply.status(404).send({ error: 'Transaction not found' });
    }
    
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' });
    }
    
    // Only allow messages after payment
    if (transaction.status === 'pending_payment') {
      return reply.status(400).send({ error: 'Cannot message before payment' });
    }
    
    const [message] = await db
      .insert(messages)
      .values({
        transactionId: id,
        senderId: userId,
        content,
        messageType: 'text',
      })
      .returning();
    
    return {
      success: true,
      message,
    };
  });
}
