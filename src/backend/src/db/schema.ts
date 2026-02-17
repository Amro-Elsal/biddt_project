import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'deleted']);
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'ended', 'sold', 'cancelled']);
export const listingTypeEnum = pgEnum('listing_type', ['auction', 'fixed', 'both']);
export const bidStatusEnum = pgEnum('bid_status', ['active', 'outbid', 'won', 'cancelled']);
export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending_payment',
  'payment_failed',
  'in_escrow',
  'awaiting_meetup',
  'verified',
  'released',
  'refunded',
  'disputed'
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'outbid',
  'won',
  'lost',
  'message',
  'payment_received',
  'payment_released',
  'verification_reminder',
  'system'
]);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNumber: varchar('phone_number', { length: 20 }).unique().notNull(),
  email: varchar('email', { length: 255 }),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  firebaseUid: varchar('firebase_uid', { length: 128 }).unique(),
  status: userStatusEnum('status').default('active').notNull(),
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// User Wallets (Stripe Connect)
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }),
  balanceCents: integer('balance_cents').default(0).notNull(),
  holdCents: integer('hold_cents').default(0).notNull(),
  currency: varchar('currency', { length: 3 }).default('CAD').notNull(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Listings
export const listings = pgTable('listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  condition: varchar('condition', { length: 20 }),
  images: jsonb('images').$type<string[]>().default([]),
  startingPriceCents: integer('starting_price_cents').notNull(),
  reservePriceCents: integer('reserve_price_cents'),
  buyNowPriceCents: integer('buy_now_price_cents'),
  currentBidCents: integer('current_bid_cents').default(0),
  bidCount: integer('bid_count').default(0),
  listingType: listingTypeEnum('listing_type').default('auction').notNull(),
  status: listingStatusEnum('status').default('draft').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  locationLat: decimal('location_lat', { precision: 10, scale: 8 }),
  locationLng: decimal('location_lng', { precision: 11, scale: 8 }),
  locationName: varchar('location_name', { length: 255 }),
  viewCount: integer('view_count').default(0),
  watchCount: integer('watch_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Bids
export const bids = pgTable('bids', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').references(() => listings.id).notNull(),
  bidderId: uuid('bidder_id').references(() => users.id).notNull(),
  amountCents: integer('amount_cents').notNull(),
  maxAmountCents: integer('max_amount_cents'), // For proxy bidding
  isAutoBid: boolean('is_auto_bid').default(false),
  status: bidStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Transactions (Escrow)
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  listingId: uuid('listing_id').references(() => listings.id).notNull(),
  buyerId: uuid('buyer_id').references(() => users.id).notNull(),
  sellerId: uuid('seller_id').references(() => users.id).notNull(),
  winningBidId: uuid('winning_bid_id').references(() => bids.id),
  amountCents: integer('amount_cents').notNull(),
  platformFeeCents: integer('platform_fee_cents').notNull(),
  escrowFeeCents: integer('escrow_fee_cents').notNull(),
  totalChargedCents: integer('total_charged_cents').notNull(),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeTransferId: varchar('stripe_transfer_id', { length: 255 }),
  status: transactionStatusEnum('status').default('pending_payment').notNull(),
  qrCode: varchar('qr_code', { length: 255 }).unique(),
  qrExpiresAt: timestamp('qr_expires_at', { withTimezone: true }),
  safeZoneId: uuid('safe_zone_id'),
  meetupScheduledAt: timestamp('meetup_scheduled_at', { withTimezone: true }),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  releasedAt: timestamp('released_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
  disputeReason: text('dispute_reason'),
  disputeResolvedAt: timestamp('dispute_resolved_at', { withTimezone: true }),
  disputeResolution: text('dispute_resolution'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 20 }).default('text').notNull(),
  attachmentUrl: text('attachment_url'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Safe Zones
export const safeZones = pgTable('safe_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  partnerName: varchar('partner_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  lat: decimal('lat', { precision: 10, scale: 8 }).notNull(),
  lng: decimal('lng', { precision: 11, scale: 8 }).notNull(),
  hours: text('hours'),
  phone: varchar('phone', { length: 20 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body'),
  data: jsonb('data'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Watchlist
export const watchlist = pgTable('watchlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  listingId: uuid('listing_id').references(() => listings.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  listings: many(listings),
  bids: many(bids),
  wallet: one(wallets),
  notifications: many(notifications),
  watchlist: many(watchlist),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
  bids: many(bids),
  transactions: many(transactions),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  listing: one(listings, {
    fields: [bids.listingId],
    references: [listings.id],
  }),
  bidder: one(users, {
    fields: [bids.bidderId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  listing: one(listings, {
    fields: [transactions.listingId],
    references: [listings.id],
  }),
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: 'buyerTransactions',
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
    relationName: 'sellerTransactions',
  }),
  winningBid: one(bids, {
    fields: [transactions.winningBidId],
    references: [bids.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  transaction: one(transactions, {
    fields: [messages.transactionId],
    references: [transactions.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));
