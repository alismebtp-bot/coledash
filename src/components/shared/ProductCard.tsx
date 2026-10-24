import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import SafeImage from './SafeImage'
import QuantityStepper from './QuantityStepper'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  name: string
  image?: string
  price: number
  originalPrice?: number
  description?: string
  /** e.g. "500 g" or "La pièce" */
  meta?: string
  badges?: ReactNode
  quantity: number
  disabled?: boolean
  onAdd: () => void
  onQuantityChange: (q: number) => void
  onOpen?: () => void
  className?: string
}

/** Vertical tile for grocery / retail / flower catalogues. */
export default function ProductCard({
  name,
  image,
  price,
  originalPrice,
  description,
  meta,
  badges,
  quantity,
  disabled,
  onAdd,
  onQuantityChange,
  onOpen,
  className,
}: ProductCardProps) {
  return (
    <article className={cn('group flex flex-col rounded-2xl border bg-card p-3 shadow-soft transition-shadow hover:shadow-lift', className)}>
      <button type="button" onClick={onOpen} className="relative block text-left" disabled={!onOpen} aria-label={onOpen ? `Voir ${name}` : undefined}>
        <SafeImage src={image} alt={name} wrapperClassName="aspect-square rounded-xl" className="transition-transform duration-500 group-hover:scale-105" />
        {badges && <div className="absolute left-2 top-2 flex flex-wrap gap-1">{badges}</div>}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 text-sm font-semibold text-ink">Rupture</div>
        )}
      </button>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{name}</h3>
        {description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>}
        {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex min-w-0 flex-col leading-tight">
            <span className={cn('font-bold', originalPrice ? 'text-brand-600' : 'text-ink')}>{formatPrice(price)}</span>
            {originalPrice && <span className="text-xs text-muted-foreground line-through">{formatPrice(originalPrice)}</span>}
          </div>
          {quantity > 0 ? (
            <QuantityStepper value={quantity} onChange={onQuantityChange} size="sm" label={`Quantité de ${name}`} />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              disabled={disabled}
              aria-label={`Ajouter ${name} au panier`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white shadow transition-transform hover:scale-105 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
