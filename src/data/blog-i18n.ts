import { blogPosts, BlogPost } from './blog-posts';

interface BlogTranslation {
  title?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const localeImports: Record<string, () => Promise<{ default: Record<string, BlogTranslation> }>> = {
  pl: () => import('@/data/blog/pl.json'),
  el: () => import('@/data/blog/el.json'),
  es: () => import('@/data/blog/es.json'),
  pt: () => import('@/data/blog/pt.json'),
  de: () => import('@/data/blog/de.json'),
  fr: () => import('@/data/blog/fr.json'),
  se: () => import('@/data/blog/se.json'),
  it: () => import('@/data/blog/it.json'),
  ua: () => import('@/data/blog/ua.json'),
  cz: () => import('@/data/blog/cz.json'),
};

async function loadLocaleTranslations(locale: string): Promise<Record<string, BlogTranslation>> {
  if (locale === 'en' || !localeImports[locale]) return {};
  try {
    const data = await localeImports[locale]();
    return data.default;
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
