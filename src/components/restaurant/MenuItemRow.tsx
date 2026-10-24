import { Plus } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import MenuItemBadges from './MenuItemBadges'
import type { MenuItem } from '@/data/restaurants'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Props {
  item: MenuItem
  quantityInCart: number
  onOpen: () => void
}

export default function MenuItemRow({ item, quantityInCart, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group relative flex w-full items-stretch gap-4 rounded-2xl border bg-card p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift sm:p-4',
        quantityInCart > 0 && 'border-ink/25',
      )}
      aria-label={`${item.name}, ${formatPrice(item.price)}. Personnaliser et ajouter`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          {quantityInCart > 0 && (
            <span className="mt-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md bg-ink px-1 text-[11px] font-bold text-white">
              {quantityInCart}×
            </span>
          )}
          <h3 className="text-[15px] font-semibold leading-snug text-ink">{item.name}</h3>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <MenuItemBadges item={item} className="mt-2" />
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className={cn('font-bold', item.originalPrice ? 'text-brand-600' : 'text-ink')}>{formatPrice(item.price)}</span>
          {item.originalPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(item.originalPrice)}</span>}
          {!!(item.options?.length || item.extras?.length) && (
            <span className="text-xs text-muted-foreground">· Personnalisable</span>
          )}
        </div>
      </div>
      <div className="relative shrink-0">
        <SafeImage src={item.image} alt="" wrapperClassName="h-28 w-28 rounded-xl sm:h-32 sm:w-32" className="transition-transform duration-500 group-hover:scale-105" />
        <span
          className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-card bg-ink text-white shadow transition-transform group-hover:scale-110"
          aria-hidden
        >
          <Plus className="h-4 w-4" />
        </span>
      </div>
    </button>
  )
}
