import { Info, MapPin, Package, Wine } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import SafeImage from '@/components/shared/SafeImage'
import QuantityStepper from '@/components/shared/QuantityStepper'
import { formatPrice } from '@/lib/format'
import type { Store } from '@/data/stores'
import type { CatalogItem } from './catalog'
import { ItemBadge } from './StoreProductTile'
import { useStoreItemCart } from './useStoreItemCart'

interface Props {
  store: Store
  item: CatalogItem | null
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailDialog({ store, item, onOpenChange }: Props) {
  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl gap-0 overflow-y-auto rounded-2xl p-0 sm:rounded-2xl">
        {item && <Body store={store} item={item} />}
      </DialogContent>
    </Dialog>
  )
}

function Body({ store, item }: { store: Store; item: CatalogItem }) {
  const { quantity, add, change } = useStoreItemCart(store, item)
  const facts = [
    item.meta && { icon: Package, label: 'Format', value: item.meta },
    item.origin && { icon: MapPin, label: 'Origine', value: item.origin },
  ].filter(Boolean) as { icon: typeof Info; label: string; value: string }[]

  return (
    <div className="grid sm:grid-cols-[1fr_1.1fr]">
      <div className="relative">
        <SafeImage src={item.image} alt={item.name} wrapperClassName="aspect-square sm:h-full sm:aspect-auto sm:min-h-[420px]" />
        {item.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex gap-1">
            {item.badges.map((b) => (
              <ItemBadge key={b} label={b} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col p-6">
        {item.brand && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.brand}</p>}
        <DialogTitle className="mt-1 pr-6 text-2xl font-bold leading-tight text-ink">{item.name}</DialogTitle>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={item.originalPrice ? 'text-xl font-bold text-brand-600' : 'text-xl font-bold text-ink'}>{formatPrice(item.price)}</span>
          {item.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>}
        </div>
        <DialogDescription className="mt-4 text-sm leading-relaxed text-ink/80">{item.description}</DialogDescription>

        {facts.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl bg-secondary/60 p-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <f.icon className="h-3.5 w-3.5" aria-hidden />
                  {f.label}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {item.nutrition && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-ink">Valeurs nutritionnelles <span className="font-normal text-muted-foreground">pour 100 g</span></h3>
            <dl className="mt-2 grid grid-cols-4 overflow-hidden rounded-xl border text-center">
              {[
                ['Énergie', `${item.nutrition.calories} kcal`],
                ['Protéines', `${item.nutrition.protein} g`],
                ['Glucides', `${item.nutrition.carbs} g`],
                ['Lipides', `${item.nutrition.fat} g`],
              ].map(([k, v]) => (
                <div key={k} className="border-r p-2 last:border-r-0">
                  <dt className="text-[11px] text-muted-foreground">{k}</dt>
                  <dd className="text-sm font-semibold tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {item.allergens && item.allergens.length > 0 && (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
            <span className="font-semibold">Allergènes : </span>
            {item.allergens.join(', ')}
          </p>
        )}

        {item.isAlcohol && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs text-ink/80">
            <Wine className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Vente d’alcool interdite aux mineurs. Une pièce d’identité pourra être demandée à la livraison. L’abus d’alcool est dangereux pour la santé, à consommer avec modération.
          </p>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Caractéristiques">
            {item.tags.map((t) => (
              <li key={t} className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <p className="text-sm text-muted-foreground">Vendu par {store.name}</p>
          {quantity > 0 ? (
            <QuantityStepper value={quantity} onChange={change} label={`Quantité de ${item.name}`} />
          ) : (
            <Button variant="ink" size="lg" onClick={() => add()} disabled={!item.inStock}>
              {item.inStock ? `Ajouter · ${formatPrice(item.price)}` : 'En rupture'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
