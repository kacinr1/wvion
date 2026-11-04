'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { media } from '@/lib/data';

const ACCENT = '#C9A96E';

export function AllInSection() {
  const t = useTranslations('allin');
  const { openAllin } = useConfigurator();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);

  // Charge la vidéo seulement quand la section approche du viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLoadVideo(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoadVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (loadVideo) videoRef.current?.play().catch(() => {});
  }, [loadVideo]);

  return (
    <section
      ref={sectionRef}
      id="allin"
      style={{
        position: 'relative',
        background: '#0E0505',
        borderTop: '1px solid #3A1818',
        borderBottom: '1px solid #3A1818',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={loadVideo ? media.allinVideo : undefined}
        poster={media.allinPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(14,5,5,.96) 0%, rgba(14,5,5,.8) 50%, rgba(14,5,5,.45) 100%)',
        }}
      />
      <div className="wv-sweep" style={{ background: 'linear-gradient(90deg, transparent, rgba(214,58,58,.10), transparent)' }} />

      <div
        style={{
          position: 'relative',
          maxWidth: 1320,
          margin: '0 auto',
          padding: '120px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 56,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: '999 1 560px', minWidth: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 18px',
              border: '1px solid #5A2222',
              fontSize: 11,
              letterSpacing: '0.32em',
              color: '#E07A7A',
            }}
          >
            <span className="wv-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D63A3A' }} />
            {t('badge')}
          </div>
          <h2 className="wv-serif" style={{ margin: '32px 0 0', fontSize: 'clamp(52px, 8vw, 116px)', fontWeight: 400, lineHeight: 0.92 }}>
            {t('title')}
            <br />
            <em style={{ color: ACCENT }}>{t('titleEm')}</em>
          </h2>
          <p style={{ margin: '32px 0 0', maxWidth: 560, fontSize: 19, lineHeight: 1.7, fontWeight: 300, color: '#D8D2C6' }}>
            {t('lede')}
          </p>
        </div>

        <div style={{ flex: '1 1 340px', minWidth: 0, border: '1px solid #5A2222', padding: 36, background: 'rgba(20,8,8,.85)' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.3em', color: '#E07A7A' }}>{t('directLabel')}</div>
          <div className="wv-serif" style={{ marginTop: 16, fontSize: 34 }}>{t('phone')}</div>
          <p style={{ margin: '16px 0 28px', color: '#A39E94', lineHeight: 1.6, fontWeight: 300, fontSize: 15 }}>{t('directNote')}</p>
          <button
            onClick={openAllin}
            style={{
              width: '100%',
              minHeight: 56,
              border: 'none',
              background: '#D63A3A',
              color: '#FFFFFF',
              fontSize: 13,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {t('cta')}
          </button>
        </div>
      </div>
    </section>
  );
}
