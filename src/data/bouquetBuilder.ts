export interface Flower {
  id: string
  name: string
  color: string
  price: number
  image: string
}

export interface BouquetConfig {
  flowers: { flower: Flower; quantity: number }[]
  wrapping: string
  message?: string
}

export const availableFlowers: Flower[] = [
  { id: 'rose-red', name: 'Red Rose', color: 'Red', price: 3.99, image: '/flower-bouquet.jpg' },
  { id: 'rose-pink', name: 'Pink Rose', color: 'Pink', price: 3.99, image: '/flower-bouquet.jpg' },
  { id: 'lily-white', name: 'White Lily', color: 'White', price: 4.99, image: '/flower-bouquet.jpg' },
  { id: 'tulip-yellow', name: 'Yellow Tulip', color: 'Yellow', price: 2.99, image: '/flower-bouquet.jpg' },
  { id: 'daisy-white', name: 'White Daisy', color: 'White', price: 2.49, image: '/flower-bouquet.jpg' },
  { id: 'orchid-purple', name: 'Purple Orchid', color: 'Purple', price: 5.99, image: '/flower-bouquet.jpg' },
]

export const wrappingOptions = [
  { id: 'kraft', name: 'Kraft Paper', price: 1.99 },
  { id: 'cellophane', name: 'Clear Cellophane', price: 1.49 },
  { id: 'tissue', name: 'Tissue Paper', price: 0.99 },
  { id: 'velvet', name: 'Velvet Wrap', price: 3.99 },
]
