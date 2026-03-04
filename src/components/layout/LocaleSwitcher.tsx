'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';

const localeLabels: Record<string, { label: string; flag: string }> = {
  en: { label: 'English',    flag: '🇬🇧' },
  pl: { label: 'Polski',     flag: '🇵🇱' },
  el: { label: 'Ελληνικά',  flag: '🇬🇷' },
  es: { label: 'Español',    flag: '🇪🇸' },
  pt: { label: 'Português',  flag: '🇵🇹' },
  de: { label: 'Deutsch',    flag: '🇩🇪' },
  fr: { label: 'Français',   flag: '🇫🇷' },
  se: { label: 'Svenska',    flag: '🇸🇪' },
  it: { label: 'Italiano',   flag: '🇮🇹' },
  ua: { label: 'Українська', flag: '🇺🇦' },
  cz: { label: 'Čeština',   flag: '🇨🇿' },
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = localeLabels[locale] ?? localeLabels.en;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline text-xs font-medium">{locale.toUpperCase()}</span>
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0f1724] shadow-xl"
        >
          {routing.locales.map((loc) => {
            const info = localeLabels[loc];
            return (
              <button
                key={loc}
                role="option"
                aria-selected={loc === locale}
                onClick={() => switchLocale(loc)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                  loc === locale ? 'bg-white/5 text-white' : 'text-gray-400'
                }`}
              >
                <span>{info.flag}</span>
                <span>{info.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
