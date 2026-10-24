import type { Order } from '@/types'
import { getOrderEta } from '@/store/orders'

/** Start of the (compressed) lifecycle, in ms. */
export function orderStart(order: Order): number {
  return getOrderEta(order) - 10 * 60000
}

/** Elapsed minutes since lifecycle start, clamped to [0, 10]. */
export function elapsedMinutes(order: Order, now: number): number {
  return Math.min(Math.max((now - orderStart(order)) / 60000, 0), 10)
}

const COURIERS = [
  { name: 'Karim B.', vehicle: 'Vélo électrique', rating: 4.9, deliveries: 1824 },
  { name: 'Sophie L.', vehicle: 'Scooter électrique', rating: 4.8, deliveries: 962 },
  { name: 'Mamadou D.', vehicle: 'Vélo cargo', rating: 4.9, deliveries: 2310 },
  { name: 'Julien R.', vehicle: 'Scooter', rating: 4.7, deliveries: 645 },
  { name: 'Inès M.', vehicle: 'Vélo électrique', rating: 5.0, deliveries: 1203 },
]

export type Courier = (typeof COURIERS)[number] & { initials: string }

export function courierFor(order: Order): Courier {
  let h = 0
  for (const c of order.id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const c = COURIERS[h % COURIERS.length]
  return { ...c, initials: c.name.split(' ').map((p) => p[0]).join('') }
}
