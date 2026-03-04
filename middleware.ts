import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /static (static files)
    // - Files with extensions (e.g. /favicon.ico, /robots.txt)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
