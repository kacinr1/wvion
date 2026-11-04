import { destinations } from '@/lib/data';

const ACCENT = '#C9A96E';

export function Marquee() {
  const sequence = [...destinations, ...destinations];
  return (
    <div
      style={{ padding: '28px 0', overflow: 'hidden', borderBottom: '1px solid #1E1B16' }}
      aria-hidden="true"
    >
      <div
        className="wv-marquee wv-serif"
        style={{ fontSize: 44, fontStyle: 'italic', color: '#3A342A', whiteSpace: 'nowrap' }}
      >
        {sequence.map((d, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span>{d}</span>
            <span style={{ color: ACCENT }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
