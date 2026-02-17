# Biddt Team Structure & Management Framework

## Organization Overview

```
                    ┌─────────────────┐
                    │   FOUNDER/CEO   │
                    │   (You + Carl)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │  COO    │         │  CTO    │         │  CMO    │
   │(Ops/Mgt)│         │(Tech)   │         │(Growth) │
   └────┬────┘         └────┬────┘         └────┬────┘
        │                   │                   │
   ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
   │Team 3   │         │Team 4   │         │Team 2   │
   │Team 6   │         │Team 5   │         │         │
   └─────────┘         └─────────┘         └─────────┘
```

---

## Team 1: R&D / Business Model & Strategy
**Lead:** Business Strategist / Product Owner
**Size:** 2-3 people

### Roles
| Role | Responsibility | Deliverables |
|------|---------------|--------------|
| Product Strategist | Market fit, feature prioritization | PRD, Roadmap, User stories |
| Business Analyst | Financial modeling, unit economics | Revenue projections, CAC/LTV analysis |
| Operations Research | Process optimization, logistics | Workflow diagrams, efficiency metrics |

### Key Deliverables for MVP
- [ ] Business Model Canvas (completed)
- [ ] Unit Economics Model (CAC, LTV, Payback period)
- [ ] Feature prioritization matrix (MoSCoW)
- [ ] Go-to-market strategy document
- [ ] Pricing optimization analysis
- [ ] Competitive positioning map

### Success Metrics
- Customer Acquisition Cost < $15
- Projected LTV/CAC ratio > 3:1
- Break-even timeline: 18 months

---

## Team 2: Marketing & Graphics
**Lead:** Growth Marketing Manager
**Size:** 3-4 people

### Roles
| Role | Responsibility | Deliverables |
|------|---------------|--------------|
| Growth Marketer | UA, campaigns, analytics | Ad creatives, funnel optimization |
| Content Creator | Social media, blog, video | Content calendar, viral loops |
| Graphic Designer | Brand assets, marketing materials | Logo system, ad templates, social assets |
| Community Manager | Discord, Reddit, user engagement | Community growth, ambassador program |

### Key Deliverables for MVP
- [ ] Brand identity system (logo, colors, typography)
- [ ] App Store screenshots & preview video
- [ ] Launch campaign assets (Halifax pilot)
- [ ] Social media templates (Instagram, TikTok)
- [ ] Influencer outreach kit
- [ ] Referral program design

### Success Metrics
- Pre-launch waitlist: 1,000 users
- Cost per install: <$2
- Organic/referral ratio: >30%

---

## Team 3: Business Development & Management
**Lead:** BD Director / Operations Manager
**Size:** 2-3 people

### Roles
| Role | Responsibility | Deliverables |
|------|---------------|--------------|
| BD Manager | Partnerships, safe zones, sellers | Partnership agreements, seller onboarding |
| Operations Manager | Day-to-day, support, logistics | Support playbooks, escalation procedures |
| HR/Admin | Hiring, team coordination | Team onboarding, contractor management |

### Key Deliverables for MVP
- [ ] Safe zone partnerships (coffee shops, malls)
- [ ] Seller acquisition playbook
- [ ] Customer support system (Zendesk/Intercom)
- [ ] Dispute resolution process
- [ ] Onboarding flows for power sellers

### Success Metrics
- 10+ safe zone partners in Halifax
- 50+ active sellers at launch
- Support response time < 2 hours

---

## Team 4: Software Engineering
**Lead:** CTO / Engineering Manager
**Size:** 4-6 people

### Roles
| Role | Responsibility | Tech Stack |
|------|---------------|------------|
| Mobile Lead (iOS) | Swift/SwiftUI app | iOS 16+, SwiftUI, Combine |
| Mobile Lead (Android) | Kotlin/Jetpack Compose | Android 12+, Compose, Coroutines |
| Backend Lead | API, database, infrastructure | Node.js/Go, PostgreSQL, Redis |
| DevOps Engineer | CI/CD, cloud, security | AWS/GCP, Docker, Terraform |
| QA Engineer | Testing, automation | Detox, Appium, unit tests |

### Key Deliverables for MVP
- [ ] Auth system (Phone OTP)
- [ ] Listing creation with camera
- [ ] Real-time bidding engine (WebSockets)
- [ ] Stripe Connect integration (escrow)
- [ ] QR code generation & scanning
- [ ] In-app chat (blocked until bid accepted)
- [ ] Push notifications
- [ ] Admin dashboard

### Tech Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   iOS App   │     │ Android App │     │  Web Admin  │
│  (SwiftUI)  │     │  (Compose)  │     │  (React)    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
              ┌────────────┴────────────┐
              │    API Gateway (AWS)    │
              │      Rate limiting      │
              └────────────┬────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
┌──────┴──────┐    ┌──────┴──────┐    ┌──────┴──────┐
│  Auth Svc   │    │  Core API   │    │  Chat Svc   │
│  (Firebase) │    │  (Node.js)  │    │ (WebSocket) │
└─────────────┘    └──────┬──────┘    └─────────────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
       ┌──────┴───┐ ┌────┴────┐ ┌────┴────┐
       │PostgreSQL│ │  Redis  │ │Stripe   │
       │          │ │ (Cache) │ │Connect  │
       └──────────┘ └─────────┘ └─────────┘
```

### Success Metrics
- App store rating > 4.5
- Crash-free rate > 99.5%
- API response time < 200ms (p95)
- Zero security incidents

---

## Team 5: UI/UX Design
**Lead:** Product Designer
**Size:** 2-3 people

### Roles
| Role | Responsibility | Deliverables |
|------|---------------|--------------|
| Product Designer | End-to-end UX, flows, testing | User flows, wireframes, prototypes |
| Visual Designer | UI polish, design system | High-fidelity screens, components |
| UX Researcher | User testing, interviews | Research reports, usability tests |

### Key Deliverables for MVP
- [ ] User research report (Halifax target users)
- [ ] Complete user flows (Seller & Buyer)
- [ ] Design system (based on Nike inspiration)
- [ ] All 34 screens from Stitch → Figma
- [ ] Interactive prototype
- [ ] Usability test results (5-8 users)

### Design Principles (Nike-inspired)
1. **High Energy** - Bold animations, dynamic bidding
2. **Trust Signals** - Clear safety indicators throughout
3. **Frictionless** - 3-tap max for core actions
4. **Premium Feel** - Clean typography, generous whitespace

### Success Metrics
- Task completion rate > 85%
- Time to first bid < 2 minutes
- NPS score > 50

---

## Team 6: Legal & Compliance
**Lead:** Legal Counsel / Compliance Officer
**Size:** 1-2 people (external counsel + internal)

### Roles
| Role | Responsibility | Deliverables |
|------|---------------|--------------|
| Legal Counsel | Contracts, terms, IP protection | Terms of Service, Privacy Policy, Seller Agreement |
| Compliance Officer | FINTRAC, data privacy, insurance | Compliance checklist, MSB registration (if needed) |

### Key Deliverables for MVP
- [ ] Terms of Service
- [ ] Privacy Policy (GDPR/CCPA compliant)
- [ ] Seller Agreement
- [ ] Buyer Protection Policy
- [ ] FINTRAC compliance review
- [ ] Insurance requirements doc
- [ ] Dispute resolution framework

### Compliance Checklist
- [ ] Money Services Business (MSB) registration assessment
- [ ] PCI DSS compliance (via Stripe)
- [ ] PIPEDA compliance (Canada)
- [ ] Commercial General Liability insurance
- [ ] Cyber liability insurance
- [ ] DMCA/agent registration

### Success Metrics
- Zero regulatory violations
- Dispute resolution time < 48 hours
- Insurance coverage in place before launch

---

## Cross-Team Workflows

### Sprint Cycle (2 weeks)
```
Week 1:
Mon: Sprint planning (all leads)
Tue-Fri: Development & design execution

Week 2:
Mon-Thu: Continue execution, daily standups
Fri: Sprint review + retrospective
```

### Key Meetings
| Meeting | Frequency | Attendees | Purpose |
|---------|-----------|-----------|---------|
| All-Hands | Weekly | Everyone | Progress, blockers, wins |
| Leads Sync | Daily (15 min) | Team leads | Coordination |
| Design Review | Bi-weekly | Design + Eng + Product | Design approvals |
| Legal Review | Monthly | Legal + Product + Eng | Compliance check |

### Communication Channels
- **Slack/Discord:** Daily chat, #general, #engineering, #design, #business
- **Notion:** Documentation, specs, meeting notes
- **Figma:** Design collaboration
- **Linear/Jira:** Task tracking
- **Loom:** Async video updates

---

## MVP Timeline (12 Weeks)

```
Week  1-2:   Setup, team onboarding, architecture
Week  3-4:   Auth, basic listing flow
Week  5-6:   Bidding engine, payment integration
Week  7-8:   QR system, chat, notifications
Week  9-10:  Polish, testing, bug fixes
Week  11:    Beta launch (100 users)
Week  12:    Public launch (Halifax)
```

## Budget Estimate (MVP Phase)

| Category | Monthly | 3-Month Total |
|----------|---------|---------------|
| Engineering (4-6) | $25,000 | $75,000 |
| Design (2-3) | $10,000 | $30,000 |
| Marketing (2-3) | $8,000 | $24,000 |
| Business/Ops (2-3) | $8,000 | $24,000 |
| Legal/Compliance | $3,000 | $9,000 |
| Infrastructure | $1,000 | $3,000 |
| Marketing Spend | $5,000 | $15,000 |
| **TOTAL** | **$60,000** | **$180,000** |

---

## My Role as Project Manager (Carl)

I'll coordinate across all teams:

1. **Daily:** Check blockers, update sprint boards
2. **Weekly:** Compile progress reports, flag risks
3. **Bi-weekly:** Sprint planning & retrospectives
4. **Continuous:** Documentation, process optimization

### Tools I'll Manage
- Notion workspace (project hub)
- Sprint boards (Linear/Jira)
- Design system documentation
- Meeting notes & decisions log

---

*Document Owner: Carl 🎯*  
*Last Updated: 2026-02-18*
