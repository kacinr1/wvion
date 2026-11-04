import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Toutes les routes sauf API, assets Next, fichiers de métadonnées
  // (OG image, favicon, sitemap, robots) et fichiers avec extension.
  matcher: ['/((?!api|_next|_vercel|opengraph-image|icon|sitemap|robots|.*\\..*).*)'],
};
