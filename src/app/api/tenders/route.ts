import { NextResponse } from 'next/server';
import { MOCK_TENDERS } from '@/data/mock-tenders';
import { FilterState, Tender } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || '';
  const province = searchParams.get('province') || '';
  const industry = searchParams.get('industry') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';

  let tenders: Tender[] = [...MOCK_TENDERS];

  // Filter
  if (search) {
    const q = search.toLowerCase();
    tenders = tenders.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.organization.toLowerCase().includes(q) ||
      t.tenderId.toLowerCase().includes(q)
    );
  }

  if (province) {
    tenders = tenders.filter(t => t.province === province);
  }

  if (industry) {
    tenders = tenders.filter(t => t.industry === industry);
  }

  if (category) {
    tenders = tenders.filter(t => t.category === category);
  }

  if (status) {
    tenders = tenders.filter(t => t.status === status);
  }

  return NextResponse.json({
    tenders,
    total: tenders.length,
    source: 'mock',
  });
}
