import { allConversions } from '@/config/formats.config';

const FORMAT_CATEGORY_MAP: Record<string, string> = {
  jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', gif: 'image',
  bmp: 'image', tiff: 'image', tif: 'image', svg: 'image', ico: 'image',
  heic: 'image', heif: 'image', avif: 'image',
  mp4: 'video', avi: 'video', mov: 'video', mkv: 'video', webm: 'video',
  flv: 'video', wmv: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio', aac: 'audio',
  wma: 'audio', m4a: 'audio',
  pdf: 'document', docx: 'document', doc: 'document', xlsx: 'document',
  xls: 'document', csv: 'document', txt: 'document', rtf: 'document',
  pptx: 'document',
  epub: 'ebook', mobi: 'ebook',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
};

export function detectCategory(extension: string): string {
  return FORMAT_CATEGORY_MAP[extension.toLowerCase()] || 'unknown';
}

export function getCompatibleOutputFormats(inputFormat: string): string[] {
  const input = inputFormat.toUpperCase();
  return allConversions
    .filter(c => c.from === input)
    .map(c => c.to);
}

export function getConversionSlug(from: string, to: string): string {
  return `${from.toLowerCase()}-to-${to.toLowerCase()}`;
}

export function normalizeExtension(ext: string): string {
  const map: Record<string, string> = {
    jpeg: 'jpg',
    tif: 'tiff',
    heif: 'heic',
  };
  const lower = ext.toLowerCase();
  return map[lower] || lower;
}
