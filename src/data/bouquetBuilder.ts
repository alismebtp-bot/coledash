export interface Flower {
  id: string;
  name: string;
  color: string;
  price: number;
  image: string;
  category: "focal" | "filler" | "greenery";
  meaning: string;
}

export interface BouquetConfig {
  flowers: { flower: Flower; quantity: number }[];
  wrapping: string;
  ribbon: string;
  message: string;
}

export const availableFlowers: Flower[] = [
  {
    id: "rose-red",
    name: "Rose Rouge",
    color: "Rouge",
    price: 3.5,
    image: "/flowers/rose-red.jpg",
    category: "focal",
    meaning: "Amour passion",
  },
  {
    id: "rose-pink",
    name: "Rose Rose",
    color: "Rose",
    price: 3.0,
    image: "/flowers/rose-pink.jpg",
    category: "focal",
    meaning: "Gratitude",
  },
  {
    id: "rose-white",
    name: "Rose Blanche",
    color: "Blanc",
    price: 3.0,
    image: "/flowers/rose-white.jpg",
    category: "focal",
    meaning: "Pureté",
  },
  {
    id: "tulip-yellow",
    name: "Tulipe Jaune",
    color: "Jaune",
    price: 2.5,
    image: "/flowers/tulip-yellow.jpg",
    category: "focal",
    meaning: "Joie",
  },
  {
    id: "tulip-purple",
    name: "Tulipe Violette",
    color: "Violet",
    price: 2.5,
    image: "/flowers/tulip-purple.jpg",
    category: "focal",
    meaning: "Royauté",
  },
  {
    id: "peonie-pink",
    name: "Pivoine Rose",
    color: "Rose",
    price: 5.0,
    image: "/flowers/peonie-pink.jpg",
    category: "focal",
    meaning: "Romance",
  },
  {
    id: "sunflower",
    name: "Tournesol",
    color: "Jaune",
    price: 4.0,
    image: "/flowers/sunflower.jpg",
    category: "focal",
    meaning: "Adoration",
  },
  {
    id: "gerbera-orange",
    name: "Gerbera Orange",
    color: "Orange",
    price: 2.8,
    image: "/flowers/gerbera-orange.jpg",
    category: "focal",
    meaning: "Énergie",
  },
  {
    id: "lisianthus-purple",
    name: "Lisianthus Violet",
    color: "Violet",
    price: 3.2,
    image: "/flowers/lisianthus-purple.jpg",
    category: "filler",
    meaning: "Appréciation",
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    color: "Vert",
    price: 2.0,
    image: "/flowers/eucalyptus.jpg",
    category: "greenery",
    meaning: "Protection",
  },
  {
    id: "baby-breath",
    name: "Gypsophile",
    color: "Blanc",
    price: 1.5,
    image: "/flowers/baby-breath.jpg",
    category: "filler",
    meaning: "Innocence",
  },
  {
    id: "ruscus",
    name: "Ruscus",
    color: "Vert",
    price: 1.8,
    image: "/flowers/ruscus.jpg",
    category: "greenery",
    meaning: "Vitalité",
  },
];

export const wrappingOptions = [
  { id: "kraft", name: "Papier Kraft", price: 2.5, image: "/builder/wrap-kraft.png" },
  { id: "cellophane", name: "Cellophane", price: 1.5, image: "/builder/wrap-cellophane.png" },
  { id: "fabric", name: "Tissu Lin", price: 4.0, image: "/builder/wrap-fabric.png" },
  { id: "vase", name: "Vase Verre", price: 8.0, image: "/builder/wrap-vase.png" },
];

export const ribbonOptions = [
  { id: "satin-white", name: "Ruban Satin Blanc", price: 1.0, image: "/builder/ribbon-satin-white.png" },
  { id: "satin-red", name: "Ruban Satin Rouge", price: 1.0, image: "/builder/ribbon-satin-red.png" },
  { id: "jute", name: "Ruban Jute", price: 0.8, image: "/builder/ribbon-jute.png" },
  { id: "lace", name: "Ruban Dentelle", price: 1.5, image: "/builder/ribbon-lace.png" },
];

export function calculateBouquetPrice(config: BouquetConfig): number {
  const flowersPrice = config.flowers.reduce(
    (sum, item) => sum + item.flower.price * item.quantity,
    0
  );
  const wrapping = wrappingOptions.find((w) => w.id === config.wrapping);
  const ribbon = ribbonOptions.find((r) => r.id === config.ribbon);
  const wrappingPrice = wrapping?.price ?? 0;
  const ribbonPrice = ribbon?.price ?? 0;
  return flowersPrice + wrappingPrice + ribbonPrice;
}

export const occasionSuggestions: Record<string, string[]> = {
  "anniversaire": ["rose-red", "sunflower", "gerbera-orange"],
  "mariage": ["rose-white", "peonie-pink", "baby-breath"],
  "remerciement": ["rose-pink", "lisianthus-purple", "eucalyptus"],
  "naissance": ["rose-white", "tulip-yellow", "baby-breath"],
  "deuil": ["rose-white", "lisianthus-purple", "eucalyptus"],
  "amour": ["rose-red", "peonie-pink", "tulip-purple"],
};
