# InteliPro — Product Requirements Document (PRD)

**Version:** 1.0 MVP  
**Date:** October 2026  
**Classification:** Internal / Hackathon Submission

---

## 1. Executive Summary

InteliPro is an AI-powered procurement intelligence platform designed for SMEs, contractors, suppliers, consultants, and subcontractors. It automates the discovery, analysis, and bid readiness assessment of tender opportunities using a suite of intelligent AI agents built on LangGraph.

The platform eliminates manual tender hunting, reduces interpretation errors, and enables data-driven bid decisions — all from a single enterprise-grade web application.

---

## 2. Problem Statement

South African and regional businesses lose valuable procurement opportunities due to:

- Tender listings scattered across dozens of portals (eTenders, CIDB, municipal sites, etc.)
- Time-intensive manual monitoring and tracking
- Technical jargon and complex specifications that are hard to interpret
- Uncertainty about whether a business qualifies for a specific tender
- Missing critical documentation requirements discovered too late
- High cost of procurement consultants for bid preparation

InteliPro solves these problems with five AI agents that work together to automate the entire tender discovery-to-bid-readiness lifecycle.

---

## 3. Target Users

| Role | Description |
|------|-------------|
| SME Owner | Needs tender discovery without dedicated procurement staff |
| Contractor | Tracks construction / infrastructure bids |
| Supplier | Monitors supply contracts relevant to their commodity |
| Consultant | Manages multiple client opportunities |
| Subcontractor | Finds sub-work opportunities aligned to prime contracts |

---

## 4. MVP Objectives

The MVP must enable users to:

1. Register and log in securely via Firebase Authentication
2. Create a detailed company profile (industry, services, province, certifications)
3. Upload and manage compliance documents
4. View sourced tender opportunities from mock + extensible data sources
5. See AI-generated opportunity match scores and explanations
6. View AI-generated tender summaries and requirement extractions
7. View bid-readiness assessments with gap analysis
8. Configure AI supervision mode (Supervised / Hybrid / Autonomous)
9. Receive and manage notifications

---

## 5. Key Features

### 5.1 Authentication
- Email/password registration and login
- Forgot password flow
- Protected route middleware
- Role assignment on registration (Business User / Administrator)

### 5.2 Company Profile
- Business name, registration number, tax number
- Industry classification, service categories
- Province and operating regions
- BBBEE level, CIDB grade, business type
- Company description

### 5.3 Document Repository
- Upload documents with type classification
- Firebase Storage backend
- Version tracking (upload date, expiry date)
- Document status: valid / expiring / expired
- Delete and re-upload capabilities

### 5.4 Tender Discovery
- Mock tender dataset (50+ records) with realistic South African procurement data
- Filters: province, industry, category, closing date range
- Search by keyword
- Sort by date, match score, value
- Pagination

### 5.5 Opportunity Matching
- Match score calculation (0–100%) based on:
  - Industry alignment
  - Service category overlap
  - Province match
  - Business type eligibility
- Human-readable match reasons
- Confidence indicator

### 5.6 Tender Intelligence
- AI-generated executive summary
- Requirements extraction
- Required documents checklist
- Key dates timeline
- Risk flags

### 5.7 Bid Readiness
- Readiness score (0–100%)
- Gap analysis: available vs missing documents
- Actionable recommendations
- Document expiry warnings

### 5.8 AI Control Center
- Toggle individual agents on/off
- Select AI supervision mode
- View real-time agent activity log
- View audit history with decision records

### 5.9 Notifications
- Match alert notifications
- Opportunity closing reminders
- Document expiry alerts
- System notifications

---

## 6. User Stories

### Authentication
- As a new user, I can register with my email and password so that I can access the platform
- As a registered user, I can log in so that I can access my dashboard
- As a forgetful user, I can reset my password so that I can regain access

### Profile
- As a business user, I can create my company profile so that AI agents can match me to relevant tenders
- As a business user, I can update my profile at any time so that my matching stays accurate

### Documents
- As a business user, I can upload compliance documents so that my bid readiness can be assessed
- As a business user, I can see which documents are expiring so that I can renew them in time

### Opportunities
- As a business user, I can view all available tenders so that I can discover new opportunities
- As a business user, I can filter and search tenders so that I find only relevant ones
- As a business user, I can view a tender detail with AI analysis so that I understand what is required

### AI Agents
- As a business user, I can configure the AI mode so that I control how autonomous the system is
- As a business user, I can view the AI audit log so that I understand what decisions were made

### Notifications
- As a business user, I receive alerts about high-match tenders so that I never miss an opportunity
- As a business user, I receive closing deadline reminders so that I have time to prepare

---

## 7. Acceptance Criteria

| Feature | Criteria |
|---------|----------|
| Authentication | Login/register works; protected routes redirect unauthenticated users |
| Dashboard | Loads within 3 seconds; shows all 5 metric cards and 4 widgets |
| Opportunity Listing | Returns filtered results within 2 seconds; pagination works |
| Tender Detail | Displays AI summary, requirements, risks, readiness score |
| Company Profile | Saves to Firestore; used in matching calculations |
| Documents | Upload to Firebase Storage; metadata saved to Firestore |
| AI Control | Mode selection persists; agent toggles save to Firestore |
| Notifications | New notifications appear in bell icon with unread count |

---

## 8. Out of Scope (MVP)

- Proposal Generation Agent
- Partner Matching Agent
- Outreach Agent
- Funding Discovery Agent
- Compliance Monitoring Agent
- Market Intelligence Agent
- Win Probability Agent
- Payment / subscription billing
- Multi-language support
- Mobile native app
