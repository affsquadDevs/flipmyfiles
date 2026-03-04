'use client';

import { useState } from 'react';

interface Faq {
  q: string;
  a: string;
}

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-6 space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-2xl border transition-colors duration-200 ${
            open === i ? 'border-primary/30 bg-primary/5' : 'border-gray-200 bg-white'
          }`}
        >
          <button
            className="flex w-full items-center justify-between gap-4 p-6 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <h3 className={`text-sm font-semibold transition-colors ${open === i ? 'text-primary' : 'text-gray-900'}`}>
              {faq.q}
            </h3>
            <svg
              className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${open === i ? 'rotate-180 text-primary' : 'text-gray-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open === i ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-gray-600">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
