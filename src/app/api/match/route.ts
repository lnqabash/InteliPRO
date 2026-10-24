import { NextResponse } from 'next/server';
import { runMatchingAgent } from '@/agents';
import { MatchingAgentInput } from '@/agents/types';

export async function POST(request: Request) {
  try {
    const body = await request.json() as MatchingAgentInput;

    if (!body.tender || !body.profile) {
      return NextResponse.json({ error: 'tender and profile are required' }, { status: 400 });
    }

    const result = await runMatchingAgent(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Matching agent error:', error);
    return NextResponse.json({ error: 'Failed to run matching agent' }, { status: 500 });
  }
}
