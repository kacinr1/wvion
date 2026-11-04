'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

const ACCENT = '#C9A96E';

export function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <div style={{ display: 'flex', gap: 4 }} aria-label="Langue">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() =>
            startTransition(() => router.replace(pathname, { locale: l }))
          }
          aria-current={l === active ? 'true' : undefined}
          style={{
            background: 'none',
            border: 'none',
            padding: '10px 6px',
            minHeight: 44,
            fontSize: 12,
            letterSpacing: '0.12em',
            color: l === active ? ACCENT : '#8E897F',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
