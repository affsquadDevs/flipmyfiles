import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pl', 'el', 'es', 'pt', 'de', 'fr', 'se', 'it', 'ua', 'cz'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
});
