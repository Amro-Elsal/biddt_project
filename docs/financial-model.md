# Biddt Financial Model

## Assumptions

### User Growth
| Month | New Users | Total Users | MoM Growth |
|-------|-----------|-------------|------------|
| 1 | 500 | 500 | - |
| 2 | 750 | 1,250 | 50% |
| 3 | 1,000 | 2,250 | 33% |
| 6 | 2,500 | 8,000 | 25% |
| 12 | 5,000 | 35,000 | 15% |

### Transaction Metrics
| Metric | Value | Notes |
|--------|-------|-------|
| Avg Transaction Value | $150 | Based on user research |
| Transactions per User/Month | 2.5 | Active users |
| Take Rate (Commission) | 6% | Primary revenue |
| Escrow Fee | $1.99 | Per transaction |
| Payment Processing | 2.9% + $0.30 | Stripe fees |

### Unit Economics
| Metric | Value |
|--------|-------|
| CAC (Customer Acquisition Cost) | $15 |
| LTV (Lifetime Value) | $180 |
| LTV/CAC Ratio | 12:1 |
| Payback Period | 3 months |
| Monthly Churn | 5% |

---

## Revenue Model (12 Months)

### Monthly Revenue Breakdown

| Month | Users | Active | Transactions | GMV | Commission | Escrow Fees | Total Revenue |
|-------|-------|--------|--------------|-----|------------|-------------|---------------|
| 1 | 500 | 250 | 625 | $93,750 | $5,625 | $1,244 | $6,869 |
| 2 | 1,250 | 625 | 1,563 | $234,375 | $14,063 | $3,110 | $17,173 |
| 3 | 2,250 | 1,125 | 2,813 | $421,875 | $25,313 | $5,598 | $30,911 |
| 4 | 3,500 | 1,750 | 4,375 | $656,250 | $39,375 | $8,706 | $48,081 |
| 5 | 5,000 | 2,500 | 6,250 | $937,500 | $56,250 | $12,438 | $68,688 |
| 6 | 8,000 | 4,000 | 10,000 | $1,500,000 | $90,000 | $19,900 | $109,900 |
| 7 | 11,000 | 5,500 | 13,750 | $2,062,500 | $123,750 | $27,363 | $151,113 |
| 8 | 14,500 | 7,250 | 18,125 | $2,718,750 | $163,125 | $36,069 | $199,194 |
| 9 | 18,500 | 9,250 | 23,125 | $3,468,750 | $208,125 | $45,819 | $253,944 |
| 10 | 23,000 | 11,500 | 28,750 | $4,312,500 | $258,750 | $57,213 | $315,963 |
| 11 | 28,000 | 14,000 | 35,000 | $5,250,000 | $315,000 | $69,650 | $384,650 |
| 12 | 35,000 | 17,500 | 43,750 | $6,562,500 | $393,750 | $87,063 | $480,813 |

**Year 1 Total:**
- Users: 35,000
- GMV: $28,218,750
- Revenue: $2,066,299

---

## Operating Expenses (12 Months)

### Team Costs

| Role | Month 1-3 | Month 4-6 | Month 7-12 |
|------|-----------|-----------|------------|
| CTO | $12,500 | $12,500 | $13,500 |
| iOS Dev | $10,000 | $10,000 | $10,500 |
| Android Dev | $10,000 | $10,000 | $10,500 |
| Backend Dev | $10,000 | $10,000 | $10,500 |
| Product Designer | $8,000 | $8,000 | $8,500 |
| Growth Marketer | $7,000 | $7,000 | $7,500 |
| BD Manager | $6,000 | $6,000 | $6,500 |
| Legal (part-time) | $3,000 | $3,000 | $3,000 |
| **Total Team** | **$66,500** | **$66,500** | **$70,500** |

### Operating Costs

| Category | Monthly | Notes |
|----------|---------|-------|
| Infrastructure | $1,000 | AWS, scaling with usage |
| Software/Tools | $500 | GitHub, Figma, Linear, etc. |
| Office/Remote | $1,000 | Coworking, equipment |
| Legal/Compliance | $500 | Ongoing counsel |
| Insurance | $800 | CGL, Cyber liability |
| Misc | $700 | Contingency |
| **Total Ops** | **$4,500** | |

### Marketing Spend

| Month | Paid Ads | Content | Events | Total |
|-------|----------|---------|--------|-------|
| 1-2 | $2,000 | $500 | $0 | $2,500 |
| 3-4 | $3,000 | $1,000 | $500 | $4,500 |
| 5-6 | $4,000 | $1,500 | $1,000 | $6,500 |
| 7-12 | $5,000 | $2,000 | $1,500 | $8,500 |

### Total Monthly Burn

| Month | Team | Ops | Marketing | Total Burn |
|-------|------|-----|-----------|------------|
| 1 | $66,500 | $4,500 | $2,500 | $73,500 |
| 3 | $66,500 | $4,500 | $4,500 | $75,500 |
| 6 | $66,500 | $5,000 | $6,500 | $78,000 |
| 12 | $70,500 | $6,000 | $8,500 | $85,000 |

---

## P&L Summary (12 Months)

| Month | Revenue | Burn | Net Income | Cumulative |
|-------|---------|------|------------|------------|
| 1 | $6,869 | $73,500 | -$66,631 | -$66,631 |
| 2 | $17,173 | $73,500 | -$56,327 | -$122,958 |
| 3 | $30,911 | $75,500 | -$44,589 | -$167,547 |
| 4 | $48,081 | $77,000 | -$28,919 | -$196,466 |
| 5 | $68,688 | $77,000 | -$8,312 | -$204,778 |
| 6 | $109,900 | $78,000 | $31,900 | -$172,878 |
| 7 | $151,113 | $81,000 | $70,113 | -$102,765 |
| 8 | $199,194 | $81,000 | $118,194 | $15,429 |
| 9 | $253,944 | $83,000 | $170,944 | $186,373 |
| 10 | $315,963 | $83,000 | $232,963 | $419,336 |
| 11 | $384,650 | $84,000 | $300,650 | $719,986 |
| 12 | $480,813 | $85,000 | $395,813 | $1,115,799 |

**Year 1:**
- Total Revenue: $2,066,299
- Total Burn: $970,500
- **Net Income: $1,095,799**
- **Break-even: Month 8**

---

## 3-Year Projection

### Year 2 (Expansion to 5 Cities)

| Metric | Value |
|--------|-------|
| Users (end) | 150,000 |
| Active Users | 75,000 |
| Monthly Transactions | 187,500 |
| Annual GMV | $337,500,000 |
| Revenue | $22,500,000 |
| Team Size | 25 |
| Net Income | $8,000,000 |

### Year 3 (20 Cities)

| Metric | Value |
|--------|-------|
| Users (end) | 500,000 |
| Active Users | 250,000 |
| Monthly Transactions | 625,000 |
| Annual GMV | $1,125,000,000 |
| Revenue | $75,000,000 |
| Team Size | 60 |
| Net Income | $25,000,000 |

---

## Funding Requirements

### Seed Round: $500K

**Use of Funds:**
| Category | Amount | % |
|----------|--------|---|
| Engineering | $210,000 | 42% |
| Design | $85,000 | 17% |
| Marketing | $65,000 | 13% |
| Operations | $65,000 | 13% |
| Marketing Spend | $40,000 | 8% |
| Legal/Compliance | $20,000 | 4% |
| Buffer | $15,000 | 3% |

**Runway:** 12 months

**Milestones:**
- Month 3: 2,250 users, product-market fit signals
- Month 6: 8,000 users, Halifax market leader
- Month 12: 35,000 users, profitable, ready for Series A

### Series A: $3-5M (Month 12)

**Use of Funds:**
- Expand to 5 new cities
- Build out team (25 people)
- Marketing scale
- Product expansion (shipping, categories)

---

## Sensitivity Analysis

### Best Case (2x Growth)
- Users: 70,000 by month 12
- Revenue: $960K
- Still profitable by month 10

### Base Case (As Planned)
- Users: 35,000 by month 12
- Revenue: $480K
- Profitable by month 8

### Worst Case (0.5x Growth)
- Users: 17,500 by month 12
- Revenue: $240K
- Extend runway: Reduce burn to $50K/month
- Profitable by month 12

---

## Key Metrics Dashboard

### Weekly Tracking
- New user signups
- Daily active users (DAU)
- Listings created
- Bids placed
- Transactions completed
- Support tickets

### Monthly Tracking
- CAC by channel
- LTV cohorts
- Churn rate
- Net Revenue Retention
- GMV per user
- Take rate realization

---

*Financial Model Owner: Carl / CFO 🎯*
