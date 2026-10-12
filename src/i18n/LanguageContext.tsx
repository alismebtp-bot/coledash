import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'en' | 'fr' | 'de' | 'es' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.restaurants': 'Restaurants',
    'nav.grocery': 'Grocery',
    'nav.flowers': 'Flowers',
    'nav.retail': 'Retail',
    'cart.title': 'Cart',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.restaurants': 'Restaurants',
    'nav.grocery': 'Épicerie',
    'nav.flowers': 'Fleurs',
    'nav.retail': 'Commerce',
    'cart.title': 'Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.checkout': 'Commander',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.restaurants': 'Restaurants',
    'nav.grocery': 'Lebensmittel',
    'nav.flowers': 'Blumen',
    'nav.retail': 'Einzelhandel',
    'cart.title': 'Warenkorb',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.checkout': 'Zur Kasse',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.restaurants': 'Restaurantes',
    'nav.grocery': 'Supermercado',
    'nav.flowers': 'Flores',
    'nav.retail': 'Retail',
    'cart.title': 'Carrito',
    'cart.empty': 'Tu carrito está vacío',
    'cart.checkout': 'Pagar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
  },
  it: {
    'nav.home': 'Home',
    'nav.restaurants': 'Ristoranti',
    'nav.grocery': 'Spesa',
    'nav.flowers': 'Fiori',
    'nav.retail': 'Retail',
    'cart.title': 'Carrello',
    'cart.empty': 'Il tuo carrello è vuoto',
    'cart.checkout': 'Checkout',
    'common.search': 'Cerca',
    'common.filter': 'Filtra',
    'common.sort': 'Ordina',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
