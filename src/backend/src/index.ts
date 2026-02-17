import 'dotenv/config';
import { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { schema } from './db/schema.js';

// Routes
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { listingRoutes } from './routes/listings.js';
import { bidRoutes } from './routes/bids.js';
import { transactionRoutes } from './routes/transactions.js';
import { messageRoutes } from './routes/messages.js';
import { notificationRoutes } from './routes/notifications.js';

// Services
import { BiddingService } from './services/bidding.js';
import { PaymentService } from './services/payments.js';
import { NotificationService } from './services/notifications.js';

const { Pool } = pg;

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Create Fastify instance
const app: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    } : undefined,
  },
});

// Register plugins
await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
});

await app.register(websocket);

// Swagger documentation
await app.register(swagger, {
  swagger: {
    info: {
      title: 'Biddt API',
      description: 'Safe Local Bidding Marketplace API',
      version: '1.0.0',
    },
    host: process.env.API_HOST || 'localhost:3001',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
});

await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

// Initialize services
const biddingService = new BiddingService(db);
const paymentService = new PaymentService(db);
const notificationService = new NotificationService(db);

// Decorate fastify with services
app.decorate('bidding', biddingService);
app.decorate('payments', paymentService);
app.decorate('notifications', notificationService);

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
await app.register(authRoutes, { prefix: '/auth' });
await app.register(userRoutes, { prefix: '/users' });
await app.register(listingRoutes, { prefix: '/listings' });
await app.register(bidRoutes, { prefix: '/bids' });
await app.register(transactionRoutes, { prefix: '/transactions' });
await app.register(messageRoutes, { prefix: '/messages' });
await app.register(notificationRoutes, { prefix: '/notifications' });

// WebSocket for real-time bidding
app.register(async function (fastify) {
  fastify.get('/ws/bidding/:listingId', { websocket: true }, (connection, req) => {
    const { listingId } = req.params as { listingId: string };
    
    // Join room for this listing
    connection.socket.on('message', (message: string) => {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'subscribe') {
        // Add to room
        connection.socket.listingId = listingId;
      }
      
      if (data.type === 'bid') {
        // Handle bid via HTTP API, broadcast via WS
      }
    });
    
    // Send initial state
    connection.socket.send(JSON.stringify({
      type: 'connected',
      listingId,
    }));
  });
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    error: error.message,
    code: error.code || 'INTERNAL_ERROR',
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    app.log.info(`Biddt API server running on ${host}:${port}`);
    app.log.info(`Documentation available at http://${host}:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  app.log.info('SIGTERM received, closing server...');
  await app.close();
  await pool.end();
  process.exit(0);
});
