# Biddt - Complete Design System & App Structure

## Overview
**Biddt** is a premium mobile marketplace app for iOS and Android with a focus on local bidding, safe exchanges, and treasure-hunting experience. The design philosophy follows Nike-app aesthetics: high energy, clean typography, premium feel, with a "treasure hunting" narrative.

---

## 🎨 Design Philosophy

### Core Principles
- **Premium Feel**: Every interaction feels valuable and intentional
- **Treasure Hunting Narrative**: Language and visuals evoke discovery and excitement
- **Trust & Safety**: Security features are prominent but not intrusive
- **Nike-Inspired Energy**: Bold typography, high contrast, dynamic motion cues
- **Local Focus**: Community-driven, neighborhood-based marketplace

### Design References
- **Primary**: Nike App (energy, typography, premium feel)
- **Secondary**: StockX (sneaker/collectible marketplace)
- **Tertiary**: Airbnb (trust, local community)

---

## 🌈 Color System

### Primary Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--primary` | `#FFD700` (Gold) | `#FFD700` (Gold) | CTAs, accents, highlights |
| `--primary-dark` | `#D4AF37` | `#D4AF37` | Hover states, pressed |
| `--primary-light` | `#FFF8DC` | `#3D3415` | Subtle backgrounds, badges |

### Secondary Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--secondary` | `#1A1A2E` (Navy) | `#0F0F1A` | Headers, cards, surfaces |
| `--accent-cyan` | `#00D4FF` | `#00D4FF` | Live indicators, links |
| `--accent-green` | `#22C55E` | `#22C55E` | Success, verified, online |
| `--accent-red` | `#EF4444` | `#EF4444` | Error, urgent, alerts |
| `--accent-orange` | `#F97316` | `#F97316` | Timer, countdown, warnings |

### Neutral Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--bg-primary` | `#FFFFFF` | `#0A0A0F` | Main background |
| `--bg-secondary` | `#F8F9FA` | `#14141F` | Card backgrounds |
| `--bg-tertiary` | `#E9ECEF` | `#1E1E2D` | Elevated surfaces |
| `--text-primary` | `#1A1A2E` | `#FFFFFF` | Headlines, primary text |
| `--text-secondary` | `#6C757D` | `#9CA3AF` | Subtext, descriptions |
| `--text-tertiary` | `#ADB5BD` | `#6B7280` | Hints, placeholders |
| `--border` | `#DEE2E6` | `#2D2D3D` | Dividers, borders |

### Semantic Colors

| State | Light Mode | Dark Mode |
|-------|------------|-----------|
| Success | `#22C55E` | `#22C55E` |
| Warning | `#F59E0B` | `#F59E0B` |
| Error | `#EF4444` | `#EF4444` |
| Info | `#3B82F6` | `#3B82F6` |
| Live | `#00D4FF` | `#00D4FF` |
| Verified | `#22C55E` | `#22C55E` |

---

## 🔤 Typography System

### Font Family
- **Primary**: Inter (or SF Pro on iOS, Roboto on Android)
- **Display**: Inter Bold/Black for headlines
- **Monospace**: SF Mono (for prices, countdowns)

### Type Scale

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| H1 | 32px | 800 | 1.1 | -0.02em | Screen titles, big moments |
| H2 | 24px | 700 | 1.2 | -0.01em | Section headers |
| H3 | 20px | 600 | 1.3 | 0 | Card titles, item names |
| H4 | 18px | 600 | 1.4 | 0 | Subsection headers |
| Body Large | 16px | 400 | 1.5 | 0 | Primary body text |
| Body | 14px | 400 | 1.5 | 0 | Secondary text |
| Caption | 12px | 500 | 1.4 | 0.01em | Labels, metadata |
| Overline | 11px | 600 | 1.2 | 0.05em | Categories, tags |
| Price Large | 28px | 700 | 1.1 | -0.01em | Current bid, total |
| Price | 20px | 600 | 1.2 | 0 | Item prices |

### Typography Patterns
- **Prices**: Always bold, often with currency symbol smaller
- **Countdowns**: Monospace font, orange color, with clock icon
- **Live Badges**: Cyan background, white text, pulsing dot
- **Trust Scores**: Circular progress indicator with score inside

---

## 📐 Layout & Spacing

### Grid System
- **Container**: 100% width with 16px horizontal padding
- **Card Grid**: 2-column grid with 12px gap
- **Horizontal Scroll**: Full-bleed with 16px padding

### Spacing Scale
```
4px  - xs (tight spacing, icon gaps)
8px  - sm (related elements)
12px - md (card padding)
16px - lg (section padding)
20px - xl (major sections)
24px - 2xl (screen padding)
32px - 3xl (large gaps)
48px - 4xl (hero sections)
```

### Border Radius
```
4px  - sm (buttons, small elements)
8px  - md (inputs, cards)
12px - lg (cards, modals)
16px - xl (large cards, bottom sheets)
24px - 2xl (featured cards)
999px - full (pills, avatars)
```

### Shadows

**Light Mode:**
- Card: `0 2px 8px rgba(0,0,0,0.08)`
- Elevated: `0 4px 16px rgba(0,0,0,0.12)`
- Modal: `0 8px 32px rgba(0,0,0,0.16)`

**Dark Mode:**
- Card: `0 2px 8px rgba(0,0,0,0.3)`
- Elevated: `0 4px 16px rgba(0,0,0,0.4)`
- Modal: `0 8px 32px rgba(0,0,0,0.5)`

---

## 🧩 Component Library

### Buttons

**Primary Button (Gold)**
- Background: `--primary` (Gold)
- Text: `--secondary` (Navy/Black)
- Height: 56px
- Border Radius: 12px
- Font: 16px, weight 600
- Icon: Left-aligned, 20px

**Secondary Button**
- Background: transparent
- Border: 1px solid `--border`
- Text: `--text-primary`
- Height: 48px
- Border Radius: 12px

**Floating Action Button (FAB)**
- Shape: Diamond (45° rotated square)
- Size: 64px
- Background: `--primary`
- Icon: Plus, white
- Shadow: Elevated
- Position: Center of bottom nav

**Quick Action Chips**
- Height: 36px
- Border Radius: 999px (pill)
- Background: `--bg-tertiary`
- Active: `--primary-light` background

### Cards

**Auction Card (Large)**
- Aspect Ratio: 1:1.2
- Border Radius: 16px
- Image: Full cover with gradient overlay at bottom
- Content: Bottom-aligned, white text on gradient
- Badge: Top-left "LIVE" with pulsing dot
- Timer: Bottom with clock icon

**Product Card (Small)**
- Aspect Ratio: 1:1
- Border Radius: 12px
- Image: Square, object-fit cover
- Title: Below image, 2 lines max
- Price: Bold, below title
- Heart: Top-right corner

**Dashboard Card**
- Background: `--bg-secondary`
- Border Radius: 16px
- Padding: 16px
- Header: Title + action

### Inputs

**Search Bar**
- Height: 48px
- Background: `--bg-secondary`
- Border Radius: 999px (pill)
- Icon: Search left, microphone right
- Placeholder: "Search for treasure..."

**Text Input**
- Height: 56px
- Background: `--bg-secondary`
- Border Radius: 12px
- Border: 1px solid `--border`
- Focus: Border color `--primary`

**Bid Input**
- Large number display
- Quick select chips: +$5, +$10, +$25
- Custom amount field

### Navigation

**Bottom Navigation Bar**
- Height: 80px (includes safe area)
- Background: `--bg-primary` with blur
- Items: 5 tabs (Home, Search, Sell, Messages, Profile)
- Sell: Center diamond FAB
- Active: Icon + label in `--primary`
- Inactive: `--text-tertiary`

**Top Navigation**
- Height: 56px
- Left: Back arrow or menu
- Center: Screen title
- Right: Actions (share, favorite, more)

### Progress Indicators

**Step Indicator**
- Dots or numbers in circles
- Active: Filled `--primary`
- Completed: Checkmark
- Future: Outline `--border`

**Circular Progress (Trust Score)**
- Size: 80px
- Stroke: 8px
- Color: Gradient from `--primary` to `--accent-green`
- Center: Score number

**Linear Progress**
- Height: 4px
- Background: `--bg-tertiary`
- Fill: `--primary`

---

## 📱 Screen Structure (34 Screens)

### 1. Onboarding Flow (5 screens)

#### Splash Screen
- Full-screen dark background
- Animated diamond logo (glowing, rotating)
- "Biddt" wordmark below
- Tagline: "WIN YOUR TREASURE"
- Loading progress bar at bottom

#### Onboarding Slides (3 screens)
1. **Discover Hidden Gems**
   - 3D illustration of treasure cards
   - Title: "Discover Hidden Gems"
   - Subtitle: "Find unique items from local sellers"
   - Pagination dots
   - "Next" gold button

2. **Bid with Confidence**
   - Shield/security illustration
   - Title: "Bid with Confidence"
   - Subtitle: "10% deposit system ensures serious buyers"

3. **Safe Exchange**
   - QR code/location illustration
   - Title: "Safe Exchange"
   - Subtitle: "Meet at verified safe zones"

#### Authentication Screen
- Logo at top
- Social auth buttons: Google, Apple
- Divider: "OR"
- Primary CTA: "Continue with Phone Number"
- Trust badge: "SECURED BIDDING"
- Footer: "DISCOVERY • COMPETITION • VICTORY"

### 2. Authentication Flow (4 screens)

#### Phone Verification
- Title: "Verify Your Number"
- Phone number display
- 4-digit code input (large, separated)
- Resend countdown timer
- "Verify & Continue" button

#### Identity Verification
- Title: "Verify Your Identity"
- Camera frame overlay for ID scanning
- Corner brackets (gold)
- "Scanning active" indicator
- "Upload Manually" option
- Security note: "256-bit encrypted"

#### Verification Pending
- Large hourglass illustration with diamonds
- Title: "Verification in Progress"
- Subtitle: "Usually takes less than 2 hours"
- Notification toggle
- "Back to Home" link

### 3. Main App - Home (3 screens)

#### Home Feed (Dark Mode)
- **Header**: Logo + Buying Power pill + Notification bell
- **Buying Power Pill**: Dark card with amount + "TOP UP" action
- **Search Bar**: "Search for treasure..." with microphone
- **Category Pills**: All, Electronics, Fashion, Collectibles (horizontal scroll)
- **Live Auctions Section**:
  - Header with red dot + "See All"
  - Horizontal scroll of large auction cards
  - Each card: Image, LIVE badge, item name, price, countdown, bid count
- **Trending Now Section**:
  - Grid of product cards
  - Heart favorite button on each
- **Bottom Nav**: Home (active), Search, Sell (FAB), Inbox, Profile

#### Home Feed (Light Mode)
- Same structure with light color scheme
- White background
- Yellow/gold accents for CTAs
- "Bid Now" buttons on cards

#### Search/Discovery
- Full search bar at top
- Recent searches
- Trending searches
- Category grid
- Filter options

### 4. Product Detail (4 screens)

#### Product Detail (Dark Mode)
- **Image Gallery**: Full-width, swipeable, 360° view option
- **Info Bar**: LIVE badge, watchers count, time remaining
- **Category**: "VINTAGE WATCHES" (cyan label)
- **Title**: Large, bold item name
- **Location**: Pin icon + location
- **Condition**: "Condition: Good"
- **Seller Card**: Avatar, name, rating, sales count, "Profile" button
- **Bid Section**:
  - "Current Highest Bid" label
  - Large price display
  - "Highest Bidder" badge (if user is winning)
  - 10% deposit rule explanation card
  - Quick bid buttons: +$5, +$10, +$25
  - Custom bid input
  - "Deposit & Place Bid" gold CTA
- **Tab Navigation**: Description | Bid History | Authenticity
- **Description**: Full text with bullet points

#### Product Detail (Light Mode)
- Same structure
- White background
- Yellow CTA button
- Cleaner, more minimal aesthetic

#### Bid Deposit Authorization
- Title: "Confirm 10% Deposit"
- Item summary card with image
- Bid breakdown:
  - Current Bid Amount
  - Deposit Rate (10%)
  - Required Deposit Today
- Buying Power balance display with progress bar
- Escrow security note
- "Authorize & Place Bid" button

#### Winning Reveal (Dark Mode)
- Celebration confetti animation
- Trophy icon
- "YOU WON!" headline
- Subtitle: "This treasure is now exclusively yours"
- Item card with image
- Winning bid amount
- "Pay Now" primary button
- "Schedule Pickup" secondary button
- "Share Victory" link

### 5. Wallet & Payments (4 screens)

#### Buying Power Wallet (Dark Mode)
- **Header**: Large total amount "$1,250.00"
- **Subheader**: "TOTAL BUYING POWER"
- **Balance Cards**:
  - Locked: Active bids hold amount
  - Available: Ready to bid amount
- **Quick Top Up**: $50, $100, $500, Custom chips
- "Top Up Now" button
- **Recent Activity**:
  - Deposit via Apple Pay (+$500)
  - Bid Hold - Vintage Watch (-$120)
  - Refund - Antique Lamp (+$50)
- Status badges: COMPLETED, ACTIVE, RELEASED

#### Add Funds (Light Mode)
- Title: "ADD FUNDS"
- Current Buying Power display
- 10% Deposit Rule explanation card
- Quick select amounts: $100, $500, $1,000, $2,500, $5,000, Custom
- Payment method selection (Apple Pay default)
- "Add Funds" button
- Security note

#### Add Funds (Dark Mode)
- Same structure
- Dark theme
- Gold/yellow accents
- Secure payment badge

#### Add Bidding Funds
- Current Buying Power: $0.00
- "How Buying Power Works" info card
- Amount input with $ prefix
- Quick add buttons: +$100, +$500, +$1,000
- Payment method selection
- "Add Funds" CTA

### 6. Selling & Listings (4 screens)

#### Create Listing - Step 1 (Dark Mode)
- Title: "Create Listing"
- Progress: "Step 1 of 4" with progress bar
- Section: "Add Photos"
- AI Suggestion card: "Add a close-up of brand labels"
- Photo grid (3x3):
  - First photo marked "COVER"
  - Add button with camera icon
  - Empty placeholders
- "Photo Best Practices" tips card
- "Next: Item Details" button

#### Create Listing (Light Mode)
- Title: "New Listing"
- Progress: "Step 1 of 3"
- Photo grid (2 rows)
- AI Auto-fill suggestion
- Form fields:
  - "What are you selling?"
  - Starting Bid input
  - Condition selector (pills: New, Like New, Good, Fair)
  - Category dropdown
  - Description textarea
- "Continue" button

#### Seller Dashboard (Dark Mode)
- Title: "Dashboard"
- **Earnings Card**:
  - Total Earnings: $4,285.50
  - +12.5% growth badge
  - This Month / Pending Payout split
- **Buying Power Card**:
  - Active Deposits / Available Limit
  - Explanation text
- **Sales Performance**:
  - Week/Month toggle
  - Line chart
- **Stats Row**: Views, Active Bids, Sales
- **Active Listings**: Horizontal scroll
- **Seller Insights**: Tips and optimization

#### Seller Dashboard (Light Mode)
- Welcome message with avatar
- Total Earnings card (gold gradient)
- Pending Payouts with Withdraw button
- Sales Overview with chart
- Buying Power section
- Recent Activity list

### 7. Profile & Settings (3 screens)

#### Profile Screen (Dark Mode)
- **Header**: Avatar with verification badge, Trust Score circle (98)
- **User Info**:
  - Name with nickname: "Alex 'The Hunter' M."
  - Username: @alexhunter23
  - Bio: "Collector of vintage electronics..."
- **Stats Row**: Transactions, Response Rate, Joined Year
- **Badges Earned**: Power Seller, Verified ID, Quick Reply (horizontal scroll)
- **Recent Reviews**: Star rating, quote, reviewer name
- **Active Listings**: Grid of user's items
- "View All Listings" button

#### Profile Screen (Light Mode)
- Avatar with settings gear
- Name and location
- Trust Score circle (98 - "Excellent Standing")
- Stats: Sold, Active Bids, Reply Time
- Menu items: Payment Methods, Identity Verification, Support
- Recent Reviews section

#### Public Profile View
- Similar to own profile
- "View Profile" button on product detail
- Seller rating prominently displayed
- Contact button

### 8. Messaging (2 screens)

#### Chat List
- List of conversations
- Item thumbnail + name
- Last message preview
- Timestamp
- Unread indicator

#### Chat Detail (Dark Mode)
- **Header**: User avatar, name, online status, rating
- **Item Bar**: Product image, name, current bid, "Buying Power" badge
- **Messages**: 
  - Incoming: Gray bubbles, left-aligned
  - Outgoing: Blue/cyan bubbles, right-aligned
  - Images in messages
- **Quick Actions**: "Make Offer", "Meetup", "Safe Zone"
- **Input**: Text field with camera, microphone, send button

#### Chat Detail (Light Mode)
- Same structure
- Incoming: White bubbles
- Outgoing: Yellow/gold bubbles
- Biddt Tip: "Meet in a public place for safety"

### 9. Safe Exchange (2 screens)

#### Safe Exchange (Dark Mode)
- **Header**: "Safe Exchange" with help icon
- **Progress Steps**: Meet → Scan → Complete
- **QR Card**:
  - "Show QR to Seller"
  - Large QR code with logo in center
  - Timer: "14:32 VALID"
- **Location Card**:
  - Map preview
  - "Safe Exchange Zone #42"
  - Address
  - "Get Directions" link
- **Seller Card**: Meeting info, contact button
- **Security Note**: "Premium Protection Active"
- "I've Arrived" button
- "Report Issue or Cancel" link

#### Safe Exchange (Light Mode)
- Progress: Accepted → On The Way → Met → Exchanged
- "Meetup in Progress"
- Arrival time
- QR code card
- Map with location
- Safety First notice
- "I've Arrived" button
- SOS button in header

### 10. Miscellaneous (3 screens)

#### 360° Product Capture Tool
- Camera interface
- Guide overlay for rotating item
- Capture button
- Preview thumbnails

#### 360° Preview & Finalize
- 360° viewer with drag to rotate
- Thumbnail strip
- Finalize button

#### Wireframes (Reference)
- Home Feed Structure
- Product Detail Layout
- Profile Component Map
- Wallet Architecture

---

## 🔄 User Flows

### Onboarding Flow
```
Splash → Onboarding 1 → Onboarding 2 → Onboarding 3 → Auth Options → Phone → Verify → Identity → Pending → Home
```

### Bidding Flow
```
Home → Product Detail → Place Bid → Deposit Auth → Success → Watch Auction → Win Notification → Pay/Schedule
```

### Selling Flow
```
Home → Sell FAB → Create Listing (4 steps) → Publish → Dashboard → Manage Listings
```

### Exchange Flow
```
Win → Pay → Schedule → Safe Exchange → QR Scan → Confirm → Review
```

### Wallet Flow
```
Home → Buying Power → Add Funds → Payment → Confirmation → Updated Balance
```

---

## 🎯 Key Features

### 1. Buying Power System
- 10% refundable deposit required to bid
- Funds held in escrow
- Automatic refunds when outbid
- Top-up via Apple Pay, Google Pay, Cards

### 2. Live Auctions
- Real-time bidding
- Countdown timers
- Watchers count
- Bid history
- Auto-bid option

### 3. Safe Exchange
- Verified safe zones
- QR code verification
- In-app meeting coordination
- Safety monitoring
- Emergency SOS

### 4. Trust & Verification
- ID verification
- Trust Score (0-100)
- Seller badges
- Review system
- Response time tracking

### 5. AI Features
- Photo recognition for auto-fill
- Listing optimization tips
- Price suggestions
- Best time to post

---

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  trustScore: number;
  badges: Badge[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  buyingPower: {
    total: number;
    locked: number;
    available: number;
  };
  stats: {
    transactions: number;
    responseRate: number;
    responseTime: string;
    joinedAt: Date;
  };
}
```

### Listing
```typescript
interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  images: string[];
  startingBid: number;
  currentBid: number;
  bidCount: number;
  reservePrice?: number;
  seller: User;
  status: 'draft' | 'active' | 'ended' | 'sold';
  endTime: Date;
  location: {
    city: string;
    state: string;
  };
  watchers: number;
}
```

### Bid
```typescript
interface Bid {
  id: string;
  listingId: string;
  bidderId: string;
  amount: number;
  depositAmount: number;
  status: 'active' | 'outbid' | 'won' | 'lost';
  createdAt: Date;
}
```

### Exchange
```typescript
interface Exchange {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  safeZone: SafeZone;
  qrCode: string;
  scheduledTime: Date;
  completedAt?: Date;
}
```

---

## 🛠 Technical Specifications

### Platform
- **iOS**: SwiftUI, minimum iOS 15
- **Android**: Jetpack Compose, minimum API 26
- **Backend**: Node.js/Express or Firebase
- **Database**: PostgreSQL + Redis for real-time
- **Storage**: AWS S3 or Cloudinary
- **Payments**: Stripe Connect

### Real-time Features
- WebSocket for live bidding
- Push notifications for outbid, win, messages
- Location services for safe zones
- Camera access for 360° capture

### Security
- 256-bit encryption
- ID verification via third-party (Jumio/Onfido)
- Escrow payment processing
- QR code generation with expiration

---

## 📝 Copy Guidelines

### Tone of Voice
- **Exciting**: "Win your treasure", "Discover hidden gems"
- **Trustworthy**: "Safe exchange", "Verified", "Protected"
- **Premium**: "Buying Power", "Premium Protection"
- **Community**: "Local sellers", "Meet Alex M."

### Key Terms
- Buying Power (not "wallet" or "balance")
- Treasure (not "item" or "product")
- Bid (not "offer")
- Safe Exchange (not "meetup")
- Trust Score (not "rating")

### Microcopy
- Search placeholder: "Search for treasure..."
- Empty states: "No treasures found nearby"
- Success: "You've won this treasure!"
- Loading: "Securing your treasure..."

---

## 🎬 Animations & Interactions

### Micro-interactions
- Heart favorite: Scale bounce + fill animation
- Pull to refresh: Diamond spinner
- Bid placed: Confetti burst
- Tab switch: Smooth fade
- Card press: Scale 0.98

### Page Transitions
- Push: Slide from right
- Modal: Slide from bottom
- Full-screen: Fade + scale

### Loading States
- Skeleton screens for lists
- Pulsing shimmer for images
- Progress bars for uploads

### Celebration
- Win: Trophy pop + confetti
- Sale: Coin animation
- Verification: Checkmark draw

---

## 📱 Responsive Considerations

### iPhone SE (Small)
- Reduce card sizes
- Compact bottom nav
- Smaller hero images

### iPhone Pro Max (Large)
- Larger touch targets
- More content visible
- Enhanced spacing

### Android Variations
- Follow Material You guidelines
- Adapt to system colors
- Support different aspect ratios

---

## 🔍 Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1)
- Interactive elements meet AAA (7:1)
- Don't rely on color alone

### Touch Targets
- Minimum 44x44pt
- Adequate spacing between

### Screen Reader
- Descriptive labels
- Logical focus order
- Alt text for images

### Dynamic Type
- Support system font sizes
- Layout adapts to larger text

---

## 🚀 Future Enhancements

### Phase 2
- Auction streaming/live video
- AR try-on for items
- Shipping integration
- International expansion

### Phase 3
- AI-powered price prediction
- Social features (following sellers)
- Subscription tiers for sellers
- Biddt Pro for power users

---

## 📎 Assets Checklist

### Icons (SVG)
- [ ] Logo (diamond)
- [ ] Home, Search, Sell, Messages, Profile
- [ ] Heart, Share, More
- [ ] Camera, Microphone
- [ ] Shield, Checkmark, Alert
- [ ] Clock, Location, Phone
- [ ] Bid, Wallet, Settings

### Illustrations
- [ ] Onboarding 1: Treasure discovery
- [ ] Onboarding 2: Security/shield
- [ ] Onboarding 3: Safe exchange
- [ ] Empty states
- [ ] Success celebrations
- [ ] Verification hourglass

### Badges
- [ ] Power Seller
- [ ] Verified ID
- [ ] Quick Reply
- [ ] Top Rated
- [ ] New Seller

---

## 📋 Implementation Priority

### MVP (Must Have)
1. Onboarding & Auth
2. Home Feed
3. Product Detail
4. Bidding Flow
5. Basic Profile
6. Buying Power (simple)

### v1.1 (Should Have)
1. Messaging
2. Create Listing
3. Seller Dashboard
4. Safe Exchange
5. Notifications

### v1.2 (Nice to Have)
1. 360° Photos
2. AI Features
3. Advanced Analytics
4. Social Features

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Design Source: Stitch MCP (34 screens)*
