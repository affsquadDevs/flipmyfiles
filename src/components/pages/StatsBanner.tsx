'use client';

import { useTranslations } from 'next-intl';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

export default function StatsBanner() {
  const t = useTranslations('stats');

  const stats = [
    { value: 50, suffix: '+', label: t('formatsSupported') },
    { value: 100, suffix: '%', label: t('freeForever') },
    { value: 0, suffix: '', label: t('signupsRequired') },
    { value: 250, suffix: 'MB', label: t('maxFileSize') },
  ];

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white sm:text-4xl">
                {stat.value === 0 ? (
                  <span>0</span>
                ) : (
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <p className="mt-1 text-sm text-indigo-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
