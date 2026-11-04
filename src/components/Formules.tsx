'use client';

import { useTranslations } from 'next-intl';

const ACCENT = '#C9A96E';

interface Card {
  num: string;
  name: string;
  desc: string;
  price: 'fromPrice' | 'onQuote';
  featured?: boolean;
}

export function Formules() {
  const t = useTranslations('formules');
  const cards = t.raw('cards') as Card[];

  return (
    <section style={{ maxWidth: 1320, margin: '0 auto', padding: '120px 32px 40px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 24,
          marginBottom: 56,
        }}
      >
        <h2 className="wv-serif" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
          {t('title')}
          <br />
          <em style={{ color: ACCENT }}>{t('titleEm')}</em>
        </h2>
        <p style={{ margin: 0, maxWidth: 380, color: '#A39E94', lineHeight: 1.7, fontWeight: 300 }}>{t('note')}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 1,
          background: '#1E1B16',
          border: '1px solid #1E1B16',
        }}
      >
        {cards.map((c) => (
          <div
            key={c.num}
            className="wv-card"
            style={{
              background: c.featured ? '#14110C' : '#0B0A08',
              padding: '40px 32px',
              border: c.featured ? '1px solid #3A342A' : '1px solid transparent',
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.3em', color: c.featured ? ACCENT : '#8E897F' }}>
              {c.num}
              {c.featured ? ` · ${t('signature')}` : ''}
            </div>
            <h3 className="wv-serif" style={{ margin: '24px 0 12px', fontSize: 30, fontWeight: 400 }}>
              {c.name}
            </h3>
            <p
              style={{
                margin: 0,
                color: c.featured ? '#CFC9BD' : '#A39E94',
                lineHeight: 1.7,
                fontWeight: 300,
                fontSize: 15,
              }}
            >
              {c.desc}
            </p>
            <div style={{ marginTop: 32, fontSize: 14, color: ACCENT }}>{t(c.price)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
