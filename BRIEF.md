# WVion Services — Brief du site (pour Claude Code)

Site vitrine ultra premium de **WVion Services Sàrl**, service de chauffeur privé VIP à Genève.
Ce brief décrit la maquette validée. Le dossier `reference/` contient le code source de la maquette
(format de design, pas du code de production) : s'en servir comme référence visuelle et de comportement.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (table des demandes de réservation)
- Déploiement Vercel
- Images et vidéos : `public/media/`

## Entreprise (infos réelles, registre du commerce)

- WVion Services Sàrl
- Allée des Grenouilles 3, 1219 Châtelaine (Vernier, GE)
- IDE : CHE-421.634.804
- Fondée en 2016

## Direction artistique « Smoking »

- Fond : noir profond `#070707`, surfaces `#0B0A08`, `#16130E`
- Texte : ivoire `#F2EDE4`, secondaire `#A39E94`, discret `#8E897F`
- Accent : or champagne `#C9A96E` (clair `#FFF3D6`, foncé `#8C7442`)
- Lignes / bordures : `#1E1B16`, `#2A251D`, `#3A342A`
- Urgence All-in-Now : rouge `#D63A3A`, texte rouge `#E07A7A`, fonds `#0E0505` / `#140808`
- Typo titres : **Bodoni Moda** (italique pour les mots mis en avant)
- Typo texte : **Jost** (300 / 400 / 500 / 600)
- Petits libellés : majuscules, interlettrage large (0.2em – 0.5em)
- Animations « ultra extravagantes » : texte doré qui scintille, sceau circulaire qui tourne,
  bandeau de destinations qui défile, reflet lumineux qui balaie les images, cartes qui se soulèvent
  au survol, point rouge qui pulse. Toutes désactivées si `prefers-reduced-motion`.

## Langues

FR (par défaut), EN, AR (RTL), RU, DE. Prévoir l'i18n dès le départ (ex. next-intl).

## Sections de la page d'accueil (dans l'ordre)

1. **Navigation** collante : logo WVION + « SERVICES · GENÈVE », liens (Services, Flotte, Chauffeurs,
   All-in-Now, Configurer), sélecteur de langue, bouton « Réserver » (ouvre le configurateur).
2. **Hero plein écran** : vidéo `hero.mp4` en fond (poster `hero-poster.jpg`), voile noir dégradé,
   titre « L'art / d'arriver. », boutons « Composer ma mission » (ouvre le configurateur) et
   « Urgence All-in-Now » (ouvre directement l'écran urgence). À droite : sceau rotatif
   avec `door.jpg` dans le cercle.
3. **Bandeau chiffres** : 24/24 · 5 langues · flotte 2021–25 · 100 % chauffeurs certifiés VTC.
4. **Défilement destinations** : Genève, Courchevel, Verbier, Gstaad, Zermatt, Megève, Monaco.
5. **Formules** : Transfert, Demi-journée, Mensuel, Accompagné 24h/24 (prix en placeholder).
6. **Services** : galerie 3 images (`jet.jpg`, `shop.jpg`, `s25.jpg`) puis 5 groupes :
   Aéroport & Voyage, Business, Événements, Lifestyle, Conciergerie.
7. **Mission All-in-Now** : vidéo `allin.mp4` en fond, voile rouge sombre, ligne directe, bouton.
8. **Flotte** : Classe E 2021 (`e21.jpg`), Classe E 2024 (`e24.jpg`), Van (`van.jpg`, année à
   compléter), Classe S 2025 (`s25.jpg`).
9. **Chauffeurs** : cartes profil (photo, nom, badge « Chauffeur certifié », langues, expérience,
   spécialités) + bouton « Réserver avec ce chauffeur ». Bandeau « Protection rapprochée ».
10. **Teaser configurateur** : grand titre + les 6 étapes + bouton « Ouvrir le configurateur ».
11. **Suivi en direct** : maquette de téléphone avec carte et heure d'arrivée.
12. **Footer** : grand WVION doré, société, contact, services, langues, mentions légales.

## Le configurateur (pièce maîtresse)

Plein écran, style configurateur Rolex : une étape par écran.

### Ouverture « télé à l'ancienne »
- L'écran apparaît comme une **fine ligne dorée horizontale** qui s'étire en largeur,
  puis s'ouvre en hauteur ; lignes de balayage (scanlines) qui s'effacent ; contenu en fondu.
  Durée ~0,95 s. Fermeture : animation inverse (~0,6 s).
- Keyframes de référence : voir `wvTvOn` / `wvTvOff` / `wvScan` dans `reference/maquette.dc.html`.

### Structure
- Barre haute : logo, étapes cliquables (seulement celles déjà passées), bouton fermer.
- Barre de progression dorée (rouge en mode All-in-Now).
- Barre basse : résumé en direct (formule, véhicule, chauffeur, options) + « Retour » / « Continuer ».

### Étapes
1. **Formule** : Transfert, Demi-journée, Journée, Mensuel, Accompagné 24h/24, All-in-Now.
   « Continuer » désactivé tant que rien n'est choisi.
2. **Véhicule** : grande photo du véhicule sélectionné + liste des 4 véhicules avec vignettes.
3. **Chauffeur** : **uniquement si la formule n'est pas « Transfert »** (règle métier : le choix
   du chauffeur est réservé aux formules à partir de la demi-journée). Carte « Laissez WVion choisir »
   en plus des profils. Pour un transfert, l'étape est sautée et le récap affiche « Attribué par WVion ».
4. **Options** : Garde du corps (partenaire agréé, selon disponibilité), Accueil tarmac / jet privé,
   Récupération des valises (check-in à domicile), Sièges enfants, Conciergerie, Chauffeur multilingue.
5. **Date & trajet** : date, heure, départ, destination, passagers, numéro de vol (facultatif).
6. **Récapitulatif** : « Votre mission » sur la photo du véhicule choisi, toutes les lignes,
   estimation (« [PRIX] CHF » pour transfert / demi-journée / journée, « Sur devis » sinon),
   bouton « Envoyer ma demande » → écran « Demande reçue ».

### Mode All-in-Now
Si la formule All-in-Now est choisie (ou ouverte depuis un bouton urgence) : toutes les étapes sont
sautées. Écran rouge « Alerte activée », ligne directe, formulaire court (nom, téléphone, situation),
bouton « Déclencher la mission » → écran « Alerte transmise ».

### Raccourci
« Réserver avec ce chauffeur » (section chauffeurs) ouvre le configurateur avec ce chauffeur
pré-sélectionné et la formule « Journée » par défaut.

## Backend

- Table Supabase `booking_requests` : formule, véhicule, chauffeur (nullable), options (array),
  date, heure, départ, destination, passagers, vol, nom, téléphone, e-mail, note, is_urgent, created_at.
- Envoi : enregistrement en base + e-mail de notification à WVion (ex. Resend).
- Les demandes All-in-Now (`is_urgent = true`) doivent déclencher une alerte immédiate
  (e-mail + SMS/WhatsApp si possible).
- Protection anti-spam (honeypot ou Turnstile) et validation côté serveur.

## Placeholders à remplacer (ne rien inventer)

- [PRIX] des formules
- [VOTRE NUMÉRO], [VOTRE E-MAIL]
- [ANNÉE] du Van
- Profils chauffeurs : [PHOTO], [PRÉNOM N.], langues, [X] ans d'expérience
- [DÉLAI] de rappel après une demande
- [X] min dans la maquette du suivi en direct

## Points légaux

- Protection rapprochée : toujours formulée « assurée par nos partenaires agréés, selon disponibilité ».
- Chauffeurs : badge « Chauffeur certifié » (carte professionnelle VTC genevoise).
- Les images actuelles sont générées par IA pour l'ambiance : à remplacer par de vraies photos
  de la flotte et des chauffeurs avant la mise en ligne.
- Mentions légales, politique de confidentialité (LPD suisse) et CGV à rédiger.

## Médias (`public/media/`)

| Fichier | Usage |
|---|---|
| hero.mp4 + hero-poster.jpg | Fond du hero |
| allin.mp4 + allin-poster.jpg | Fond de la section All-in-Now |
| e21.jpg / e24.jpg / van.jpg / s25.jpg | Flotte + configurateur |
| jet.jpg / shop.jpg | Galerie services, écran All-in-Now |
| door.jpg | Sceau du hero |
