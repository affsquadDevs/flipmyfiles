import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BlogPost, getAllSlugs } from '@/data/blog-posts';
import { getPostBySlugForLocale } from '@/data/blog-i18n';
import ReadingProgressBar from '@/components/ui/ReadingProgressBar';
import FaqAccordion from '@/components/blog/FaqAccordion';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap(locale =>
    getAllSlugs().map(slug => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlugForLocale(locale, slug);
  if (!post) return { title: 'Not Found' };

  return {
    title: post.metaTitle ?? `${post.title} — FlipMyFiles`,
    description: post.metaDescription ?? post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `https://flipmyfiles.com/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      siteName: 'FlipMyFiles',
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      url: `https://flipmyfiles.com/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.dateModified ?? post.date,
      tags: post.keywords,
      ...(post.coverImage && {
        images: [{
          url: `https://flipmyfiles.com${post.coverImage}`,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt ?? post.title,
        }],
      }),
    },
  };
}

function parseInline(text: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={i++} href={match[2]} className="text-primary underline underline-offset-2 hover:text-primary-dark">
        {match[1]}
      </Link>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    const rows = tableBuffer.filter((l) => !l.match(/^\|[-| ]+\|$/));
    elements.push(
      <div key={`table-${i}`} className="my-6 overflow-x-auto">
        <table className="min-w-full rounded-xl border border-border text-sm">
          <thead>
            <tr className="bg-gray-50">
              {rows[0].split('|').filter(Boolean).map((cell, ci) => (
                <th key={ci} className="border border-border px-4 py-2 text-left font-semibold text-gray-900">
                  {cell.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.split('|').filter(Boolean).map((cell, ci) => (
                  <td key={ci} className="border border-border px-4 py-2 text-gray-700">
                    {parseInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('|')) {
      tableBuffer.push(line);
      i++;
      continue;
    } else {
      flushTable();
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-gray-900">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="mt-8 mb-3 text-xl font-semibold text-gray-900">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="mt-4 font-semibold text-gray-900">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- ')) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(
          <li key={i} className="text-gray-600">
            {parseInline(lines[i].slice(2))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 list-disc space-y-2 pl-6">
          {listItems}
        </ul>
      );
      continue;
    } else if (line.trim() === '') {
      // skip blank lines
    } else {
      elements.push(
        <p key={i} className="mt-4 leading-relaxed text-gray-600">
          {parseInline(line)}
        </p>
      );
    }
    i++;
  }

  flushTable();
  return elements;
}

function extractFaqs(content: string): { q: string; a: string }[] {
  const faqSection = content.split('## Frequently Asked Questions')[1];
  if (!faqSection) return [];
  const lines = faqSection.trim().split('\n').filter(Boolean);
  const faqs: { q: string; a: string }[] = [];
  let j = 0;
  while (j < lines.length) {
    if (lines[j].startsWith('**') && lines[j].endsWith('**')) {
      const q = lines[j].slice(2, -2);
      const a = lines[j + 1] ?? '';
      faqs.push({ q, a });
      j += 2;
    } else {
      j++;
    }
  }
  return faqs;
}

function BlogContent({ post }: { post: BlogPost }) {
  const t = useTranslations('blog');

  const faqs = extractFaqs(post.content);
  const contentWithoutFaq = post.content.split('## Frequently Asked Questions')[0];

  return (
    <div>
      {post.schemas?.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ReadingProgressBar slug={post.slug} />

      {/* Hero */}
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
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">{t('home')}</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/blog" className="hover:text-gray-300 transition-colors">{t('label')}</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="truncate text-gray-300">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary-light">
              {post.category}
            </span>
            <span className="text-xs text-gray-500">{post.readTime}</span>
            <span className="text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-400">{post.excerpt}</p>
        </div>
      </section>

      {post.coverImage && (
        <div className="bg-white">
          <div className="relative z-20 mx-auto -mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </div>
      )}

      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="prose-custom">
            {renderContent(contentWithoutFaq)}
          </article>
        </div>
      </div>

      {faqs.length > 0 && (
        <div className="bg-blue-50 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900">{t('faq')}</h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      )}
    </div>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlugForLocale(locale, slug);
  if (!post) notFound();

  return <BlogContent post={post} />;
}
