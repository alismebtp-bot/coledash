import { motion } from 'framer-motion'
import { Clock, Flame, MapPin, Package, Store, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { DeliveryOffer } from '@/data/portals/driver'
import { formatPrice } from '@/lib/format'

interface Props {
  offer: DeliveryOffer
  secondsLeft: number
  disabled?: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function OfferCard({ offer, secondsLeft, disabled, onAccept, onDecline }: Props) {
  const ratio = Math.max(0, Math.min(1, secondsLeft / offer.expiresIn))
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className="overflow-hidden rounded-2xl border bg-card shadow-soft"
    >
      <div className="h-1 bg-secondary" aria-hidden>
        <div className="h-full bg-brand-500 transition-[width] duration-1000 ease-linear" style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-bold tabular-nums text-ink">{formatPrice(offer.pay)}</p>
            <p className="text-xs text-muted-foreground">
              {offer.tipEstimate > 0 ? `+ pourboire estimé ${formatPrice(offer.tipEstimate)}` : 'Hors pourboire'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {offer.boosted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                <Flame className="h-3 w-3" aria-hidden /> Bonus forte demande
              </span>
            )}
            <span className="text-xs font-medium tabular-nums text-muted-foreground">Expire dans {secondsLeft} s</span>
          </div>
        </div>

        <ol className="relative mt-4 space-y-3 pl-6">
          <span className="absolute bottom-3 left-[7px] top-3 w-px bg-border" aria-hidden />
          <li className="relative">
            <Store className="absolute -left-6 top-0.5 h-4 w-4 rounded-full bg-card text-ink" aria-hidden />
            <p className="text-sm font-semibold text-ink">
              {offer.merchantName} <span className="font-normal text-muted-foreground">· {offer.merchantKind}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {offer.pickupAddress} · à {offer.pickupKm.toLocaleString('fr-FR')} km
            </p>
          </li>
          <li className="relative">
            <MapPin className="absolute -left-6 top-0.5 h-4 w-4 rounded-full bg-card text-brand-600" aria-hidden />
            <p className="text-sm font-semibold text-ink">{offer.dropoffAddress}</p>
            <p className="text-xs text-muted-foreground">Client : {offer.customerName}</p>
          </li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {(offer.distanceKm + offer.pickupKm).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} km au total
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden /> ~{offer.minutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Package className="h-3.5 w-3.5" aria-hidden /> {offer.items} article{offer.items > 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="lg" className="flex-1 sm:flex-none" onClick={onDecline} aria-label={`Refuser la course ${offer.merchantName}`}>
            <X aria-hidden /> Refuser
          </Button>
          <Button size="lg" className="flex-[2]" onClick={onAccept} disabled={disabled}>
            Accepter
          </Button>
        </div>
      </div>
    </motion.li>
  )
}
