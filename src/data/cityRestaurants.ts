export const cityRestaurants: Record<string, Array<{
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  image: string;
  tags: string[];
  priceRange: string;
  promotion?: string;
}>> = {
  paris: [
    {
      id: 'p1',
      name: 'Le Petit Bistrot',
      cuisine: 'Française',
      rating: 4.7,
      deliveryTime: '25-35 min',
      image: '/images/restaurants/paris-bistro.jpg',
      tags: ['Traditionnel', 'Bistrot'],
      priceRange: '€€',
      promotion: '-15% sur votre première commande'
    },
    {
      id: 'p2',
      name: 'Sakura Sushi',
      cuisine: 'Japonaise',
      rating: 4.5,
      deliveryTime: '30-40 min',
      image: '/images/restaurants/paris-sushi.jpg',
      tags: ['Sushi', 'Asiatique'],
      priceRange: '€€€'
    },
    {
      id: 'p3',
      name: 'Pizza Napoli',
      cuisine: 'Italienne',
      rating: 4.3,
      deliveryTime: '20-30 min',
      image: '/images/restaurants/paris-pizza.jpg',
      tags: ['Pizza', 'Italien'],
      priceRange: '€€'
    },
    {
      id: 'p4',
      name: 'Tacos Boulevard',
      cuisine: 'Mexicaine',
      rating: 4.1,
      deliveryTime: '15-25 min',
      image: '/images/restaurants/paris-tacos.jpg',
      tags: ['Street Food', 'Mexicain'],
      priceRange: '€'
    }
  ],
  london: [
    {
      id: 'l1',
      name: 'The Curry House',
      cuisine: 'Indienne',
      rating: 4.6,
      deliveryTime: '30-40 min',
      image: '/images/restaurants/london-curry.jpg',
      tags: ['Indien', 'Épicé'],
      priceRange: '€€'
    },
    {
      id: 'l2',
      name: 'Fish & Chips Co.',
      cuisine: 'Britannique',
      rating: 4.2,
      deliveryTime: '20-30 min',
      image: '/images/restaurants/london-fish.jpg',
      tags: ['Traditionnel', 'Britannique'],
      priceRange: '€€'
    }
  ],
  berlin: [
    {
      id: 'b1',
      name: 'Bratwurst Haus',
      cuisine: 'Allemande',
      rating: 4.4,
      deliveryTime: '25-35 min',
      image: '/images/restaurants/berlin-bratwurst.jpg',
      tags: ['Allemand', 'Traditionnel'],
      priceRange: '€€'
    },
    {
      id: 'b2',
      name: 'Döner King',
      cuisine: 'Turque',
      rating: 4.0,
      deliveryTime: '15-20 min',
      image: '/images/restaurants/berlin-doner.jpg',
      tags: ['Street Food', 'Turc'],
      priceRange: '€'
    }
  ],
  madrid: [
    {
      id: 'm1',
      name: 'Tapas Barceloneta',
      cuisine: 'Espagnole',
      rating: 4.5,
      deliveryTime: '25-35 min',
      image: '/images/restaurants/madrid-tapas.jpg',
      tags: ['Tapas', 'Espagnol'],
      priceRange: '€€'
    },
    {
      id: 'm2',
      name: 'Paella Valenciana',
      cuisine: 'Espagnole',
      rating: 4.3,
      deliveryTime: '35-45 min',
      image: '/images/restaurants/madrid-paella.jpg',
      tags: ['Paella', 'Fruits de mer'],
      priceRange: '€€€'
    }
  ]
};
