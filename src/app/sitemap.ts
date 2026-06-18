import { MetadataRoute } from 'next';
import { allConversions, categories } from '@/config/formats.config';
import { blogPosts } from '@/data/blog-posts';
import { routing } from '@/i18n/routing';
import { SITE_URL, hreflangMap } from '@/lib/seo';

/**
 * One sitemap entry is emitted per (locale × path) using the real,
 * locale-prefixed URLs that return 200 (localePrefix is 'always', so the
 * bare non-prefixed paths only 302-redirect and must NOT be listed). Each
 * entry carries the full hreflang alternates map (every locale + x-default).
 *
 * `lastModified` is only set where we have a genuine modification signal
 * (blog posts). Setting `new Date()` everywhere would falsely claim the whole
 * site changed on every deploy and teaches Google to distrust <lastmod>.
 */
interface PathEntry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  lastModified?: string | Date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: PathEntry[] = [
    { path: '',                   changeFrequency: 'weekly',  priority: 1.0 },
    { path: '/tools',             changeFrequency: 'weekly',  priority: 0.9 },
    { path: '/tools/metadata-eraser',   changeFrequency: 'monthly', priority: 0.7 },
    { path: '/tools/video-uniqualizer', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/how-it-works',      changeFrequency: 'monthly', priority: 0.7 },
    { path: '/blog',              changeFrequency: 'weekly',  priority: 0.7 },
    { path: '/about',             changeFrequency: 'monthly', priority: 0.5 },
    { path: '/contact',           changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy-policy',    changeFrequency: 'yearly',  priority: 0.3 },
    { path: '/terms-of-service',  changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const categoryPaths: PathEntry[] = categories.map(cat => ({
    path: `/tools/${cat.id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const conversionPaths: PathEntry[] = allConversions.map(conversion => ({
    path: `/convert/${conversion.slug}`,
    changeFrequency: 'monthly',
    priority: conversion.popular ? 0.8 : 0.6,
  }));

  const blogPaths: PathEntry[] = blogPosts.map(post => ({
    path: `/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
    lastModified: new Date(post.dateModified ?? post.date),
  }));

  const allPaths = [...staticPaths, ...categoryPaths, ...conversionPaths, ...blogPaths];

  // Expand every path into one entry per locale, each annotated with the full
  // hreflang alternates so Google can cluster the localized variants.
  return allPaths.flatMap(entry => {
    const languages = hreflangMap(entry.path);
    return routing.locales.map(locale => ({
      url: `${SITE_URL}/${locale}${entry.path}`,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      alternates: { languages },
    }));
  });
}
