import type { MenuItem, Restaurant } from '@/data/restaurants'
import type { VendorCardData } from '@/components/shared/VendorCard'

/** Lowercase, accent-free version of a string, for forgiving matching. */
export function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/** URL-friendly slug: "Fruits de Mer" → "fruits-de-mer". */
export function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** True when every word of the query is contained in one of the fields. */
export function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return false
  const haystack = normalize(fields.filter(Boolean).join(' '))
  return tokens.every((t) => haystack.includes(t))
}

/** "25-40 min" → 25 */
export function minDeliveryMinutes(deliveryTime: string): number {
  const n = parseInt(deliveryTime, 10)
  return Number.isNaN(n) ? 99 : n
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export const DAY_LABELS: Record<(typeof DAY_KEYS)[number], string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
}
export const WEEK_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export function todayKey(date = new Date()): (typeof DAY_KEYS)[number] {
  return DAY_KEYS[date.getDay()]
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function formatHour(hhmm: string): string {
  if (hhmm === '00:00') return 'minuit'
  return hhmm.replace(':', ' h ').replace(' h 00', ' h')
}

/** Today's opening hours as a French label, or null when closed all day. */
export function todayHours(r: Restaurant, date = new Date()): string | null {
  const slot = r.hours[todayKey(date)]
  if (!slot) return null
  return `${formatHour(slot.open)} – ${formatHour(slot.close)}`
}

/** Open right now, given the opening hours (supports closing after midnight). */
export function isOpenNow(r: Restaurant, date = new Date()): boolean {
  if (!r.isOpen) return false
  const now = date.getHours() * 60 + date.getMinutes()
  const today = r.hours[todayKey(date)]
  if (today) {
    const open = toMinutes(today.open)
    let close = toMinutes(today.close)
    if (close <= open) close += 24 * 60
    if (now >= open && now < close) return true
  }
  // Late-night service started yesterday.
  const prev = new Date(date)
  prev.setDate(prev.getDate() - 1)
  const yesterday = r.hours[todayKey(prev)]
  if (yesterday) {
    const open = toMinutes(yesterday.open)
    const close = toMinutes(yesterday.close)
    if (close <= open && now < close) return true
  }
  return false
}

export function allItems(r: Restaurant): MenuItem[] {
  return r.menu.flatMap((c) => c.items)
}

export function hasVeggie(r: Restaurant): boolean {
  return allItems(r).some((i) => i.isVegetarian || i.isVegan)
}

/** Ranking used by the "Recommandés" sort. */
export function recommendScore(r: Restaurant): number {
  return r.rating * 2 + Math.log10(r.reviewCount + 1) + (r.isBestseller ? 0.6 : 0) + (r.isPromo ? 0.3 : 0)
}

export function restaurantToCard(r: Restaurant, now = new Date()): VendorCardData {
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
    promo: r.promoText,
    isOpen: isOpenNow(r, now),
    isNew: r.isNew,
  }
}

/** Offset (px) of the sticky site header + category nav, used when scrolling to a menu section. */
export const MENU_SCROLL_OFFSET = 136

export function sectionDomId(id: string) {
  return `menu-${id}`
}

export type SortKey = 'recommandes' | 'note' | 'temps' | 'frais'

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommandes', label: 'Recommandés' },
  { id: 'note', label: 'Mieux notés' },
  { id: 'temps', label: 'Livraison la plus rapide' },
  { id: 'frais', label: 'Frais de livraison' },
]

export const LOW_FEE_THRESHOLD = 2.5

export interface ToggleState {
  open: boolean
  promo: boolean
  lowFee: boolean
  veggie: boolean
}
