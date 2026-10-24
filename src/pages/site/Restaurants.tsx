import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, SearchX, Store, UtensilsCrossed } from 'lucide-react'
import VendorCard from '@/components/shared/VendorCard'
import EmptyState from '@/components/shared/EmptyState'
import SafeImage from '@/components/shared/SafeImage'
import type { Chip } from '@/components/shared/ChipFilter'
import { Button } from '@/components/ui/button'
import CityPicker, { CityPickerDialog } from '@/components/site/CityPicker'
import RestaurantFilters from '@/components/restaurant/RestaurantFilters'
import {
  allItems,
  hasVeggie,
  isOpenNow,
  LOW_FEE_THRESHOLD,
  matchesQuery,
  minDeliveryMinutes,
  recommendScore,
  restaurantToCard,
  slugify,
  SORT_OPTIONS,
  type SortKey,
  type ToggleState,
} from '@/components/restaurant/utils'
import { restaurants } from '@/data/restaurants'
import { matchesCity } from '@/data/cities'
import { useCity } from '@/store/city'
import { pluralize } from '@/lib/format'

const TOGGLE_PARAMS: Record<keyof ToggleState, string> = {
  open: 'ouvert',
  promo: 'promo',
  lowFee: 'livraison',
  veggie: 'vege',
}

export default function Restaurants() {
  const { city, cityId } = useCity()
  const [params, setParams] = useSearchParams()
  const [pickerOpen, setPickerOpen] = useState(false)

  const cuisine = slugify(params.get('cuisine') ?? '') || 'all'
  const sortParam = params.get('tri') as SortKey | null
  const sort: SortKey = SORT_OPTIONS.some((o) => o.id === sortParam) ? (sortParam as SortKey) : 'recommandes'
  const query = params.get('q') ?? ''
  const toggles: ToggleState = useMemo(
    () => ({
      open: params.get(TOGGLE_PARAMS.open) === '1',
      promo: params.get(TOGGLE_PARAMS.promo) === '1',
      lowFee: params.get(TOGGLE_PARAMS.lowFee) === '1',
      veggie: params.get(TOGGLE_PARAMS.veggie) === '1',
    }),
    [params],
  )

  const update = (key: string, value: string | null) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const cityRestaurants = useMemo(() => restaurants.filter((r) => matchesCity(r.city, cityId)), [cityId])
  const now = useMemo(() => new Date(), [])

  const cuisineChips: Chip[] = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>()
    for (const r of cityRestaurants) {
      for (const c of new Set([r.cuisine, ...r.cuisineType])) {
        const id = slugify(c)
        const entry = counts.get(id) ?? { label: c, count: 0 }
        entry.count += 1
        counts.set(id, entry)
      }
    }
    const list = [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label, 'fr'))
      .map(([id, v]) => ({ id, label: v.label, count: v.count }))
    return [{ id: 'all', label: 'Toutes les cuisines', icon: UtensilsCrossed }, ...list]
  }, [cityRestaurants])

  const showVeggie = cityRestaurants.some(hasVeggie)

  const results = useMemo(() => {
    const filtered = cityRestaurants.filter((r) => {
      if (cuisine !== 'all' && ![r.cuisine, ...r.cuisineType].some((c) => slugify(c) === cuisine)) return false
      if (toggles.open && !isOpenNow(r, now)) return false
      if (toggles.promo && !r.isPromo) return false
      if (toggles.lowFee && r.deliveryFee >= LOW_FEE_THRESHOLD) return false
      if (toggles.veggie && !hasVeggie(r)) return false
      if (
        query.trim() &&
        !matchesQuery(query, r.name, r.cuisine, r.cuisineType.join(' '), r.description, allItems(r).map((i) => i.name).join(' '))
      )
        return false
      return true
    })
    const sorted = [...filtered]
    switch (sort) {
      case 'note':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        break
      case 'temps':
        sorted.sort((a, b) => minDeliveryMinutes(a.deliveryTime) - minDeliveryMinutes(b.deliveryTime))
        break
      case 'frais':
        sorted.sort((a, b) => a.deliveryFee - b.deliveryFee)
        break
      default:
        sorted.sort((a, b) => Number(isOpenNow(b, now)) - Number(isOpenNow(a, now)) || recommendScore(b) - recommendScore(a))
    }
    return sorted
  }, [cityRestaurants, cuisine, sort, query, toggles, now])

  const hasFilters = cuisine !== 'all' || query.trim() !== '' || Object.values(toggles).some(Boolean)
  const openCount = cityRestaurants.filter((r) => isOpenNow(r, now)).length
  const resetFilters = () => setParams(sort !== 'recommandes' ? { tri: sort } : {}, { replace: true })
  const activeCuisine = cuisineChips.find((c) => c.id === cuisine)

  return (
    <div className="pb-24 md:pb-12">
      {/* Hero strip */}
      <section className="relative overflow-hidden bg-ink text-white">
        <SafeImage src={city.image} alt="" wrapperClassName="absolute inset-0 bg-ink" className="opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" aria-hidden />
        <div className="container relative py-10 sm:py-14">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {city.region}
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">Restaurants à {city.name}</h1>
            <p className="mt-2 max-w-xl text-white/75">
              {cityRestaurants.length > 0
                ? `${pluralize(cityRestaurants.length, 'restaurant')} livrent chez vous, dont ${openCount} ouvert${openCount > 1 ? 's' : ''} en ce moment.`
                : city.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CityPicker tone="light" />
              {activeCuisine && activeCuisine.id !== 'all' && (
                <span className="rounded-full bg-white/10 px-3 py-2 text-sm font-medium">Cuisine {activeCuisine.label.toLowerCase()}</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container py-8">
        {cityRestaurants.length === 0 ? (
          <EmptyState
            icon={Store}
            title={`Pas encore de restaurants à ${city.name}`}
            description="Nous arrivons bientôt dans votre ville. En attendant, découvrez nos partenaires à Paris, Lyon, Marseille ou Nice."
            action={
              <Button variant="ink" onClick={() => setPickerOpen(true)}>
                <MapPin /> Changer de ville
              </Button>
            }
          />
        ) : (
          <>
            <RestaurantFilters
              query={query}
              onQueryChange={(q) => update('q', q)}
              cuisineChips={cuisineChips}
              cuisine={cuisine}
              onCuisineChange={(id) => update('cuisine', id === 'all' ? null : id)}
              sort={sort}
              onSortChange={(s) => update('tri', s === 'recommandes' ? null : s)}
              toggles={toggles}
              onToggle={(key) => update(TOGGLE_PARAMS[key], toggles[key] ? null : '1')}
              showVeggie={showVeggie}
            />

            <div className="mb-5 mt-8 flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">
                {hasFilters ? pluralize(results.length, 'résultat') : 'Tous les restaurants'}
              </h2>
              {hasFilters && (
                <button type="button" onClick={resetFilters} className="text-sm font-semibold text-brand-600 hover:underline">
                  Effacer les filtres
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Aucun restaurant ne correspond"
                description={`Essayez d'élargir votre recherche ou de retirer un filtre. Les restaurants affichés livrent à ${city.name}.`}
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="ink" onClick={resetFilters}>
                      Effacer les filtres
                    </Button>
                    <Button variant="outline" onClick={() => setPickerOpen(true)}>
                      <MapPin /> Changer de ville
                    </Button>
                  </div>
                }
              />
            ) : (
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <VendorCard vendor={restaurantToCard(r, now)} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <CityPickerDialog open={pickerOpen} onOpenChange={setPickerOpen} />
    </div>
  )
}
