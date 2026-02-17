# Biddt MVP Sprint Plan

## 12-Week Roadmap to Launch

---

## Phase 1: Foundation (Weeks 1-2)

### Week 1: Team & Setup

#### Team 1 (R&D/Business)
- [ ] Finalize PRD v1.0
- [ ] Create user personas (3 primary)
- [ ] Define success metrics dashboard
- [ ] Set up analytics infrastructure (Mixpanel/Amplitude)

#### Team 2 (Marketing)
- [ ] Brand identity finalization
- [ ] Domain purchase & social handles
- [ ] Landing page design
- [ ] Pre-launch waitlist setup (Carrd/Webflow)

#### Team 3 (BD/Management)
- [ ] Identify 10 potential safe zone partners in Halifax
- [ ] Create seller acquisition playbook
- [ ] Set up support tools (Zendesk/Intercom trial)

#### Team 4 (Engineering)
- [ ] Repo setup & CI/CD pipeline
- [ ] Architecture decision records (ADRs)
- [ ] Database schema design
- [ ] API contract definitions (OpenAPI)

#### Team 5 (UI/UX)
- [ ] User research: 5 interviews in Halifax
- [ ] Complete user flow diagrams
- [ ] Low-fidelity wireframes (all 34 screens)
- [ ] Design system foundation (colors, type, spacing)

#### Team 6 (Legal)
- [ ] FINTRAC compliance assessment
- [ ] Terms of Service draft v1
- [ ] Privacy Policy draft v1
- [ ] Insurance broker outreach

### Week 2: Architecture & Design Finalization

#### Team 1
- [ ] Feature prioritization workshop
- [ ] Technical debt assessment framework
- [ ] Analytics event tracking plan

#### Team 2
- [ ] Content calendar (8 weeks)
- [ ] Influencer outreach list (20 micro-influencers)
- [ ] App Store assets planning

#### Team 3
- [ ] First 3 safe zone partner meetings
- [ ] Support playbook v1
- [ ] Dispute resolution flowchart

#### Team 4
- [ ] Auth service implementation (Firebase Auth)
- [ ] Database migrations
- [ ] API scaffolding
- [ ] Dev environment for all engineers

#### Team 5
- [ ] High-fidelity designs: Onboarding flow (5 screens)
- [ ] Design system v1 in Figma
- [ ] Component library setup
- [ ] Prototype: Seller listing flow

#### Team 6
- [ ] Seller Agreement draft
- [ ] Buyer Protection Policy
- [ ] MSB registration decision

---

## Phase 2: Core Features (Weeks 3-6)

### Week 3: Authentication & Profiles

#### Team 4 (Engineering)
- [ ] Phone OTP verification
- [ ] User profile creation
- [ ] Push notification setup
- [ ] Basic navigation structure

#### Team 5 (UI/UX)
- [ ] Final designs: Auth screens
- [ ] Profile screens (3 variants)
- [ ] Handoff to engineering

#### Team 2
- [ ] Landing page launch
- [ ] First social posts
- [ ] Waitlist: Target 100 signups

#### Team 3
- [ ] 5 safe zone partners confirmed
- [ ] Partner agreement templates

### Week 4: Listings & Camera

#### Team 4
- [ ] Camera integration (photos + video)
- [ ] Image upload & processing
- [ ] Listing creation API
- [ ] Draft listings (auto-save)

#### Team 5
- [ ] Listing creation flow designs
- [ ] Photo upload UI
- [ ] Category selection

#### Team 1
- [ ] Category taxonomy finalization
- [ ] Pricing recommendations algorithm v1

### Week 5: Bidding Engine v1

#### Team 4
- [ ] Auction model (start, end, reserve price)
- [ ] Bid placement API
- [ ] WebSocket setup for real-time updates
- [ ] Auto-bid logic (proxy bidding)

#### Team 5
- [ ] Bidding interaction designs
- [ ] Bid history UI
- [ ] Outbid notification designs

#### Team 2
- [ ] "How Biddt Works" explainer video
- [ ] Waitlist: Target 300 signups

### Week 6: Payments & Escrow

#### Team 4
- [ ] Stripe Connect integration
- [ ] Escrow hold functionality
- [ ] Wallet/balance display
- [ ] Payout logic

#### Team 5
- [ ] Payment flow UI
- [ ] Wallet screens
- [ ] Transaction history

#### Team 6
- [ ] Payment terms review
- [ ] Refund policy finalization

---

## Phase 3: Transaction Safety (Weeks 7-8)

### Week 7: QR System & Verification

#### Team 4
- [ ] QR code generation (unique per transaction)
- [ ] QR scanner implementation
- [ ] Verification API
- [ ] Transaction state machine

#### Team 5
- [ ] QR display screen (buyer)
- [ ] QR scanner screen (seller)
- [ ] Verification success/failure states
- [ ] Safe zone map integration

#### Team 3
- [ ] All 10 safe zones confirmed
- [ ] Safety guidelines document

### Week 8: Chat & Notifications

#### Team 4
- [ ] In-app messaging (blocked until bid accepted)
- [ ] Push notification service
- [ ] Email notifications (SendGrid)
- [ ] Notification preferences

#### Team 5
- [ ] Chat UI (buyer/seller)
- [ ] Notification designs
- [ ] Empty states

#### Team 2
- [ ] Waitlist: Target 500 signups
- [ ] Beta tester recruitment

---

## Phase 4: Polish & Launch (Weeks 9-12)

### Week 9: Testing & QA

#### Team 4
- [ ] Unit test coverage > 70%
- [ ] Integration tests
- [ ] Security audit
- [ ] Performance optimization

#### Team 5
- [ ] Usability testing (5 users)
- [ ] Design polish based on feedback
- [ ] Micro-interactions

#### Team 1
- [ ] Analytics dashboard live
- [ ] Funnel analysis setup

### Week 10: Beta Launch

#### All Teams
- [ ] Beta release to 100 waitlist users
- [ ] Daily standups to address issues
- [ ] Bug triage & hotfixes

#### Team 3
- [ ] Support ticket monitoring
- [ ] User feedback collection

#### Team 2
- [ ] Beta user testimonials
- [ ] Case studies

### Week 11: Iteration

#### Team 4
- [ ] Critical bug fixes
- [ ] Performance improvements
- [ ] App store submission prep

#### Team 5
- [ ] Final design polish
- [ ] App store screenshots
- [ ] Preview video

#### Team 6
- [ ] Final legal review
- [ ] Insurance confirmation

### Week 12: Public Launch

#### All Teams
- [ ] App store approval
- [ ] Launch day coordination
- [ ] Press release
- [ ] Social media blitz

#### Success Metrics for Launch Day
- [ ] 100+ downloads
- [ ] 20+ listings created
- [ ] 5+ successful transactions
- [ ] 0 critical bugs

---

## Task Dependencies Graph

```
Week 1-2:    [Foundation]
             │
Week 3-4:    [Auth] → [Listings]
             │         │
Week 5-6:    └─────────┴→ [Bidding] → [Payments]
                                     │
Week 7-8:                             └→ [QR] → [Chat]
                                               │
Week 9-10:                                      └→ [Testing]
                                                    │
Week 11-12:                                         └→ [Launch]
```

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| FINTRAC requires MSB registration | Medium | High | Consult lawyer early; use Stripe Connect |
| Stripe Connect delays | Medium | High | Start integration Week 2; have backup (PayPal) |
| iOS App Store rejection | Medium | High | Follow guidelines; submit Week 10 |
| Low beta engagement | Low | High | Incentivize with credits; personal outreach |
| Team member departure | Low | Medium | Document everything; cross-train |
| Safe zone partners back out | Low | Medium | Over-provision (target 15, need 10) |

---

## Weekly Check-in Template

**Date:** ___

### Team Updates (5 min each)
| Team | Last Week | This Week | Blockers |
|------|-----------|-----------|----------|
| 1 - R&D | | | |
| 2 - Marketing | | | |
| 3 - BD/Ops | | | |
| 4 - Engineering | | | |
| 5 - UI/UX | | | |
| 6 - Legal | | | |

### Metrics Review
- Waitlist signups: ___ (target: ___)
- Sprint completion: ___%
- Open blockers: ___

### Decisions Needed
1. 
2. 

### Action Items
| Task | Owner | Due |
|------|-------|-----|
| | | |

---

*Sprint Plan Owner: Carl 🎯*
