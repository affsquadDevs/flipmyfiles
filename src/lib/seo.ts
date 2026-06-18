import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

export const SITE_URL = 'https://flipmyfiles.com';

/**
 * Default social-share image (public/og-image.png, 1200×630). Resolved to an
 * absolute URL via the layout's metadataBase. Include this in any page that
 * sets its own `openGraph` object, because Next replaces (does not deep-merge)
 * the parent layout's openGraph — so without it the page loses the default image.
 */
export const OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'FlipMyFiles — Free Online File Converter',
};

/**
 * Some next-intl routing codes are NOT valid BCP-47 language subtags.
 * hreflang and <html lang> must use real language tags, otherwise Google
 * either ignores the annotation or mis-reads the language (e.g. "se" =
 * Northern Sami, not Swedish). Map the offenders to their correct tag.
 */
const BCP47: Record<string, string> = {
  se: 'sv', // Swedish  (SE is the country; the language is sv)
  ua: 'uk', // Ukrainian
  cz: 'cs', // Czech
};

/** Convert an internal routing locale into a valid BCP-47 tag for hreflang / <html lang>. */
export function toBcp47(locale: string): string {
  return BCP47[locale] ?? locale;
}

/**
 * Absolute, locale-prefixed URL for a path.
 * @param locale active routing locale (e.g. 'de')
 * @param path   path WITHOUT a locale prefix and WITHOUT a trailing slash,
 *               e.g. '/convert/png-to-jpg'. Use '' (or '/') for the home page.
 */
export function localeUrl(locale: string, path = ''): string {
  const suffix = path === '/' ? '' : path;
  return `${SITE_URL}/${locale}${suffix}`;
}

/**
 * Build the full hreflang map for a path: every locale (with corrected BCP-47
 * keys) plus an x-default pointing at the default locale.
 */
export function hreflangMap(path = ''): Record<string, string> {
  const suffix = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[toBcp47(loc)] = `${SITE_URL}/${loc}${suffix}`;
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${suffix}`;
  return languages;
}

/**
 * Locale-correct, self-referential canonical + hreflang alternates for a page.
 * Pass the result straight into `metadata.alternates`.
 */
export function buildAlternates(locale: string, path = ''): NonNullable<Metadata['alternates']> {
  return {
    canonical: localeUrl(locale, path),
    languages: hreflangMap(path),
  };
}
