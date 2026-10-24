import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CITY_ID, getCityById } from '@/data/cities'

interface CityState {
  cityId: string
  setCity: (id: string) => void
}

export const useCityStore = create<CityState>()(
  persist((set) => ({ cityId: DEFAULT_CITY_ID, setCity: (cityId) => set({ cityId }) }), { name: 'coledash-city' }),
)

export function useCity() {
  const cityId = useCityStore((s) => s.cityId)
  const setCity = useCityStore((s) => s.setCity)
  return { city: getCityById(cityId), cityId, setCity }
}
