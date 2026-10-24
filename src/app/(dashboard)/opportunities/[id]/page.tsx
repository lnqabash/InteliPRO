'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Building2, Calendar, FileText, AlertTriangle,
  CheckCircle2, XCircle, Zap, ChevronDown, ChevronUp, Star,
  Clock, ExternalLink, FileCheck, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockTenderById } from '@/data/mock-tenders';
import { runIntelligenceAgent } from '@/agents/intelligence-agent';
import { runMatchingAgent } from '@/agents/matching-agent';
import { runReadinessAgent } from '@/agents/readiness-agent';
import { formatDate, getDaysUntilClosing, formatCurrency, getReadinessScoreColor } from '@/lib/utils';
import { TenderAnalysis, TenderMatch, BidAssessment } from '@/types';
import { Timestamp } from 'firebase/firestore';

// Demo profile used when no real profile exists
const DEMO_PROFILE = {
  id: 'demo',
  organizationId: 'demo',
  companyName: 'TechBuild Solutions (Pty) Ltd',
  registrationNumber: '2020/123456/07',
  taxNumber: '1234567890',
  industry: 'Information Technology',
  industries: ['Information Technology', 'Engineering'],
  serviceCategories: ['Software Development', 'IT Infrastructure', 'Consulting'],
  businessType: 'pty_ltd' as const,
  bbbeeLevel: 3,
  cidbGrade: null,
  cidbDesignation: null,
  province: 'Gauteng',
  city: 'Johannesburg',
  operatingProvinces: ['Gauteng', 'Western Cape'],
  address: '123 Tech Park, Sandton',
  description: 'Technology solutions provider',
  yearEstablished: 2020,
  numberOfEmployees: '11-50',
  annualTurnover: 'R1M-R5M',
  contactName: 'Demo User',
  contactEmail: 'demo@techbuild.co.za',
  contactPhone: '011 000 0000',
  profileCompleteness: 75,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
};

const DEMO_DOCUMENTS = [
  { id: 'd1', organizationId: 'demo', documentType: 'company_registration' as const, documentName: 'Company Registration', fileName: 'reg.pdf', fileSize: 0, mimeType: 'application/pdf', storagePath: '', downloadUrl: '', status: 'valid' as const, version: 1, uploadedBy: 'demo', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: 'd2', organizationId: 'demo', documentType: 'tax_clearance' as const, documentName: 'Tax Clearance', fileName: 'tax.pdf', fileSize: 0, mimeType: 'application/pdf', storagePath: '', downloadUrl: '', status: 'valid' as const, version: 1, uploadedBy: 'demo', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
  { id: 'd3', organizationId: 'demo', documentType: 'bbbee_certificate' as const, documentName: 'BBBEE Certificate', fileName: 'bbbee.pdf', fileSize: 0, mimeType: 'application/pdf', storagePath: '', downloadUrl: '', status: 'expiring' as const, version: 1, uploadedBy: 'demo', createdAt: Timestamp.now(), updatedAt: Timestamp.now() },
];

function ScoreRing({ score, size = 100, color }: { score: number; size?: number; color: string }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0f4f8" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0A2540">
        {score}%
      </text>
    </svg>
  );
}

export default function TenderDetailPage() {
  const { id } = useParams();
  const tender = getMockTenderById(id as string);

  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null);
  const [match, setMatch] = useState<TenderMatch | null>(null);
  const [assessment, setAssessment] = useState<BidAssessment | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState('overview');

  if (!tender) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Tender not found</p>
        <Link href="/opportunities"><Button variant="outline" className="mt-4">Back to Opportunities</Button></Link>
      </div>
    );
  }

  const daysLeft = getDaysUntilClosing(tender.closingDate);
  const isUrgent = daysLeft <= 7;

  const runAI = async () => {
    setAnalyzing(true);
    try {
      const [analysisResult, matchResult, assessmentResult] = await Promise.all([
        runIntelligenceAgent({ tender, organizationId: 'demo', userId: 'demo', agentMode: 'supervised', timestamp: new Date().toISOString() }),
        runMatchingAgent({ tender, profile: DEMO_PROFILE, organizationId: 'demo', userId: 'demo', agentMode: 'supervised', timestamp: new Date().toISOString() }),
        runReadinessAgent({ tender, profile: DEMO_PROFILE, documents: DEMO_DOCUMENTS, organizationId: 'demo', userId: 'demo', agentMode: 'supervised', timestamp: new Date().toISOString() }),
      ]);
      setAnalysis({ ...analysisResult.analysis, id: 'a1', createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      setMatch({ ...matchResult.match, id: 'm1', createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      setAssessment({ ...assessmentResult.assessment, id: 'r1', createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Opportunities
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <Badge variant="outline">{tender.category}</Badge>
                <Badge variant="outline">{tender.industry}</Badge>
                {isUrgent && <Badge variant="destructive" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Urgent</Badge>}
                <Badge variant="success">{tender.status.toUpperCase()}</Badge>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{tender.title}</h1>
              <p className="text-sm text-gray-500">{tender.organization}</p>

              <div className="flex items-center flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#00A6A6]" />{tender.province}</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-[#0A2540]" />{tender.serviceType}</span>
                <span className={`flex items-center gap-1.5 font-semibold ${isUrgent ? 'text-red-600' : daysLeft <= 14 ? 'text-amber-600' : 'text-gray-700'}`}>
                  <Calendar className="w-4 h-4" />Closes {formatDate(tender.closingDate)} · {daysLeft} days
                </span>
                {tender.estimatedValue && (
                  <span className="font-semibold text-[#0A2540]">{formatCurrency(tender.estimatedValue)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {match ? (
                <ScoreRing score={match.matchScore} size={90} color={getReadinessScoreColor(match.matchScore)} />
              ) : (
                <Button onClick={runAI} disabled={analyzing} variant="secondary" className="gap-2">
                  <Zap className="w-4 h-4" />
                  {analyzing ? 'Analysing...' : 'Run AI Analysis'}
                </Button>
              )}
              <span className="text-xs text-gray-400">{tender.tenderId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis {analysis && '✓'}</TabsTrigger>
          <TabsTrigger value="readiness">Bid Readiness {assessment && '✓'}</TabsTrigger>
          <TabsTrigger value="match">Match Detail {match && '✓'}</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tender Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">{tender.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Key Information</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { label: 'Reference Number', value: tender.tenderId },
                  { label: 'Procuring Entity', value: tender.organization },
                  { label: 'Province', value: tender.province },
                  { label: 'Category', value: tender.category },
                  { label: 'Published Date', value: formatDate(tender.publishedDate) },
                  { label: 'Closing Date', value: formatDate(tender.closingDate) },
                  ...(tender.briefingDate ? [{ label: 'Briefing Date', value: formatDate(tender.briefingDate) }] : []),
                  ...(tender.estimatedValue ? [{ label: 'Est. Value', value: formatCurrency(tender.estimatedValue) }] : []),
                ].map(row => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-900 text-right">{row.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tender.requiredDocuments.map(doc => (
                    <div key={doc} className="flex items-center gap-2 text-sm">
                      <FileCheck className="w-4 h-4 text-[#00A6A6]" />
                      <span>{doc}</span>
                    </div>
                  ))}
                  {tender.requiredBbbeeLevel && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="w-4 h-4 text-[#00A6A6]" />
                      <span>BBBEE Level {tender.requiredBbbeeLevel} or better</span>
                    </div>
                  )}
                  {tender.requiredCidbGrade && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileCheck className="w-4 h-4 text-[#00A6A6]" />
                      <span>CIDB Grade {tender.requiredCidbGrade}</span>
                    </div>
                  )}
                </div>

                {!analysis && (
                  <div className="mt-4 p-3 bg-[#00A6A6]/5 rounded-lg border border-[#00A6A6]/10">
                    <p className="text-xs text-[#00A6A6] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Run AI Analysis for a full requirements breakdown
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {!analysis && (
            <div className="text-center py-8 bg-gradient-to-r from-[#0A2540]/3 to-[#00A6A6]/3 rounded-xl border border-[#00A6A6]/10">
              <Zap className="w-10 h-10 text-[#00A6A6] mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Run AI Analysis</h3>
              <p className="text-sm text-gray-500 mb-4">Get match score, risk assessment, and bid readiness in seconds</p>
              <Button onClick={runAI} disabled={analyzing} variant="secondary">
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analysing with AI...
                  </span>
                ) : 'Analyse this Tender'}
              </Button>
            </div>
          )}
        </TabsContent>

        {/* AI Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          {!analysis ? (
            <Card>
              <CardContent className="text-center py-12">
                <Zap className="w-10 h-10 text-[#00A6A6] mx-auto mb-2" />
                <p className="text-gray-500 mb-4">AI analysis not yet run for this tender</p>
                <Button onClick={runAI} disabled={analyzing} variant="secondary">
                  {analyzing ? 'Analysing...' : 'Run AI Analysis'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-[#00A6A6]" />Executive Summary</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{analysis.executiveSummary}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {analysis.requirements.map(req => (
                      <div key={req.id} className="flex items-start gap-2 text-sm">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${req.mandatory ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <div className={`w-2 h-2 rounded-full ${req.mandatory ? 'bg-red-500' : 'bg-gray-400'}`} />
                        </div>
                        <div>
                          <span className="text-gray-800">{req.requirement}</span>
                          <Badge variant={req.mandatory ? 'destructive' : 'outline'} className="ml-2 text-xs">
                            {req.mandatory ? 'Mandatory' : 'Optional'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Key Dates</CardTitle></CardHeader>
                  <CardContent>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-4">
                      {analysis.keyDates.map((kd, i) => (
                        <div key={i} className="relative">
                          <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${kd.critical ? 'bg-red-500' : 'bg-[#00A6A6]'}`} />
                          <p className="text-sm font-medium text-gray-900">{kd.event}</p>
                          <p className="text-xs text-gray-500">{formatDate(kd.date)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />Risk Assessment</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {analysis.risks.map(risk => (
                    <div key={risk.id} className={`p-3 rounded-lg flex items-start gap-3 ${
                      risk.severity === 'high' ? 'bg-red-50 border border-red-100' :
                      risk.severity === 'medium' ? 'bg-amber-50 border border-amber-100' :
                      'bg-blue-50 border border-blue-100'
                    }`}>
                      <Badge variant={risk.severity === 'high' ? 'destructive' : risk.severity === 'medium' ? 'warning' : 'info'} className="mt-0.5 flex-shrink-0 text-xs">
                        {risk.severity}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{risk.risk}</p>
                        {risk.mitigation && <p className="text-xs text-gray-600 mt-1">💡 {risk.mitigation}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Bid Readiness */}
        <TabsContent value="readiness" className="space-y-4">
          {!assessment ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">Run AI Analysis to get your bid readiness score</p>
                <Button onClick={runAI} disabled={analyzing} variant="secondary">
                  {analyzing ? 'Analysing...' : 'Run Analysis'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1 flex flex-col items-center justify-center p-6">
                  <ScoreRing score={assessment.readinessScore} size={120} color={getReadinessScoreColor(assessment.readinessScore)} />
                  <p className="font-semibold text-gray-900 mt-2">Bid Readiness</p>
                  <p className="text-sm text-gray-500">
                    {assessment.readinessScore >= 80 ? 'Ready to bid' : assessment.readinessScore >= 60 ? 'Needs attention' : 'Not ready'}
                  </p>
                  {!assessment.meetsEligibility && (
                    <Badge variant="destructive" className="mt-2 text-xs">Eligibility gaps</Badge>
                  )}
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {assessment.recommendations.map((rec, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                        rec.priority === 'high' ? 'bg-red-50' : rec.priority === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                      }`}>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'warning' : 'info'} className="text-xs flex-shrink-0 mt-0.5">
                          {rec.priority}
                        </Badge>
                        <div>
                          <p className="text-sm text-gray-800">{rec.action}</p>
                          {rec.deadline && <p className="text-xs text-gray-500 mt-0.5">Deadline: {rec.deadline}</p>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-5 h-5" />Available Documents</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {assessment.availableDocuments.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-800">{doc.documentType}</span>
                        <Badge variant={doc.status === 'valid' ? 'success' : doc.status === 'expiring' ? 'warning' : 'destructive'} className="text-xs">
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                    {assessment.availableDocuments.length === 0 && (
                      <p className="text-sm text-gray-500">No documents uploaded yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-red-700"><XCircle className="w-5 h-5" />Missing Documents</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {assessment.missingDocuments.map((doc, i) => (
                      <div key={i} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.documentType}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{doc.recommendation}</p>
                        </div>
                        <Badge variant={doc.impact === 'disqualifying' ? 'destructive' : doc.impact === 'scoring' ? 'warning' : 'outline'} className="text-xs flex-shrink-0">
                          {doc.impact}
                        </Badge>
                      </div>
                    ))}
                    {assessment.missingDocuments.length === 0 && (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <p className="text-sm">All required documents available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Match Detail */}
        <TabsContent value="match" className="space-y-4">
          {!match ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">Run AI Analysis to see match details</p>
                <Button onClick={runAI} disabled={analyzing} variant="secondary">
                  {analyzing ? 'Analysing...' : 'Run Analysis'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" />Match Analysis</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={match.matchScore >= 80 ? 'success' : match.matchScore >= 60 ? 'warning' : 'outline'} className="text-sm px-3 py-1">
                        {match.matchScore}% Match
                      </Badge>
                      <Badge variant="outline" className="text-xs">{match.confidence} confidence</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {match.matchReasons.map(reason => (
                    <div key={reason.factor}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{reason.factor}</span>
                        <span className={`text-sm font-semibold ${reason.score >= 80 ? 'text-emerald-600' : reason.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {reason.score}%
                        </span>
                      </div>
                      <Progress value={reason.score} indicatorColor={getReadinessScoreColor(reason.score)} />
                      <p className="text-xs text-gray-500 mt-1">{reason.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className={`p-4 rounded-xl ${
                    match.recommendation === 'highly_recommended' ? 'bg-emerald-50 border border-emerald-200' :
                    match.recommendation === 'recommended' ? 'bg-blue-50 border border-blue-200' :
                    match.recommendation === 'possible' ? 'bg-amber-50 border border-amber-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {match.recommendation === 'highly_recommended' && '🌟 Highly Recommended'}
                      {match.recommendation === 'recommended' && '✅ Recommended'}
                      {match.recommendation === 'possible' && '⚠️ Possible Fit'}
                      {match.recommendation === 'not_recommended' && '❌ Not Recommended'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Based on your company profile, this tender has a <strong>{match.matchScore}%</strong> compatibility score.
                      {match.requiresApproval && ' This match is queued for your review before any alerts are sent.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
