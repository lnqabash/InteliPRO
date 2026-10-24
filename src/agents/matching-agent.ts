/**
 * Agent 2: Opportunity Matching Agent
 * 
 * Compares tender requirements against the company profile and
 * calculates a match score with detailed explanations.
 * 
 * Uses mock scoring for MVP (no LLM call required for basic matching).
 * LLM is used for generating human-readable explanations.
 */

import { MatchingAgentInput, MatchingAgentOutput } from './types';
import { MatchReason, MatchRecommendation } from '@/types';

interface ScoreComponent {
  factor: string;
  score: number;
  explanation: string;
}

function calculateIndustryScore(tenderIndustry: string, profileIndustries: string[]): ScoreComponent {
  const normalizedTender = tenderIndustry.toLowerCase();
  const exactMatch = profileIndustries.some(i => i.toLowerCase() === normalizedTender);
  const partialMatch = profileIndustries.some(i =>
    i.toLowerCase().includes(normalizedTender) || normalizedTender.includes(i.toLowerCase())
  );

  if (exactMatch) {
    return { factor: 'Industry', score: 100, explanation: `Direct industry match: ${tenderIndustry}` };
  }
  if (partialMatch) {
    return { factor: 'Industry', score: 60, explanation: `Partial industry alignment with ${tenderIndustry}` };
  }
  return { factor: 'Industry', score: 10, explanation: `Industry mismatch — tender requires ${tenderIndustry}` };
}

function calculateServiceScore(tenderServiceType: string, profileServices: string[]): ScoreComponent {
  const normalizedService = tenderServiceType.toLowerCase();
  const exactMatch = profileServices.some(s => s.toLowerCase() === normalizedService);
  const partialMatch = profileServices.some(s =>
    s.toLowerCase().includes(normalizedService) || normalizedService.includes(s.toLowerCase())
  );

  if (exactMatch) {
    return { factor: 'Service Category', score: 100, explanation: `Service category matches: ${tenderServiceType}` };
  }
  if (partialMatch) {
    return { factor: 'Service Category', score: 65, explanation: `Partial service alignment with ${tenderServiceType}` };
  }
  return { factor: 'Service Category', score: 15, explanation: `Service category not listed in profile` };
}

function calculateProvinceScore(tenderProvince: string, profileProvince: string, operatingProvinces: string[]): ScoreComponent {
  const allProvinces = [profileProvince, ...operatingProvinces];

  if (allProvinces.some(p => p === tenderProvince)) {
    return { factor: 'Province', score: 100, explanation: `Operating in ${tenderProvince} — province match confirmed` };
  }
  if (operatingProvinces.length > 3) {
    return { factor: 'Province', score: 50, explanation: `Multi-province operator — may consider ${tenderProvince}` };
  }
  return { factor: 'Province', score: 20, explanation: `Not currently operating in ${tenderProvince}` };
}

function calculateCertificationScore(
  requiredBbbbeeLevel: number | undefined,
  requiredCidbGrade: string | undefined,
  profileBbbeeLevel: number | null,
  profileCidbGrade: string | null
): ScoreComponent {
  let score = 100;
  const reasons: string[] = [];

  if (requiredBbbbeeLevel !== undefined) {
    if (profileBbbeeLevel === null) {
      score -= 30;
      reasons.push('BBBEE certificate not on file');
    } else if (profileBbbeeLevel <= requiredBbbbeeLevel) {
      reasons.push(`BBBEE Level ${profileBbbeeLevel} meets requirement of Level ${requiredBbbbeeLevel}`);
    } else {
      score -= 20;
      reasons.push(`BBBEE Level ${profileBbbeeLevel} does not meet Level ${requiredBbbbeeLevel} requirement`);
    }
  }

  if (requiredCidbGrade) {
    if (!profileCidbGrade) {
      score -= 40;
      reasons.push('CIDB certificate not registered');
    } else {
      const cidbNumeric = (grade: string) => parseInt(grade.replace(/\D/g, '')) || 0;
      if (cidbNumeric(profileCidbGrade) >= cidbNumeric(requiredCidbGrade)) {
        reasons.push(`CIDB Grade ${profileCidbGrade} meets ${requiredCidbGrade} requirement`);
      } else {
        score -= 35;
        reasons.push(`CIDB Grade ${profileCidbGrade} below required ${requiredCidbGrade}`);
      }
    }
  }

  if (reasons.length === 0) {
    reasons.push('No specific certification requirements');
  }

  return {
    factor: 'Certifications',
    score: Math.max(0, score),
    explanation: reasons.join('; '),
  };
}

function getRecommendation(score: number): MatchRecommendation {
  if (score >= 80) return 'highly_recommended';
  if (score >= 65) return 'recommended';
  if (score >= 45) return 'possible';
  return 'not_recommended';
}

export async function runMatchingAgent(input: MatchingAgentInput): Promise<MatchingAgentOutput> {
  const { tender, profile, agentMode } = input;

  const industryScore = calculateIndustryScore(tender.industry, [profile.industry, ...profile.industries]);
  const serviceScore = calculateServiceScore(tender.serviceType, profile.serviceCategories);
  const provinceScore = calculateProvinceScore(tender.province, profile.province, profile.operatingProvinces);
  const certificationScore = calculateCertificationScore(
    tender.requiredBbbeeLevel,
    tender.requiredCidbGrade,
    profile.bbbeeLevel,
    profile.cidbGrade
  );

  // Weighted average: Industry 30%, Service 30%, Province 20%, Certifications 20%
  const matchScore = Math.round(
    industryScore.score * 0.30 +
    serviceScore.score * 0.30 +
    provinceScore.score * 0.20 +
    certificationScore.score * 0.20
  );

  const matchReasons: MatchReason[] = [
    industryScore,
    serviceScore,
    provinceScore,
    certificationScore,
  ];

  const recommendation = getRecommendation(matchScore);
  const confidence = matchScore >= 70 ? 'high' : matchScore >= 45 ? 'medium' : 'low';

  // In supervised/hybrid mode, high-scoring matches still need approval for alerts
  const requiresApproval = agentMode === 'supervised' || (agentMode === 'hybrid' && matchScore >= 85);

  const match: MatchingAgentOutput['match'] = {
    tenderId: tender.id,
    organizationId: input.organizationId,
    matchScore,
    industryScore: industryScore.score,
    serviceScore: serviceScore.score,
    provinceScore: provinceScore.score,
    certificationScore: certificationScore.score,
    matchReasons,
    recommendation,
    confidence,
    status: requiresApproval ? 'pending_review' : 'approved',
    agentMode,
    requiresApproval,
    agentId: 'agent-2-matching',
    agentVersion: '1.0.0',
  };

  return { match, requiresApproval, reasoning: matchReasons.map(r => r.explanation).join('. ') };
}
