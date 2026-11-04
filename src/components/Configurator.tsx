'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useConfigurator } from './ConfiguratorProvider';
import { fleet, type DriverId, type FormuleId } from '@/lib/data';

const ACCENT = '#C9A96E';
const RED = '#D63A3A';

interface FormCard { id: FormuleId; label: string; desc: string }
interface OptItem { id: string; label: string; note: string }
interface Driver { id: DriverId; name: string; langs: string; exp: string; spec: string }

const inputStyle: React.CSSProperties = {
  minHeight: 52,
  padding: '0 16px',
  background: '#0B0A08',
  border: '1px solid #3A342A',
  color: '#F2EDE4',
  fontSize: 16,
};
const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 11,
  letterSpacing: '0.24em',
  color: '#8E897F',
  textTransform: 'uppercase',
};

export function Configurator() {
  const t = useTranslations('config');
  const tDrivers = useTranslations('drivers');
  const tFleet = useTranslations('fleet');
  const c = useConfigurator();
  const honeypot = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  const focusables = (root: HTMLElement) =>
    Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);

  // Fermeture Échap + piège de focus (Tab reste dans le modal)
  useEffect(() => {
    if (c.phase === 'closed') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        c.close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = focusables(dialogRef.current);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [c.phase, c]);

  // Focus initial à l'ouverture, restauration à la fermeture
  useEffect(() => {
    if (c.phase === 'open') {
      prevFocus.current = document.activeElement as HTMLElement;
      const id = requestAnimationFrame(() => {
        const el = dialogRef.current;
        if (el) focusables(el)[0]?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    if (c.phase === 'closed' && prevFocus.current) {
      prevFocus.current.focus?.();
      prevFocus.current = null;
    }
  }, [c.phase]);

  if (c.phase === 'closed') return null;

  const forms = t.raw('formule.cards') as FormCard[];
  const optList = t.raw('options.list') as OptItem[];
  const drivers = tDrivers.raw('list') as Driver[];

  const selVeh = fleet.find((v) => v.id === c.veh) ?? fleet[3];
  const selForm = forms.find((f) => f.id === c.form);

  // ----- Parcours -----
  const isAllin = c.form === 'allin';
  const canDrv = !!c.form && c.form !== 'transfert' && !isAllin;
  const steps: string[] = isAllin
    ? ['formule', 'allin']
    : ['formule', 'vehicule', ...(canDrv ? ['chauffeur'] : []), 'options', 'quand', 'recap'];
  const idx = Math.min(c.step, steps.length - 1);
  const cur = steps[idx];

  const stepLabels = t.raw('steps') as Record<string, string>;
  const progress = ((idx + 1) / steps.length) * 100;
  const progressColor = isAllin ? RED : ACCENT;

  const driverObj = drivers.find((d) => d.id === c.drv);
  const chosenOpts = optList.filter((o) => c.opts[o.id]);
  const nOpts = chosenOpts.length;
  const drvLabel = !canDrv
    ? t('recap.attributed')
    : driverObj
      ? driverObj.name
      : t('recap.autoChoice');

  const sumPrice =
    c.form === 'transfert' || c.form === 'demi' || c.form === 'jour'
      ? t('recap.price')
      : t('recap.onQuote');

  const ff = c.f;
  const recapRows: { k: string; v: string }[] = [
    { k: t('recap.rows.formule'), v: selForm ? selForm.label : '—' },
    { k: t('recap.rows.vehicule'), v: `${selVeh.name} ${selVeh.year}` },
    { k: t('recap.rows.chauffeur'), v: drvLabel },
    { k: t('recap.rows.options'), v: nOpts ? chosenOpts.map((o) => o.label).join(', ') : t('none') },
    { k: t('recap.rows.date'), v: ff.date ? ff.date + (ff.time ? ` · ${ff.time}` : '') : t('recap.toPrecise') },
    { k: t('recap.rows.trajet'), v: ff.from || ff.to ? `${ff.from || '…'} → ${ff.to || '…'}` : t('recap.toPrecise') },
    { k: t('recap.rows.pax'), v: ff.pax || t('recap.toPrecise') },
  ];
  if (ff.flight) recapRows.push({ k: t('recap.rows.vol'), v: ff.flight });
  recapRows.push({ k: t('recap.rows.nom'), v: ff.name || t('recap.toPrecise') });
  recapRows.push({ k: t('recap.rows.telephone'), v: ff.phone || t('recap.toPrecise') });
  if (ff.email) recapRows.push({ k: t('recap.rows.email'), v: ff.email });

  // Contact requis (nom + téléphone) pour pouvoir confirmer la mission
  const contactValid = !!ff.name.trim() && !!ff.phone.trim();

  const showNext = cur !== 'recap' && cur !== 'allin';
  const nextDisabled =
    (cur === 'formule' && !c.form) || (cur === 'quand' && !contactValid);

  async function submit() {
    if (honeypot.current && honeypot.current.value) return; // bot
    c.setStatus('sending');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formule: c.form,
          vehicule: c.veh,
          chauffeur: canDrv ? c.drv : null,
          options: chosenOpts.map((o) => o.id),
          date: ff.date,
          time: ff.time,
          from: ff.from,
          to: ff.to,
          passengers: ff.pax,
          flight: ff.flight,
          name: ff.name,
          phone: ff.phone,
          email: ff.email,
          note: ff.note,
          is_urgent: isAllin,
          company: honeypot.current?.value ?? '',
        }),
      });
      if (!res.ok) throw new Error('request failed');
      c.setStatus('idle');
      c.setSent(true);
    } catch {
      c.setStatus('error');
    }
  }

  const stepNum = `${idx + 1} / ${steps.length}`;
  const sending = c.status === 'sending';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Configurateur de mission"
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#000000', display: 'flex' }}
    >
      <div
        className={c.phase === 'closing' ? 'wv-tv-off' : 'wv-tv-on'}
        style={{ position: 'relative', width: '100%', height: '100%', background: '#070707', overflow: 'hidden' }}
      >
        <div className="wv-scan" />
        <div className="wv-tv-content" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* barre haute */}
          <div style={{ flex: 'none', borderBottom: '1px solid #1E1B16' }}>
            <div
              style={{
                padding: '18px 32px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span className="wv-serif" style={{ fontSize: 22, letterSpacing: '0.22em' }}>WVION</span>
                <span style={{ fontSize: 10, letterSpacing: '0.4em', color: ACCENT }}>{t('label')}</span>
              </div>
              <div className="wv-cfg-steps" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 22px' }}>
                {steps.map((k, i) => {
                  const active = i === idx;
                  const color = active
                    ? isAllin && k === 'allin'
                      ? '#E07A7A'
                      : ACCENT
                    : i < idx
                      ? '#CFC9BD'
                      : '#5E594F';
                  return (
                    <button
                      key={k}
                      onClick={i < idx ? () => c.setStep(i) : undefined}
                      disabled={i >= idx}
                      style={{
                        minHeight: 44,
                        padding: '8px 0',
                        background: 'none',
                        border: 'none',
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color,
                        opacity: 1,
                        cursor: i < idx ? 'pointer' : 'default',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')} · {stepLabels[k]}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={c.close}
                aria-label={t('close')}
                style={{
                  width: 46,
                  height: 46,
                  border: '1px solid #3A342A',
                  background: 'transparent',
                  color: '#F2EDE4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <div style={{ height: 2, background: '#1E1B16' }}>
              <div
                style={{
                  height: 2,
                  width: `${progress}%`,
                  background: progressColor,
                  transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
                }}
              />
            </div>
          </div>

          {/* contenu */}
          <div className="wv-scroll" style={{ flex: '1 1 auto', overflowY: 'auto' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px 64px' }}>
              {/* ÉTAPE FORMULE */}
              {cur === 'formule' && (
                <div className="wv-step" key="formule">
                  <StepEyebrow label={`${t('stepWord')} ${stepNum}`} />
                  <StepTitle a={t('formule.title')} em={t('formule.titleEm')} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    {forms.map((f, i) => {
                      const on = f.id === c.form;
                      const red = f.id === 'allin';
                      const num = (red ? '!' : String(i + 1).padStart(2, '0')) + (red ? ` · ${t('formule.priority')}` : '');
                      return (
                        <button
                          key={f.id}
                          onClick={() => c.setForm(f.id)}
                          style={{
                            minHeight: 180,
                            padding: '32px 28px',
                            textAlign: 'left',
                            border: `1px solid ${on ? (red ? RED : ACCENT) : red ? '#5A2222' : '#2A251D'}`,
                            background: on ? (red ? '#1E0909' : '#16130E') : '#0B0A08',
                            color: '#F2EDE4',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 20,
                          }}
                        >
                          <span style={{ fontSize: 11, letterSpacing: '0.3em', color: red ? '#E07A7A' : on ? ACCENT : '#8E897F' }}>
                            {num}
                          </span>
                          <span>
                            <span className="wv-serif" style={{ display: 'block', fontSize: 32 }}>{f.label}</span>
                            <span style={{ display: 'block', marginTop: 10, fontSize: 14, lineHeight: 1.6, color: '#A39E94', fontWeight: 300 }}>
                              {f.desc}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ÉTAPE VÉHICULE */}
              {cur === 'vehicule' && (
                <div className="wv-step" key="vehicule">
                  <StepEyebrow label={`${t('stepWord')} ${stepNum}`} />
                  <StepTitle a={t('vehicule.title')} em={t('vehicule.titleEm')} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
                    <div
                      style={{
                        flex: '999 1 560px',
                        minWidth: 0,
                        position: 'relative',
                        aspectRatio: '4 / 3',
                        overflow: 'hidden',
                        border: '1px solid #2A251D',
                      }}
                    >
                      <img
                        src={selVeh.img}
                        alt={`${selVeh.name} ${selVeh.year}`}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          padding: 32,
                          background: 'linear-gradient(0deg, rgba(7,7,7,.95), rgba(7,7,7,0))',
                        }}
                      >
                        <div style={{ fontSize: 12, letterSpacing: '0.3em', color: ACCENT }}>
                          {tFleet(`vehicles.${selVeh.id}.tag`)}
                        </div>
                        <div className="wv-serif" style={{ marginTop: 10, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1 }}>
                          {selVeh.name} <em style={{ color: ACCENT }}>{selVeh.year}</em>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {fleet.map((v) => {
                        const on = v.id === c.veh;
                        return (
                          <button
                            key={v.id}
                            onClick={() => c.setVeh(v.id)}
                            style={{
                              minHeight: 88,
                              padding: 10,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 16,
                              textAlign: 'left',
                              border: `1px solid ${on ? ACCENT : '#2A251D'}`,
                              background: on ? '#16130E' : '#0B0A08',
                              color: '#F2EDE4',
                            }}
                          >
                            <img src={v.img} alt="" style={{ width: 104, height: 68, objectFit: 'cover', flex: 'none' }} />
                            <span>
                              <span className="wv-serif" style={{ display: 'block', fontSize: 21 }}>{v.name}</span>
                              <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: '#A39E94' }}>
                                {v.year} · {tFleet(`vehicles.${v.id}.tag`)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE CHAUFFEUR */}
              {cur === 'chauffeur' && (
                <div className="wv-step" key="chauffeur">
                  <StepEyebrow label={`${t('stepWord')} ${stepNum}`} />
                  <h2 className="wv-serif" style={{ margin: '0 0 16px', fontSize: 'clamp(40px, 6vw, 84px)', fontWeight: 400, lineHeight: 1 }}>
                    {t('chauffeur.title')} <em style={{ color: ACCENT }}>{t('chauffeur.titleEm')}</em>
                  </h2>
                  <p style={{ margin: '0 0 40px', color: '#A39E94', fontWeight: 300, fontSize: 16 }}>
                    {t('chauffeur.includedIn', { form: selForm ? selForm.label : '' })}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
                    {drivers.map((d) => {
                      const on = d.id === c.drv;
                      return (
                        <button
                          key={d.id}
                          onClick={() => c.setDrv(on ? null : d.id)}
                          style={{
                            padding: 28,
                            textAlign: 'left',
                            border: `1px solid ${on ? ACCENT : '#2A251D'}`,
                            background: on ? '#16130E' : '#0B0A08',
                            color: '#F2EDE4',
                          }}
                        >
                          <span style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                            <span
                              style={{
                                width: 72,
                                height: 72,
                                flex: 'none',
                                borderRadius: '50%',
                                background: '#16130E',
                                border: '1px solid #3A342A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                color: '#8E897F',
                              }}
                            >
                              {tDrivers('photo')}
                            </span>
                            <span>
                              <span className="wv-serif" style={{ display: 'block', fontSize: 24 }}>{d.name}</span>
                              <span style={{ display: 'block', marginTop: 6, fontSize: 11, letterSpacing: '0.18em', color: ACCENT, textTransform: 'uppercase' }}>
                                {tDrivers('certified')}
                              </span>
                            </span>
                          </span>
                          <span style={{ display: 'block', marginTop: 22, paddingTop: 18, borderTop: '1px solid #2A251D', fontSize: 14, lineHeight: 1.9, color: '#CFC9BD' }}>
                            {tDrivers('langsLabel')} : {d.langs}
                            <br />
                            {tDrivers('expLabel')} : {d.exp}
                            <br />
                            {d.spec}
                          </span>
                          <span style={{ display: 'block', marginTop: 18, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: on ? ACCENT : '#8E897F' }}>
                            {on ? t('chauffeur.selected') : t('chauffeur.choose')}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => c.setDrv(null)}
                      style={{
                        padding: 28,
                        textAlign: 'left',
                        border: `1px dashed ${!c.drv ? ACCENT : '#3A342A'}`,
                        background: 'transparent',
                        color: '#F2EDE4',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 12,
                      }}
                    >
                      <span className="wv-serif" style={{ fontSize: 24, fontStyle: 'italic' }}>{t('chauffeur.autoTitle')}</span>
                      <span style={{ fontSize: 14, color: '#A39E94', lineHeight: 1.6, fontWeight: 300 }}>{t('chauffeur.autoDesc')}</span>
                      <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: !c.drv ? ACCENT : '#8E897F' }}>
                        {!c.drv ? t('chauffeur.selected') : t('chauffeur.autoChoose')}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE OPTIONS */}
              {cur === 'options' && (
                <div className="wv-step" key="options">
                  <StepEyebrow label={`${t('stepWord')} ${stepNum}`} />
                  <StepTitle a={t('options.title')} em={t('options.titleEm')} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
                    {optList.map((op) => {
                      const on = !!c.opts[op.id];
                      return (
                        <button
                          key={op.id}
                          onClick={() => c.toggleOpt(op.id)}
                          aria-pressed={on}
                          style={{
                            minHeight: 92,
                            padding: '22px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 18,
                            textAlign: 'left',
                            border: `1px solid ${on ? ACCENT : '#2A251D'}`,
                            background: on ? '#16130E' : '#0B0A08',
                            color: '#F2EDE4',
                          }}
                        >
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              flex: 'none',
                              border: `1px solid ${ACCENT}`,
                              background: on ? ACCENT : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#070707',
                              fontSize: 14,
                            }}
                          >
                            {on ? '✓' : ''}
                          </span>
                          <span>
                            <span style={{ display: 'block', fontSize: 17 }}>{op.label}</span>
                            <span style={{ display: 'block', fontSize: 13, color: '#8E897F', marginTop: 4 }}>{op.note}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ÉTAPE QUAND & OÙ */}
              {cur === 'quand' && (
                <div className="wv-step" key="quand">
                  <StepEyebrow label={`${t('stepWord')} ${stepNum}`} />
                  <StepTitle a={t('quand.title')} em={t('quand.titleEm')} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px 24px', maxWidth: 900 }}>
                    <label style={labelStyle}>
                      {t('quand.date')}
                      <input type="date" value={ff.date} onChange={(e) => c.setField('date', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.time')}
                      <input type="time" value={ff.time} onChange={(e) => c.setField('time', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.from')}
                      <input type="text" placeholder={t('quand.fromPh')} value={ff.from} onChange={(e) => c.setField('from', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.to')}
                      <input type="text" placeholder={t('quand.toPh')} value={ff.to} onChange={(e) => c.setField('to', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.pax')}
                      <input type="number" min={1} placeholder="1" value={ff.pax} onChange={(e) => c.setField('pax', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.flight')}
                      <input type="text" placeholder={t('quand.flightPh')} value={ff.flight} onChange={(e) => c.setField('flight', e.target.value)} style={inputStyle} />
                    </label>
                  </div>

                  <p style={{ margin: '48px 0 20px', fontSize: 12, letterSpacing: '0.5em', color: ACCENT, textTransform: 'uppercase' }}>
                    {t('quand.contactEyebrow')}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px 24px', maxWidth: 900 }}>
                    <label style={labelStyle}>
                      {t('quand.name')} <span aria-hidden="true" style={{ color: ACCENT }}>*</span>
                      <input type="text" required placeholder={t('quand.namePh')} value={ff.name} onChange={(e) => c.setField('name', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.phone')} <span aria-hidden="true" style={{ color: ACCENT }}>*</span>
                      <input type="tel" required placeholder={t('quand.phonePh')} value={ff.phone} onChange={(e) => c.setField('phone', e.target.value)} style={inputStyle} />
                    </label>
                    <label style={labelStyle}>
                      {t('quand.email')}
                      <input type="email" placeholder={t('quand.emailPh')} value={ff.email} onChange={(e) => c.setField('email', e.target.value)} style={inputStyle} />
                    </label>
                  </div>
                  {!contactValid && (
                    <p style={{ margin: '16px 0 0', fontSize: 13, color: '#8E897F' }}>{t('quand.requiredNote')}</p>
                  )}
                </div>
              )}

              {/* ÉTAPE RÉCAP */}
              {cur === 'recap' && (
                <div className="wv-step" key="recap">
                  {!c.sent ? (
                    <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #3A342A' }}>
                      <img src={selVeh.img} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(7,7,7,.97) 0%, rgba(7,7,7,.85) 55%, rgba(7,7,7,.45) 100%)' }} />
                      <div style={{ position: 'relative', padding: '56px 48px', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
                        <div style={{ flex: '999 1 420px', minWidth: 0 }}>
                          <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.5em', color: ACCENT, textTransform: 'uppercase' }}>
                            {t('recap.eyebrow')}
                          </p>
                          <h2 className="wv-serif" style={{ margin: '0 0 40px', fontSize: 'clamp(44px, 6vw, 88px)', fontWeight: 400, lineHeight: 0.95 }}>
                            {t('recap.title')}
                            <br />
                            <em className="wv-shimmer">{t('recap.titleEm')}</em>
                          </h2>
                          {recapRows.map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '14px 0', borderBottom: '1px solid rgba(58,52,42,.7)' }}>
                              <span style={{ fontSize: 12, letterSpacing: '0.24em', color: '#8E897F', textTransform: 'uppercase' }}>{r.k}</span>
                              <span style={{ fontSize: 16, textAlign: 'right' }}>{r.v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ flex: '1 1 280px', minWidth: 0, alignSelf: 'flex-end' }}>
                          <div style={{ fontSize: 12, letterSpacing: '0.24em', color: '#8E897F', textTransform: 'uppercase' }}>{t('recap.estimate')}</div>
                          <div className="wv-serif" style={{ marginTop: 8, fontSize: 48, color: ACCENT }}>{sumPrice}</div>
                          <button
                            onClick={submit}
                            disabled={sending || !contactValid}
                            style={{
                              marginTop: 28,
                              width: '100%',
                              minHeight: 60,
                              border: 'none',
                              background: ACCENT,
                              color: '#070707',
                              fontSize: 13,
                              letterSpacing: '0.26em',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                            }}
                          >
                            {sending ? t('recap.sending') : t('recap.send')}
                          </button>
                          {c.status === 'error' && (
                            <p style={{ margin: '14px 0 0', fontSize: 13, color: '#E07A7A', lineHeight: 1.6 }}>{t('recap.errorNote')}</p>
                          )}
                          <p style={{ margin: '14px 0 0', fontSize: 12, color: '#A39E94', lineHeight: 1.6 }}>{t('recap.sendNote')}</p>
                          {/* honeypot anti-spam */}
                          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Done
                      icon={
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1" aria-hidden="true">
                          <circle cx="12" cy="12" r="10.5" />
                          <path d="M7.5 12.2l3 3 6-6.4" />
                        </svg>
                      }
                      title={t('recap.doneTitle')}
                      titleEm={t('recap.doneTitleEm')}
                      note={t('recap.doneNote')}
                      backLabel={t('recap.backToSite')}
                      onBack={c.close}
                    />
                  )}
                </div>
              )}

              {/* ÉTAPE ALL-IN-NOW */}
              {cur === 'allin' && (
                <div className="wv-step" key="allin">
                  {!c.sent ? (
                    <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #5A2222' }}>
                      <img src="/media/jet.jpg" alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,6,6,.9)' }} />
                      <div style={{ position: 'relative', padding: '56px 48px', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
                        <div style={{ flex: '999 1 420px', minWidth: 0 }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 18px', border: '1px solid #5A2222', fontSize: 11, letterSpacing: '0.32em', color: '#E07A7A' }}>
                            <span className="wv-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: RED }} />
                            {t('allinStep.badge')}
                          </div>
                          <h2 className="wv-serif" style={{ margin: '28px 0 0', fontSize: 'clamp(48px, 7vw, 100px)', fontWeight: 400, lineHeight: 0.92 }}>
                            {t('allinStep.title')}
                            <br />
                            <em style={{ color: ACCENT }}>{t('allinStep.titleEm')}</em>
                          </h2>
                          <p style={{ margin: '28px 0 0', maxWidth: 480, fontSize: 18, lineHeight: 1.7, fontWeight: 300, color: '#D8D2C6' }}>
                            {t('allinStep.lede')}
                          </p>
                          <div className="wv-serif" style={{ marginTop: 32, fontSize: 40 }}>{t('allinStep.phone')}</div>
                        </div>
                        <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                          <label style={{ ...labelStyle, color: '#E07A7A' }}>
                            {t('allinStep.name')}
                            <input type="text" value={ff.name} onChange={(e) => c.setField('name', e.target.value)} style={{ ...inputStyle, background: 'rgba(7,7,7,.7)', border: '1px solid #5A2222' }} />
                          </label>
                          <label style={{ ...labelStyle, color: '#E07A7A' }}>
                            {t('allinStep.phoneLabel')}
                            <input type="tel" value={ff.phone} onChange={(e) => c.setField('phone', e.target.value)} style={{ ...inputStyle, background: 'rgba(7,7,7,.7)', border: '1px solid #5A2222' }} />
                          </label>
                          <label style={{ ...labelStyle, color: '#E07A7A' }}>
                            {t('allinStep.situation')}
                            <textarea rows={3} value={ff.note} onChange={(e) => c.setField('note', e.target.value)} style={{ padding: '14px 16px', background: 'rgba(7,7,7,.7)', border: '1px solid #5A2222', color: '#F2EDE4', fontSize: 16, resize: 'vertical' }} />
                          </label>
                          <button
                            onClick={submit}
                            disabled={sending}
                            style={{ minHeight: 60, border: 'none', background: RED, color: '#FFFFFF', fontSize: 13, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 600 }}
                          >
                            {sending ? t('allinStep.sending') : t('allinStep.trigger')}
                          </button>
                          {c.status === 'error' && (
                            <p style={{ margin: 0, fontSize: 13, color: '#E07A7A', lineHeight: 1.6 }}>{t('allinStep.errorNote')}</p>
                          )}
                          <input ref={honeypot} type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Done
                      icon={<span className="wv-pulse" style={{ width: 16, height: 16, borderRadius: '50%', background: RED }} />}
                      title={t('allinStep.doneTitle')}
                      titleEm={t('allinStep.doneTitleEm')}
                      emColor="#E07A7A"
                      note={t('allinStep.doneNote')}
                      backLabel={t('allinStep.backToSite')}
                      onBack={c.close}
                      backBorder={RED}
                      backColor="#E07A7A"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* barre basse */}
          {!c.sent && (
            <div style={{ flex: 'none', borderTop: '1px solid #1E1B16', background: '#0A0908' }}>
              <div style={{ padding: '16px 32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 28px', fontSize: 13, color: '#A39E94' }}>
                  <span>{t('summary.formule')} <span style={{ color: '#F2EDE4' }}>{selForm ? selForm.label : '—'}</span></span>
                  <span>{t('summary.vehicule')} <span style={{ color: '#F2EDE4' }}>{selVeh.name} {selVeh.year}</span></span>
                  <span>{t('summary.chauffeur')} <span style={{ color: '#F2EDE4' }}>{drvLabel}</span></span>
                  <span>{t('summary.options')} <span style={{ color: '#F2EDE4' }}>{nOpts === 0 ? t('none') : String(nOpts)}</span></span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={idx === 0 ? c.close : () => c.setStep(idx - 1)}
                    style={{ minHeight: 52, padding: '12px 28px', border: '1px solid #3A342A', background: 'transparent', color: '#F2EDE4', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}
                  >
                    {idx === 0 ? t('closeBtn') : t('back')}
                  </button>
                  {showNext && (
                    <button
                      onClick={() => c.setStep(idx + 1)}
                      disabled={nextDisabled}
                      style={{ minHeight: 52, padding: '12px 36px', border: 'none', background: ACCENT, color: '#070707', fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}
                    >
                      {t('continue')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepEyebrow({ label }: { label: string }) {
  return (
    <p style={{ margin: '0 0 14px', fontSize: 12, letterSpacing: '0.5em', color: '#8E897F', textTransform: 'uppercase' }}>{label}</p>
  );
}

function StepTitle({ a, em }: { a: string; em: string }) {
  return (
    <h2 className="wv-serif" style={{ margin: '0 0 48px', fontSize: 'clamp(40px, 6vw, 84px)', fontWeight: 400, lineHeight: 1 }}>
      {a} <em style={{ color: ACCENT }}>{em}</em>
    </h2>
  );
}

function Done({
  icon,
  title,
  titleEm,
  note,
  backLabel,
  onBack,
  emColor,
  backBorder = ACCENT,
  backColor = ACCENT,
}: {
  icon: React.ReactNode;
  title: string;
  titleEm: string;
  note: string;
  backLabel: string;
  onBack: () => void;
  emColor?: string;
  backBorder?: string;
  backColor?: string;
}) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      {icon}
      <h2 className="wv-serif" style={{ margin: '32px 0 0', fontSize: 'clamp(44px, 6vw, 84px)', fontWeight: 400, lineHeight: 1 }}>
        {title} {emColor ? <em style={{ color: emColor }}>{titleEm}</em> : <em className="wv-shimmer">{titleEm}</em>}
      </h2>
      <p style={{ margin: '24px 0 40px', maxWidth: 520, color: '#CFC9BD', fontSize: 17, lineHeight: 1.7, fontWeight: 300 }}>{note}</p>
      <button
        onClick={onBack}
        style={{ minHeight: 52, padding: '14px 40px', border: `1px solid ${backBorder}`, background: 'transparent', color: backColor, fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase' }}
      >
        {backLabel}
      </button>
    </div>
  );
}
