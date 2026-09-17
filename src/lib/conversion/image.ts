import sharp from 'sharp';
import { ConversionOptions } from '@/types/formats';
import { isBmp, decodeBMP, encodeBMP, wrapPngInIco } from './bmp-ico';

type SharpFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'tiff' | 'avif';

const FORMAT_MAP: Record<string, SharpFormat> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
  gif: 'gif',
  tiff: 'tiff',
  avif: 'avif',
};

export async function convertImage(
  buffer: Buffer,
  outputFormat: string,
  options: ConversionOptions = {}
): Promise<Buffer> {
  const out = outputFormat.toLowerCase();

  // libvips can't read BMP — decode it ourselves and feed sharp raw RGBA pixels.
  let pipeline: sharp.Sharp;
  if (isBmp(buffer)) {
    const { data, width, height } = decodeBMP(buffer);
    pipeline = sharp(data, { raw: { width, height, channels: 4 } });
  } else {
    pipeline = sharp(buffer);
  }

  // Auto-rotate from EXIF before stripping metadata (default: strip). No-op on raw input.
  if (options.stripMetadata !== false) {
    pipeline = pipeline.rotate();
  }

  // Resize if dimensions provided
  if (options.width || options.height) {
    pipeline = pipeline.resize({
      width: options.width || undefined,
      height: options.height || undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // BMP output — libvips can't write BMP: flatten alpha, take raw RGB, encode.
  if (out === 'bmp') {
    const { data, info } = await pipeline
      .flatten({ background: options.backgroundColor || '#ffffff' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return encodeBMP(data, info.width, info.height, info.channels);
  }

  // ICO output — libvips can't write ICO: render a <=256px PNG and wrap it.
  if (out === 'ico') {
    const png = await pipeline
      .resize({ width: 256, height: 256, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    return wrapPngInIco(png);
  }

  const format = FORMAT_MAP[out];
  if (!format) {
    throw new Error(`Unsupported image output format: ${outputFormat}`);
  }

  // JPEG has no alpha channel: flatten onto a background color (default white).
  if (format === 'jpeg') {
    pipeline = pipeline.flatten({ background: options.backgroundColor || '#ffffff' });
  }

  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: options.quality || 85, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ compressionLevel: 6 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality: options.quality || 85 });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality: options.quality || 65 });
      break;
    case 'tiff':
      pipeline = pipeline.tiff({ quality: options.quality || 85 });
      break;
    case 'gif':
      pipeline = pipeline.gif();
      break;
  }

  return pipeline.toBuffer();
}

export function isImageFormat(format: string): boolean {
  return format.toLowerCase() in FORMAT_MAP || ['bmp', 'ico', 'svg', 'heic'].includes(format.toLowerCase());
}

export function getImageMimeType(format: string): string {
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    tiff: 'image/tiff',
    avif: 'image/avif',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
  };
  return mimeMap[format.toLowerCase()] || 'application/octet-stream';
}
