export interface GroceryStore {
  id: string
  name: string
  category: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  image: string
  cityId: string
}

export const groceryStores: GroceryStore[] = [
  {
    id: 'grocery-1',
    name: 'Fresh Market',
    category: 'Supermarket',
    rating: 4.6,
    deliveryTime: '20-35 min',
    deliveryFee: 1.99,
    minOrder: 10,
    image: '/grocery-aisle.jpg',
    cityId: 'paris',
  },
  {
    id: 'grocery-2',
    name: 'Organic Valley',
    category: 'Organic',
    rating: 4.8,
    deliveryTime: '25-40 min',
    deliveryFee: 2.99,
    minOrder: 15,
    image: '/grocery-aisle.jpg',
    cityId: 'paris',
  },
]
