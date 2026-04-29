import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function HomeProjectSpotlight() {
  const t = useTranslations('home.openSourceSpotlight');

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#10182e] via-[#0c1630] to-[#0a1226] p-6 shadow-2xl shadow-primary/20 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-cta/15 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
                {t('badge')}
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t('title')}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {t('description')}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/affsquadDevs/flipmyfiles"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5a12 12 0 00-3.79 23.39c.6.12.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.74-1.33-1.74-1.08-.75.08-.74.08-.74 1.2.09 1.83 1.22 1.83 1.22 1.06 1.8 2.8 1.28 3.48.98.11-.76.42-1.28.76-1.57-2.66-.3-5.47-1.32-5.47-5.89 0-1.3.47-2.36 1.22-3.2-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.6 11.6 0 016 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.2 0 4.58-2.81 5.58-5.49 5.88.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0012 .5z" />
                  </svg>
                  {t('githubButton')}
                </a>
                <a
                  href="https://github.com/affsquadDevs/flipmyfiles/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
                >
                  {t('reportButton')}
                </a>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
                >
                  {t('docsButton')}
                </Link>
              </div>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary-light">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5a12 12 0 00-3.79 23.39c.6.12.82-.26.82-.58v-2.03c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.74-1.33-1.74-1.08-.75.08-.74.08-.74 1.2.09 1.83 1.22 1.83 1.22 1.06 1.8 2.8 1.28 3.48.98.11-.76.42-1.28.76-1.57-2.66-.3-5.47-1.32-5.47-5.89 0-1.3.47-2.36 1.22-3.2-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.22a11.6 11.6 0 016 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.66.24 2.88.12 3.18.76.84 1.22 1.9 1.22 3.2 0 4.58-2.81 5.58-5.49 5.88.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0012 .5z" />
              </svg>
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-2">
            {['Next.js', 'TypeScript', 'React', 'FFmpeg (WASM)', 'Sharp', 'Tailwind'].map((tech) => (
              <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
