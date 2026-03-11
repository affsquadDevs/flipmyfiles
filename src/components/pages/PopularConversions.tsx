'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { popularConversions } from '@/config/formats.config';
import { ConversionAppIcon } from '@/components/shared/ConversionAppIcon';

export default function PopularConversions() {
  const t = useTranslations('tools');
  const tp = useTranslations('popularConversions');

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {tp('title')}
          </h2>
          <p className="mt-3 text-text-muted">
            {tp('subtitle')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
          {popularConversions.map((conversion) => (
            <Link
              key={conversion.slug}
              href={`/convert/${conversion.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
            >
              <ConversionAppIcon from={conversion.from} to={conversion.to} />
              <p className="mt-3 text-sm font-bold text-gray-900">
                {conversion.from} {t('to')} {conversion.to}
              </p>
              <p className="mt-1 text-xs text-text-muted line-clamp-2">
                {t('convertGeneric', { from: conversion.from, to: conversion.to })}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
          >
            {tp('viewAll')}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
