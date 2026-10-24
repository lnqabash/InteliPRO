'use client';

import React from 'react';
import {
  TrendingUp, FileSearch, Star, Clock, BarChart3,
  Zap, ArrowRight, CheckCircle2, AlertTriangle, Info, Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MOCK_TENDERS } from '@/data/mock-tenders';
import { formatDate, getDaysUntilClosing, getMatchScoreBg, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { useAuth } from '@/lib/auth-context';

const pipelineData = [
  { month: 'Jul', discovered: 8, matched: 5, assessed: 3 },
  { month: 'Aug', discovered: 12, matched: 7, assessed: 5 },
  { month: 'Sep', discovered: 15, matched: 9, assessed: 6 },
  { month: 'Oct', discovered: 20, matched: 14, assessed: 9 },
];

const matchScoreData = [
  { range: '90-100%', count: 2 },
  { range: '80-89%', count: 3 },
  { range: '70-79%', count: 4 },
  { range: '60-69%', count: 2 },
  { range: '< 60%', count: 1 },
];

const aiInsights = [
  {
    type: 'match',
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    title: '3 High-Match Opportunities',
    desc: 'Gauteng ICT tender scores 94% based on your profile. Review before 18 days close.',
    time: '2 min ago',
  },
  {
    type: 'alert',
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    title: 'Closing Alert',
    desc: 'Eastern Cape Security tender closes in 7 days. Begin document preparation.',
    time: '1 hr ago',
  },
  {
    type: 'info',
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: 'Document Expiry Warning',
    desc: 'Your BBBEE Certificate expires in 30 days. Renew to maintain bid readiness.',
    time: '3 hr ago',
  },
  {
    type: 'success',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    title: 'New Tenders Discovered',
    desc: 'Agent 1 discovered 3 new opportunities in Gauteng and Western Cape.',
    time: 'Yesterday',
  },
];

const statCards = [
  {
    title: 'Total Opportunities',
    value: MOCK_TENDERS.length,
    icon: FileSearch,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    trend: '+3 this week',
    trendUp: true,
  },
  {
    title: 'New This Week',
    value: 4,
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    trend: '↑ 33% vs last week',
    trendUp: true,
  },
  {
    title: 'High Match (>75%)',
    value: 5,
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    trend: 'Based on your profile',
    trendUp: null,
  },
  {
    title: 'Closing ≤ 14 Days',
    value: MOCK_TENDERS.filter(t => getDaysUntilClosing(t.closingDate) <= 14).length,
    icon: Clock,
    color: 'text-red-600',
    bg: 'bg-red-50',
    trend: 'Act now',
    trendUp: false,
  },
  {
    title: 'Assessments Run',
    value: 7,
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    trend: 'Avg score: 78%',
    trendUp: null,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const closingSoon = MOCK_TENDERS.filter(t => getDaysUntilClosing(t.closingDate) <= 14);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.displayName?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your AI agents have been working. Here&apos;s what&apos;s new.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#0A2540]/5 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-sm font-medium text-[#0A2540]">5 Agents Active</span>
          <Badge variant="secondary" className="text-xs">Supervised</Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className={`text-xs font-medium ${
                  card.trendUp === true ? 'text-emerald-600' : card.trendUp === false ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunity Pipeline Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Opportunity Pipeline</CardTitle>
              <Badge variant="outline" className="text-xs">Last 4 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={pipelineData}>
                <defs>
                  <linearGradient id="colorDiscovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2540" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A2540" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMatched" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A6A6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00A6A6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAssessed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="discovered" stroke="#0A2540" strokeWidth={2} fill="url(#colorDiscovered)" name="Discovered" />
                <Area type="monotone" dataKey="matched" stroke="#00A6A6" strokeWidth={2} fill="url(#colorMatched)" name="Matched" />
                <Area type="monotone" dataKey="assessed" stroke="#10B981" strokeWidth={2} fill="url(#colorAssessed)" name="Assessed" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              {[{color: '#0A2540', label: 'Discovered'}, {color: '#00A6A6', label: 'Matched'}, {color: '#10B981', label: 'Assessed'}].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Match Score Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Match Score Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={matchScoreData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis dataKey="range" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={60} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="#00A6A6" radius={[0, 4, 4, 0]} name="Tenders" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-[#00A6A6]/5 rounded-lg">
              <p className="text-sm font-semibold text-[#0A2540]">5 tenders above 75%</p>
              <p className="text-xs text-gray-500 mt-0.5">Based on current profile settings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights Feed */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#00A6A6]" />
                <CardTitle>AI Insights Feed</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`flex gap-3 p-3 ${insight.bg} rounded-lg`}>
                <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{insight.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{insight.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Closing Soon */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <CardTitle>Closing Soon</CardTitle>
              </div>
              <Link href="/opportunities" className="text-sm text-[#00A6A6] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {closingSoon.slice(0, 4).map(tender => {
              const daysLeft = getDaysUntilClosing(tender.closingDate);
              return (
                <Link key={tender.id} href={`/opportunities/${tender.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-50 hover:border-gray-100">
                    <div className={`px-2 py-1 rounded-md text-center flex-shrink-0 ${daysLeft <= 7 ? 'bg-red-50' : 'bg-amber-50'}`}>
                      <p className={`text-lg font-bold leading-none ${daysLeft <= 7 ? 'text-red-600' : 'text-amber-600'}`}>{daysLeft}</p>
                      <p className={`text-xs ${daysLeft <= 7 ? 'text-red-500' : 'text-amber-500'}`}>days</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tender.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{tender.organization}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs">{tender.province}</Badge>
                        {tender.estimatedValue && (
                          <span className="text-xs text-gray-500">{formatCurrency(tender.estimatedValue)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {closingSoon.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No tenders closing in the next 14 days</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
