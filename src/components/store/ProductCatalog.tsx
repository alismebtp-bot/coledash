import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageSearch, Wine } from 'lucide-react'
import ChipFilter from '@/components/shared/ChipFilter'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { groceryCategories, products as groceryProducts } from '@/data/groceryProducts'
import { getRetailProducts } from '@/data/retailProducts'
import type { Store } from '@/data/stores'
import { pluralize } from '@/lib/format'
import { fromGrocery, fromRetail, matchesQuery, type CatalogItem } from './catalog'
import StoreProductTile from './StoreProductTile'
import ProductDetailDialog from './ProductDetailDialog'
import StoreSearch from './StoreSearch'

function catalogFor(store: Store): { items: CatalogItem[]; rayons: { id: string; label: string }[] } {
  if (store.kind === 'grocery') {
    const labels = new Map(groceryCategories.map((c) => [c.id, c.label]))
    const items = groceryProducts.map((p) => fromGrocery(p, labels.get(p.category)))
    const rayons = groceryCategories.filter((c) => c.id !== 'all' && items.some((i) => i.rayon === c.id)).map(({ id, label }) => ({ id, label }))
    return { items, rayons }
  }
  const items = getRetailProducts(store.category).map(fromRetail)
  const rayons = [...new Set(items.map((i) => i.rayon))].map((r) => ({ id: r, label: r }))
  return { items, rayons }
}

/** Searchable, rayon-filtered product grid of a grocery or retail store. */
export default function ProductCatalog({ store }: { store: Store }) {
  const { items, rayons } = useMemo(() => catalogFor(store), [store])
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<CatalogItem | null>(null)
  const requested = params.get('rayon') ?? 'all'
  const rayon = rayons.some((r) => r.id === requested) ? requested : 'all'

  const setRayon = (id: string) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('rayon')
    else next.set('rayon', id)
    setParams(next, { replace: true })
  }

  const filtered = items.filter((i) => (rayon === 'all' || i.rayon === rayon) && matchesQuery(i, query.trim()))
  const chips = [
    { id: 'all', label: 'Tout', count: items.length },
    ...rayons.map((r) => ({ ...r, count: items.filter((i) => i.rayon === r.id).length })),
  ]
  const grouped = rayon === 'all' && !query.trim()
  const hasAlcohol = items.some((i) => i.isAlcohol)

  const grid = (list: CatalogItem[]) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {list.map((item) => (
        <StoreProductTile key={item.id} store={store} item={item} onOpen={setOpen} />
      ))}
    </div>
  )

  return (
    <div className="container pt-6">
      {hasAlcohol && (
        <p className="mb-5 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="note">
          <Wine className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong className="font-semibold">Vente d’alcool interdite aux mineurs.</strong> Une pièce d’identité pourra vous être demandée à la livraison. L’abus d’alcool est dangereux pour la santé.
          </span>
        </p>
      )}

      <div className="sticky top-16 z-20 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-b-2xl sm:px-0">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <StoreSearch id={`search-${store.id}`} value={query} onChange={setQuery} placeholder={`Rechercher chez ${store.name}`} />
          <ChipFilter chips={chips} value={rayon} onChange={setRayon} label={store.kind === 'grocery' ? 'Rayons' : 'Catégories'} className="min-w-0 md:flex-1" />
        </div>
      </div>

      <div className="pt-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Aucun produit ne correspond"
            description={query ? `Rien pour « ${query} » dans ce rayon.` : 'Ce rayon est vide pour le moment.'}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setRayon('all')
                }}
              >
                Voir tous les produits
              </Button>
            }
          />
        ) : grouped ? (
          <div className="space-y-10">
            {rayons.map((r) => {
              const list = items.filter((i) => i.rayon === r.id)
              return (
                <section key={r.id} aria-labelledby={`rayon-${r.id}`}>
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h2 id={`rayon-${r.id}`} className="text-xl font-bold text-ink">
                      {r.label}
                    </h2>
                    <button type="button" onClick={() => setRayon(r.id)} className="text-sm font-semibold text-ink hover:text-brand-600">
                      {pluralize(list.length, 'produit')}
                    </button>
                  </div>
                  {grid(list.slice(0, 10))}
                </section>
              )
            })}
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
              {pluralize(filtered.length, 'produit')}
            </p>
            {grid(filtered)}
          </>
        )}
      </div>

      <ProductDetailDialog store={store} item={open} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  )
}
