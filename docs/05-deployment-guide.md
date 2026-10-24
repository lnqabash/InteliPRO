# InteliPro — Deployment Guide

**Platform:** Vercel  
**Database:** Firebase Cloud Firestore  
**Auth:** Firebase Authentication  
**Storage:** Firebase Storage

---

## 1. Prerequisites

- Node.js 20+ installed
- Firebase project created at console.firebase.google.com
- Vercel account at vercel.com
- Git repository (GitHub / GitLab)

---

## 2. Firebase Setup

### 2.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `intelipro`
3. Enable Google Analytics (optional)

### 2.2 Enable Authentication

1. In Firebase Console → Authentication → Get started
2. Enable **Email/Password** provider

### 2.3 Create Firestore Database

1. Firestore Database → Create database
2. Start in **production mode**
3. Choose region: `africa-south1` (recommended) or `europe-west3`
4. Apply the security rules from `docs/03-database-design.md`

### 2.4 Enable Storage

1. Storage → Get started
2. Accept default rules (update to secure rules later)

### 2.5 Get Firebase Config

1. Project Settings → Your apps → Web app → Add app
2. Copy the `firebaseConfig` object
3. You'll use these values as environment variables

---

## 3. Environment Variables

### 3.1 Local Development

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=intelipro.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=intelipro
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=intelipro.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

OPENAI_API_KEY=sk-...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.2 Production (Vercel)

Add the same variables in Vercel → Project Settings → Environment Variables.

---

## 4. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd intelipro

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 5. Vercel Deployment

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set environment variables
```

### Option B: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Set environment variables (from step 3.2)
5. Click **Deploy**

Vercel will automatically redeploy on every push to `main`.

---

## 6. Post-Deployment Steps

### 6.1 Update Firebase Auth Domain

In Firebase Console → Authentication → Settings → Authorised domains:
- Add your Vercel deployment URL (e.g., `intelipro.vercel.app`)

### 6.2 Update CORS for Storage

In Firebase Storage → Rules, ensure your domain is allowed.

### 6.3 Create Firestore Composite Indexes

Run these manually in Firebase Console → Firestore → Indexes:

```
tenders: province ASC, closingDate ASC
tenders: industry ASC, status ASC, closingDate ASC
tenderMatches: organizationId ASC, matchScore DESC
notifications: userId ASC, isRead ASC, createdAt DESC
```

---

## 7. Verify Deployment

After deployment, test:

- [ ] Registration with new email
- [ ] Login with registered email
- [ ] Dashboard loads within 3 seconds
- [ ] Opportunities listing shows 12 mock tenders
- [ ] Tender detail page loads
- [ ] AI Analysis runs successfully
- [ ] Profile form submits
- [ ] Document upload simulation works
- [ ] AI Control Center saves settings
- [ ] Notifications load correctly

---

## 8. Custom Domain (Optional)

In Vercel → Project → Domains:
1. Add your domain (e.g., `app.intelipro.co.za`)
2. Update DNS records as instructed
3. Add domain to Firebase Auth authorised list

---

## 9. Monitoring

- **Performance:** Vercel Analytics (enabled by default)
- **Errors:** Vercel Functions logs
- **Database:** Firebase Console → Firestore → Usage

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Firebase auth error | Check `.env.local` values match Firebase console |
| Build fails | Run `npm run build` locally first |
| Page not found after login | Check middleware.ts route config |
| Firestore permission denied | Check security rules in Firebase Console |
