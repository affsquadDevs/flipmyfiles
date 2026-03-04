import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: `${t('title')} ${t('titleHighlight')} — FlipMyFiles`,
    description: 'Learn about FlipMyFiles, a free browser-based file conversion tool. We support images, videos, audio, and documents with a focus on privacy and ease of use.',
    alternates: { canonical: 'https://flipmyfiles.com/about' },
  };
}

function AboutContent() {
  const t = useTranslations('about');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080c14] pb-16 pt-14 sm:pb-20 sm:pt-20">
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
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" />
            {t('badge')}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-primary-light to-cta bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 text-text-muted leading-relaxed">
            <p className="text-lg">{t('intro')}</p>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('mission.title')}</h2>
              <p className="mt-3">{t('mission.text')}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('why.title')}</h2>
              <p className="mt-3">{t('why.p1')}</p>
              <p className="mt-3">{t('why.p2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('whatWeSupport.title')}</h2>
              <p className="mt-3">{t('whatWeSupport.intro')}</p>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li><strong className="text-gray-900">{t('whatWeSupport.images')}</strong></li>
                <li><strong className="text-gray-900">{t('whatWeSupport.video')}</strong></li>
                <li><strong className="text-gray-900">{t('whatWeSupport.audio')}</strong></li>
                <li><strong className="text-gray-900">{t('whatWeSupport.documents')}</strong></li>
                <li><strong className="text-gray-900">{t('whatWeSupport.archives')}</strong></li>
              </ul>
              <p className="mt-3">{t('whatWeSupport.processing')}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('privacy.title')}</h2>
              <p className="mt-3">{t('privacy.intro')}</p>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>{t('privacy.point1')}</li>
                <li>{t('privacy.point2')}</li>
                <li>{t('privacy.point3')}</li>
                <li>{t('privacy.point4')}</li>
                <li>{t('privacy.point5')}</li>
              </ul>
              <p className="mt-3">
                {t('privacy.readMore')}{' '}
                <Link href="/privacy-policy" className="text-primary hover:text-cta">
                  {t('privacy.privacyLink')}
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('limitations.title')}</h2>
              <p className="mt-3">{t('limitations.intro')}</p>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>{t('limitations.point1')}</li>
                <li>{t('limitations.point2')}</li>
                <li>{t('limitations.point3')}</li>
                <li>{t('limitations.point4')}</li>
                <li>{t('limitations.point5')}</li>
              </ul>
              <p className="mt-3">
                {t('limitations.contact')}{' '}
                <Link href="/contact" className="text-primary hover:text-cta">
                  {t('limitations.contactLink')}
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900">{t('technology.title')}</h2>
              <p className="mt-3">{t('technology.text')}</p>
            </section>

            {/* Tech stack block */}
            <div className="rounded-2xl bg-[#0d1117] p-8 border border-white/8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/20">
                  <svg className="h-8 w-8 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{t('technology.cardTitle')}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{t('technology.cardText')}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/how-it-works"
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      {t('technology.howItWorksBtn')}
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10"
                    >
                      {t('technology.reportIssueBtn')}
                    </Link>
                    <Link
                      href="/privacy-policy"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-sm font-semibold text-gray-300 transition-all hover:bg-white/10"
                    >
                      {t('technology.privacyBtn')}
                    </Link>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-600">{t('technology.builtWith')}</span>
                    {['Next.js', 'TypeScript', 'React', 'Sharp', 'FFmpeg', 'WebAssembly', 'Tailwind CSS'].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs font-medium text-gray-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}
