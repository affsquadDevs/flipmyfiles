import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import TrustBar from '@/components/shared/TrustBar';

export default function HomeHero() {
  const t = useTranslations('home');

  return (
    <section className="relative overflow-hidden bg-[#080c14] pb-20 pt-16 sm:pb-28 sm:pt-24">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cta/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />
      </div>

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 mb-6 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" />
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t('hero.title')}{' '}
          <span className="bg-gradient-to-r from-primary-light via-primary to-cta bg-clip-text text-transparent">
            {t('hero.titleHighlight')}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400 sm:text-xl">
          {t('hero.subtitle')}
        </p>

        {/* Format tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['JPG', 'PNG', 'MP4', 'MP3', 'PDF', 'DOCX', 'WebP', 'GIF'].map((fmt) => (
            <span key={fmt} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-400">
              {fmt}
            </span>
          ))}
          <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-500">
            +90 more
          </span>
        </div>

        {/* CTA button */}
        <div className="mt-10">
          <Link
            href="/convert"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-white shadow-lg shadow-primary/40 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {t('ctaButton')}
          </Link>
          <p className="mt-3 text-xs text-gray-500">{t('ctaSubtext')}</p>
        </div>

        {/* Trust bar */}
        <div className="mt-12">
          <TrustBar dark />
        </div>
      </div>
    </section>
  );
}
