import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { checkRateLimit } from '@/lib/rateLimit';
import { LIMITS } from '@/config/limits.config';

export const runtime = 'nodejs';

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'tif', 'avif', 'bmp']);

async function eraseImageMetadata(buffer: Buffer, ext: string): Promise<{ buffer: Buffer; mimeType: string; outputExt: string }> {
  const FORMAT_MAP: Record<string, 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif'> = {
    jpg: 'jpeg', jpeg: 'jpeg', png: 'png', webp: 'webp',
    gif: 'gif', tiff: 'tiff', tif: 'tiff', avif: 'avif',
    bmp: 'png', // Sharp doesn't output BMP, use PNG
  };
  const MIME_MAP: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', tiff: 'image/tiff', tif: 'image/tiff', avif: 'image/avif',
    bmp: 'image/png',
  };
  const OUT_EXT: Record<string, string> = {
    jpg: 'jpg', jpeg: 'jpg', png: 'png', webp: 'webp',
    gif: 'gif', tiff: 'tiff', tif: 'tiff', avif: 'avif', bmp: 'png',
  };

  const format = FORMAT_MAP[ext];
  if (!format) throw new Error(`Unsupported image format: ${ext}`);

  // rotate() auto-corrects orientation from EXIF, then Sharp strips all metadata by default
  let pipeline = sharp(buffer).rotate();

  switch (format) {
    case 'jpeg': pipeline = pipeline.jpeg({ quality: 95, mozjpeg: false }); break;
    case 'png':  pipeline = pipeline.png({ compressionLevel: 3 }); break;
    case 'webp': pipeline = pipeline.webp({ quality: 95 }); break;
    case 'avif': pipeline = pipeline.avif({ quality: 80 }); break;
    case 'tiff': pipeline = pipeline.tiff({ quality: 95 }); break;
    case 'gif':  pipeline = pipeline.gif(); break;
  }

  const result = await pipeline.toBuffer();
  return { buffer: result, mimeType: MIME_MAP[ext], outputExt: OUT_EXT[ext] };
}

async function erasePdfMetadata(buffer: Buffer): Promise<Buffer> {
  const { PDFDocument } = await import('pdf-lib');
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('FlipMyFiles');
  pdfDoc.setCreator('FlipMyFiles');
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

export async function POST(request: NextRequest) {
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

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > LIMITS.maxFileSize) {
      return NextResponse.json({ error: `File too large. Maximum is ${LIMITS.maxFileSizeLabel}.` }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resultBuffer: Buffer;
    let mimeType: string;
    let outputExt: string;

    if (IMAGE_EXTS.has(ext)) {
      const res = await eraseImageMetadata(buffer, ext);
      resultBuffer = res.buffer;
      mimeType = res.mimeType;
      outputExt = res.outputExt;
    } else if (ext === 'pdf') {
      resultBuffer = await erasePdfMetadata(buffer);
      mimeType = 'application/pdf';
      outputExt = 'pdf';
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Please use an image (JPG, PNG, WebP, etc.) or PDF file.' },
        { status: 400 }
      );
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const outputFilename = `${baseName}_clean.${outputExt}`;

    return new NextResponse(new Uint8Array(resultBuffer), {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': resultBuffer.length.toString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to erase metadata';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
