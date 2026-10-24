# InteliPro — Future Roadmap

**Version:** Post-MVP  
**Classification:** Strategic Planning

---

## Phase 1: MVP (Current)

**Status:** ✅ Complete

- Authentication & user management
- Company profile management
- Document repository (simulated upload)
- Mock tender discovery (12 tenders)
- AI matching agent (rule-based)
- AI intelligence agent (rule-based)
- AI bid readiness agent (rule-based)
- Supervised / Hybrid / Autonomous modes
- Notifications (client-side)
- AI Control Center

---

## Phase 2: Production Foundation (3-6 months)

**Goal:** Real data, real AI, real users

### 2.1 Live Data Integration
- Connect to eTenders Public Procurement Portal API
- Integrate CIDB procurement portal scraper
- Connect to provincial government portals
- Implement deduplication pipeline
- Auto-refresh tenders every 6 hours

### 2.2 OpenAI Integration
- Replace rule-based agents with GPT-4o
- LangGraph agent orchestration
- Streaming AI responses in UI
- Token usage tracking and cost management

### 2.3 Firebase Full Integration
- Replace mock data with Firestore reads/writes
- Real Firebase Storage for document uploads
- Real-time notifications with Firestore listeners
- Approval workflow with Firestore updates

### 2.4 New Agents
- **Proposal Generation Agent:** Draft bid documents based on tender requirements and company profile
- **Outreach Agent:** Identify and contact relevant procurement officers

### 2.5 Infrastructure
- Vercel Edge Functions for low-latency agent responses
- Redis caching for frequently accessed tender data
- Queue system (BullMQ) for agent job processing

---

## Phase 3: Growth (6-12 months)

**Goal:** Platform capabilities and network effects

### 3.1 Partner Matching Agent
- Find subcontractors and consortia partners
- Match based on CIDB grade, geography, and service
- Partnership request workflow

### 3.2 Funding Agent
- Discover SEDA, IDC, NEF funding aligned to tenders
- Match funding criteria to business profile
- Application deadline tracking

### 3.3 Compliance Agent
- Monitor certification expiry dates
- Alert 60/30/7 days before expiry
- Suggest renewal providers
- Automated CIPC annual return reminders

### 3.4 Market Intelligence Agent
- Industry spend analysis by province
- Competitor win rate tracking
- Tender award history analytics
- Market sizing per sector

### 3.5 Win Probability Agent
- Historical win rate analysis
- Competitor intelligence
- Probability score per tender
- Bid/no-bid recommendation

---

## Phase 4: Enterprise (12-24 months)

**Goal:** Enterprise-grade platform with advanced analytics

### 4.1 Enterprise Features
- Multi-user organisation management
- Role-based access control (RBAC)
- Team collaboration on bids
- Approval chain management
- SSO integration (SAML, Azure AD)

### 4.2 Advanced Analytics
- Portfolio management dashboard
- Win/loss analysis
- Pipeline forecasting
- ROI tracking per tender

### 4.3 Platform Integrations
- ERP integration (SAP, Sage)
- CRM integration (Salesforce, HubSpot)
- Document signing (DocuSign, AdobeSign)
- Accounting software (QuickBooks, Xero)

### 4.4 API Platform
- Public REST API for partner integrations
- Webhook support for custom workflows
- SDK libraries (Python, Node.js)
- Developer portal

### 4.5 Mobile App
- React Native mobile application
- Push notifications
- Document scanning (ID, certificates)
- Offline mode

---

## Phase 5: Ecosystem (24+ months)

**Goal:** Become the procurement intelligence marketplace for Africa

### 5.1 Geographic Expansion
- SADC regional tender portals (Zimbabwe, Zambia, Botswana)
- East Africa (Kenya, Tanzania, Uganda)
- West Africa (Nigeria, Ghana)

### 5.2 Marketplace Features
- Verified supplier directory
- Tender syndication network
- Joint venture formation platform
- Procurement consulting marketplace

### 5.3 AI Research
- Fine-tuned procurement LLM
- Custom embeddings for South African procurement context
- Automated proposal scoring
- Predictive award timing model

---

## Technology Evolution

| Current (MVP) | Phase 2 | Phase 4 |
|---------------|---------|---------|
| Next.js + Firebase | Next.js + Firebase + OpenAI | Microservices + PostgreSQL |
| Rule-based agents | LangGraph + GPT-4o | Custom fine-tuned models |
| Mock data | Live API integrations | Real-time data platform |
| Single user | Multi-user orgs | Enterprise with SSO |
| Vercel hobby | Vercel Pro | GCP/AWS enterprise |

---

## Revenue Model (Future)

| Tier | Features | Price |
|------|----------|-------|
| Free | 5 tenders/month, basic matching | R0/month |
| Pro | Unlimited tenders, all AI agents, 3 users | R499/month |
| Business | Everything + proposals, 10 users, API | R1,499/month |
| Enterprise | Custom integration, SLA, unlimited users | Custom |
