export interface RetailStore {
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

export const retailStores: RetailStore[] = [
  {
    id: 'retail-1',
    name: 'Urban Outfitters',
    category: 'Fashion',
    rating: 4.5,
    deliveryTime: '25-40 min',
    deliveryFee: 2.99,
    minOrder: 15,
    image: '/retail-display.jpg',
    cityId: 'paris',
  },
  {
    id: 'retail-2',
    name: 'TechHub Store',
    category: 'Electronics',
    rating: 4.7,
    deliveryTime: '30-50 min',
    deliveryFee: 3.99,
    minOrder: 25,
    image: '/retail-display.jpg',
    cityId: 'paris',
  },
]
