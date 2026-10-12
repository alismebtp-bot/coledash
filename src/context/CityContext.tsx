import React, { createContext, useContext, useState } from "react";

interface City {
  id: string;
  name: string;
  region: string;
}

interface CityContextType {
  city: City | null;
  setCity: (city: City | null) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const defaultCity: City = {
  id: "paris",
  name: "Paris",
  region: "Île-de-France",
};

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<City | null>(defaultCity);

  return (
    <CityContext.Provider value={{ city, setCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
