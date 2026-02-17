# Biddt UI/UX Design System v2
## "Winning the Treasure" Edition

---

## Design Philosophy

### Core Metaphor: The Treasure Hunt

Every interaction in Biddt should feel like:
1. **Discovery** — Finding something valuable
2. **Competition** — The thrill of bidding
3. **Victory** — Winning the treasure
4. **Safety** — Secure exchange

### Emotional Journey

```
BROWSE → BID → WIN → VERIFY → CELEBRATE
  ↓       ↓     ↓       ↓         ↓
Curiosity→Excitement→Triumph→Relief→Joy
```

---

## Color System

### Primary Palette: The Diamond

**Diamond Cyan** `#00D9FF`
- Use: Primary actions, highlights, winning states
- Psychology: Trust, clarity, digital-native

**Diamond Purple** `#7B61FF`
- Use: Secondary actions, premium features
- Psychology: Royalty, value, exclusivity

**Diamond Gradient**
```css
background: linear-gradient(135deg, #00D9FF 0%, #7B61FF 100%);
```

### Energy Palette: The Spark

**Spark Orange** `#FA5400`
- Use: CTAs, bidding, urgency, notifications
- Psychology: Energy, action, excitement
- Nike-inspired intensity

**Spark Gold** `#FFD700`
- Use: Winning moments, achievements, treasures
- Psychology: Victory, value, celebration

### Foundation Palette

**Midnight Navy** `#0A0E1A`
- Use: Dark mode backgrounds
- Psychology: Premium, focused, nighttime browsing

**Surface Navy** `#141B2D`
- Use: Cards, elevated surfaces (dark)

**Pure White** `#FFFFFF`
- Use: Light mode backgrounds, text on dark

**Surface White** `#F8F9FA`
- Use: Cards, elevated surfaces (light)

### Semantic Colors

```
Success:  #00C853 → #00E676 (gradient)
Warning:  #FFD600 → #FFAB00 (gradient)
Error:    #FF1744 → #FF4569 (gradient)
Info:     #2979FF → #448AFF (gradient)
```

---

## Typography

### Font Family
- **Primary:** Inter (Google Fonts)
- **Display:** Inter Bold
- **Numeric:** Inter (tabular nums for prices)

### Type Scale

| Style | Size | Weight | Line | Usage |
|-------|------|--------|------|-------|
| Hero | 40px | 800 | 1.1 | Splash screens, big wins |
| H1 | 32px | 700 | 1.2 | Screen titles |
| H2 | 24px | 700 | 1.3 | Section headers |
| H3 | 20px | 600 | 1.4 | Card titles |
| Price | 28px | 700 | 1.1 | Bid amounts (tabular) |
| Body | 16px | 400 | 1.5 | Primary text |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 500 | 1.4 | Labels, timestamps |
| Button | 16px | 600 | 1 | CTAs |
| Tag | 11px | 600 | 1 | Status badges |

### Special Typography

**Price Display:**
```css
font-variant-numeric: tabular-nums;
letter-spacing: -0.02em;
```

**Winning Text:**
- Gradient fill (Diamond gradient)
- Slight scale animation on appear

---

## Spacing System

Based on 8px grid:

```
4px   - xs (micro adjustments)
8px   - sm (tight spacing)
16px  - md (standard padding)
24px  - lg (section padding)
32px  - xl (screen padding)
48px  - 2xl (major sections)
64px  - 3xl (hero spacing)
```

---

## Components

### Buttons

**Primary Button (Place Bid)**
```
Background: Spark Orange (#FA5400)
Text: White, 16px, 600 weight
Padding: 16px 32px
Border Radius: 30px (pill)
Shadow: 0 4px 16px rgba(250, 84, 0, 0.4)

Active: Scale 0.96
Hover: Brightness 1.1
```

**Secondary Button (Watch)**
```
Background: Transparent
Border: 2px solid Diamond Cyan
Text: Diamond Cyan
Padding: 14px 28px
Border Radius: 30px

Active: Background cyan/10
```

**Treasure Button (Win/Buy)**
```
Background: Diamond Gradient
Text: White, 16px, 700 weight
Padding: 16px 32px
Border Radius: 30px
Shadow: 0 4px 20px rgba(0, 217, 255, 0.3)

Animation: Subtle shimmer on idle
```

### Cards

**Listing Card (Treasure Card)**
```
Background: Surface color
Border Radius: 20px
Shadow: 0 4px 12px rgba(0,0,0,0.08)
Overflow: Hidden

Image: 16:9 aspect, top
Content: 16px padding

Hover: Scale 1.02, shadow increase
```

**Bid Card**
```
Background: Gradient from Surface to transparent
Border Left: 4px solid Spark Orange
Border Radius: 16px
Padding: 16px

Active Bid: Pulsing orange border
Winning Bid: Diamond gradient border
```

**Treasure Chest Card (Winning)**
```
Background: Diamond gradient (subtle)
Border Radius: 24px
Padding: 24px
Animation: Gentle float

Contains:
- Trophy icon
- "You Won!" text
- Item preview
- Next steps CTA
```

### Inputs

**Search (Treasure Hunt)**
```
Background: Surface color
Border Radius: 16px
Height: 56px
Padding: 0 20px
Icon: Search (20px, left)

Focus: Diamond cyan border glow
```

**Bid Input**
```
Background: Midnight Navy
Border: 2px solid transparent
Border Radius: 20px
Height: 80px
Text: Price style, centered

Focus: Spark orange border
Active: Diamond gradient border (when valid)
```

### Badges

**Status Badges:**
```
Live Auction:    Spark Orange bg, white text
Ending Soon:     Spark Gold bg, black text
Won:             Diamond gradient bg, white text
Sold:            Success green bg, white text
Reserved:        Info blue bg, white text
```

**Treasure Badges:**
```
Rare Find:       Purple bg, gold border
Trending:        Orange bg, flame icon
Verified:        Cyan bg, checkmark
```

### Progress Indicators

**Auction Timer:**
```
Circular progress ring
Colors: Green → Yellow → Orange → Red
Center: Time remaining
Size: 48px

Animation: Smooth countdown
Urgent (< 1min): Pulse red
```

**Bid Progress:**
```
Horizontal bar
Fill: Diamond gradient
Height: 8px
Border Radius: 4px

Shows: Current bid vs reserve
```

---

## Animations

### Micro-interactions

**Button Press:**
```
Duration: 100ms
Easing: ease-out
Transform: scale(0.96)
```

**Card Hover:**
```
Duration: 200ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
Transform: translateY(-4px)
Shadow: Increase depth
```

**Treasure Reveal:**
```
Duration: 600ms
Sequence:
  1. Diamond scales from 0 to 1 (bounce easing)
  2. Spark rays emanate
  3. Content fades in
  4. Confetti burst (subtle)
```

### Page Transitions

**Push Navigation:**
```
Duration: 300ms
New screen: Slide from right + fade in
Old screen: Slide left + fade out
Background: Slight parallax
```

**Modal (Treasure Detail):**
```
Duration: 400ms
Background: Fade to black/60
Card: Slide from bottom + scale
Easing: Spring (slight bounce)
```

**Winning Reveal:**
```
Duration: 800ms
Background: Diamond gradient fade
Card: Scale from center
Elements: Stagger in (100ms delay each)
Haptic: Success pattern
```

### Special Animations

**Pull to Refresh (Treasure Hunt):**
```
Icon: Diamond rotating
Progress: Map path drawing
Release: Diamond "drops" into place
Success: Spark burst
```

**New Bid (Real-time):**
```
Incoming: Slide from top + fade
Color: Spark orange flash
Number: Count up animation
Haptic: Light tap
```

**Outbid Alert:**
```
Entrance: Slide from top + bounce
Border: Pulsing orange
Icon: Warning triangle
Duration: Auto-dismiss 5s
```

**QR Scan Success:**
```
Scan line: Vertical sweep
Success: Diamond checkmark draws
Haptic: Double tap
Transition: To rating screen
```

---

## Screen Patterns

### Home Feed (Treasure Discovery)

**Layout:**
```
┌─────────────────────────┐
│  🔍 Search...     🔔 👤 │
├─────────────────────────┤
│  [Categories scroll]    │
├─────────────────────────┤
│  ⚡ LIVE AUCTIONS       │
│  ┌─────┐ ┌─────┐       │
│  │Item │ │Item │ ...   │
│  └─────┘ └─────┘       │
├─────────────────────────┤
│  💎 TRENDING            │
│  [Grid 2-col]           │
│  ┌────┐ ┌────┐         │
│  │    │ │    │         │
│  └────┘ └────┘         │
├─────────────────────────┤
│  🏠  🔍  ➕  💬  👤     │
└─────────────────────────┘
```

**Features:**
- Hero carousel for featured items
- "Ending Soon" horizontal scroll
- Category pills (scrollable)
- Masonry grid for discoveries

### Bidding Screen (The Competition)

**Layout:**
```
┌─────────────────────────┐
│  ←  Item Name       ♡   │
├─────────────────────────┤
│                         │
│    [Image carousel]     │
│                         │
├─────────────────────────┤
│  💎 RARE FIND    🔥 12  │
│  Vintage Camera         │
│  Starting bid was $50   │
├─────────────────────────┤
│  Current Bid            │
│  $127                   │
│  12 bids • 2m left      │
├─────────────────────────┤
│  [Bid History]          │
│  ▓▓▓▓▓▓▓▓░░░░░░░░      │
├─────────────────────────┤
│  Your Max Bid           │
│  ┌─────────────────┐    │
│  │    $_______    │    │
│  └─────────────────┘    │
│  Auto-bids up to $150   │
├─────────────────────────┤
│  [   PLACE BID   ]      │
│  or [WATCH] [SHARE]     │
└─────────────────────────┘
```

**Features:**
- Large, tappable bid increments
- Real-time bid counter animation
- Reserve price indicator
- Auto-bid explanation

### Winning Screen (The Victory)

**Layout:**
```
┌─────────────────────────┐
│                         │
│      ✦ ✦ ✦ ✦ ✦         │
│                         │
│      ┌─────────┐        │
│      │  💎     │        │
│      │  YOU    │        │
│      │  WON!   │        │
│      └─────────┘        │
│                         │
│   Vintage Camera        │
│   Final bid: $127       │
│                         │
│   [View Item]           │
│   [Pay Securely]        │
│                         │
│   ⏰ Pay within 24h     │
│                         │
└─────────────────────────┘
```

**Features:**
- Full-screen celebration
- Confetti animation (subtle)
- Clear next steps
- Urgency indicator

### QR Exchange (The Handoff)

**Layout (Buyer):**
```
┌─────────────────────────┐
│  Safe Exchange          │
├─────────────────────────┤
│  Meet at:               │
│  ☕ Java Blend Coffee    │
│  12:30 PM Today         │
├─────────────────────────┤
│                         │
│    ┌─────────────┐      │
│    │             │      │
│    │   [QR CODE] │      │
│    │             │      │
│    └─────────────┘      │
│                         │
│  Show this to seller    │
│  after inspecting item  │
│                         │
├─────────────────────────┤
│  [Can't make it?]       │
│  [Report issue]         │
└─────────────────────────┘
```

---

## Iconography

### Icon Set: "Treasure Map"

**Style:** Outlined, 2px stroke, rounded caps

**Core Icons:**
```
Home:          🏠 (house with flag)
Search:        🔍 (magnifying glass)
Sell:          ➕ (plus in diamond)
Inbox:         💬 (chat with dot)
Profile:       👤 (person outline)

Bid:           ⚡ (lightning bolt)
Win:           🏆 (trophy)
Watch:         👁️ (eye)
Share:         ↗️ (arrow up-right)
Like:          ♡ → ♥ (fill on tap)

Safe Zone:     📍 (pin with shield)
QR Code:       ▦ (grid pattern)
Verified:      ✓ (check in circle)
Warning:       ⚠️ (triangle)
Diamond:       💎 (gem)
```

### Custom Icons

**Treasure Chest:**
```
Closed:  Box with lock
Open:    Box with sparkles
Empty:   Dotted outline
```

**Bid Paddle:**
```
Simple paddle icon
Number badge for count
```

---

## Dark Mode Specifics

### Background Hierarchy
```
Base:        #0A0E1A (Midnight Navy)
Surface:     #141B2D (+5% lightness)
Elevated:    #1E2945 (+10% lightness)
Highlight:   #2A3655 (+15% lightness)
```

### Text Hierarchy
```
Primary:     #FFFFFF (100% opacity)
Secondary:   #B0B8C8 (70% opacity)
Tertiary:    #6B7280 (50% opacity)
Disabled:    #4B5563 (30% opacity)
```

### Accent Adaptations
```
Spark Orange: Keep (high contrast)
Diamond Cyan: Brighten to #33E0FF
Success Green: Adjust to #4ADE80
```

---

## Accessibility

### Contrast Ratios
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Motion
- Respect `prefers-reduced-motion`
- Essential animations: fade only
- Non-essential: disable

### Touch Targets
- Minimum: 44x44pt
- Preferred: 48x48pt
- Spacing between: 8px minimum

### Dynamic Type
- Support system font scaling
- Test at 200% scale
- Layout should adapt gracefully

---

## Design Deliverables

### Week 1
- [ ] Color palette (Figma variables)
- [ ] Typography system (Figma styles)
- [ ] Component library (buttons, inputs, cards)
- [ ] Icon set (24px, 1.5px stroke)

### Week 2
- [ ] Splash screen animation
- [ ] Home feed screens (light + dark)
- [ ] Bidding flow screens
- [ ] Winning celebration screen

### Week 3
- [ ] All 34 screens adapted
- [ ] Interaction prototypes
- [ ] Animation specs (Lottie)
- [ ] Design handoff documentation

---

*Design System Owner: Carl 🎯*  
*Version: 2.0 — Winning the Treasure*
