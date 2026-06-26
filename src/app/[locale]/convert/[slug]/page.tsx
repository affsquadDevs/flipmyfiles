import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { allConversions, popularConversions, getConversionBySlug } from '@/config/formats.config';
import { getFormatInfo } from '@/lib/content';
import { routing } from '@/i18n/routing';
import { buildAlternates, localeUrl, OG_IMAGE } from '@/lib/seo';
import ConversionPageTemplate from '@/components/pages/ConversionPageTemplate';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    allConversions.map(c => ({ locale, slug: c.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const conversion = getConversionBySlug(slug);
  if (!conversion) return { title: 'Not Found' };

  const { from, to } = conversion;
  const t = await getTranslations({ locale, namespace: 'converter' });

  // English keeps its strong, unique transactional title; other locales use the
  // already-translated converter strings so the title is in the user's language.
  const title = locale === routing.defaultLocale
    ? `Convert ${from} to ${to} — Free Online Converter | FlipMyFiles`
    : `${t('howToConvert', { from, to })} ${t('online')} | FlipMyFiles`;

  // Description (all locales): lead with the localized target-format definition
  // (unique per format, already translated), capped so the CTA after it stays
  // within the ~160-char SERP window across languages, then the convert CTA.
  const cta = `${t('howToConvert', { from, to })} ${t('online')} — ${t('freeSecure')}`;
  // Budget the lead against the (locale-dependent) CTA so the whole description
  // stays in the ~120-158 char SERP window — long enough to avoid Bing's
  // "too short" flag, short enough to avoid truncation. Pull in additional
  // sentences from the (already-localized) format definition when the first one
  // is short (e.g. ZIP), so archive conversions aren't left under-length.
  const budget = Math.max(32, Math.min(92, 152 - cta.length));
  const fullDesc = getFormatInfo(to, locale).description.trim().replace(/\s+/g, ' ');
  const parts = fullDesc.split(/(?<=\.)\s+/);
  let lead = parts[0] ?? fullDesc;
  for (let i = 1; i < parts.length && lead.length < budget - 12; i++) lead += ' ' + parts[i];
  const toSentence = lead.length > budget
    ? lead.slice(0, budget).replace(/\s+\S*$/, '').replace(/[\s.,;:—–-]+$/, '') + '…'
    : lead.replace(/\.+$/, '') + '.';
  const description = `${toSentence} ${cta}`;
  const path = `/convert/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: localeUrl(locale, path),
      siteName: 'FlipMyFiles',
      type: 'website',
      images: [OG_IMAGE],
    },
    alternates: buildAlternates(locale, path),
  };
}

export default async function ConversionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const conversion = getConversionBySlug(slug);
  if (!conversion) notFound();

  // Interlink for crawl discovery & relevance: reverse direction first
  // (X→Y links to Y→X), then same-category, then popular cross-category fillers.
  const reverse = allConversions.find(
    c => c.from === conversion.to && c.to === conversion.from && c.slug !== slug,
  );
  const sameCategory = allConversions.filter(
    c => c.category === conversion.category && c.slug !== slug && c.slug !== reverse?.slug,
  );
  const related = [...(reverse ? [reverse] : []), ...sameCategory].slice(0, 6);
  if (related.length < 6) {
    const fillers = popularConversions.filter(
      c => c.slug !== slug && !related.some(r => r.slug === c.slug),
    );
    related.push(...fillers.slice(0, 6 - related.length));
  }

  // BreadcrumbList matching the on-page breadcrumb (Home > Tools > X to Y),
  // with locale-correct URLs and localized labels.
  const t = await getTranslations({ locale, namespace: 'converter' });
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('home'), item: localeUrl(locale, '') },
      { '@type': 'ListItem', position: 2, name: t('tools'), item: localeUrl(locale, '/tools') },
      { '@type': 'ListItem', position: 3, name: `${conversion.from} to ${conversion.to}`, item: localeUrl(locale, `/convert/${slug}`) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ConversionPageTemplate conversion={conversion} related={related} />
    </>
  );
}
