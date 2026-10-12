/*
  ═══════════════════════════════════════════════════════════════════
    src/data/prospecting-list.ts
    Prospecting list for B2B restaurant acquisition
    ═══════════════════════════════════════════════════════════════════
*/

export interface Prospect {
  id: string;
  name: string;
  type: 'restaurant' | 'cafe' | 'bar' | 'traiteur' | 'boulangerie' | 'patisserie';
  address: string;
  city: string;
  postalCode: string;
  phone?: string;
  email?: string;
  website?: string;
  cuisine?: string;
  priceRange?: '€' | '€€' | '€€€' | '€€€€';
  rating?: number;
  reviewCount?: number;
  latitude?: number;
  longitude?: number;
  status: 'nouveau' | 'contacte' | 'visite' | 'negociation' | 'signe' | 'perdu';
  priority: 'haute' | 'moyenne' | 'basse';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextActionDate?: string;
  nextAction?: string;
  source: 'web' | 'salon' | 'recommandation' | 'phoning' | 'visite' | 'partenariat';
  potentialRevenue?: number;
  decisionMaker?: string;
  competitors?: string[];
}

export const prospects: Prospect[] = [
  {
    id: 'prospect-001',
    name: 'Le Petit Bistrot',
    type: 'restaurant',
    address: '12 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    phone: '+33 1 42 60 00 00',
    email: 'contact@petitbistrot.fr',
    website: 'https://petitbistrot.fr',
    cuisine: 'Française',
    priceRange: '€€',
    rating: 4.2,
    reviewCount: 156,
    latitude: 48.8688,
    longitude: 2.3319,
    status: 'contacte',
    priority: 'haute',
    assignedTo: 'Jean Dupont',
    notes: 'Intéressé par la livraison. Besoin de 2 livreurs midi/soir.',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    lastContactDate: '2025-01-18',
    nextActionDate: '2025-01-25',
    nextAction: 'Envoyer proposition commerciale',
    source: 'web',
    potentialRevenue: 4500,
    decisionMaker: 'Marc Legrand (Gérant)',
    competitors: ['Deliveroo', 'UberEats'],
  },
  {
    id: 'prospect-002',
    name: 'Sushi Zen',
    type: 'restaurant',
    address: '45 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    phone: '+33 1 53 75 00 00',
    email: 'info@sushizen.fr',
    website: 'https://sushizen.fr',
    cuisine: 'Japonaise',
    priceRange: '€€€',
    rating: 4.5,
    reviewCount: 234,
    latitude: 48.8698,
    longitude: 2.3079,
    status: 'visite',
    priority: 'haute',
    assignedTo: 'Marie Martin',
    notes: 'Visite effectuée le 10/01. Très intéressé par le service premium.',
    createdAt: '2025-01-08',
    updatedAt: '2025-01-15',
    lastContactDate: '2025-01-10',
    nextActionDate: '2025-01-22',
    nextAction: 'Présentation détaillée des options premium',
    source: 'salon',
    potentialRevenue: 8200,
    decisionMaker: 'Yuki Tanaka (Propriétaire)',
    competitors: ['UberEats'],
  },
  {
    id: 'prospect-003',
    name: 'La Boulangerie du Coin',
    type: 'boulangerie',
    address: '8 Rue du Commerce',
    city: 'Paris',
    postalCode: '75015',
    phone: '+33 1 45 75 00 00',
    email: 'laboulangerie@email.fr',
    cuisine: 'Boulangerie',
    priceRange: '€',
    rating: 4.7,
    reviewCount: 312,
    latitude: 48.8456,
    longitude: 2.2978,
    status: 'nouveau',
    priority: 'moyenne',
    assignedTo: 'Jean Dupont',
    notes: 'Nouveau prospect identifié via Google Maps. Livraison de petit-déjeuner potentielle.',
    createdAt: '2025-01-20',
    updatedAt: '2025-01-20',
    source: 'web',
    potentialRevenue: 1800,
    decisionMaker: 'Sophie Bernard (Gérante)',
    competitors: ['Deliveroo'],
  },
  {
    id: 'prospect-004',
    name: 'Café des Artistes',
    type: 'cafe',
    address: '3 Place du Tertre',
    city: 'Paris',
    postalCode: '75018',
    phone: '+33 1 42 64 00 00',
    email: 'cafedesartistes@email.fr',
    website: 'https://cafedesartistes.fr',
    cuisine: 'Café',
    priceRange: '€€',
    rating: 4.3,
    reviewCount: 189,
    latitude: 48.8867,
    longitude: 2.3408,
    status: 'negociation',
    priority: 'moyenne',
    assignedTo: 'Marie Martin',
    notes: 'En négociation sur les commissions. Demande 12% au lieu de 15%.',
    createdAt: '2024-12-10',
    updatedAt: '2025-01-18',
    lastContactDate: '2025-01-15',
    nextActionDate: '2025-01-24',
    nextAction: 'Validation du taux de commission par le directeur commercial',
    source: 'recommandation',
    potentialRevenue: 3200,
    decisionMaker: 'Pierre Moreau (Gérant)',
    competitors: ['Deliveroo', 'UberEats', 'Stuart'],
  },
  {
    id: 'prospect-005',
    name: 'Brasserie de la Gare',
    type: 'restaurant',
    address: '25 Boulevard Saint-Germain',
    city: 'Paris',
    postalCode: '75005',
    phone: '+33 1 43 29 00 00',
    email: 'brasserie@gare.fr',
    cuisine: 'Française',
    priceRange: '€€',
    rating: 3.9,
    reviewCount: 98,
    latitude: 48.8491,
    longitude: 2.3446,
    status: 'perdu',
    priority: 'basse',
    assignedTo: 'Jean Dupont',
    notes: 'A choisi UberEats pour leur offre de bienvenue. À relancer dans 6 mois.',
    createdAt: '2024-11-20',
    updatedAt: '2025-01-10',
    lastContactDate: '2025-01-05',
    source: 'phoning',
    potentialRevenue: 2800,
    decisionMaker: 'Claire Dubois (Directrice)',
    competitors: ['UberEats'],
  },
  {
    id: 'prospect-006',
    name: 'Pizzeria Napoli',
    type: 'restaurant',
    address: '18 Rue de Rivoli',
    city: 'Paris',
    postalCode: '75004',
    phone: '+33 1 42 72 00 00',
    email: 'napoli@pizza.fr',
    website: 'https://pizzerianapoli.fr',
    cuisine: 'Italienne',
    priceRange: '€€',
    rating: 4.6,
    reviewCount: 267,
    latitude: 48.8565,
    longitude: 2.3522,
    status: 'signe',
    priority: 'haute',
    assignedTo: 'Marie Martin',
    notes: 'Contrat signé le 15/01 ! Livraison à partir du 01/02. 3 livreurs nécessaires.',
    createdAt: '2024-12-01',
    updatedAt: '2025-01-15',
    lastContactDate: '2025-01-15',
    nextActionDate: '2025-02-01',
    nextAction: 'Mise en place des livreurs et formation',
    source: 'visite',
    potentialRevenue: 6500,
    decisionMaker: 'Giovanni Rossi (Chef)',
    competitors: ['Deliveroo'],
  },
  {
    id: 'prospect-007',
    name: 'Le Bar à Huîtres',
    type: 'bar',
    address: '6 Rue Montorgueil',
    city: 'Paris',
    postalCode: '75001',
    phone: '+33 1 42 33 00 00',
    email: 'bar@huitres.fr',
    cuisine: 'Fruits de Mer',
    priceRange: '€€€',
    rating: 4.4,
    reviewCount: 145,
    latitude: 48.8645,
    longitude: 2.3478,
    status: 'contacte',
    priority: 'moyenne',
    assignedTo: 'Lucas Petit',
    notes: 'Premier contact par téléphone. Intéressé par la livraison de plateaux.',
    createdAt: '2025-01-12',
    updatedAt: '2025-01-16',
    lastContactDate: '2025-01-16',
    nextActionDate: '2025-01-23',
    nextAction: 'Envoyer catalogue plateaux',
    source: 'web',
    potentialRevenue: 3800,
    decisionMaker: 'Antoine Girard (Gérant)',
    competitors: ['Deliveroo', 'UberEats'],
  },
  {
    id: 'prospect-008',
    name: 'Patisserie Lumière',
    type: 'patisserie',
    address: '22 Rue de la Pompe',
    city: 'Paris',
    postalCode: '75016',
    phone: '+33 1 45 00 00 00',
    email: 'lumiere@patisserie.fr',
    website: 'https://patisserielumiere.fr',
    cuisine: 'Pâtisserie',
    priceRange: '€€€',
    rating: 4.8,
    reviewCount: 378,
    latitude: 48.8635,
    longitude: 2.2768,
    status: 'visite',
    priority: 'haute',
    assignedTo: 'Lucas Petit',
    notes: 'Visite prévue le 25/01. Livraison de gâteaux pour événements.',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-18',
    lastContactDate: '2025-01-12',
    nextActionDate: '2025-01-25',
    nextAction: 'Visite chez le prospect',
    source: 'recommandation',
    potentialRevenue: 7200,
    decisionMaker: 'Émilie Lefevre (Chef Pâtissier)',
    competitors: ['Stuart'],
  },
  {
    id: 'prospect-009',
    name: 'Tacos Mania',
    type: 'restaurant',
    address: '55 Boulevard de Clichy',
    city: 'Paris',
    postalCode: '75009',
    phone: '+33 1 48 74 00 00',
    email: 'tacos@mania.fr',
    cuisine: 'Fast Food',
    priceRange: '€',
    rating: 4.0,
    reviewCount: 234,
    latitude: 48.8834,
    longitude: 2.3275,
    status: 'nouveau',
    priority: 'moyenne',
    assignedTo: 'Jean Dupont',
    notes: 'Nouveau restaurant ouvert en décembre. Fort potentiel de livraison.',
    createdAt: '2025-01-18',
    updatedAt: '2025-01-18',
    source: 'web',
    potentialRevenue: 2400,
    decisionMaker: 'Karim Benali (Gérant)',
    competitors: ['Deliveroo', 'UberEats'],
  },
  {
    id: 'prospect-010',
    name: 'Traiteur Royal',
    type: 'traiteur',
    address: '10 Avenue de l\'Opéra',
    city: 'Paris',
    postalCode: '75001',
    phone: '+33 1 42 60 00 00',
    email: 'royal@traiteur.fr',
    website: 'https://traiteurroyal.fr',
    cuisine: 'Française',
    priceRange: '€€€€',
    rating: 4.7,
    reviewCount: 156,
    latitude: 48.8656,
    longitude: 2.3322,
    status: 'negociation',
    priority: 'haute',
    assignedTo: 'Marie Martin',
    notes: 'En discussion avancée. Demande un service white-label pour leur marque.',
    createdAt: '2024-10-15',
    updatedAt: '2025-01-17',
    lastContactDate: '2025-01-17',
    nextActionDate: '2025-01-26',
    nextAction: 'Présentation solution white-label',
    source: 'partenariat',
    potentialRevenue: 15000,
    decisionMaker: 'Philippe Durand (Directeur Général)',
    competitors: ['Stuart'],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   Status helpers
   ═══════════════════════════════════════════════════════════════════ */

export const statusLabels: Record<string, { label: string; color: string }> = {
  nouveau: { label: 'Nouveau', color: '#64748b' },
  contacte: { label: 'Contacté', color: '#3b82f6' },
  visite: { label: 'Visite', color: '#8b5cf6' },
  negociation: { label: 'Négociation', color: '#f59e0b' },
  signe: { label: 'Signé', color: '#22c55e' },
  perdu: { label: 'Perdu', color: '#ef4444' },
};

export const priorityLabels: Record<string, { label: string; color: string }> = {
  haute: { label: 'Haute', color: '#ef4444' },
  moyenne: { label: 'Moyenne', color: '#f59e0b' },
  basse: { label: 'Basse', color: '#22c55e' },
};

export const typeLabels: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  traiteur: 'Traiteur',
  boulangerie: 'Boulangerie',
  patisserie: 'Pâtisserie',
};

export const sourceLabels: Record<string, string> = {
  web: 'Web',
  salon: 'Salon',
  recommandation: 'Recommandation',
  phoning: 'Phoning',
  visite: 'Visite',
  partenariat: 'Partenariat',
};

export function getProspectsByStatus(status: string): Prospect[] {
  return prospects.filter((p) => p.status === status);
}

export function getProspectsByPriority(priority: string): Prospect[] {
  return prospects.filter((p) => p.priority === priority);
}

export function getProspectsByAssigned(assignedTo: string): Prospect[] {
  return prospects.filter((p) => p.assignedTo === assignedTo);
}

export function getProspectsByCity(city: string): Prospect[] {
  return prospects.filter((p) => p.city.toLowerCase() === city.toLowerCase());
}

export function searchProspects(query: string): Prospect[] {
  const q = query.toLowerCase();
  return prospects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.cuisine?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
  );
}

export function getProspectsRequiringAction(): Prospect[] {
  const today = new Date().toISOString().split('T')[0];
  return prospects.filter(
    (p) => p.nextActionDate && p.nextActionDate <= today && p.status !== 'signe' && p.status !== 'perdu'
  );
}

export function getRevenuePotential(): number {
  return prospects.reduce((sum, p) => sum + (p.potentialRevenue || 0), 0);
}

export function getSignedRevenue(): number {
  return prospects
    .filter((p) => p.status === 'signe')
    .reduce((sum, p) => sum + (p.potentialRevenue || 0), 0);
}
