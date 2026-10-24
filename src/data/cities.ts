export interface City {
  id: string
  name: string
  region: string
  image: string
  tagline: string
  available: boolean
}

export const cities: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    region: 'Île-de-France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
    tagline: 'Bistrots, sushis et fleuristes de quartier',
    available: true,
  },
  {
    id: 'lyon',
    name: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    image: 'https://images.unsplash.com/photo-1524397057410-1e775ed476f3?w=800&h=600&fit=crop',
    tagline: 'La capitale de la gastronomie',
    available: true,
  },
  {
    id: 'marseille',
    name: 'Marseille',
    region: "Provence-Alpes-Côte d'Azur",
    image: 'https://images.unsplash.com/photo-1566838217578-1903568a76d9?w=800&h=600&fit=crop',
    tagline: 'Bouillabaisse et street-food du Vieux-Port',
    available: true,
  },
  {
    id: 'nice',
    name: 'Nice',
    region: "Provence-Alpes-Côte d'Azur",
    image: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&h=600&fit=crop',
    tagline: 'Socca, pan bagnat et cuisine niçoise',
    available: true,
  },
  {
    id: 'bordeaux',
    name: 'Bordeaux',
    region: 'Nouvelle-Aquitaine',
    image: 'https://images.unsplash.com/photo-1559564484-e48b3e040ff4?w=800&h=600&fit=crop',
    tagline: 'Bientôt disponible',
    available: false,
  },
  {
    id: 'lille',
    name: 'Lille',
    region: 'Hauts-de-France',
    image: 'https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?w=800&h=600&fit=crop',
    tagline: 'Bientôt disponible',
    available: false,
  },
]

export const DEFAULT_CITY_ID = 'paris'

export function getCityById(id: string): City {
  return cities.find((c) => c.id === id) ?? cities[0]
}

/** Restaurants store their city as a display name ("Paris"); match on it. */
export function matchesCity(cityName: string, cityId: string): boolean {
  return cityName.toLowerCase() === getCityById(cityId).name.toLowerCase()
}
