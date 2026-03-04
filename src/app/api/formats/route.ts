import { NextResponse } from 'next/server';
import { categories, allConversions } from '@/config/formats.config';

export async function GET() {
  const data = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    conversions: allConversions
      .filter(c => c.category === cat.id)
      .map(c => ({ from: c.from, to: c.to, slug: c.slug })),
  }));

  return NextResponse.json({ categories: data });
}
