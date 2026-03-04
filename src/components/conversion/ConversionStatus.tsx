interface ConversionStatusProps {
  inputFormat: string;
  outputFormat: string;
  progress: number;
  message?: string;
}

export default function ConversionStatus({ inputFormat, progress, message }: ConversionStatusProps) {
  const defaultMessage = progress < 15
    ? 'Preparing...'
    : progress < 30
    ? 'Uploading file...'
    : progress < 70
    ? 'Processing conversion...'
    : progress < 95
    ? 'Almost done...'
    : 'Finishing up...';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Spinner */}
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="text-cta opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Converting your {inputFormat} file...
        </p>
        <p className="mt-1 text-sm text-text-muted">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  );
}
