import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order, OrderStatus } from '@/types'

interface OrdersState {
  orders: Order[]
  place: (order: Omit<Order, 'id' | 'number' | 'createdAt'>) => Order
  cancel: (id: string) => void
  rate: (id: string, rating: number) => void
}

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      place: (input) => {
        const order: Order = {
          ...input,
          id: `ord-${Date.now().toString(36)}`,
          number: `CD-${Math.floor(10000 + Math.random() * 90000)}`,
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        return order
      },
      cancel: (id) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, cancelled: true } : o)) })),
      rate: (id, rating) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, rating } : o)) })),
    }),
    { name: 'coledash-orders' },
  ),
)

/**
 * Demo order lifecycle, compressed so it can be watched live:
 * confirmed (0–1 min) → preparing (–4) → picked_up (–6) → delivering (–10) → delivered.
 * Scheduled orders stay "confirmed" until 15 min before their slot.
 */
export const ORDER_STEPS: { status: Exclude<OrderStatus, 'cancelled'>; label: string; at: number }[] = [
  { status: 'confirmed', label: 'Commande confirmée', at: 0 },
  { status: 'preparing', label: 'En préparation', at: 1 },
  { status: 'picked_up', label: 'Récupérée par le livreur', at: 4 },
  { status: 'delivering', label: 'En route', at: 6 },
  { status: 'delivered', label: 'Livrée', at: 10 },
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  picked_up: 'Récupérée',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

function startOf(order: Order): number {
  if (order.scheduledFor) return new Date(order.scheduledFor).getTime() - 15 * 60000
  return new Date(order.createdAt).getTime()
}

export function getOrderStatus(order: Order, now = Date.now()): OrderStatus {
  if (order.cancelled) return 'cancelled'
  const minutes = (now - startOf(order)) / 60000
  let status: OrderStatus = 'confirmed'
  for (const step of ORDER_STEPS) if (minutes >= step.at) status = step.status
  return status
}

/** Estimated arrival time (ms epoch). */
export function getOrderEta(order: Order): number {
  return startOf(order) + 10 * 60000
}

export function isActive(order: Order, now = Date.now()): boolean {
  const s = getOrderStatus(order, now)
  return s !== 'delivered' && s !== 'cancelled'
}
