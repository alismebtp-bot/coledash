import { Link } from 'react-router-dom'
import { Bike, Clock, Heart } from 'lucide-react'
import SafeImage from './SafeImage'
import { RatingBadge } from './Rating'
import { formatPrice } from '@/lib/format'
import { useFavorites } from '@/store/favorites'
import { cn } from '@/lib/utils'

export interface VendorCardData {
  id: string
  href: string
  name: string
  subtitle: string
  image: string
  rating: number
  reviewCount?: number
  deliveryTime: string
  deliveryFee: number
  promo?: string
  isOpen?: boolean
  isNew?: boolean
}

export default function VendorCard({ vendor, className }: { vendor: VendorCardData; className?: string }) {
  const isFav = useFavorites((s) => s.ids.includes(vendor.id))
  const toggle = useFavorites((s) => s.toggle)
  const closed = vendor.isOpen === false

  return (
    <article className={cn('group relative', className)}>
      <Link to={vendor.href} className="block rounded-2xl focus-visible:ring-offset-4">
        <div className="relative">
          <SafeImage
            src={vendor.image}
            alt={vendor.name}
            wrapperClassName="aspect-[16/10] rounded-2xl"
            className={cn('transition-transform duration-500 group-hover:scale-[1.04]', closed && 'grayscale')}
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {vendor.promo && (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow">{vendor.promo}</span>
            )}
            {vendor.isNew && <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink shadow">Nouveau</span>}
          </div>
          {closed && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-ink/45">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink">Fermé · Commander pour plus tard</span>
            </div>
          )}
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-sm">
            <Clock className="h-3 w-3" aria-hidden />
            {vendor.deliveryTime}
          </span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink">{vendor.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{vendor.subtitle}</p>
          </div>
          <RatingBadge rating={vendor.rating} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Bike className="h-3.5 w-3.5" aria-hidden />
          {vendor.deliveryFee === 0 ? 'Livraison offerte' : `Livraison ${formatPrice(vendor.deliveryFee)}`}
        </p>
      </Link>
      <button
        type="button"
        onClick={() => toggle(vendor.id)}
        aria-pressed={isFav}
        aria-label={isFav ? `Retirer ${vendor.name} des favoris` : `Ajouter ${vendor.name} aux favoris`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm transition-transform hover:scale-105"
      >
        <Heart className={cn('h-4 w-4', isFav && 'fill-brand-600 text-brand-600')} />
      </button>
    </article>
  )
}
