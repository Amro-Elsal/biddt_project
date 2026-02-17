# Biddt Design System

Based on Nike app inspiration and Stitch designs.

## Color Palette

### Primary Colors
- **Nike Black**: `#111111` - Primary backgrounds, text
- **Nike White**: `#FFFFFF` - Cards, text on dark
- **Action Orange**: `#FA5400` - CTAs, highlights, bidding actions

### Dark Theme (Deep Navy)
- **Background**: `#0A0E1A` - Main app background
- **Surface**: `#141B2D` - Cards, elevated surfaces
- **Surface Highlight**: `#1E2945` - Hover states
- **Border**: `#2A3655` - Subtle dividers

### Light Theme
- **Background**: `#F5F5F5` - Main app background
- **Surface**: `#FFFFFF` - Cards
- **Border**: `#E5E5E5` - Dividers
- **Text Primary**: `#111111`
- **Text Secondary**: `#666666`

### Semantic Colors
- **Success**: `#00C853` - Winning bid, completed actions
- **Warning**: `#FFD600` - Outbid alerts, pending
- **Error**: `#FF1744` - Errors, cancellations
- **Info**: `#2979FF` - Information, tips

## Typography

### Font Family
- **Primary**: `Inter` or `SF Pro Display` (iOS) / `Roboto` (Android)
- **Numeric/Prices**: `SF Mono` or `Roboto Mono` - For bid amounts

### Type Scale
| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 32px | 700 | 1.2 | Screen titles |
| H2 | 24px | 700 | 1.3 | Section headers |
| H3 | 20px | 600 | 1.4 | Card titles |
| Body | 16px | 400 | 1.5 | Primary text |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 500 | 1.4 | Labels, timestamps |
| Price | 28px | 700 | 1.1 | Bid amounts |
| Button | 16px | 600 | 1 | CTA buttons |

## Spacing System

Based on 4px grid:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Components

### Buttons

**Primary Button (Place Bid)**
- Background: Action Orange `#FA5400`
- Text: White, 16px, 600 weight
- Padding: 16px 32px
- Border Radius: 30px (pill shape)
- Shadow: `0 4px 12px rgba(250, 84, 0, 0.3)`

**Secondary Button**
- Background: Transparent
- Border: 1.5px solid current color
- Text: Inherit from context
- Padding: 14px 28px
- Border Radius: 30px

**Ghost Button**
- Background: Transparent
- Text: Action Orange or White
- Padding: 12px 20px

### Cards

**Product Card**
- Background: Surface color
- Border Radius: 16px
- Shadow (light): `0 2px 8px rgba(0,0,0,0.08)`
- Shadow (dark): `0 2px 8px rgba(0,0,0,0.3)`
- Padding: 0 (image bleeds) + 16px (content)

**Bid Card**
- Background: Gradient from Surface to SurfaceHighlight
- Border Left: 4px solid Action Orange
- Border Radius: 12px
- Padding: 16px

### Inputs

**Search Input**
- Background: Surface color
- Border Radius: 12px
- Height: 48px
- Padding: 0 16px
- Icon: Search, left aligned, 20px
- Placeholder: Text Secondary color

**Bid Input**
- Background: Transparent
- Border Bottom: 2px solid Action Orange
- Font: Price style (28px, 700)
- Text Align: Center

### Navigation

**Bottom Tab Bar**
- Background: Surface (with blur backdrop)
- Height: 80px (including safe area)
- Icons: 24px, inactive at 60% opacity
- Active Indicator: 4px dot or pill below icon

**Top Navigation**
- Background: Transparent or Blur
- Height: 56px
- Back Button: 24px chevron
- Title: H3 style, centered

## Animation Principles

### Timing
- **Micro**: 150ms - Button presses, toggles
- **Standard**: 300ms - Transitions, reveals
- **Dramatic**: 500ms - Page transitions, modals
- **Bidding**: 800ms - Bid placement, winning reveals

### Easing
- **Standard**: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- **Enter**: `cubic-bezier(0.0, 0.0, 0.2, 1)` - Decelerate
- **Exit**: `cubic-bezier(0.4, 0.0, 1, 1)` - Accelerate
- **Bounce**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - For playful elements

### Specific Animations

**Bid Placement**
1. Button press: Scale 0.95 (150ms)
2. Success ripple: Expand from center (400ms)
3. Checkmark draw: SVG stroke animation (300ms)
4. Confetti burst: Particle system (800ms)

**Outbid Alert**
1. Slide in from top with bounce
2. Pulse border 3 times
3. Auto-dismiss after 5s or tap

**Pull to Refresh**
1. Resistance curve on drag
2. Elastic snap on release
3. Spinner with Nike swoosh-inspired animation

## Iconography

### Icon Set
- **Library**: Phosphor Icons or Heroicons
- **Weight**: Bold (for navigation), Regular (for UI)
- **Size**: 24px standard, 20px compact, 32px featured

### Key Icons
- Home / Explore / Sell / Inbox / Profile (tab bar)
- Search / Filter / Sort (discovery)
- Heart / Share / More (actions)
- Bid / Tag / Box / Truck (selling)
- Shield / Lock / Check (trust)

## Layout Principles

### Safe Areas
- Respect device notches and home indicators
- Minimum touch target: 44x44pt

### Grid
- 2-column grid for product listings
- 16px gutters
- 16px horizontal padding

### Screen Transitions
- **Push**: Slide from right, parallax background
- **Modal**: Slide from bottom, dim background
- **Full Screen**: Fade with scale

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus states: 2px outline, offset 2px
- Reduce motion: Respect `prefers-reduced-motion`
- Dynamic type: Support system font scaling

---

*Reference: Nike App, Google Material Design 3, Apple Human Interface Guidelines*
