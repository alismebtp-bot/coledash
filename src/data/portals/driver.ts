/**
 * Mock data for the courier portal (Karim Benali, vélo électrique, Paris).
 * Everything is generated from a seeded PRNG so renders are deterministic.
 */

export function createRng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T,>(rng: () => number, list: readonly T[]): T => list[Math.floor(rng() * list.length)]
const round2 = (n: number) => Math.round(n * 100) / 100

export const DRIVER = {
  firstName: 'Karim',
  lastName: 'Benali',
  phone: '06 12 48 73 90',
  email: 'karim.benali@exemple.fr',
  city: 'Paris',
  vehicle: { type: 'Vélo électrique', model: 'Moustache Lundi 27', battery: 'Batterie 500 Wh', bag: 'Sac isotherme ColeDash 42 L' },
  memberSince: '2024-03-11',
  rating: 4.92,
  ratingCount: 1284,
  totalDeliveries: 2317,
  totalKm: 9840,
  acceptanceRate: 94,
  onTimeRate: 97,
  level: 'Livreur Or',
}

export type DemandLevel = 'faible' | 'normale' | 'forte' | 'tres_forte'

export const DEMAND_LABELS: Record<DemandLevel, string> = {
  faible: 'Calme',
  normale: 'Normale',
  forte: 'Forte demande',
  tres_forte: 'Très forte demande',
}

export interface DemandZone {
  id: string
  name: string
  level: DemandLevel
  /** Multiplier applied to pay during the rush, e.g. 1.2. */
  boost?: number
  waitMinutes: number
}

export const DEMAND_ZONES: DemandZone[] = [
  { id: 'z-oberkampf', name: 'Oberkampf · République', level: 'tres_forte', boost: 1.3, waitMinutes: 2 },
  { id: 'z-marais', name: 'Le Marais', level: 'forte', boost: 1.2, waitMinutes: 4 },
  { id: 'z-pigalle', name: 'Pigalle · Martyrs', level: 'forte', boost: 1.15, waitMinutes: 5 },
  { id: 'z-bastille', name: 'Bastille', level: 'normale', waitMinutes: 8 },
  { id: 'z-opera', name: 'Opéra · Grands Boulevards', level: 'normale', waitMinutes: 9 },
  { id: 'z-batignolles', name: 'Batignolles', level: 'faible', waitMinutes: 15 },
]

const PICKUPS = [
  { name: 'Le Bistrot du Coin', kind: 'Restaurant', address: '14 rue Montorgueil, 75002' },
  { name: 'Sakura Sushi', kind: 'Restaurant', address: '27 rue Sainte-Anne, 75001' },
  { name: 'Le Marché des Martyrs', kind: 'Courses', address: '38 rue des Martyrs, 75009' },
  { name: 'Biocoop Oberkampf', kind: 'Courses', address: '102 rue Oberkampf, 75011' },
  { name: 'Atelier Pivoine', kind: 'Fleurs', address: '7 rue de Bretagne, 75003' },
  { name: 'Pizzeria Napoli Nostra', kind: 'Restaurant', address: '61 rue de la Roquette, 75011' },
  { name: 'Big Fernand Marais', kind: 'Restaurant', address: '32 rue des Archives, 75004' },
  { name: 'Café Pinson', kind: 'Restaurant', address: '6 rue du Forez, 75003' },
] as const

const DROPOFFS = [
  '8 rue de Turenne, 75004',
  '45 boulevard Voltaire, 75011',
  '19 rue des Petites-Écuries, 75010',
  '3 rue Charlot, 75003',
  '72 rue du Faubourg-Saint-Denis, 75010',
  '11 rue Saint-Maur, 75011',
  '26 rue de Paradis, 75010',
  '5 place des Vosges, 75004',
  '90 rue de Rivoli, 75004',
  '17 rue Condorcet, 75009',
]

const CUSTOMERS = ['Camille D.', 'Thomas L.', 'Inès B.', 'Hugo M.', 'Léa R.', 'Nathan P.', 'Chloé V.', 'Yanis K.', 'Manon G.', 'Lucas F.']
const INSTRUCTIONS = ['Code porte 4821B, 3e étage gauche', 'Sonner à « Martin », interphone en panne : appeler', 'Laisser au gardien si absent', 'Bâtiment B, au fond de la cour', undefined, undefined]

export interface DeliveryOffer {
  id: string
  merchantName: string
  merchantKind: string
  pickupAddress: string
  dropoffAddress: string
  customerName: string
  instructions?: string
  /** Distance driver → merchant, km. */
  pickupKm: number
  /** Distance merchant → customer, km. */
  distanceKm: number
  pay: number
  tipEstimate: number
  minutes: number
  items: number
  orderCode: string
  /** 4-digit PIN the customer gives at handover. */
  pin: string
  boosted: boolean
  /** Seconds before the offer disappears. */
  expiresIn: number
  /** Stable seed used for the route drawing. */
  seed: number
}

/** A batch of offers. Each refresh bumps the batch number → new, deterministic offers. */
export function generateOffers(batch: number, count = 5): DeliveryOffer[] {
  const rng = createRng(9000 + batch * 131)
  return Array.from({ length: count }, (_, i) => {
    const p = pick(rng, PICKUPS)
    const distanceKm = round2(0.8 + rng() * 4.2)
    const pickupKm = round2(0.2 + rng() * 1.6)
    const boosted = rng() < 0.35
    const base = 2.9 + distanceKm * 0.95 + pickupKm * 0.35
    const pay = round2(base * (boosted ? 1.2 : 1))
    const tipEstimate = rng() < 0.55 ? round2(1 + Math.floor(rng() * 4)) : 0
    return {
      id: `offre-${batch}-${i}`,
      merchantName: p.name,
      merchantKind: p.kind,
      pickupAddress: p.address,
      dropoffAddress: pick(rng, DROPOFFS),
      customerName: pick(rng, CUSTOMERS),
      instructions: pick(rng, INSTRUCTIONS),
      pickupKm,
      distanceKm,
      pay,
      tipEstimate,
      minutes: Math.round(6 + (distanceKm + pickupKm) * 4.5),
      items: 1 + Math.floor(rng() * 6),
      orderCode: `CD-${Math.floor(10000 + rng() * 89999)}`,
      pin: String(Math.floor(1000 + rng() * 8999)),
      boosted,
      expiresIn: 45 + Math.floor(rng() * 75),
      seed: Math.floor(rng() * 100000),
    }
  })
}

/* ─── Earnings ─────────────────────────────────────────────────────── */

export interface EarningRecord {
  id: string
  /** ISO date-time */
  at: string
  merchantName: string
  dropoffAddress: string
  distanceKm: number
  pay: number
  tip: number
  bonus: number
}

export interface DayEarnings {
  date: string
  label: string
  courses: number
  tips: number
  bonus: number
  deliveries: number
  hours: number
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - day)
  return x
}

/** Monday of the week `offset` weeks ago (0 = current week). */
export function weekStart(offset: number, now = new Date()): Date {
  const s = startOfWeek(now)
  s.setDate(s.getDate() - offset * 7)
  return s
}

function dayIndexSinceEpoch(d: Date) {
  return Math.floor(d.getTime() / 86400000)
}

/** Deterministic history for one calendar day (seeded by the date). */
export function dayRecords(date: Date): EarningRecord[] {
  const rng = createRng(dayIndexSinceEpoch(date) * 7 + 3)
  const weekday = (date.getDay() + 6) % 7
  const off = rng() < 0.12 && weekday < 5
  if (off) return []
  const count = Math.floor((weekday >= 4 ? 11 : 6) + rng() * 6)
  const records: EarningRecord[] = []
  let minutes = 11 * 60 + 20
  for (let i = 0; i < count; i++) {
    minutes += 18 + Math.floor(rng() * 30)
    if (i === Math.floor(count / 2)) minutes = Math.max(minutes, 18 * 60 + 40)
    const at = new Date(date)
    at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
    const p = pick(rng, PICKUPS)
    const distanceKm = round2(0.8 + rng() * 4)
    records.push({
      id: `hist-${dayIndexSinceEpoch(date)}-${i}`,
      at: at.toISOString(),
      merchantName: p.name,
      dropoffAddress: pick(rng, DROPOFFS),
      distanceKm,
      pay: round2(2.9 + distanceKm * 0.95),
      tip: rng() < 0.45 ? round2(1 + Math.floor(rng() * 4)) : 0,
      bonus: rng() < 0.2 ? 1.5 : 0,
    })
  }
  return records
}

export function summarizeDay(date: Date, records: EarningRecord[]): DayEarnings {
  const weekday = (date.getDay() + 6) % 7
  const sum = (k: 'pay' | 'tip' | 'bonus') => round2(records.reduce((s, r) => s + r[k], 0))
  return {
    date: date.toISOString(),
    label: DAY_LABELS[weekday],
    courses: sum('pay'),
    tips: sum('tip'),
    bonus: sum('bonus'),
    deliveries: records.length,
    hours: records.length ? round2(records.length * 0.42 + 0.6) : 0,
  }
}

/** Chart series for earnings — validated categorical palette. */
export const EARNING_SERIES = [
  { key: 'courses', label: 'Courses', color: '#e11d48' },
  { key: 'tips', label: 'Pourboires', color: '#0d9488' },
  { key: 'bonus', label: 'Bonus', color: '#d97706' },
] as const

/** Monthly quest bonus pseudo-random but stable. */
export const WEEKLY_QUEST = { target: 60, label: 'Défi de la semaine : 60 courses = 35 € de bonus', reward: 35 }

/* ─── Planning ─────────────────────────────────────────────────────── */

export interface ShiftSlot {
  id: string
  /** 0 = Monday */
  day: number
  start: string
  end: string
  demand: DemandLevel
  /** Estimated hourly earnings. */
  estimate: number
  /** Remaining places for couriers. */
  spots: number
}

export const SLOT_HOURS = [
  { start: '11:00', end: '14:00' },
  { start: '14:00', end: '18:00' },
  { start: '18:00', end: '21:00' },
  { start: '21:00', end: '23:30' },
] as const

export function generateSlots(weekOffset: number): ShiftSlot[] {
  const rng = createRng(4242 + weekOffset * 17)
  const slots: ShiftSlot[] = []
  for (let day = 0; day < 7; day++) {
    SLOT_HOURS.forEach((h, i) => {
      const weekend = day >= 4
      const rushBase = i === 0 || i === 2 ? 2 : i === 3 ? 1 : 0
      const score = rushBase + (weekend ? 1 : 0) + (rng() < 0.3 ? 1 : 0) - (rng() < 0.2 ? 1 : 0)
      const demand: DemandLevel = score >= 3 ? 'tres_forte' : score === 2 ? 'forte' : score === 1 ? 'normale' : 'faible'
      const estimate = { faible: 11, normale: 14, forte: 17, tres_forte: 21 }[demand] + Math.floor(rng() * 3)
      slots.push({ id: `w${weekOffset}-d${day}-s${i}`, day, start: h.start, end: h.end, demand, estimate, spots: Math.floor(rng() * 9) })
    })
  }
  return slots
}

export const DEFAULT_BOOKED = ['w0-d0-s2', 'w0-d2-s0', 'w0-d4-s2', 'w0-d5-s0', 'w0-d5-s2', 'w0-d6-s2']

/* ─── Profile ──────────────────────────────────────────────────────── */

export type DocumentStatus = 'valide' | 'a_renouveler' | 'en_verification'

export interface DriverDocument {
  id: string
  label: string
  detail: string
  status: DocumentStatus
  expires?: string
}

export const DRIVER_DOCUMENTS: DriverDocument[] = [
  { id: 'doc-id', label: "Pièce d'identité", detail: "Carte nationale d'identité", status: 'valide', expires: '2031-06-14' },
  { id: 'doc-siret', label: 'Statut auto-entrepreneur', detail: 'SIRET 912 345 678 00019', status: 'valide' },
  { id: 'doc-rc', label: 'Assurance responsabilité civile pro', detail: 'AXA · contrat n° 4589 2210', status: 'a_renouveler', expires: '2026-11-15' },
  { id: 'doc-rib', label: 'Coordonnées bancaires', detail: 'IBAN FR76 •••• •••• 4421', status: 'valide' },
  { id: 'doc-hygiene', label: 'Charte hygiène alimentaire', detail: 'Signée le 11 mars 2024', status: 'valide' },
  { id: 'doc-casier', label: 'Extrait de casier judiciaire', detail: 'Bulletin n° 3', status: 'en_verification' },
]

export const RATING_BREAKDOWN = [
  { stars: 5, share: 91 },
  { stars: 4, share: 7 },
  { stars: 3, share: 1.4 },
  { stars: 2, share: 0.4 },
  { stars: 1, share: 0.2 },
]

export const RECENT_COMPLIMENTS = [
  { label: 'Très aimable', count: 412 },
  { label: 'Rapide', count: 389 },
  { label: 'Commande intacte', count: 301 },
  { label: 'A bien suivi les consignes', count: 177 },
]
