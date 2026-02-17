import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../index.js';
import { users, wallets } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../config/firebase.js';

// Validation schemas
const sendCodeSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

const verifyCodeSchema = z.object({
  phoneNumber: z.string(),
  code: z.string().length(6),
  displayName: z.string().min(2).max(50).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  // Send OTP
  app.post('/phone/send-code', async (request: FastifyRequest, reply: FastifyReply) => {
    const { phoneNumber } = sendCodeSchema.parse(request.body);
    
    try {
      // In production, use Twilio or Firebase to send SMS
      // For MVP, we'll use Firebase Phone Auth
      
      // Generate verification session
      const sessionInfo = await adminAuth.createSessionCookie(phoneNumber, {
        expiresIn: 5 * 60 * 1000, // 5 minutes
      });
      
      // TODO: Actually send SMS via Twilio
      // For testing, return the code in development
      const isDev = process.env.NODE_ENV === 'development';
      
      return {
        success: true,
        message: 'Verification code sent',
        sessionInfo: isDev ? sessionInfo : undefined,
        // In dev only:
        ...(isDev && { code: '123456' }),
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to send code' });
    }
  });

  // Verify OTP and create/login user
  app.post('/phone/verify', async (request: FastifyRequest, reply: FastifyReply) => {
    const { phoneNumber, code, displayName } = verifyCodeSchema.parse(request.body);
    
    try {
      // Verify code with Firebase
      // In production, this would verify the actual SMS code
      
      // Check if user exists
      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.phoneNumber, phoneNumber));
      
      const isNewUser = !user;
      
      if (!user) {
        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            phoneNumber,
            displayName: displayName || null,
            phoneVerified: true,
          })
          .returning();
        
        user = newUser;
        
        // Create wallet
        await db.insert(wallets).values({
          userId: user.id,
          status: 'active',
        });
      } else {
        // Update verification status
        await db
          .update(users)
          .set({ phoneVerified: true, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }
      
      // Generate JWT tokens
      const accessToken = await app.jwt.sign({
        userId: user.id,
        phoneNumber: user.phoneNumber,
      }, {
        expiresIn: '15m',
      });
      
      const refreshToken = await app.jwt.sign({
        userId: user.id,
        type: 'refresh',
      }, {
        expiresIn: '7d',
      });
      
      return {
        success: true,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          isNewUser,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 900, // 15 minutes
        },
      };
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ error: 'Invalid code' });
    }
  });

  // Refresh access token
  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    
    try {
      const decoded = await app.jwt.verify(refreshToken) as { userId: string; type: string };
      
      if (decoded.type !== 'refresh') {
        return reply.status(401).send({ error: 'Invalid token type' });
      }
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId));
      
      if (!user || user.status !== 'active') {
        return reply.status(401).send({ error: 'User not found or inactive' });
      }
      
      const accessToken = await app.jwt.sign({
        userId: user.id,
        phoneNumber: user.phoneNumber,
      }, {
        expiresIn: '15m',
      });
      
      return {
        accessToken,
        expiresIn: 900,
      };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  // Logout
  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // In a more complex setup, we'd blacklist the token
    // For now, client just deletes the token
    return { success: true };
  });
}
