# InteliPro — AI Procurement Intelligence Platform

> Discover, analyse, and prepare for tender opportunities using intelligent AI agents.

![InteliPro](https://img.shields.io/badge/InteliPro-MVP-0A2540?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![Firebase](https://img.shields.io/badge/Firebase-13-FFCA28?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)

---

## 🚀 What is InteliPro?

InteliPro is an AI-powered procurement intelligence platform that helps SMEs, contractors, suppliers, consultants, and subcontractors:

- **Discover** tender opportunities automatically
- **Understand** what tenders require using AI analysis
- **Determine** if they qualify using bid readiness scoring
- **Act** confidently on the right opportunities

---

## 🤖 AI Agents

| Agent | Role |
|-------|------|
| **Agent 0** — Governance | Manages AI modes, approvals, and audit logging |
| **Agent 1** — Discovery | Sources and categorises tender opportunities |
| **Agent 2** — Matching | Scores tenders against your company profile |
| **Agent 3** — Intelligence | Summarises requirements and identifies risks |
| **Agent 4** — Readiness | Assesses your bid readiness and document gaps |

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components:** Radix UI, custom ShadCN-style components
- **Charts:** Recharts
- **State:** TanStack Query + Zustand
- **Backend:** Next.js API Routes
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication
- **Storage:** Firebase Storage
- **AI:** LangGraph + OpenAI GPT-4o (extensible)
- **Deployment:** Vercel

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── (dashboard)/     # Protected pages
│   │   ├── dashboard/   # Main dashboard
│   │   ├── opportunities/ # Tender listing + detail
│   │   ├── profile/     # Company profile
│   │   ├── documents/   # Document repository
│   │   ├── ai-control/  # AI configuration
│   │   └── notifications/ # Notification centre
│   └── api/             # API routes
│       ├── tenders/     # Tender discovery
│       ├── match/       # Matching agent
│       ├── analyze/     # Intelligence agent
│       └── assess/      # Readiness agent
├── agents/              # AI agent logic
├── components/          # React components
├── data/                # Mock tender data
├── firebase/            # Firebase config
├── lib/                 # Utilities + auth context
├── services/            # Service layer
└── types/               # TypeScript types
```

---

## 🚦 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Firebase config values
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📄 Documentation

| Document | Location |
|----------|----------|
| Product Requirements | `docs/01-product-requirements.md` |
| Solution Architecture | `docs/02-solution-architecture.md` |
| Database Design | `docs/03-database-design.md` |
| Sprint Plan | `docs/04-sprint-plan.md` |
| Deployment Guide | `docs/05-deployment-guide.md` |
| Future Roadmap | `docs/06-future-roadmap.md` |

---

## 🎯 AI Modes

| Mode | Behaviour |
|------|-----------|
| **Supervised** | All AI recommendations require user approval |
| **Hybrid** | Low-risk actions auto, high-risk requires approval |
| **Autonomous** | AI acts automatically, all actions logged |

---

## 🏆 Hackathon Notes

This MVP was built for a hackathon demonstration. The AI agents use rule-based logic for the MVP. The architecture is designed for easy integration with OpenAI GPT-4o and LangGraph for production deployment.

**Demo flow:**
1. Register / login
2. View the dashboard — see stats, pipeline chart, AI insights
3. Browse opportunities — filter by province, industry, category
4. Open a tender → click "Run AI Analysis"
5. See the match score, executive summary, requirements, risks, and readiness score
6. Visit AI Control Center to toggle agents and switch modes

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Deploy to Vercel
npx vercel --prod
```

See `docs/05-deployment-guide.md` for full instructions.

---

## License

MIT © InteliPro 2026
