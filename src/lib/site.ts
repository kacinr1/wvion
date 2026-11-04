// Infos centrales du site, réutilisées pour les métadonnées et le JSON-LD.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://wvion.vercel.app';

export const business = {
  name: 'WVion Services',
  legalName: 'WVion Services Sàrl',
  streetAddress: 'Allée des Grenouilles 3',
  postalCode: '1219',
  locality: 'Châtelaine',
  region: 'Genève',
  country: 'CH',
  vatID: 'CHE-421.634.804',
  foundingDate: '2016',
  telephone: '+41 78 897 83 53',
  email: 'WVionservice@hotmail.com',
  areaServed: ['Genève', 'Suisse', 'Courchevel', 'Verbier', 'Gstaad', 'Zermatt', 'Megève', 'Monaco'],
  languages: ['fr', 'en', 'ar', 'ru', 'de'],
} as const;
