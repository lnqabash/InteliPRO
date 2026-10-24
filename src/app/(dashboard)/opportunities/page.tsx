'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Filter, SortAsc, MapPin, Calendar, Building2,
  ChevronRight, Star, Clock, X, Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_TENDERS } from '@/data/mock-tenders';
import { formatDate, getDaysUntilClosing, formatCurrency, PROVINCES, INDUSTRIES, TENDER_CATEGORIES } from '@/lib/utils';
import { Tender } from '@/types';

// Simulated match scores per tender
const MOCK_SCORES: Record<string, number> = {
  'tender-001': 94,
  'tender-002': 72,
  'tender-003': 61,
  'tender-004': 45,
  'tender-005': 88,
  'tender-006': 55,
  'tender-007': 78,
  'tender-008': 67,
  'tender-009': 51,
  'tender-010': 82,
  'tender-011': 73,
  'tender-012': 65,
};

function getScoreColor(score: number) {
  if (score >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 65) return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
}

function TenderCard({ tender }: { tender: Tender }) {
  const score = MOCK_SCORES[tender.id] ?? 50;
  const colors = getScoreColor(score);
  const daysLeft = getDaysUntilClosing(tender.closingDate);
  const isUrgent = daysLeft <= 7;

  return (
    <Link href={`/opportunities/${tender.id}`}>
      <Card className="hover:shadow-md transition-all duration-200 hover:border-[#00A6A6]/30 cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">{tender.category}</Badge>
                {score >= 80 && (
                  <Badge variant="accent" className="text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" /> High Match
                  </Badge>
                )}
                {isUrgent && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Urgent
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-[#0A2540] line-clamp-2">
                {tender.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{tender.organization}</p>
            </div>

            {/* Match Score */}
            <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex flex-col items-center justify-center`}>
              <span className={`text-lg font-bold ${colors.text}`}>{score}%</span>
              <span className="text-xs text-gray-500">match</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{tender.description}</p>

          <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00A6A6]" />
              {tender.province}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#0A2540]" />
              {tender.industry}
            </span>
            <span className={`flex items-center gap-1 font-medium ${isUrgent ? 'text-red-600' : daysLeft <= 14 ? 'text-amber-600' : ''}`}>
              <Calendar className="w-3.5 h-3.5" />
              {daysLeft <= 0 ? 'Closed' : `${daysLeft} days left`}
            </span>
            {tender.estimatedValue && (
              <span className="font-medium text-gray-700">
                {formatCurrency(tender.estimatedValue)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <span className="text-xs text-gray-400">{tender.tenderId}</span>
            <span className="text-xs text-[#00A6A6] group-hover:underline flex items-center gap-1">
              View details <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('all');
  const [industry, setIndustry] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'closing' | 'match' | 'value'>('match');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let tenders = [...MOCK_TENDERS];

    if (search) {
      const q = search.toLowerCase();
      tenders = tenders.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.organization.toLowerCase().includes(q) ||
        t.tenderId.toLowerCase().includes(q)
      );
    }

    if (province && province !== 'all') tenders = tenders.filter(t => t.province === province);
    if (industry && industry !== 'all') tenders = tenders.filter(t => t.industry === industry);
    if (category && category !== 'all') tenders = tenders.filter(t => t.category === category);

    tenders.sort((a, b) => {
      if (sortBy === 'closing') return getDaysUntilClosing(a.closingDate) - getDaysUntilClosing(b.closingDate);
      if (sortBy === 'match') return (MOCK_SCORES[b.id] ?? 0) - (MOCK_SCORES[a.id] ?? 0);
      if (sortBy === 'value') return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
      return 0;
    });

    return tenders;
  }, [search, province, industry, category, sortBy]);

  const activeFilters = [province !== 'all' && province, industry !== 'all' && industry, category !== 'all' && category].filter(Boolean);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} tender{filtered.length !== 1 ? 's' : ''} found · AI matching active
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#00A6A6] bg-[#00A6A6]/5 px-3 py-1.5 rounded-lg">
          <Zap className="w-3.5 h-3.5" />
          <span>Auto-matching enabled</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tenders, organisations, reference numbers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'border-[#00A6A6] text-[#00A6A6]' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{activeFilters.length}</Badge>
            )}
          </Button>
          <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-40">
              <SortAsc className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="closing">Closing Soon</SelectItem>
              <SelectItem value="value">Highest Value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Province</label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger>
                  <SelectValue placeholder="All provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All provinces</SelectItem>
                  {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {TENDER_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>
            {activeFilters.map(f => (
              <span
                key={f as string}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#00A6A6]/10 text-[#00A6A6] text-xs rounded-full cursor-pointer hover:bg-[#00A6A6]/20"
                onClick={() => {
                  if (f === province) setProvince('all');
                  if (f === industry) setIndustry('all');
                  if (f === category) setCategory('all');
                }}
              >
                {f as string} <X className="w-3 h-3" />
              </span>
            ))}
            <button
              onClick={() => { setProvince('all'); setIndustry('all'); setCategory('all'); }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Tender Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(tender => (
            <TenderCard key={tender.id} tender={tender} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No tenders found</h3>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setProvince('all'); setIndustry('all'); setCategory('all'); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
