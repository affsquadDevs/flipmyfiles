import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { BlogPost } from '@/data/blog-posts';

interface Props {
  posts: Pick<BlogPost, 'slug' | 'title' | 'excerpt' | 'readTime'>[];
}

export default function RelatedPosts({ posts }: Props) {
  const t = useTranslations('blog');
  if (posts.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('relatedArticles')}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-cta/30 hover:shadow-md dark:border-border-dark dark:bg-card-dark"
          >
            <h3 className="font-bold text-gray-900 group-hover:text-cta dark:text-white">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-text-muted">{p.excerpt}</p>
            <span className="mt-3 text-xs text-text-muted">{p.readTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
