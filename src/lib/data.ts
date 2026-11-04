// Données structurelles (non traduisibles) : identifiants, images, années.
// Les libellés et descriptions traduisibles vivent dans les fichiers i18n.

export const media = {
  heroVideo: '/media/hero.mp4',
  heroPoster: '/media/hero-poster.jpg',
  door: '/media/door.jpg',
  allinVideo: '/media/allin.mp4',
  allinPoster: '/media/allin-poster.jpg',
  jet: '/media/jet.jpg',
  shop: '/media/shop.jpg',
  s25: '/media/s25.jpg',
} as const;

export type VehicleId = 'e21' | 'e24' | 'van' | 's25';

export interface Vehicle {
  id: VehicleId;
  name: string;
  year: string;
  img: string;
}

// name/year restent tels quels (données constructeur).
export const fleet: Vehicle[] = [
  { id: 'e21', name: 'Classe E', year: '2022–2026', img: '/media/e21.jpg' },
  { id: 'e24', name: 'Classe E', year: '2022–2026', img: '/media/e24.jpg' },
  { id: 'van', name: 'Van', year: '2022–2026', img: '/media/van.jpg' },
  { id: 's25', name: 'Classe S', year: '2022–2026', img: '/media/s25.jpg' },
];

export const defaultVehicle: VehicleId = 's25';

// Images des 3 cartes de la galerie Services
export const serviceGallery = [media.jet, media.shop, media.s25];

export type FormuleId = 'transfert' | 'demi' | 'jour' | 'mensuel' | 'h24' | 'allin';
export type DriverId = 'd1' | 'd2' | 'd3';
export type OptionId = 'garde' | 'tarmac' | 'valises' | 'enfants' | 'concierge' | 'multi';

// Destinations du bandeau défilant (noms propres, non traduits)
export const destinations = [
  'Genève', 'Courchevel', 'Verbier', 'Gstaad', 'Zermatt', 'Megève', 'Monaco',
];
