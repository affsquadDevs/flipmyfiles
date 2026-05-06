import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Root → English home
      { source: '/',                 destination: '/en',               permanent: false },
      // Old English paths without locale prefix → /en/...
      { source: '/blog',             destination: '/en/blog',          permanent: false },
      { source: '/blog/:slug([^.]+)', destination: '/en/blog/:slug',    permanent: false },
      { source: '/tools',            destination: '/en/tools',         permanent: false },
      { source: '/tools/:cat',       destination: '/en/tools/:cat',    permanent: false },
      { source: '/convert',          destination: '/en/convert',       permanent: false },
      { source: '/convert/:slug',    destination: '/en/convert/:slug', permanent: false },
      { source: '/about',            destination: '/en/about',         permanent: false },
      { source: '/contact',          destination: '/en/contact',       permanent: false },
      { source: '/how-it-works',     destination: '/en/how-it-works',  permanent: false },
      { source: '/privacy-policy',   destination: '/en/privacy-policy',permanent: false },
      { source: '/terms-of-service', destination: '/en/terms-of-service', permanent: false },
      { source: '/privacy',          destination: '/en/privacy-policy',permanent: true },
      { source: '/terms',            destination: '/en/terms-of-service', permanent: true },
    ];
  },
  // Required for FFmpeg WASM SharedArrayBuffer support.
  // `credentialless` keeps cross-origin isolation (SharedArrayBuffer still works)
  // while letting third-party iframes (AdSense) load without CORP headers.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  // Externalize packages that have optional deps not available in browser/Vercel
  serverExternalPackages: ['archiver', 'unzipper'],
};

export default withNextIntl(nextConfig);
