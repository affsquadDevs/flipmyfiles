import { blogPosts, BlogPost } from './blog-posts';

interface BlogTranslation {
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
}

async function loadLocaleTranslations(locale: string): Promise<Record<string, BlogTranslation>> {
  if (locale === 'en') return {};
  try {
    const data = await import(`@/data/blog/${locale}.json`);
    return data.default as Record<string, BlogTranslation>;
  } catch {
    return {};
  }
}

export async function getBlogPostsForLocale(locale: string): Promise<BlogPost[]> {
  const translations = await loadLocaleTranslations(locale);
  return blogPosts.map(post => {
    const t = translations[post.slug];
    if (!t) return post;
    return {
      ...post,
      title: t.title ?? post.title,
      excerpt: t.excerpt ?? post.excerpt,
      content: t.content ?? post.content,
      ...(t.metaTitle && { metaTitle: t.metaTitle }),
      ...(t.metaDescription && { metaDescription: t.metaDescription }),
    };
  });
}

export async function getPostBySlugForLocale(locale: string, slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPostsForLocale(locale);
  return posts.find(p => p.slug === slug);
}
