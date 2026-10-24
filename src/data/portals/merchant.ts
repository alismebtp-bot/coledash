/*
  Mock data for the merchant portal ("Espace commerçant") of Le Bistrot du Coin.
  Everything is deterministic: a seeded generator (mulberry32) is used so that
  the same day always yields the same figures, and nothing calls Math.random
  while rendering.
*/
import { getRestaurantById, type Restaurant } from '@/data/restaurants'

export const MERCHANT_RESTAURANT_ID = 'rest-paris-001'
export const merchantRestaurant = getRestaurantById(MERCHANT_RESTAURANT_ID) as Restaurant

const DAY = 86_400_000

/* ─────────────────────────── Seeded generator ─────────────────────────── */

export function seededRandom(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(rand: () => number, list: readonly T[]): T => list[Math.floor(rand() * list.length)]
const between = (rand: () => number, min: number, max: number) => min + rand() * (max - min)
const round2 = (n: number) => Math.round(n * 100) / 100

function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Anchor for every relative date of the mock data (module load time). */
export const DEMO_NOW = Date.now()
const TODAY = startOfDay(DEMO_NOW)

/* ─────────────────────────────── Catalogue ─────────────────────────────── */

export type ItemBadge = 'populaire' | 'meilleure_vente' | 'nouveau' | 'vegetarien' | 'vegan' | 'sans_gluten' | 'epice'

export const BADGE_LABELS: Record<ItemBadge, string> = {
  populaire: 'Populaire',
  meilleure_vente: 'Meilleure vente',
  nouveau: 'Nouveau',
  vegetarien: 'Végétarien',
  vegan: 'Vegan',
  sans_gluten: 'Sans gluten',
  epice: 'Épicé',
}

export const ALL_BADGES = Object.keys(BADGE_LABELS) as ItemBadge[]

export interface CatalogCategory {
  id: string
  name: string
}

export interface CatalogItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
  badges: ItemBadge[]
  allergens: string[]
}

export function buildInitialCatalog(): { categories: CatalogCategory[]; items: CatalogItem[] } {
  const categories = merchantRestaurant.menu.map((c) => ({ id: c.id, name: c.name }))
  const items = merchantRestaurant.menu.flatMap((c) =>
    c.items.map<CatalogItem>((i) => {
      const badges: ItemBadge[] = []
      if (i.isPopular) badges.push('populaire')
      if (i.isBestseller) badges.push('meilleure_vente')
      if (i.isNew) badges.push('nouveau')
      if (i.isVegetarian) badges.push('vegetarien')
      if (i.isVegan) badges.push('vegan')
      if (i.isGlutenFree) badges.push('sans_gluten')
      if (i.isSpicy) badges.push('epice')
      return {
        id: i.id,
        categoryId: c.id,
        name: i.name,
        description: i.description,
        price: i.price,
        image: i.image,
        available: true,
        badges,
        allergens: i.allergens ?? [],
      }
    }),
  )
  return { categories, items }
}

const BASE_ITEMS = buildInitialCatalog().items
const CATEGORY_NAMES = Object.fromEntries(merchantRestaurant.menu.map((c) => [c.id, c.name]))

/* ──────────────────────────────── Orders ──────────────────────────────── */

export type MerchantOrderStatus = 'new' | 'preparing' | 'ready' | 'picked_up' | 'refused' | 'cancelled'

export const ORDER_STATUS_LABELS: Record<MerchantOrderStatus, string> = {
  new: 'Nouvelle',
  preparing: 'En préparation',
  ready: 'Prête',
  picked_up: 'Récupérée',
  refused: 'Refusée',
  cancelled: 'Annulée',
}

export const ORDER_STATUS_TONES = {
  new: 'brand',
  preparing: 'warning',
  ready: 'info',
  picked_up: 'success',
  refused: 'danger',
  cancelled: 'neutral',
} as const

export const REFUSAL_REASONS = [
  'Produit en rupture',
  'Cuisine saturée',
  'Fermeture imminente',
  'Adresse hors zone de livraison',
  'Autre raison',
] as const

export interface MerchantOrderLine {
  itemId: string
  name: string
  quantity: number
  unitPrice: number
  options?: string[]
}

export interface MerchantOrder {
  id: string
  number: string
  customerName: string
  customerPhone: string
  address: string
  createdAt: string
  acceptedAt?: string
  readyAt?: string
  pickedUpAt?: string
  /** Planned preparation time in minutes (set when accepted). */
  prepMinutes: number
  status: MerchantOrderStatus
  lines: MerchantOrderLine[]
  subtotal: number
  /** Number of past orders for this customer (0 = new customer). */
  customerOrders: number
  courierName?: string
  note?: string
  refusalReason?: string
  paymentMethod: 'Carte bancaire' | 'Apple Pay' | 'PayPal'
}

const FIRST_NAMES = ['Camille', 'Léa', 'Hugo', 'Louis', 'Chloé', 'Manon', 'Lucas', 'Inès', 'Julien', 'Sarah', 'Thomas', 'Emma', 'Nathan', 'Clara', 'Antoine', 'Juliette', 'Maxime', 'Alice', 'Yanis', 'Margaux', 'Romain', 'Zoé', 'Bastien', 'Anaïs']
const LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Lefèvre', 'Moreau', 'Laurent', 'Girard', 'Roux', 'Fournier', 'Mercier', 'Blanc', 'Garnier', 'Chevalier', 'Faure', 'Rousseau', 'Lambert', 'Bonnet', 'Fontaine', 'Benali', 'Nguyen', 'Haddad', 'Perrin']
const STREETS = ['Rue de Richelieu', 'Rue Saint-Augustin', 'Rue du Quatre-Septembre', 'Rue Montorgueil', 'Rue Vivienne', 'Boulevard des Italiens', 'Rue de Cléry', 'Rue Réaumur', "Rue d'Aboukir", 'Rue Sainte-Anne', 'Rue de la Banque', 'Passage Choiseul']
const POSTCODES = ['75002', '75001', '75009', '75002', '75003']
const COURIERS = ['Karim B.', 'Sofiane M.', 'Mathis L.', 'Ousmane D.', 'Élodie R.', 'Nicolas P.']
const NOTES = ['Sans oignons, merci', 'Code porte 4821B', 'Merci de mettre des couverts', 'Allergie aux noix', 'Sonner deux fois', 'Sauce à part svp']
const PAYMENTS: MerchantOrder['paymentMethod'][] = ['Carte bancaire', 'Carte bancaire', 'Apple Pay', 'PayPal']

function generateLines(rand: () => number): MerchantOrderLine[] {
  const count = 1 + Math.floor(rand() * 4)
  const lines: MerchantOrderLine[] = []
  for (let i = 0; i < count; i++) {
    const item = pick(rand, BASE_ITEMS)
    const existing = lines.find((l) => l.itemId === item.id)
    if (existing) {
      existing.quantity += 1
      continue
    }
    const options = item.id === 'item-004' ? [pick(rand, ['Saignant', 'À point', 'Bien cuit'])] : undefined
    lines.push({ itemId: item.id, name: item.name, quantity: rand() < 0.25 ? 2 : 1, unitPrice: item.price, options })
  }
  return lines
}

export function orderTotal(lines: MerchantOrderLine[]): number {
  return round2(lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0))
}

export function orderItemCount(order: MerchantOrder): number {
  return order.lines.reduce((s, l) => s + l.quantity, 0)
}

/** Build one random order. `rand` makes it deterministic when seeded. */
export function generateOrder(rand: () => number, createdAt: number, status: MerchantOrderStatus = 'new'): MerchantOrder {
  const lines = generateLines(rand)
  const first = pick(rand, FIRST_NAMES)
  const last = pick(rand, LAST_NAMES)
  const num = 40000 + Math.floor(rand() * 59999)
  const prepMinutes = 15 + 5 * Math.floor(rand() * 3)
  return {
    id: `mo-${num}-${Math.floor(createdAt / 1000).toString(36)}`,
    number: `CD-${num}`,
    customerName: `${first} ${last}`,
    customerPhone: `06 ${Math.floor(10 + rand() * 89)} ${Math.floor(10 + rand() * 89)} ${Math.floor(10 + rand() * 89)} ${Math.floor(10 + rand() * 89)}`,
    address: `${1 + Math.floor(rand() * 60)} ${pick(rand, STREETS)}, ${pick(rand, POSTCODES)} Paris`,
    createdAt: new Date(createdAt).toISOString(),
    prepMinutes,
    status,
    lines,
    subtotal: orderTotal(lines),
    customerOrders: rand() < 0.35 ? 0 : 1 + Math.floor(rand() * 18),
    note: rand() < 0.3 ? pick(rand, NOTES) : undefined,
    paymentMethod: pick(rand, PAYMENTS),
  }
}

/** Orders currently on the kanban board, relative to DEMO_NOW. */
export function buildLiveOrders(now = DEMO_NOW): MerchantOrder[] {
  const rand = seededRandom(Math.floor(now / DAY) * 7 + 3)
  const min = 60_000
  const make = (agoMin: number, status: MerchantOrderStatus) => {
    const o = generateOrder(rand, now - agoMin * min, status)
    if (status !== 'new') {
      o.acceptedAt = new Date(now - (agoMin - 1) * min).toISOString()
    }
    if (status === 'ready' || status === 'picked_up') {
      o.readyAt = new Date(Math.min(now - 2 * min, now - (agoMin - 1 - o.prepMinutes) * min)).toISOString()
      o.courierName = pick(rand, COURIERS)
    }
    if (status === 'picked_up') o.pickedUpAt = new Date(Math.min(now - min, now - (agoMin - 3 - o.prepMinutes) * min)).toISOString()
    return o
  }
  return [
    make(1, 'new'),
    make(3, 'new'),
    make(6, 'preparing'),
    make(11, 'preparing'),
    make(14, 'preparing'),
    make(24, 'ready'),
    make(38, 'picked_up'),
    make(52, 'picked_up'),
  ]
}

/** Completed orders of the past 7 days for the history table. */
export function buildOrderHistory(now = DEMO_NOW): MerchantOrder[] {
  const rand = seededRandom(Math.floor(now / DAY) * 13 + 11)
  const out: MerchantOrder[] = []
  for (let d = 0; d < 7; d++) {
    const day = startOfDay(now) - d * DAY
    if (new Date(day).getDay() === 0) continue // fermé le dimanche
    const count = 9 + Math.floor(rand() * 6)
    for (let i = 0; i < count; i++) {
      // lunch (11h30–14h30) or dinner (18h30–22h) service
      const created = day + (rand() < 0.45 ? 11.5 + rand() * 3 : 18.5 + rand() * 3.5) * 3_600_000
      if (created > now - 60 * 60_000) continue
      const r = rand()
      const status: MerchantOrderStatus = r < 0.06 ? 'refused' : r < 0.1 ? 'cancelled' : 'picked_up'
      const o = generateOrder(rand, created, status)
      if (status === 'picked_up') {
        o.acceptedAt = new Date(created + 60_000).toISOString()
        o.readyAt = new Date(created + (o.prepMinutes + 1) * 60_000).toISOString()
        o.pickedUpAt = new Date(created + (o.prepMinutes + 4) * 60_000).toISOString()
        o.courierName = pick(rand, COURIERS)
      } else if (status === 'refused') {
        o.refusalReason = pick(rand, REFUSAL_REASONS.slice(0, 3))
      }
      out.push(o)
    }
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/* ───────────────────────────── Daily statistics ───────────────────────────── */

export interface DailyStat {
  date: string
  revenue: number
  orders: number
  newCustomers: number
  returningCustomers: number
  rating: number
}

function statForDay(ts: number): DailyStat {
  const dayIndex = Math.floor((ts + 12 * 3_600_000) / DAY)
  const rand = seededRandom(dayIndex * 31 + 7)
  const dow = new Date(ts).getDay()
  if (dow === 0) {
    return { date: new Date(ts).toISOString(), revenue: 0, orders: 0, newCustomers: 0, returningCustomers: 0, rating: 0 }
  }
  const dowFactor = [0, 0.82, 0.92, 0.96, 1.02, 1.22, 1.3][dow]
  // gentle upward trend over the last quarter
  const trend = 1 + ((dayIndex % 365) / 365) * 0.12
  const orders = Math.round(between(rand, 38, 50) * dowFactor * trend)
  const basket = between(rand, 31, 37.5)
  const newCustomers = Math.round(orders * between(rand, 0.22, 0.36))
  return {
    date: new Date(ts).toISOString(),
    revenue: round2(orders * basket),
    orders,
    newCustomers,
    returningCustomers: orders - newCustomers,
    rating: round2(between(rand, 4.3, 4.8)),
  }
}

/** Last 180 days (oldest first), today included. */
export const dailyStats: DailyStat[] = Array.from({ length: 180 }, (_, i) => statForDay(TODAY - (179 - i) * DAY))

export function statsForPeriod(days: number, offset = 0): DailyStat[] {
  const end = dailyStats.length - offset
  return dailyStats.slice(Math.max(0, end - days), end)
}

export function summarize(stats: DailyStat[]) {
  const revenue = stats.reduce((s, d) => s + d.revenue, 0)
  const orders = stats.reduce((s, d) => s + d.orders, 0)
  const rated = stats.filter((d) => d.rating > 0)
  const newCustomers = stats.reduce((s, d) => s + d.newCustomers, 0)
  return {
    revenue: round2(revenue),
    orders,
    basket: orders ? round2(revenue / orders) : 0,
    rating: rated.length ? round2(rated.reduce((s, d) => s + d.rating, 0) / rated.length) : 0,
    newCustomers,
    returningCustomers: orders - newCustomers,
  }
}

export function pctDelta(current: number, previous: number): number {
  if (!previous) return 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

/** Orders per hour over a period (service continu 11h30 – 22h30, lunch and dinner peaks). */
export const SERVICE_SLOTS = ['11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h']
const SLOT_WEIGHTS = [0.03, 0.15, 0.14, 0.06, 0.02, 0.02, 0.03, 0.06, 0.16, 0.18, 0.11, 0.04]

export function ordersBySlot(stats: DailyStat[]): { slot: string; orders: number }[] {
  const total = stats.reduce((s, d) => s + d.orders, 0)
  const rand = seededRandom(stats.length * 17 + 5)
  return SERVICE_SLOTS.map((slot, i) => ({ slot, orders: Math.round(total * SLOT_WEIGHTS[i] * between(rand, 0.94, 1.06)) }))
}

const DISH_WEIGHTS: Record<string, number> = {
  'item-001': 0.11, 'item-002': 0.06, 'item-003': 0.1, 'item-004': 0.19, 'item-005': 0.1,
  'item-006': 0.12, 'item-007': 0.06, 'item-008': 0.12, 'item-009': 0.08, 'item-010': 0.06,
}
const DISH_RATINGS: Record<string, number> = {
  'item-001': 4.6, 'item-002': 4.2, 'item-003': 4.7, 'item-004': 4.8, 'item-005': 4.4,
  'item-006': 4.7, 'item-007': 4.1, 'item-008': 4.9, 'item-009': 4.5, 'item-010': 4.3,
}

export interface DishPerformance {
  itemId: string
  name: string
  category: string
  image: string
  quantity: number
  revenue: number
  /** % change vs previous period */
  trend: number
  rating: number
}

export function dishPerformance(days: number): DishPerformance[] {
  const stats = statsForPeriod(days)
  const totalOrders = stats.reduce((s, d) => s + d.orders, 0)
  const totalItems = totalOrders * 2.1
  const rand = seededRandom(days * 101 + 3)
  return BASE_ITEMS.map((item) => {
    const quantity = Math.round(totalItems * (DISH_WEIGHTS[item.id] ?? 0.05) * between(rand, 0.9, 1.1))
    return {
      itemId: item.id,
      name: item.name,
      category: CATEGORY_NAMES[item.categoryId] ?? '',
      image: item.image,
      quantity,
      revenue: round2(quantity * item.price),
      trend: Math.round(between(rand, -14, 22) * 10) / 10,
      rating: DISH_RATINGS[item.id] ?? 4.5,
    }
  }).sort((a, b) => b.revenue - a.revenue)
}

export function categoryBreakdown(days: number): { name: string; revenue: number }[] {
  const map = new Map<string, number>()
  for (const d of dishPerformance(days)) map.set(d.category, (map.get(d.category) ?? 0) + d.revenue)
  return [...map.entries()].map(([name, revenue]) => ({ name, revenue: round2(revenue) }))
}

/* ──────────────────────────────── Reviews ──────────────────────────────── */

export interface MerchantReview {
  id: string
  author: string
  rating: number
  date: string
  comment: string
  items: string[]
  helpful: number
  markedHelpful?: boolean
  reply?: { text: string; date: string }
}

const ago = (days: number, hours = 0) => new Date(DEMO_NOW - days * DAY - hours * 3_600_000).toISOString()

export const initialReviews: MerchantReview[] = [
  { id: 'rv-01', author: 'Camille D.', rating: 5, date: ago(0, 3), comment: "L'entrecôte était parfaitement saignante comme demandé, frites croustillantes même après la livraison. Un vrai goût de bistrot à la maison !", items: ['Steak Frites', 'Crème Brûlée'], helpful: 4 },
  { id: 'rv-02', author: 'Hugo M.', rating: 4, date: ago(0, 9), comment: 'Très bon magret, sauce au miel délicieuse. Livraison un peu longue (45 min) mais plat encore chaud.', items: ['Magret de Canard'], helpful: 2 },
  { id: 'rv-03', author: 'Inès B.', rating: 2, date: ago(1, 2), comment: 'La soupe à l’oignon est arrivée tiède et le gratiné avait ramolli. Dommage, le goût était là.', items: ["Soupe à l'Oignon Gratinée", 'Tarte Tatin'], helpful: 6 },
  { id: 'rv-04', author: 'Julien F.', rating: 5, date: ago(1, 6), comment: 'Tartare de saumon ultra frais, portion généreuse. Je recommande sans hésiter.', items: ['Tartare de Saumon'], helpful: 3, reply: { text: 'Merci Julien ! Notre saumon arrive chaque matin des Halles de Rungis, ravis que vous l’ayez apprécié.', date: ago(1, 2) } },
  { id: 'rv-05', author: 'Sarah L.', rating: 3, date: ago(2, 4), comment: "Poulet rôti correct mais les légumes manquaient d'assaisonnement. Service rapide en revanche.", items: ['Poulet Rôti et Légumes'], helpful: 1 },
  { id: 'rv-06', author: 'Thomas R.', rating: 5, date: ago(3, 1), comment: 'La crème brûlée est une tuerie, croûte bien caramélisée. On commande chaque vendredi au bureau.', items: ['Crème Brûlée', 'Salade de Chèvre Chaud'], helpful: 8, reply: { text: 'Quel plaisir de vous compter parmi nos habitués ! À vendredi prochain 😊', date: ago(3, 0) } },
  { id: 'rv-07', author: 'Margaux P.', rating: 1, date: ago(4, 5), comment: 'Commande incomplète : il manquait la mousse au chocolat. Le livreur n’était pas au courant.', items: ['Ratatouille Niçoise', 'Mousse au Chocolat'], helpful: 5, reply: { text: 'Toutes nos excuses Margaux, le dessert a été oublié au moment de l’emballage. Nous vous avons remboursé le montant et ajouté un geste commercial sur votre prochaine commande.', date: ago(4, 2) } },
  { id: 'rv-08', author: 'Antoine G.', rating: 4, date: ago(5, 2), comment: 'Salade de chèvre chaud très réussie, le miel et les noix se marient parfaitement.', items: ['Salade de Chèvre Chaud'], helpful: 0 },
  { id: 'rv-09', author: 'Emma C.', rating: 5, date: ago(6, 7), comment: 'Ratatouille comme celle de ma grand-mère, et une option vegan bienvenue. Emballage soigné et recyclable.', items: ['Ratatouille Niçoise'], helpful: 2 },
  { id: 'rv-10', author: 'Nathan V.', rating: 4, date: ago(8, 3), comment: 'Tarte Tatin fondante, crème fraîche à part : top. Un peu cher pour la portion.', items: ['Tarte Tatin'], helpful: 1 },
  { id: 'rv-11', author: 'Chloé H.', rating: 5, date: ago(10, 5), comment: 'Toujours aussi bon, rien à redire. Steak cuit à la perfection.', items: ['Steak Frites'], helpful: 3, reply: { text: 'Merci Chloé pour votre fidélité !', date: ago(10, 1) } },
  { id: 'rv-12', author: 'Yanis K.', rating: 3, date: ago(13, 4), comment: 'Bon dans l’ensemble mais la sauce au poivre était trop salée à mon goût.', items: ['Steak Frites'], helpful: 0 },
  { id: 'rv-13', author: 'Alice T.', rating: 5, date: ago(16, 2), comment: 'Découverte grâce à ColeDash, je reviendrai sur place ! Magret sublime.', items: ['Magret de Canard', 'Crème Brûlée'], helpful: 4 },
  { id: 'rv-14', author: 'Romain S.', rating: 4, date: ago(21, 6), comment: 'Très bonne cuisine traditionnelle, livraison dans les temps.', items: ['Poulet Rôti et Légumes', 'Mousse au Chocolat'], helpful: 1 },
]

/* ────────────────────────────── Promotions ────────────────────────────── */

export type PromotionType = 'percent' | 'amount' | 'free_delivery' | 'bogo'

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  percent: 'Réduction en %',
  amount: 'Montant offert',
  free_delivery: 'Livraison offerte',
  bogo: '1 acheté = 1 offert',
}

export interface Promotion {
  id: string
  name: string
  type: PromotionType
  /** % or € depending on type. */
  value?: number
  /** For bogo: targeted item. */
  itemId?: string
  minOrder?: number
  newCustomersOnly: boolean
  startDate: string
  endDate: string
  paused: boolean
  uses: number
  revenue: number
}

export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'paused'

export function promotionStatus(p: Promotion, now = Date.now()): PromotionStatus {
  if (new Date(p.endDate).getTime() < now) return 'expired'
  if (new Date(p.startDate).getTime() > now) return 'scheduled'
  if (p.paused) return 'paused'
  return 'active'
}

export function describePromotion(p: Promotion, itemName?: string): string {
  switch (p.type) {
    case 'percent':
      return `-${p.value ?? 0} % sur la commande`
    case 'amount':
      return `${(p.value ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} offerts`
    case 'free_delivery':
      return 'Frais de livraison offerts'
    case 'bogo':
      return `${itemName ?? 'Plat'} : 1 acheté = 1 offert`
  }
}

const dayOffset = (days: number) => new Date(TODAY + days * DAY).toISOString()

export const initialPromotions: Promotion[] = [
  { id: 'pr-1', name: 'Midi gourmand', type: 'percent', value: 15, minOrder: 25, newCustomersOnly: false, startDate: dayOffset(-12), endDate: dayOffset(18), paused: false, uses: 142, revenue: 4985.4 },
  { id: 'pr-2', name: 'Bienvenue chez nous', type: 'amount', value: 5, minOrder: 20, newCustomersOnly: true, startDate: dayOffset(-40), endDate: dayOffset(50), paused: false, uses: 87, revenue: 2711.3 },
  { id: 'pr-3', name: 'Livraison offerte du samedi', type: 'free_delivery', minOrder: 30, newCustomersOnly: false, startDate: dayOffset(-5), endDate: dayOffset(25), paused: true, uses: 23, revenue: 902.6 },
  { id: 'pr-4', name: 'Duo de crèmes brûlées', type: 'bogo', itemId: 'item-008', newCustomersOnly: false, startDate: dayOffset(4), endDate: dayOffset(18), paused: false, uses: 0, revenue: 0 },
  { id: 'pr-5', name: 'Semaine du goût', type: 'percent', value: 20, minOrder: 30, newCustomersOnly: false, startDate: dayOffset(-30), endDate: dayOffset(-23), paused: false, uses: 211, revenue: 7840.2 },
  { id: 'pr-6', name: 'Rentrée gourmande', type: 'amount', value: 8, minOrder: 40, newCustomersOnly: false, startDate: dayOffset(-55), endDate: dayOffset(-41), paused: false, uses: 64, revenue: 3120.0 },
]

/* ──────────────────────────────── Payouts ──────────────────────────────── */

export const COMMISSION_RATE = 0.15
export const PAYMENT_FEE_RATE = 0.014

export type PayoutStatus = 'paid' | 'processing' | 'pending' | 'failed'

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  paid: 'Versé',
  processing: 'En cours',
  pending: 'Planifié',
  failed: 'Échec',
}

export interface Payout {
  id: string
  reference: string
  periodStart: string
  periodEnd: string
  payoutDate: string
  orders: number
  gross: number
  commission: number
  fees: number
  promotions: number
  net: number
  status: PayoutStatus
}

/** Weekly payouts every Tuesday, covering Monday → Sunday of the week before. */
function buildPayouts(): Payout[] {
  const today = new Date(TODAY)
  const dow = today.getDay()
  // most recent Monday strictly before this week
  const thisMonday = TODAY - ((dow + 6) % 7) * DAY
  const out: Payout[] = []
  for (let w = 0; w < 12; w++) {
    const start = thisMonday - (w + 1) * 7 * DAY
    const end = start + 6 * DAY
    const payoutDate = end + 2 * DAY
    const idxStart = dailyStats.findIndex((d) => startOfDay(new Date(d.date).getTime()) === start)
    const week = idxStart >= 0 ? dailyStats.slice(idxStart, idxStart + 7) : []
    const s = summarize(week)
    const gross = s.revenue
    const commission = round2(gross * COMMISSION_RATE)
    const fees = round2(gross * PAYMENT_FEE_RATE)
    const promotions = round2(gross * 0.035)
    const status: PayoutStatus = payoutDate > TODAY ? 'processing' : w === 6 ? 'failed' : 'paid'
    out.push({
      id: `po-${w}`,
      reference: `VIR-${new Date(payoutDate).getFullYear()}-${String(4820 - w).padStart(5, '0')}`,
      periodStart: new Date(start).toISOString(),
      periodEnd: new Date(end).toISOString(),
      payoutDate: new Date(payoutDate).toISOString(),
      orders: s.orders,
      gross,
      commission,
      fees,
      promotions,
      net: round2(gross - commission - fees - promotions),
      status,
    })
  }
  return out
}

export const payouts: Payout[] = buildPayouts()

/** Current (unpaid) week. */
function currentWeek() {
  const dow = new Date(TODAY).getDay()
  const thisMonday = TODAY - ((dow + 6) % 7) * DAY
  const days = Math.round((TODAY - thisMonday) / DAY) + 1
  const s = summarize(statsForPeriod(days))
  const commission = round2(s.revenue * COMMISSION_RATE)
  const fees = round2(s.revenue * PAYMENT_FEE_RATE)
  const promotions = round2(s.revenue * 0.035)
  return {
    periodStart: new Date(thisMonday).toISOString(),
    nextPayoutDate: new Date(thisMonday + 8 * DAY).toISOString(),
    gross: s.revenue,
    orders: s.orders,
    commission,
    fees,
    promotions,
    refunds: 18.8,
    balance: round2(s.revenue - commission - fees - promotions - 18.8),
  }
}

export const currentBalance = currentWeek()

export const bankAccount = {
  holder: 'SARL Le Bistrot du Coin',
  bank: 'Crédit Lyonnais — Agence Opéra',
  iban: 'FR76 3000 2005 5000 0015 7845 Z02',
  bic: 'CRLYFRPP',
}

export function maskIban(iban: string): string {
  const groups = iban.split(' ')
  return groups.map((g, i) => (i === 0 || i === groups.length - 1 ? g : '••••')).join(' ')
}

/* ──────────────────────────────── Settings ──────────────────────────────── */

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export const DAY_LABELS: Record<DayKey, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
}

export const DAY_KEYS = Object.keys(DAY_LABELS) as DayKey[]

export interface TimeSlot {
  open: string
  close: string
}

export interface DayHours {
  isOpen: boolean
  slots: TimeSlot[]
}

/** Returns a French error message when a day's slots are inconsistent. */
export function validateDay(day: DayHours): string | null {
  if (!day.isOpen) return null
  const sorted = [...day.slots].sort((a, b) => a.open.localeCompare(b.open))
  for (const s of sorted) {
    if (!s.open || !s.close) return 'Horaire incomplet'
    if (s.close <= s.open) return 'La fermeture doit suivre l’ouverture'
  }
  for (let i = 1; i < sorted.length; i++) if (sorted[i].open < sorted[i - 1].close) return 'Créneaux qui se chevauchent'
  return null
}

export function buildInitialHours(): Record<DayKey, DayHours> {
  return Object.fromEntries(
    DAY_KEYS.map((k) => {
      const h = merchantRestaurant.hours[k]
      return [k, h ? { isOpen: true, slots: [{ open: h.open, close: h.close }] } : { isOpen: false, slots: [{ open: '11:30', close: '15:00' }] }]
    }),
  ) as Record<DayKey, DayHours>
}

export interface ShopInfo {
  name: string
  description: string
  phone: string
  email: string
  address: string
  postalCode: string
  city: string
  siret: string
}

export const initialShopInfo: ShopInfo = {
  name: merchantRestaurant.name,
  description: merchantRestaurant.description,
  phone: merchantRestaurant.phone,
  email: 'contact@lebistrotducoin.fr',
  address: merchantRestaurant.address,
  postalCode: merchantRestaurant.postalCode,
  city: merchantRestaurant.city,
  siret: '812 345 678 00024',
}

export interface DeliverySettings {
  radiusKm: number
  minOrder: number
  deliveryFee: number
}

export const initialDelivery: DeliverySettings = {
  radiusKm: 3,
  minOrder: merchantRestaurant.minOrder,
  deliveryFee: merchantRestaurant.deliveryFee,
}

export type NotificationKey = 'newOrderSound' | 'newOrderSms' | 'dailyEmail' | 'reviews' | 'payouts' | 'marketing'

export const NOTIFICATION_OPTIONS: { key: NotificationKey; label: string; description: string }[] = [
  { key: 'newOrderSound', label: 'Alerte sonore', description: 'Une sonnerie retentit à chaque nouvelle commande sur la tablette.' },
  { key: 'newOrderSms', label: 'SMS de secours', description: 'SMS au gérant si une commande n’est pas acceptée sous 3 minutes.' },
  { key: 'dailyEmail', label: 'Récapitulatif quotidien', description: 'E-mail chaque soir avec le chiffre d’affaires et les commandes du jour.' },
  { key: 'reviews', label: 'Nouveaux avis', description: 'Être prévenu dès qu’un client laisse un avis.' },
  { key: 'payouts', label: 'Virements', description: 'Confirmation à chaque virement émis vers votre compte.' },
  { key: 'marketing', label: 'Conseils ColeDash', description: 'Astuces et opportunités pour développer vos ventes.' },
]

export const initialNotifications: Record<NotificationKey, boolean> = {
  newOrderSound: true,
  newOrderSms: true,
  dailyEmail: true,
  reviews: true,
  payouts: true,
  marketing: false,
}

export type TeamRole = 'owner' | 'manager' | 'kitchen' | 'cashier'

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  owner: 'Propriétaire',
  manager: 'Gérant',
  kitchen: 'Cuisine',
  cashier: 'Caisse',
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: TeamRole
  lastActive: string
}

export const initialTeam: TeamMember[] = [
  { id: 'tm-1', name: 'Philippe Garnier', email: 'philippe@lebistrotducoin.fr', role: 'owner', lastActive: ago(0, 1) },
  { id: 'tm-2', name: 'Nadia Haddad', email: 'nadia@lebistrotducoin.fr', role: 'manager', lastActive: ago(0, 0.2) },
  { id: 'tm-3', name: 'Lucas Fontaine', email: 'lucas@lebistrotducoin.fr', role: 'kitchen', lastActive: ago(0, 4) },
  { id: 'tm-4', name: 'Manon Perrin', email: 'manon@lebistrotducoin.fr', role: 'cashier', lastActive: ago(2, 3) },
]

/** Chart palette validated for CVD separation (rose, bleu, ambre, sarcelle). */
export const CHART_COLORS = ['#e11d48', '#2563eb', '#d97706', '#0d9488'] as const
