import { Link } from 'react-router-dom'
import { ChevronRight, RotateCcw, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SafeImage from '@/components/shared/SafeImage'
import { StarRating } from '@/components/shared/Rating'
import { StatusPill, type Tone } from '@/components/portal/PortalUI'
import { vendorInfo } from '@/components/checkout/helpers'
import { STATUS_LABELS } from '@/store/orders'
import { formatDate, formatPrice, formatTime, pluralize } from '@/lib/format'
import type { Order, OrderStatus } from '@/types'

const TONE: Record<OrderStatus, Tone> = {
  confirmed: 'info',
  preparing: 'warning',
  picked_up: 'brand',
  delivering: 'brand',
  delivered: 'success',
  cancelled: 'danger',
}

interface Props {
  order: Order
  status: OrderStatus
  onReorder: () => void
  onRate: () => void
}

export default function OrderCard({ order, status, onReorder, onRate }: Props) {
  const info = vendorInfo(order.vendorId)
  const count = order.items.reduce((n, i) => n + i.quantity, 0)
  const summary = order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
  const active = status !== 'delivered' && status !== 'cancelled'

  return (
    <article className="rounded-2xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <SafeImage src={info.image ?? order.items[0]?.image} alt="" wrapperClassName="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="truncate font-semibold text-ink">{order.vendorName}</h3>
            <StatusPill tone={TONE[status]}>{STATUS_LABELS[status]}</StatusPill>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {formatDate(order.createdAt, { weekday: 'short', day: 'numeric', month: 'long' })} à {formatTime(order.createdAt)} ·{' '}
            {order.number}
          </p>
          <p className="mt-1.5 line-clamp-1 text-sm text-ink">{summary}</p>
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">{pluralize(count, 'article')} · </span>
            <span className="font-semibold tabular-nums text-ink">{formatPrice(order.total)}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
        {active ? (
          <Button asChild size="sm">
            <Link to={`/suivi/${order.id}`}>
              Suivre la livraison <ChevronRight aria-hidden />
            </Link>
          </Button>
        ) : (
          <>
            <Button size="sm" variant="ink" onClick={onReorder}>
              <RotateCcw aria-hidden /> Recommander
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to={`/suivi/${order.id}`}>Détails</Link>
            </Button>
          </>
        )}
        {status === 'delivered' && (
          <div className="ml-auto">
            {order.rating ? (
              <StarRating value={order.rating} size="sm" />
            ) : (
              <Button size="sm" variant="soft" onClick={onRate}>
                <Star aria-hidden /> Noter
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
