import { create } from 'zustand'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
}

export interface MerchantStore {
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  removeMenuItem: (id: string) => void
  toggleAvailability: (id: string) => void
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  menuItems: [
    {
      id: 'item-1',
      name: 'Margherita Pizza',
      description: 'Classic tomato and mozzarella',
      price: 12.99,
      category: 'Pizza',
      available: true,
    },
    {
      id: 'item-2',
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni with mozzarella',
      price: 14.99,
      category: 'Pizza',
      available: true,
    },
  ],

  addMenuItem: (item) =>
    set((state) => ({
      menuItems: [...state.menuItems, { ...item, id: `item-${Date.now()}` }],
    })),

  updateMenuItem: (id, updates) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeMenuItem: (id) =>
    set((state) => ({
      menuItems: state.menuItems.filter((item) => item.id !== id),
    })),

  toggleAvailability: (id) =>
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      ),
    })),
}))
