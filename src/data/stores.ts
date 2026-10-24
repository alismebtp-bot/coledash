import type { VendorKind } from '@/types'

/** Non-restaurant vendor: grocery store, florist or retail shop. */
export interface Store {
  id: string
  kind: Exclude<VendorKind, 'restaurant'>
  name: string
  tagline: string
  category: string
  cityId: string
  address: string
  image: string
  logo?: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  promo?: string
}

const img = (id: string, w = 900, h = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`

export const stores: Store[] = [
  // ── Courses ─────────────────────────────────────────────
  { id: 'grocery-paris-marche', kind: 'grocery', name: 'Le Marché des Martyrs', tagline: 'Primeur, crèmerie et épicerie fine', category: 'Supérette', cityId: 'paris', address: '38 rue des Martyrs, 75009', image: img('1542838132-92c53300491e'), rating: 4.7, reviewCount: 1284, deliveryTime: '15-25 min', deliveryFee: 1.99, minOrder: 15, isOpen: true, promo: '-15 % fruits & légumes' },
  { id: 'grocery-paris-bio', kind: 'grocery', name: 'Biocoop Oberkampf', tagline: 'Bio, vrac et producteurs locaux', category: 'Bio', cityId: 'paris', address: '102 rue Oberkampf, 75011', image: img('1488459716781-31db52582fe9'), rating: 4.8, reviewCount: 862, deliveryTime: '20-35 min', deliveryFee: 2.49, minOrder: 20, isOpen: true },
  { id: 'grocery-lyon-halles', kind: 'grocery', name: 'Épicerie des Halles', tagline: 'Les produits de la région lyonnaise', category: 'Épicerie fine', cityId: 'lyon', address: '12 cours Lafayette, 69003', image: img('1604719312566-8912e9227c6a'), rating: 4.6, reviewCount: 540, deliveryTime: '20-30 min', deliveryFee: 1.99, minOrder: 15, isOpen: true },
  { id: 'grocery-marseille-prado', kind: 'grocery', name: 'Primeur du Prado', tagline: 'Fruits, légumes et produits provençaux', category: 'Primeur', cityId: 'marseille', address: '210 avenue du Prado, 13008', image: img('1534723452862-4c874018d66d'), rating: 4.5, reviewCount: 410, deliveryTime: '20-35 min', deliveryFee: 1.49, minOrder: 12, isOpen: true },
  { id: 'grocery-nice-liberation', kind: 'grocery', name: 'Marché Libération', tagline: 'Le meilleur du marché niçois', category: 'Supérette', cityId: 'nice', address: '5 avenue Malausséna, 06000', image: img('1506617420156-8e4536971650'), rating: 4.6, reviewCount: 388, deliveryTime: '15-30 min', deliveryFee: 1.99, minOrder: 15, isOpen: true },

  // ── Fleurs ──────────────────────────────────────────────
  { id: 'flowers-paris-atelier', kind: 'flowers', name: 'Atelier Pivoine', tagline: 'Bouquets de saison composés à la main', category: 'Fleuriste', cityId: 'paris', address: '7 rue de Bretagne, 75003', image: img('1487070183336-b863922373d4'), rating: 4.9, reviewCount: 954, deliveryTime: '45-60 min', deliveryFee: 4.9, minOrder: 25, isOpen: true },
  { id: 'flowers-lyon-rose', kind: 'flowers', name: 'La Rose de Bellecour', tagline: 'Fleurs françaises et plantes vertes', category: 'Fleuriste', cityId: 'lyon', address: '3 place Bellecour, 69002', image: img('1490750967868-88aa4486c946'), rating: 4.8, reviewCount: 402, deliveryTime: '45-60 min', deliveryFee: 4.9, minOrder: 25, isOpen: true },
  { id: 'flowers-marseille-mimosa', kind: 'flowers', name: 'Mimosa & Cie', tagline: 'Fleurs méditerranéennes', category: 'Fleuriste', cityId: 'marseille', address: '18 rue Paradis, 13001', image: img('1508610048659-a06b669e3321'), rating: 4.7, reviewCount: 233, deliveryTime: '45-70 min', deliveryFee: 4.9, minOrder: 25, isOpen: true },
  { id: 'flowers-nice-cours', kind: 'flowers', name: 'Fleurs du Cours Saleya', tagline: 'Directement du marché aux fleurs', category: 'Fleuriste', cityId: 'nice', address: 'Cours Saleya, 06300', image: img('1455659817273-f96807779a8a'), rating: 4.8, reviewCount: 318, deliveryTime: '40-60 min', deliveryFee: 4.9, minOrder: 25, isOpen: true },

  // ── Boutiques ───────────────────────────────────────────
  { id: 'retail-paris-pharma', kind: 'retail', name: 'Pharmacie du Marais', tagline: 'Parapharmacie, soins et hygiène', category: 'Pharmacie', cityId: 'paris', address: '21 rue des Archives, 75004', image: img('1576602976047-174e57a47881'), rating: 4.7, reviewCount: 611, deliveryTime: '20-35 min', deliveryFee: 2.99, minOrder: 10, isOpen: true },
  { id: 'retail-paris-cave', kind: 'retail', name: 'La Cave de Pigalle', tagline: 'Vins nature, bières et spiritueux', category: 'Caviste', cityId: 'paris', address: '4 rue Frochot, 75009', image: img('1510812431401-41d2bd2722f3'), rating: 4.8, reviewCount: 377, deliveryTime: '25-40 min', deliveryFee: 2.99, minOrder: 20, isOpen: true, promo: '2e bouteille -30 %' },
  { id: 'retail-paris-tech', kind: 'retail', name: 'Tech Express', tagline: 'Câbles, chargeurs et petits accessoires', category: 'High-tech', cityId: 'paris', address: '56 boulevard Voltaire, 75011', image: img('1468495244123-6c6c332eeece'), rating: 4.5, reviewCount: 289, deliveryTime: '25-40 min', deliveryFee: 3.49, minOrder: 15, isOpen: true },
  { id: 'retail-paris-livres', kind: 'retail', name: 'Librairie Les Abbesses', tagline: 'Romans, BD et papeterie', category: 'Librairie', cityId: 'paris', address: '30 rue Yvonne-Le-Tac, 75018', image: img('1526243741027-444d633d7365'), rating: 4.9, reviewCount: 198, deliveryTime: '30-45 min', deliveryFee: 2.99, minOrder: 15, isOpen: true },
  { id: 'retail-lyon-pharma', kind: 'retail', name: 'Pharmacie Croix-Rousse', tagline: 'Parapharmacie et bien-être', category: 'Pharmacie', cityId: 'lyon', address: '8 boulevard de la Croix-Rousse, 69004', image: img('1576602976047-174e57a47881'), rating: 4.6, reviewCount: 240, deliveryTime: '20-35 min', deliveryFee: 2.99, minOrder: 10, isOpen: true },
  { id: 'retail-marseille-cave', kind: 'retail', name: 'Cave du Vieux-Port', tagline: 'Rosés de Provence et pastis', category: 'Caviste', cityId: 'marseille', address: '9 quai du Port, 13002', image: img('1510812431401-41d2bd2722f3'), rating: 4.6, reviewCount: 175, deliveryTime: '25-40 min', deliveryFee: 2.99, minOrder: 20, isOpen: true },
  { id: 'retail-nice-tech', kind: 'retail', name: 'Riviera Tech', tagline: 'Accessoires téléphone et audio', category: 'High-tech', cityId: 'nice', address: '14 avenue Jean-Médecin, 06000', image: img('1468495244123-6c6c332eeece'), rating: 4.4, reviewCount: 120, deliveryTime: '25-45 min', deliveryFee: 3.49, minOrder: 15, isOpen: true },
]

export function getStoresByKind(kind: Store['kind'], cityId?: string): Store[] {
  return stores.filter((s) => s.kind === kind && (!cityId || s.cityId === cityId))
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id)
}
