interface FormatJourneyProps {
  from: string;
  to: string;
}

export default function FormatJourney({ from, to }: FormatJourneyProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary-light/20">
        <span className="text-sm font-bold text-primary dark:text-blue-300">{from}</span>
      </div>
      <div className="flex items-center">
        <div className="h-0.5 w-8 bg-gradient-to-r from-primary to-cta" />
        <svg className="h-5 w-5 -ml-1 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-cta/10">
        <span className="text-sm font-bold text-green-700 dark:text-green-400">{to}</span>
      </div>
    </div>
  );
}
