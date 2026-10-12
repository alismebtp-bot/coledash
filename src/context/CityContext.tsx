import { createContext, useContext, useState, ReactNode } from 'react'

export interface City {
  id: string
  name: string
  country: string
}

const cities: City[] = [
  { id: 'paris', name: 'Paris', country: 'France' },
  { id: 'london', name: 'London', country: 'UK' },
  { id: 'berlin', name: 'Berlin', country: 'Germany' },
  { id: 'madrid', name: 'Madrid', country: 'Spain' },
  { id: 'rome', name: 'Rome', country: 'Italy' },
]

interface CityContextType {
  currentCity: City
  setCurrentCity: (city: City) => void
  cities: City[]
}

const CityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({ children }: { children: ReactNode }) {
  const [currentCity, setCurrentCity] = useState<City>(cities[0])

  return (
    <CityContext.Provider value={{ currentCity, setCurrentCity, cities }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (!context) throw new Error('useCity must be used within CityProvider')
  return context
}

export { cities }
