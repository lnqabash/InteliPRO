# InteliPro — Solution Architecture

**Version:** 1.0 MVP

---

## 1. Architecture Overview

InteliPro uses a **serverless, cloud-native architecture** built on Next.js 15 with Firebase as the backend platform and LangGraph for AI agent orchestration.

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
│  Next.js 15 App Router + React + Tailwind + ShadCN UI   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────┐
│                   NEXT.JS SERVER                        │
│         API Routes (/api/*)  +  Server Components       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ Auth API │  │Tender API│  │ Agent API│  │ Doc API│  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└──────┬──────────────┬───────────────┬──────────────┬───┘
       │              │               │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐ ┌────▼────┐
│  Firebase   │ │  Firebase  │ │  LangGraph │ │Firebase │
│    Auth     │ │  Firestore │ │  AI Agents │ │ Storage │
└─────────────┘ └────────────┘ └─────────────┘ └─────────┘
                                       │
                              ┌────────▼────────┐
                              │   OpenAI API    │
                              │ GPT-4o / Mini   │
                              └─────────────────┘
```

---

## 2. Layer Descriptions

### 2.1 Presentation Layer (Client)

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + ShadCN UI components
- **State Management:** Zustand (global) + TanStack Query (server state)
- **Charts:** Recharts
- **Icons:** Lucide React

### 2.2 Application Layer (API Routes)

Next.js API Routes handle:
- Firebase Auth token validation
- Firestore CRUD operations
- LangGraph agent invocation
- Firebase Storage signed URL generation

### 2.3 Data Layer (Firebase)

| Service | Purpose |
|---------|---------|
| Firebase Auth | User authentication and session management |
| Cloud Firestore | NoSQL document database for all application data |
| Firebase Storage | File storage for compliance documents |

### 2.4 AI Layer (LangGraph)

Five agents orchestrated via LangGraph state machines:
- **Agent 0:** Governance & Approval Agent
- **Agent 1:** Tender Discovery Agent
- **Agent 2:** Opportunity Matching Agent
- **Agent 3:** Tender Intelligence Agent
- **Agent 4:** Bid Readiness Agent

---

## 3. Component Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group
│   ├── (dashboard)/              # Protected route group
│   └── api/                      # API routes
├── components/
│   ├── ui/                       # ShadCN base components
│   ├── layout/                   # Layout components
│   └── shared/                   # Reusable business components
├── features/                     # Feature-based modules
│   ├── auth/
│   ├── dashboard/
│   ├── opportunities/
│   ├── profile/
│   ├── documents/
│   ├── ai-control/
│   └── notifications/
├── agents/                       # LangGraph AI agents
├── services/                     # Service layer (Firebase ops)
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── firebase/                     # Firebase config & utils
├── lib/                          # Utilities and helpers
└── data/                         # Mock data
```

---

## 4. Security Architecture

### Authentication Flow
1. User submits credentials → Firebase Auth
2. Firebase returns JWT token
3. Token stored in secure cookie / memory
4. All API routes validate token via Firebase Admin SDK
5. Firestore Security Rules enforce data access by UID

### Route Protection
- Next.js middleware checks auth state on every protected route
- Unauthenticated users redirected to `/login`
- Admin routes check custom claims for role

### Data Security
- Firestore rules: users can only read/write their own organization's data
- Storage rules: files accessible only to organization members
- API routes: server-side token verification on every request

---

## 5. Performance Strategy

| Target | Mechanism |
|--------|-----------|
| Dashboard < 3s | Server Components + TanStack Query caching |
| Search < 2s | Firestore composite indexes + client-side filtering |
| Document uploads | Firebase Storage direct upload with progress |
| AI responses | Streaming responses for long operations |

---

## 6. Deployment Architecture

```
GitHub Repository
       │
       ▼
   Vercel CI/CD
       │
  ┌────▼────┐
  │  Edge   │  ← Static assets, middleware
  │ Network │
  └────┬────┘
       │
  ┌────▼────────┐
  │ Next.js     │  ← API Routes (Serverless Functions)
  │ Serverless  │
  └─────────────┘
       │
  Firebase (GCP)
```

---

## 7. Scalability Considerations

- Firestore scales automatically with read/write volume
- Next.js API routes are stateless serverless functions
- LangGraph agents are invoked per-request (horizontally scalable)
- Future: migrate to dedicated Node.js backend for high-volume agent workloads
- Future: add Redis caching layer for tender data
- Future: implement webhook-based tender source integrations
