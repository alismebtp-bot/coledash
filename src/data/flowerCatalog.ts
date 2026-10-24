export interface FlowerItem {
  id: string;
  name: string;
  nameFr: string;
  category: 'rose' | 'tulip' | 'peony' | 'lily' | 'sunflower' | 'orchid' | 'hydrangea' | 'dahlia' | 'delphinium' | 'ranunculus' | 'lisianthus' | 'calla' | 'gerbera' | 'chrysanthemum' | 'greenery' | 'filler';
  color: string;
  price: number;
  stemPrice: number;
  description: string;
  season: string;
  symbolism: string;
  vaseLife: string;
  height: string;
}

export const flowerCatalog: FlowerItem[] = [
  {
    id: 'rose-red',
    name: 'Red Rose',
    nameFr: 'Rose Rouge',
    category: 'rose',
    color: '#e11d48',
    price: 3.50,
    stemPrice: 2.80,
    description: 'La rose rouge classique, symbole universel de l\'amour passionné. Pétales veloutés et parfum envoûtant.',
    season: 'Toute l\'année',
    symbolism: 'Amour, passion, respect',
    vaseLife: '7-10 jours',
    height: '40-60cm'
  },
  {
    id: 'rose-pink',
    name: 'Pink Rose',
    nameFr: 'Rose Poudrée',
    category: 'rose',
    color: '#f472b6',
    price: 3.20,
    stemPrice: 2.60,
    description: 'Délicate et romantique, la rose rose exprime la gratitude et l\'admiration douce.',
    season: 'Toute l\'année',
    symbolism: 'Gratitude, admiration, douceur',
    vaseLife: '7-10 jours',
    height: '40-60cm'
  },
  {
    id: 'rose-white',
    name: 'White Rose',
    nameFr: 'Rose Blanche',
    category: 'rose',
    color: '#fafafa',
    price: 3.20,
    stemPrice: 2.60,
    description: 'Pureté et innocence. La rose blanche est parfaite pour les mariages et les occasions solennelles.',
    season: 'Toute l\'année',
    symbolism: 'Pureté, innocence, nouveau départ',
    vaseLife: '7-10 jours',
    height: '40-60cm'
  },
  {
    id: 'tulip-red',
    name: 'Red Tulip',
    nameFr: 'Tulipe Rouge',
    category: 'tulip',
    color: '#dc2626',
    price: 2.50,
    stemPrice: 2.00,
    description: 'Élégante et graphique, la tulipe rouge annonce l\'arrivée du printemps avec éclat.',
    season: 'Janvier - Mai',
    symbolism: 'Amour parfait, déclaration',
    vaseLife: '5-7 jours',
    height: '30-45cm'
  },
  {
    id: 'tulip-yellow',
    name: 'Yellow Tulip',
    nameFr: 'Tulipe Jaune',
    category: 'tulip',
    color: '#fbbf24',
    price: 2.50,
    stemPrice: 2.00,
    description: 'Soleil capturé dans une fleur. La tulipe jaune apporte joie et luminosité.',
    season: 'Janvier - Mai',
    symbolism: 'Joie, soleil, espoir',
    vaseLife: '5-7 jours',
    height: '30-45cm'
  },
  {
    id: 'tulip-purple',
    name: 'Purple Tulip',
    nameFr: 'Tulipe Violette',
    category: 'tulip',
    color: '#9333ea',
    price: 2.80,
    stemPrice: 2.20,
    description: 'Royale et mystérieuse, la tulipe violette symbolise la noblesse et la créativité.',
    season: 'Janvier - Mai',
    symbolism: 'Royauté, créativité, sagesse',
    vaseLife: '5-7 jours',
    height: '30-45cm'
  },
  {
    id: 'peony-pink',
    name: 'Pink Peony',
    nameFr: 'Pivoine Rose',
    category: 'peony',
    color: '#f9a8d4',
    price: 5.50,
    stemPrice: 4.50,
    description: 'Fleur somptueuse aux pétales généreux, la pivoine est le summum de l\'élégance florale.',
    season: 'Avril - Juin',
    symbolism: 'Prospérité, honneur, romance',
    vaseLife: '5-7 jours',
    height: '40-70cm'
  },
  {
    id: 'peony-white',
    name: 'White Peony',
    nameFr: 'Pivoine Blanche',
    category: 'peony',
    color: '#fef3c7',
    price: 5.50,
    stemPrice: 4.50,
    description: 'Blancheur immaculée et forme parfaite. La pivoine blanche est la star des bouquets de mariée.',
    season: 'Avril - Juin',
    symbolism: 'Pureté, beauté, chagrin guéri',
    vaseLife: '5-7 jours',
    height: '40-70cm'
  },
  {
    id: 'lily-white',
    name: 'White Lily',
    nameFr: 'Lys Blanc',
    category: 'lily',
    color: '#fefce8',
    price: 4.50,
    stemPrice: 3.80,
    description: 'Majestueux et parfumé, le lys blanc apporte une touche de grandeur à tout bouquet.',
    season: 'Toute l\'année',
    symbolism: 'Pureté, majesté, innocence',
    vaseLife: '10-14 jours',
    height: '60-90cm'
  },
  {
    id: 'lily-pink',
    name: 'Pink Lily',
    nameFr: 'Lys Rose',
    category: 'lily',
    color: '#fce7f3',
    price: 4.50,
    stemPrice: 3.80,
    description: 'Délicat et parfumé, le lys rose allie élégance et douceur dans une silhouette imposante.',
    season: 'Toute l\'année',
    symbolism: 'Prospérité, abondance, aspiration',
    vaseLife: '10-14 jours',
    height: '60-90cm'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    nameFr: 'Tournesol',
    category: 'sunflower',
    color: '#f59e0b',
    price: 3.80,
    stemPrice: 3.00,
    description: 'Le soleil incarné dans une fleur. Puissant et joyeux, le tournesol illumine chaque bouquet.',
    season: 'Juin - Octobre',
    symbolism: 'Adoration, loyauté, longévité',
    vaseLife: '6-10 jours',
    height: '50-150cm'
  },
  {
    id: 'orchid-phalaenopsis',
    name: 'Phalaenopsis Orchid',
    nameFr: 'Orchidée Phalaenopsis',
    category: 'orchid',
    color: '#fdf4ff',
    price: 6.50,
    stemPrice: 5.50,
    description: 'Exotique et sophistiquée, l\'orchidée phalaenopsis est la fleur de l\'élégance intemporelle.',
    season: 'Toute l\'année',
    symbolism: 'Beauté, luxe, force',
    vaseLife: '14-21 jours',
    height: '60-90cm'
  },
  {
    id: 'orchid-cymbidium',
    name: 'Cymbidium Orchid',
    nameFr: 'Orchidée Cymbidium',
    category: 'orchid',
    color: '#fef3c7',
    price: 7.00,
    stemPrice: 6.00,
    description: 'Orchidée de haute couture florale. Ses fleurs waxy durent exceptionnellement longtemps.',
    season: 'Octobre - Mai',
    symbolism: 'Amour virtuel, amitié',
    vaseLife: '14-21 jours',
    height: '50-70cm'
  },
  {
    id: 'hydrangea-blue',
    name: 'Blue Hydrangea',
    nameFr: 'Hortensia Bleu',
    category: 'hydrangea',
    color: '#60a5fa',
    price: 5.00,
    stemPrice: 4.20,
    description: 'Boule de fleurs spectaculaire. L\'hortensia bleu est le roi des bouquets volumineux.',
    season: 'Mai - Octobre',
    symbolism: 'Gratitude, grâce, abondance',
    vaseLife: '7-10 jours',
    height: '30-60cm'
  },
  {
    id: 'hydrangea-pink',
    name: 'Pink Hydrangea',
    nameFr: 'Hortensia Rose',
    category: 'hydrangea',
    color: '#f9a8d4',
    price: 5.00,
    stemPrice: 4.20,
    description: 'Délicat et généreux, l\'hortensia rose crée une atmosphère romantique immédiate.',
    season: 'Mai - Octobre',
    symbolism: 'Amour sincère, émotions',
    vaseLife: '7-10 jours',
    height: '30-60cm'
  },
  {
    id: 'dahlia-cafe',
    name: 'Café au Lait Dahlia',
    nameFr: 'Dahlia Café au Lait',
    category: 'dahlia',
    color: '#e8d5c4',
    price: 4.00,
    stemPrice: 3.20,
    description: 'La star d\'Instagram des fleurs. Teintes capuccino incomparables et pétales délicats.',
    season: 'Juillet - Octobre',
    symbolism: 'Dignité, élégance, créativité',
    vaseLife: '5-7 jours',
    height: '90-120cm'
  },
  {
    id: 'dahlia-purple',
    name: 'Purple Dahlia',
    nameFr: 'Dahlia Violet',
    category: 'dahlia',
    color: '#a855f7',
    price: 4.00,
    stemPrice: 3.20,
    description: 'Couleur princière et forme géométrique parfaite. La dahlia violette est un choix audacieux.',
    season: 'Juillet - Octobre',
    symbolism: 'Créativité, force intérieure',
    vaseLife: '5-7 jours',
    height: '90-120cm'
  },
  {
    id: 'delphinium-blue',
    name: 'Blue Delphinium',
    nameFr: 'Delphinium Bleu',
    category: 'delphinium',
    color: '#3b82f6',
    price: 4.50,
    stemPrice: 3.80,
    description: 'Épis floraux impressionnants qui ajoutent hauteur et verticalité à tout arrangement.',
    season: 'Juin - Septembre',
    symbolism: 'Protection, joie, dignité',
    vaseLife: '7-10 jours',
    height: '100-150cm'
  },
  {
    id: 'ranunculus-pink',
    name: 'Pink Ranunculus',
    nameFr: 'Renoncule Rose',
    category: 'ranunculus',
    color: '#fbcfe8',
    price: 3.50,
    stemPrice: 2.80,
    description: 'Pétales en papier froissé, délicatesse extrême. La renoncule est chérie des fleuristes.',
    season: 'Janvier - Mai',
    symbolism: 'Rayonnement, charme',
    vaseLife: '5-7 jours',
    height: '30-45cm'
  },
  {
    id: 'lisianthus-purple',
    name: 'Purple Lisianthus',
    nameFr: 'Lisianthus Violet',
    category: 'lisianthus',
    color: '#c084fc',
    price: 3.20,
    stemPrice: 2.60,
    description: 'Fleur délicate aux pétales soyeux. Le lisianthus est polyvalent et élégant.',
    season: 'Toute l\'année',
    symbolism: 'Appréciation, gratitude',
    vaseLife: '10-14 jours',
    height: '40-60cm'
  },
  {
    id: 'calla-white',
    name: 'White Calla Lily',
    nameFr: 'Arum Blanc',
    category: 'calla',
    color: '#fefce8',
    price: 4.00,
    stemPrice: 3.50,
    description: 'Forme sculpturale et élégance minimalist. L\'arum est la fleur du design moderne.',
    season: 'Toute l\'année',
    symbolism: 'Beauté magnifique, renaissance',
    vaseLife: '7-10 jours',
    height: '50-80cm'
  },
  {
    id: 'gerbera-pink',
    name: 'Pink Gerbera',
    nameFr: 'Gerbera Rose',
    category: 'gerbera',
    color: '#f472b6',
    price: 2.80,
    stemPrice: 2.20,
    description: 'Fleur joyeuse et colorée. La gerbera apporte une touche ludique à tout bouquet.',
    season: 'Toute l\'année',
    symbolism: 'Innocence, pureté, joie',
    vaseLife: '7-14 jours',
    height: '35-50cm'
  },
  {
    id: 'chrysanthemum-white',
    name: 'White Chrysanthemum',
    nameFr: 'Chrysanthème Blanc',
    category: 'chrysanthemum',
    color: '#f3f4f6',
    price: 2.50,
    stemPrice: 2.00,
    description: 'Fleur éternelle aux multiples pétales. Le chrysanthème est polyvalent et durable.',
    season: 'Août - Novembre',
    symbolism: 'Loyauté, longévité, joie',
    vaseLife: '14-21 jours',
    height: '40-70cm'
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    nameFr: 'Eucalyptus',
    category: 'greenery',
    color: '#86efac',
    price: 2.00,
    stemPrice: 1.50,
    description: 'Feuillage aromatique et argenté. L\'eucalyptus structure et parfume les bouquets.',
    season: 'Toute l\'année',
    symbolism: 'Protection, santé',
    vaseLife: '14-21 jours',
    height: '40-70cm'
  },
  {
    id: 'ruscus',
    name: 'Italian Ruscus',
    nameFr: 'Ruscus Italien',
    category: 'greenery',
    color: '#4ade80',
    price: 1.80,
    stemPrice: 1.40,
    description: 'Feuillage classique et élégant. Le ruscus italien est le feuillage préféré des fleuristes.',
    season: 'Toute l\'année',
    symbolism: 'Humilité, simplicité',
    vaseLife: '14-21 jours',
    height: '50-80cm'
  },
  {
    id: 'baby-breath',
    name: "Baby's Breath",
    nameFr: 'Gypsophile',
    category: 'filler',
    color: '#fafafa',
    price: 1.50,
    stemPrice: 1.20,
    description: 'Nuage de petites fleurs blanches. La gypsophile ajoute légèreté et romantisme.',
    season: 'Toute l\'année',
    symbolism: 'Pureté, amour éternel',
    vaseLife: '7-10 jours',
    height: '40-80cm'
  },
  {
    id: 'waxflower',
    name: 'Waxflower',
    nameFr: 'Fleur de Cire',
    category: 'filler',
    color: '#fce7f3',
    price: 1.80,
    stemPrice: 1.40,
    description: 'Petites fleurs cireuses parfumées. Parfait pour ajouter texture et détail.',
    season: 'Octobre - Juin',
    symbolism: 'Succès, richesse',
    vaseLife: '10-14 jours',
    height: '30-50cm'
  }
];

export const palettes = [
  { id: 'romantic', name: 'Romantique', colors: ['#e11d48', '#f472b6', '#fbcfe8', '#fce7f3'], description: 'Roses et rouges passionnés' },
  { id: 'pastel', name: 'Pastel Doux', colors: ['#f9a8d4', '#c084fc', '#93c5fd', '#fde68a'], description: 'Tons doux et apaisants' },
  { id: 'sunset', name: 'Coucher de Soleil', colors: ['#f59e0b', '#ef4444', '#f97316', '#fde047'], description: 'Chaud et vibrant' },
  { id: 'winter', name: 'Hiver Élégant', colors: ['#60a5fa', '#a855f7', '#e2e8f0', '#fefce8'], description: 'Froid et sophistiqué' },
  { id: 'garden', name: 'Jardin Sauvage', colors: ['#f472b6', '#fbbf24', '#a3e635', '#60a5fa'], description: 'Coloré et naturel' },
];

export const wrappingOptions = [
  { id: 'kraft', name: 'Kraft Naturel', color: '#d4a574', price: 2.50 },
  { id: 'white-paper', name: 'Papier Blanc', color: '#fafafa', price: 2.00 },
  { id: 'pink-tissue', name: 'Papier de Soie Rose', color: '#fce7f3', price: 1.50 },
  { id: 'cellophane', name: 'Cellophane Transparent', color: '#f0f9ff', price: 1.50 },
  { id: 'black-luxe', name: 'Noir Luxe', color: '#1c1917', price: 3.50 },
];

export const vaseOptions = [
  { id: 'none', name: 'Sans Vase', price: 0 },
  { id: 'glass-cylinder', name: 'Vase Cylindre Verre', price: 8.00 },
  { id: 'ceramic-white', name: 'Vase Céramique Blanc', price: 12.00 },
  { id: 'ceramic-rose', name: 'Vase Céramique Rose', price: 12.00 },
  { id: 'gold-vase', name: 'Vase Doré', price: 18.00 },
];

export const flowerCategoryLabels: Record<FlowerItem['category'], string> = {
  rose: 'Roses',
  tulip: 'Tulipes',
  peony: 'Pivoines',
  lily: 'Lys',
  sunflower: 'Tournesols',
  orchid: 'Orchidées',
  hydrangea: 'Hortensias',
  dahlia: 'Dahlias',
  delphinium: 'Delphiniums',
  ranunculus: 'Renoncules',
  lisianthus: 'Lisianthus',
  calla: 'Arums',
  gerbera: 'Gerberas',
  chrysanthemum: 'Chrysanthèmes',
  greenery: 'Feuillages',
  filler: 'Fleurs légères',
};

export function getFlowerById(id: string): FlowerItem | undefined {
  return flowerCatalog.find((f) => f.id === id);
}
