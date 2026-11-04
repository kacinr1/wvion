import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase côté serveur, créé uniquement si les variables
 * d'environnement sont présentes. Permet au site de tourner en local
 * sans Supabase configuré (les demandes sont alors seulement loggées).
 * On utilise la clé service role : à n'exposer QUE côté serveur.
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
