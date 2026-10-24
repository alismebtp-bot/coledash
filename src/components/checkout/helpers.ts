import type { CartItem, VendorKind } from '@/types'
import { getRestaurantById } from '@/data/restaurants'
import { getStoreById } from '@/data/stores'

export const PROMO_STORAGE_KEY = 'coledash-promo'

export function readStoredPromo(): string {
  try {
    return sessionStorage.getItem(PROMO_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeStoredPromo(code: string | null) {
  try {
    if (code) sessionStorage.setItem(PROMO_STORAGE_KEY, code)
    else sessionStorage.removeItem(PROMO_STORAGE_KEY)
  } catch {
    /* stockage indisponible : on ignore */
  }
}

const KIND_BASE: Record<VendorKind, string> = {
  restaurant: '/restaurants',
  grocery: '/courses',
  flowers: '/fleurs',
  retail: '/boutiques',
}

export const KIND_LABEL: Record<VendorKind, string> = {
  restaurant: 'Restaurant',
  grocery: 'Courses',
  flowers: 'Fleuriste',
  retail: 'Boutique',
}

/** Link back to the vendor page of a cart line / order. */
export function vendorHref(item: Pick<CartItem, 'vendorId' | 'vendorKind' | 'productId'>): string {
  if (item.productId.startsWith('bouquet-') && !getStoreById(item.vendorId)) return '/fleurs/atelier'
  return `${KIND_BASE[item.vendorKind]}/${item.vendorId}`
}

export function vendorInfo(vendorId: string): { image?: string; address?: string; deliveryTime?: string } {
  const r = getRestaurantById(vendorId)
  if (r) return { image: r.image, address: `${r.address}, ${r.postalCode} ${r.city}`, deliveryTime: r.deliveryTime }
  const s = getStoreById(vendorId)
  if (s) return { image: s.image, address: s.address, deliveryTime: s.deliveryTime }
  return {}
}
