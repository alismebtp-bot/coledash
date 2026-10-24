import { useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Flower2, Pill, Search as SearchIcon, SearchX, ShoppingBasket, TrendingUp, UtensilsCrossed, X } from 'lucide-react'
import ChipFilter, { type Chip } from '@/components/shared/ChipFilter'
import EmptyState from '@/components/shared/EmptyState'
import SafeImage from '@/components/shared/SafeImage'
import { DishResult, ProductResult, RestaurantResult, StoreResult } from '@/components/restaurant/SearchResultCards'
import { matchesQuery, recommendScore, slugify } from '@/components/restaurant/utils'
import { restaurants, type MenuItem, type Restaurant } from '@/data/restaurants'
import { groceryCategories, products } from '@/data/groceryProducts'
import { getStoresByKind, stores } from '@/data/stores'
import { matchesCity } from '@/data/cities'
import { useCity } from '@/store/city'
import { pluralize } from '@/lib/format'

type Group = 'all' | 'restaurants' | 'plats' | 'produits' | 'commerces'

const POPULAR = ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Bouillabaisse', 'Socca', 'Salade', 'Fromage', 'Bio', 'Bouquet', 'Vin', 'Pharmacie']

const PREVIEW: Record<Exclude<Group, 'all'>, number> = { restaurants: 4, plats: 6, produits: 8, commerces: 4 }

function GroupSection({
  title,
  count,
  shown,
  onMore,
  children,
}: {
  title: string
  count: number
  shown: number
  onMore?: () => void
  children: ReactNode
}) {
  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">
          {title} <span className="ml-1 text-base font-medium text-muted-foreground">{count}</span>
        </h2>
        {onMore && count > shown && (
          <button type="button" onClick={onMore} className="group inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-brand-600">
            Voir les {count}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const { city, cityId } = useCity()
  const [group, setGroup] = useState<Group>('all')

  const setQuery = (value: string) => {
    setGroup('all')
    setParams(value ? { q: value } : {}, { replace: true })
  }

  const cityRestaurants = useMemo(() => restaurants.filter((r) => matchesCity(r.city, cityId)), [cityId])
  const cityStores = useMemo(() => stores.filter((s) => s.cityId === cityId), [cityId])
  const groceryStore = getStoresByKind('grocery', cityId)[0]

  const results = useMemo(() => {
    const query = q.trim()
    if (!query) return null
    const catLabel = (id: string) => groceryCategories.find((c) => c.id === id)?.label
    const rs = cityRestaurants
      .filter((r) => matchesQuery(query, r.name, r.cuisine, r.cuisineType.join(' '), r.description))
      .sort((a, b) => recommendScore(b) - recommendScore(a))
    const dishes: { item: MenuItem; restaurant: Restaurant }[] = []
    for (const r of cityRestaurants) {
      const seen = new Set<string>()
      for (const c of r.menu)
        for (const item of c.items)
          if (!seen.has(item.id) && matchesQuery(query, item.name, item.description, c.name)) {
            seen.add(item.id)
            dishes.push({ item, restaurant: r })
          }
    }
    // Name matches first.
    dishes.sort((a, b) => Number(matchesQuery(query, b.item.name)) - Number(matchesQuery(query, a.item.name)))
    const prods = groceryStore
      ? products
          .filter((p) => matchesQuery(query, p.name, p.brand, p.description, p.subcategory, catLabel(p.category), p.tags?.join(' ')))
          .sort((a, b) => Number(matchesQuery(query, b.name)) - Number(matchesQuery(query, a.name)) || b.rating - a.rating)
      : []
    const sts = cityStores.filter((s) => matchesQuery(query, s.name, s.tagline, s.category))
    return { rs, dishes, prods, sts, total: rs.length + dishes.length + prods.length + sts.length }
  }, [q, cityRestaurants, cityStores, groceryStore])

  const cuisines = useMemo(() => {
    const map = new Map<string, { label: string; image: string; count: number }>()
    for (const r of cityRestaurants) {
      const id = slugify(r.cuisine)
      const e = map.get(id) ?? { label: r.cuisine, image: r.image, count: 0 }
      e.count += 1
      map.set(id, e)
    }
    return [...map.entries()].map(([id, v]) => ({ id, ...v }))
  }, [cityRestaurants])

  const chips: Chip[] = results
    ? [
        { id: 'all', label: 'Tout', count: results.total },
        { id: 'restaurants', label: 'Restaurants', count: results.rs.length },
        { id: 'plats', label: 'Plats', count: results.dishes.length },
        { id: 'produits', label: 'Courses', count: results.prods.length },
        { id: 'commerces', label: 'Commerces', count: results.sts.length },
      ].filter((c) => c.id === 'all' || c.count > 0)
    : []

  const limit = (g: Exclude<Group, 'all'>, n: number) => (group === 'all' ? Math.min(n, PREVIEW[g]) : n)
  const show = (g: Exclude<Group, 'all'>) => group === 'all' || group === g
  const productHref = groceryStore ? `/courses/${groceryStore.id}` : '/courses'

  return (
    <div className="container max-w-5xl py-8 pb-24 md:pb-16">
      <h1 className="sr-only">Rechercher</h1>
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Rechercher un restaurant, un plat, un produit ou un commerce
        </label>
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="search-input"
          type="search"
          autoFocus
          autoComplete="off"
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Restaurants, plats, courses à ${city.name}…`}
          className="h-14 w-full rounded-full border bg-card pl-14 pr-14 text-base shadow-soft outline-none transition placeholder:text-muted-foreground focus:border-ink/30 focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!results ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-10 space-y-12">
          <section aria-labelledby="popular-title">
            <h2 id="popular-title" className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
              <TrendingUp className="h-5 w-5 text-brand-600" aria-hidden />
              Recherches populaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-card px-4 text-sm font-medium text-ink transition hover:border-ink/40 hover:shadow-soft"
                >
                  <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  {term}
                </button>
              ))}
            </div>
          </section>

          {cuisines.length > 0 && (
            <section aria-labelledby="cuisines-title">
              <h2 id="cuisines-title" className="mb-4 text-lg font-bold text-ink">
                Cuisines à {city.name}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cuisines.map((c) => (
                  <Link
                    key={c.id}
                    to={`/restaurants?cuisine=${c.id}`}
                    className="group relative overflow-hidden rounded-2xl shadow-soft transition hover:shadow-lift"
                  >
                    <SafeImage src={c.image} alt="" wrapperClassName="aspect-[4/3]" className="transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="font-display text-lg font-bold leading-tight">{c.label}</p>
                      <p className="text-xs text-white/75">{pluralize(c.count, 'restaurant')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section aria-labelledby="explore-title">
            <h2 id="explore-title" className="mb-4 text-lg font-bold text-ink">
              Explorer
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed },
                { to: '/courses', label: 'Courses', icon: ShoppingBasket },
                { to: '/fleurs', label: 'Fleurs', icon: Flower2 },
                { to: '/boutiques', label: 'Boutiques', icon: Pill },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft transition hover:shadow-lift">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <l.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="flex-1 font-semibold text-ink">{l.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                </Link>
              ))}
            </div>
          </section>
        </motion.div>
      ) : results.total === 0 ? (
        <EmptyState
          className="mt-10"
          icon={SearchX}
          title={`Aucun résultat pour « ${q.trim()} »`}
          description={`Vérifiez l'orthographe ou essayez un terme plus général. Nous cherchons parmi les commerces qui livrent à ${city.name}.`}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR.slice(0, 5).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium text-ink hover:border-ink/40"
                >
                  {term}
                </button>
              ))}
            </div>
          }
        />
      ) : (
        <div className="mt-6">
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            {pluralize(results.total, 'résultat')} pour « <span className="font-semibold text-ink">{q.trim()}</span> » à {city.name}
          </p>
          <ChipFilter chips={chips} value={group} onChange={(id) => setGroup(id as Group)} label="Type de résultat" />

          <div className="mt-8 space-y-10">
            {show('restaurants') && results.rs.length > 0 && (
              <GroupSection title="Restaurants" count={results.rs.length} shown={limit('restaurants', results.rs.length)} onMore={group === 'all' ? () => setGroup('restaurants') : undefined}>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.rs.slice(0, limit('restaurants', results.rs.length)).map((r) => (
                    <RestaurantResult key={r.id} restaurant={r} query={q} />
                  ))}
                </div>
              </GroupSection>
            )}

            {show('plats') && results.dishes.length > 0 && (
              <GroupSection title="Plats" count={results.dishes.length} shown={limit('plats', results.dishes.length)} onMore={group === 'all' ? () => setGroup('plats') : undefined}>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.dishes.slice(0, limit('plats', results.dishes.length)).map(({ item, restaurant }) => (
                    <DishResult key={`${restaurant.id}-${item.id}`} item={item} restaurant={restaurant} query={q} />
                  ))}
                </div>
              </GroupSection>
            )}

            {show('produits') && results.prods.length > 0 && (
              <GroupSection title="Courses" count={results.prods.length} shown={limit('produits', results.prods.length)} onMore={group === 'all' ? () => setGroup('produits') : undefined}>
                {groceryStore && (
                  <p className="-mt-2 text-sm text-muted-foreground">
                    Livré par <Link to={productHref} className="font-semibold text-ink hover:text-brand-600">{groceryStore.name}</Link> en {groceryStore.deliveryTime}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {results.prods.slice(0, limit('produits', results.prods.length)).map((p) => (
                    <ProductResult key={p.id} product={p} href={productHref} query={q} />
                  ))}
                </div>
              </GroupSection>
            )}

            {show('commerces') && results.sts.length > 0 && (
              <GroupSection title="Commerces" count={results.sts.length} shown={limit('commerces', results.sts.length)} onMore={group === 'all' ? () => setGroup('commerces') : undefined}>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.sts.slice(0, limit('commerces', results.sts.length)).map((s) => (
                    <StoreResult key={s.id} store={s} query={q} />
                  ))}
                </div>
              </GroupSection>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
