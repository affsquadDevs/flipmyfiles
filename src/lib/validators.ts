import { LIMITS, ALLOWED_MIME_TYPES } from '@/config/limits.config';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  // Check file size
  if (file.size > LIMITS.maxFileSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMB}MB). Maximum size is ${LIMITS.maxFileSizeLabel}.`,
    };
  }

  // Check file size is not 0
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty.',
    };
  }

  // Check MIME type
  const mime = file.type;
  if (mime && !(mime in ALLOWED_MIME_TYPES)) {
    // Try extension-based check as fallback
    const ext = getFileExtension(file.name);
    if (!isExtensionAllowed(ext)) {
      return {
        valid: false,
        error: `File type "${ext.toUpperCase()}" is not supported.`,
      };
    }
  }

  return { valid: true };
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

export function isExtensionAllowed(ext: string): boolean {
  const lower = ext.toLowerCase();
  for (const extensions of Object.values(ALLOWED_MIME_TYPES)) {
    if (extensions.includes(lower)) return true;
  }
  return false;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function getFormatFromExtension(ext: string): string {
  return ext.toUpperCase();
}
