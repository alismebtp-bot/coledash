import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_BOOKED, type DeliveryOffer, type EarningRecord } from '@/data/portals/driver'

export type DeliveryStep = 'to_merchant' | 'pickup' | 'to_customer'

export interface CurrentDelivery {
  offer: DeliveryOffer
  step: DeliveryStep
  acceptedAt: string
}

export interface Payout {
  id: string
  at: string
  amount: number
  instant: boolean
}

interface DriverState {
  online: boolean
  /** ISO time the current online session started. */
  onlineSince?: string
  /** Minutes accumulated in previous sessions today. */
  onlineMinutesToday: number
  /** Day (yyyy-mm-dd) the counters above belong to. */
  counterDay: string
  offerBatch: number
  declined: string[]
  accepted: number
  declinedCount: number
  current?: CurrentDelivery
  completed: EarningRecord[]
  payouts: Payout[]
  booked: string[]

  setOnline: (online: boolean) => void
  refreshOffers: () => void
  decline: (id: string) => void
  accept: (offer: DeliveryOffer) => void
  advance: () => void
  complete: () => EarningRecord | undefined
  cancelCurrent: () => void
  payout: (amount: number) => void
  toggleSlot: (id: string) => void
}

const today = () => new Date().toISOString().slice(0, 10)

export const useDriver = create<DriverState>()(
  persist(
    (set, get) => ({
      online: false,
      onlineMinutesToday: 0,
      counterDay: today(),
      offerBatch: 1,
      declined: [],
      accepted: 0,
      declinedCount: 0,
      completed: [],
      payouts: [],
      booked: DEFAULT_BOOKED,

      setOnline: (online) => {
        const s = get()
        const day = today()
        let minutes = s.counterDay === day ? s.onlineMinutesToday : 0
        if (!online && s.onlineSince) {
          minutes += Math.max(0, Math.round((Date.now() - new Date(s.onlineSince).getTime()) / 60000))
        }
        set({ online, onlineSince: online ? new Date().toISOString() : undefined, onlineMinutesToday: minutes, counterDay: day })
      },
      refreshOffers: () => set((s) => ({ offerBatch: s.offerBatch + 1, declined: [] })),
      decline: (id) => set((s) => ({ declined: [...s.declined, id], declinedCount: s.declinedCount + 1 })),
      accept: (offer) =>
        set((s) => ({
          current: { offer, step: 'to_merchant', acceptedAt: new Date().toISOString() },
          accepted: s.accepted + 1,
          declined: [...s.declined, offer.id],
        })),
      advance: () =>
        set((s) => {
          if (!s.current) return s
          const next: DeliveryStep = s.current.step === 'to_merchant' ? 'pickup' : 'to_customer'
          return { current: { ...s.current, step: next } }
        }),
      complete: () => {
        const c = get().current
        if (!c) return undefined
        const record: EarningRecord = {
          id: `done-${c.offer.id}`,
          at: new Date().toISOString(),
          merchantName: c.offer.merchantName,
          dropoffAddress: c.offer.dropoffAddress,
          distanceKm: c.offer.distanceKm,
          pay: c.offer.pay,
          tip: c.offer.tipEstimate,
          bonus: c.offer.boosted ? 1.5 : 0,
        }
        set((s) => ({ current: undefined, completed: [record, ...s.completed] }))
        return record
      },
      cancelCurrent: () => set({ current: undefined }),
      payout: (amount) =>
        set((s) => ({ payouts: [{ id: `vir-${Date.now().toString(36)}`, at: new Date().toISOString(), amount, instant: true }, ...s.payouts] })),
      toggleSlot: (id) => set((s) => ({ booked: s.booked.includes(id) ? s.booked.filter((x) => x !== id) : [...s.booked, id] })),
    }),
    { name: 'coledash-driver' },
  ),
)
