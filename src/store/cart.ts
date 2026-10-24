import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

type NewItem = Omit<CartItem, 'key' | 'quantity'> & { quantity?: number }

interface CartState {
  items: CartItem[]
  add: (item: NewItem) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  clear: () => void
  clearVendor: (vendorId: string) => void
}

export function lineKey(item: Pick<CartItem, 'vendorId' | 'productId' | 'options' | 'note'>): string {
  return [item.vendorId, item.productId, ...(item.options ?? []), item.note ?? ''].join('|')
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const key = lineKey(item)
          const qty = item.quantity ?? 1
          const existing = state.items.find((i) => i.key === key)
          if (existing) {
            return { items: state.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i)) }
          }
          return { items: [...state.items, { ...item, key, quantity: qty }] }
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.key !== key)
              : state.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        })),
      remove: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
      clearVendor: (vendorId) => set((state) => ({ items: state.items.filter((i) => i.vendorId !== vendorId) })),
    }),
    { name: 'coledash-cart', version: 2 },
  ),
)

export const selectCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0)

/** Quantity of a product (all option variants) currently in the cart. */
export const selectProductQuantity = (vendorId: string, productId: string) => (s: CartState) =>
  s.items.filter((i) => i.vendorId === vendorId && i.productId === productId).reduce((n, i) => n + i.quantity, 0)

/** Cart lines grouped by vendor, in insertion order. */
export function groupByVendor(items: CartItem[]): { vendorId: string; vendorName: string; items: CartItem[] }[] {
  const groups = new Map<string, { vendorId: string; vendorName: string; items: CartItem[] }>()
  for (const item of items) {
    const g = groups.get(item.vendorId) ?? { vendorId: item.vendorId, vendorName: item.vendorName, items: [] }
    g.items.push(item)
    groups.set(item.vendorId, g)
  }
  return [...groups.values()]
}
