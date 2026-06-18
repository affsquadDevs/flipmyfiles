import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /api/* are JSON/utility endpoints (convert, formats, stats, metadata-eraser),
      // not indexable pages — keep crawlers off them so crawl budget goes to real pages.
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No `Host:` directive — it's non-standard (only legacy Yandex used it),
    // Google/Bing reject it as an unknown directive. Host preference is handled
    // by self-referencing canonicals + the www→apex 301 redirect.
  };
}
