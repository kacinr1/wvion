import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

interface Payload {
  formule?: string | null;
  vehicule?: string | null;
  chauffeur?: string | null;
  options?: string[];
  date?: string;
  time?: string;
  from?: string;
  to?: string;
  passengers?: string;
  flight?: string;
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
  is_urgent?: boolean;
  company?: string; // honeypot
}

const str = (v: unknown, max = 500) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  // Anti-spam : le honeypot doit rester vide
  if (str(body.company)) {
    return NextResponse.json({ ok: true }); // on fait semblant d'accepter
  }

  const isUrgent = body.is_urgent === true;

  // Validation serveur : nom + téléphone toujours requis pour pouvoir
  // recontacter le client ; la formule est requise hors urgence.
  if (!str(body.name) || !str(body.phone)) {
    return NextResponse.json({ error: 'name and phone required' }, { status: 422 });
  }
  if (!isUrgent && !str(body.formule)) {
    return NextResponse.json({ error: 'formule required' }, { status: 422 });
  }

  const options = Array.isArray(body.options)
    ? body.options.filter((o) => typeof o === 'string').slice(0, 20)
    : [];

  const passengers = (() => {
    const n = parseInt(str(body.passengers), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();

  const record = {
    formule: str(body.formule) || null,
    vehicule: str(body.vehicule) || null,
    chauffeur: str(body.chauffeur) || null,
    options,
    date: str(body.date) || null,
    time: str(body.time) || null,
    pickup: str(body.from) || null,
    dropoff: str(body.to) || null,
    passengers,
    flight: str(body.flight) || null,
    name: str(body.name) || null,
    phone: str(body.phone) || null,
    email: str(body.email) || null,
    note: str(body.note, 2000) || null,
    is_urgent: isUrgent,
  };

  // --- Enregistrement Supabase (si configuré) ---
  const supabase = getServerSupabase();
  if (supabase) {
    const { error } = await supabase.from('booking_requests').insert(record);
    if (error) {
      console.error('[booking] supabase insert error:', error.message);
      return NextResponse.json({ error: 'storage error' }, { status: 500 });
    }
  } else {
    // Pas de Supabase en local : on logge pour pouvoir développer sans backend
    console.log('[booking] (no supabase configured) demande reçue:', record);
  }

  // --- Notification e-mail via Resend (si configuré) ---
  await notify(record).catch((e) =>
    console.error('[booking] notify error:', (e as Error).message),
  );

  return NextResponse.json({ ok: true });
}

async function notify(record: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return;

  const urgent = record.is_urgent === true;
  const subject = urgent
    ? '🚨 ALERTE All-in-Now — demande urgente WVion'
    : 'Nouvelle demande de mission WVion';

  const lines = Object.entries(record)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v ?? '—'}`)
    .join('\n');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: `${urgent ? 'DEMANDE URGENTE — à traiter immédiatement.\n\n' : ''}${lines}`,
    }),
  });

  // TODO : pour les demandes urgentes, brancher aussi un envoi SMS / WhatsApp
  // (ex. Twilio) ici afin de déclencher une alerte immédiate.
}
