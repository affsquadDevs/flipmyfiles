import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categories, getConversionsByCategory } from '@/config/formats.config';
import { ConversionAppIcon } from '@/components/shared/ConversionAppIcon';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    categories.map(c => ({ locale, category: c.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find(c => c.id === category);
  if (!cat) return { title: 'Not Found' };

  return {
    title: `${cat.name} Conversion Tools — FlipMyFiles`,
    description: `${cat.description}. Free online ${cat.name.toLowerCase()} converter with no signup required.`,
  };
}

interface ContentProps {
  category: string;
}

function CategoryContent({ category }: ContentProps) {
  const t = useTranslations('tools');
  const cat = categories.find(c => c.id === category);
  if (!cat) return null;

  const conversions = getConversionsByCategory(category);

  return (
    <div>
      <section className="relative overflow-hidden bg-[#080c14] pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <nav className="mb-6 flex justify-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">{t('categoryPage.converters')}</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-gray-300 transition-colors">{t('titleHighlight')}</Link>
            <span>/</span>
            <span className="text-gray-300">{cat.name}</span>
          </nav>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm">
            {cat.icon}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {cat.name}{' '}
            <span className="bg-gradient-to-r from-primary-light to-cta bg-clip-text text-transparent">
              {t('categoryPage.converters')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">{cat.description}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" />
            {t('convertersAvailable', { count: conversions.length })}
          </div>
        </div>
      </section>

      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {conversions.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {conversions.map(c => (
                <Link
                  key={c.slug}
                  href={`/convert/${c.slug}`}
                  className="group flex flex-col items-center rounded-2xl border border-border bg-white p-5 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
                >
                  <ConversionAppIcon from={c.from} to={c.to} />
                  <p className="mt-3 text-sm font-bold text-gray-900">
                    {c.from} to {c.to}
                  </p>
                  <p className="mt-1 text-xs text-text-muted line-clamp-2">{c.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted">
              {t('categoryPage.noConversions')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = categories.find(c => c.id === category);
  if (!cat) notFound();

  return <CategoryContent category={category} />;
}
