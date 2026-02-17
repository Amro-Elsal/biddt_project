import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../index.js';
import { notifications } from '../db/schema.js';
import { eq, desc, isNull } from 'drizzle-orm';

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  // Get my notifications
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    
    const notifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    
    const unreadCount = notifs.filter(n => !n.readAt).length;
    
    return {
      notifications: notifs,
      unreadCount,
    };
  });

  // Mark as read
  app.patch('/:id/read', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    const { id } = request.params as { id: string };
    
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, id));
    
    return { success: true };
  });

  // Mark all as read
  app.patch('/read-all', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request.user as { userId: string }).userId;
    
    await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.userId, userId));
    
    return { success: true };
  });
}
