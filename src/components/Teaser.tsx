'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { media } from '@/lib/data';

const ACCENT = '#C9A96E';

export function Teaser() {
  const t = useTranslations('teaser');
  const { openMain } = useConfigurator();
  const steps = t.raw('steps') as string[];

  return (
    <section
      id="reserver"
      style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid #1E1B16', borderBottom: '1px solid #1E1B16' }}
    >
      <Image
        src={media.s25}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,7,7,.82)' }} />
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '140px 32px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 20px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
          {t('eyebrow')}
        </p>
        <h2 className="wv-serif" style={{ margin: 0, fontSize: 'clamp(48px, 7vw, 104px)', fontWeight: 400, lineHeight: 0.95 }}>
          {t('title')}
          <br />
          <em className="wv-shimmer">{t('titleEm')}</em>
        </h2>
        <p style={{ margin: '32px auto 0', maxWidth: 560, fontSize: 18, lineHeight: 1.7, fontWeight: 300, color: '#CFC9BD' }}>
          {t('lede')}
        </p>
        <div
          style={{
            margin: '48px 0',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 32px',
            fontSize: 12,
            letterSpacing: '0.24em',
            color: '#8E897F',
            textTransform: 'uppercase',
          }}
        >
          {steps.map((s, i) => (
            <span key={i}>
              <span style={{ color: ACCENT }}>{String(i + 1).padStart(2, '0')}</span> {s}
            </span>
          ))}
        </div>
        <button
          onClick={openMain}
          style={{
            minHeight: 64,
            padding: '20px 56px',
            border: 'none',
            background: ACCENT,
            color: '#070707',
            fontSize: 14,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {t('cta')}
        </button>
      </div>
    </section>
  );
}
