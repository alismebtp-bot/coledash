export interface FlowerStore {
  id: string
  name: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  image: string
  cityId: string
}

export const flowerStores: FlowerStore[] = [
  {
    id: 'flower-1',
    name: 'Bloom & Co',
    rating: 4.8,
    deliveryTime: '20-35 min',
    deliveryFee: 2.99,
    minOrder: 15,
    image: '/flower-bouquet.jpg',
    cityId: 'paris',
  },
  {
    id: 'flower-2',
    name: 'Petals Paradise',
    rating: 4.6,
    deliveryTime: '25-40 min',
    deliveryFee: 3.99,
    minOrder: 20,
    image: '/flower-bouquet.jpg',
    cityId: 'paris',
  },
]
