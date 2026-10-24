# InteliPro — Sprint Plan (MVP)

**Duration:** 4 Sprints × 1 Week  
**Team:** 2 Developers (1 Full Stack, 1 Frontend)  
**Goal:** Deliver working hackathon demo

---

## Sprint 1 — Foundation (Week 1)

**Goal:** Authentication, navigation, and project scaffold working end-to-end.

| Story | Points | Status |
|-------|--------|--------|
| Set up Next.js 15 + TypeScript + Tailwind | 3 | ✅ Done |
| Configure Firebase Auth, Firestore, Storage | 3 | ✅ Done |
| Build authentication pages (Login, Register, Forgot Password) | 5 | ✅ Done |
| Implement auth context and protected routes | 3 | ✅ Done |
| Build sidebar navigation and topbar | 3 | ✅ Done |
| Define all TypeScript types and interfaces | 2 | ✅ Done |
| Create mock tender dataset (50 tenders) | 2 | ✅ Done |

**Sprint 1 Velocity:** 21 points

---

## Sprint 2 — Core Features (Week 2)

**Goal:** Dashboard and opportunities listing functional with mock data.

| Story | Points | Status |
|-------|--------|--------|
| Build Dashboard page with stat cards | 5 | ✅ Done |
| Build Opportunity Pipeline chart (Recharts) | 3 | ✅ Done |
| Build AI Insights feed widget | 3 | ✅ Done |
| Build Opportunities listing with search + filters | 8 | ✅ Done |
| Build Tender Detail page | 5 | ✅ Done |
| Create Tender API route with filtering | 3 | ✅ Done |
| Build Company Profile form | 5 | ✅ Done |

**Sprint 2 Velocity:** 32 points

---

## Sprint 3 — AI Agents (Week 3)

**Goal:** AI agents implemented and integrated into tender detail view.

| Story | Points | Status |
|-------|--------|--------|
| Build Opportunity Matching Agent (Agent 2) | 8 | ✅ Done |
| Build Tender Intelligence Agent (Agent 3) | 8 | ✅ Done |
| Build Bid Readiness Agent (Agent 4) | 8 | ✅ Done |
| Wire AI agents into Tender Detail tabs | 5 | ✅ Done |
| Build Match score visualisation (score ring) | 3 | ✅ Done |
| Implement AI agent API routes (/match, /analyze, /assess) | 3 | ✅ Done |

**Sprint 3 Velocity:** 35 points

---

## Sprint 4 — Completion & Polish (Week 4)

**Goal:** All pages complete, documents repository working, AI control page, notifications.

| Story | Points | Status |
|-------|--------|--------|
| Build Document Repository page with upload simulation | 8 | ✅ Done |
| Build AI Control Center with agent toggles and mode selection | 8 | ✅ Done |
| Build Notifications page | 5 | ✅ Done |
| Build Audit Logs view | 3 | ✅ Done |
| Write all documentation (PRD, Architecture, DB Design, etc.) | 5 | ✅ Done |
| Deploy to Vercel | 2 | ⬜ Pending |
| Final QA and bug fixes | 3 | ⬜ Pending |

**Sprint 4 Velocity:** 34 points (estimated)

---

## MVP Backlog (Future Sprints)

| Feature | Priority | Sprint |
|---------|----------|--------|
| Firebase Firestore integration (replace mock data) | High | S5 |
| Firebase Storage integration (real file uploads) | High | S5 |
| Real-time notifications with Firestore listeners | High | S5 |
| OpenAI GPT-4o integration for AI agents | High | S6 |
| LangGraph agent orchestration | Medium | S6 |
| Approval workflow UI | Medium | S6 |
| Admin role and admin dashboard | Medium | S7 |
| Tender source webhook integrations | Low | S8 |
| Email notification delivery | Low | S8 |
| Proposal Generation Agent | Low | Phase 2 |
| Partner Matching Agent | Low | Phase 2 |
