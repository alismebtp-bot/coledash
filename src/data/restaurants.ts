export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  image: string
  cityId: string
}

export const restaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Pizza Roma',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-40 min',
    deliveryFee: 1.99,
    minOrder: 10,
    image: '/restaurant-interior.jpg',
    cityId: 'paris',
  },
  {
    id: 'rest-2',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-45 min',
    deliveryFee: 2.99,
    minOrder: 15,
    image: '/restaurant-interior.jpg',
    cityId: 'paris',
  },
]
