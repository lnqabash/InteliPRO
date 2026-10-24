/**
 * Agent 3: Tender Intelligence Agent
 *
 * Analyzes tender documents, generates summaries, extracts requirements,
 * identifies risks, and produces structured intelligence reports.
 *
 * MVP: Uses rule-based extraction with mock AI outputs.
 * Production: Connects to OpenAI GPT-4o via LangGraph.
 */

import { IntelligenceAgentInput, IntelligenceAgentOutput } from './types';
import { Requirement, RequiredDocument, KeyDate, Risk, EvaluationCriterion } from '@/types';
import { Timestamp } from 'firebase/firestore';

function extractRequirements(tender: IntelligenceAgentInput['tender']): Requirement[] {
  const requirements: Requirement[] = [];

  if (tender.requiredBbbeeLevel) {
    requirements.push({
      id: 'req-bbbee',
      requirement: `Valid BBBEE Certificate Level ${tender.requiredBbbeeLevel} or better`,
      mandatory: true,
      category: 'Compliance',
    });
  }

  if (tender.requiredCidbGrade) {
    requirements.push({
      id: 'req-cidb',
      requirement: `CIDB Registration Grade ${tender.requiredCidbGrade} or higher in the relevant CE category`,
      mandatory: true,
      category: 'Registration',
    });
  }

  requirements.push(
    {
      id: 'req-tax',
      requirement: 'Valid SARS Tax Clearance Certificate or Tax Compliance Status PIN',
      mandatory: true,
      category: 'Compliance',
    },
    {
      id: 'req-comp-reg',
      requirement: 'Valid Company Registration (CIPC) documents',
      mandatory: true,
      category: 'Legal',
    },
    {
      id: 'req-local',
      requirement: `Company or subcontractors must have operational presence in ${tender.province}`,
      mandatory: false,
      category: 'Location',
    },
    {
      id: 'req-exp',
      requirement: `Minimum 3 years proven experience in ${tender.serviceType}`,
      mandatory: true,
      category: 'Experience',
    }
  );

  return requirements;
}

function extractRequiredDocuments(tender: IntelligenceAgentInput['tender']): RequiredDocument[] {
  return tender.requiredDocuments.map((doc, i) => ({
    document: doc,
    mandatory: true,
    notes: i === 0 ? 'Must be current and valid at time of submission' : undefined,
  }));
}

function buildKeyDates(tender: IntelligenceAgentInput['tender']): KeyDate[] {
  const dates: KeyDate[] = [
    {
      event: 'Tender Published',
      date: tender.publishedDate,
      critical: false,
    },
    {
      event: 'Tender Closing Date',
      date: tender.closingDate,
      critical: true,
    },
  ];

  if (tender.briefingDate) {
    dates.splice(1, 0, {
      event: 'Compulsory Briefing Session',
      date: tender.briefingDate,
      critical: true,
    });
  }

  if (tender.awardDate) {
    dates.push({
      event: 'Expected Award Date',
      date: tender.awardDate,
      critical: false,
    });
  }

  return dates;
}

function identifyRisks(tender: IntelligenceAgentInput['tender']): Risk[] {
  const risks: Risk[] = [];

  // Check closing date urgency
  const now = new Date();
  const closing = tender.closingDate.toDate();
  const daysLeft = Math.ceil((closing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 7) {
    risks.push({
      id: 'risk-closing',
      risk: `Tight deadline — only ${daysLeft} days remaining to submission close`,
      severity: 'high',
      mitigation: 'Start document preparation immediately; prioritise this tender',
    });
  } else if (daysLeft <= 14) {
    risks.push({
      id: 'risk-closing',
      risk: `Short turnaround — ${daysLeft} days to closing`,
      severity: 'medium',
      mitigation: 'Begin procurement and compliance document collection now',
    });
  }

  if (tender.requiredCidbGrade) {
    risks.push({
      id: 'risk-cidb',
      risk: `CIDB Grade ${tender.requiredCidbGrade} is a hard eligibility requirement — non-compliance leads to disqualification`,
      severity: 'high',
      mitigation: 'Verify your CIDB registration grade before submitting',
    });
  }

  if (tender.estimatedValue && tender.estimatedValue > 20000000) {
    risks.push({
      id: 'risk-financial',
      risk: 'High-value contract likely to attract strong competition from large enterprises',
      severity: 'medium',
      mitigation: 'Ensure financial statements demonstrate sufficient capacity and cash flow',
    });
  }

  risks.push({
    id: 'risk-spec',
    risk: 'Technical specifications may evolve following the briefing session',
    severity: 'low',
    mitigation: 'Attend the briefing session and monitor for addenda on the procuring entity website',
  });

  return risks;
}

function buildEvaluationCriteria(tender: IntelligenceAgentInput['tender']): EvaluationCriterion[] {
  const hasCidb = !!tender.requiredCidbGrade;

  if (hasCidb) {
    return [
      { criterion: 'Price', weight: 90 },
      { criterion: 'BBBEE Preference Points', weight: 10 },
    ];
  }

  return [
    { criterion: 'Price', weight: 80 },
    { criterion: 'BBBEE Preference Points', weight: 20 },
    { criterion: 'Technical Capability', weight: 0 },
  ];
}

function generateExecutiveSummary(tender: IntelligenceAgentInput['tender']): string {
  const value = tender.estimatedValue
    ? ` estimated at R${(tender.estimatedValue / 1000000).toFixed(1)}M`
    : '';
  const daysLeft = Math.ceil(
    (tender.closingDate.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return `${tender.organization} has issued a tender for ${tender.title.toLowerCase()}${value}. ` +
    `This is a ${tender.category} opportunity in the ${tender.industry} sector, located in ${tender.province}. ` +
    `Submissions close in ${daysLeft} days. ` +
    `${tender.requiredCidbGrade ? `Bidders must hold CIDB Grade ${tender.requiredCidbGrade} or higher. ` : ''}` +
    `${tender.requiredBbbeeLevel ? `A BBBEE Level ${tender.requiredBbbeeLevel} or better certificate is required. ` : ''}` +
    `The tender is evaluated on the 80/20 preference point system as prescribed under the PPPFA.`;
}

export async function runIntelligenceAgent(input: IntelligenceAgentInput): Promise<IntelligenceAgentOutput> {
  const { tender, agentMode } = input;

  const executiveSummary = generateExecutiveSummary(tender);
  const requirements = extractRequirements(tender);
  const requiredDocuments = extractRequiredDocuments(tender);
  const keyDates = buildKeyDates(tender);
  const risks = identifyRisks(tender);
  const evaluationCriteria = buildEvaluationCriteria(tender);
  const eligibilityCriteria = [
    'Must be a registered South African company (CIPC)',
    'Valid Tax Clearance Certificate required',
    ...(tender.requiredBbbeeLevel ? [`BBBEE Level ${tender.requiredBbbeeLevel} or better`] : []),
    ...(tender.requiredCidbGrade ? [`CIDB Registration Grade ${tender.requiredCidbGrade}`] : []),
    'No pending litigation or insolvency proceedings',
  ];

  const requiresApproval = agentMode === 'supervised';

  const analysis: IntelligenceAgentOutput['analysis'] = {
    tenderId: tender.id,
    organizationId: input.organizationId,
    executiveSummary,
    requirements,
    requiredDocuments,
    keyDates,
    risks,
    eligibilityCriteria,
    evaluationCriteria,
    modelUsed: 'rule-based-v1',
    tokensUsed: 0,
    agentId: 'agent-3-intelligence',
  };

  return { analysis, requiresApproval };
}
