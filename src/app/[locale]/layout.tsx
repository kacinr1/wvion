import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Bodoni_Moda, Jost } from 'next/font/google';
import { routing, rtlLocales, type Locale } from '@/i18n/routing';
import { SITE_URL, business } from '@/lib/site';
import '../globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === routing.defaultLocale ? '/' : `/${locale}`;
  const languages: Record<string, string> = {
    'x-default': '/',
  };
  for (const l of routing.locales) {
    languages[l] = l === routing.defaultLocale ? '/' : `/${l}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('description'),
    alternates: { canonical: path, languages },
    openGraph: {
      type: 'website',
      siteName: 'WVion Services',
      title: t('title'),
      description: t('description'),
      url: path,
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });
  const dir = rtlLocales.includes(locale as Locale) ? 'rtl' : 'ltr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LimousineService',
    name: business.name,
    legalName: business.legalName,
    url: SITE_URL,
    description: t('description'),
    foundingDate: business.foundingDate,
    vatID: business.vatID,
    telephone: business.telephone,
    email: business.email,
    image: `${SITE_URL}/media/hero-poster.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.streetAddress,
      postalCode: business.postalCode,
      addressLocality: business.locality,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: business.areaServed,
    availableLanguage: business.languages,
    openingHours: 'Mo-Su 00:00-24:00',
    priceRange: '$$$$',
  };

  return (
    <html lang={locale} dir={dir} className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
