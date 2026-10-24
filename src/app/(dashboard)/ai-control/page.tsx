'use client';

import React, { useState } from 'react';
import {
  Bot, Shield, Search, GitCompare, Brain, FileCheck,
  Zap, CheckCircle2, Clock, AlertTriangle, Settings,
  Activity, History, Lock, Unlock, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIMode } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

const AGENTS = [
  {
    id: 'agent0_governance',
    number: 0,
    name: 'Governance & Approval Agent',
    description: 'Manages autonomy modes, approval workflows, and audit logging across all agents.',
    icon: Shield,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    capabilities: ['Approval workflows', 'Mode management', 'Audit logging', 'Agent control'],
    canDisable: false,
  },
  {
    id: 'agent1_discovery',
    number: 1,
    name: 'Tender Discovery Agent',
    description: 'Sources, imports, deduplicates, and categorises tender opportunities from multiple platforms.',
    icon: Search,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    capabilities: ['Source opportunities', 'Remove duplicates', 'Auto-categorise', 'API integration'],
    canDisable: true,
  },
  {
    id: 'agent2_matching',
    number: 2,
    name: 'Opportunity Matching Agent',
    description: 'Compares your company profile against tender requirements to calculate a weighted match score.',
    icon: GitCompare,
    color: 'text-[#00A6A6]',
    bg: 'bg-[#00A6A6]/10',
    capabilities: ['Match scoring', 'Profile comparison', 'Recommendation engine', 'Alert triggers'],
    canDisable: true,
  },
  {
    id: 'agent3_intelligence',
    number: 3,
    name: 'Tender Intelligence Agent',
    description: 'Analyses tender documents to extract requirements, summarise content, and identify risks.',
    icon: Brain,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    capabilities: ['Executive summaries', 'Requirement extraction', 'Risk identification', 'Key date alerts'],
    canDisable: true,
  },
  {
    id: 'agent4_readiness',
    number: 4,
    name: 'Bid Readiness Agent',
    description: 'Assesses your document inventory against tender requirements to produce a readiness score.',
    icon: FileCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    capabilities: ['Readiness scoring', 'Document gap analysis', 'Eligibility checks', 'Action recommendations'],
    canDisable: true,
  },
];

const FUTURE_AGENTS = [
  { name: 'Proposal Generation Agent', status: 'Phase 2' },
  { name: 'Outreach Agent', status: 'Phase 2' },
  { name: 'Partner Matching Agent', status: 'Phase 2' },
  { name: 'Funding Agent', status: 'Phase 3' },
  { name: 'Compliance Agent', status: 'Phase 3' },
  { name: 'Market Intelligence Agent', status: 'Phase 3' },
  { name: 'Win Probability Agent', status: 'Phase 3' },
];

const AUDIT_LOGS = [
  { agent: 'Agent 2', action: 'Match scored', description: 'GT/DID/0001/2026 scored 94% for your profile', decision: 'Alert queued for approval', mode: 'supervised', time: Timestamp.fromDate(new Date(Date.now() - 600000)) },
  { agent: 'Agent 1', action: 'Tenders discovered', description: 'Discovered 3 new tenders from mock source', decision: 'Auto-imported', mode: 'autonomous', time: Timestamp.fromDate(new Date(Date.now() - 3600000)) },
  { agent: 'Agent 3', action: 'Analysis generated', description: 'Tender WC/PWRT/0023/2026 analysed', decision: 'Pending user review', mode: 'supervised', time: Timestamp.fromDate(new Date(Date.now() - 7200000)) },
  { agent: 'Agent 4', action: 'Readiness assessed', description: 'Bid readiness scored 85% for EC/DPW/0056/2026', decision: 'Notification sent', mode: 'hybrid', time: Timestamp.fromDate(new Date(Date.now() - 86400000)) },
  { agent: 'Agent 0', action: 'Mode changed', description: 'AI mode updated to Supervised', decision: 'Applied to all agents', mode: 'supervised', time: Timestamp.fromDate(new Date(Date.now() - 172800000)) },
];

const AI_MODES: { id: AIMode; label: string; description: string; icon: typeof Zap }[] = [
  {
    id: 'supervised',
    label: 'Supervised',
    description: 'All AI recommendations require your manual review and approval before any action is taken.',
    icon: Lock,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    description: 'Low-risk actions (discovery, analysis) run automatically. High-risk actions (alerts, notifications) require approval.',
    icon: Settings,
  },
  {
    id: 'autonomous',
    label: 'Autonomous',
    description: 'AI makes all decisions automatically. All actions are logged in the audit history for review.',
    icon: Unlock,
  },
];

export default function AIControlPage() {
  const [globalMode, setGlobalMode] = useState<AIMode>('supervised');
  const [agentStates, setAgentStates] = useState<Record<string, boolean>>({
    agent0_governance: true,
    agent1_discovery: true,
    agent2_matching: true,
    agent3_intelligence: true,
    agent4_readiness: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleAgent = (id: string) => {
    setAgentStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const enabledCount = Object.values(agentStates).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Control Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure how your AI agents operate and make decisions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {enabledCount}/5 Agents Active
          </div>
          <Button onClick={handleSave} className="gap-2">
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agents">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="mode">AI Mode</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        {/* AGENTS TAB */}
        <TabsContent value="agents" className="space-y-4 mt-4">
          <div className="space-y-3">
            {AGENTS.map(agent => (
              <Card key={agent.id} className={`transition-all ${!agentStates[agent.id] ? 'opacity-60' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center flex-shrink-0`}>
                      <agent.icon className={`w-6 h-6 ${agent.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-400">Agent {agent.number}</span>
                        <h3 className="font-semibold text-gray-900 text-sm">{agent.name}</h3>
                        {!agent.canDisable && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Core
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{agent.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.capabilities.map(cap => (
                          <span key={cap} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge variant={agentStates[agent.id] ? 'success' : 'outline'} className="text-xs">
                        {agentStates[agent.id] ? 'Active' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={agentStates[agent.id]}
                        onCheckedChange={() => agent.canDisable && toggleAgent(agent.id)}
                        disabled={!agent.canDisable}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Future agents */}
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Future Agents (Extension Points)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUTURE_AGENTS.map(fa => (
                  <div key={fa.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">{fa.name}</span>
                    <Badge variant="outline" className="text-xs">{fa.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MODE TAB */}
        <TabsContent value="mode" className="space-y-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              The AI Mode controls how autonomously agents act. <strong>Supervised</strong> is recommended for new users.
              Changes take effect immediately and apply to all agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AI_MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => setGlobalMode(mode.id)}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  globalMode === mode.id
                    ? 'border-[#0A2540] bg-[#0A2540]/3'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                  globalMode === mode.id ? 'bg-[#0A2540]' : 'bg-gray-100'
                }`}>
                  <mode.icon className={`w-5 h-5 ${globalMode === mode.id ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">{mode.label}</h3>
                  {globalMode === mode.id && (
                    <div className="w-5 h-5 rounded-full bg-[#0A2540] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600">{mode.description}</p>
              </button>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Mode Comparison</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-600 font-medium">Action</th>
                      <th className="text-center py-2 text-gray-600 font-medium">Supervised</th>
                      <th className="text-center py-2 text-gray-600 font-medium">Hybrid</th>
                      <th className="text-center py-2 text-gray-600 font-medium">Autonomous</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { action: 'Discover tenders', supervised: 'Auto', hybrid: 'Auto', autonomous: 'Auto' },
                      { action: 'Calculate match scores', supervised: '✓ Approval', hybrid: 'Auto', autonomous: 'Auto' },
                      { action: 'Send match alerts', supervised: '✓ Approval', hybrid: '✓ Approval', autonomous: 'Auto' },
                      { action: 'Generate analysis', supervised: '✓ Approval', hybrid: 'Auto', autonomous: 'Auto' },
                      { action: 'Run bid assessment', supervised: '✓ Approval', hybrid: '✓ Approval', autonomous: 'Auto' },
                      { action: 'Send notifications', supervised: '✓ Approval', hybrid: '✓ Approval', autonomous: 'Auto' },
                    ].map(row => (
                      <tr key={row.action}>
                        <td className="py-2.5 text-gray-700">{row.action}</td>
                        <td className={`py-2.5 text-center ${row.supervised.includes('Approval') ? 'text-amber-600 font-medium' : 'text-emerald-600'}`}>{row.supervised}</td>
                        <td className={`py-2.5 text-center ${row.hybrid.includes('Approval') ? 'text-amber-600 font-medium' : 'text-emerald-600'}`}>{row.hybrid}</td>
                        <td className="py-2.5 text-center text-emerald-600">{row.autonomous}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUDIT LOGS TAB */}
        <TabsContent value="logs" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing last 5 agent actions</p>
            <Button variant="outline" size="sm">Export Logs</Button>
          </div>

          <div className="space-y-2">
            {AUDIT_LOGS.map((log, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.mode === 'supervised' ? 'bg-purple-100' : log.mode === 'hybrid' ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                      <Activity className={`w-4 h-4 ${
                        log.mode === 'supervised' ? 'text-purple-600' : log.mode === 'hybrid' ? 'text-blue-600' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-semibold text-[#0A2540]">{log.agent}</span>
                        <span className="text-sm font-medium text-gray-900">{log.action}</span>
                        <Badge variant={log.mode === 'supervised' ? 'secondary' : log.mode === 'hybrid' ? 'info' : 'success'} className="text-xs ml-auto">
                          {log.mode}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{log.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Decision: <span className="font-medium">{log.decision}</span> · {formatRelativeDate(log.time)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
