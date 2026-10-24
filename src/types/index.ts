import { Timestamp } from 'firebase/firestore';

// =============================================
// USER & ORGANIZATION
// =============================================

export type UserRole = 'business_user' | 'administrator';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organizationId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
  isActive: boolean;
  photoURL?: string;
}

export interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
  taxNumber: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
}

// =============================================
// BUSINESS PROFILE
// =============================================

export type BusinessType = 'sole_proprietor' | 'pty_ltd' | 'cc' | 'partnership' | 'npo' | 'cooperative';

export interface BusinessProfile {
  id: string;
  organizationId: string;
  companyName: string;
  registrationNumber: string;
  taxNumber: string;
  vatNumber?: string;
  industry: string;
  industries: string[];
  serviceCategories: string[];
  businessType: BusinessType;
  bbbeeLevel: number | null;
  cidbGrade: string | null;
  cidbDesignation: string | null;
  province: string;
  city: string;
  operatingProvinces: string[];
  address: string;
  description: string;
  yearEstablished: number;
  numberOfEmployees: string;
  annualTurnover: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  profileCompleteness: number;
}

// =============================================
// TENDERS
// =============================================

export type TenderSource = 'etenders' | 'cidb' | 'municipal' | 'mock' | 'manual';
export type TenderStatus = 'open' | 'closed' | 'awarded' | 'cancelled';

export interface Tender {
  id: string;
  tenderId: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  industry: string;
  serviceType: string;
  province: string;
  municipality?: string;
  organization: string;
  department?: string;
  contactEmail?: string;
  contactPhone?: string;
  publishedDate: Timestamp;
  closingDate: Timestamp;
  briefingDate?: Timestamp;
  awardDate?: Timestamp;
  estimatedValue?: number;
  currency: string;
  source: TenderSource;
  sourceUrl?: string;
  requiredBbbeeLevel?: number;
  requiredCidbGrade?: string;
  requiredDocuments: string[];
  status: TenderStatus;
  aiCategorized: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================
// TENDER MATCHES
// =============================================

export type MatchRecommendation = 'highly_recommended' | 'recommended' | 'possible' | 'not_recommended';
export type MatchConfidence = 'high' | 'medium' | 'low';
export type MatchStatus = 'pending_review' | 'approved' | 'dismissed' | 'applied';

export interface MatchReason {
  factor: string;
  score: number;
  explanation: string;
}

export interface TenderMatch {
  id: string;
  tenderId: string;
  organizationId: string;
  matchScore: number;
  industryScore: number;
  serviceScore: number;
  provinceScore: number;
  certificationScore: number;
  matchReasons: MatchReason[];
  recommendation: MatchRecommendation;
  confidence: MatchConfidence;
  status: MatchStatus;
  agentMode: AIMode;
  requiresApproval: boolean;
  agentId: string;
  agentVersion: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================
// TENDER ANALYSIS
// =============================================

export interface Requirement {
  id: string;
  requirement: string;
  mandatory: boolean;
  category: string;
}

export interface RequiredDocument {
  document: string;
  mandatory: boolean;
  notes?: string;
}

export interface KeyDate {
  event: string;
  date: Timestamp;
  critical: boolean;
}

export interface Risk {
  id: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  mitigation?: string;
}

export interface EvaluationCriterion {
  criterion: string;
  weight: number;
}

export interface TenderAnalysis {
  id: string;
  tenderId: string;
  organizationId: string;
  executiveSummary: string;
  requirements: Requirement[];
  requiredDocuments: RequiredDocument[];
  keyDates: KeyDate[];
  risks: Risk[];
  eligibilityCriteria: string[];
  evaluationCriteria: EvaluationCriterion[];
  modelUsed: string;
  tokensUsed: number;
  agentId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================
// BID ASSESSMENT
// =============================================

export interface AvailableDocument {
  documentType: string;
  documentId: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface MissingDocument {
  documentType: string;
  mandatory: boolean;
  impact: 'disqualifying' | 'scoring' | 'minor';
  recommendation: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  deadline?: string;
}

export interface BidAssessment {
  id: string;
  tenderId: string;
  organizationId: string;
  readinessScore: number;
  availableDocuments: AvailableDocument[];
  missingDocuments: MissingDocument[];
  meetsEligibility: boolean;
  eligibilityGaps: string[];
  recommendations: Recommendation[];
  agentMode: string;
  requiresApproval: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================
// COMPLIANCE DOCUMENTS
// =============================================

export type DocumentType =
  | 'company_registration'
  | 'tax_clearance'
  | 'bbbee_certificate'
  | 'cidb_certificate'
  | 'company_profile'
  | 'financial_statements'
  | 'other';

export type DocumentStatus = 'valid' | 'expiring' | 'expired' | 'pending_verification';

export interface ComplianceDocument {
  id: string;
  organizationId: string;
  documentType: DocumentType;
  documentName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  downloadUrl: string;
  issueDate?: Timestamp;
  expiryDate?: Timestamp;
  status: DocumentStatus;
  version: number;
  uploadedBy: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================
// NOTIFICATIONS
// =============================================

export type NotificationType =
  | 'match_alert'
  | 'opportunity_alert'
  | 'closing_reminder'
  | 'document_expiry'
  | 'system'
  | 'approval_required';

export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityType?: 'tender' | 'document' | 'assessment';
  entityId?: string;
  isRead: boolean;
  readAt?: Timestamp;
  priority: 'high' | 'medium' | 'low';
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

// =============================================
// APPROVALS
// =============================================

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Approval {
  id: string;
  organizationId: string;
  requestedBy: string;
  actionType: string;
  actionData: Record<string, unknown>;
  entityType: string;
  entityId: string;
  status: ApprovalStatus;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  reviewNotes?: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

// =============================================
// AUDIT LOGS
// =============================================

export interface AuditLog {
  id: string;
  organizationId: string;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  decision: string;
  confidence?: number;
  reasoning?: string;
  agentMode: AIMode;
  requiresApproval: boolean;
  userId?: string;
  modelUsed?: string;
  tokensUsed?: number;
  durationMs?: number;
  createdAt: Timestamp;
}

// =============================================
// AGENT CONFIGURATION
// =============================================

export type AIMode = 'supervised' | 'hybrid' | 'autonomous';

export interface AgentToggle {
  enabled: boolean;
  mode?: string;
}

export interface AgentConfiguration {
  id: string;
  organizationId: string;
  globalMode: AIMode;
  agents: {
    agent0_governance: AgentToggle;
    agent1_discovery: AgentToggle;
    agent2_matching: AgentToggle;
    agent3_intelligence: AgentToggle;
    agent4_readiness: AgentToggle;
  };
  notifications: {
    matchAlerts: boolean;
    closingReminders: boolean;
    documentExpiry: boolean;
    minMatchScore: number;
    reminderDaysBefore: number;
  };
  updatedAt: Timestamp;
  updatedBy: string;
}

// =============================================
// UI / UTILITY TYPES
// =============================================

export interface DashboardStats {
  totalOpportunities: number;
  newOpportunities: number;
  highMatchOpportunities: number;
  closingSoon: number;
  readinessAssessments: number;
}

export interface TenderWithMatch extends Tender {
  match?: TenderMatch;
  analysis?: TenderAnalysis;
  assessment?: BidAssessment;
}

export interface FilterState {
  province?: string;
  industry?: string;
  category?: string;
  closingDateFrom?: Date;
  closingDateTo?: Date;
  minMatchScore?: number;
  status?: TenderStatus;
  search?: string;
}
