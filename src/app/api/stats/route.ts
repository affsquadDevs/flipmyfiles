import { NextResponse } from 'next/server';
import { getStats } from '@/lib/stats';

export async function GET() {
  return NextResponse.json(getStats());
}
