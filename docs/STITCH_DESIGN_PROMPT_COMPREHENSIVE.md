# 🎨 COMPREHENSIVE STITCH DESIGN PROMPT
## Biddt - Safe Local Bidding Marketplace

---

## 📋 TABLE OF CONTENTS

1. Executive Summary
2. Brand Identity & Positioning
3. Design Philosophy & Inspiration
4. Color System
5. Typography
6. Logo Design
7. User Personas
8. Core User Flows
9. Screen-by-Screen Specifications
10. Animation & Interaction Guidelines
11. Accessibility Requirements

---

## 1. EXECUTIVE SUMMARY

**App Name:** Biddt  
**Tagline:** "Win Your Treasure"  
**Category:** Mobile Marketplace / Bidding Platform  
**Platforms:** iOS & Android  
**Target Audience:** 18-35, deal hunters, safety-conscious buyers/sellers  

**Core Value Proposition:**  
A safe, exciting local marketplace where finding deals feels like discovering treasure, and winning bids feels like victory.

**Key Differentiators:**
- QR-verified safe exchange zones
- Real-time bidding excitement
- Treasure hunt gamification
- Local community focus

---

## 2. BRAND IDENTITY & POSITIONING

### Brand Personality
- **Confident** but not arrogant
- **Playful** but professional
- **Trustworthy** but exciting
- **Premium** but accessible

### Brand Voice
- Energetic without being hype-y
- Action-oriented verbs
- Treasure/bidding metaphors
- Short, punchy sentences

### Emotional Journey
```
Discovery → Competition → Victory → Safety
   💎          ⚡           🏆        🔒
```

---

## 3. DESIGN PHILOSOPHY & INSPIRATION

### Primary Inspiration: Nike App
- High-energy interactions
- Bold typography
- Premium visual feel
- Dynamic motion
- Dark mode first

### Secondary Inspirations:

**StockX:**
- Authentication credibility
- Bidding excitement
- Status indicators
- Clean data presentation

**Airbnb:**
- Trust signals
- Beautiful photography
- Clean layouts
- Safety emphasis

**Depop:**
- Youthful energy
- Social commerce
- Quick interactions
- Community feel

### Dribbble Trends 2024-2025:
- Glassmorphism (subtle)
- Bold gradients
- 3D elements
- Micro-interactions
- Dark mode dominance
- Neumorphism (soft UI)

### Mobbin Patterns:
- Bottom sheet modals
- Skeleton loading states
- Pull-to-refresh
- Swipe actions
- Floating action buttons

---

## 4. COLOR SYSTEM

### Primary Brand Colors

| Color Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| **Diamond Cyan** | `#00D9FF` | 0, 217, 255 | Primary actions, highlights, CTAs |
| **Diamond Purple** | `#7B61FF` | 123, 97, 255 | Secondary actions, gradients, premium |
| **Spark Orange** | `#FA5400` | 250, 84, 0 | Urgency, notifications, warnings |
| **Spark Gold** | `#FFD700` | 255, 215, 0 | Victory, winning, treasure, success |

### Background Colors

| Color Name | Hex | Usage |
|------------|-----|-------|
| **Deep Navy** | `#0A0E27` | Primary background |
| **Midnight** | `#121636` | Cards, elevated surfaces |
| **Twilight** | `#1A1F45` | Input fields, secondary surfaces |

### Text Colors

| Color Name | Hex | Usage |
|------------|-----|-------|
| **Pure White** | `#FFFFFF` | Primary text |
| **Soft White** | `#E8E8E8` | Secondary text |
| **Muted** | `#8B92B4` | Tertiary text, placeholders |
| **Disabled** | `#5A6078` | Disabled states |

### Semantic Colors

| State | Color | Usage |
|-------|-------|-------|
| Success | `#00C853` | Winning bid, completed transactions |
| Error | `#FF1744` | Outbid, errors, cancellations |
| Warning | `#FFAB00` | Time running out, pending actions |
| Info | `#00D9FF` | Tips, help, neutral notifications |

### Gradient Patterns

**Primary Gradient:**
```css
background: linear-gradient(135deg, #00D9FF 0%, #7B61FF 100%);
```

**Treasure Glow:**
```css
background: radial-gradient(circle, #FFD700 0%, transparent 70%);
```

**Victory Burst:**
```css
background: linear-gradient(45deg, #FFD700, #FF6B35, #FFD700);
```

---

## 5. TYPOGRAPHY

### Font Family: Inter (Primary)
- Modern, clean, highly legible
- Excellent for mobile interfaces
- Multiple weights for hierarchy

### Font Hierarchy

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **Hero** | 48px | 800 | 1.1 | Winning amounts, hero text |
| **H1** | 32px | 700 | 1.2 | Screen titles, major headlines |
| **H2** | 24px | 600 | 1.3 | Section headers, card titles |
| **H3** | 20px | 600 | 1.4 | Subsection headers |
| **H4** | 18px | 500 | 1.4 | List headers, form labels |
| **Body Large** | 16px | 400 | 1.5 | Primary body text |
| **Body** | 14px | 400 | 1.5 | Secondary text, descriptions |
| **Caption** | 12px | 400 | 1.4 | Metadata, timestamps |
| **Overline** | 10px | 600 | 1.2 | Labels, tags (uppercase) |

### Special Typography

**Price Display:**
- Font: Inter
- Size: 36-48px
- Weight: 800
- Color: #FFFFFF or #FFD700 (for winning)
- Letter-spacing: -0.02em

**Countdown Timer:**
- Font: Inter (Tabular nums)
- Size: 24px
- Weight: 700
- Color: #FA5400 (urgent) or #FFFFFF

---

## 6. LOGO DESIGN

### Concept: "The Spark Diamond"

**Visual Elements:**
- Geometric diamond shape
- Dynamic spark lines emanating from center
- Modern, angular, energetic

**Logo Variations:**

1. **Primary Logo** (Full)
   - Diamond icon + "Biddt" wordmark
   - Use: App launch screen, marketing

2. **Icon Only** (App Icon)
   - Diamond with spark
   - Use: iOS/Android home screen
   - Size: 1024x1024px, rounded corners

3. **Wordmark Only**
   - "Biddt" in custom typography
   - Use: Headers, documents

4. **Monogram**
   - "B" stylized
   - Use: Favicon, small spaces

**Logo Colors:**
- Primary: Diamond Cyan (#00D9FF) on Deep Navy
- Alternate: White on gradient
- Gold version: For victory moments

**Logo Animation:**
- Diamond rotates 360° on app launch
- Spark lines pulse on interaction
- Scale up with spring physics on winning

---

## 7. USER PERSONAS

### Persona 1: "Deal Hunter Dave"
- **Age:** 25
- **Occupation:** Student/Young Professional
- **Tech Savviness:** High
- **Motivations:** Finding gems, winning deals, negotiating
- **Pain Points:** Unsafe meetups, scams, time wasters
- **Favorite Features:** Live bidding, deal alerts, seller ratings
- **Quote:** "I love the thrill of winning a bid at the last second!"

### Persona 2: "Side Hustle Sarah"
- **Age:** 28
- **Occupation:** Marketing Coordinator + Vintage Seller
- **Tech Savviness:** Medium
- **Motivations:** Extra income, building a brand, community
- **Pain Points:** Lowball offers, no-shows, payment disputes
- **Favorite Features:** Seller analytics, safe exchange, instant payout
- **Quote:** "Biddt helps me turn my hobby into real income, safely."

### Persona 3: "Safety First Sam"
- **Age:** 32
- **Occupation:** Parent, Office Manager
- **Tech Savviness:** Medium
- **Motivations:** Trust, convenience, peace of mind
- **Pain Points:** Fear of scams, unsafe meetings, fake listings
- **Favorite Features:** QR verification, safe zones, buyer protection
- **Quote:** "I only buy on Biddt because I know I'll be safe."

---

## 8. CORE USER FLOWS

### Flow 1: Discovery → First Bid
```
Home Feed → Search/Filter → Product Detail → Place Bid → Bid Confirmation
```

### Flow 2: Winning → Exchange
```
Win Notification → Payment → Schedule Pickup → QR Verification → Complete
```

### Flow 3: Selling → Earning
```
Create Listing → Add Photos → Set Price → Publish → Receive Bids → Accept → Exchange
```

### Flow 4: Onboarding
```
Splash Screen → Value Props → Phone Auth → Profile Setup → Home Feed
```

---

## 9. SCREEN-BY-SCREEN SPECIFICATIONS

### SCREEN 1: Splash Screen
**Purpose:** Brand introduction, app launch

**Elements:**
- Full-screen Deep Navy background
- Animated logo (diamond rotating, spark pulsing)
- Tagline: "Win Your Treasure"
- Subtle particle effects (sparkles)
- Loading indicator (diamond progress)

**Animation:**
- Logo scales from 0.8 to 1.0
- Spark lines draw in (500ms)
- Fade to onboarding after 2.5s

**Colors:**
- Background: #0A0E27
- Logo: #00D9FF
- Spark: #FFD700

---

### SCREEN 2: Onboarding - Value Props
**Purpose:** Explain app value (3 slides)

**Slide 1: "Discover Treasure"**
- Illustration: Treasure map with diamond marker
- Headline: "Discover Hidden Gems"
- Body: "Find unique items from local sellers. Every listing is a potential treasure."
- CTA: "Next"

**Slide 2: "Bid & Win"**
- Illustration: Gavel with spark effects
- Headline: "Bid & Win"
- Body: "Real-time bidding excitement. Win auctions and claim your treasure."
- CTA: "Next"

**Slide 3: "Exchange Safely"**
- Illustration: Shield with QR code
- Headline: "Exchange with Confidence"
- Body: "QR-verified safe zones. Your safety is our priority."
- CTA: "Get Started"

**Design:**
- Full-bleed illustrations
- Bottom pagination dots
- Skip button (top right)
- Swipeable carousel

---

### SCREEN 3: Home Feed
**Purpose:** Browse listings, discover items

**Layout:**
```
[Search Bar]
[Categories: All | Electronics | Fashion | Home | ...]
[Featured Banner (carousel)]
[Live Auctions (horizontal scroll)]
[Trending Now (grid)]
[New Arrivals (grid)]
[Bottom Nav]
```

**Search Bar:**
- Rounded rectangle, Twilight background
- Search icon left
- Microphone icon right (voice search)
- Placeholder: "Search for treasure..."

**Category Pills:**
- Horizontal scroll
- Active: Cyan background, white text
- Inactive: Transparent, muted text
- Rounded full

**Listing Card:**
- Aspect ratio: 1:1.2 (portrait)
- Image: Full bleed, rounded corners (12px)
- Live badge: Pulsing cyan dot + "LIVE"
- Price: Large, bold, white
- Time remaining: Small, orange (if <1hr)
- Seller avatar + rating (bottom left)
- Heart icon (bottom right)

**Bottom Navigation:**
- 5 items: Home, Search, Sell (FAB), Messages, Profile
- Active: Cyan icon + label
- Inactive: Muted icon only
- Sell button: Floating, gold gradient, diamond icon

**Pull to Refresh:**
- Diamond rotates while pulling
- Release triggers refresh
- Confetti burst on new items

---

### SCREEN 4: Product Detail
**Purpose:** View item details, place bid

**Layout:**
```
[Image Gallery (swipeable)]
[Live Status Bar]
[Title + Category]
[Seller Info Card]
[Current Bid Section]
[Bid History]
[Description]
[Item Details]
[Similar Items]
[Bottom Action Bar]
```

**Image Gallery:**
- Full-width, 16:9 ratio
- Dots indicator
- Pinch to zoom
- Double-tap to like

**Live Status Bar:**
- Background: Gradient (Cyan to Purple)
- Left: Pulsing "● LIVE" indicator
- Center: "X people watching"
- Right: Time remaining (countdown)

**Current Bid Section:**
- Large price display (48px, bold)
- "Current Bid" label above
- "You're winning!" / "You've been outbid!" status
- Your max bid (if set)

**Bid Input:**
- Large input field
- Quick-add buttons: +$5, +$10, +$25
- Auto-bid toggle
- Min bid increment shown

**Bid Button:**
- Full width
- Gold gradient background
- "Place Bid" or "Increase Bid"
- Pulsing glow animation when outbid

**Bid History:**
- Collapsible section
- List of recent bids
- Bidder avatars (anonymized)
- Timestamps

---

### SCREEN 5: Winning Reveal
**Purpose:** Celebrate winning bid

**Layout:**
- Full-screen overlay
- Dark semi-transparent backdrop
- Centered celebration card

**Elements:**
1. **Confetti Animation** (full screen, 3s)
2. **Trophy/Diamond Icon** (large, bouncing)
3. **"YOU WON!"** (Hero text, 48px)
4. **Product Image** (with gold glow border)
5. **Winning Price** (Large, gold color)
6. **"You saved $X!"** (compared to buy now)
7. **Action Buttons:**
   - "Pay Now" (Primary, gold)
   - "Schedule Pickup" (Secondary)
   - "Share Victory" (Ghost button)

**Animation Sequence:**
1. Confetti burst (0-500ms)
2. Trophy scales up with bounce (300-800ms)
3. Text fades in (600-1000ms)
4. Product image slides up (800-1200ms)
5. Buttons slide up (1000-1400ms)

**Sound:** Victory chime (optional)

---

### SCREEN 6: Safe Exchange
**Purpose:** QR verification for safe meetup

**Layout:**
```
[Header: "Safe Exchange"]
[Progress Steps: 1-2-3]
[QR Code Card]
[Meeting Details]
[Safety Tips]
[Action Buttons]
```

**Progress Steps:**
1. Meet at Location (check when arrived)
2. Scan QR Code (check when scanned)
3. Confirm Exchange (check when complete)

**QR Code Card:**
- Large QR code (centered)
- Timer below: "Valid for 15:00"
- Refresh button
- "Show this to seller/buyer"

**Meeting Details:**
- Location name + address
- Map preview (small)
- Time scheduled
- Contact button

**Safety Tips:**
- Collapsible card
- "Meet in public places"
- "Verify item before paying"
- "Use Biddt QR verification"
- Emergency contact

**Action Buttons:**
- "I've Arrived" (when at location)
- "Complete Exchange" (disabled until QR scanned)
- "Report Issue" (ghost, red text)

---

### SCREEN 7: Seller Dashboard
**Purpose:** Analytics, manage listings, track earnings

**Layout:**
```
[Header: "Seller Dashboard"]
[Earnings Summary Cards]
[Sales Chart]
[Quick Stats Row]
[Active Listings]
[Sold Items]
[Performance Insights]
```

**Earnings Cards:**
- Total Earnings (large, gold)
- This Month (cyan)
- Pending Payouts (purple)

**Sales Chart:**
- Line chart: Sales over time
- Toggle: Week/Month/Year
- Peak indicators

**Quick Stats:**
- Views → Bids → Sales (funnel)
- Conversion rate
- Average sale price

**Active Listings:**
- Horizontal scroll
- Listing cards with bid counts
- Edit/delete actions

**Seller Level Badge:**
- Bronze/Silver/Gold/Platinum
- Progress to next level
- Benefits listed

---

### SCREEN 8: Profile
**Purpose:** User identity, trust signals, activity

**Layout:**
```
[Cover Photo]
[Profile Picture + Badge]
[Name + Username]
[Trust Score (large)]
[Stats Row]
[Badges Collection]
[Reviews Section]
[Listings Grid]
[Settings Button]
```

**Trust Score:**
- Large number (0-100)
- Circular progress indicator
- Color: Green (80+), Yellow (50-79), Red (<50)
- "Excellent" / "Good" / "Fair" label

**Stats:**
- Transactions completed
- Response rate
- Member since
- Location

**Badges:**
- Grid of earned badges
- Hover/press to see description
- Examples: Power Seller, Quick Shipper, Verified, Top Rated

**Reviews:**
- Carousel of recent reviews
- Star rating
- Reviewer avatar + name
- Comment text
- "See all reviews" link

---

### SCREEN 9: Create Listing
**Purpose:** Sell an item

**Flow:**
```
Step 1: Add Photos
Step 2: Item Details
Step 3: Pricing & Auction
Step 4: Review & Publish
```

**Step 1: Add Photos**
- Photo grid (up to 10)
- Camera/gallery buttons
- Drag to reorder
- Cover photo indicator
- AI suggestion: "Add more angles"

**Step 2: Item Details**
- Title input
- Category selector
- Condition (New/Like New/Good/Fair)
- Description textarea
- Tags input
- Brand selector

**Step 3: Pricing**
- Starting bid input
- Reserve price (optional)
- Buy Now price (optional)
- Auction duration selector
- Shipping options

**Step 4: Review**
- Preview card
- Edit buttons for each section
- "Publish" button (gold)
- Terms checkbox

---

### SCREEN 10: Messages/Chat
**Purpose:** Communication between buyers/sellers

**Layout:**
```
[Header: Chat Partner Info]
[Messages List (bubble style)]
[Item Context Card]
[Quick Actions]
[Input Bar]
```

**Message Bubbles:**
- Sent: Cyan gradient, right-aligned
- Received: Twilight background, left-aligned
- Timestamps below
- Read receipts

**Item Context Card:**
- Sticky at top when scrolling
- Mini product image
- Price + status
- "View Item" button

**Quick Actions:**
- "Make Offer"
- "Schedule Meetup"
- "Mark as Sold"

**Input Bar:**
- Text input
- Photo attachment
- Voice message
- Emoji picker

---

## 10. ANIMATION & INTERACTION GUIDELINES

### Timing Standards

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction | 150-200ms | ease-out |
| Screen transition | 300-400ms | ease-in-out |
| Modal/Sheet | 250-350ms | spring |
| Loading/Skeleton | 800-1200ms | linear |
| Celebration | 800-1500ms | bounce |

### Easing Functions

```css
/* Standard */
ease-out: cubic-bezier(0, 0, 0.2, 1)

/* Spring (bouncy) */
spring: cubic-bezier(0.34, 1.56, 0.64, 1)

/* Decelerate */
decelerate: cubic-bezier(0, 0, 0.2, 1)

/* Accelerate */
accelerate: cubic-bezier(0.4, 0, 1, 1)
```

### Key Animations

**Button Press:**
- Scale: 1.0 → 0.95 → 1.0
- Duration: 100ms
- Easing: ease-out

**Card Tap:**
- Scale: 1.0 → 0.98 → 1.0
- Background: Subtle highlight
- Duration: 150ms

**Page Transition:**
- Slide from right (push)
- Fade in content
- Duration: 300ms

**Pull to Refresh:**
- Diamond rotation
- Resistance on pull
- Snap back or trigger refresh

**Live Indicator:**
- Pulsing dot (scale 1.0 → 1.3 → 1.0)
- Duration: 1.5s, infinite
- Color: Cyan

**Winning Celebration:**
- Confetti burst
- Trophy bounce
- Gold glow pulse
- Duration: 3s total

**Bid Update:**
- Number count-up animation
- Color flash (white → gold)
- Haptic feedback

---

## 11. ACCESSIBILITY REQUIREMENTS

### Color Contrast
- All text must meet WCAG AA (4.5:1)
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 against background

### Touch Targets
- Minimum: 44x44pt
- Preferred: 48x48pt
- Spacing between: 8pt minimum

### Screen Reader Support
- All images: Descriptive alt text
- Icons: aria-label or hidden
- Buttons: Clear action labels
- Forms: Associated labels

### Motion Preferences
- Respect `prefers-reduced-motion`
- Provide static alternatives
- Essential animations only when reduced

### Dynamic Type
- Support iOS Dynamic Type
- Scale gracefully up to 200%
- Maintain layout integrity

---

## 📱 COMPONENT LIBRARY

### Buttons

**Primary Button:**
- Background: Gold gradient
- Text: Deep Navy, 16px, Semi-bold
- Padding: 16px 24px
- Border radius: 12px
- Shadow: 0 4px 12px rgba(255, 215, 0, 0.3)

**Secondary Button:**
- Background: Transparent
- Border: 2px solid Cyan
- Text: Cyan, 16px, Semi-bold
- Padding: 14px 24px
- Border radius: 12px

**Ghost Button:**
- Background: Transparent
- Text: White, 16px, Medium
- Padding: 12px 16px
- Press: Twilight background

### Cards

**Listing Card:**
- Background: Midnight
- Border radius: 16px
- Shadow: 0 4px 20px rgba(0, 0, 0, 0.3)
- Padding: 0 (image bleeds)
- Content padding: 12px

**Info Card:**
- Background: Twilight
- Border radius: 12px
- Padding: 16px
- Border: 1px solid rgba(255,255,255,0.1)

### Inputs

**Text Input:**
- Background: Twilight
- Border: 1px solid transparent
- Border radius: 12px
- Padding: 16px
- Focus: Cyan border
- Placeholder: Muted color

**Search Input:**
- Background: Twilight
- Border radius: 24px (pill)
- Left icon: Search
- Right icon: Microphone
- Padding: 12px 16px

---

## 🎯 SUCCESS METRICS

### Design Quality
- Consistent visual language
- Smooth 60fps animations
- Intuitive user flows
- Delightful micro-interactions

### Business Metrics
- Time to first bid: <2 minutes
- Listing completion rate: >80%
- Exchange completion rate: >95%
- User retention (D7): >40%

---

*This prompt provides comprehensive guidance for designing the Biddt mobile app. Reference Dribbble and Mobbin for specific implementation patterns and trending styles.*

**Reference Links:**
- Dribbble: https://dribbble.com/search/mobile-app-2025
- Mobbin: https://mobbin.com/browse/ios/apps

---

*Document Version: 1.0*  
*Created: February 23, 2026*  
*For: Google Stitch UI Generation*
