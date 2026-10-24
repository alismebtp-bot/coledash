import type { ReactNode } from 'react'
import { Bike, CreditCard, MapPin, MessageSquareText, Phone, User } from 'lucide-react'
import { StatusPill } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { COMMISSION_RATE, ORDER_STATUS_LABELS, ORDER_STATUS_TONES, type MerchantOrder } from '@/data/portals/merchant'
import { formatDate, formatPrice, formatTime } from '@/lib/format'

interface Props {
  order: MerchantOrder | null
  onOpenChange: (open: boolean) => void
  onAccept: (o: MerchantOrder) => void
  onRefuse: (o: MerchantOrder) => void
  onReady: (o: MerchantOrder) => void
  onPickedUp: (o: MerchantOrder) => void
}

function Row({ icon: Icon, children }: { icon: typeof User; children: ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-sm text-ink">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <span>{children}</span>
    </p>
  )
}

export default function OrderDetailSheet({ order, onOpenChange, onAccept, onRefuse, onReady, onPickedUp }: Props) {
  const timeline = order
    ? [
        { label: 'Reçue', at: order.createdAt },
        { label: 'Acceptée', at: order.acceptedAt },
        { label: 'Prête', at: order.readyAt },
        { label: 'Récupérée par le livreur', at: order.pickedUpAt },
      ]
    : []
  const commission = order ? Math.round(order.subtotal * COMMISSION_RATE * 100) / 100 : 0

  return (
    <Sheet open={!!order} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {order && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2">
                <SheetTitle>Commande {order.number}</SheetTitle>
                <StatusPill tone={ORDER_STATUS_TONES[order.status]}>{ORDER_STATUS_LABELS[order.status]}</StatusPill>
              </div>
              <SheetDescription>
                {formatDate(order.createdAt, { weekday: 'long', day: 'numeric', month: 'long' })} à {formatTime(order.createdAt)}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-2.5">
              <Row icon={User}>
                {order.customerName}{' '}
                <span className="text-muted-foreground">
                  · {order.customerOrders === 0 ? 'première commande' : `${order.customerOrders} commandes passées`}
                </span>
              </Row>
              <Row icon={Phone}>{order.customerPhone}</Row>
              <Row icon={MapPin}>{order.address}</Row>
              <Row icon={CreditCard}>{order.paymentMethod} · payée en ligne</Row>
              {order.courierName && <Row icon={Bike}>Livreur : {order.courierName}</Row>}
            </div>

            {order.note && (
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {order.note}
              </p>
            )}
            {order.refusalReason && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <span className="font-semibold">Motif du refus :</span> {order.refusalReason}
              </p>
            )}

            <Separator className="my-5" />
            <h3 className="font-sans text-sm font-semibold text-ink">Articles</h3>
            <ul className="mt-3 space-y-2.5">
              {order.lines.map((l) => (
                <li key={l.itemId} className="flex gap-3 text-sm">
                  <span className="w-6 font-semibold tabular-nums text-ink">{l.quantity}×</span>
                  <span className="flex-1">
                    <span className="text-ink">{l.name}</span>
                    {l.options?.length ? <span className="block text-xs text-muted-foreground">{l.options.join(', ')}</span> : null}
                  </span>
                  <span className="tabular-nums text-ink">{formatPrice(l.quantity * l.unitPrice)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t pt-4 text-sm">
              <div className="flex justify-between font-semibold text-ink">
                <dt>Sous-total client</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>Commission ColeDash ({Math.round(COMMISSION_RATE * 100)} %)</dt>
                <dd className="tabular-nums">−{formatPrice(commission)}</dd>
              </div>
              <div className="flex justify-between text-ink">
                <dt>Votre revenu</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal - commission)}</dd>
              </div>
            </dl>

            <Separator className="my-5" />
            <h3 className="font-sans text-sm font-semibold text-ink">Suivi</h3>
            <ol className="mt-3 space-y-3">
              {timeline.map((t) => (
                <li key={t.label} className="flex items-center gap-3 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${t.at ? 'bg-emerald-500' : 'bg-stone-300'}`} aria-hidden />
                  <span className={t.at ? 'text-ink' : 'text-muted-foreground'}>{t.label}</span>
                  <span className="ml-auto tabular-nums text-muted-foreground">{t.at ? formatTime(t.at) : '—'}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid gap-2">
              {order.status === 'new' && (
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => onRefuse(order)}>
                    Refuser
                  </Button>
                  <Button onClick={() => onAccept(order)}>Accepter</Button>
                </div>
              )}
              {order.status === 'preparing' && (
                <Button variant="ink" onClick={() => onReady(order)}>
                  Marquer comme prête
                </Button>
              )}
              {order.status === 'ready' && (
                <Button variant="outline" onClick={() => onPickedUp(order)}>
                  Confirmer la remise au livreur
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
