import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import ToolsGrid from '@/components/pages/ToolsGrid';

interface Props {
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: 'All File Conversion Tools — FlipMyFiles',
  description: 'Browse all available file conversion tools. Convert images, videos, audio, and documents between 100+ formats for free.',
  alternates: {
    canonical: 'https://flipmyfiles.com/tools',
  },
};

function ToolsContent() {
  const t = useTranslations('tools');

  const stats = [
    { value: '100+', label: t('stats.formatsSupported') },
    { value: '5', label: t('stats.categories') },
    { value: '0', label: t('stats.signupRequired') },
    { value: '250MB', label: t('stats.maxFileSize') },
  ];

  const categories = [
    { label: t('categories.images'), icon: '🖼️' },
    { label: t('categories.video'), icon: '🎬' },
    { label: t('categories.audio'), icon: '🎵' },
    { label: t('categories.documents'), icon: '📄' },
    { label: t('categories.archives'), icon: '🗜️' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080c14] pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -bottom-10 right-0 h-[250px] w-[250px] rounded-full bg-cta/8 blur-[80px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cta" />
            {t('badge')}
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-primary-light to-cta bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            {t('subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <span
                key={cat.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </span>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 px-6 py-5 backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ToolsGrid />
        </div>
      </div>
    </div>
  );
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToolsContent />;
}
