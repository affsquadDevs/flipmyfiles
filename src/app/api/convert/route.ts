import { NextRequest, NextResponse } from 'next/server';
import { convertFile } from '@/lib/conversion';
import { checkRateLimit } from '@/lib/rateLimit';
import { incrementConversions } from '@/lib/stats';
import { LIMITS } from '@/config/limits.config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const { allowed, resetIn } = checkRateLimit(ip, LIMITS.rateLimitPerMinute);

  if (!allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)} seconds.` },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const outputFormat = formData.get('outputFormat') as string | null;
    const optionsStr = formData.get('options') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!outputFormat) {
      return NextResponse.json({ error: 'No output format specified' }, { status: 400 });
    }

    // Check file size
    if (file.size > LIMITS.maxFileSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${LIMITS.maxFileSizeLabel}.` },
        { status: 400 }
      );
    }

    // Detect input format from filename
    const inputFormat = file.name.split('.').pop()?.toLowerCase() || '';
    if (!inputFormat) {
      return NextResponse.json({ error: 'Could not detect input format' }, { status: 400 });
    }

    // Parse options
    let options = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch {
        // ignore invalid options
      }
    }

    // Convert file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await convertFile(buffer, inputFormat, outputFormat, file.name, options);

    incrementConversions();

    // Return the converted file
    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Conversion failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
