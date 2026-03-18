import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';
import VideoUniqualizerTool from '@/components/tools/VideoUniqualizerTool';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Video Uniqualizer — Make Your Video Unique | FlipMyFiles';
  const description = 'Re-encode your video with subtle imperceptible changes to give it a unique digital fingerprint. Strips metadata, adjusts color and brightness. Free, private, browser-based.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://flipmyfiles.com/tools/video-uniqualizer',
      siteName: 'FlipMyFiles',
      type: 'website',
    },
    alternates: {
      canonical: 'https://flipmyfiles.com/tools/video-uniqualizer',
    },
  };
}

function PageContent() {
  const t = useTranslations('uniqualizer');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080c14] pb-36 pt-12 sm:pb-40 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-rose-500/15 blur-[130px]" />
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
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            {t('badge')}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t('heroTitle')}{' '}
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              {t('heroHighlight')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-400">
            {t('heroSubtitle')}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span>🎬</span><span>{t('trust1')}</span></span>
            <span className="flex items-center gap-1.5"><span>🔒</span><span>{t('trust2')}</span></span>
            <span className="flex items-center gap-1.5"><span>👁️</span><span>{t('trust3')}</span></span>
            <span className="flex items-center gap-1.5"><span>📦</span><span>{t('trust4')}</span></span>
          </div>
        </div>
      </section>

      {/* Tool card */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <VideoUniqualizerTool />

        {/* Privacy note */}
        <p className="mt-4 text-center text-xs text-text-muted">
          🔒 {t('privacyNote')}
        </p>
      </div>

      {/* What it does */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('whatIsTitle')}</h2>
              <p className="mt-4 text-text-muted leading-relaxed">{t('whatIsBody1')}</p>
              <p className="mt-3 text-text-muted leading-relaxed">{t('whatIsBody2')}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(['metadata', 'color', 'encode', 'output'] as const).map((key) => (
                <div key={key} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="font-semibold text-gray-900">{t(`feat.${key}.title`)}</p>
                  <p className="mt-1 text-sm text-text-muted">{t(`feat.${key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intensity levels */}
      <section className="bg-gray-50/60 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t('intensityTitle')}</h2>
          <p className="mt-3 text-center text-text-muted">{t('intensitySubtitle')}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <div key={level} className="rounded-2xl border border-border bg-white p-6 shadow-sm text-center">
                <p className="text-lg font-bold text-gray-900 capitalize">{t(level)}</p>
                <p className="mt-2 text-sm text-text-muted">{t(`${level}Desc`)}</p>
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

export default async function VideoUniqualizerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PageContent />;
}
