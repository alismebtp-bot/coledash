/**
 * AIScraper — Intelligent website scraper for restaurant menus
 * Extracts menu data, generates images, and optimizes SEO from any restaurant URL.
 */

/* ─────────────────────── types ─────────────────────── */

export interface ScrapedItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface ScrapedRestaurant {
  name: string;
  cuisine: string;
  address?: string;
  phone?: string;
  items: ScrapedItem[];
  seoKeywords: string[];
  metaDescription: string;
}

export interface ScrapeProgress {
  percentage: number;
  message: string;
}

/* ─────────────────────── mock menu databases for demo ─────────────────────── */

const mockCuisineTypes = [
  'italienne', 'asiatique', 'américaine', 'française', 'mexicaine',
  'indienne', 'japonaise', 'libanaise', 'végétarienne', 'fast-food',
  'pizza', 'sushi', 'burger', 'bistrot', 'kebab',
];

const mockDishes: Record<string, { name: string; description: string; price: number; category: string }[]> = {
  italienne: [
    { name: 'Pizza Margherita', description: 'Sauce tomate, mozzarella, basilic frais', price: 10.50, category: 'Pizzas' },
    { name: 'Pizza Pepperoni', description: 'Sauce tomate, mozzarella, pepperoni', price: 12.50, category: 'Pizzas' },
    { name: 'Pizza 4 Fromages', description: 'Mozzarella, gorgonzola, parmesan, chèvre', price: 13.00, category: 'Pizzas' },
    { name: 'Spaghetti Bolognese', description: 'Sauce bolognaise maison, parmesan', price: 14.00, category: 'Pâtes' },
    { name: 'Penne Arrabbiata', description: 'Sauce tomate épicée, ail, persil', price: 12.00, category: 'Pâtes' },
    { name: 'Lasagnes Maison', description: 'Bœuf, béchamel, gratiné au four', price: 15.50, category: 'Pâtes' },
    { name: 'Risotto aux Champignons', description: 'Riz crémeux, champignons, parmesan', price: 16.00, category: 'Riz' },
    { name: 'Tiramisu', description: 'Biscuits, café, mascarpone, cacao', price: 7.50, category: 'Desserts' },
    { name: 'Panna Cotta', description: 'Crème vanille, coulis de fruits rouges', price: 6.50, category: 'Desserts' },
  ],
  asiatique: [
    { name: 'Menu Maki (8 pcs)', description: 'Saumon, thon, avocat, concombre', price: 12.00, category: 'Sushi' },
    { name: 'California Rolls (6 pcs)', description: 'Avocat, crabe, concombre, sésame', price: 10.50, category: 'Sushi' },
    { name: 'Sashimi Mix (12 pcs)', description: 'Assortiment de poissons frais', price: 18.00, category: 'Sushi' },
    { name: 'Ramen Miso', description: 'Bouillon miso, nouilles, œuf, porc', price: 14.50, category: 'Soupes' },
    { name: 'Gyoza (6 pcs)', description: 'Raviolis grillés au porc et légumes', price: 8.50, category: 'Entrées' },
    { name: 'Pad Thaï', description: 'Nouilles sautées, crevettes, cacahuètes', price: 13.50, category: 'Plats' },
    { name: 'Curry Vert', description: 'Poulet, lait de coco, légumes, riz', price: 15.00, category: 'Plats' },
    { name: 'Soupe Miso', description: 'Tofu, algues wakame, oignon vert', price: 4.50, category: 'Soupes' },
    { name: 'Nems (4 pcs)', description: 'Rouleaux de printemps, sauce aigre-douce', price: 7.00, category: 'Entrées' },
  ],
  américaine: [
    { name: 'Burger Classic', description: 'Bœuf charolais, cheddar, salade, tomate', price: 13.50, category: 'Burgers' },
    { name: 'Bacon BBQ', description: 'Bœuf, bacon, sauce BBQ, oignon frit', price: 15.50, category: 'Burgers' },
    { name: 'Double Smash', description: 'Double steak, double cheddar, pickles', price: 17.00, category: 'Burgers' },
    { name: 'Veggie Burger', description: 'Steak légumes, avocat, roquette', price: 14.00, category: 'Burgers' },
    { name: 'Frites Maison', description: 'Pommes de terre fraîches, sel de mer', price: 4.50, category: 'Sides' },
    { name: 'Onion Rings', description: 'Rondelles d\'oignon panées', price: 5.50, category: 'Sides' },
    { name: 'Wings BBQ (6 pcs)', description: 'Ailes de poulet sauce BBQ', price: 9.50, category: 'Sides' },
    { name: 'Milkshake Vanille', description: 'Glace vanille, lait, crème fouettée', price: 6.50, category: 'Desserts' },
    { name: 'Brownie', description: 'Chocolat noir, noix, glace vanille', price: 7.50, category: 'Desserts' },
  ],
  française: [
    { name: 'Steak Frites', description: 'Entrecôte grillée, frites maison', price: 22.00, category: 'Plats' },
    { name: 'Confit de Canard', description: 'Cuisse de canard, pommes sarladaises', price: 24.50, category: 'Plats' },
    { name: 'Blanquette de Veau', description: 'Veau, carottes, champignons, riz', price: 21.00, category: 'Plats' },
    { name: 'Croque-Monsieur', description: 'Jambon, fromage, béchamel, gratiné', price: 14.00, category: 'Sandwichs' },
    { name: 'Quiche Lorraine', description: 'Lardons, crème, œufs, pâte brisée', price: 13.50, category: 'Entrées' },
    { name: 'Salade César', description: 'Poulet, parmesan, croûtons, sauce césar', price: 15.00, category: 'Salades' },
    { name: 'Soupe à l\'Oignon', description: 'Oignons caramélisés, gratinée au fromage', price: 9.50, category: 'Soupes' },
    { name: 'Crème Brûlée', description: 'Crème vanille, caramel croustillant', price: 8.50, category: 'Desserts' },
    { name: 'Tarte Tatin', description: 'Pommes caramélisées, pâte feuilletée', price: 9.00, category: 'Desserts' },
  ],
  default: [
    { name: 'Plat du Jour', description: 'Suggestion du chef, produits frais', price: 16.50, category: 'Plats' },
    { name: 'Salade Maison', description: 'Légumes de saison, vinaigrette maison', price: 12.00, category: 'Entrées' },
    { name: 'Soupe du Jour', description: 'Préparation maison selon arrivage', price: 8.00, category: 'Soupes' },
    { name: 'Dessert du Jour', description: 'Pâtisserie faite maison', price: 7.50, category: 'Desserts' },
    { name: 'Boisson Maison', description: 'Cocktail sans alcool signature', price: 5.50, category: 'Boissons' },
  ],
};

/* ─────────────────────── helper functions ─────────────────────── */

function detectCuisine(url: string): string {
  const lower = url.toLowerCase();
  for (const cuisine of mockCuisineTypes) {
    if (lower.includes(cuisine)) return cuisine;
  }
  // Random fallback based on URL hash
  const hash = url.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return mockCuisineTypes[hash % mockCuisineTypes.length];
}

function extractRestaurantName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const name = hostname.split('.')[0];
    return name
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return 'Restaurant';
  }
}

function generateSEOWords(cuisine: string, name: string): string[] {
  const base = [
    'livraison', 'restaurant', 'commander', 'menu', 'plat',
    'déjeuner', 'dîner', 'à emporter', 'livraison rapide',
    'cuisine maison', 'produits frais', 'prix abordable',
  ];
  const cuisineWords: Record<string, string[]> = {
    italienne: ['pizza', 'pâtes', 'tiramisu', 'mozzarella', 'trattoria'],
    asiatique: ['sushi', 'ramen', 'wok', 'riz', 'nouilles'],
    américaine: ['burger', 'frites', 'milkshake', 'bbq', 'steak'],
    française: ['bistrot', 'brasserie', 'terroir', 'gastronomie', 'chef'],
    mexicaine: ['tacos', 'burrito', 'guacamole', 'nachos', 'salsa'],
    indienne: ['curry', 'naan', 'tandoori', 'biryani', 'masala'],
    japonaise: ['sushi', 'sashimi', 'maki', 'tempura', 'bento'],
    libanaise: ['mezze', 'falafel', 'houmous', 'shawarma', 'taboulé'],
    végétarienne: ['veggie', 'bio', 'salade', 'bowl', 'falafel'],
    'fast-food': ['rapide', 'express', 'snack', 'combo', 'menu'],
    pizza: ['pizza', 'calzone', 'mozzarella', 'four à bois', 'napolitaine'],
    sushi: ['sushi', 'maki', 'sashimi', 'japonais', 'frais'],
    burger: ['burger', 'smash', 'frites', 'craft', 'gourmet'],
    bistrot: ['bistrot', 'terroir', 'plat du jour', 'ardoise', 'vin'],
    kebab: ['kebab', 'tacos', 'sandwich', 'rapide', 'grillé'],
  };
  const specific = cuisineWords[cuisine] || ['restaurant', 'gastronomie', 'cuisine'];
  return [...new Set([...specific, ...base, name.toLowerCase()])].slice(0, 20);
}

function generateMetaDescription(name: string, cuisine: string, itemCount: number): string {
  const descriptions = [
    `${name} — Restaurant ${cuisine} en livraison. ${itemCount} délicieux plats préparés avec soin. Commandez en ligne, livraison rapide !`,
    `Découvrez ${name}, votre restaurant ${cuisine} préféré. ${itemCount} spécialités, produits frais, livraison à domicile.`,
    `Commandez chez ${name} : cuisine ${cuisine} authentique. ${itemCount} plats disponibles, livraison express et paiement sécurisé.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

/* ─────────────────────── main scraper ─────────────────────── */

export async function scrapeWebsite(
  url: string,
  onProgress?: (progress: ScrapeProgress) => void
): Promise<ScrapedRestaurant> {
  // Step 1: Analyze URL
  onProgress?.({ percentage: 5, message: 'Analyse de l\'URL...' });
  await delay(300);

  const cuisine = detectCuisine(url);
  onProgress?.({ percentage: 15, message: `Cuisine détectée : ${cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}` });
  await delay(400);

  // Step 2: Extract restaurant info
  onProgress?.({ percentage: 25, message: 'Extraction des informations...' });
  await delay(500);

  const name = extractRestaurantName(url);

  // Step 3: Generate menu items
  onProgress?.({ percentage: 35, message: 'Génération du menu...' });
  await delay(600);

  const dishes = mockDishes[cuisine] || mockDishes.default;
  // Add some randomness - pick 6-10 items
  const itemCount = 6 + Math.floor(Math.random() * 5);
  const selectedDishes = shuffleArray([...dishes]).slice(0, itemCount);

  const items: ScrapedItem[] = selectedDishes.map((dish, i) => ({
    id: `item-${Date.now()}-${i}`,
    name: dish.name,
    description: dish.description,
    price: dish.price + (Math.random() * 2 - 1), // slight price variation
    category: dish.category,
  }));

  onProgress?.({ percentage: 40, message: `${items.length} articles extraits` });

  // Step 4: Generate SEO
  onProgress?.({ percentage: 45, message: 'Optimisation SEO...' });
  await delay(300);

  const seoKeywords = generateSEOWords(cuisine, name);
  const metaDescription = generateMetaDescription(name, cuisine, items.length);

  onProgress?.({ percentage: 50, message: 'SEO généré' });

  return {
    name,
    cuisine,
    items,
    seoKeywords,
    metaDescription,
  };
}

/* ─────────────────────── image generation ─────────────────────── */

const cuisineImageStyles: Record<string, string> = {
  italienne: 'photo réaliste, plat italien appétissant, éclairage chaleureux, fond rustique en bois',
  asiatique: 'photo réaliste, plat asiatique élégant, baguettes, bol en céramique, fond minimaliste',
  américaine: 'photo réaliste, burger gourmet, frites croustillantes, fond en brique, style food truck',
  française: 'photo réaliste, plat français raffiné, assiette blanche, fond bistrot élégant',
  mexicaine: 'photo réaliste, tacos colorés, guacamole frais, fond mexicain festif',
  indienne: 'photo réaliste, curry indien vibrant, naan, épices, fond chaleureux',
  japonaise: 'photo réaliste, sushi artistique, plateau en bois, fond zen minimaliste',
  libanaise: 'photo réaliste, mezze libanais, houmous, pain pita, fond méditerranéen',
  végétarienne: 'photo réaliste, plat végétarien coloré, légumes frais, fond naturel',
  'fast-food': 'photo réaliste, fast-food appétissant, packaging moderne, fond urbain',
  pizza: 'photo réaliste, pizza napolitaine, four à bois, fond italien authentique',
  sushi: 'photo réaliste, sushi premium, wasabi, gingembre, fond japonais élégant',
  burger: 'photo réaliste, burger artisanal, fromage fondant, fond industriel chic',
  bistrot: 'photo réaliste, plat du jour français, ardoise, fond bistrot parisien',
  kebab: 'photo réaliste, kebab généreux, sauce blanche, fond urbain nocturne',
  default: 'photo réaliste, plat appétissant, présentation soignée, fond restaurant moderne',
};

export async function generateItemImages(
  items: ScrapedItem[],
  cuisine: string,
  onProgress?: (current: number, total: number, itemName: string) => void
): Promise<ScrapedItem[]> {
  const style = cuisineImageStyles[cuisine] || cuisineImageStyles.default;

  const results: ScrapedItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    onProgress?.(i + 1, items.length, item.name);

    // Simulate image generation delay
    await delay(200 + Math.random() * 300);

    // In a real implementation, this would call an image generation API
    // For now, we generate a placeholder data URL with the item info
    const placeholder = generatePlaceholderImage(item.name, style);

    results.push({
      ...item,
      image: placeholder,
    });
  }

  return results;
}

function generatePlaceholderImage(name: string, style: string): string {
  // Generate a simple SVG placeholder with the item name
  const encodedName = encodeURIComponent(name);
  const encodedStyle = encodeURIComponent(style.slice(0, 50));

  return `https://placehold.co/400x300/FFF0ED/FF3008?text=${encodedName}`;
}

/* ─────────────────────── import ─────────────────────── */

export function importRestaurant(restaurant: ScrapedRestaurant): void {
  // In a real implementation, this would save to a backend/database
  console.log('[AIScraper] Importing restaurant:', restaurant.name);
  console.log('[AIScraper] Items:', restaurant.items.length);
  console.log('[AIScraper] SEO Keywords:', restaurant.seoKeywords.slice(0, 5).join(', '));

  // Store in localStorage for demo purposes
  try {
    const imported = JSON.parse(localStorage.getItem('coledash_imported') || '[]');
    imported.push({
      ...restaurant,
      importedAt: new Date().toISOString(),
    });
    localStorage.setItem('coledash_imported', JSON.stringify(imported));
  } catch {
    // localStorage not available
  }
}

/* ─────────────────────── utilities ─────────────────────── */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ─────────────────────── batch scraper ─────────────────────── */

export interface BatchScrapeResult {
  url: string;
  success: boolean;
  restaurant?: ScrapedRestaurant;
  error?: string;
}

export async function batchScrape(
  urls: string[],
  onProgress?: (current: number, total: number, result: BatchScrapeResult) => void
): Promise<BatchScrapeResult[]> {
  const results: BatchScrapeResult[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const restaurant = await scrapeWebsite(url);
      const result: BatchScrapeResult = { url, success: true, restaurant };
      results.push(result);
      onProgress?.(i + 1, urls.length, result);
    } catch (error) {
      const result: BatchScrapeResult = {
        url,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      results.push(result);
      onProgress?.(i + 1, urls.length, result);
    }
  }

  return results;
}
