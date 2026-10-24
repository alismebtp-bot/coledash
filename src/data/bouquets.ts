import { getStoreById, getStoresByKind, type Store } from './stores'

export type OccasionId = 'anniversaire' | 'amour' | 'remerciements' | 'deuil' | 'naissance' | 'juste-parce-que'

export const occasions: { id: OccasionId; label: string; line: string }[] = [
  { id: 'anniversaire', label: 'Anniversaire', line: 'Des couleurs pour souffler les bougies' },
  { id: 'amour', label: 'Amour', line: 'Pour dire je t’aime sans un mot' },
  { id: 'remerciements', label: 'Remerciements', line: 'Une attention qui vaut mille mercis' },
  { id: 'deuil', label: 'Deuil', line: 'Des compositions sobres pour accompagner' },
  { id: 'naissance', label: 'Naissance', line: 'Accueillir un tout petit avec douceur' },
  { id: 'juste-parce-que', label: 'Juste parce que', line: 'Parce qu’il ne faut pas de raison' },
]

export type BouquetSize = 'S' | 'M' | 'L'

export interface Bouquet {
  id: string
  name: string
  /** Florist who signs this creation. */
  storeId: string
  tagline: string
  description: string
  /** Price of the smallest size. */
  price: number
  sizes: { id: BouquetSize; label: string; stems: number; price: number }[]
  flowers: string[]
  occasions: OccasionId[]
  image: string
  /** Main tones, used for the swatch dots. */
  tones: string[]
  isNew?: boolean
  isBestseller?: boolean
}

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&h=1100&fit=crop`

function sizes(s: number, stems: number): Bouquet['sizes'] {
  const round = (n: number) => Math.round(n) - 0.1
  return [
    { id: 'S', label: 'Petit', stems, price: s },
    { id: 'M', label: 'Généreux', stems: Math.round(stems * 1.5), price: round(s * 1.4) },
    { id: 'L', label: 'Majestueux', stems: stems * 2, price: round(s * 1.85) },
  ]
}

function bouquet(b: Omit<Bouquet, 'sizes'> & { stems: number }): Bouquet {
  const { stems, ...rest } = b
  return { ...rest, sizes: sizes(b.price, stems) }
}

export const bouquets: Bouquet[] = [
  bouquet({ id: 'bq-jardin-pivoines', name: 'Jardin de pivoines', storeId: 'flowers-paris-atelier', tagline: 'Pivoines Sarah Bernhardt et eucalyptus', description: 'Des pivoines rose poudré qui s’ouvrent en quelques jours, accompagnées de branches d’eucalyptus argenté. Notre best-seller de la saison.', price: 45.9, stems: 10, flowers: ['Pivoine rose', 'Pivoine blanche', 'Eucalyptus', 'Gypsophile'], occasions: ['amour', 'anniversaire'], image: img('1582794543139-8ac9cb0f7b11'), tones: ['#f9a8d4', '#fef3c7', '#86efac'], isBestseller: true }),
  bouquet({ id: 'bq-passion-rouge', name: 'Passion rouge', storeId: 'flowers-paris-atelier', tagline: 'Roses rouges à longues tiges', description: 'Une brassée de roses rouges Grand Prix, veloutées et parfumées, simplement liées de raphia. Le classique qui ne déçoit jamais.', price: 49.9, stems: 12, flowers: ['Rose rouge Grand Prix', 'Ruscus'], occasions: ['amour'], image: img('1496062031456-07b8f162a322'), tones: ['#e11d48', '#4ade80'] }),
  bouquet({ id: 'bq-nuit-parisienne', name: 'Nuit parisienne', storeId: 'flowers-paris-atelier', tagline: 'Dahlias pourpres et roses sombres', description: 'Un bouquet profond et élégant, entre dahlias pourpres, roses bordeaux et lisianthus violets. Pour une soirée qui compte.', price: 54.9, stems: 11, flowers: ['Dahlia violet', 'Rose bordeaux', 'Lisianthus', 'Eucalyptus'], occasions: ['amour', 'anniversaire'], image: img('1457089328109-e5d9bd499191'), tones: ['#a855f7', '#9f1239', '#c084fc'], isNew: true }),
  bouquet({ id: 'bq-douceur-poudree', name: 'Douceur poudrée', storeId: 'flowers-lyon-rose', tagline: 'Roses tendres et renoncules', description: 'Un nuage de roses poudrées, de renoncules et de gypsophile, aux tons pâles et lumineux. Idéal pour célébrer une naissance.', price: 39.9, stems: 12, flowers: ['Rose poudrée', 'Renoncule rose', 'Gypsophile', 'Fleur de cire'], occasions: ['naissance', 'remerciements'], image: img('1563241527-3004b7be0ffd'), tones: ['#fbcfe8', '#fce7f3', '#fafafa'] }),
  bouquet({ id: 'bq-champetre-lyonnais', name: 'Champêtre des monts du Lyonnais', storeId: 'flowers-lyon-rose', tagline: 'Fleurs de producteurs de la région', description: 'Une composition libre et légère, cueillie chez nos horticulteurs partenaires des monts du Lyonnais. Elle change chaque semaine.', price: 36.9, stems: 14, flowers: ['Fleurs de saison', 'Graminées', 'Feuillages du jardin'], occasions: ['juste-parce-que', 'remerciements'], image: img('1533616688419-b7a585564566'), tones: ['#fbbf24', '#f472b6', '#a3e635'] }),
  bouquet({ id: 'bq-blanc-serenite', name: 'Blanc sérénité', storeId: 'flowers-lyon-rose', tagline: 'Cosmos blancs et feuillage léger', description: 'Une composition sobre et lumineuse de cosmos blancs, roses blanches et feuillages verts, pour accompagner un moment de recueillement.', price: 59.9, stems: 12, flowers: ['Cosmos blanc', 'Rose blanche', 'Arum', 'Ruscus'], occasions: ['deuil'], image: img('1530092285049-1c42085fd395'), tones: ['#fefce8', '#fafafa', '#4ade80'] }),
  bouquet({ id: 'bq-mimosa-cote', name: 'Mimosa de la Côte', storeId: 'flowers-marseille-mimosa', tagline: 'Mimosa du Tanneron', description: 'Des branches de mimosa gorgées de soleil, récoltées dans le massif du Tanneron. Un parfum de fin d’hiver méditerranéen.', price: 29.9, stems: 8, flowers: ['Mimosa', 'Eucalyptus'], occasions: ['juste-parce-que', 'anniversaire'], image: img('1490750967868-88aa4486c946'), tones: ['#fde047', '#86efac'] }),
  bouquet({ id: 'bq-soleil-arles', name: 'Soleil d’Arles', storeId: 'flowers-marseille-mimosa', tagline: 'Tournesols et fleurs des champs', description: 'Des tournesols éclatants mêlés de matricaires et de graminées, comme un après-midi d’été en Camargue.', price: 34.9, stems: 9, flowers: ['Tournesol', 'Matricaire', 'Graminées'], occasions: ['anniversaire', 'remerciements', 'juste-parce-que'], image: img('1567696153798-9111f9cd3d0d'), tones: ['#f59e0b', '#fde047', '#a3e635'] }),
  bouquet({ id: 'bq-hommage', name: 'Hommage', storeId: 'flowers-marseille-mimosa', tagline: 'Lys et chrysanthèmes', description: 'Une gerbe élégante de lys et de chrysanthèmes, composée avec soin par nos fleuristes. Livraison possible au funérarium.', price: 69.9, stems: 15, flowers: ['Lys', 'Chrysanthème blanc', 'Eucalyptus'], occasions: ['deuil'], image: img('1502977249166-824b3a8a4d6d'), tones: ['#f3f4f6', '#fafafa', '#86efac'] }),
  bouquet({ id: 'bq-tulipes-saleya', name: 'Tulipes du Cours', storeId: 'flowers-nice-cours', tagline: 'Tulipes multicolores', description: 'Une botte généreuse de tulipes aux couleurs vives, choisies le matin même au marché aux fleurs du cours Saleya.', price: 27.9, stems: 15, flowers: ['Tulipe rouge', 'Tulipe jaune', 'Tulipe violette'], occasions: ['juste-parce-que', 'anniversaire'], image: img('1561181286-d3fee7d55364'), tones: ['#dc2626', '#fbbf24', '#9333ea'], isBestseller: true }),
  bouquet({ id: 'bq-premier-sourire', name: 'Premier sourire', storeId: 'flowers-nice-cours', tagline: 'Gerberas tendres et hortensia', description: 'Gerberas rose bonbon, hortensia et gypsophile pour féliciter les jeunes parents. Livré avec un petit vase en verre recyclé.', price: 42.9, stems: 10, flowers: ['Gerbera rose', 'Hortensia', 'Gypsophile'], occasions: ['naissance'], image: img('1471696035578-3d8c78d99684'), tones: ['#f472b6', '#93c5fd', '#fafafa'], isNew: true }),
  bouquet({ id: 'bq-merci-infiniment', name: 'Merci infiniment', storeId: 'flowers-nice-cours', tagline: 'Renoncules et roses de jardin', description: 'Un bouquet rond et frais de renoncules, roses de jardin et lisianthus. La meilleure façon de dire merci.', price: 38.9, stems: 12, flowers: ['Renoncule', 'Rose de jardin', 'Lisianthus', 'Ruscus'], occasions: ['remerciements', 'anniversaire'], image: img('1546842931-886c185b4c8c'), tones: ['#fbcfe8', '#f97316', '#c084fc'] }),
]

export function getBouquetById(id: string): Bouquet | undefined {
  return bouquets.find((b) => b.id === id)
}

/**
 * Florist who prepares the bouquet in the given city: the signing florist when
 * it delivers there, otherwise the city's partner florist (the whole
 * collection is available everywhere).
 */
export function resolveFlorist(bouquet: Bouquet, cityId: string): Store | undefined {
  const own = getStoreById(bouquet.storeId)
  if (own && own.cityId === cityId) return own
  return getStoresByKind('flowers', cityId)[0] ?? own
}
