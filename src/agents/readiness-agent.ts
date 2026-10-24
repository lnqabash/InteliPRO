/**
 * Agent 4: Bid Readiness Agent
 *
 * Compares tender requirements against uploaded compliance documents
 * and company profile to produce a readiness score and gap analysis.
 */

import { ReadinessAgentInput, ReadinessAgentOutput } from './types';
import { AvailableDocument, DocumentType, MissingDocument, Recommendation } from '@/types';

const DOCUMENT_LABELS: Record<string, string> = {
  company_registration: 'Company Registration',
  tax_clearance: 'Tax Clearance',
  bbbee_certificate: 'BBBEE Certificate',
  cidb_certificate: 'CIDB Certificate',
  company_profile: 'Company Profile',
  financial_statements: 'Financial Statements',
};

export async function runReadinessAgent(input: ReadinessAgentInput): Promise<ReadinessAgentOutput> {
  const { tender, profile, documents, agentMode } = input;

  // Map what's uploaded
  const uploadedTypes = new Set<DocumentType>(documents.map(d => d.documentType));
  const validDocTypes = new Set<DocumentType>(
    documents.filter(d => d.status === 'valid').map(d => d.documentType)
  );

  const availableDocuments: AvailableDocument[] = documents.map(doc => ({
    documentType: DOCUMENT_LABELS[doc.documentType] || doc.documentType,
    documentId: doc.id,
    status: doc.status as 'valid' | 'expiring' | 'expired',
  }));

  // Determine what's needed
  const requiredDocs = tender.requiredDocuments;
  const missingDocuments: MissingDocument[] = [];

  // Map tender required docs to our types
  const docMap: Record<string, DocumentType> = {
    'Tax Clearance': 'tax_clearance',
    'BBBEE Certificate': 'bbbee_certificate',
    'Company Registration': 'company_registration',
    'CIDB Certificate': 'cidb_certificate',
    'Company Profile': 'company_profile',
    'Financial Statements': 'financial_statements',
  };

  for (const requiredDoc of requiredDocs) {
    const typeKey = docMap[requiredDoc];
    if (typeKey && !validDocTypes.has(typeKey)) {
      const isUploaded = typeKey && uploadedTypes.has(typeKey);
      const doc = documents.find(d => d.documentType === typeKey);

      missingDocuments.push({
        documentType: requiredDoc,
        mandatory: true,
        impact: typeKey === 'cidb_certificate' || typeKey === 'tax_clearance'
          ? 'disqualifying'
          : typeKey === 'bbbee_certificate'
          ? 'scoring'
          : 'minor',
        recommendation: isUploaded && doc?.status === 'expired'
          ? `Your ${requiredDoc} has expired — renew immediately`
          : isUploaded && doc?.status === 'expiring'
          ? `Your ${requiredDoc} is expiring soon — ensure it remains valid at submission date`
          : `Upload a valid ${requiredDoc} to your document repository`,
      });
    }
  }

  // CIDB check
  if (tender.requiredCidbGrade && !validDocTypes.has('cidb_certificate')) {
    const exists = missingDocuments.some(d => d.documentType === 'CIDB Certificate');
    if (!exists) {
      missingDocuments.push({
        documentType: 'CIDB Certificate',
        mandatory: true,
        impact: 'disqualifying',
        recommendation: `Register with CIDB and obtain Grade ${tender.requiredCidbGrade} certification`,
      });
    }
  }

  // Eligibility gaps
  const eligibilityGaps: string[] = [];
  let meetsEligibility = true;

  if (tender.requiredBbbeeLevel && profile.bbbeeLevel !== null) {
    if (profile.bbbeeLevel > tender.requiredBbbeeLevel) {
      eligibilityGaps.push(`BBBEE Level ${profile.bbbeeLevel} does not meet required Level ${tender.requiredBbbeeLevel}`);
      meetsEligibility = false;
    }
  } else if (tender.requiredBbbeeLevel && profile.bbbeeLevel === null) {
    eligibilityGaps.push('BBBEE Level not set in company profile');
  }

  if (tender.requiredCidbGrade && profile.cidbGrade) {
    const numeric = (g: string) => parseInt(g.replace(/\D/g, '')) || 0;
    if (numeric(profile.cidbGrade) < numeric(tender.requiredCidbGrade)) {
      eligibilityGaps.push(`CIDB Grade ${profile.cidbGrade} is below required ${tender.requiredCidbGrade}`);
      meetsEligibility = false;
    }
  }

  // Score calculation
  const totalRequired = requiredDocs.length;
  const totalMissing = missingDocuments.filter(d => d.impact === 'disqualifying').length;
  const scoringMissing = missingDocuments.filter(d => d.impact === 'scoring').length;

  let readinessScore = 100;
  readinessScore -= totalMissing * 25;
  readinessScore -= scoringMissing * 10;
  readinessScore -= eligibilityGaps.length * 15;
  if (profile.profileCompleteness < 70) readinessScore -= 10;
  readinessScore = Math.max(0, Math.min(100, readinessScore));

  // Recommendations
  const recommendations: Recommendation[] = [];

  const disqualifying = missingDocuments.filter(d => d.impact === 'disqualifying');
  if (disqualifying.length > 0) {
    recommendations.push({
      priority: 'high',
      action: `Obtain ${disqualifying.map(d => d.documentType).join(', ')} — these are disqualifying requirements`,
      deadline: '48 hours',
    });
  }

  const scoring = missingDocuments.filter(d => d.impact === 'scoring');
  if (scoring.length > 0) {
    recommendations.push({
      priority: 'medium',
      action: `Upload ${scoring.map(d => d.documentType).join(', ')} to improve scoring position`,
      deadline: '5 days',
    });
  }

  if (profile.profileCompleteness < 80) {
    recommendations.push({
      priority: 'medium',
      action: 'Complete your company profile to improve match accuracy and readiness scores',
    });
  }

  if (documents.some(d => d.status === 'expiring')) {
    recommendations.push({
      priority: 'high',
      action: 'Renew expiring documents before tender submission deadline',
    });
  }

  const requiresApproval = agentMode === 'supervised';

  const assessment: ReadinessAgentOutput['assessment'] = {
    tenderId: tender.id,
    organizationId: input.organizationId,
    readinessScore,
    availableDocuments,
    missingDocuments,
    meetsEligibility,
    eligibilityGaps,
    recommendations,
    agentMode,
    requiresApproval,
  };

  return { assessment, requiresApproval };
}
