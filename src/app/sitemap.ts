import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${l}`;
  }

  return routing.locales.map((l) => ({
    url: l === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${l}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: l === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
