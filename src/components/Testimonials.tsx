'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

const ACCENT = '#C9A96E';

interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}

function Star() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ color: ACCENT }}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function Testimonials() {
  const t = useTranslations('testimonials');
  const list = t.raw('list') as Testimonial[];

  return (
    <section style={{ maxWidth: 1320, margin: '0 auto', padding: '120px 32px' }}>
      <div style={{ marginBottom: 80 }}>
        <p style={{ margin: '0 0 16px', fontSize: 12, letterSpacing: '0.5em', color: '#A39E94', textTransform: 'uppercase' }}>
          {t('eyebrow')}
        </p>
        <h2 className="wv-serif" style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, lineHeight: 1 }}>
          {t('title')}
          <br />
          <em style={{ color: ACCENT }}>{t('titleEm')}</em>
        </h2>
        <p style={{ margin: '28px 0 0', maxWidth: 560, color: '#A39E94', lineHeight: 1.7, fontWeight: 300, fontSize: 17 }}>
          {t('lede')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        {list.map((testimonial, i) => (
          <Reveal key={testimonial.id} delay={i * 90}>
            <div
              style={{
                border: '1px solid #2A251D',
                background: '#0B0A08',
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>

              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: '#CFC9BD', fontWeight: 300 }}>
                "{testimonial.text}"
              </p>

              <div style={{ marginTop: 'auto', borderTop: '1px solid #2A251D', paddingTop: 20 }}>
                <div className="wv-serif" style={{ margin: 0, fontSize: 16, fontWeight: 400 }}>
                  {testimonial.author}
                </div>
                <div style={{ fontSize: 13, color: '#A39E94', marginTop: 4 }}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
