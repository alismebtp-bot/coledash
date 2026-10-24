import { Link } from 'react-router-dom'
import { Bike, ChevronRight, Clock, Flower2, ShoppingBasket, Store as StoreIcon } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import { RatingBadge } from '@/components/shared/Rating'
import Highlight from './Highlight'
import MenuItemBadges from './MenuItemBadges'
import type { MenuItem, Restaurant } from '@/data/restaurants'
import type { Product } from '@/data/groceryProducts'
import type { Store } from '@/data/stores'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { isOpenNow } from './utils'

const card = 'group flex items-center gap-4 rounded-2xl border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift'

export function RestaurantResult({ restaurant: r, query }: { restaurant: Restaurant; query: string }) {
  const open = isOpenNow(r)
  return (
    <Link to={`/restaurants/${r.id}`} className={card}>
      <SafeImage src={r.image} alt="" wrapperClassName="h-20 w-24 shrink-0 rounded-xl sm:h-24 sm:w-32" className={cn(!open && 'grayscale')} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-ink">
            <Highlight text={r.name} query={query} />
          </h3>
          <RatingBadge rating={r.rating} className="shrink-0" />
        </div>
        <p className="truncate text-sm text-muted-foreground">
          <Highlight text={`${r.cuisine} · ${r.priceRange}`} query={query} />
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {r.deliveryTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bike className="h-3.5 w-3.5" aria-hidden />
            {formatPrice(r.deliveryFee)}
          </span>
          {!open && <span className="font-medium text-ink/70">Fermé</span>}
          {r.promoText && <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">{r.promoText}</span>}
        </p>
      </div>
    </Link>
  )
}

export function DishResult({ item, restaurant, query }: { item: MenuItem; restaurant: Restaurant; query: string }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className={card}>
      <SafeImage src={item.image} alt="" wrapperClassName="h-20 w-20 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink">
          <Highlight text={item.name} query={query} />
        </h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          <Highlight text={item.description} query={query} />
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="font-bold text-ink">{formatPrice(item.price)}</span>
          <span className="truncate text-xs text-muted-foreground">chez {restaurant.name}</span>
          <MenuItemBadges item={item} className="hidden sm:flex" />
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
    </Link>
  )
}

export function ProductResult({ product: p, href, query }: { product: Product; href: string; query: string }) {
  return (
    <Link to={href} className="group flex flex-col rounded-2xl border bg-card p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative">
        <SafeImage src={p.image} alt="" wrapperClassName="aspect-square rounded-xl" className="transition-transform duration-500 group-hover:scale-105" />
        {p.originalPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">Promo</span>
        )}
      </div>
      <h3 className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-ink">
        <Highlight text={p.name} query={query} />
      </h3>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">
        {p.brand}
        {p.weight ? ` · ${p.weight}` : ''}
      </p>
      <p className="mt-auto pt-2">
        <span className={cn('font-bold', p.originalPrice ? 'text-brand-600' : 'text-ink')}>{formatPrice(p.price)}</span>
        {p.originalPrice && <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatPrice(p.originalPrice)}</span>}
      </p>
    </Link>
  )
}

const KIND: Record<Store['kind'], { path: string; label: string; icon: typeof StoreIcon }> = {
  grocery: { path: '/courses', label: 'Courses', icon: ShoppingBasket },
  flowers: { path: '/fleurs', label: 'Fleuriste', icon: Flower2 },
  retail: { path: '/boutiques', label: 'Boutique', icon: StoreIcon },
}

function storeHref(s: Store) {
  return `${KIND[s.kind].path}/${s.id}`
}

export function StoreResult({ store: s, query }: { store: Store; query: string }) {
  const kind = KIND[s.kind]
  return (
    <Link to={storeHref(s)} className={card}>
      <div className="relative shrink-0">
        <SafeImage src={s.image} alt="" wrapperClassName="h-20 w-24 rounded-xl sm:h-24 sm:w-32" />
        <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-ink">
          <kind.icon className="h-3 w-3" aria-hidden />
          {kind.label}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-ink">
            <Highlight text={s.name} query={query} />
          </h3>
          <RatingBadge rating={s.rating} className="shrink-0" />
        </div>
        <p className="truncate text-sm text-muted-foreground">
          <Highlight text={s.tagline} query={query} />
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {s.deliveryTime}
          </span>
          <span>{s.category}</span>
          {s.promo && <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">{s.promo}</span>}
        </p>
      </div>
    </Link>
  )
}
