import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'WVion Services — chauffeur privé VIP Genève';

// OG image à la racine (non préfixée par la langue) : servie en 200 direct,
// sans redirection middleware, pour un aperçu fiable sur tous les réseaux.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#070707',
          color: '#F2EDE4',
          padding: 80,
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 36, border: '1px solid #3A342A' }} />
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 14, color: '#C9A96E' }}>
          SERVICES · GENÈVE
        </div>
        <div style={{ display: 'flex', fontSize: 150, letterSpacing: 24, fontWeight: 700, marginTop: 6 }}>
          WVION
        </div>
        <div style={{ display: 'flex', fontSize: 40, color: '#CFC9BD', marginTop: 24, maxWidth: 900 }}>
          L&apos;art d&apos;arriver.
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 80,
            bottom: 96,
            fontSize: 24,
            letterSpacing: 6,
            color: '#8E897F',
          }}
        >
          TRANSPORT PRIVÉ · PROTECTION · CONCIERGERIE · 24H/24
        </div>
      </div>
    ),
    { ...size },
  );
}
