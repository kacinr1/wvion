'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { serviceGallery } from '@/lib/data';
import { Reveal } from './Reveal';

interface GalleryItem {
  tag: string;
  caption: string;
}
interface Group {
  num: string;
  title: string;
  items: { t: string; d: string }[];
}

export function Services() {
  const t = useTranslations('services');
  const gallery = t.raw('gallery') as GalleryItem[];
  const groups = t.raw('groups') as Group[];

  return (
    <section id="services" style={{ maxWidth: 1320, margin: '0 auto', padding: '100px 32px' }}>
      <p style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </p>
      <h2 className="wv-serif" style={{ margin: '0 0 64px', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
        {t('title')}
        <br />
        <em className="wv-shimmer">{t('titleEm')}</em>
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
          marginBottom: 64,
        }}
      >
        {gallery.map((g, i) => (
          <Reveal key={i} delay={i * 90}>
          <figure
            className="wv-card"
            style={{ margin: 0, position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', border: '1px solid #2A251D' }}
          >
            <Image
              src={serviceGallery[i]}
              alt={g.caption}
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
            <figcaption
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: 28,
                background: 'linear-gradient(0deg, rgba(7,7,7,.92), rgba(7,7,7,0))',
              }}
            >
              <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.3em', color: '#C9A96E' }}>{g.tag}</span>
              <span className="wv-serif" style={{ display: 'block', marginTop: 8, fontSize: 26, fontStyle: 'italic' }}>
                {g.caption}
              </span>
            </figcaption>
          </figure>
          </Reveal>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
        {groups.map((g, i) => (
          <Reveal key={g.num} delay={i * 70}>
          <div className="wv-card" style={{ border: '1px solid #2A251D', padding: '36px 32px', background: '#0B0A08' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="wv-serif" style={{ margin: 0, fontSize: 26, fontWeight: 400, fontStyle: 'italic' }}>
                {g.title}
              </h3>
              <span style={{ fontSize: 11, letterSpacing: '0.3em', color: '#8E897F' }}>{g.num}</span>
            </div>
            <div style={{ height: 1, background: '#2A251D', margin: '24px 0' }} />
            {g.items.map((it, j) => (
              <div key={j} style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 15, color: '#F2EDE4', fontWeight: 500 }}>{it.t}</span>
                <span style={{ fontSize: 14, color: '#A39E94', lineHeight: 1.6, fontWeight: 300 }}>{it.d}</span>
              </div>
            ))}
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
