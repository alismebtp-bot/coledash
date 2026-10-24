import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Address, User } from '@/types'

interface AuthState {
  user: User | null
  addresses: Address[]
  defaultAddressId: string | null
  /** Demo auth: any e-mail + password (6+ chars) signs in. */
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  signup: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    | { ok: true }
    | { ok: false; error: string }
  logout: () => void
  updateProfile: (patch: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>>) => void
  addPoints: (points: number) => void
  saveAddress: (address: Omit<Address, 'id'> & { id?: string }) => Address
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const DEMO_ADDRESS: Address = {
  id: 'addr-home',
  label: 'Maison',
  line1: '12 rue des Martyrs',
  postalCode: '75009',
  city: 'Paris',
  instructions: 'Code 4B21, 3e étage gauche',
}

function nameFromEmail(email: string): { firstName: string; lastName: string } {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  const [first = 'Client', ...rest] = local.split(' ')
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return { firstName: cap(first), lastName: rest.map(cap).join(' ') }
}

function makeUser(data: Omit<User, 'id' | 'role' | 'loyaltyPoints' | 'createdAt'>): User {
  return {
    ...data,
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    role: 'customer',
    loyaltyPoints: 120,
    createdAt: new Date().toISOString(),
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      defaultAddressId: null,
      login: (email, password) => {
        if (!EMAIL_RE.test(email)) return { ok: false, error: 'Adresse e-mail invalide.' }
        if (password.length < 6) return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
        const current = get().user
        if (current && current.email === email) return { ok: true }
        set({
          user: makeUser({ ...nameFromEmail(email), email, phone: '' }),
          addresses: get().addresses.length ? get().addresses : [DEMO_ADDRESS],
          defaultAddressId: get().defaultAddressId ?? DEMO_ADDRESS.id,
        })
        return { ok: true }
      },
      signup: ({ password, ...data }) => {
        if (!data.firstName.trim()) return { ok: false, error: 'Indiquez votre prénom.' }
        if (!EMAIL_RE.test(data.email)) return { ok: false, error: 'Adresse e-mail invalide.' }
        if (password.length < 6) return { ok: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
        set({ user: makeUser(data) })
        return { ok: true }
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      addPoints: (points) =>
        set((s) => (s.user ? { user: { ...s.user, loyaltyPoints: s.user.loyaltyPoints + points } } : s)),
      saveAddress: (input) => {
        const address: Address = { ...input, id: input.id ?? `addr-${Date.now().toString(36)}` }
        set((s) => {
          const exists = s.addresses.some((a) => a.id === address.id)
          const addresses = exists ? s.addresses.map((a) => (a.id === address.id ? address : a)) : [...s.addresses, address]
          return { addresses, defaultAddressId: s.defaultAddressId ?? address.id }
        })
        return address
      },
      removeAddress: (id) =>
        set((s) => {
          const addresses = s.addresses.filter((a) => a.id !== id)
          return {
            addresses,
            defaultAddressId: s.defaultAddressId === id ? (addresses[0]?.id ?? null) : s.defaultAddressId,
          }
        }),
      setDefaultAddress: (id) => set({ defaultAddressId: id }),
    }),
    { name: 'coledash-auth' },
  ),
)

export function useDefaultAddress(): Address | null {
  return useAuth((s) => s.addresses.find((a) => a.id === s.defaultAddressId) ?? s.addresses[0] ?? null)
}
