import type { UploadedFile } from '@/hooks/useFileUpload';
import { getCategoryIcon } from '@/config/formats.config';

interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const icon = getCategoryIcon(file.format);

  return (
    <div className="flex items-center justify-between rounded-xl p-2">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl dark:bg-primary-light/20">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[400px]">
            {file.name}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary dark:bg-primary-light/20 dark:text-blue-300">
              {file.format}
            </span>
            <span className="text-xs text-text-muted">{file.sizeFormatted}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        aria-label="Remove file"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
