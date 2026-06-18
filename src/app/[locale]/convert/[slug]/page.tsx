import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { allConversions, popularConversions, getConversionBySlug } from '@/config/formats.config';
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
  // English keeps its strong, unique transactional copy. Other locales are
  // built from already-translated converter strings (howToConvert/online/
  // freeSecure) so the title & description are in the user's language.
  let title: string;
  let description: string;
  if (locale === routing.defaultLocale) {
    title = `Convert ${from} to ${to} — Free Online Converter | FlipMyFiles`;
    description = `${conversion.description}. Free, fast, and secure ${from} to ${to} conversion. No signup required.`;
  } else {
    const t = await getTranslations({ locale, namespace: 'converter' });
    title = `${t('howToConvert', { from, to })} ${t('online')} | FlipMyFiles`;
    description = `${t('howToConvert', { from, to })} ${t('online')}. ${t('freeSecure')}`;
  }
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
