export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  items: { name: string; quantity: number; price: number }[]
  total: number
  restaurantName: string
  createdAt: string
  estimatedDelivery: string
}

export const orders: Order[] = [
  {
    id: 'ord-1',
    status: 'delivered',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { name: 'Coca-Cola', quantity: 2, price: 3.98 },
    ],
    total: 16.97,
    restaurantName: 'Pizza Roma',
    createdAt: '2024-06-01T18:30:00Z',
    estimatedDelivery: '2024-06-01T19:00:00Z',
  },
]
