import { create } from 'zustand'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  customerName: string
  customerPhone: string
  deliveryAddress: string
  createdAt: number
  estimatedDelivery?: string
}

interface OrderStore {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  getOrderById: (id: string) => Order | undefined
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addOrder: (order) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          ...order,
          id: `ORD-${Date.now()}`,
          createdAt: Date.now(),
        },
      ],
    })),

  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),

  getOrderById: (id) => {
    return get().orders.find((order) => order.id === id)
  },
}))
