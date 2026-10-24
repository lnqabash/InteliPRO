import { NextResponse } from 'next/server';
import { runReadinessAgent } from '@/agents';
import { ReadinessAgentInput } from '@/agents/types';

export async function POST(request: Request) {
  try {
    const body = await request.json() as ReadinessAgentInput;

    if (!body.tender || !body.profile) {
      return NextResponse.json({ error: 'tender, profile, and documents are required' }, { status: 400 });
    }

    const result = await runReadinessAgent(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Readiness agent error:', error);
    return NextResponse.json({ error: 'Failed to run readiness agent' }, { status: 500 });
  }
}
