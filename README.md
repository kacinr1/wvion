# WVion Services

Site vitrine ultra premium de **WVion Services Sàrl** — chauffeur privé VIP à Genève.
Next.js (App Router) · TypeScript · Tailwind CSS · next-intl · Supabase.

## Démarrer en local

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000 (FR par défaut).
Langues : `/` (FR), `/en`, `/ar` (RTL), `/ru`, `/de`.

Le configurateur et le formulaire fonctionnent **sans Supabase** : les demandes
sont simplement loggées dans la console du serveur tant que les variables
d'environnement ne sont pas renseignées.

## Backend (Supabase + e-mail)

1. Copier `.env.local.example` en `.env.local` et remplir les variables.
2. Dans Supabase, exécuter `supabase/schema.sql` (crée la table `booking_requests`).
3. (Optionnel) Renseigner les variables Resend pour recevoir les demandes par e-mail.
   Les demandes All-in-Now (`is_urgent = true`) déclenchent une alerte prioritaire.

Aucune clé n'est en dur : tout passe par les variables d'environnement.
La clé `SUPABASE_SERVICE_ROLE_KEY` n'est utilisée que côté serveur (route `/api/booking`).

## Internationalisation

- `src/i18n/messages/fr.json` est la **référence complète**.
- Les autres langues (`en`, `ar`, `ru`, `de`) peuvent être partielles : toute clé
  manquante retombe automatiquement sur le FR (fusion profonde dans `request.ts`).
- L'arabe (`ar`) passe le document en `dir="rtl"`.

## À compléter avant la mise en ligne (placeholders)

Tous les `[PLACEHOLDERS]` sont volontairement conservés tels quels :

- `[PRIX]` des formules
- `[VOTRE NUMÉRO]`, `[VOTRE E-MAIL]`
- `[ANNÉE]` du Van
- Profils chauffeurs : `[PHOTO]`, `[PRÉNOM N.]`, langues, `[X] ans`
- `[DÉLAI]` de rappel, `[X] min` du suivi en direct

Images/vidéos (`public/media/`) : générées par IA pour l'ambiance, à remplacer par
de vraies photos de la flotte et des chauffeurs. Mentions légales, confidentialité
(LPD) et CGV restent à rédiger.
