import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Root → English home
      { source: '/',                 destination: '/en',               permanent: true },
      // Old English paths without locale prefix → /en/...
      { source: '/blog',             destination: '/en/blog',          permanent: true },
      { source: '/blog/:slug([^.]+)', destination: '/en/blog/:slug',    permanent: true },
      { source: '/tools',            destination: '/en/tools',         permanent: true },
      { source: '/tools/:cat',       destination: '/en/tools/:cat',    permanent: true },
      { source: '/convert',          destination: '/en/convert',       permanent: true },
      { source: '/convert/:slug',    destination: '/en/convert/:slug', permanent: true },
      { source: '/about',            destination: '/en/about',         permanent: true },
      { source: '/contact',          destination: '/en/contact',       permanent: true },
      { source: '/how-it-works',     destination: '/en/how-it-works',  permanent: true },
      { source: '/privacy-policy',   destination: '/en/privacy-policy',permanent: true },
      { source: '/terms-of-service', destination: '/en/terms-of-service', permanent: true },
      { source: '/privacy',          destination: '/en/privacy-policy',permanent: true },
      { source: '/terms',            destination: '/en/terms-of-service', permanent: true },
    ];
  },
  // COEP/COOP are required for FFmpeg WASM SharedArrayBuffer support, but
  // they block AdSense iframes from loading. Scope them to ONLY the routes
  // that actually need SharedArrayBuffer (conversion + media tools), so the
  // rest of the site (home, blog, about, etc.) can display ads.
  async headers() {
    const isolationHeaders = [
      { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      { key: 'Cross-Origin-Opener-Policy',   value: 'same-origin'    },
    ];
    // Baseline security/trust headers applied site-wide. Deliberately NO CSP and
    // NO Permissions-Policy restriction on ad-related features (e.g. browsing-topics),
    // so Google Tag Manager and AdSense keep working.
    const securityHeaders = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'X-Content-Type-Options',    value: 'nosniff' },
      { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
    ];
    return [
      { source: '/(.*)',                            headers: securityHeaders },
      { source: '/:locale/convert/:slug*',          headers: isolationHeaders },
      { source: '/:locale/tools/metadata-eraser',   headers: isolationHeaders },
      { source: '/:locale/tools/video-uniqualizer', headers: isolationHeaders },
    ];
  },
  // Externalize packages that have optional deps not available in browser/Vercel
  serverExternalPackages: ['archiver', 'unzipper'],
};

export default withNextIntl(nextConfig);
