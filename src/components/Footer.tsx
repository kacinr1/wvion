'use client';

import { useTranslations } from 'next-intl';

function Column({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#8E897F', marginBottom: 10 }}>{label}</div>
      {body.split('\n').map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer style={{ borderTop: '1px solid #1E1B16' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 32px 40px' }}>
        <div
          className="wv-serif wv-shimmer"
          style={{ fontSize: 'clamp(64px, 14vw, 200px)', letterSpacing: '0.08em', lineHeight: 0.9 }}
        >
          WVION
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32,
            fontSize: 14,
            color: '#A39E94',
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          <Column label={t('societeLabel')} body={t('societe')} />
          <Column label={t('contactLabel')} body={t('contact')} />
          <Column label={t('servicesLabel')} body={t('services')} />
          <Column label={t('languesLabel')} body={t('langues')} />
        </div>
        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: '1px solid #1E1B16',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 12,
            color: '#8E897F',
          }}
        >
          <span>{t('copyright')}</span>
          <span>{t('legal')}</span>
        </div>
      </div>
    </footer>
  );
}
