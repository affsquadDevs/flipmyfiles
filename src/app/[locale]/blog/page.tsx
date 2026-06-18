import { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { buildAlternates, localeUrl, OG_IMAGE } from '@/lib/seo';
import { getBlogPostsForLocale } from '@/data/blog-i18n';
import ProgressBadge from './ProgressBadge';
import type { BlogPost } from '@/data/blog-posts';

const PER_PAGE = 5;

const categoryColors: Record<string, string> = {
  Guides:  'bg-violet-100 text-violet-700',
  Tips:    'bg-blue-100 text-blue-700',
  Formats: 'bg-emerald-100 text-emerald-700',
  Updates: 'bg-amber-100 text-amber-700',
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

function clampPage(value: string | undefined, totalPages: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(Math.floor(n), totalPages);
}

/** href for a given page: page 1 is the bare /blog, deeper pages carry ?page=N. */
function pageHref(page: number) {
  return page <= 1 ? '/blog' : { pathname: '/blog' as const, query: { page } };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const page = Math.max(1, Math.floor(Number(pageParam)) || 1);

  const title = page > 1
    ? `${t('title')} — ${t('page')} ${page} — FlipMyFiles`
    : `${t('title')} — FlipMyFiles`;
  const description = t('subtitle');

  // Self-referential canonical + hreflang; paginated views carry ?page=N.
  const alternates = buildAlternates(locale, '/blog');
  if (page > 1) {
    const q = `?page=${page}`;
    alternates.canonical = `${alternates.canonical as string}${q}`;
    const languages = alternates.languages as Record<string, string>;
    for (const key of Object.keys(languages)) languages[key] = `${languages[key]}${q}`;
  }

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: `${localeUrl(locale, '/blog')}${page > 1 ? `?page=${page}` : ''}`,
      siteName: 'FlipMyFiles',
      type: 'website',
      images: [OG_IMAGE],
    },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { page: pageParam } = await searchParams;

  const posts: BlogPost[] = await getBlogPostsForLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const page = clampPage(pageParam, totalPages);
  const pagePosts = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const featured = pagePosts[0];
  const rest = pagePosts.slice(1);

  const dateFmt = (d: string, month: 'long' | 'short') =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric' });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#080c14] pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-cta">{t('label')}</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {pagePosts.length === 0 ? (
            <div className="mt-16 flex flex-col items-center py-10 text-center">
              <p className="text-lg font-semibold text-gray-900">{t('noArticles')}</p>
              <p className="mt-2 text-sm text-text-muted">{t('noArticlesSubtitle')}</p>
              <Link
                href="/blog"
                className="mt-5 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t('viewAll')}
              </Link>
            </div>
          ) : (
            <>
              {/* Featured — first article, full width */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-xl lg:grid-cols-2"
                >
                  {featured.coverImage ? (
                    <div className="relative min-h-48 overflow-hidden lg:min-h-0">
                      <Image
                        src={featured.coverImage}
                        alt={featured.coverImageAlt ?? featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex min-h-48 items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-10 lg:min-h-0">
                      <svg className="h-20 w-20 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col justify-between p-8 lg:p-10">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {featured.category}
                        </span>
                        <span className="text-xs text-text-muted">{featured.readTime}</span>
                        <ProgressBadge slug={featured.slug} />
                      </div>
                      <h2 className="mt-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary sm:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-text-muted">{featured.excerpt}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                      <time className="text-xs text-text-muted">{dateFmt(featured.date, 'long')}</time>
                      <span className="flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                        {t('readMore')}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest — 2 columns */}
              {rest.length > 0 && (
                <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                    >
                      {post.coverImage ? (
                        <div className="w-full overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.coverImageAlt ?? post.title}
                            width={1536}
                            height={1024}
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary-dark" />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                            {post.category}
                          </span>
                          <span className="text-xs text-text-muted">{post.readTime}</span>
                          <ProgressBadge slug={post.slug} />
                        </div>
                        <h2 className="mt-3 flex-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary">
                          {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                          <time className="text-xs text-text-muted">{dateFmt(post.date, 'short')}</time>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-primary transition-all group-hover:gap-2.5">
                            {t('readMore')}
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination — real crawlable links */}
              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Blog pagination">
                  {page > 1 ? (
                    <Link
                      href={pageHref(page - 1)}
                      rel="prev"
                      className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:px-5 sm:py-2 sm:text-sm"
                    >
                      {t('previous')}
                    </Link>
                  ) : (
                    <span className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-gray-400 opacity-40 sm:px-5 sm:py-2 sm:text-sm">
                      {t('previous')}
                    </span>
                  )}
                  <span className="text-sm text-text-muted">
                    {t('page')} {page} {t('of')} {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={pageHref(page + 1)}
                      rel="next"
                      className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:px-5 sm:py-2 sm:text-sm"
                    >
                      {t('next')}
                    </Link>
                  ) : (
                    <span className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-gray-400 opacity-40 sm:px-5 sm:py-2 sm:text-sm">
                      {t('next')}
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
