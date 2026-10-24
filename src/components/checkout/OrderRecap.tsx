import { useState } from 'react'
import { ChevronDown, Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SafeImage from '@/components/shared/SafeImage'
import TotalsList from './TotalsList'
import type { Totals } from '@/lib/pricing'
import type { CartItem } from '@/types'
import { formatPrice, pluralize } from '@/lib/format'

interface Props {
  vendorName: string
  vendorImage?: string
  items: CartItem[]
  totals: Totals
  promoCode?: string
  submitting: boolean
  onSubmit: () => void
  ctaLabel: string
}

export default function OrderRecap({ vendorName, vendorImage, items, totals, promoCode, submitting, onSubmit, ctaLabel }: Props) {
  const [open, setOpen] = useState(false)
  const count = items.reduce((n, i) => n + i.quantity, 0)
  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <SafeImage src={vendorImage} alt="" wrapperClassName="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold text-ink">{vendorName}</h2>
          <p className="text-sm text-muted-foreground">{pluralize(count, 'article')}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-ink hover:bg-muted"
        >
          Détail <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </div>
      {open && (
        <ul className="space-y-2 border-y py-3 text-sm">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3">
              <span className="min-w-0 text-ink">
                <span className="font-semibold tabular-nums">{i.quantity}×</span> {i.name}
                {i.options?.length ? <span className="block text-xs text-muted-foreground">{i.options.join(' · ')}</span> : null}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">{formatPrice(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
      <TotalsList totals={totals} promoCode={promoCode} showTip />
      <Button size="lg" className="hidden w-full lg:flex" onClick={onSubmit} disabled={submitting}>
        {submitting ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
        ) : (
          <Lock aria-hidden />
        )}
        {submitting ? 'Paiement en cours…' : ctaLabel}
      </Button>
      <ul className="space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> Paiement chiffré, aucune donnée bancaire conservée
        </li>
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> Annulation gratuite tant que la commande n’est pas en préparation
        </li>
      </ul>
    </div>
  )
}
