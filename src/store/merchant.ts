import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  buildInitialCatalog,
  buildInitialHours,
  buildLiveOrders,
  buildOrderHistory,
  initialDelivery,
  initialNotifications,
  initialPromotions,
  initialReviews,
  initialShopInfo,
  initialTeam,
  type CatalogCategory,
  type CatalogItem,
  type DayHours,
  type DayKey,
  type DeliverySettings,
  type MerchantOrder,
  type MerchantReview,
  type NotificationKey,
  type Promotion,
  type ShopInfo,
  type TeamMember,
} from '@/data/portals/merchant'

const nowIso = () => new Date().toISOString()

interface MerchantState {
  storeOpen: boolean
  /** Default preparation time in minutes. */
  prepTime: number
  categories: CatalogCategory[]
  items: CatalogItem[]
  /** Live board + history. Not persisted: rebuilt relative to "now" on load. */
  orders: MerchantOrder[]
  reviews: MerchantReview[]
  promotions: Promotion[]
  shop: ShopInfo
  hours: Record<DayKey, DayHours>
  delivery: DeliverySettings
  notifications: Record<NotificationKey, boolean>
  team: TeamMember[]

  setStoreOpen: (open: boolean) => void
  setPrepTime: (minutes: number) => void

  addOrder: (order: MerchantOrder) => void
  acceptOrder: (id: string, prepMinutes: number) => void
  refuseOrder: (id: string, reason: string) => void
  extendPrep: (id: string, minutes: number) => void
  markReady: (id: string) => void
  markPickedUp: (id: string) => void

  toggleAvailability: (itemId: string) => void
  upsertItem: (item: CatalogItem) => void
  removeItem: (itemId: string) => void
  addCategory: (name: string) => CatalogCategory
  renameCategory: (id: string, name: string) => void

  replyToReview: (id: string, text: string) => void
  toggleHelpful: (id: string) => void

  addPromotion: (p: Promotion) => void
  togglePromotionPause: (id: string) => void
  removePromotion: (id: string) => void

  saveShop: (shop: ShopInfo) => void
  saveHours: (hours: Record<DayKey, DayHours>) => void
  saveDelivery: (d: DeliverySettings) => void
  setNotification: (key: NotificationKey, value: boolean) => void
  addTeamMember: (m: TeamMember) => void
  updateTeamRole: (id: string, role: TeamMember['role']) => void
  removeTeamMember: (id: string) => void
  reset: () => void
}

const COURIERS = ['Karim B.', 'Sofiane M.', 'Mathis L.', 'Ousmane D.', 'Élodie R.', 'Nicolas P.']

function initialData() {
  const { categories, items } = buildInitialCatalog()
  return {
    storeOpen: true,
    prepTime: 20,
    categories,
    items,
    orders: [...buildLiveOrders(), ...buildOrderHistory()],
    reviews: initialReviews,
    promotions: initialPromotions,
    shop: initialShopInfo,
    hours: buildInitialHours(),
    delivery: initialDelivery,
    notifications: initialNotifications,
    team: initialTeam,
  }
}

export const useMerchant = create<MerchantState>()(
  persist(
    (set) => {
      const patchOrder = (id: string, patch: (o: MerchantOrder) => Partial<MerchantOrder>) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch(o) } : o)) }))
      return {
        ...initialData(),

        setStoreOpen: (storeOpen) => set({ storeOpen }),
        setPrepTime: (prepTime) => set({ prepTime }),

        addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
        acceptOrder: (id, prepMinutes) => patchOrder(id, () => ({ status: 'preparing', acceptedAt: nowIso(), prepMinutes })),
        refuseOrder: (id, refusalReason) => patchOrder(id, () => ({ status: 'refused', refusalReason })),
        extendPrep: (id, minutes) => patchOrder(id, (o) => ({ prepMinutes: o.prepMinutes + minutes })),
        markReady: (id) =>
          patchOrder(id, (o) => ({
            status: 'ready',
            readyAt: nowIso(),
            courierName: COURIERS[o.number.charCodeAt(o.number.length - 1) % COURIERS.length],
          })),
        markPickedUp: (id) => patchOrder(id, () => ({ status: 'picked_up', pickedUpAt: nowIso() })),

        toggleAvailability: (itemId) =>
          set((s) => ({ items: s.items.map((i) => (i.id === itemId ? { ...i, available: !i.available } : i)) })),
        upsertItem: (item) =>
          set((s) => ({
            items: s.items.some((i) => i.id === item.id) ? s.items.map((i) => (i.id === item.id ? item : i)) : [...s.items, item],
          })),
        removeItem: (itemId) => set((s) => ({ items: s.items.filter((i) => i.id !== itemId) })),
        addCategory: (name) => {
          const cat = { id: `cat-${Date.now().toString(36)}`, name }
          set((s) => ({ categories: [...s.categories, cat] }))
          return cat
        },
        renameCategory: (id, name) => set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),

        replyToReview: (id, text) =>
          set((s) => ({ reviews: s.reviews.map((r) => (r.id === id ? { ...r, reply: text ? { text, date: nowIso() } : undefined } : r)) })),
        toggleHelpful: (id) =>
          set((s) => ({
            reviews: s.reviews.map((r) =>
              r.id === id ? { ...r, markedHelpful: !r.markedHelpful, helpful: r.helpful + (r.markedHelpful ? -1 : 1) } : r,
            ),
          })),

        addPromotion: (p) => set((s) => ({ promotions: [p, ...s.promotions] })),
        togglePromotionPause: (id) => set((s) => ({ promotions: s.promotions.map((p) => (p.id === id ? { ...p, paused: !p.paused } : p)) })),
        removePromotion: (id) => set((s) => ({ promotions: s.promotions.filter((p) => p.id !== id) })),

        saveShop: (shop) => set({ shop }),
        saveHours: (hours) => set({ hours }),
        saveDelivery: (delivery) => set({ delivery }),
        setNotification: (key, value) => set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
        addTeamMember: (m) => set((s) => ({ team: [...s.team, m] })),
        updateTeamRole: (id, role) => set((s) => ({ team: s.team.map((m) => (m.id === id ? { ...m, role } : m)) })),
        removeTeamMember: (id) => set((s) => ({ team: s.team.filter((m) => m.id !== id) })),
        reset: () => set(initialData()),
      }
    },
    {
      name: 'coledash-merchant',
      version: 1,
      partialize: (s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { orders, ...rest } = s
        return rest
      },
    },
  ),
)

/** Orders currently on the board (not refused/cancelled history). */
export const ACTIVE_STATUSES = ['new', 'preparing', 'ready'] as const
