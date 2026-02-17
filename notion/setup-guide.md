# Notion Workspace Setup - Biddt Project

This script creates the complete Notion workspace structure for Biddt.

## Step 1: Create Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "Biddt Project"
4. Associated workspace: [Your workspace]
5. Capabilities: 
   - [x] Read content
   - [x] Update content
   - [x] Insert content
6. Copy "Internal Integration Token"

## Step 2: Create Main Page

Create a new page in Notion called **"Biddt Project"**

Add this icon: 💎

Add this description:
```
Safe Local Bidding Marketplace
The excitement of auctions + The safety of escrow
```

## Step 3: Create All Databases

### Database 1: Design Screens

**Title:** Design Screens
**Icon:** 🎨

**Properties:**
```
Name (Title)
Screen ID (Text)
Category (Select): Onboarding | Home | Search | Product | Sell | Profile | Checkout | System
Theme (Select): Light | Dark | Both
Flow (Select): Auth | Listing | Bidding | Payment | QR Exchange | Chat | Profile
Status (Select): Not Started | Wireframe | Design | Review | Dev Handoff | In Dev | QA | Done
Priority (Select): Critical | High | Medium | Low
Platform (Multi-select): iOS | Android
Designer (People)
Developer (People)
Stitch URL (URL)
Figma URL (URL)
Storybook URL (URL)
Est. Hours (Number)
QA Notes (Rich Text)
```

**Import all 34 screens:**

| Name | Screen ID | Category | Theme | Flow | Priority |
|------|-----------|----------|-------|------|----------|
| Seller Analytics & Earnings | 04080298a6024861aca00406b270be42 | Profile | Both | Profile | High |
| High-Energy Bidding Interaction | 127b2b6aa3614a30a6e103b1750e1768 | Product | Both | Bidding | Critical |
| Outbid Alert - Deep Navy | 1667562b3a504a448975a31cbe48437a | System | Dark | Bidding | High |
| Sell: Final Review and Shipping | 1c9064565a774c69a4390142ffa3c756 | Sell | Light | Listing | High |
| Product Comparison Table | 1e5dcf92d19943f48e855b0d7e747163 | Product | Light | Product | Medium |
| Live Auction Dashboard | 24eee9cd6b8e4659abb2a88dc88a7ea8 | Home | Both | Bidding | Critical |
| Home Marketplace Feed | 2d6030e8e44e4162849edc27e2227c8f | Home | Light | Home | Critical |
| Market Price Analyzer | 3b17cb71d016477c809097465c415a76 | Product | Light | Product | Medium |
| Biddt Home - Nike Light Theme | 3e83638a95014fce926643b3469dba4c | Home | Light | Home | Critical |
| Sell: Pricing and Auction Settings | 4743319224874d9a91eb703b2e82f50f | Sell | Light | Listing | High |
| Outbid Alert - Minimalist Light | 4d248e8a006c4032a70e47857e7ff2de | System | Light | Bidding | Medium |
| Winning Reveal - Deep Navy | 5043a1e31e4c476ea959254fb20d741c | System | Dark | Bidding | High |
| Home Feed - Minimalist Light | 6efbcaba71aa435180b86e17693c43bd | Home | Light | Home | Medium |
| Create Biddt Account | 7b02e04471c3432fabf420f4bea1703d | Onboarding | Light | Auth | Critical |
| Premium Product Experience | 81789992365e4543afabe26e9a2d4c21 | Product | Both | Product | Medium |
| Safe Exchange & QR Scan | 828d6af57d7c4a1e9cd590e17a0d3279 | Checkout | Both | QR Exchange | Critical |
| Member Profile Hub | 842e10336d8d4a7080d6264fb926d4bd | Profile | Both | Profile | Medium |
| Profile Hub - Light & Chromium | 849c0dbc88dc4aa9a39e9d537f60de5c | Profile | Light | Profile | Low |
| Monochrome Chat - Dark Theme | 8c8ae81652724319bb0b44ded3424969 | System | Dark | Chat | Medium |
| Profile and Digital Wallet | 92f0a431afbc4761b587b82bf92a3d9c | Profile | Both | Profile | High |
| Sell: Item Specifications | 9d95399ed77b48088c9af4d7c0ace237 | Sell | Light | Listing | Medium |
| Item Negotiation Chat | 9d9c0c68ebc345a09b8d707406e79997 | System | Both | Chat | Medium |
| Biddt Home - Nike Deep Navy Dark | b75322776c5147a0b39b5d96ecdd2fb4 | Home | Dark | Home | Medium |
| Secure Checkout & Payment | b7fa5a2e3a2d43deac4bbf04736eee35 | Checkout | Light | Payment | Critical |
| Advanced Search Filters | c072851d3ca14c8e8be004b527f35378 | Search | Light | Home | Medium |
| Detailed Item Performance | c7d41376df7949c0ba8ca7497f46e7e1 | Sell | Light | Profile | Low |
| Diamond Mystery Splash - Dark Theme | c80118e3fea343948ba9c916f7b2a3bb | Onboarding | Dark | Auth | High |
| Winning Reveal - Minimalist Light | cc967b5f1f174b86b9f7bff49c3cf335 | System | Light | Bidding | High |
| Home Feed - Obsidian Dark | cee5735370ab4f3bbdf965f7167a1db8 | Home | Dark | Home | Medium |
| Bid Placement Success | d47267f8cd3243febbd11017bd3df3d0 | System | Both | Bidding | High |
| Sell: Add Photos and Media | d498a5fb7761483d9be2790fd27b9de2 | Sell | Light | Listing | Critical |
| Featured Product Details | d62ab653213e498fb24186ef359489a8 | Product | Both | Product | Critical |
| Welcome to Biddt Splash | e5aad76499fc4b4096614062d423fec9 | Onboarding | Both | Auth | Critical |
| Profile - Minimalist Light | e6eedc7446e946c585c0874831a56281 | Profile | Light | Profile | Low |

---

### Database 2: Master Task Board

**Title:** Tasks
**Icon:** ✅

**Properties:**
```
Name (Title)
Team (Select): R&D | Marketing | BD | Engineering | Design | Legal
Sprint (Select): Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 | Week 7 | Week 8 | Week 9 | Week 10 | Week 11 | Week 12
Status (Select): Backlog | To Do | In Progress | Review | Done | Blocked
Priority (Select): P0 | P1 | P2 | P3
Assignee (People)
Due Date (Date)
Effort (Select): XS | S | M | L | XL
Tags (Multi-select): MVP | Post-MVP | Bug | Tech Debt | Spike
Notes (Rich Text)
```

**Week 1 Tasks to Create:**

| Task | Team | Priority | Effort |
|------|------|----------|--------|
| Finalize PRD v1.0 | R&D | P0 | M |
| Create user personas | R&D | P0 | M |
| Set up analytics | R&D | P1 | S |
| Finalize brand identity | Marketing | P0 | L |
| Set up social accounts | Marketing | P0 | S |
| Launch landing page | Marketing | P0 | M |
| Identify 10 safe zone partners | BD | P0 | M |
| Create seller playbook | BD | P0 | M |
| Repo setup & CI/CD | Engineering | P0 | M |
| Architecture decisions | Engineering | P0 | M |
| Database schema design | Engineering | P0 | M |
| Complete 5 user interviews | Design | P0 | M |
| Create user flows | Design | P0 | L |
| Design system foundation | Design | P0 | L |
| FINTRAC assessment | Legal | P0 | M |
| Terms of Service draft | Legal | P0 | M |

---

### Database 3: Features

**Title:** Features
**Icon:** ⭐

**Properties:**
```
Name (Title)
Description (Rich Text)
Status (Select): Planning | In Progress | Done | Cancelled
Team (Select): R&D | Marketing | BD | Engineering | Design | Legal
Start Date (Date)
Target Date (Date)
Progress (Formula): prop("Done Tasks") / prop("Total Tasks")
Success Criteria (Rich Text)
```

**Epics to Create:**
1. Authentication & Onboarding
2. Listing Creation
3. Bidding System
4. Payment & Escrow
5. QR Verification
6. In-App Chat
7. Admin Dashboard

---

### Database 4: Sprint Planning

**Title:** Sprints
**Icon:** 🏃

**Properties:**
```
Sprint (Title)
Dates (Date Range)
Status (Select): Planning | Active | Completed
Goals (Rich Text)
Capacity (Number)
Committed (Rollup)
Completed (Rollup)
Velocity (Formula)
Retrospective (Rich Text)
```

---

### Database 5: User Research

**Title:** User Research
**Icon:** 🗣️

**Properties:**
```
Participant (Title)
Type (Select): Interview | Usability Test | Survey
Date (Date)
Segment (Select): Gen Z | Millennial | Collector | Seller
Location (Select): Halifax | Other
Key Insights (Rich Text)
Pain Points (Multi-select)
Recording (URL)
```

---

### Database 6: Marketing Content

**Title:** Content Calendar
**Icon:** 📅

**Properties:**
```
Content (Title)
Type (Select): Blog | Social | Email | Video | Ad
Platform (Multi-select): Instagram | TikTok | Twitter | LinkedIn | Email
Status (Select): Idea | Writing | Review | Scheduled | Published
Publish Date (Date)
Owner (People)
Copy (Rich Text)
Link (URL)
```

---

### Database 7: Partner Pipeline

**Title:** Partners
**Icon:** 🤝

**Properties:**
```
Partner (Title)
Type (Select): Safe Zone | Payment | Insurance | Marketing
Contact (Rich Text)
Status (Select): Research | Outreach | Meeting | Negotiation | Signed | Active | Lost
Priority (Select): High | Medium | Low
Next Action (Rich Text)
Due Date (Date)
```

---

### Database 8: Support Tickets

**Title:** Support Tickets
**Icon:** 🎫

**Properties:**
```
Ticket # (Title)
User (Email)
Category (Select): Bug | Feature Request | Account | Payment | Dispute
Priority (Select): Urgent | High | Medium | Low
Status (Select): New | In Progress | Waiting | Resolved | Closed
Assigned (People)
Created (Created Time)
Resolved (Date)
```

---

### Database 9: Legal Documents

**Title:** Legal Documents
**Icon:** ⚖️

**Properties:**
```
Document (Title)
Type (Select): Terms | Privacy Policy | Contract | Insurance | Compliance
Status (Select): Draft | Review | Approved | Published
Owner (People)
External Counsel (Checkbox)
Last Updated (Date)
Version (Text)
```

---

## Step 4: Create Page Structure

Inside "Biddt Project" page, create these sub-pages:

### 📋 Executive Dashboard
Link to dashboard view of Tasks, show metrics

### 🎯 Product
- PRD & Specifications
- Roadmap
- User Research (link to database)

### 🎨 Design
- Design System
- User Flows
- Screen Inventory (link to database)

### 💻 Engineering
- Sprint Board (link to database)
- API Documentation
- Technical Decisions

### 📈 Marketing
- Content Calendar (link to database)
- Campaign Tracking
- Brand Assets

### 🤝 Business Development
- Partner Pipeline (link to database)
- Seller Acquisition
- Support Tickets (link to database)

### ⚖️ Legal & Compliance
- Documents (link to database)
- Compliance Checklist
- Insurance

### 👥 Team
- Directory
- Meeting Notes
- Sprint Retrospectives

---

## Step 5: Share with Integration

For each database:
1. Click "..." (more options)
2. Click "Add connections"
3. Select "Biddt Project" integration

---

## Step 6: Get Database IDs

1. Open each database in full-page view
2. Copy the URL:
   ```
   https://www.notion.so/workspace/ABC123DEF456?v=...
                           ^^^^^^^^^^^^
                           This is the Database ID
   ```
3. Save these IDs for MCP configuration

---

## MCP Configuration

Add to OpenClaw config:

```json
{
  "mcpServers": {
    "biddt-notion": {
      "command": "node",
      "args": ["/root/.openclaw/workspace/biddt/notion/notion-mcp-server.js"],
      "env": {
        "NOTION_TOKEN": "secret_xxxxxxxxxxxxxxxx",
        "NOTION_DESIGN_DB_ID": "abc123...",
        "NOTION_TASKS_DB_ID": "def456...",
        "NOTION_FEATURES_DB_ID": "ghi789..."
      }
    }
  }
}
```

---

*Setup Guide Owner: Carl 🎯*
