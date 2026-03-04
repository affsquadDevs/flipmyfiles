interface ConversionErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ConversionError({ error, onRetry }: ConversionErrorProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Conversion Failed
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}
