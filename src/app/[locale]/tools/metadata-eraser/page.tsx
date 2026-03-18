import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import MetadataEraserTool from '@/components/tools/MetadataEraserTool';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Metadata Eraser — Remove EXIF & Hidden Data | FlipMyFiles';
  const description = 'Strip EXIF data, GPS location, camera info, author details, and other hidden metadata from images, PDFs, videos, and audio files. Free, private, no signup.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://flipmyfiles.com/tools/metadata-eraser',
      siteName: 'FlipMyFiles',
      type: 'website',
    },
    alternates: {
      canonical: 'https://flipmyfiles.com/tools/metadata-eraser',
    },
  };
}

function PageContent() {
  const t = useTranslations('metadataEraser');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080c14] pb-36 pt-12 sm:pb-40 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t('badge')}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-primary-light to-cta bg-clip-text text-transparent">
              {t('heroHighlight')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            {t('heroSubtitle')}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span>🔒</span><span>{t('trust1')}</span></span>
            <span className="flex items-center gap-1.5"><span>🗑️</span><span>{t('trust2')}</span></span>
            <span className="flex items-center gap-1.5"><span>✅</span><span>{t('trust3')}</span></span>
            <span className="flex items-center gap-1.5"><span>📦</span><span>{t('trust4')}</span></span>
          </div>
        </div>
      </section>

      {/* Tool card */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <MetadataEraserTool />

        {/* Privacy note */}
        <p className="mt-4 text-center text-xs text-text-muted">
          🔒 {t('privacyNote')}
        </p>
      </div>

      {/* What is metadata */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('whatIsTitle')}</h2>
              <p className="mt-4 text-text-muted leading-relaxed">{t('whatIsBody1')}</p>
              <p className="mt-3 text-text-muted leading-relaxed">{t('whatIsBody2')}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(['exif', 'gps', 'author', 'software'] as const).map((key) => (
                <div key={key} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-semibold text-gray-900">{t(`meta.${key}.title`)}</p>
                  <p className="mt-1 text-sm text-text-muted">{t(`meta.${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t('howTitle')}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="flex flex-col items-center text-center rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {n}
                </div>
                <p className="mt-4 font-semibold text-gray-900">{t(`step${n}Title`)}</p>
                <p className="mt-2 text-sm text-text-muted">{t(`step${n}Body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t('faqTitle')}</h2>
          <div className="mt-8 divide-y divide-border">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n} className="py-5">
                <p className="font-semibold text-gray-900">{t(`faq${n}Q`)}</p>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{t(`faq${n}A`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function MetadataEraserPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PageContent />;
}
