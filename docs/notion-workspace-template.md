# Biddt Notion Workspace Template

This document describes the complete Notion workspace structure for managing the Biddt project across all 6 teams.

## Workspace Structure

```
Biddt Project (Main Page)
├── 📋 Executive Dashboard
├── 🎯 Product
│   ├── PRD & Specifications
│   ├── Roadmap
│   └── User Research
├── 🎨 Design
│   ├── Design System
│   ├── User Flows
│   └── Screen Inventory (34 screens)
├── 💻 Engineering
│   ├── Sprint Board
│   ├── API Documentation
│   └── Technical Decisions
├── 📈 Marketing
│   ├── Content Calendar
│   ├── Campaign Tracking
│   └── Brand Assets
├── 🤝 Business Development
│   ├── Partner Pipeline
│   ├── Seller Acquisition
│   └── Support Tickets
├── ⚖️ Legal & Compliance
│   ├── Documents
│   ├── Compliance Checklist
│   └── Insurance
└── 👥 Team
    ├── Directory
    ├── Meeting Notes
    └── Sprint Retrospectives
```

---

## Database Schemas

### 1. Master Task Board (Cross-team)

**Purpose:** Single source of truth for all work

| Property | Type | Options/Config |
|----------|------|----------------|
| Name | Title | - |
| Team | Select | R&D, Marketing, BD, Engineering, Design, Legal |
| Sprint | Select | Week 1, Week 2, ..., Week 12 |
| Status | Select | Backlog, To Do, In Progress, Review, Done, Blocked |
| Priority | Select | P0 (Critical), P1 (High), P2 (Medium), P3 (Low) |
| Assignee | People | Team members |
| Due Date | Date | - |
| Effort | Select | XS (2h), S (4h), M (1d), L (3d), XL (1w) |
| Dependencies | Relation | → Master Task Board (self-relation) |
| Blocked By | Relation | → Master Task Board |
| Related Screen | Relation | → Screen Inventory |
| Epic | Relation | → Epics |
| Tags | Multi-select | MVP, Post-MVP, Bug, Tech Debt, Spike |
| Notes | Rich Text | - |

**Views:**
- Kanban (by Status)
- Team Board (grouped by Team)
- Sprint Board (filtered by Sprint)
- My Tasks (filtered by Assignee)
- Calendar (by Due Date)
- Blocked Items (filtered by Status = Blocked)

---

### 2. Screen Inventory (34 Stitch Screens)

**Purpose:** Track all UI screens from design to implementation

| Property | Type | Options/Config |
|----------|------|----------------|
| Name | Title | Screen name |
| Screen ID | Text | Stitch ID (e.g., 04080298a6024861aca00406b270be42) |
| Category | Select | Onboarding, Home, Search, Product, Sell, Profile, Checkout, System |
| Theme | Select | Light, Dark, Both |
| Flow | Select | Auth, Listing, Bidding, Payment, QR Exchange, Chat, Profile |
| Status | Select | Not Started, Wireframe, Design, Review, Dev Handoff, In Dev, QA, Done |
| Priority | Select | Critical, High, Medium, Low |
| Platform | Multi-select | iOS, Android |
| Designer | People | - |
| Developer | People | - |
| Stitch URL | URL | Link to Stitch |
| Figma URL | URL | Link to Figma |
| Storybook URL | URL | Component documentation |
| Related Tasks | Relation | ← Master Task Board |
| Dependencies | Relation | → Screen Inventory (screens that must be done first) |
| Complexity | Select | Simple, Medium, Complex |
| Est. Hours | Number | Development estimate |
| QA Notes | Rich Text | - |

**Views:**
- By Status (Kanban)
- By Category (Table)
- By Flow (Board)
- Dev Handoff Queue (Status = Review)
- iOS Screens (filtered)
- Android Screens (filtered)

---

### 3. Epics

**Purpose:** High-level feature grouping

| Property | Type | Options |
|----------|------|---------|
| Name | Title | - |
| Description | Rich Text | - |
| Status | Select | Planning, In Progress, Done, Cancelled |
| Team | Select | (primary owner) |
| Start Date | Date | - |
| Target Date | Date | - |
| Progress | Formula | `prop("Done Tasks") / prop("Total Tasks")` |
| Tasks | Relation | ← Master Task Board |
| Success Criteria | Rich Text | - |

**Epics for MVP:**
1. Authentication & Onboarding
2. Listing Creation
3. Bidding System
4. Payment & Escrow
5. QR Verification
6. In-App Chat
7. Admin Dashboard

---

### 4. Sprint Planning

**Purpose:** Sprint management and velocity tracking

| Property | Type | Options |
|----------|------|---------|
| Sprint | Title | e.g., "Sprint 1: Foundation" |
| Dates | Date Range | Start → End |
| Status | Select | Planning, Active, Completed |
| Goals | Rich Text | 3-5 sprint goals |
| Capacity | Number | Total story points available |
| Committed | Rollup | Sum of task effort from linked tasks |
| Completed | Rollup | Sum of completed task effort |
| Velocity | Formula | `prop("Completed") / prop("Committed")` |
| Tasks | Relation | ← Master Task Board |
| Retrospective | Rich Text | Notes |

---

### 5. User Research

**Purpose:** Track research activities and insights

| Property | Type | Options |
|----------|------|---------|
| Participant | Title | Name or ID |
| Type | Select | Interview, Usability Test, Survey |
| Date | Date | - |
| Segment | Select | Gen Z, Millennial, Collector, Seller |
| Location | Select | Halifax, Other |
| Key Insights | Rich Text | - |
| Pain Points | Multi-select | (tagged themes) |
| Feature Requests | Relation | → Master Task Board |
| Recording | URL | Loom/Zoom link |
| Transcript | Rich Text | - |

---

### 6. Marketing Content Calendar

**Purpose:** Plan and track marketing activities

| Property | Type | Options |
|----------|------|---------|
| Content | Title | - |
| Type | Select | Blog, Social, Email, Video, Ad |
| Platform | Multi-select | Instagram, TikTok, Twitter, LinkedIn, Email |
| Status | Select | Idea, Writing, Review, Scheduled, Published |
| Publish Date | Date | - |
| Owner | People | - |
| Copy | Rich Text | - |
| Visuals | Files | - |
| Link | URL | Published URL |
| Performance | Rich Text | Metrics after publish |

---

### 7. Partner Pipeline (BD)

**Purpose:** Track safe zone and business partnerships

| Property | Type | Options |
|----------|------|---------|
| Partner | Title | Business name |
| Type | Select | Safe Zone, Payment, Insurance, Marketing |
| Contact | Rich Text | Name, email, phone |
| Status | Select | Research, Outreach, Meeting, Negotiation, Signed, Active, Lost |
| Priority | Select | High, Medium, Low |
| Value | Select | Critical, Important, Nice-to-have |
| Next Action | Rich Text | - |
| Due Date | Date | - |
| Contract | Files | - |
| Notes | Rich Text | - |

---

### 8. Support Tickets (Post-MVP)

**Purpose:** Customer support tracking

| Property | Type | Options |
|----------|------|---------|
| Ticket # | Title | Auto-numbered |
| User | Email | - |
| Category | Select | Bug, Feature Request, Account, Payment, Dispute |
| Priority | Select | Urgent, High, Medium, Low |
| Status | Select | New, In Progress, Waiting, Resolved, Closed |
| Assigned | People | - |
| Created | Created Time | - |
| Resolved | Date | - |
| Resolution | Rich Text | - |

---

### 9. Legal Documents

**Purpose:** Track legal and compliance documents

| Property | Type | Options |
|----------|------|---------|
| Document | Title | - |
| Type | Select | Terms, Privacy Policy, Contract, Insurance, Compliance |
| Status | Select | Draft, Review, Approved, Published |
| Owner | People | - |
| External Counsel | Checkbox | - |
| Last Updated | Date | - |
| Version | Text | - |
| File | Files | - |
| Notes | Rich Text | - |

---

## Page Templates

### Meeting Notes Template

```
# Meeting: [Title]

**Date:** [Date]
**Attendees:** [Names]
**Purpose:** [One sentence]

## Agenda
1. 
2. 
3. 

## Notes

## Decisions
- [ ] 

## Action Items
| Task | Owner | Due |
|------|-------|-----|
| | | |

## Next Meeting
**Date:** 
**Focus:** 
```

### Sprint Retrospective Template

```
# Sprint [N] Retrospective

**Dates:** [Start] - [End]
**Sprint Goal:** 

## What Went Well
- 

## What Could Be Better
- 

## Action Items
| Issue | Solution | Owner |
|-------|----------|-------|
| | | |

## Shoutouts
- 

## Metrics
- Committed: ___ points
- Completed: ___ points
- Velocity: ___%
```

### User Interview Template

```
# User Interview: [Name/ID]

**Date:** 
**Segment:** Gen Z / Millennial / Collector
**Location:** 
**Recorder:** 

## Background
- Age: 
- Occupation: 
- Current selling/buying habits: 

## Key Questions
1. How do you currently buy/sell locally?
2. What frustrates you about existing platforms?
3. How important is safety vs. convenience?
4. Would you pay a fee for guaranteed safety?

## Insights
### Pain Points
- 

### Feature Requests
- 

### Quotes
> "..."

## Next Steps
- [ ] 
```

---

## Automation Ideas

### Using Notion Automations (or Zapier/Make)

1. **Status Updates**
   - When task status → "Done", notify team lead
   - When task status → "Blocked", create alert in #blockers

2. **Sprint Management**
   - Auto-create sprint pages every 2 weeks
   - Move incomplete tasks to next sprint

3. **Design Handoff**
   - When screen status → "Dev Handoff", notify assigned developer
   - Create implementation task automatically

4. **Due Date Reminders**
   - 24h before due date: remind assignee
   - On due date: escalate to team lead if not done

---

## MCP Integration Commands

Once connected, you can ask me to:

```
"Create a new task for Team 4: Implement QR scanner, P1 priority, due Friday"

"Show me all blocked items across teams"

"What's the sprint velocity for Week 3?"

"List all screens in 'Dev Handoff' status"

"Create a sprint retrospective page for Sprint 2"

"Add a user research entry for participant P001"
```

---

## Getting Started Checklist

- [ ] Create Notion workspace
- [ ] Invite all team members
- [ ] Create databases (copy schemas above)
- [ ] Set up integrations (Slack, GitHub, Figma)
- [ ] Import 34 screens to Screen Inventory
- [ ] Create Week 1-2 tasks
- [ ] Set up automation rules
- [ ] Train team on Notion usage

---

*Template Owner: Carl 🎯*
