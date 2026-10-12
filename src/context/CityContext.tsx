import { createContext, useContext, useState, ReactNode } from 'react'

interface CityContextType {
  selectedCity: string
  setSelectedCity: (city: string) => void
}

const CityContext = createContext<CityContextType>({
  selectedCity: 'Paris',
  setSelectedCity: () => {},
})

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState('Paris')

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  return useContext(CityContext)
}
