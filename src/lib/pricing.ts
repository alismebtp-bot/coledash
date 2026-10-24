import type { CartItem } from '@/types'

export interface PromoCode {
  code: string
  label: string
  /** Returns the discount amount for a given subtotal / delivery fee. */
  apply: (subtotal: number, deliveryFee: number, items: CartItem[]) => number
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'BIENVENUE',
    label: '-20 % sur votre commande (max. 10 €)',
    apply: (subtotal) => Math.min(subtotal * 0.2, 10),
  },
  {
    code: 'LIVRAISON',
    label: 'Livraison offerte',
    apply: (_subtotal, deliveryFee) => deliveryFee,
  },
  {
    code: 'FLEURS10',
    label: '-10 % sur les fleurs',
    apply: (_subtotal, _fee, items) =>
      items.filter((i) => i.vendorKind === 'flowers').reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 0.1,
  },
]

export function findPromo(code: string): PromoCode | undefined {
  return PROMO_CODES.find((p) => p.code === code.trim().toUpperCase())
}

export const FREE_DELIVERY_THRESHOLD = 35

export function lineTotal(item: CartItem): number {
  return item.unitPrice * item.quantity
}

export function subtotalOf(items: CartItem[]): number {
  return round(items.reduce((s, i) => s + lineTotal(i), 0))
}

export function deliveryFeeFor(items: CartItem[]): number {
  if (items.length === 0) return 0
  const subtotal = subtotalOf(items)
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0
  return items[0].vendorDeliveryFee
}

export function serviceFeeFor(subtotal: number): number {
  if (subtotal === 0) return 0
  return round(Math.min(Math.max(subtotal * 0.05, 0.99), 3.99))
}

export interface Totals {
  subtotal: number
  deliveryFee: number
  serviceFee: number
  discount: number
  tip: number
  total: number
}

export function computeTotals(items: CartItem[], opts: { promo?: PromoCode; tip?: number } = {}): Totals {
  const subtotal = subtotalOf(items)
  const deliveryFee = deliveryFeeFor(items)
  const serviceFee = serviceFeeFor(subtotal)
  const discount = round(opts.promo ? opts.promo.apply(subtotal, deliveryFee, items) : 0)
  const tip = round(opts.tip ?? 0)
  const total = round(Math.max(subtotal + deliveryFee + serviceFee + tip - discount, 0))
  return { subtotal, deliveryFee, serviceFee, discount, tip, total }
}

export function round(n: number): number {
  return Math.round(n * 100) / 100
}
