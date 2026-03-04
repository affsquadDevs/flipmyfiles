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
  const t = await getTranslations({ locale, namespace: 'howItWorksPage' });
  return {
    title: `${t('title')} — FlipMyFiles`,
    description: 'Learn how FlipMyFiles converts your files instantly in three steps. Understand our browser-based and server-side processing methods, privacy handling, and supported formats.',
    alternates: { canonical: 'https://flipmyfiles.com/how-it-works' },
  };
}

function HowItWorksContent() {
  const t = useTranslations('howItWorksPage');

  const steps = [
    {
      step: '01',
      title: t('steps.s1title'),
      description: t('steps.s1desc'),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      color: 'bg-violet-100 text-violet-600',
      badge: 'bg-violet-600',
    },
    {
      step: '02',
      title: t('steps.s2title'),
      description: t('steps.s2desc'),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
      badge: 'bg-blue-600',
    },
    {
      step: '03',
      title: t('steps.s3title'),
      description: t('steps.s3desc'),
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
      badge: 'bg-green-600',
    },
  ];

  const faqs = [
    { q: t('faqs.q1'), a: t('faqs.a1') },
    { q: t('faqs.q2'), a: t('faqs.a2') },
    { q: t('faqs.q3'), a: t('faqs.a3') },
    { q: t('faqs.q4'), a: t('faqs.a4') },
    { q: t('faqs.q5'), a: t('faqs.a5') },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            {t('badge')}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-text-muted">{t('subtitle')}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={`flex flex-col gap-6 sm:flex-row sm:items-start ${index % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-3xl ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-widest text-white ${item.badge}`}>
                    {t('steps.step')} {item.step}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">{item.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processing Methods */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('processing.title')}</h2>
            <p className="mt-3 text-text-muted">{t('processing.subtitle')}</p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {/* Browser-based */}
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                </div>
                <div>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-violet-100 text-violet-700">
                    {t('processing.browser.badge')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{t('processing.browser.title')}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{t('processing.browser.desc')}</p>
              <ul className="mt-5 space-y-2">
                {(['p1', 'p2', 'p3', 'p4'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-text-muted">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t(`processing.browser.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Server-side */}
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <div>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700">
                    {t('processing.server.badge')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{t('processing.server.title')}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{t('processing.server.desc')}</p>
              <ul className="mt-5 space-y-2">
                {(['p1', 'p2', 'p3', 'p4'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm text-text-muted">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t(`processing.server.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('faqs.title')}</h2>
          <div className="mt-8 divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="text-base font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-14 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">{t('cta.title')}</h2>
          <p className="mt-3 text-text-muted">{t('cta.subtitle')}</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:shadow-xl active:scale-[0.98]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HowItWorksContent />;
}
