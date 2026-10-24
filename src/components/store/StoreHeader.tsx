import { Link } from 'react-router-dom'
import { ArrowLeft, Bike, Clock, Heart, MapPin, ShoppingBasket } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import { RatingBadge } from '@/components/shared/Rating'
import { formatPrice } from '@/lib/format'
import { useFavorites } from '@/store/favorites'
import { cn } from '@/lib/utils'
import type { Store } from '@/data/stores'
import { storeRoot } from './catalog'

const BACK: Record<Store['kind'], string> = { grocery: 'Courses', retail: 'Boutiques', flowers: 'Fleurs' }

export default function StoreHeader({ store }: { store: Store }) {
  const isFav = useFavorites((s) => s.ids.includes(store.id))
  const toggle = useFavorites((s) => s.toggle)
  const floral = store.kind === 'flowers'

  return (
    <header>
      <div className="relative">
        <SafeImage src={store.image} alt="" wrapperClassName="h-52 sm:h-72 md:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/10" aria-hidden />
        <div className="container absolute inset-x-0 top-4 flex items-center justify-between">
          <Link
            to={storeRoot(store.kind)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-sm font-semibold text-ink shadow-sm hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {BACK[store.kind]}
          </Link>
          <button
            type="button"
            onClick={() => toggle(store.id)}
            aria-pressed={isFav}
            aria-label={isFav ? `Retirer ${store.name} des favoris` : `Ajouter ${store.name} aux favoris`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm hover:scale-105"
          >
            <Heart className={cn('h-4 w-4', isFav && 'fill-brand-600 text-brand-600')} />
          </button>
        </div>
        <div className="container absolute inset-x-0 bottom-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{store.category}</p>
          <h1 className={cn('mt-1 text-3xl font-bold leading-tight text-white sm:text-5xl', floral && 'font-serif font-semibold')}>{store.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-white/85 sm:text-base">{store.tagline}</p>
        </div>
      </div>
      <div className="container">
        <ul className="-mt-px flex flex-wrap items-center gap-x-5 gap-y-2 border-b py-4 text-sm text-ink">
          <li>
            <RatingBadge rating={store.rating} count={store.reviewCount} />
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
            {store.deliveryTime}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Bike className="h-4 w-4 text-muted-foreground" aria-hidden />
            {store.deliveryFee === 0 ? 'Livraison offerte' : `Livraison ${formatPrice(store.deliveryFee)}`}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <ShoppingBasket className="h-4 w-4 text-muted-foreground" aria-hidden />
            Minimum {formatPrice(store.minOrder)}
          </li>
          <li className="inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            {store.address}
          </li>
          {store.promo && (
            <li className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{store.promo}</li>
          )}
        </ul>
      </div>
    </header>
  )
}
