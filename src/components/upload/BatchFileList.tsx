'use client';

import { formatFileSize } from '@/lib/validators';
import { getCategoryIcon } from '@/config/formats.config';

export interface BatchFile {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  error?: string;
  resultBlob?: Blob;
  resultFilename?: string;
}

interface BatchFileListProps {
  files: BatchFile[];
  onRemove: (id: string) => void;
}

export default function BatchFileList({ files, onRemove }: BatchFileListProps) {
  return (
    <div className="space-y-2">
      {files.map((f) => (
        <div
          key={f.id}
          className="flex items-center justify-between rounded-lg border border-border bg-white p-3 dark:border-border-dark dark:bg-card-dark"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg shrink-0">{getCategoryIcon(f.extension)}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-[300px]">
                {f.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary dark:bg-primary-light/20 dark:text-blue-300 uppercase">
                  {f.extension}
                </span>
                <span className="text-[11px] text-text-muted">{formatFileSize(f.size)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status indicator */}
            {f.status === 'pending' && (
              <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" />
            )}
            {f.status === 'converting' && (
              <svg className="h-4 w-4 animate-spin text-cta" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {f.status === 'completed' && (
              <svg className="h-4 w-4 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {f.status === 'error' && (
              <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}

            {f.status === 'pending' && (
              <button
                onClick={() => onRemove(f.id)}
                className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                aria-label="Remove file"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
