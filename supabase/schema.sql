-- Table des demandes de réservation WVion Services
-- À exécuter dans l'éditeur SQL de Supabase.

create table if not exists public.booking_requests (
  id          uuid primary key default gen_random_uuid(),
  formule     text,
  vehicule    text,
  chauffeur   text,              -- nullable : « Attribué par WVion » ou choix auto
  options     text[] default '{}',
  date        date,
  time        text,
  pickup      text,              -- départ
  dropoff     text,              -- destination
  passengers  integer,
  flight      text,
  name        text,
  phone       text,
  email       text,
  note        text,
  is_urgent   boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index pour retrouver vite les demandes urgentes et les plus récentes
create index if not exists booking_requests_urgent_idx
  on public.booking_requests (is_urgent, created_at desc);

-- RLS : on bloque tout accès public. Les insertions passent par la route
-- serveur /api/booking qui utilise la clé service role (bypass RLS).
alter table public.booking_requests enable row level security;
-- (Aucune policy publique volontairement : lecture/écriture réservées au serveur.)
