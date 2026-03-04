'use client';

import { useState } from 'react';

interface FormatSelectorProps {
  inputFormat: string;
  compatibleFormats: string[];
  onSelect: (format: string) => void;
}

export default function FormatSelector({ inputFormat, compatibleFormats, onSelect }: FormatSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (compatibleFormats.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center dark:border-border-dark dark:bg-card-dark">
        <p className="text-text-muted">
          No conversion options available for <strong>{inputFormat}</strong> files yet.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          We&apos;re constantly adding new formats. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <p className="text-sm font-medium text-gray-400 mb-4">
        Convert <span className="font-bold text-cta">{inputFormat}</span> to:
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
        {compatibleFormats.map((format) => (
          <button
            key={format}
            onClick={() => setSelected(format)}
            className={`rounded-lg border-2 px-4 py-3 text-sm font-bold transition-all ${
              selected === format
                ? 'border-cta bg-cta/15 text-cta'
                : 'border-white/15 text-gray-300 hover:border-primary/50 hover:bg-white/5'
            }`}
          >
            {format}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onSelect(selected)}
            className="inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover hover:shadow-xl active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
            Convert {inputFormat} to {selected}
          </button>
        </div>
      )}
    </div>
  );
}
