# Biddt Team Onboarding Guide

Welcome to the Biddt team! This guide will get you up to speed quickly.

---

## Day 1: Welcome & Setup

### For All Team Members

#### Accounts & Access
- [ ] Notion workspace invitation accepted
- [ ] Slack/Discord joined
- [ ] GitHub organization invite accepted
- [ ] Figma (for design/eng) access granted
- [ ] Google Workspace account created
- [ ] Calendar invites accepted

#### Tools to Install
| Tool | Purpose | Link |
|------|---------|------|
| Slack | Team chat | Download app |
| Notion | Documentation | Download app |
| Figma | Design | figma.com |
| Linear/Jira | Task tracking | Web |
| Loom | Async video | loom.com |
| 1Password | Password vault | Team vault invite |

#### Reading List (30 min)
- [ ] Read [Project README](../README.md)
- [ ] Read [Team Structure](team-structure.md) — understand your team
- [ ] Review [Sprint Plan](sprint-plan.md) — know the timeline

---

## Team-Specific Onboarding

### Team 1: R&D / Business Strategy

**Your Mission:** Ensure we're building the right product for the right market.

#### Week 1 Goals
- [ ] Understand current business model canvas
- [ ] Review competitive analysis
- [ ] Set up analytics infrastructure
- [ ] Define success metrics dashboard

#### Key Documents to Create
- User personas (3 primary)
- Feature prioritization matrix
- Unit economics model
- Go-to-market playbook

#### Tools
- Mixpanel/Amplitude (analytics)
- Google Sheets (financial models)
- Typeform (surveys)

---

### Team 2: Marketing & Graphics

**Your Mission:** Build buzz, acquire users, establish brand.

#### Week 1 Goals
- [ ] Finalize brand identity
- [ ] Set up social media accounts
- [ ] Launch landing page
- [ ] Create content calendar

#### Key Deliverables
- Brand guidelines (logo, colors, voice)
- App Store assets
- Social media templates
- Pre-launch campaign

#### Tools
- Canva/Figma (design)
- Buffer/Hootsuite (scheduling)
- Webflow/Carrd (landing page)
- Google Analytics

---

### Team 3: Business Development & Management

**Your Mission:** Build partnerships, keep operations smooth.

#### Week 1 Goals
- [ ] Map Halifax safe zones
- [ ] Create partner outreach list
- [ ] Set up support system
- [ ] Draft partner agreements

#### Key Deliverables
- 10 safe zone partnerships
- Seller acquisition playbook
- Support ticket system
- Dispute resolution process

#### Tools
- HubSpot/Pipedrive (CRM)
- Zendesk/Intercom (support)
- Notion (playbooks)

---

### Team 4: Software Engineering

**Your Mission:** Build a fast, secure, delightful app.

#### Week 1 Goals
- [ ] Repo access and local setup
- [ ] CI/CD pipeline running
- [ ] Architecture review
- [ ] First commit merged

#### Tech Stack
| Layer | Technology |
|-------|------------|
| Mobile (iOS) | SwiftUI, Combine |
| Mobile (Android) | Jetpack Compose, Coroutines |
| Backend | Node.js or Go |
| Database | PostgreSQL |
| Cache | Redis |
| Payments | Stripe Connect |
| Auth | Firebase Auth |
| Hosting | AWS/GCP |

#### Development Workflow
```
1. Pick task from Linear (in "To Do")
2. Create feature branch: feature/TASK-123-short-name
3. Develop with tests
4. Open PR → requires 1 review
5. CI passes → merge to main
6. Auto-deploy to staging
```

#### Key Repositories
- `biddt-mobile-ios`
- `biddt-mobile-android`
- `biddt-backend`
- `biddt-admin`

---

### Team 5: UI/UX Design

**Your Mission:** Create an experience that feels like Nike-level polish.

#### Week 1 Goals
- [ ] Complete user interviews (5 people)
- [ ] Finalize user flows
- [ ] Set up design system in Figma
- [ ] Hand off first screens to engineering

#### Design Principles
1. **High Energy** — Bold motion, exciting interactions
2. **Trust First** — Safety signals everywhere
3. **3-Tap Rule** — No core action takes more than 3 taps
4. **Premium Feel** — Clean, spacious, intentional

#### Deliverables Schedule
| Week | Deliverable |
|------|-------------|
| 1 | User flows, wireframes |
| 2 | Design system v1, Auth screens |
| 3 | Listing flow |
| 4 | Bidding screens |
| 5-6 | Payment flows |
| 7-8 | QR system, Chat |
| 9 | Polish, micro-interactions |
| 10 | App Store assets |

#### Tools
- Figma (primary)
- Principle/Protopie (prototyping)
- Maze (usability testing)
- Loom (async feedback)

---

### Team 6: Legal & Compliance

**Your Mission:** Keep us legal, protected, and compliant.

#### Week 1 Goals
- [ ] FINTRAC assessment complete
- [ ] Terms of Service draft
- [ ] Privacy Policy draft
- [ ] Insurance broker contacted

#### Key Documents
| Document | Status | Owner |
|----------|--------|-------|
| Terms of Service | Draft | Legal |
| Privacy Policy | Draft | Legal |
| Seller Agreement | Draft | Legal |
| Buyer Protection | Draft | Legal |
| MSB Registration | Assessment | Compliance |
| Insurance (CGL) | Quote | Compliance |
| Insurance (Cyber) | Quote | Compliance |

#### Compliance Checklist
- [ ] FINTRAC MSB determination
- [ ] PIPEDA compliance review
- [ ] PCI DSS (via Stripe)
- [ ] DMCA agent registration
- [ ] Provincial business registration

---

## Communication Guidelines

### Daily Standups (15 min)
**Time:** 9:00 AM AST  
**Format:**
- What I did yesterday
- What I'm doing today
- Any blockers?

### Async Communication
- **Slack:** Quick questions, updates
- **Notion:** Documentation, decisions
- **Loom:** Complex explanations, demos
- **Email:** External communication only

### Meeting Culture
- Start on time, end early
- Agenda required
- No meetings Wednesdays (deep work)
- Record for async catch-up

### Response Times
| Channel | Expected Response |
|---------|-------------------|
| Slack (urgent) | 1 hour |
| Slack (normal) | 4 hours |
| Email | 24 hours |
| Notion comment | 24 hours |

---

## Decision Making

### RACI Matrix
| Decision Type | Responsible | Accountable | Consulted | Informed |
|--------------|-------------|-------------|-----------|----------|
| Feature prioritization | Team 1 | Founder | All | All |
| Design approval | Team 5 | Design Lead | Eng, Product | All |
| Tech architecture | Team 4 | CTO | Eng team | All |
| Marketing spend | Team 2 | CMO | Founder | All |
| Partnerships | Team 3 | COO | Legal | All |
| Legal/compliance | Team 6 | Legal | Founder | All |

### Escalation Path
1. Try to resolve within team
2. Escalate to team lead
3. Escalate to Carl (me)
4. Escalate to Founder

---

## Remote Work Guidelines

### Hours
- Core hours: 10 AM - 3 PM AST (all hands available)
- Flexible outside core hours
- Weekend work: Only if pre-approved

### Availability
- Update Slack status when away
- Calendar blocks for focus time
- Respond to pings within core hours

### Time Off
- Notify team 1 week in advance
- Hand off active tasks
- Update calendar

---

## First Week Checklist

### Day 1
- [ ] Complete admin setup
- [ ] Meet your team lead
- [ ] Read project docs
- [ ] Set up development environment (eng)
- [ ] Access design files (design)

### Day 2-3
- [ ] Attend first standup
- [ ] Pick up first task
- [ ] Shadow team member
- [ ] Ask questions!

### Day 4-5
- [ ] Complete first deliverable
- [ ] Get feedback
- [ ] Update documentation
- [ ] Plan Week 2

---

## Questions?

**Technical issues:** Ask in #engineering-help  
**Design questions:** Ask in #design-critique  
**General questions:** Ask me (Carl) or your team lead  
**Urgent:** DM Founder

---

Welcome aboard! Let's build something amazing. 🎯

*Onboarding Guide Owner: Carl*
