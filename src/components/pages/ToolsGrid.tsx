'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categories, allConversions } from '@/config/formats.config';
import { ConversionAppIcon } from '@/components/shared/ConversionAppIcon';

const categoryFormats: Record<string, string> = {
  image:    'JPG, PNG, WebP, AVIF, HEIC…',
  video:    'MP4, AVI, MOV, MKV, WebM…',
  audio:    'MP3, WAV, FLAC, OGG, AAC…',
  document: 'PDF, DOCX, TXT, CSV, XLSX…',
  ebook:    'EPUB, MOBI, AZW…',
  archive:  'ZIP, TAR, GZ…',
};

const categoryStyles: Record<string, { card: string; icon: string; activeCard: string }> = {
  image:    { card: 'bg-violet-50 border-violet-100 hover:border-violet-300 hover:shadow-violet-100',    icon: 'bg-violet-100 text-violet-600',    activeCard: 'bg-violet-100 border-violet-400 ring-2 ring-violet-300' },
  video:    { card: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:shadow-blue-100',            icon: 'bg-blue-100 text-blue-600',        activeCard: 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' },
  audio:    { card: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100',icon: 'bg-emerald-100 text-emerald-600',  activeCard: 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300' },
  document: { card: 'bg-amber-50 border-amber-100 hover:border-amber-300 hover:shadow-amber-100',        icon: 'bg-amber-100 text-amber-600',      activeCard: 'bg-amber-100 border-amber-400 ring-2 ring-amber-300' },
  ebook:    { card: 'bg-orange-50 border-orange-100 hover:border-orange-300 hover:shadow-orange-100',    icon: 'bg-orange-100 text-orange-600',    activeCard: 'bg-orange-100 border-orange-400 ring-2 ring-orange-300' },
  archive:  { card: 'bg-rose-50 border-rose-100 hover:border-rose-300 hover:shadow-rose-100',            icon: 'bg-rose-100 text-rose-600',        activeCard: 'bg-rose-100 border-rose-400 ring-2 ring-rose-300' },
};

export default function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const t = useTranslations('tools');

  const filtered = allConversions.filter(c => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = search === '' ||
      c.from.toLowerCase().includes(search.toLowerCase()) ||
      c.to.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gray-700"
              aria-label={t('clearSearch')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory('all')}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:shadow-sm ${
            activeCategory === 'all'
              ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/30'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-base">✦</span>
          {t('allCategory')}
        </button>

        {categories.map(cat => {
          const style = categoryStyles[cat.id] ?? categoryStyles.image;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all hover:shadow-sm ${
                isActive ? style.activeCard : style.card
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="text-gray-800">{t(`categoryNames.${cat.id}`)}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map(c => (
          <Link
            key={c.slug}
            href={`/convert/${c.slug}`}
            className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5"
          >
            <ConversionAppIcon from={c.from} to={c.to} />
            <p className="mt-3 text-sm font-bold text-gray-900">{c.from} {t('to')} {c.to}</p>
            <p className="mt-1 text-xs text-text-muted line-clamp-2">{t('convertGeneric', { from: c.from, to: c.to })}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-text-muted">{t('noResults')}</p>
      )}
    </div>
  );
}
