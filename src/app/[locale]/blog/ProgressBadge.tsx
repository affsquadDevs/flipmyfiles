'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/** Per-article reading-progress chip, hydrated from localStorage on the client. */
export default function ProgressBadge({ slug }: { slug: string }) {
  const [pct, setPct] = useState(0);
  const t = useTranslations('blog');
  const tc = useTranslations('common');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setPct(Number(localStorage.getItem(`blog-progress-${slug}`) ?? 0));
  }, [slug]);

  if (pct === 0) return null;

  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
      pct === 100 ? 'bg-cta/10 text-cta' : 'bg-primary/10 text-primary'
    }`}>
      {pct === 100 ? (
        <>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          {t('read')}
        </>
      ) : (
        tc('readPct', { pct })
      )}
    </span>
  );
}
