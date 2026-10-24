import { formatPrice } from '@/lib/format'
import type { Totals } from '@/lib/pricing'
import { cn } from '@/lib/utils'

interface Props {
  totals: Totals
  promoCode?: string
  showTip?: boolean
  className?: string
}

function Row({ label, value, accent, hint }: { label: string; value: string; accent?: boolean; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-muted-foreground">
        {label}
        {hint && <span className="ml-1 text-xs">({hint})</span>}
      </dt>
      <dd className={cn('tabular-nums font-medium', accent ? 'text-emerald-700' : 'text-ink')}>{value}</dd>
    </div>
  )
}

export default function TotalsList({ totals, promoCode, showTip, className }: Props) {
  return (
    <div className={className}>
      <dl className="space-y-2">
        <Row label="Sous-total" value={formatPrice(totals.subtotal)} />
        <Row
          label="Livraison"
          value={totals.deliveryFee === 0 ? 'Offerte' : formatPrice(totals.deliveryFee)}
          accent={totals.deliveryFee === 0}
        />
        <Row label="Frais de service" value={formatPrice(totals.serviceFee)} />
        {showTip && totals.tip > 0 && <Row label="Pourboire livreur" value={formatPrice(totals.tip)} />}
        {totals.discount > 0 && <Row label="Réduction" hint={promoCode} value={`− ${formatPrice(totals.discount)}`} accent />}
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="text-xl font-bold tabular-nums text-ink">{formatPrice(totals.total)}</span>
      </div>
      <p className="mt-1 text-right text-xs text-muted-foreground">TVA incluse</p>
    </div>
  )
}
