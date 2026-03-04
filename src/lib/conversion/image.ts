import sharp from 'sharp';
import { ConversionOptions } from '@/types/formats';

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
  const format = FORMAT_MAP[outputFormat.toLowerCase()];
  if (!format) {
    throw new Error(`Unsupported image output format: ${outputFormat}`);
  }

  let pipeline = sharp(buffer);

  // Strip metadata if requested (default: true)
  if (options.stripMetadata !== false) {
    pipeline = pipeline.rotate(); // auto-rotate from EXIF before stripping
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

  // Set background color for formats that don't support transparency
  if ((format === 'jpeg') && options.backgroundColor) {
    pipeline = pipeline.flatten({ background: options.backgroundColor });
  } else if (format === 'jpeg') {
    pipeline = pipeline.flatten({ background: '#ffffff' });
  }

  // Apply format-specific options
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality: options.quality || 85,
        mozjpeg: true,
      });
      break;
    case 'png':
      pipeline = pipeline.png({
        compressionLevel: 6,
      });
      break;
    case 'webp':
      pipeline = pipeline.webp({
        quality: options.quality || 85,
      });
      break;
    case 'avif':
      pipeline = pipeline.avif({
        quality: options.quality || 65,
      });
      break;
    case 'tiff':
      pipeline = pipeline.tiff({
        quality: options.quality || 85,
      });
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
