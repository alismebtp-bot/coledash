import { X } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import QuantityStepper from '@/components/shared/QuantityStepper'
import { formatPrice } from '@/lib/format'
import { lineTotal } from '@/lib/pricing'
import type { CartItem } from '@/types'

interface Props {
  item: CartItem
  onQuantity: (q: number) => void
  onRemove: () => void
}

export default function CartLine({ item, onQuantity, onRemove }: Props) {
  return (
    <li className="flex gap-3 py-4 sm:gap-4">
      <SafeImage src={item.image} alt={item.name} wrapperClassName="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold leading-snug text-ink">{item.name}</h3>
            {item.options && item.options.length > 0 && (
              <p className="mt-0.5 text-sm text-muted-foreground">{item.options.join(' · ')}</p>
            )}
            {item.note && <p className="mt-0.5 text-sm italic text-muted-foreground">« {item.note} »</p>}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Supprimer ${item.name} du panier`}
            className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <QuantityStepper value={item.quantity} onChange={onQuantity} size="sm" label={`Quantité de ${item.name}`} />
          <div className="text-right leading-tight">
            <p className="font-bold tabular-nums text-ink">{formatPrice(lineTotal(item))}</p>
            {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(item.unitPrice)} l'unité</p>}
          </div>
        </div>
      </div>
    </li>
  )
}
