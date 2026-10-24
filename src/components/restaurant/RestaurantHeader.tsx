import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bike, ChevronDown, Clock, Heart, MapPin, Phone, ShoppingBasket, Share2, Tag } from 'lucide-react'
import { toast } from 'sonner'
import SafeImage from '@/components/shared/SafeImage'
import { RatingBadge } from '@/components/shared/Rating'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Restaurant } from '@/data/restaurants'
import { useFavorites } from '@/store/favorites'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { DAY_LABELS, WEEK_ORDER, formatHour, isOpenNow, todayHours, todayKey } from './utils'

function InfoTile({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-ink">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}

export default function RestaurantHeader({ restaurant: r }: { restaurant: Restaurant }) {
  const isFav = useFavorites((s) => s.ids.includes(r.id))
  const toggle = useFavorites((s) => s.toggle)
  const open = isOpenNow(r)
  const hours = todayHours(r)
  const today = todayKey()
  const tags = [...new Set([...(r.badges ?? []), ...(r.features ?? [])])].filter((t) => t.toLowerCase() !== r.cuisine.toLowerCase())

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: r.name, url })
      else {
        await navigator.clipboard.writeText(url)
        toast.success('Lien copié')
      }
    } catch {
      /* partage annulé */
    }
  }

  return (
    <header>
      <div className="relative">
        <SafeImage src={r.image} alt={`Salle et plats de ${r.name}`} wrapperClassName="h-56 w-full sm:h-72 lg:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/30" aria-hidden />
        <div className="container absolute inset-x-0 top-0 flex items-center justify-between pt-4">
          <Link
            to="/restaurants"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/95 px-3 text-sm font-semibold text-ink shadow transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Restaurants</span>
            <span className="sr-only sm:hidden">Retour aux restaurants</span>
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={share}
              aria-label="Partager ce restaurant"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow transition hover:scale-105"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                toggle(r.id)
                toast.success(isFav ? 'Retiré de vos favoris' : 'Ajouté à vos favoris')
              }}
              aria-pressed={isFav}
              aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow transition hover:scale-105"
            >
              <Heart className={cn('h-4 w-4 transition', isFav && 'fill-brand-600 text-brand-600')} />
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative -mt-16 rounded-3xl border bg-card p-5 shadow-lift sm:-mt-20 sm:p-7"
        >
          <div className="flex items-start gap-4">
            {r.logo && (
              <SafeImage
                src={r.logo}
                alt=""
                wrapperClassName="-mt-12 hidden h-20 w-20 shrink-0 rounded-2xl border-4 border-card shadow-soft sm:block"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    open ? 'bg-emerald-100 text-emerald-800' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', open ? 'bg-emerald-500' : 'bg-muted-foreground')} aria-hidden />
                  {open ? 'Ouvert' : 'Fermé · précommande possible'}
                </span>
                {r.isNew && <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Nouveau</span>}
                {r.isBestseller && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Coup de cœur</span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">{r.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {r.cuisineType.join(' · ')} · {r.priceRange}
              </p>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink/80">{r.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <RatingBadge rating={r.rating} count={r.reviewCount} />
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" aria-hidden />
              {r.address}, {r.postalCode} {r.city}
            </span>
            <Popover>
              <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-md text-muted-foreground hover:text-ink">
                <Clock className="h-4 w-4" aria-hidden />
                Aujourd'hui : {hours ?? 'fermé'}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </PopoverTrigger>
              <PopoverContent className="w-64 rounded-xl p-4" align="start">
                <p className="mb-2 font-display font-semibold text-ink">Horaires</p>
                <dl className="space-y-1 text-sm">
                  {WEEK_ORDER.map((d) => {
                    const slot = r.hours[d]
                    return (
                      <div key={d} className={cn('flex justify-between', d === today ? 'font-semibold text-ink' : 'text-muted-foreground')}>
                        <dt>{DAY_LABELS[d]}</dt>
                        <dd>{slot ? `${formatHour(slot.open)} – ${formatHour(slot.close)}` : 'Fermé'}</dd>
                      </div>
                    )
                  })}
                </dl>
              </PopoverContent>
            </Popover>
            <a href={`tel:${r.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink">
              <Phone className="h-4 w-4" aria-hidden />
              {r.phone}
            </a>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <InfoTile icon={Clock} label="Livraison" value={r.deliveryTime} />
            <InfoTile icon={Bike} label="Frais de livraison" value={r.deliveryFee === 0 ? 'Offerts' : formatPrice(r.deliveryFee)} />
            <InfoTile icon={ShoppingBasket} label="Minimum" value={formatPrice(r.minOrder)} />
            <InfoTile icon={Tag} label="Gamme de prix" value={r.priceRange} />
          </div>

          {r.promoText && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-50 px-4 py-3 text-brand-700">
              <Tag className="h-5 w-5 shrink-0" aria-hidden />
              <p className="text-sm">
                <span className="font-semibold">Offre en cours :</span> {r.promoText}
              </p>
            </div>
          )}

          {tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Points forts">
              {tags.map((t) => (
                <li key={t} className="rounded-full border px-3 py-1 text-xs font-medium text-ink/80">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </header>
  )
}
