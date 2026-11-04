import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Dict = Record<string, any>;

/** Fusion profonde : une langue peut n'être traduite que partiellement,
 * tout ce qui manque retombe sur le FR de référence. */
function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = Array.isArray(base) ? [...(base as unknown[])] as unknown as Dict : { ...base };
  for (const key of Object.keys(override)) {
    const b = (out as Dict)[key];
    const o = override[key];
    if (
      b && o && typeof b === 'object' && typeof o === 'object' &&
      !Array.isArray(b) && !Array.isArray(o)
    ) {
      (out as Dict)[key] = deepMerge(b as Dict, o as Dict);
    } else {
      (out as Dict)[key] = o;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? requested
      : routing.defaultLocale;

  const fr = (await import('./messages/fr.json')).default as Dict;
  const messages =
    locale === 'fr'
      ? fr
      : deepMerge(fr, (await import(`./messages/${locale}.json`)).default as Dict);

  return { locale, messages };
});
