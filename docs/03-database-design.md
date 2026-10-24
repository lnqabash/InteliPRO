# InteliPro — Database Design

**Version:** 1.0 MVP  
**Database:** Firebase Cloud Firestore (NoSQL)

---

## 1. Firestore Collections Structure

```
firestore/
├── users/                        {uid}
├── organizations/                {orgId}
├── businessProfiles/             {orgId}
├── tenders/                      {tenderId}
├── tenderMatches/                {matchId}
├── tenderAnalyses/               {analysisId}
├── bidAssessments/               {assessmentId}
├── complianceDocuments/          {docId}
├── notifications/                {notificationId}
├── approvals/                    {approvalId}
├── auditLogs/                    {logId}
└── agentConfigurations/          {orgId}
```

---

## 2. Collection Schemas

### 2.1 users

```typescript
{
  uid: string;                    // Firebase Auth UID (document ID)
  email: string;
  displayName: string;
  role: 'business_user' | 'administrator';
  organizationId: string;         // Reference to organizations
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  photoURL?: string;
}
```

### 2.2 organizations

```typescript
{
  id: string;                     // Auto-generated (document ID)
  name: string;
  registrationNumber: string;
  taxNumber: string;
  ownerId: string;                // Reference to users
  memberIds: string[];            // Array of user UIDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
}
```

### 2.3 businessProfiles

```typescript
{
  id: string;                     // Same as organizationId (document ID)
  organizationId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber: string;
  vatNumber?: string;
  
  // Classification
  industry: string;               // e.g., "Construction"
  industries: string[];           // All applicable industries
  serviceCategories: string[];    // e.g., ["Civil Engineering", "Plumbing"]
  businessType: 'sole_proprietor' | 'pty_ltd' | 'cc' | 'partnership' | 'npo' | 'cooperative';
  
  // Certifications
  bbbeeLevel: number | null;      // 1-8
  cidbGrade: string | null;       // e.g., "5CE"
  cidbDesignation: string | null;
  
  // Location
  province: string;
  city: string;
  operatingProvinces: string[];
  address: string;
  
  // Details
  description: string;
  yearEstablished: number;
  numberOfEmployees: string;      // range e.g., "1-10"
  annualTurnover: string;         // range e.g., "< R1M"
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
  profileCompleteness: number;    // 0-100%
}
```

### 2.4 tenders

```typescript
{
  id: string;                     // Auto-generated (document ID)
  tenderId: string;               // External tender reference number
  title: string;
  description: string;
  
  // Classification
  category: string;               // e.g., "Infrastructure"
  subCategory: string;
  industry: string;
  serviceType: string;
  
  // Location
  province: string;
  municipality?: string;
  
  // Issuer
  organization: string;           // Procuring entity name
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  
  // Dates
  publishedDate: Timestamp;
  closingDate: Timestamp;
  briefingDate?: Timestamp;
  awardDate?: Timestamp;
  
  // Value
  estimatedValue?: number;
  currency: string;               // "ZAR"
  
  // Source
  source: 'etenders' | 'cidb' | 'municipal' | 'mock' | 'manual';
  sourceUrl?: string;
  
  // Requirements
  requiredBbbeeLevel?: number;
  requiredCidbGrade?: string;
  requiredDocuments: string[];
  
  // Status
  status: 'open' | 'closed' | 'awarded' | 'cancelled';
  
  // AI metadata
  aiCategorized: boolean;
  tags: string[];
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.5 tenderMatches

```typescript
{
  id: string;                     // Auto-generated (document ID)
  tenderId: string;               // Reference to tenders
  organizationId: string;         // Reference to organizations
  
  // Scores
  matchScore: number;             // 0-100
  industryScore: number;
  serviceScore: number;
  provinceScore: number;
  certificationScore: number;
  
  // Analysis
  matchReasons: {
    factor: string;
    score: number;
    explanation: string;
  }[];
  
  recommendation: 'highly_recommended' | 'recommended' | 'possible' | 'not_recommended';
  confidence: 'high' | 'medium' | 'low';
  
  // Status
  status: 'pending_review' | 'approved' | 'dismissed' | 'applied';
  agentMode: 'supervised' | 'hybrid' | 'autonomous';
  requiresApproval: boolean;
  
  // Agent metadata
  agentId: string;
  agentVersion: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.6 tenderAnalyses

```typescript
{
  id: string;
  tenderId: string;
  organizationId: string;
  
  // AI-generated content
  executiveSummary: string;
  
  requirements: {
    id: string;
    requirement: string;
    mandatory: boolean;
    category: string;
  }[];
  
  requiredDocuments: {
    document: string;
    mandatory: boolean;
    notes?: string;
  }[];
  
  keyDates: {
    event: string;
    date: Timestamp;
    critical: boolean;
  }[];
  
  risks: {
    id: string;
    risk: string;
    severity: 'high' | 'medium' | 'low';
    mitigation?: string;
  }[];
  
  eligibilityCriteria: string[];
  evaluationCriteria: {
    criterion: string;
    weight: number;
  }[];
  
  // Metadata
  modelUsed: string;
  tokensUsed: number;
  agentId: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.7 bidAssessments

```typescript
{
  id: string;
  tenderId: string;
  organizationId: string;
  
  // Score
  readinessScore: number;         // 0-100
  
  // Document analysis
  availableDocuments: {
    documentType: string;
    documentId: string;
    status: 'valid' | 'expiring' | 'expired';
  }[];
  
  missingDocuments: {
    documentType: string;
    mandatory: boolean;
    impact: 'disqualifying' | 'scoring' | 'minor';
    recommendation: string;
  }[];
  
  // Qualification
  meetsEligibility: boolean;
  eligibilityGaps: string[];
  
  // Recommendations
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    deadline?: string;
  }[];
  
  // Status
  agentMode: string;
  requiresApproval: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.8 complianceDocuments

```typescript
{
  id: string;
  organizationId: string;
  
  // Document info
  documentType: 'company_registration' | 'tax_clearance' | 'bbbee_certificate' | 
                'cidb_certificate' | 'company_profile' | 'financial_statements' | 'other';
  documentName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  
  // Storage
  storagePath: string;            // Firebase Storage path
  downloadUrl: string;
  
  // Validity
  issueDate?: Timestamp;
  expiryDate?: Timestamp;
  status: 'valid' | 'expiring' | 'expired' | 'pending_verification';
  
  // Metadata
  version: number;
  uploadedBy: string;             // User UID
  notes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.9 notifications

```typescript
{
  id: string;
  userId: string;
  organizationId: string;
  
  type: 'match_alert' | 'opportunity_alert' | 'closing_reminder' | 
        'document_expiry' | 'system' | 'approval_required';
  
  title: string;
  message: string;
  
  // Related entity
  entityType?: 'tender' | 'document' | 'assessment';
  entityId?: string;
  
  // Status
  isRead: boolean;
  readAt?: Timestamp;
  
  // Priority
  priority: 'high' | 'medium' | 'low';
  
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}
```

### 2.10 approvals

```typescript
{
  id: string;
  organizationId: string;
  requestedBy: string;            // Agent ID
  
  // Action being approved
  actionType: 'send_match_alert' | 'run_assessment' | 'update_profile' | 'send_notification';
  actionData: Record<string, unknown>;
  
  // Related entity
  entityType: string;
  entityId: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;            // User UID
  reviewedAt?: Timestamp;
  reviewNotes?: string;
  
  // Priority
  priority: 'high' | 'medium' | 'low';
  
  createdAt: Timestamp;
  expiresAt: Timestamp;
}
```

### 2.11 auditLogs

```typescript
{
  id: string;
  organizationId: string;
  
  // Action
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  
  // Context
  entityType: string;
  entityId: string;
  
  // Decision
  decision: string;
  confidence?: number;
  reasoning?: string;
  
  // Mode
  agentMode: 'supervised' | 'hybrid' | 'autonomous';
  requiresApproval: boolean;
  
  // User context
  userId?: string;
  
  // Metadata
  modelUsed?: string;
  tokensUsed?: number;
  durationMs?: number;
  
  createdAt: Timestamp;
}
```

### 2.12 agentConfigurations

```typescript
{
  id: string;                     // Same as organizationId (document ID)
  organizationId: string;
  
  // Global mode
  globalMode: 'supervised' | 'hybrid' | 'autonomous';
  
  // Per-agent toggles
  agents: {
    agent0_governance: { enabled: boolean; mode?: string };
    agent1_discovery: { enabled: boolean; mode?: string };
    agent2_matching: { enabled: boolean; mode?: string };
    agent3_intelligence: { enabled: boolean; mode?: string };
    agent4_readiness: { enabled: boolean; mode?: string };
  };
  
  // Notification preferences
  notifications: {
    matchAlerts: boolean;
    closingReminders: boolean;
    documentExpiry: boolean;
    minMatchScore: number;         // Minimum score to trigger alert (0-100)
    reminderDaysBefore: number;    // Days before closing to remind
  };
  
  updatedAt: Timestamp;
  updatedBy: string;
}
```

---

## 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organization members can read; only owner can write
    match /organizations/{orgId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.memberIds;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Organization members can read/write their org's data
    match /businessProfiles/{orgId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/organizations/$(orgId)) &&
        request.auth.uid in get(/databases/$(database)/documents/organizations/$(orgId)).data.memberIds;
    }
    
    // Tenders are publicly readable (by authenticated users)
    match /tenders/{tenderId} {
      allow read: if request.auth != null;
      allow write: if false; // Only written by server-side agents
    }
    
    // Matches, analyses, assessments scoped to organization
    match /tenderMatches/{matchId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/organizations/$(resource.data.organizationId)).data.memberIds;
    }
    
    // Notifications scoped to user
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Agent configurations scoped to organization
    match /agentConfigurations/{orgId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/organizations/$(orgId)) &&
        request.auth.uid in get(/databases/$(database)/documents/organizations/$(orgId)).data.memberIds;
    }
  }
}
```

---

## 4. Composite Indexes Required

```
tenders: [province ASC, closingDate ASC]
tenders: [industry ASC, status ASC, closingDate ASC]
tenders: [category ASC, status ASC]
tenderMatches: [organizationId ASC, matchScore DESC]
tenderMatches: [organizationId ASC, createdAt DESC]
notifications: [userId ASC, isRead ASC, createdAt DESC]
auditLogs: [organizationId ASC, createdAt DESC]
complianceDocuments: [organizationId ASC, documentType ASC]
```
