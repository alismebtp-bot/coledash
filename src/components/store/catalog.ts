import type { Product } from '@/data/groceryProducts'
import type { RetailProduct } from '@/data/retailProducts'
import type { Store } from '@/data/stores'
import type { VendorCardData } from '@/components/shared/VendorCard'
import type { CartItem } from '@/types'

/** Common shape for any product sold by a grocery or retail store. */
export interface CatalogItem {
  id: string
  name: string
  brand?: string
  description: string
  price: number
  originalPrice?: number
  image: string
  /** Chip / rayon id the item belongs to. */
  rayon: string
  rayonLabel?: string
  meta?: string
  origin?: string
  allergens?: string[]
  nutrition?: Product['nutrition']
  badges: string[]
  tags: string[]
  inStock: boolean
  isAlcohol?: boolean
}

export function fromGrocery(p: Product, rayonLabel?: string): CatalogItem {
  const badges: string[] = []
  if (p.originalPrice && p.originalPrice > p.price) badges.push(`-${Math.round((1 - p.price / p.originalPrice) * 100)} %`)
  if (p.isOrganic) badges.push('Bio')
  if (p.isLocal) badges.push('Local')
  if (p.isNew) badges.push('Nouveau')
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    rayon: p.category,
    rayonLabel,
    meta: p.weight,
    origin: p.origin,
    allergens: p.allergens,
    nutrition: p.nutrition,
    badges: badges.slice(0, 2),
    tags: p.tags ?? [],
    inStock: p.inStock,
  }
}

export function fromRetail(p: RetailProduct): CatalogItem {
  const badges: string[] = []
  if (p.originalPrice && p.originalPrice > p.price) badges.push(`-${Math.round((1 - p.price / p.originalPrice) * 100)} %`)
  if (p.isNew) badges.push('Nouveau')
  if (p.isBestseller) badges.push('Populaire')
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    rayon: p.subcategory,
    rayonLabel: p.subcategory,
    meta: p.size,
    origin: p.origin,
    badges: badges.slice(0, 2),
    tags: p.tags,
    inStock: true,
    isAlcohol: p.isAlcohol,
  }
}

const ROOT: Record<Store['kind'], string> = { grocery: '/courses', retail: '/boutiques', flowers: '/fleurs' }

export function storeHref(store: Store): string {
  return `${ROOT[store.kind]}/${store.id}`
}

export function storeRoot(kind: Store['kind']): string {
  return ROOT[kind]
}

export function toVendorCard(store: Store): VendorCardData {
  return {
    id: store.id,
    href: storeHref(store),
    name: store.name,
    subtitle: store.tagline,
    image: store.image,
    rating: store.rating,
    reviewCount: store.reviewCount,
    deliveryTime: store.deliveryTime,
    deliveryFee: store.deliveryFee,
    promo: store.promo,
    isOpen: store.isOpen,
  }
}

type CartInput = Omit<CartItem, 'key' | 'quantity'>

/** Vendor fields of a cart line for a given store. */
export function vendorFields(store: Store): Pick<CartItem, 'vendorId' | 'vendorName' | 'vendorKind' | 'vendorDeliveryFee' | 'vendorMinOrder'> {
  return {
    vendorId: store.id,
    vendorName: store.name,
    vendorKind: store.kind,
    vendorDeliveryFee: store.deliveryFee,
    vendorMinOrder: store.minOrder,
  }
}

export function toCartInput(store: Store, item: CatalogItem): CartInput {
  return { ...vendorFields(store), productId: item.id, name: item.name, image: item.image, unitPrice: item.price }
}

/** Lower-case, accent-free string for search matching. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function matchesQuery(item: CatalogItem, q: string): boolean {
  if (!q) return true
  const hay = normalize([item.name, item.brand, item.description, item.rayonLabel, ...item.tags].filter(Boolean).join(' '))
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}
