/**
 * Mock data for the ColeDash back-office. All generated from seeded PRNGs:
 * the same values appear on every render and every reload.
 */
import type { OrderStatus, PaymentMethod, VendorKind } from '@/types'
import { cities } from '@/data/cities'
import { restaurants } from '@/data/restaurants'
import { stores } from '@/data/stores'
import { PROMO_CODES } from '@/lib/pricing'
import { createRng } from './driver'

const pick = <T,>(rng: () => number, list: readonly T[]): T => list[Math.floor(rng() * list.length)]
const round2 = (n: number) => Math.round(n * 100) / 100
const NOW = Date.now()
const minutesAgo = (m: number) => new Date(NOW - m * 60000).toISOString()

/** Validated categorical palette (CVD-safe), fixed order. */
export const CHART_COLORS = ['#e11d48', '#0d9488', '#d97706', '#4f46e5'] as const

export const LIVE_CITY_IDS = cities.filter((c) => c.available).map((c) => c.id)
export const cityColor = (cityId: string) => CHART_COLORS[Math.max(0, LIVE_CITY_IDS.indexOf(cityId)) % CHART_COLORS.length]
export const cityName = (cityId: string) => cities.find((c) => c.id === cityId)?.name ?? cityId

export const VENDOR_KIND_LABELS: Record<VendorKind, string> = {
  restaurant: 'Restaurant',
  grocery: 'Courses',
  flowers: 'Fleurs',
  retail: 'Boutique',
}

const FIRST = ['Camille', 'Thomas', 'Inès', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Yanis', 'Manon', 'Lucas', 'Sarah', 'Louis', 'Jade', 'Gabriel', 'Emma', 'Mehdi', 'Zoé', 'Arthur', 'Lina', 'Jules', 'Alice', 'Rayan', 'Clara', 'Paul', 'Anaïs', 'Théo', 'Nora', 'Maxime']
const LAST = ['Dubois', 'Martin', 'Bernard', 'Lefèvre', 'Moreau', 'Laurent', 'Garnier', 'Rousseau', 'Haddad', 'Fontaine', 'Mercier', 'Chevalier', 'Nguyen', 'Diallo', 'Roux', 'Perrin', 'Morel', 'Girard', 'Benali', 'Lopez', 'Faure', 'André']
const STREETS: Record<string, string[]> = {
  paris: ['rue de Charonne, 75011', 'rue des Martyrs, 75009', 'boulevard Voltaire, 75011', 'rue de Turenne, 75003', 'rue Lepic, 75018', 'rue du Bac, 75007'],
  lyon: ['rue de la République, 69002', 'cours Vitton, 69006', 'rue Mercière, 69002', 'montée de la Grande-Côte, 69001'],
  marseille: ['rue Paradis, 13006', 'boulevard Longchamp, 13001', 'rue Sainte, 13007', 'cours Julien, 13006'],
  nice: ['rue de France, 06000', 'avenue Jean-Médecin, 06000', 'boulevard Gambetta, 06000', 'rue Bonaparte, 06300'],
}
const fullName = (rng: () => number) => `${pick(rng, FIRST)} ${pick(rng, LAST)}`
const emailOf = (name: string) =>
  `${name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z ]/g, '')
    .replace(' ', '.')}@exemple.fr`

/* ─── Commerces ────────────────────────────────────────────────────── */

export type VendorStatus = 'actif' | 'suspendu' | 'en_attente'

export interface AdminVendor {
  id: string
  name: string
  kind: VendorKind
  category: string
  cityId: string
  address: string
  image: string
  rating: number
  status: VendorStatus
  /** Commission, percent. */
  commission: number
  ordersMonth: number
  gmvMonth: number
  owner: string
  joinedAt: string
}

const cityIdFromName = (name: string) => cities.find((c) => c.name.toLowerCase() === name.toLowerCase())?.id ?? 'paris'

function buildVendors(): AdminVendor[] {
  const rng = createRng(77)
  const fromRestaurants: AdminVendor[] = restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    kind: 'restaurant',
    category: r.cuisine,
    cityId: cityIdFromName(r.city),
    address: `${r.address}, ${r.postalCode}`,
    image: r.image,
    rating: r.rating,
    status: 'actif',
    commission: pick(rng, [25, 27, 30, 30, 30]),
    ordersMonth: 0,
    gmvMonth: 0,
    owner: fullName(rng),
    joinedAt: minutesAgo(60 * 24 * (60 + Math.floor(rng() * 600))),
  }))
  const fromStores: AdminVendor[] = stores.map((s) => ({
    id: s.id,
    name: s.name,
    kind: s.kind,
    category: s.category,
    cityId: s.cityId,
    address: s.address,
    image: s.image,
    rating: s.rating,
    status: 'actif',
    commission: s.kind === 'grocery' ? 15 : s.kind === 'flowers' ? 22 : 18,
    ordersMonth: 0,
    gmvMonth: 0,
    owner: fullName(rng),
    joinedAt: minutesAgo(60 * 24 * (30 + Math.floor(rng() * 500))),
  }))
  const pending: AdminVendor[] = [
    { id: 'cand-001', name: 'Maison Kanpai', kind: 'restaurant', category: 'Japonaise', cityId: 'paris', address: '18 rue Sainte-Anne, 75001', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900&h=600&fit=crop', rating: 0, status: 'en_attente', commission: 30, ordersMonth: 0, gmvMonth: 0, owner: 'Kenji Moreau', joinedAt: minutesAgo(60 * 26) },
    { id: 'cand-002', name: 'Fromagerie Bellecour', kind: 'grocery', category: 'Fromager', cityId: 'lyon', address: '9 rue Émile-Zola, 69002', image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=900&h=600&fit=crop', rating: 0, status: 'en_attente', commission: 15, ordersMonth: 0, gmvMonth: 0, owner: 'Hélène Girard', joinedAt: minutesAgo(60 * 50) },
    { id: 'cand-003', name: 'Le Comptoir Niçois', kind: 'restaurant', category: 'Niçoise', cityId: 'nice', address: '4 rue Pairolière, 06300', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=600&fit=crop', rating: 0, status: 'en_attente', commission: 28, ordersMonth: 0, gmvMonth: 0, owner: 'Marius Faure', joinedAt: minutesAgo(60 * 80) },
  ]
  const all = [...fromRestaurants, ...fromStores, ...pending]
  all.forEach((v, i) => {
    if (v.status === 'en_attente') return
    v.ordersMonth = 180 + Math.floor(rng() * 1400)
    v.gmvMonth = round2(v.ordersMonth * (v.kind === 'grocery' ? 38 : v.kind === 'flowers' ? 52 : 27) * (0.85 + rng() * 0.3))
    if (i === 6 || i === 15) v.status = 'suspendu'
  })
  return all
}

export const ADMIN_VENDORS: AdminVendor[] = buildVendors()

/* ─── Commandes ────────────────────────────────────────────────────── */

export interface AdminOrderLine {
  name: string
  quantity: number
  unitPrice: number
}

export interface AdminOrder {
  id: string
  number: string
  createdAt: string
  customer: string
  customerEmail: string
  vendorId: string
  vendorName: string
  vendorKind: VendorKind
  cityId: string
  status: OrderStatus
  lines: AdminOrderLine[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  total: number
  driver?: string
  address: string
  paymentMethod: PaymentMethod
  refunded?: number
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Carte bancaire',
  apple_pay: 'Apple Pay',
  paypal: 'PayPal',
  cash: 'Espèces',
}

export const ADMIN_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  picked_up: 'Récupérée',
  delivering: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STORE_PRODUCTS: Record<Exclude<VendorKind, 'restaurant'>, [string, number][]> = {
  grocery: [['Tomates cœur de bœuf (1 kg)', 4.9], ['Comté 18 mois (250 g)', 7.4], ['Baguette tradition', 1.3], ['Lait demi-écrémé bio (1 L)', 1.45], ['Œufs plein air (x12)', 4.2], ['Pommes Gala (1 kg)', 3.1]],
  flowers: [['Bouquet de pivoines', 45], ['Bouquet champêtre', 35], ['Orchidée blanche', 39], ['Carte message', 3]],
  retail: [['Doliprane 1000 mg', 2.18], ['Côtes-du-Rhône 2021', 12.9], ['Chargeur USB-C 30 W', 24.9], ['Roman de poche', 8.9], ['Crème solaire SPF 50', 14.5]],
}

const DRIVERS_POOL = ['Karim Benali', 'Sofiane Amrani', 'Julie Caron', 'Mamadou Sow', 'Lucie Petit', 'Antoine Robin', 'Yasmine Cherif', 'Kevin Marchand', 'Ousmane Ba', 'Marion Leclerc']

function buildOrders(): AdminOrder[] {
  const rng = createRng(2024)
  const active = ADMIN_VENDORS.filter((v) => v.status !== 'en_attente')
  const orders: AdminOrder[] = []
  let minutes = 2
  for (let i = 0; i < 90; i++) {
    minutes += 3 + Math.floor(rng() * (i < 20 ? 6 : 40))
    const v = pick(rng, active)
    let catalog: [string, number][]
    if (v.kind === 'restaurant') {
      const r = restaurants.find((x) => x.id === v.id)
      catalog = (r?.menu ?? []).flatMap((c) => c.items).map((it) => [it.name, it.price] as [string, number])
    } else catalog = STORE_PRODUCTS[v.kind]
    if (catalog.length === 0) catalog = [['Article', 10]]
    const lines: AdminOrderLine[] = Array.from({ length: 1 + Math.floor(rng() * 3) }, () => {
      const [name, price] = pick(rng, catalog)
      return { name, quantity: 1 + Math.floor(rng() * 2), unitPrice: price }
    })
    const subtotal = round2(lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0))
    const deliveryFee = subtotal >= 35 ? 0 : pick(rng, [1.49, 1.99, 2.49, 2.99])
    const serviceFee = round2(Math.min(Math.max(subtotal * 0.05, 0.99), 3.99))
    const status: OrderStatus =
      minutes < 12 ? 'confirmed' : minutes < 25 ? pick(rng, ['preparing', 'preparing', 'picked_up'] as const) : minutes < 45 ? pick(rng, ['delivering', 'picked_up', 'delivered'] as const) : rng() < 0.06 ? 'cancelled' : 'delivered'
    const customer = fullName(rng)
    orders.push({
      id: `adm-ord-${i}`,
      number: `CD-${48213 - i * 7 - Math.floor(rng() * 5)}`,
      createdAt: minutesAgo(minutes),
      customer,
      customerEmail: emailOf(customer),
      vendorId: v.id,
      vendorName: v.name,
      vendorKind: v.kind,
      cityId: v.cityId,
      status,
      lines,
      subtotal,
      deliveryFee,
      serviceFee,
      total: round2(subtotal + deliveryFee + serviceFee),
      driver: status === 'confirmed' || status === 'cancelled' ? undefined : pick(rng, DRIVERS_POOL),
      address: `${1 + Math.floor(rng() * 120)} ${pick(rng, STREETS[v.cityId] ?? STREETS.paris)}`,
      paymentMethod: pick(rng, ['card', 'card', 'card', 'apple_pay', 'paypal'] as const),
      refunded: status === 'delivered' && rng() < 0.05 ? round2(subtotal * 0.3) : undefined,
    })
  }
  return orders
}

export const ADMIN_ORDERS: AdminOrder[] = buildOrders()

/* ─── Villes ───────────────────────────────────────────────────────── */

export interface DeliveryZone {
  id: string
  name: string
  active: boolean
  fee: number
  avgMinutes: number
}

export interface CityMetrics {
  cityId: string
  gmvMonth: number
  ordersMonth: number
  ordersToday: number
  activeCustomers: number
  driversOnline: number
  driversTotal: number
  avgDeliveryMinutes: number
  satisfaction: number
  growth: number
  zones: DeliveryZone[]
  /** Planned launch date for upcoming cities. */
  launchDate?: string
  waitlist?: number
}

const ZONES: Record<string, string[]> = {
  paris: ['Centre (1er–4e)', 'Rive gauche (5e–7e)', 'Grands Boulevards (8e–10e)', 'Est parisien (11e–12e, 20e)', 'Sud (13e–15e)', 'Nord-Ouest (16e–17e)', 'Montmartre (18e)', 'Petite couronne Est'],
  lyon: ['Presqu’île', 'Croix-Rousse', 'Part-Dieu', 'Vieux-Lyon', 'Villeurbanne'],
  marseille: ['Vieux-Port', 'Cours Julien', 'Prado', 'Joliette', 'Endoume'],
  nice: ['Vieux-Nice', 'Jean-Médecin', 'Port', 'Promenade des Anglais'],
  bordeaux: ['Chartrons', 'Saint-Pierre', 'Bastide'],
  lille: ['Vieux-Lille', 'Wazemmes', 'Euralille'],
}

export const CITY_METRICS: CityMetrics[] = cities.map((c, ci) => {
  const rng = createRng(500 + ci * 31)
  const scale = { paris: 1, lyon: 0.42, marseille: 0.36, nice: 0.24 }[c.id] ?? 0
  const zones = (ZONES[c.id] ?? []).map((z, zi) => ({
    id: `${c.id}-z${zi}`,
    name: z,
    active: c.available ? zi < (ZONES[c.id].length - (rng() < 0.5 ? 1 : 0)) : false,
    fee: pick(rng, [1.49, 1.99, 2.49]),
    avgMinutes: 22 + Math.floor(rng() * 14),
  }))
  const ordersMonth = Math.round(48200 * scale * (0.9 + rng() * 0.2))
  return {
    cityId: c.id,
    gmvMonth: round2(ordersMonth * (29 + rng() * 6)),
    ordersMonth,
    ordersToday: Math.round((ordersMonth / 30) * (0.9 + rng() * 0.3)),
    activeCustomers: Math.round(ordersMonth * 0.31),
    driversOnline: Math.round(220 * scale * (0.8 + rng() * 0.4)),
    driversTotal: Math.round(860 * scale),
    avgDeliveryMinutes: c.available ? 24 + Math.floor(rng() * 8) : 0,
    satisfaction: c.available ? round2(4.5 + rng() * 0.35) : 0,
    growth: c.available ? round2(4 + rng() * 18) : 0,
    zones,
    launchDate: c.available ? undefined : c.id === 'bordeaux' ? '2027-01-15' : '2027-03-01',
    waitlist: c.available ? undefined : c.id === 'bordeaux' ? 3840 : 2615,
  }
})

/** Orders per day for the last 14 days, per live city. */
export const DAILY_ORDERS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(NOW)
  d.setDate(d.getDate() - (13 - i))
  const rng = createRng(900 + i)
  const weekend = d.getDay() === 0 || d.getDay() === 5 || d.getDay() === 6
  const row: Record<string, number | string> = { date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }
  CITY_METRICS.filter((m) => LIVE_CITY_IDS.includes(m.cityId)).forEach((m) => {
    row[m.cityId] = Math.round((m.ordersMonth / 30) * (weekend ? 1.25 : 0.92) * (0.9 + rng() * 0.2))
  })
  return row
})

/* ─── Incidents ────────────────────────────────────────────────────── */

export type IncidentSeverity = 'critique' | 'majeur' | 'mineur'

export interface Incident {
  id: string
  title: string
  detail: string
  cityId: string
  severity: IncidentSeverity
  at: string
  resolved: boolean
}

export const INCIDENTS: Incident[] = [
  { id: 'inc-1', title: 'Pic de commandes non assignées', detail: '23 commandes en attente de livreur sur Oberkampf · République', cityId: 'paris', severity: 'majeur', at: minutesAgo(9), resolved: false },
  { id: 'inc-2', title: 'Tablette hors ligne', detail: 'Sushi Master ne reçoit plus les commandes depuis 14 min', cityId: 'paris', severity: 'mineur', at: minutesAgo(21), resolved: false },
  { id: 'inc-3', title: 'Paiements PayPal ralentis', detail: 'Temps de réponse prestataire > 4 s', cityId: 'lyon', severity: 'critique', at: minutesAgo(38), resolved: false },
  { id: 'inc-4', title: 'Pluie forte annoncée', detail: 'Bonus météo activé automatiquement (+1,50 € par course)', cityId: 'marseille', severity: 'mineur', at: minutesAgo(64), resolved: true },
  { id: 'inc-5', title: 'Zone Port fermée', detail: 'Travaux de voirie, livraisons redirigées', cityId: 'nice', severity: 'mineur', at: minutesAgo(180), resolved: true },
]

/* ─── Utilisateurs ─────────────────────────────────────────────────── */

export type UserStatus = 'actif' | 'bloque'

export interface AdminCustomer {
  id: string
  name: string
  email: string
  phone: string
  cityId: string
  createdAt: string
  orders: number
  spent: number
  status: UserStatus
}

export interface AdminDriver {
  id: string
  name: string
  email: string
  phone: string
  cityId: string
  createdAt: string
  vehicle: string
  deliveries: number
  rating: number
  online: boolean
  status: UserStatus
}

export interface AdminMerchantUser {
  id: string
  name: string
  email: string
  phone: string
  cityId: string
  createdAt: string
  vendorName: string
  vendorKind: VendorKind
  status: UserStatus
}

const phone = (rng: () => number) =>
  `0${pick(rng, ['6', '7'])} ${Array.from({ length: 4 }, () => String(Math.floor(rng() * 100)).padStart(2, '0')).join(' ')}`

export const ADMIN_CUSTOMERS: AdminCustomer[] = Array.from({ length: 36 }, (_, i) => {
  const rng = createRng(3000 + i)
  const name = fullName(rng)
  const orders = Math.floor(rng() * 80)
  return {
    id: `cli-${1000 + i}`,
    name,
    email: emailOf(name),
    phone: phone(rng),
    cityId: pick(rng, ['paris', 'paris', 'paris', 'lyon', 'marseille', 'nice']),
    createdAt: minutesAgo(60 * 24 * Math.floor(5 + rng() * 700)),
    orders,
    spent: round2(orders * (22 + rng() * 18)),
    status: rng() < 0.06 ? 'bloque' : 'actif',
  }
})

export const ADMIN_DRIVERS: AdminDriver[] = Array.from({ length: 24 }, (_, i) => {
  const rng = createRng(4000 + i)
  const name = i === 0 ? 'Karim Benali' : i < DRIVERS_POOL.length ? DRIVERS_POOL[i] : fullName(rng)
  return {
    id: `liv-${200 + i}`,
    name,
    email: emailOf(name),
    phone: phone(rng),
    cityId: i === 0 ? 'paris' : pick(rng, ['paris', 'paris', 'lyon', 'marseille', 'nice']),
    createdAt: minutesAgo(60 * 24 * Math.floor(20 + rng() * 800)),
    vehicle: i === 0 ? 'Vélo électrique' : pick(rng, ['Vélo électrique', 'Vélo', 'Scooter 50 cm³', 'Scooter électrique']),
    deliveries: i === 0 ? 2317 : Math.floor(40 + rng() * 2400),
    rating: i === 0 ? 4.92 : round2(4.3 + rng() * 0.68),
    online: rng() < 0.45,
    status: rng() < 0.08 ? 'bloque' : 'actif',
  }
})

export const ADMIN_MERCHANT_USERS: AdminMerchantUser[] = ADMIN_VENDORS.map((v, i) => {
  const rng = createRng(5000 + i)
  return {
    id: `com-${300 + i}`,
    name: v.owner,
    email: emailOf(v.owner),
    phone: phone(rng),
    cityId: v.cityId,
    createdAt: v.joinedAt,
    vendorName: v.name,
    vendorKind: v.kind,
    status: v.status === 'suspendu' ? 'bloque' : 'actif',
  }
})

/* ─── Finance ──────────────────────────────────────────────────────── */

export interface MonthFinance {
  month: string
  gmv: number
  commissions: number
  fees: number
  merchantPayouts: number
  driverPayouts: number
  refunds: number
}

export const MONTHLY_FINANCE: MonthFinance[] = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(NOW)
  d.setDate(1)
  d.setMonth(d.getMonth() - (11 - i))
  const rng = createRng(700 + i)
  const gmv = round2(2_400_000 * (0.62 + i * 0.035) * (0.95 + rng() * 0.1))
  const commissions = round2(gmv * 0.235)
  return {
    month: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    gmv,
    commissions,
    fees: round2(gmv * 0.071),
    merchantPayouts: round2(gmv - commissions),
    driverPayouts: round2(gmv * 0.118),
    refunds: round2(gmv * (0.006 + rng() * 0.004)),
  }
})

export type TransactionType = 'commande' | 'remboursement' | 'versement_commercant' | 'versement_livreur'

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  commande: 'Paiement commande',
  remboursement: 'Remboursement',
  versement_commercant: 'Versement commerçant',
  versement_livreur: 'Versement livreur',
}

export interface Transaction {
  id: string
  at: string
  type: TransactionType
  label: string
  reference: string
  amount: number
  status: 'reussi' | 'en_cours' | 'echoue'
}

export const TRANSACTIONS: Transaction[] = Array.from({ length: 40 }, (_, i) => {
  const rng = createRng(8000 + i)
  const type = pick(rng, ['commande', 'commande', 'commande', 'remboursement', 'versement_commercant', 'versement_livreur'] as const)
  const order = ADMIN_ORDERS[i % ADMIN_ORDERS.length]
  const vendor = pick(rng, ADMIN_VENDORS.filter((v) => v.status === 'actif'))
  const driver = pick(rng, ADMIN_DRIVERS)
  const amount =
    type === 'commande' ? order.total : type === 'remboursement' ? -round2(order.subtotal * 0.5) : type === 'versement_commercant' ? -round2(1500 + rng() * 9000) : -round2(180 + rng() * 520)
  return {
    id: `tx-${i}`,
    at: minutesAgo(i * 47 + Math.floor(rng() * 30)),
    type,
    label: type === 'commande' || type === 'remboursement' ? `${order.vendorName} · ${order.customer}` : type === 'versement_commercant' ? vendor.name : driver.name,
    reference: type === 'commande' || type === 'remboursement' ? order.number : `VIR-${(90210 + i * 13).toString()}`,
    amount,
    status: rng() < 0.08 ? 'en_cours' : rng() < 0.03 ? 'echoue' : 'reussi',
  }
})

/* ─── Marketing ────────────────────────────────────────────────────── */

export type CampaignStatus = 'active' | 'programmee' | 'terminee' | 'brouillon'
export type CampaignChannel = 'push' | 'email' | 'sms' | 'in_app'

export const CHANNEL_LABELS: Record<CampaignChannel, string> = { push: 'Notification push', email: 'E-mail', sms: 'SMS', in_app: 'Bannière in-app' }
export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = { active: 'Active', programmee: 'Programmée', terminee: 'Terminée', brouillon: 'Brouillon' }

export interface Campaign {
  id: string
  name: string
  channel: CampaignChannel
  status: CampaignStatus
  audience: string
  start: string
  end: string
  budget: number
  spent: number
  reach: number
  conversions: number
}

export const CAMPAIGNS: Campaign[] = [
  { id: 'cmp-1', name: 'Rentrée gourmande', channel: 'push', status: 'active', audience: 'Clients inactifs 30 j · Paris', start: minutesAgo(60 * 24 * 6), end: minutesAgo(-60 * 24 * 8), budget: 12000, spent: 5240, reach: 84200, conversions: 3912 },
  { id: 'cmp-2', name: 'Fête des grands-mères', channel: 'email', status: 'programmee', audience: 'Acheteurs fleurs · toutes villes', start: minutesAgo(-60 * 24 * 10), end: minutesAgo(-60 * 24 * 14), budget: 6000, spent: 0, reach: 0, conversions: 0 },
  { id: 'cmp-3', name: 'Lancement Biocoop', channel: 'in_app', status: 'active', audience: 'Clients courses · Paris 11e', start: minutesAgo(60 * 24 * 3), end: minutesAgo(-60 * 24 * 11), budget: 4000, spent: 1180, reach: 26500, conversions: 1204 },
  { id: 'cmp-4', name: 'Soirées match OM', channel: 'sms', status: 'terminee', audience: 'Clients Marseille', start: minutesAgo(60 * 24 * 40), end: minutesAgo(60 * 24 * 20), budget: 3500, spent: 3480, reach: 18900, conversions: 1650 },
  { id: 'cmp-5', name: 'Parrainage x2', channel: 'push', status: 'brouillon', audience: 'Tous les clients', start: minutesAgo(-60 * 24 * 20), end: minutesAgo(-60 * 24 * 50), budget: 15000, spent: 0, reach: 0, conversions: 0 },
]

export interface PromoStats {
  code: string
  label: string
  uses: number
  limit?: number
  discountTotal: number
  revenue: number
  active: boolean
  expires?: string
  /** True for codes really applied at checkout (from src/lib/pricing.ts). */
  live: boolean
}

export const PROMO_STATS: PromoStats[] = [
  ...PROMO_CODES.map((p, i) => {
    const rng = createRng(6000 + i)
    const uses = 1200 + Math.floor(rng() * 6000)
    return { code: p.code, label: p.label, uses, discountTotal: round2(uses * (3 + rng() * 4)), revenue: round2(uses * (28 + rng() * 10)), active: true, live: true }
  }),
  { code: 'SUSHI15', label: '-15 % chez les restaurants japonais', uses: 842, limit: 2000, discountTotal: 4120, revenue: 28650, active: true, expires: minutesAgo(-60 * 24 * 21), live: false },
  { code: 'LYON5', label: '5 € offerts dès 25 € · Lyon', uses: 1530, limit: 1500, discountTotal: 7650, revenue: 49800, active: false, expires: minutesAgo(60 * 24 * 3), live: false },
  { code: 'NUIT', label: 'Livraison offerte après 22 h', uses: 389, discountTotal: 902, revenue: 11240, active: true, live: false },
]

/* ─── Support ──────────────────────────────────────────────────────── */

export type TicketStatus = 'ouvert' | 'en_attente' | 'resolu'
export type TicketPriority = 'basse' | 'normale' | 'haute' | 'urgente'

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = { ouvert: 'Ouvert', en_attente: 'En attente', resolu: 'Résolu' }
export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = { basse: 'Basse', normale: 'Normale', haute: 'Haute', urgente: 'Urgente' }

export interface TicketMessage {
  id: string
  from: 'user' | 'agent'
  author: string
  at: string
  body: string
}

export interface Ticket {
  id: string
  subject: string
  requester: string
  requesterRole: 'client' | 'livreur' | 'commerçant'
  cityId: string
  orderNumber?: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  messages: TicketMessage[]
}

export const TICKETS: Ticket[] = [
  {
    id: 'TCK-2041',
    subject: 'Commande arrivée froide',
    requester: 'Camille Dubois',
    requesterRole: 'client',
    cityId: 'paris',
    orderNumber: ADMIN_ORDERS[30].number,
    status: 'ouvert',
    priority: 'normale',
    category: 'Qualité',
    messages: [
      { id: 'm1', from: 'user', author: 'Camille Dubois', at: minutesAgo(42), body: "Bonjour, ma commande est arrivée complètement froide après 55 minutes d'attente. Les frites étaient immangeables. Est-ce possible d'avoir un geste ?" },
    ],
  },
  {
    id: 'TCK-2040',
    subject: 'Article manquant : tarte tatin',
    requester: 'Hugo Martin',
    requesterRole: 'client',
    cityId: 'paris',
    orderNumber: ADMIN_ORDERS[34].number,
    status: 'ouvert',
    priority: 'haute',
    category: 'Article manquant',
    messages: [
      { id: 'm1', from: 'user', author: 'Hugo Martin', at: minutesAgo(75), body: "Il manquait la tarte tatin dans mon sac. Je l'ai pourtant bien payée." },
      { id: 'm2', from: 'agent', author: 'Sophie (Support)', at: minutesAgo(70), body: 'Bonjour Hugo, je suis désolée pour cet oubli. Je vérifie avec le restaurant et je reviens vers vous.' },
      { id: 'm3', from: 'user', author: 'Hugo Martin', at: minutesAgo(20), body: "Toujours pas de nouvelles, c'est la deuxième fois ce mois-ci." },
    ],
  },
  {
    id: 'TCK-2039',
    subject: 'Virement de la semaine non reçu',
    requester: 'Mamadou Sow',
    requesterRole: 'livreur',
    cityId: 'lyon',
    status: 'en_attente',
    priority: 'urgente',
    category: 'Paiement',
    messages: [
      { id: 'm1', from: 'user', author: 'Mamadou Sow', at: minutesAgo(60 * 5), body: "Bonjour, je n'ai pas reçu mon virement de lundi (312,40 €). Mon IBAN n'a pas changé." },
      { id: 'm2', from: 'agent', author: 'Nicolas (Support)', at: minutesAgo(60 * 4), body: "Bonjour Mamadou, le virement a été rejeté par votre banque. Pouvez-vous nous transmettre un RIB récent depuis l'application ?" },
    ],
  },
  {
    id: 'TCK-2038',
    subject: 'Modifier les horaires du dimanche',
    requester: 'Hélène Girard',
    requesterRole: 'commerçant',
    cityId: 'lyon',
    status: 'ouvert',
    priority: 'basse',
    category: 'Compte commerçant',
    messages: [
      { id: 'm1', from: 'user', author: 'Hélène Girard', at: minutesAgo(60 * 9), body: 'Bonjour, nous fermons désormais le dimanche à 13 h. Comment mettre à jour nos horaires ?' },
    ],
  },
  {
    id: 'TCK-2037',
    subject: 'Code promo BIENVENUE refusé',
    requester: 'Léa Rousseau',
    requesterRole: 'client',
    cityId: 'marseille',
    status: 'resolu',
    priority: 'normale',
    category: 'Promotion',
    messages: [
      { id: 'm1', from: 'user', author: 'Léa Rousseau', at: minutesAgo(60 * 26), body: "Le code BIENVENUE ne fonctionne pas alors que c'est ma première commande." },
      { id: 'm2', from: 'agent', author: 'Sophie (Support)', at: minutesAgo(60 * 25), body: "Bonjour Léa, le code était lié à un ancien compte avec la même adresse. Je vous ai crédité 10 € en bon d'achat." },
      { id: 'm3', from: 'user', author: 'Léa Rousseau', at: minutesAgo(60 * 24), body: 'Merci beaucoup, très réactif !' },
    ],
  },
  {
    id: 'TCK-2036',
    subject: 'Accident léger pendant une course',
    requester: 'Julie Caron',
    requesterRole: 'livreur',
    cityId: 'paris',
    orderNumber: ADMIN_ORDERS[12].number,
    status: 'ouvert',
    priority: 'urgente',
    category: 'Sécurité',
    messages: [
      { id: 'm1', from: 'user', author: 'Julie Caron', at: minutesAgo(14), body: "Une portière s'est ouverte devant moi rue de Charonne. Je vais bien mais le vélo est abîmé et la commande est perdue." },
    ],
  },
]

export const CANNED_RESPONSES = [
  { id: 'c1', label: 'Excuses + avoir', body: "Bonjour, nous sommes sincèrement désolés pour ce désagrément. Un avoir de 5 € vient d'être ajouté à votre compte, il sera appliqué automatiquement à votre prochaine commande." },
  { id: 'c2', label: 'Remboursement article', body: "Bonjour, nous avons procédé au remboursement de l'article manquant. Le montant apparaîtra sur votre moyen de paiement sous 3 à 5 jours ouvrés." },
  { id: 'c3', label: 'Demande de précisions', body: 'Bonjour, merci pour votre message. Pourriez-vous nous envoyer une photo de la commande reçue afin que nous puissions traiter votre demande au plus vite ?' },
  { id: 'c4', label: 'Sécurité livreur', body: "Bonjour, merci de nous avoir prévenus. Votre sécurité passe avant tout : la course est annulée sans pénalité et un conseiller va vous appeler dans les 10 minutes pour la déclaration d'assurance." },
  { id: 'c5', label: 'Clôture', body: "Nous restons à votre disposition si besoin. Belle journée et à bientôt sur ColeDash !" },
]

/* ─── Paramètres ───────────────────────────────────────────────────── */

export const FEATURE_FLAGS = [
  { id: 'scheduled', label: 'Commandes programmées', description: 'Les clients peuvent choisir un créneau de livraison.', enabled: true },
  { id: 'flowers-gift', label: 'Message cadeau pour les fleurs', description: 'Carte personnalisée lors du paiement.', enabled: true },
  { id: 'cash', label: 'Paiement en espèces', description: 'Disponible uniquement pour les clients vérifiés.', enabled: false },
  { id: 'tips-driver', label: 'Pourboires livreurs', description: 'Proposés après la livraison.', enabled: true },
  { id: 'surge', label: 'Tarification dynamique', description: 'Majoration des frais de livraison en cas de forte demande.', enabled: false },
  { id: 'group-orders', label: 'Commandes groupées (bêta)', description: 'Plusieurs personnes remplissent le même panier.', enabled: false },
]

export const ADMIN_TEAM = [
  { id: 't1', name: 'Claire Fontaine', email: 'claire.fontaine@coledash.fr', role: 'Super administratrice', lastSeen: minutesAgo(2) },
  { id: 't2', name: 'Nicolas Mercier', email: 'nicolas.mercier@coledash.fr', role: 'Support', lastSeen: minutesAgo(16) },
  { id: 't3', name: 'Sophie Laurent', email: 'sophie.laurent@coledash.fr', role: 'Support', lastSeen: minutesAgo(4) },
  { id: 't4', name: 'Jean Dupont', email: 'jean.dupont@coledash.fr', role: 'Commercial', lastSeen: minutesAgo(60 * 3) },
  { id: 't5', name: 'Amina Diallo', email: 'amina.diallo@coledash.fr', role: 'Finance', lastSeen: minutesAgo(60 * 26) },
]

export const ADMIN_ROLES = ['Super administratrice', 'Opérations', 'Support', 'Commercial', 'Finance', 'Marketing']
