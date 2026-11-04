import { defineRouting } from 'next-intl/routing';

export const locales = ['fr', 'en', 'ar', 'ru', 'de'] as const;
export type Locale = (typeof locales)[number];

// Langues écrites de droite à gauche
export const rtlLocales: Locale[] = ['ar'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  // Le français (par défaut) n'est pas préfixé : / ; les autres le sont : /en, /ar…
  localePrefix: 'as-needed',
});
