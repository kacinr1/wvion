'use client';

import { useTranslations } from 'next-intl';

const ACCENT = '#C9A96E';

export function Strip() {
  const t = useTranslations('strip');
  const items = [
    { v: t('s1v'), l: t('s1l') },
    { v: t('s2v'), l: t('s2l') },
    { v: t('s3v'), l: t('s3l') },
    { v: t('s4v'), l: t('s4l') },
  ];

  return (
    <section style={{ borderTop: '1px solid #1E1B16', borderBottom: '1px solid #1E1B16' }}>
      <div
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '36px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        {items.map((it, i) => (
          <div key={i}>
            <div className="wv-serif" style={{ fontSize: 40, color: ACCENT }}>
              {it.v}
            </div>
            <div style={{ fontSize: 12, letterSpacing: '0.2em', color: '#A39E94', textTransform: 'uppercase', marginTop: 6 }}>
              {it.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
