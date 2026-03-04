import { formatFileSize } from '@/lib/validators';

interface DownloadReadyProps {
  filename: string;
  size: number;
  onDownload: () => void;
  onReset: () => void;
}

export default function DownloadReady({ filename, size, onDownload, onReset }: DownloadReadyProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Success icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cta/10">
        <svg className="h-10 w-10 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Conversion Complete!
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          {filename} &middot; {formatFileSize(size)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover hover:shadow-xl active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download File
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-border-dark dark:text-gray-300 dark:hover:bg-card-dark"
        >
          Convert Another File
        </button>
      </div>
    </div>
  );
}
