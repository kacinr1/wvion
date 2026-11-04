'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

const ACCENT = '#C9A96E';

export function Nav() {
  const t = useTranslations('nav');
  const { openMain } = useConfigurator();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#services', label: t('services') },
    { href: '#flotte', label: t('fleet') },
    { href: '#chauffeurs', label: t('drivers') },
    { href: '#allin', label: t('allin') },
    { href: '#reserver', label: t('configure') },
  ];

  const bookBtnStyle: React.CSSProperties = {
    minHeight: 46,
    padding: '12px 26px',
    border: `1px solid ${ACCENT}`,
    background: 'transparent',
    color: ACCENT,
    fontSize: 12,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(7,7,7,.86)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid #1E1B16',
      }}
    >
      <nav
        style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '18px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
        }}
      >
        <a href="#top" style={{ display: 'flex', alignItems: 'baseline', gap: 12, color: '#F2EDE4' }}>
          <span className="wv-serif" style={{ fontSize: 28, letterSpacing: '0.22em', fontWeight: 500 }}>
            WVION
          </span>
          <span style={{ fontSize: 10, letterSpacing: '0.4em', color: '#A39E94' }}>{t('tagline')}</span>
        </a>

        {/* Desktop */}
        <div className="wv-nav-desktop">
          <div
            style={{
              display: 'flex',
              gap: 28,
              fontSize: 13,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} style={{ color: '#D8D2C6' }}>
                {l.label}
              </a>
            ))}
          </div>
          <LanguageSwitcher />
          <button onClick={openMain} style={bookBtnStyle}>
            {t('book')}
          </button>
        </div>

        {/* Mobile : burger */}
        <button
          className="wv-nav-burger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="wv-mobile-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Mobile : tiroir */}
      {open && (
        <div id="wv-mobile-menu" className="wv-nav-drawer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: '#D8D2C6',
                  fontSize: 15,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '14px 0',
                  borderBottom: '1px solid #1E1B16',
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 20 }}>
            <LanguageSwitcher />
            <button
              onClick={() => {
                setOpen(false);
                openMain();
              }}
              style={{ ...bookBtnStyle, flex: 1 }}
            >
              {t('book')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
