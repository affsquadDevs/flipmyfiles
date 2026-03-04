export const LIMITS = {
  maxFileSize: 250 * 1024 * 1024, // 250MB
  maxFileSizeLabel: '250MB',
  rateLimitPerMinute: 10,
  rateLimitWindow: 60 * 1000, // 1 minute
} as const;

export const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  // Images
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
  'image/bmp': ['bmp'],
  'image/tiff': ['tiff', 'tif'],
  'image/svg+xml': ['svg'],
  'image/x-icon': ['ico'],
  'image/heic': ['heic'],
  'image/heif': ['heif'],
  'image/avif': ['avif'],
  // Video
  'video/mp4': ['mp4'],
  'video/x-msvideo': ['avi'],
  'video/quicktime': ['mov'],
  'video/x-matroska': ['mkv'],
  'video/webm': ['webm'],
  'video/x-flv': ['flv'],
  'video/x-ms-wmv': ['wmv'],
  // Audio
  'audio/mpeg': ['mp3'],
  'audio/wav': ['wav'],
  'audio/ogg': ['ogg'],
  'audio/flac': ['flac'],
  'audio/aac': ['aac'],
  'audio/x-ms-wma': ['wma'],
  'audio/mp4': ['m4a'],
  // Documents
  'application/pdf': ['pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'text/csv': ['csv'],
  'text/plain': ['txt'],
  // Archives
  'application/zip': ['zip'],
  'application/x-tar': ['tar'],
  'application/gzip': ['gz'],
  'application/x-gzip': ['gz'],
};

export function getExtensionFromMime(mime: string): string | undefined {
  const extensions = ALLOWED_MIME_TYPES[mime];
  return extensions?.[0];
}

export function isMimeAllowed(mime: string): boolean {
  return mime in ALLOWED_MIME_TYPES;
}
