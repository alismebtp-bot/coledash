export interface FlowerProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  occasion?: string
  rating: number
  image: string
  storeId: string
}

export const flowerCatalog: FlowerProduct[] = [
  {
    id: 'fp-1',
    name: 'Classic Red Roses Bouquet',
    description: 'A beautiful bouquet of 12 fresh red roses, perfect for expressing love and passion.',
    price: 39.99,
    category: 'Roses',
    occasion: 'Romance',
    rating: 4.8,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-1',
  },
  {
    id: 'fp-2',
    name: 'Sunshine Mixed Bouquet',
    description: 'A cheerful mix of sunflowers, daisies, and yellow roses to brighten any day.',
    price: 34.99,
    category: 'Mixed',
    occasion: 'Birthday',
    rating: 4.6,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-1',
  },
  {
    id: 'fp-3',
    name: 'Elegant White Lilies',
    description: 'Pure white lilies arranged with eucalyptus leaves for an elegant touch.',
    price: 44.99,
    category: 'Lilies',
    occasion: 'Sympathy',
    rating: 4.9,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-2',
  },
  {
    id: 'fp-4',
    name: 'Spring Tulip Collection',
    description: 'Vibrant tulips in pink, purple, and yellow celebrating the freshness of spring.',
    price: 29.99,
    category: 'Tulips',
    occasion: 'Spring',
    rating: 4.5,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-2',
  },
  {
    id: 'fp-5',
    name: 'Luxury Orchid Arrangement',
    description: 'Exotic purple orchids in a premium ceramic pot, a statement piece for any home.',
    price: 59.99,
    category: 'Orchids',
    occasion: 'Anniversary',
    rating: 4.7,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-1',
  },
  {
    id: 'fp-6',
    name: 'Pastel Peony Bouquet',
    description: 'Soft pink and white peonies with baby breath for a dreamy, romantic feel.',
    price: 49.99,
    category: 'Peonies',
    occasion: 'Wedding',
    rating: 4.8,
    image: '/flower-bouquet.jpg',
    storeId: 'flower-2',
  },
]
