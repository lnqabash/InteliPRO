/**
 * InteliPro AI Agent Registry
 * 
 * Central export point for all agents.
 * Future agents should be registered here following the same pattern.
 */

export { runMatchingAgent } from './matching-agent';
export { runIntelligenceAgent } from './intelligence-agent';
export { runReadinessAgent } from './readiness-agent';

export type {
  MatchingAgentInput,
  MatchingAgentOutput,
  IntelligenceAgentInput,
  IntelligenceAgentOutput,
  ReadinessAgentInput,
  ReadinessAgentOutput,
  GovernanceAgentInput,
  GovernanceAgentOutput,
  DiscoveryAgentInput,
  DiscoveryAgentOutput,
  // Future agent extension points
  ProposalAgentInput,
  OutreachAgentInput,
  PartnerMatchingAgentInput,
  FundingAgentInput,
  ComplianceAgentInput,
  MarketIntelligenceAgentInput,
  WinProbabilityAgentInput,
} from './types';

/**
 * FUTURE AGENT STUBS
 * These are extension points for Phase 2 agents.
 * Do not implement — only stub signatures are provided.
 */

// Agent 5: Proposal Generation Agent (Phase 2)
// export { runProposalAgent } from './proposal-agent';

// Agent 6: Outreach Agent (Phase 2)
// export { runOutreachAgent } from './outreach-agent';

// Agent 7: Partner Matching Agent (Phase 2)
// export { runPartnerMatchingAgent } from './partner-matching-agent';

// Agent 8: Funding Agent (Phase 2)
// export { runFundingAgent } from './funding-agent';

// Agent 9: Compliance Agent (Phase 2)
// export { runComplianceAgent } from './compliance-agent';

// Agent 10: Market Intelligence Agent (Phase 2)
// export { runMarketIntelligenceAgent } from './market-intelligence-agent';

// Agent 11: Win Probability Agent (Phase 2)
// export { runWinProbabilityAgent } from './win-probability-agent';
