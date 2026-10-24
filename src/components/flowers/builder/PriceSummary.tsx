import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import { MIN_STEMS, pricing, type Composition } from '../composer'

interface Props {
  composition: Composition
  floristName?: string
  canOrder: boolean
  onAdd: () => void
  onReset: () => void
}

export default function PriceSummary({ composition, floristName, canOrder, onAdd, onReset }: Props) {
  const { lines, wrap, vase, fee, total, count } = pricing(composition)
  const missing = Math.max(0, MIN_STEMS - count)

  return (
    <section aria-labelledby="bq-summary" className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="bq-summary" className="font-serif text-xl font-semibold text-ink">
          Votre composition
        </h2>
        {count > 0 && (
          <button type="button" onClick={onReset} className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-ink hover:underline">
            Tout effacer
          </button>
        )}
      </div>
      {lines.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Aucune fleur pour l’instant.</p>
      ) : (
        <dl className="mt-3 space-y-1.5 text-sm">
          {lines.map((l) => (
            <div key={l.id} className="flex justify-between gap-3">
              <dt className="text-ink/80">
                {l.count} × {l.label} <span className="text-xs text-muted-foreground">({formatPrice(l.unit)})</span>
              </dt>
              <dd className="tabular-nums text-ink">{formatPrice(l.total)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-3 border-t pt-1.5">
            <dt className="text-ink/80">Emballage · {wrap.name}</dt>
            <dd className="tabular-nums text-ink">{formatPrice(wrap.price)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink/80">{vase.id === 'none' ? 'Sans vase' : `Vase · ${vase.name}`}</dt>
            <dd className="tabular-nums text-ink">{formatPrice(vase.price)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink/80">Composition par le fleuriste</dt>
            <dd className="tabular-nums text-ink">{formatPrice(fee)}</dd>
          </div>
        </dl>
      )}
      <div className="mt-4 flex items-baseline justify-between border-t pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="text-2xl font-bold tabular-nums text-ink">{formatPrice(total)}</span>
      </div>
      <Button variant="ink" size="lg" className="mt-4 w-full" disabled={!canOrder || missing > 0} onClick={onAdd}>
        <ShoppingBag aria-hidden />
        {missing > 0 ? `Encore ${missing} tige${missing > 1 ? 's' : ''} minimum` : 'Ajouter au panier'}
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {floristName ? `Composé et livré par ${floristName}` : 'Aucun fleuriste partenaire dans votre ville pour le moment'}
      </p>
    </section>
  )
}
