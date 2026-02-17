# Biddt Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   iOS App       │   Android App   │      Web Admin              │
│   (SwiftUI)     │   (Compose)     │      (React)                │
│                 │                 │                             │
│ • SwiftUI       │ • Jetpack       │ • React 18                  │
│ • Combine       │   Compose       │ • TypeScript                │
│ • CoreData      │ • Coroutines    │ • Tailwind                  │
│ • Alamofire     │ • Retrofit      │ • React Query               │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                       │
         └─────────────────┼───────────────────────┘
                           │ HTTPS/WebSocket
         ┌─────────────────┴─────────────────┐
         │         API GATEWAY (AWS)         │
         │    • Kong/AWS API Gateway         │
         │    • Rate limiting: 100 req/min   │
         │    • JWT validation               │
         │    • Request logging              │
         └─────────────────┬─────────────────┘
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
┌───┴───┐          ┌──────┴──────┐        ┌─────┴─────┐
│ Auth  │          │   Core API  │        │  Chat     │
│ Svc   │          │   (Node.js) │        │  Svc      │
│       │          │             │        │ (Socket.io)│
│•Firebase│         │ • Express   │        │           │
│ Auth  │          │ • REST API  │        │ • WS      │
│•Phone │          │ • GraphQL   │        │ • Redis   │
│  OTP  │          │   (future)  │        │   Pub/Sub │
└───────┘          └──────┬──────┘        └───────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────┴─────┐   ┌────┴────┐    ┌─────┴─────┐
    │PostgreSQL │   │  Redis  │    │   S3      │
    │           │   │         │    │           │
    │ • Users   │   │ • Cache │    │ • Images  │
    │ • Listings│   │ • Sessions│   │ • Videos  │
    │ • Bids    │   │ • Rate    │   │ • Backups │
    │ • Txns    │   │   limiting│   │           │
    │ • Messages│   │ • WS rooms│   │           │
    └───────────┘   └─────────┘    └───────────┘
                          │
                   ┌──────┴──────┐
                   │   Stripe    │
                   │   Connect   │
                   │             │
                   │ • Escrow    │
                   │ • Payouts   │
                   │ • Webhooks  │
                   └─────────────┘
```

---

## Technology Stack

### Mobile

**iOS:**
- Language: Swift 5.9+
- UI: SwiftUI (iOS 16+)
- Architecture: MVVM + Combine
- Networking: Alamofire
- Images: Kingfisher
- Local DB: CoreData
- Auth: Firebase Auth

**Android:**
- Language: Kotlin
- UI: Jetpack Compose (Material 3)
- Architecture: MVVM + Coroutines/Flow
- Networking: Retrofit + OkHttp
- Images: Coil
- Local DB: Room
- Auth: Firebase Auth

### Backend

**API Server:**
- Runtime: Node.js 20+ or Go 1.21+
- Framework: Express.js (Node) or Gin (Go)
- API Style: REST (OpenAPI 3.0)
- Documentation: Swagger/OpenAPI

**Database:**
- Primary: PostgreSQL 15+
- Cache: Redis 7+
- Search: PostgreSQL Full-text (MVP) → Elasticsearch (scale)

**Infrastructure:**
- Cloud: AWS (primary) or GCP
- Container: Docker
- Orchestration: ECS/Fargate or Kubernetes
- CI/CD: GitHub Actions
- Monitoring: Datadog or New Relic

### Third-Party Services

| Service | Purpose | Alternative |
|---------|---------|-------------|
| Firebase Auth | Phone OTP, user auth | Auth0 |
| Stripe Connect | Payments, escrow | PayPal |
| Twilio | SMS verification | MessageBird |
| SendGrid | Transactional email | Mailgun |
| AWS S3 | File storage | Cloudflare R2 |
| Cloudflare CDN | Image optimization | AWS CloudFront |

---

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    display_name VARCHAR(100),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Wallets (Stripe Connect)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stripe_account_id VARCHAR(255),
    balance_cents INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'CAD',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Listings
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    condition VARCHAR(20),
    images TEXT[],
    starting_price_cents INTEGER NOT NULL,
    reserve_price_cents INTEGER,
    buy_now_price_cents INTEGER,
    auction_type VARCHAR(20) DEFAULT 'auction', -- auction, fixed, both
    status VARCHAR(20) DEFAULT 'draft',
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name VARCHAR(255),
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bids
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id),
    bidder_id UUID REFERENCES users(id),
    amount_cents INTEGER NOT NULL,
    max_amount_cents INTEGER, -- For proxy bidding
    is_auto_bid BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions (Escrow)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES listings(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    winning_bid_id UUID REFERENCES bids(id),
    amount_cents INTEGER NOT NULL,
    fee_cents INTEGER NOT NULL,
    escrow_fee_cents INTEGER NOT NULL,
    total_charged_cents INTEGER NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending_payment', -- pending_payment, in_escrow, released, refunded, disputed
    qr_code VARCHAR(255) UNIQUE,
    qr_expires_at TIMESTAMP,
    verified_at TIMESTAMP,
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id),
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, system
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Safe Zones (Partner locations)
CREATE TABLE safe_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    hours TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- outbid, won, message, etc.
    title VARCHAR(255) NOT NULL,
    body TEXT,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Authentication
```
POST   /auth/phone/send-code
POST   /auth/phone/verify
POST   /auth/refresh
DELETE /auth/logout
```

### Users
```
GET    /users/me
PATCH  /users/me
GET    /users/:id/profile
POST   /users/me/wallet
GET    /users/me/wallet/balance
GET    /users/me/transactions
```

### Listings
```
GET    /listings                    # Browse with filters
POST   /listings                    # Create listing
GET    /listings/:id
PATCH  /listings/:id
DELETE /listings/:id
POST   /listings/:id/images
GET    /listings/:id/bids
POST   /listings/:id/watch
```

### Bidding
```
POST   /listings/:id/bids           # Place bid
GET    /bids/me                     # My bids
DELETE /bids/:id                    # Retract bid (if allowed)
```

### Transactions
```
POST   /transactions                # Create from winning bid
GET    /transactions/:id
POST   /transactions/:id/pay        # Fund escrow
GET    /transactions/:id/qr         # Get buyer QR code
POST   /transactions/:id/verify     # Seller scans QR
POST   /transactions/:id/dispute
GET    /transactions/:id/messages
POST   /transactions/:id/messages
```

### Notifications
```
GET    /notifications
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
```

---

## Real-Time Architecture

### WebSocket Events

**Client → Server:**
```javascript
// Join listing room
{ type: 'subscribe', listingId: 'uuid' }

// Place bid
{ type: 'bid', listingId: 'uuid', amount: 15000 }

// Join chat
{ type: 'join_chat', transactionId: 'uuid' }

// Send message
{ type: 'message', transactionId: 'uuid', content: 'Hello' }
```

**Server → Client:**
```javascript
// New bid
{ type: 'bid_placed', listingId: 'uuid', bid: {...} }

// Outbid notification
{ type: 'outbid', listingId: 'uuid', yourMaxBid: 10000, currentBid: 12000 }

// Auction ending soon
{ type: 'ending_soon', listingId: 'uuid', secondsRemaining: 60 }

// New message
{ type: 'new_message', transactionId: 'uuid', message: {...} }

// Transaction update
{ type: 'transaction_update', transactionId: 'uuid', status: 'in_escrow' }
```

---

## Security Architecture

### Authentication Flow
```
1. User enters phone number
2. Server sends OTP via Twilio
3. User enters OTP
4. Server verifies, issues JWT (access + refresh)
5. Access token: 15 min expiry
6. Refresh token: 7 days expiry
```

### Authorization
- JWT claims: user_id, roles
- Middleware checks on every request
- Role-based access: user, admin, support

### Data Protection
- PII encrypted at rest (AES-256)
- TLS 1.3 in transit
- Phone numbers hashed in logs
- PCI DSS compliance via Stripe

### Rate Limiting
| Endpoint | Limit |
|----------|-------|
| Auth | 5 req/min |
| API (authenticated) | 100 req/min |
| Bid placement | 10 req/min |
| Listing creation | 5 req/hour (new users) |

---

## Payment Flow

### Escrow Process
```
1. Auction ends → Winner determined
2. Buyer receives notification
3. Buyer funds escrow (Stripe PaymentIntent)
4. Funds held by Stripe Connect
5. Buyer and seller arrange meetup
6. Buyer shows QR code in app
7. Seller scans QR, verifies item
8. Escrow released to seller (minus fees)
9. Both parties rate each other
```

### Fee Structure
```
Sale Price: $100.00
Commission (6%): -$6.00
Escrow Fee: -$1.99
─────────────────────
Seller Receives: $92.01
```

---

## Deployment Architecture

### Environments
| Env | Purpose | Data |
|-----|---------|------|
| Local | Development | Seed data |
| Staging | Testing | Anonymized prod |
| Production | Live | Real data |

### CI/CD Pipeline
```
Push to main
    │
    ▼
GitHub Actions
    │
    ├──► Run tests
    │
    ├──► Build Docker images
    │
    ├──► Deploy to Staging
    │
    ├──► E2E tests
    │
    └──► Deploy to Production (manual approval)
```

### Monitoring
- **Metrics:** Datadog / Prometheus
- **Logs:** CloudWatch / Datadog
- **Errors:** Sentry
- **Uptime:** Pingdom
- **Performance:** Firebase Performance

---

## Scalability Plan

### Phase 1: MVP (1-10K users)
- Single API instance (ECS Fargate)
- PostgreSQL RDS (db.t3.medium)
- Redis ElastiCache (cache.t3.micro)
- CloudFront CDN

### Phase 2: Growth (10-100K users)
- API auto-scaling (2-10 instances)
- PostgreSQL read replica
- Redis cluster
- Dedicated job workers

### Phase 3: Scale (100K+ users)
- Multi-region deployment
- Database sharding by geography
- CDN edge caching
- Event-driven architecture (SQS/SNS)

---

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Branch naming: `feature/TICKET-123-description`

### Testing Strategy
| Type | Coverage | Tools |
|------|----------|-------|
| Unit | 70%+ | Jest |
| Integration | Key flows | Supertest |
| E2E | Critical paths | Detox (mobile), Playwright (web) |

### API Versioning
- URL-based: `/v1/users`
- Deprecation: 6 months notice
- Breaking changes → new version

---

*Architecture Owner: CTO / Carl 🎯*
