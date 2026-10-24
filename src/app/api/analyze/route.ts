import { NextResponse } from 'next/server';
import { runIntelligenceAgent } from '@/agents';
import { IntelligenceAgentInput } from '@/agents/types';

export async function POST(request: Request) {
  try {
    const body = await request.json() as IntelligenceAgentInput;

    if (!body.tender) {
      return NextResponse.json({ error: 'tender is required' }, { status: 400 });
    }

    const result = await runIntelligenceAgent(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Intelligence agent error:', error);
    return NextResponse.json({ error: 'Failed to run intelligence agent' }, { status: 500 });
  }
}
