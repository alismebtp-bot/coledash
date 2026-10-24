import { useState } from 'react'
import { Flower2 } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import StoreSearch from '@/components/store/StoreSearch'
import { normalize } from '@/components/store/catalog'
import { bouquets, occasions, type Bouquet, type OccasionId } from '@/data/bouquets'
import type { Store } from '@/data/stores'
import { cn } from '@/lib/utils'
import BouquetTile from './BouquetTile'
import BouquetDialog from './BouquetDialog'
import AtelierCta from './AtelierCta'

function matches(b: Bouquet, q: string) {
  if (!q) return true
  const hay = normalize([b.name, b.tagline, b.description, ...b.flowers].join(' '))
  return normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}

/** Florist page body: signature bouquets, the rest of the collection and the atelier. */
export default function FloristCatalog({ store }: { store: Store }) {
  const [occasion, setOccasion] = useState<OccasionId | 'all'>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Bouquet | null>(null)

  const list = bouquets.filter((b) => (occasion === 'all' || b.occasions.includes(occasion)) && matches(b, query.trim()))
  const signature = list.filter((b) => b.storeId === store.id)
  const others = list.filter((b) => b.storeId !== store.id)

  const grid = (items: Bouquet[]) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
      {items.map((b, i) => (
        <BouquetTile key={b.id} bouquet={b} onOpen={setOpen} index={i} />
      ))}
    </div>
  )

  return (
    <div className="bg-[#fbf6f2]">
      <div className="container pt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <StoreSearch id={`search-${store.id}`} value={query} onChange={setQuery} placeholder="Une fleur, une couleur…" />
          <div className="-mx-4 min-w-0 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0 md:flex-1">
            <div className="flex w-max gap-2" role="radiogroup" aria-label="Occasion">
              {[{ id: 'all' as const, label: 'Toutes' }, ...occasions].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={occasion === o.id}
                  onClick={() => setOccasion(o.id)}
                  className={cn(
                    'h-10 whitespace-nowrap rounded-full border px-4 font-serif text-[15px] transition-colors',
                    occasion === o.id ? 'border-[#3f2a2e] bg-[#3f2a2e] text-white' : 'border-[#e8d6cf] bg-white text-ink hover:border-[#3f2a2e]/50',
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <EmptyState
            className="mt-8"
            icon={Flower2}
            title="Aucun bouquet ne correspond"
            description="Essayez une autre occasion, ou composez le vôtre dans l’atelier."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setOccasion('all')
                }}
              >
                Voir toute la collection
              </Button>
            }
          />
        ) : (
          <div className="space-y-14 pt-10">
            {signature.length > 0 && (
              <section aria-labelledby="signature-title">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Créations signature</p>
                <h2 id="signature-title" className="mb-6 mt-1 font-serif text-3xl font-semibold text-ink">
                  Imaginés par {store.name}
                </h2>
                {grid(signature)}
              </section>
            )}
            {others.length > 0 && (
              <section aria-labelledby="collection-title">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">La collection ColeDash</p>
                <h2 id="collection-title" className="mb-6 mt-1 font-serif text-3xl font-semibold text-ink">
                  Également composés ici
                </h2>
                {grid(others)}
              </section>
            )}
          </div>
        )}

        <AtelierCta compact className="mt-14" />
      </div>

      <BouquetDialog bouquet={open} cityId={store.cityId} florist={store} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  )
}
