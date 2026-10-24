import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarClock, CircleX, Gift, MapPin, PackageSearch, Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import EmptyState from '@/components/shared/EmptyState'
import { StarRating } from '@/components/shared/Rating'
import TrackingMap from '@/components/checkout/TrackingMap'
import TrackingTimeline from '@/components/checkout/TrackingTimeline'
import CourierCard from '@/components/checkout/CourierCard'
import TotalsList from '@/components/checkout/TotalsList'
import { courierFor, elapsedMinutes, orderStart } from '@/components/checkout/tracking'
import { vendorHref } from '@/components/checkout/helpers'
import { useNow } from '@/components/checkout/useNow'
import { STATUS_LABELS, getOrderEta, getOrderStatus, useOrders } from '@/store/orders'
import { formatDate, formatTime } from '@/lib/format'
import type { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'

const HEADLINES: Record<OrderStatus, string> = {
  confirmed: 'Votre commande est confirmée',
  preparing: 'Votre commande est en préparation',
  picked_up: 'Le livreur a récupéré votre commande',
  delivering: 'Votre livreur arrive',
  delivered: 'Votre commande est arrivée',
  cancelled: 'Commande annulée',
}

const PAYMENT_LABEL = { card: 'Carte bancaire', apple_pay: 'Apple Pay', paypal: 'PayPal', cash: 'Espèces à la livraison' }

export default function OrderTracking() {
  const { id } = useParams()
  const order = useOrders((s) => s.orders.find((o) => o.id === id))
  const cancel = useOrders((s) => s.cancel)
  const rate = useOrders((s) => s.rate)
  const statusNow = useNow(5000)
  const clock = useNow(1000)

  if (!order) {
    return (
      <div className="container max-w-2xl py-16 pb-28">
        <EmptyState
          icon={PackageSearch}
          title="Commande introuvable"
          description="Ce lien de suivi ne correspond à aucune commande sur cet appareil."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="ink">
                <Link to="/commandes">Mes commandes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Retour à l’accueil</Link>
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const status = getOrderStatus(order, statusNow)
  const minutes = elapsedMinutes(order, statusNow)
  const start = orderStart(order)
  const eta = getOrderEta(order)
  const remainingMs = Math.max(eta - clock, 0)
  const remainingMin = Math.ceil(remainingMs / 60000)
  const courier = courierFor(order)
  const scheduledWaiting = !!order.scheduledFor && clock < start
  const active = status !== 'delivered' && status !== 'cancelled'

  return (
    <div className="container max-w-6xl py-6 pb-28 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Commande {order.number} ·{' '}
            <Link to={vendorHref({ ...order, productId: order.items[0]?.productId ?? '' })} className="font-medium text-ink hover:underline">
              {order.vendorName}
            </Link>
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl" aria-live="polite">
            {HEADLINES[status]}
          </h1>
        </div>
        {active && (
          <div className="rounded-2xl bg-ink px-4 py-3 text-white shadow-lift" aria-live="polite">
            {scheduledWaiting ? (
              <>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Livraison programmée
                </p>
                <p className="text-lg font-bold">
                  {formatDate(order.scheduledFor!, { weekday: 'short', day: 'numeric', month: 'short' })} · {formatTime(order.scheduledFor!)}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-white/70">Arrivée estimée</p>
                <p className="text-2xl font-bold tabular-nums">
                  {formatTime(eta)}{' '}
                  <span className="text-sm font-medium text-white/70">
                    {remainingMin > 0 ? `dans ${remainingMin} min` : 'd’un instant à l’autre'}
                  </span>
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <TrackingMap minutes={minutes} status={status} />
          </motion.div>
          {status !== 'cancelled' && <CourierCard courier={courier} assigned={status !== 'confirmed'} />}

          <section className="rounded-2xl border bg-card p-5 shadow-soft" aria-labelledby="suivi-etapes">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="suivi-etapes" className="font-semibold text-ink">
                Suivi
              </h2>
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  status === 'cancelled' ? 'bg-red-100 text-red-700' : status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-50 text-brand-700',
                )}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>
            {status === 'cancelled' ? (
              <p className="text-sm text-muted-foreground">
                Cette commande a été annulée. Vous ne serez pas débité ; si un paiement avait été autorisé, il sera libéré sous 3 à 5 jours.
              </p>
            ) : (
              <TrackingTimeline status={status} start={start} />
            )}
          </section>
        </div>

        <aside className="space-y-4">
          {status === 'delivered' && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center" aria-labelledby="noter">
              <h2 id="noter" className="font-semibold text-ink">
                {order.rating ? 'Merci pour votre avis !' : 'Comment s’est passée votre commande ?'}
              </h2>
              <div className="mt-3 flex justify-center">
                <StarRating
                  size="lg"
                  value={order.rating ?? 0}
                  onChange={(n) => {
                    rate(order.id, n)
                    toast.success('Merci ! Votre note aide la communauté ColeDash.')
                  }}
                />
              </div>
            </section>
          )}

          <section className="rounded-2xl border bg-card p-5 shadow-soft" aria-labelledby="recap">
            <h2 id="recap" className="mb-3 flex items-center gap-2 font-semibold text-ink">
              <Receipt className="h-4 w-4" aria-hidden /> Récapitulatif
            </h2>
            <ul className="mb-4 space-y-1.5 text-sm">
              {order.items.map((i) => (
                <li key={i.key} className="flex justify-between gap-3">
                  <span className="text-ink">
                    <span className="font-semibold tabular-nums">{i.quantity}×</span> {i.name}
                    {i.options?.length ? <span className="block text-xs text-muted-foreground">{i.options.join(' · ')}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
            <TotalsList
              totals={{
                subtotal: order.subtotal,
                deliveryFee: order.deliveryFee,
                serviceFee: order.serviceFee,
                discount: order.discount,
                tip: order.tip,
                total: order.total,
              }}
              showTip
            />
            <dl className="mt-4 space-y-3 border-t pt-4 text-sm">
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <dt className="sr-only">Adresse</dt>
                  <dd className="text-ink">
                    {order.address.line1}, {order.address.postalCode} {order.address.city}
                  </dd>
                  {order.address.instructions && <dd className="text-muted-foreground">{order.address.instructions}</dd>}
                </div>
              </div>
              {order.recipientName && (
                <div className="flex gap-2">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <dt className="sr-only">Destinataire</dt>
                    <dd className="text-ink">Pour {order.recipientName}</dd>
                    {order.giftMessage && <dd className="font-serif italic text-muted-foreground">« {order.giftMessage} »</dd>}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Paiement</dt>
                <dd className="text-ink">{PAYMENT_LABEL[order.paymentMethod]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Passée le</dt>
                <dd className="text-ink">
                  {formatDate(order.createdAt)} à {formatTime(order.createdAt)}
                </dd>
              </div>
            </dl>
          </section>

          {status === 'confirmed' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                  <CircleX aria-hidden /> Annuler la commande
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Annuler la commande {order.number} ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {order.vendorName} n’a pas encore commencé la préparation : l’annulation est gratuite.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Garder ma commande</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      cancel(order.id)
                      toast('Commande annulée', { description: 'Aucun montant ne sera débité.' })
                    }}
                  >
                    Oui, annuler
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button asChild variant="ghost" className="w-full">
            <Link to="/aide">Un problème avec la commande ? Contacter l’aide</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}
