/*
  ═══════════════════════════════════════════════════════════════════
    src/data/restaurants-real.ts
    Realistic restaurant data for delivery app demonstration
    ═══════════════════════════════════════════════════════════════════
*/

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  cuisineType: string[];
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  image: string;
  logo?: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  website?: string;
  hours: {
    [key: string]: { open: string; close: string } | null;
  };
  menu: MenuCategory[];
  badges?: string[];
  isOpen: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  isPromo?: boolean;
  promoText?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  allergens?: string[];
  paymentMethods?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  isPopular?: boolean;
  isNew?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  allergens?: string[];
  options?: MenuItemOption[];
  extras?: MenuItemExtra[];
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: { id: string; name: string; price?: number }[];
  required: boolean;
}

export interface MenuItemExtra {
  id: string;
  name: string;
  price: number;
}

export const restaurants: Restaurant[] = [
  // ═══════════════════════════════════════════════════════════════
  // PARIS — Restaurants Français
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'rest-paris-001',
    name: 'Le Bistrot du Coin',
    description: 'Bistrot traditionnel parisien avec une cuisine française authentique. Plats du jour, viandes grillées et desserts maison.',
    cuisine: 'Française',
    cuisineType: ['Française', 'Bistrot'],
    priceRange: '€€',
    rating: 4.5,
    reviewCount: 234,
    deliveryTime: '25-40 min',
    deliveryFee: 2.99,
    minOrder: 15.00,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    address: '24 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    phone: '+33 1 42 60 00 00',
    website: 'https://lebistrotducoin.fr',
    hours: {
      monday: { open: '11:30', close: '15:00' },
      tuesday: { open: '11:30', close: '15:00' },
      wednesday: { open: '11:30', close: '15:00' },
      thursday: { open: '11:30', close: '15:00' },
      friday: { open: '11:30', close: '15:00' },
      saturday: { open: '11:30', close: '15:00' },
      sunday: null,
    },
    menu: [
      {
        id: 'cat-001',
        name: 'Entrées',
        items: [
          {
            id: 'item-001',
            name: 'Salade de Chèvre Chaud',
            description: 'Salade verte, chèvre chaud sur toast, noix, miel, vinaigrette maison',
            price: 12.90,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-002',
            name: 'Soupe à l\'Oignon Gratinée',
            description: 'Soupe à l\'oignon traditionnelle, gratinée au fromage et croûtons',
            price: 9.90,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-003',
            name: 'Tartare de Saumon',
            description: 'Tartare de saumon frais, avocat, citron vert, coriandre',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson'],
          },
        ],
      },
      {
        id: 'cat-002',
        name: 'Plats',
        items: [
          {
            id: 'item-004',
            name: 'Steak Frites',
            description: 'Entrecôte grillée, frites maison, sauce au poivre',
            price: 22.90,
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: [],
            options: [
              {
                id: 'opt-001',
                name: 'Cuisson',
                required: true,
                choices: [
                  { id: 'c-001', name: 'Saignant' },
                  { id: 'c-002', name: 'À point' },
                  { id: 'c-003', name: 'Bien cuit' },
                ],
              },
            ],
          },
          {
            id: 'item-005',
            name: 'Poulet Rôti et Légumes',
            description: 'Poulet fermier rôti, pommes de terre, carottes, oignons',
            price: 18.90,
            image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=500&fit=crop',
            allergens: [],
          },
          {
            id: 'item-006',
            name: 'Magret de Canard',
            description: 'Magret de canard grillé, sauce au miel et thym, purée de patates douces',
            price: 24.90,
            image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: [],
          },
          {
            id: 'item-007',
            name: 'Ratatouille Niçoise',
            description: 'Ratatouille traditionnelle, riz basmati, herbes de Provence',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=500&h=500&fit=crop',
            isVegetarian: true,
            isVegan: true,
            allergens: [],
          },
        ],
      },
      {
        id: 'cat-003',
        name: 'Desserts',
        items: [
          {
            id: 'item-008',
            name: 'Crème Brûlée',
            description: 'Crème brûlée à la vanille de Madagascar',
            price: 8.90,
            image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['lactose', 'œufs'],
          },
          {
            id: 'item-009',
            name: 'Tarte Tatin',
            description: 'Tarte Tatin aux pommes caramélisées, crème fraîche',
            price: 9.90,
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-010',
            name: 'Mousse au Chocolat',
            description: 'Mousse au chocolat noir 70%, éclats de noisettes',
            price: 7.90,
            image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?w=500&h=500&fit=crop',
            isVegetarian: true,
            allergens: ['lactose', 'œufs'],
          },
        ],
      },
    ],
    badges: ['Livraison rapide', 'Populaire', 'Française'],
    isOpen: true,
    isBestseller: true,
    latitude: 48.8688,
    longitude: 2.3319,
    features: ['Livraison rapide', 'Commande en ligne', 'Paiement CB'],
    paymentMethods: ['CB', 'Espèces', 'Ticket Restaurant'],
  },
  {
    id: 'rest-paris-002',
    name: 'Sushi Master',
    description: 'Restaurant japonais authentique avec sushis, sashimis et rolls préparés par des chefs japonais.',
    cuisine: 'Japonaise',
    cuisineType: ['Japonaise', 'Sushi'],
    priceRange: '€€€',
    rating: 4.7,
    reviewCount: 312,
    deliveryTime: '30-45 min',
    deliveryFee: 3.99,
    minOrder: 20.00,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=200&h=200&fit=crop',
    address: '45 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    phone: '+33 1 53 75 00 00',
    website: 'https://sushimaster.fr',
    hours: {
      monday: { open: '11:30', close: '14:30' },
      tuesday: { open: '11:30', close: '14:30' },
      wednesday: { open: '11:30', close: '14:30' },
      thursday: { open: '11:30', close: '14:30' },
      friday: { open: '11:30', close: '14:30' },
      saturday: { open: '11:30', close: '14:30' },
      sunday: { open: '11:30', close: '14:30' },
    },
    menu: [
      {
        id: 'cat-004',
        name: 'Sushis',
        items: [
          {
            id: 'item-011',
            name: 'Sushi Saumon (6 pcs)',
            description: '6 sushis au saumon frais',
            price: 12.90,
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson', 'gluten'],
          },
          {
            id: 'item-012',
            name: 'Sushi Thon (6 pcs)',
            description: '6 sushis au thon rouge',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson', 'gluten'],
          },
          {
            id: 'item-013',
            name: 'Sushi Avocat (6 pcs)',
            description: '6 sushis à l\'avocat',
            price: 9.90,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop',
            isVegetarian: true,
            isVegan: true,
            allergens: ['gluten'],
          },
        ],
      },
      {
        id: 'cat-005',
        name: 'Sashimis',
        items: [
          {
            id: 'item-014',
            name: 'Sashimi Saumon (9 pcs)',
            description: '9 tranches de saumon frais',
            price: 18.90,
            image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson'],
          },
          {
            id: 'item-015',
            name: 'Sashimi Mixte (12 pcs)',
            description: '12 tranches assorties : saumon, thon, daurade',
            price: 24.90,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop',
            isBestseller: true,
            allergens: ['poisson'],
          },
        ],
      },
      {
        id: 'cat-006',
        name: 'Rolls',
        items: [
          {
            id: 'item-016',
            name: 'California Roll (8 pcs)',
            description: 'Crabe, avocat, concombre, tobiko',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['poisson', 'gluten'],
          },
          {
            id: 'item-017',
            name: 'Dragon Roll (8 pcs)',
            description: 'Tempura crevette, avocat, sauce épicée',
            price: 16.90,
            image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['crustacés', 'gluten'],
          },
          {
            id: 'item-018',
            name: 'Spicy Tuna Roll (8 pcs)',
            description: 'Thon épicé, concombre, sésame',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=500&fit=crop',
            isSpicy: true,
            allergens: ['poisson', 'gluten', 'sésame'],
          },
        ],
      },
      {
        id: 'cat-007',
        name: 'Menus',
        items: [
          {
            id: 'item-019',
            name: 'Menu Sushi Deluxe',
            description: '12 sushis assortis, soupe miso, salade',
            price: 28.90,
            originalPrice: 32.90,
            image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['poisson', 'gluten'],
          },
          {
            id: 'item-020',
            name: 'Menu Sashimi Royal',
            description: '18 sashimis assortis, riz, soupe miso',
            price: 35.90,
            image: 'https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson'],
          },
        ],
      },
    ],
    badges: ['Premium', 'Authentique', 'Japonais'],
    isOpen: true,
    isBestseller: true,
    isPromo: true,
    promoText: '-10% sur les menus',
    latitude: 48.8698,
    longitude: 2.3079,
    features: ['Livraison premium', 'Produits frais', 'Chefs japonais'],
    paymentMethods: ['CB', 'Ticket Restaurant'],
  },
  {
    id: 'rest-paris-003',
    name: 'Pizza Napoli',
    description: 'Pizzeria authentique napolitaine avec four à bois. Pâte fine et garnitures généreuses.',
    cuisine: 'Italienne',
    cuisineType: ['Italienne', 'Pizza'],
    priceRange: '€€',
    rating: 4.4,
    reviewCount: 189,
    deliveryTime: '20-35 min',
    deliveryFee: 1.99,
    minOrder: 12.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    address: '18 Rue de Rivoli',
    city: 'Paris',
    postalCode: '75004',
    phone: '+33 1 42 72 00 00',
    website: 'https://pizzanapoli.fr',
    hours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '11:00', close: '23:00' },
    },
    menu: [
      {
        id: 'cat-008',
        name: 'Pizzas',
        items: [
          {
            id: 'item-021',
            name: 'Margherita',
            description: 'Sauce tomate, mozzarella di bufala, basilic frais',
            price: 11.90,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-022',
            name: 'Regina',
            description: 'Sauce tomate, mozzarella, jambon, champignons',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-023',
            name: 'Diavola',
            description: 'Sauce tomate, mozzarella, chorizo épicé, piments',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
            isSpicy: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-024',
            name: 'Quattro Formaggi',
            description: 'Mozzarella, gorgonzola, parmesan, chèvre',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop',
            isVegetarian: true,
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-025',
            name: 'Pepperoni',
            description: 'Sauce tomate, mozzarella, pepperoni',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
            isBestseller: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
      {
        id: 'cat-009',
        name: 'Pâtes',
        items: [
          {
            id: 'item-026',
            name: 'Spaghetti Carbonara',
            description: 'Spaghetti, pancetta, œufs, parmesan, poivre noir',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten', 'lactose', 'œufs'],
          },
          {
            id: 'item-027',
            name: 'Penne Arrabbiata',
            description: 'Penne, sauce tomate épicée, ail, basilic',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=500&fit=crop',
            isSpicy: true,
            isVegetarian: true,
            allergens: ['gluten'],
          },
        ],
      },
      {
        id: 'cat-010',
        name: 'Desserts',
        items: [
          {
            id: 'item-028',
            name: 'Tiramisu',
            description: 'Tiramisu maison, mascarpone, café, cacao',
            price: 7.90,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['lactose', 'gluten', 'œufs'],
          },
          {
            id: 'item-029',
            name: 'Panna Cotta',
            description: 'Panna cotta vanille, coulis de fruits rouges',
            price: 6.90,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop',
            isVegetarian: true,
            allergens: ['lactose'],
          },
        ],
      },
    ],
    badges: ['Four à bois', 'Italien', 'Rapide'],
    isOpen: true,
    isPromo: true,
    promoText: '1 pizza achetée = 1 dessert offert',
    latitude: 48.8565,
    longitude: 2.3522,
    features: ['Four à bois', 'Pâte maison', 'Livraison rapide'],
    paymentMethods: ['CB', 'Espèces'],
  },
  {
    id: 'rest-paris-004',
    name: 'Le Grand Burger',
    description: 'Burgers gourmets avec viande française, pains artisanaux et sauces maison. Frites fraîches coupées à la main.',
    cuisine: 'Américaine',
    cuisineType: ['Américaine', 'Burger'],
    priceRange: '€€',
    rating: 4.3,
    reviewCount: 456,
    deliveryTime: '20-30 min',
    deliveryFee: 2.49,
    minOrder: 12.00,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop',
    address: '35 Rue Montorgueil',
    city: 'Paris',
    postalCode: '75001',
    phone: '+33 1 42 33 00 00',
    website: 'https://legrandburger.fr',
    hours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '11:00', close: '23:00' },
    },
    menu: [
      {
        id: 'cat-011',
        name: 'Burgers',
        items: [
          {
            id: 'item-030',
            name: 'Classic Burger',
            description: 'Bœuf français, cheddar, salade, tomate, oignon, sauce maison',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
            options: [
              {
                id: 'opt-002',
                name: 'Cuisson',
                required: true,
                choices: [
                  { id: 'c-004', name: 'Saignant' },
                  { id: 'c-005', name: 'À point' },
                  { id: 'c-006', name: 'Bien cuit' },
                ],
              },
            ],
            extras: [
              { id: 'ext-001', name: 'Bacon', price: 1.50 },
              { id: 'ext-002', name: 'Fromage supplémentaire', price: 1.00 },
              { id: 'ext-003', name: 'Avocat', price: 1.50 },
            ],
          },
          {
            id: 'item-031',
            name: 'BBQ Burger',
            description: 'Bœuf français, bacon, oignon croustillant, sauce BBQ fumée',
            price: 15.90,
            image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-032',
            name: 'Veggie Burger',
            description: 'Galette de légumes, avocat, pousses d\'épinard, sauce yaourt',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=500&fit=crop',
            isVegetarian: true,
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-033',
            name: 'Chicken Burger',
            description: 'Poulet pané maison, coleslaw, cornichons, sauce spicy',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=500&fit=crop',
            allergens: ['gluten', 'lactose', 'œufs'],
          },
        ],
      },
      {
        id: 'cat-012',
        name: 'Accompagnements',
        items: [
          {
            id: 'item-034',
            name: 'Frites Maison',
            description: 'Frites fraîches coupées à la main, sel de Guérande',
            price: 4.90,
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop',
            isVegetarian: true,
            isVegan: true,
            isPopular: true,
            allergens: [],
          },
          {
            id: 'item-035',
            name: 'Frites de Patates Douces',
            description: 'Frites de patates douces, sauce ail et herbes',
            price: 5.90,
            image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=500&fit=crop',
            isVegetarian: true,
            isVegan: true,
            allergens: [],
          },
          {
            id: 'item-036',
            name: 'Onion Rings',
            description: 'Rondelles d\'oignon panées, sauce ranch',
            price: 5.90,
            image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=500&fit=crop',
            isVegetarian: true,
            allergens: ['gluten', 'lactose', 'œufs'],
          },
        ],
      },
      {
        id: 'cat-013',
        name: 'Menus',
        items: [
          {
            id: 'item-037',
            name: 'Menu Classic',
            description: 'Classic Burger + Frites + Boisson',
            price: 17.90,
            originalPrice: 20.90,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-038',
            name: 'Menu Duo',
            description: '2 Burgers au choix + 2 Frites + 2 Boissons',
            price: 32.90,
            originalPrice: 38.90,
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
    ],
    badges: ['Burgers gourmets', 'Frites maison', 'Populaire'],
    isOpen: true,
    isBestseller: true,
    isPromo: true,
    promoText: '-15% sur les menus',
    latitude: 48.8645,
    longitude: 2.3478,
    features: ['Viande française', 'Pain artisanal', 'Frites maison'],
    paymentMethods: ['CB', 'Ticket Restaurant'],
  },
  {
    id: 'rest-paris-005',
    name: 'Tacos Mania',
    description: 'Tacos et kebabs généreux avec viande halal, sauces maison et frites fraîches.',
    cuisine: 'Fast Food',
    cuisineType: ['Fast Food', 'Tacos', 'Kebab'],
    priceRange: '€',
    rating: 4.0,
    reviewCount: 234,
    deliveryTime: '15-25 min',
    deliveryFee: 0.99,
    minOrder: 10.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop',
    address: '55 Boulevard de Clichy',
    city: 'Paris',
    postalCode: '75009',
    phone: '+33 1 48 74 00 00',
    hours: {
      monday: { open: '11:00', close: '02:00' },
      tuesday: { open: '11:00', close: '02:00' },
      wednesday: { open: '11:00', close: '02:00' },
      thursday: { open: '11:00', close: '02:00' },
      friday: { open: '11:00', close: '04:00' },
      saturday: { open: '11:00', close: '04:00' },
      sunday: { open: '11:00', close: '02:00' },
    },
    menu: [
      {
        id: 'cat-014',
        name: 'Tacos',
        items: [
          {
            id: 'item-039',
            name: 'Tacos Classic',
            description: 'Tortilla, viande au choix, frites, sauce fromagère, légumes',
            price: 8.90,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten', 'lactose'],
            options: [
              {
                id: 'opt-003',
                name: 'Viande',
                required: true,
                choices: [
                  { id: 'c-007', name: 'Poulet' },
                  { id: 'c-008', name: 'Bœuf' },
                  { id: 'c-009', name: 'Mixte' },
                ],
              },
              {
                id: 'opt-004',
                name: 'Taille',
                required: true,
                choices: [
                  { id: 'c-010', name: 'M', price: 0 },
                  { id: 'c-011', name: 'L', price: 2 },
                  { id: 'c-012', name: 'XL', price: 4 },
                ],
              },
            ],
          },
          {
            id: 'item-040',
            name: 'Tacos Mexicain',
            description: 'Tortilla, poulet épicé, frites, guacamole, piments, sauce chipotle',
            price: 10.90,
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=500&fit=crop',
            isSpicy: true,
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
      {
        id: 'cat-015',
        name: 'Kebabs',
        items: [
          {
            id: 'item-041',
            name: 'Kebab Classique',
            description: 'Pain pita, viande kebab, salade, tomate, oignon, sauce blanche',
            price: 7.90,
            image: 'https://images.unsplash.com/photo-1644365584070-723349893316?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-042',
            name: 'Assiette Kebab',
            description: 'Viande kebab, frites, salade, sauce au choix',
            price: 10.90,
            image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&h=500&fit=crop',
            isBestseller: true,
            allergens: ['lactose'],
          },
        ],
      },
      {
        id: 'cat-016',
        name: 'Menus',
        items: [
          {
            id: 'item-043',
            name: 'Menu Tacos',
            description: 'Tacos + Boisson + Dessert',
            price: 11.90,
            originalPrice: 13.90,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
    ],
    badges: ['Halal', 'Ouvert tard', 'Économique'],
    isOpen: true,
    isNew: true,
    latitude: 48.8834,
    longitude: 2.3275,
    features: ['Halal', 'Ouvert tard', 'Livraison rapide'],
    paymentMethods: ['CB', 'Espèces'],
  },

  // ═══════════════════════════════════════════════════════════════
  // LYON — Restaurants
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'rest-lyon-001',
    name: 'Bouchon Lyonnais',
    description: 'Bouchon traditionnel lyonnais avec quenelles, andouillette et tablier de sapeur. Ambiance conviviale.',
    cuisine: 'Lyonnaise',
    cuisineType: ['Lyonnaise', 'Bouchon'],
    priceRange: '€€',
    rating: 4.6,
    reviewCount: 178,
    deliveryTime: '30-45 min',
    deliveryFee: 2.99,
    minOrder: 18.00,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
    address: '12 Rue du Bœuf',
    city: 'Lyon',
    postalCode: '69005',
    phone: '+33 4 72 00 00 00',
    website: 'https://bouchonlyonnais.fr',
    hours: {
      monday: null,
      tuesday: { open: '11:30', close: '14:30' },
      wednesday: { open: '11:30', close: '14:30' },
      thursday: { open: '11:30', close: '14:30' },
      friday: { open: '11:30', close: '14:30' },
      saturday: { open: '11:30', close: '14:30' },
      sunday: { open: '11:30', close: '14:30' },
    },
    menu: [
      {
        id: 'cat-017',
        name: 'Entrées',
        items: [
          {
            id: 'item-044',
            name: 'Salade Lyonnaise',
            description: 'Salade frisée, lardons, croûtons, œuf poché, vinaigrette chaude',
            price: 11.90,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'œufs'],
          },
          {
            id: 'item-045',
            name: 'Tablier de Sapeur',
            description: 'Panure de bœuf, sauce gribiche, cornichons',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop',
            allergens: ['gluten', 'œufs'],
          },
        ],
      },
      {
        id: 'cat-018',
        name: 'Plats',
        items: [
          {
            id: 'item-046',
            name: 'Quenelles de Brochet',
            description: 'Quenelles maison, sauce Nantua, riz pilaf',
            price: 19.90,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten', 'lactose', 'œufs', 'poisson'],
          },
          {
            id: 'item-047',
            name: 'Andouillette Lyonnaise',
            description: 'Andouillette 5A grillée, sauce moutarde, pommes purée',
            price: 18.90,
            image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: [],
          },
          {
            id: 'item-048',
            name: 'Cervelle de Canut',
            description: 'Fromage blanc, herbes, échalote, huile d\'olive',
            price: 8.90,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=500&fit=crop',
            isVegetarian: true,
            allergens: ['lactose'],
          },
        ],
      },
      {
        id: 'cat-019',
        name: 'Desserts',
        items: [
          {
            id: 'item-049',
            name: 'Tarte aux Pralines',
            description: 'Tarte aux pralines roses, pâte sablée',
            price: 7.90,
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
    ],
    badges: ['Tradition', 'Lyonnais', 'Authentique'],
    isOpen: true,
    isBestseller: true,
    latitude: 45.764,
    longitude: 4.8357,
    features: ['Tradition lyonnaise', 'Produits locaux'],
    paymentMethods: ['CB', 'Espèces'],
  },
  {
    id: 'rest-lyon-002',
    name: 'Le Comptoir du Sud',
    description: 'Cuisine du sud de la France avec des influences méditerranéennes. Tapas, poissons et vins du Languedoc.',
    cuisine: 'Méditerranéenne',
    cuisineType: ['Méditerranéenne', 'Française du Sud'],
    priceRange: '€€€',
    rating: 4.5,
    reviewCount: 134,
    deliveryTime: '35-50 min',
    deliveryFee: 3.49,
    minOrder: 22.00,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop',
    address: '25 Quai Saint-Antoine',
    city: 'Lyon',
    postalCode: '69002',
    phone: '+33 4 78 00 00 00',
    website: 'https://comptoirsud.fr',
    hours: {
      monday: { open: '12:00', close: '14:30' },
      tuesday: { open: '12:00', close: '14:30' },
      wednesday: { open: '12:00', close: '14:30' },
      thursday: { open: '12:00', close: '14:30' },
      friday: { open: '12:00', close: '14:30' },
      saturday: { open: '12:00', close: '14:30' },
      sunday: { open: '12:00', close: '14:30' },
    },
    menu: [
      {
        id: 'cat-020',
        name: 'Tapas',
        items: [
          {
            id: 'item-050',
            name: 'Assortiment Tapas (6 pcs)',
            description: '6 tapas variées : hummus, olives, anchois, fromage, jambon, légumes grillés',
            price: 16.90,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['lactose'],
          },
          {
            id: 'item-051',
            name: 'Calamars à la Plancha',
            description: 'Calamars grillés, ail, persil, citron',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=500&fit=crop',
            allergens: ['mollusques'],
          },
        ],
      },
      {
        id: 'cat-021',
        name: 'Plats',
        items: [
          {
            id: 'item-052',
            name: 'Bouillabaisse',
            description: 'Soupe de poisson traditionnelle, rouille, croûtons',
            price: 26.90,
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['poisson', 'gluten', 'crustacés'],
          },
          {
            id: 'item-053',
            name: 'Daube Provençale',
            description: 'Bœuf mijoté au vin rouge, olives, carottes, polenta',
            price: 22.90,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
            allergens: [],
          },
        ],
      },
    ],
    badges: ['Méditerranéen', 'Vins du Sud', 'Premium'],
    isOpen: true,
    latitude: 45.7589,
    longitude: 4.8314,
    features: ['Vins du Languedoc', 'Produits frais'],
    paymentMethods: ['CB'],
  },

  // ═══════════════════════════════════════════════════════════════
  // MARSEILLE — Restaurants
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'rest-marseille-001',
    name: 'La Bouillabaisse Royale',
    description: 'Restaurant spécialisé en bouillabaisse authentique et fruits de mer frais du port de Marseille.',
    cuisine: 'Française du Sud',
    cuisineType: ['Française du Sud', 'Fruits de Mer'],
    priceRange: '€€€€',
    rating: 4.7,
    reviewCount: 198,
    deliveryTime: '40-55 min',
    deliveryFee: 4.99,
    minOrder: 30.00,
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop',
    address: '15 Quai du Port',
    city: 'Marseille',
    postalCode: '13002',
    phone: '+33 4 91 00 00 00',
    website: 'https://bouillabaisseroyale.fr',
    hours: {
      monday: { open: '12:00', close: '14:00' },
      tuesday: { open: '12:00', close: '14:00' },
      wednesday: { open: '12:00', close: '14:00' },
      thursday: { open: '12:00', close: '14:00' },
      friday: { open: '12:00', close: '14:00' },
      saturday: { open: '12:00', close: '14:00' },
      sunday: { open: '12:00', close: '14:00' },
    },
    menu: [
      {
        id: 'cat-022',
        name: 'Fruits de Mer',
        items: [
          {
            id: 'item-054',
            name: 'Plateau de Fruits de Mer (2 pers)',
            description: 'Huîtres, crevettes, bulots, crabes, langoustines',
            price: 65.00,
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['crustacés', 'mollusques'],
          },
          {
            id: 'item-055',
            name: 'Bouillabaisse Traditionnelle',
            description: 'Soupe de poisson, 3 poissons, rouille, croûtons',
            price: 38.00,
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson', 'gluten'],
          },
        ],
      },
      {
        id: 'cat-023',
        name: 'Poissons',
        items: [
          {
            id: 'item-056',
            name: 'Daurade Grillée',
            description: 'Daurade royale grillée, légumes provençaux, huile d\'olive',
            price: 28.00,
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=500&fit=crop',
            allergens: ['poisson'],
          },
        ],
      },
    ],
    badges: ['Fruits de mer', 'Tradition', 'Premium'],
    isOpen: true,
    isBestseller: true,
    latitude: 43.2965,
    longitude: 5.3698,
    features: ['Fruits de mer frais', 'Vue sur le port'],
    paymentMethods: ['CB'],
  },
  {
    id: 'rest-marseille-002',
    name: 'Chez Momo',
    description: 'Restaurant oriental avec couscous, tajines et grillades. Ambiance chaleureuse et familiale.',
    cuisine: 'Oriental',
    cuisineType: ['Oriental', 'Marocain', 'Maghrébin'],
    priceRange: '€€',
    rating: 4.3,
    reviewCount: 167,
    deliveryTime: '25-40 min',
    deliveryFee: 2.49,
    minOrder: 15.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    address: '42 Cours Julien',
    city: 'Marseille',
    postalCode: '13006',
    phone: '+33 4 91 50 00 00',
    hours: {
      monday: { open: '11:30', close: '23:00' },
      tuesday: { open: '11:30', close: '23:00' },
      wednesday: { open: '11:30', close: '23:00' },
      thursday: { open: '11:30', close: '23:00' },
      friday: { open: '11:30', close: '00:00' },
      saturday: { open: '11:30', close: '00:00' },
      sunday: { open: '11:30', close: '23:00' },
    },
    menu: [
      {
        id: 'cat-024',
        name: 'Couscous',
        items: [
          {
            id: 'item-057',
            name: 'Couscous Royal',
            description: 'Couscous, agneau, poulet, merguez, légumes, sauce',
            price: 18.90,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            allergens: ['gluten'],
          },
          {
            id: 'item-058',
            name: 'Couscous Végétarien',
            description: 'Couscous, légumes variés, pois chiches, raisins secs',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
            isVegetarian: true,
            isVegan: true,
            allergens: ['gluten'],
          },
        ],
      },
      {
        id: 'cat-025',
        name: 'Tajines',
        items: [
          {
            id: 'item-059',
            name: 'Tajine d\'Agneau',
            description: 'Agneau mijoté, pruneaux, amandes, semoule',
            price: 19.90,
            image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'fruits à coque'],
          },
          {
            id: 'item-060',
            name: 'Tajine de Poulet',
            description: 'Poulet, citrons confits, olives, pommes de terre',
            price: 17.90,
            image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=500&fit=crop',
            allergens: [],
          },
        ],
      },
    ],
    badges: ['Oriental', 'Halal', 'Familial'],
    isOpen: true,
    latitude: 43.2965,
    longitude: 5.3811,
    features: ['Halal', 'Cuisine familiale'],
    paymentMethods: ['CB', 'Espèces'],
  },

  // ═══════════════════════════════════════════════════════════════
  // NICE — Restaurants
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'rest-nice-001',
    name: 'La Socca Niçoise',
    description: 'Restaurant niçois traditionnel avec socca, pissaladière et salade niçoise. Spécialités de la Côte d\'Azur.',
    cuisine: 'Niçoise',
    cuisineType: ['Niçoise', 'Méditerranéenne'],
    priceRange: '€',
    rating: 4.5,
    reviewCount: 234,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minOrder: 10.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop',
    address: '8 Rue Pairolière',
    city: 'Nice',
    postalCode: '06300',
    phone: '+33 4 93 00 00 00',
    website: 'https://soccanicoise.fr',
    hours: {
      monday: { open: '11:00', close: '21:00' },
      tuesday: { open: '11:00', close: '21:00' },
      wednesday: { open: '11:00', close: '21:00' },
      thursday: { open: '11:00', close: '21:00' },
      friday: { open: '11:00', close: '22:00' },
      saturday: { open: '11:00', close: '22:00' },
      sunday: { open: '11:00', close: '21:00' },
    },
    menu: [
      {
        id: 'cat-026',
        name: 'Spécialités Niçoises',
        items: [
          {
            id: 'item-061',
            name: 'Socca Traditionnelle',
            description: 'Galette de farine de pois chiche, huile d\'olive, poivre',
            price: 5.90,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop',
            isPopular: true,
            isBestseller: true,
            isVegetarian: true,
            isVegan: true,
            allergens: [],
          },
          {
            id: 'item-062',
            name: 'Pissaladière',
            description: 'Tarte oignons, anchois, olives, pâte à pain',
            price: 8.90,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'poisson'],
          },
          {
            id: 'item-063',
            name: 'Salade Niçoise',
            description: 'Thon, œufs, haricots verts, tomates, olives, anchois',
            price: 13.90,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['poisson', 'œufs'],
          },
        ],
      },
    ],
    badges: ['Niçois', 'Tradition', 'Économique'],
    isOpen: true,
    isBestseller: true,
    latitude: 43.7102,
    longitude: 7.262,
    features: ['Spécialités niçoises', 'Prix doux'],
    paymentMethods: ['CB', 'Espèces'],
  },
  {
    id: 'rest-nice-002',
    name: 'Ristorante Bella Napoli',
    description: 'Restaurant italien authentique avec pizzas au feu de bois et pâtes fraîches. Ambiance chaleureuse.',
    cuisine: 'Italienne',
    cuisineType: ['Italienne', 'Pizza'],
    priceRange: '€€',
    rating: 4.4,
    reviewCount: 189,
    deliveryTime: '25-35 min',
    deliveryFee: 2.49,
    minOrder: 14.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=500&fit=crop',
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    address: '20 Rue de la Buffa',
    city: 'Nice',
    postalCode: '06000',
    phone: '+33 4 93 50 00 00',
    website: 'https://bellanapoli.fr',
    hours: {
      monday: { open: '11:30', close: '22:00' },
      tuesday: { open: '11:30', close: '22:00' },
      wednesday: { open: '11:30', close: '22:00' },
      thursday: { open: '11:30', close: '22:00' },
      friday: { open: '11:30', close: '23:00' },
      saturday: { open: '11:30', close: '23:00' },
      sunday: { open: '11:30', close: '22:00' },
    },
    menu: [
      {
        id: 'cat-027',
        name: 'Pizzas',
        items: [
          {
            id: 'item-064',
            name: 'Pizza Margherita',
            description: 'Sauce tomate, mozzarella, basilic',
            price: 10.90,
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop',
            isPopular: true,
            isVegetarian: true,
            allergens: ['gluten', 'lactose'],
          },
          {
            id: 'item-065',
            name: 'Pizza Reine',
            description: 'Sauce tomate, mozzarella, jambon, champignons',
            price: 12.90,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
            isPopular: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
      {
        id: 'cat-028',
        name: 'Pâtes',
        items: [
          {
            id: 'item-066',
            name: 'Spaghetti Bolognaise',
            description: 'Spaghetti, sauce bolognaise maison, parmesan',
            price: 14.90,
            image: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=500&h=500&fit=crop',
            isBestseller: true,
            allergens: ['gluten', 'lactose'],
          },
        ],
      },
    ],
    badges: ['Italien', 'Four à bois', 'Familial'],
    isOpen: true,
    latitude: 43.7034,
    longitude: 7.2663,
    features: ['Four à bois', 'Pâtes fraîches'],
    paymentMethods: ['CB'],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════ */

export function getRestaurantsByCity(city: string): Restaurant[] {
  return restaurants.filter((r) => r.city.toLowerCase() === city.toLowerCase());
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}

export function searchRestaurants(query: string): Restaurant[] {
  const q = query.toLowerCase();
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.cuisineType.some((c) => c.toLowerCase().includes(q)) ||
      r.address.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)
  );
}

export function getRestaurantsByCuisine(cuisine: string): Restaurant[] {
  return restaurants.filter(
    (r) =>
      r.cuisine.toLowerCase().includes(cuisine.toLowerCase()) ||
      r.cuisineType.some((c) => c.toLowerCase().includes(cuisine.toLowerCase()))
  );
}

export function getOpenRestaurants(): Restaurant[] {
  return restaurants.filter((r) => r.isOpen);
}

export function getBestsellerRestaurants(): Restaurant[] {
  return restaurants.filter((r) => r.isBestseller);
}

export function getNewRestaurants(): Restaurant[] {
  return restaurants.filter((r) => r.isNew);
}

export function getPromoRestaurants(): Restaurant[] {
  return restaurants.filter((r) => r.isPromo);
}

export const cuisineTypes = [
  'Française',
  'Japonaise',
  'Italienne',
  'Américaine',
  'Fast Food',
  'Lyonnaise',
  'Méditerranéenne',
  'Française du Sud',
  'Fruits de Mer',
  'Oriental',
  'Niçoise',
];

export const priceRanges = [
  { value: '€', label: 'Économique' },
  { value: '€€', label: 'Modéré' },
  { value: '€€€', label: 'Premium' },
  { value: '€€€€', label: 'Luxury' },
];
