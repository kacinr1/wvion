'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { media } from '@/lib/data';

const ACCENT = '#C9A96E';

export function Hero() {
  const t = useTranslations('hero');
  const { openMain, openAllin } = useConfigurator();

  return (
    <section
      id="top"
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      <video
        src={media.heroVideo}
        poster={media.heroPoster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(7,7,7,.95) 0%, rgba(7,7,7,.72) 45%, rgba(7,7,7,.2) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 220,
          background: 'linear-gradient(0deg, #070707, rgba(7,7,7,0))',
        }}
      />
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1320,
          margin: '0 auto',
          padding: '120px 32px 96px',
          boxSizing: 'border-box',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div className="wv-rise" style={{ flex: '999 1 560px', minWidth: 0 }}>
          <p style={{ margin: '0 0 28px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
            {t('eyebrow')}
          </p>
          <h1
            className="wv-serif"
            style={{ margin: 0, fontSize: 'clamp(56px, 9vw, 132px)', lineHeight: 0.95, fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            {t('titleLine')}
            <br />
            <em className="wv-shimmer" style={{ fontStyle: 'italic' }}>
              {t('titleEm')}
            </em>
          </h1>
          <p style={{ margin: '36px 0 0', maxWidth: 520, fontSize: 18, lineHeight: 1.7, fontWeight: 300, color: '#CFC9BD' }}>
            {t('lede')}
          </p>
          <div style={{ marginTop: 44, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <button
              onClick={openMain}
              style={{
                minHeight: 60,
                padding: '18px 40px',
                border: 'none',
                background: ACCENT,
                color: '#070707',
                fontSize: 13,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {t('ctaMain')}
            </button>
            <button
              onClick={openAllin}
              style={{
                minHeight: 60,
                padding: '18px 32px',
                border: '1px solid #3A342A',
                background: 'rgba(7,7,7,.4)',
                color: '#F2EDE4',
                fontSize: 13,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span className="wv-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D63A3A' }} />
              {t('ctaUrgent')}
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 0, position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 440, aspectRatio: '1' }}>
            <svg
              className="wv-spin"
              viewBox="0 0 400 400"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              aria-hidden="true"
            >
              <defs>
                <path id="wvCircle" d="M200,200 m-170,0 a170,170 0 1,1 340,0 a170,170 0 1,1 -340,0" />
              </defs>
              <circle cx="200" cy="200" r="190" fill="none" stroke="#2A251D" strokeWidth="1" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="#2A251D" strokeWidth="1" />
              <text fill="#C9A96E" fontSize="13" letterSpacing="9" fontFamily="Jost">
                <textPath href="#wvCircle">WVION SERVICES · GENÈVE · 24H/24 · PRIVATE CHAUFFEUR · </textPath>
              </text>
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: '22%',
                borderRadius: '50%',
                background: '#0F0D0A',
                border: '1px solid #C9A96E',
                overflow: 'hidden',
              }}
            >
              <Image
                src={media.door}
                alt={t('sealAlt')}
                fill
                sizes="(max-width: 900px) 60vw, 440px"
                style={{ objectFit: 'cover' }}
              />
              <div className="wv-sweep" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
