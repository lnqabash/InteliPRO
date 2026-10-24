import { AIMode, Tender, BusinessProfile, ComplianceDocument, TenderMatch, TenderAnalysis, BidAssessment } from '@/types';

// =============================================
// SHARED AGENT STATE
// =============================================

export interface AgentState {
  organizationId: string;
  userId: string;
  agentMode: AIMode;
  timestamp: string;
}

// =============================================
// TENDER DISCOVERY AGENT (Agent 1)
// =============================================

export interface DiscoveryAgentInput extends AgentState {
  filters?: {
    province?: string;
    industry?: string;
    category?: string;
    search?: string;
  };
}

export interface DiscoveryAgentOutput {
  tenders: Tender[];
  totalFound: number;
  duplicatesRemoved: number;
  categorized: number;
  sources: string[];
  executionTimeMs: number;
}

// =============================================
// MATCHING AGENT (Agent 2)
// =============================================

export interface MatchingAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
}

export interface MatchingAgentOutput {
  match: Omit<TenderMatch, 'id' | 'createdAt' | 'updatedAt'>;
  requiresApproval: boolean;
  reasoning: string;
}

// =============================================
// INTELLIGENCE AGENT (Agent 3)
// =============================================

export interface IntelligenceAgentInput extends AgentState {
  tender: Tender;
}

export interface IntelligenceAgentOutput {
  analysis: Omit<TenderAnalysis, 'id' | 'createdAt' | 'updatedAt'>;
  requiresApproval: boolean;
}

// =============================================
// BID READINESS AGENT (Agent 4)
// =============================================

export interface ReadinessAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
  documents: ComplianceDocument[];
  analysis?: TenderAnalysis;
}

export interface ReadinessAgentOutput {
  assessment: Omit<BidAssessment, 'id' | 'createdAt' | 'updatedAt'>;
  requiresApproval: boolean;
}

// =============================================
// GOVERNANCE AGENT (Agent 0)
// =============================================

export interface GovernanceAgentInput {
  agentMode: AIMode;
  action: string;
  risk: 'high' | 'medium' | 'low';
  organizationId: string;
  data: Record<string, unknown>;
}

export interface GovernanceAgentOutput {
  decision: 'proceed' | 'queue_for_approval' | 'reject';
  reasoning: string;
  requiresApproval: boolean;
  approvalId?: string;
}

// =============================================
// FUTURE AGENT STUBS (Extension Points)
// =============================================

export interface ProposalAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
  // TODO: Implement in Phase 2
}

export interface OutreachAgentInput extends AgentState {
  tender: Tender;
  // TODO: Implement in Phase 2
}

export interface PartnerMatchingAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
  // TODO: Implement in Phase 2
}

export interface FundingAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
  // TODO: Implement in Phase 2
}

export interface ComplianceAgentInput extends AgentState {
  documents: ComplianceDocument[];
  // TODO: Implement in Phase 2
}

export interface MarketIntelligenceAgentInput extends AgentState {
  industry: string;
  province: string;
  // TODO: Implement in Phase 2
}

export interface WinProbabilityAgentInput extends AgentState {
  tender: Tender;
  profile: BusinessProfile;
  // TODO: Implement in Phase 2
}
