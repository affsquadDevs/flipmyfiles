import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import HomeHero from '@/components/pages/HomeHero';
import PopularConversions from '@/components/pages/PopularConversions';
import HowItWorks from '@/components/pages/HowItWorks';
import SupportedFormats from '@/components/pages/SupportedFormats';
import SecuritySection from '@/components/pages/SecuritySection';
import HomeFAQ from '@/components/pages/HomeFAQ';
import StatsBanner from '@/components/pages/StatsBanner';
import { Link } from '@/i18n/navigation';

interface Props {
  params: Promise<{ locale: string }>;
}

function HomeContent() {
  const t = useTranslations('home');
  return (
    <>
      <HomeHero />
      <HowItWorks />
      <SupportedFormats />
      <PopularConversions />
      <SecuritySection />
      <StatsBanner />
      <HomeFAQ />

      {/* Closing CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-5 py-10 shadow-xl shadow-primary/20 sm:px-8 sm:py-14">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t('cta.title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-indigo-200">
              {t('cta.subtitle')}
            </p>
            <a
              href="#main-content"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {t('cta.button')}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}
