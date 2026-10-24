import { Bike, Check, Clock, MessageSquareText, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { orderItemCount, type MerchantOrder } from '@/data/portals/merchant'
import { formatPrice, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { formatCountdown, minutesSince, secondsLeft } from './orderUtils'

interface Props {
  order: MerchantOrder
  now: number
  onOpen: () => void
  onAccept?: () => void
  onRefuse?: () => void
  onReady?: () => void
  onExtend?: () => void
  onPickedUp?: () => void
}

export default function OrderCard({ order, now, onOpen, onAccept, onRefuse, onReady, onExtend, onPickedUp }: Props) {
  const left = secondsLeft(order, now)
  const waiting = minutesSince(order.createdAt, now)
  const progress = Math.min(100, Math.max(0, 100 - (left / (order.prepMinutes * 60)) * 100))
  const late = order.status === 'preparing' && left < 0
  const urgentNew = order.status === 'new' && waiting >= 4

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border bg-card p-3.5 shadow-soft transition-shadow hover:shadow-lift',
        order.status === 'new' && 'border-brand-200 ring-1 ring-brand-100',
        late && 'border-red-200',
      )}
    >
      <button type="button" onClick={onOpen} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="whitespace-nowrap text-sm font-bold text-ink">{order.number}</p>
            <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate">{order.customerName}</span>
              {order.customerOrders === 0 && (
                <span className="shrink-0 rounded-full bg-brand-50 px-1.5 py-px text-[10px] font-semibold text-brand-700" title="Première commande">
                  Nouveau
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums text-ink">{formatPrice(order.subtotal)}</p>
            <p className="text-[11px] text-muted-foreground">{formatTime(order.createdAt)}</p>
          </div>
        </div>
        <ul className="mt-2.5 space-y-0.5 text-xs text-ink">
          {order.lines.slice(0, 3).map((l) => (
            <li key={l.itemId} className="flex gap-1.5">
              <span className="font-semibold tabular-nums">{l.quantity}×</span>
              <span className="truncate">
                {l.name}
                {l.options?.length ? <span className="text-muted-foreground"> ({l.options.join(', ')})</span> : null}
              </span>
            </li>
          ))}
          {order.lines.length > 3 && <li className="text-muted-foreground">+ {order.lines.length - 3} autre(s) ligne(s)</li>}
        </ul>
        {order.note && (
          <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-900">
            <MessageSquareText className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
            {order.note}
          </p>
        )}
      </button>

      {order.status === 'new' && (
        <>
          <p className={cn('mt-2.5 flex items-center gap-1 text-xs', urgentNew ? 'font-semibold text-red-600' : 'text-muted-foreground')}>
            <Clock className="h-3 w-3" aria-hidden /> En attente depuis {waiting} min · {orderItemCount(order)} articles
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onRefuse}>
              <X /> Refuser
            </Button>
            <Button size="sm" onClick={onAccept}>
              <Check /> Accepter
            </Button>
          </div>
        </>
      )}

      {order.status === 'preparing' && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs">
            <span className={cn('font-semibold tabular-nums', late ? 'text-red-600' : 'text-ink')} aria-live="off">
              {late ? `En retard ${formatCountdown(left)}` : `Reste ${formatCountdown(left)}`}
            </span>
            <span className="text-muted-foreground">{order.prepMinutes} min prévues</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Avancement de la préparation">
            <div className={cn('h-full rounded-full transition-all', late ? 'bg-red-500' : 'bg-amber-500')} style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-2">
            <Button variant="outline" size="sm" onClick={onExtend} aria-label="Ajouter 5 minutes">
              <Plus /> 5 min
            </Button>
            <Button variant="ink" size="sm" onClick={onReady}>
              <Check /> Marquer prête
            </Button>
          </div>
        </div>
      )}

      {order.status === 'ready' && (
        <div className="mt-3">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bike className="h-3.5 w-3.5" aria-hidden /> {order.courierName ?? 'Livreur'} arrive · prête depuis {minutesSince(order.readyAt ?? order.createdAt, now)} min
          </p>
          <Button variant="outline" size="sm" className="mt-3 w-full" onClick={onPickedUp}>
            Remise au livreur
          </Button>
        </div>
      )}

      {order.status === 'picked_up' && (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Bike className="h-3.5 w-3.5" aria-hidden /> {order.courierName} · récupérée à {formatTime(order.pickedUpAt ?? order.createdAt)}
        </p>
      )}
    </motion.article>
  )
}
