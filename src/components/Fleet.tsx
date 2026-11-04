'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { fleet } from '@/lib/data';
import { Reveal } from './Reveal';

const ACCENT = '#C9A96E';

export function Fleet() {
  const t = useTranslations('fleet');

  return (
    <section id="flotte" style={{ maxWidth: 1320, margin: '0 auto', padding: '120px 32px 80px' }}>
      <p style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </p>
      <h2 className="wv-serif" style={{ margin: '0 0 64px', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
        {t('title')}
        <br />
        <em style={{ color: ACCENT }}>{t('titleEm')}</em>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {fleet.map((v, i) => (
          <Reveal key={v.id} delay={i * 80}>
          <div className="wv-card" style={{ border: '1px solid #2A251D', background: '#0B0A08' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                background: '#100E0B',
                overflow: 'hidden',
                borderBottom: '1px solid #2A251D',
              }}
            >
              <Image
                src={v.img}
                alt={`${v.name} ${v.year}`}
                fill
                sizes="(max-width: 900px) 100vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="wv-sweep" />
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 className="wv-serif" style={{ margin: 0, fontSize: 28, fontWeight: 400 }}>
                  {v.name}
                </h3>
                <span style={{ fontSize: 14, color: ACCENT }}>{v.year}</span>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 12, letterSpacing: '0.2em', color: '#A39E94', textTransform: 'uppercase' }}>
                {t(`vehicles.${v.id}.tag`)}
              </p>
              <p style={{ margin: '16px 0 0', fontSize: 15, color: ACCENT }}>
                {t(`vehicles.${v.id}.price`)}
              </p>
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
