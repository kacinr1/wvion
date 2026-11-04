'use client';

import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { Reveal } from './Reveal';
import type { DriverId } from '@/lib/data';

const ACCENT = '#C9A96E';

interface Driver {
  id: DriverId;
  name: string;
  langs: string;
  exp: string;
  spec: string;
}

function CertifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5h4z" />
      <path d="M8.5 12l2.5 2.5L16 9.5" />
    </svg>
  );
}

export function Drivers() {
  const t = useTranslations('drivers');
  const { openWithDriver, openMain } = useConfigurator();
  const list = t.raw('list') as Driver[];

  return (
    <section id="chauffeurs" style={{ maxWidth: 1320, margin: '0 auto', padding: '80px 32px 120px' }}>
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
        <div>
          <p style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
            {t('eyebrow')}
          </p>
          <h2 className="wv-serif" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
            {t('title')}
            <br />
            <em style={{ color: ACCENT }}>{t('titleEm')}</em>
          </h2>
        </div>
        <p style={{ margin: 0, maxWidth: 380, color: '#A39E94', lineHeight: 1.7, fontWeight: 300 }}>{t('note')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {list.map((d, i) => (
          <Reveal key={d.id} delay={i * 90}>
          <div className="wv-card" style={{ border: '1px solid #2A251D', background: '#0B0A08', padding: 32 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: '#16130E',
                  border: '1px solid #3A342A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: '#8E897F',
                  flex: 'none',
                }}
              >
                {t('photo')}
              </div>
              <div>
                <h3 className="wv-serif" style={{ margin: 0, fontSize: 24, fontWeight: 400 }}>
                  {d.name}
                </h3>
                <div
                  style={{
                    marginTop: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: ACCENT,
                    textTransform: 'uppercase',
                  }}
                >
                  <CertifiedBadge />
                  {t('certified')}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 28,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 16,
                borderTop: '1px solid #2A251D',
                paddingTop: 24,
              }}
            >
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#8E897F', textTransform: 'uppercase' }}>{t('langsLabel')}</div>
                <div style={{ marginTop: 6, fontSize: 15 }}>{d.langs}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#8E897F', textTransform: 'uppercase' }}>{t('expLabel')}</div>
                <div style={{ marginTop: 6, fontSize: 15 }}>{d.exp}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#8E897F', textTransform: 'uppercase' }}>{t('specLabel')}</div>
                <div style={{ marginTop: 6, fontSize: 15, color: '#CFC9BD' }}>{d.spec}</div>
              </div>
            </div>

            <button
              onClick={() => openWithDriver(d.id)}
              style={{
                marginTop: 28,
                width: '100%',
                minHeight: 52,
                border: `1px solid ${ACCENT}`,
                background: 'transparent',
                color: ACCENT,
                fontSize: 12,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {t('cta')}
            </button>
          </div>
          </Reveal>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          padding: '28px 32px',
          border: '1px solid #2A251D',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.4" aria-hidden="true">
            <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />
          </svg>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{t('protectionTitle')}</div>
            <div style={{ fontSize: 14, color: '#A39E94', fontWeight: 300, marginTop: 4 }}>{t('protectionDesc')}</div>
          </div>
        </div>
        <button
          onClick={openMain}
          style={{
            minHeight: 44,
            background: 'none',
            border: 'none',
            color: ACCENT,
            fontSize: 12,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          {t('protectionCta')}
        </button>
      </div>
    </section>
  );
}
