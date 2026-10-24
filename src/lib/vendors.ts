import type { VendorCardData } from '@/components/shared/VendorCard'
import type { Restaurant } from '@/data/restaurants'
import type { Store } from '@/data/stores'

const STORE_BASE: Record<Store['kind'], string> = { grocery: '/courses', flowers: '/fleurs', retail: '/boutiques' }

export function storeHref(store: Pick<Store, 'id' | 'kind'>): string {
  return `${STORE_BASE[store.kind]}/${store.id}`
}

export function restaurantCard(r: Restaurant): VendorCardData {
  return {
    id: r.id,
    href: `/restaurants/${r.id}`,
    name: r.name,
    subtitle: `${r.cuisine} · ${r.priceRange}`,
    image: r.image,
    rating: r.rating,
    reviewCount: r.reviewCount,
    deliveryTime: r.deliveryTime,
    deliveryFee: r.deliveryFee,
    promo: r.isPromo ? r.promoText : undefined,
    isOpen: r.isOpen,
    isNew: r.isNew,
  }
}

export function storeCard(s: Store): VendorCardData {
  return {
    id: s.id,
    href: storeHref(s),
    name: s.name,
    subtitle: s.tagline,
    image: s.image,
    rating: s.rating,
    reviewCount: s.reviewCount,
    deliveryTime: s.deliveryTime,
    deliveryFee: s.deliveryFee,
    promo: s.promo,
    isOpen: s.isOpen,
  }
}
