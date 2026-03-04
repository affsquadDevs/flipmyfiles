import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { allConversions, getConversionBySlug } from '@/config/formats.config';
import { routing } from '@/i18n/routing';
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
  const { slug } = await params;
  const conversion = getConversionBySlug(slug);
  if (!conversion) return { title: 'Not Found' };

  const title = `Convert ${conversion.from} to ${conversion.to} — Free Online Converter | FlipMyFiles`;
  const description = `${conversion.description}. Free, fast, and secure ${conversion.from} to ${conversion.to} conversion. No signup required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://flipmyfiles.com/convert/${slug}`,
      siteName: 'FlipMyFiles',
      type: 'website',
    },
    alternates: {
      canonical: `https://flipmyfiles.com/convert/${slug}`,
    },
  };
}

export default async function ConversionPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const conversion = getConversionBySlug(slug);
  if (!conversion) notFound();

  const related = allConversions
    .filter(c => c.category === conversion.category && c.slug !== slug)
    .slice(0, 6);

  return <ConversionPageTemplate conversion={conversion} related={related} />;
}
