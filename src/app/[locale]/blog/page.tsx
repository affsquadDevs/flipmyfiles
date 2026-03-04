import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getBlogPostsForLocale } from '@/data/blog-i18n';
import BlogPageClient from './BlogPageClient';
import type { BlogPost } from '@/data/blog-posts';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts: BlogPost[] = await getBlogPostsForLocale(locale);
  return <BlogPageClient posts={posts} />;
}
