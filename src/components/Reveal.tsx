'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Révèle son contenu en fondu-montant lorsqu'il entre dans le viewport.
 * `delay` (ms) permet de créer un effet de cascade entre éléments voisins.
 * Désactivé automatiquement si `prefers-reduced-motion` (via CSS).
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`wv-reveal ${shown ? 'is-in' : ''} ${className}`.trim()}
      style={{ transitionDelay: shown && delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </div>
  );
}
