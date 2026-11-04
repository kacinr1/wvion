'use client';

import { useTranslations } from 'next-intl';

const ACCENT = '#C9A96E';

export function LiveTracking() {
  const t = useTranslations('live');

  return (
    <section
      style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '120px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 56,
        alignItems: 'center',
      }}
    >
      <div style={{ flex: '999 1 480px', minWidth: 0 }}>
        <p style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
          {t('eyebrow')}
        </p>
        <h2 className="wv-serif" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
          {t('title')}
          <br />
          <em style={{ color: ACCENT }}>{t('titleEm')}</em>
        </h2>
        <p style={{ margin: '28px 0 0', maxWidth: 460, color: '#A39E94', lineHeight: 1.7, fontWeight: 300, fontSize: 17 }}>
          {t('lede')}
        </p>
      </div>

      <div style={{ flex: '1 1 340px', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 360, border: '1px solid #3A342A', borderRadius: 36, padding: 14, background: '#0B0A08' }}>
          <div style={{ borderRadius: 26, overflow: 'hidden', background: '#100E0B' }}>
            <div style={{ position: 'relative', height: 300, background: '#14120E', overflow: 'hidden' }}>
              <svg viewBox="0 0 330 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
                <path d="M0 60 H330 M0 150 H330 M0 240 H330 M80 0 V300 M200 0 V300 M280 0 V300" stroke="#221E17" strokeWidth="10" />
                <path d="M40 260 C 90 240, 120 180, 200 150 S 270 70, 290 40" fill="none" stroke="#C9A96E" strokeWidth="3" strokeDasharray="6 6" />
                <circle cx="290" cy="40" r="7" fill="#F2EDE4" />
                <circle cx="200" cy="150" r="14" fill="#C9A96E" opacity=".25" className="wv-pulse" />
                <circle cx="200" cy="150" r="7" fill="#C9A96E" />
              </svg>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#8E897F' }}>{t('arrivalLabel')}</div>
                  <div className="wv-serif" style={{ fontSize: 30, marginTop: 4 }}>{t('arrivalValue')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14 }}>{t('vehicleLine')}</div>
                  <div style={{ fontSize: 12, color: '#A39E94', marginTop: 4 }}>{t('driverLine')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
