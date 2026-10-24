import { Bike, MessageCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RatingBadge } from '@/components/shared/Rating'
import { formatNumber } from '@/lib/format'
import type { Courier } from './tracking'

export default function CourierCard({ courier, assigned }: { courier: Courier; assigned: boolean }) {
  if (!assigned) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bike className="h-5 w-5 animate-pulse text-muted-foreground" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink">Recherche d’un livreur…</p>
          <p className="text-muted-foreground">Nous attribuons le livreur le plus proche du commerce.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-bold text-white">
        {courier.initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{courier.name}</p>
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span>{courier.vehicle}</span>
          <span aria-hidden>·</span>
          <RatingBadge rating={courier.rating} className="text-sm" />
          <span aria-hidden>·</span>
          <span>{formatNumber(courier.deliveries)} livraisons</span>
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label={`Appeler ${courier.name}`}
          onClick={() => toast(`Appel de ${courier.name}…`, { description: 'Numéro masqué pour protéger vos données (démo).' })}
        >
          <Phone aria-hidden />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label={`Envoyer un message à ${courier.name}`}
          onClick={() => toast.success(`Message envoyé à ${courier.name}`, { description: '« Je descends dans 2 minutes ! »' })}
        >
          <MessageCircle aria-hidden />
        </Button>
      </div>
    </div>
  )
}
