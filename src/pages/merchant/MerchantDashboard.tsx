import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BellRing, Euro, ShoppingBag, Star, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { Panel, PortalPageHeader, StatCard, StatusPill } from '@/components/portal/PortalUI'
import SafeImage from '@/components/shared/SafeImage'
import { Button } from '@/components/ui/button'
import { RevenueAreaChart } from '@/components/merchant/charts'
import StoreControls from '@/components/merchant/StoreControls'
import { formatCountdown, minutesSince, secondsLeft, useNow, useSimulateOrder } from '@/components/merchant/orderUtils'
import {
  dailyStats,
  dishPerformance,
  orderItemCount,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  pctDelta,
  summarize,
  statsForPeriod,
  currentBalance,
} from '@/data/portals/merchant'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

export default function MerchantDashboard() {
  const orders = useMerchant((s) => s.orders)
  const shopName = useMerchant((s) => s.shop.name)
  const simulate = useSimulateOrder()
  const now = useNow()

  const kpis = useMemo(() => {
    const today = dailyStats[dailyStats.length - 1]
    const lastWeek = dailyStats[dailyStats.length - 8]
    const reviews = summarize(statsForPeriod(30))
    const prevReviews = summarize(statsForPeriod(30, 30))
    return {
      revenue: today.revenue,
      revenueDelta: pctDelta(today.revenue, lastWeek.revenue),
      orders: today.orders,
      ordersDelta: pctDelta(today.orders, lastWeek.orders),
      basket: today.orders ? today.revenue / today.orders : 0,
      basketDelta: pctDelta(today.orders ? today.revenue / today.orders : 0, lastWeek.orders ? lastWeek.revenue / lastWeek.orders : 0),
      rating: reviews.rating,
      ratingDelta: pctDelta(reviews.rating, prevReviews.rating),
      closedToday: new Date(today.date).getDay() === 0,
    }
  }, [])

  const chartData = useMemo(
    () =>
      statsForPeriod(14).map((d) => ({
        label: formatDate(d.date, { weekday: 'short', day: 'numeric' }),
        revenue: d.revenue,
        orders: d.orders,
      })),
    [],
  )
  const total14 = chartData.reduce((s, d) => s + d.revenue, 0)
  const topDishes = useMemo(() => dishPerformance(7).slice(0, 5), [])
  const maxQty = topDishes[0]?.quantity ?? 1

  const live = orders
    .filter((o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  const newCount = live.filter((o) => o.status === 'new').length

  return (
    <div>
      <PortalPageHeader
        title={`Bonjour, ${shopName}`}
        description={formatDate(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={<StoreControls />}
      />

      {newCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BellRing className="h-5 w-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-ink">
              {newCount > 1 ? `${newCount} nouvelles commandes attendent votre validation` : '1 nouvelle commande attend votre validation'}
            </p>
            <p className="text-sm text-muted-foreground">Acceptez-les rapidement : au-delà de 5 minutes, le client est prévenu du retard.</p>
          </div>
          <Button asChild size="sm">
            <Link to="/marchand/commandes">Voir les commandes</Link>
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Chiffre d'affaires" value={formatPrice(kpis.revenue)} delta={kpis.revenueDelta} hint="vs sem. dernière" icon={Euro} />
        <StatCard label="Commandes" value={formatNumber(kpis.orders)} delta={kpis.ordersDelta} hint="vs sem. dernière" icon={ShoppingBag} />
        <StatCard label="Panier moyen" value={formatPrice(kpis.basket)} delta={kpis.basketDelta} hint="vs sem. dernière" icon={Wallet} />
        <StatCard label="Note moyenne" value={`${kpis.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 5`} delta={kpis.ratingDelta} hint="30 derniers jours" icon={Star} />
      </div>
      {kpis.closedToday && <p className="mt-2 text-xs text-muted-foreground">Fermé le dimanche : les indicateurs du jour sont à zéro.</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Chiffre d'affaires — 14 derniers jours"
          className="lg:col-span-2"
          action={<span className="text-sm font-semibold tabular-nums text-ink">{formatPrice(total14)}</span>}
        >
          <RevenueAreaChart data={chartData} height={340} />
        </Panel>

        <Panel
          title="Commandes en cours"
          action={
            <Button variant="ghost" size="sm" onClick={simulate}>
              Simuler
            </Button>
          }
        >
          {live.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucune commande en cours pour le moment.</p>
          ) : (
            <ul className="-my-2 divide-y">
              {live.slice(0, 6).map((o) => {
                const left = secondsLeft(o, now)
                return (
                  <li key={o.id} className="flex items-center gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                        {o.number}
                        <StatusPill tone={ORDER_STATUS_TONES[o.status]}>{ORDER_STATUS_LABELS[o.status]}</StatusPill>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {o.customerName} · {orderItemCount(o)} art. · il y a {minutesSince(o.createdAt, now)} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-ink">{formatPrice(o.subtotal)}</p>
                      {o.status === 'preparing' && (
                        <p className={cn('text-xs font-medium tabular-nums', left < 0 ? 'text-red-600' : 'text-muted-foreground')}>
                          {formatCountdown(left)}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/marchand/commandes">
              Gérer les commandes <ArrowRight />
            </Link>
          </Button>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Plats les plus vendus — 7 jours"
          className="lg:col-span-2"
          action={
            <Link to="/marchand/statistiques" className="text-sm font-medium text-brand-700 hover:underline">
              Statistiques
            </Link>
          }
        >
          <ol className="space-y-3">
            {topDishes.map((d, i) => (
              <li key={d.itemId} className="flex items-center gap-3">
                <span className="w-4 text-sm font-semibold tabular-nums text-muted-foreground">{i + 1}</span>
                <SafeImage src={d.image} alt="" wrapperClassName="h-10 w-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                    <p className="shrink-0 text-sm tabular-nums text-ink">{formatPrice(d.revenue)}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${(d.quantity / maxQty) * 100}%` }} />
                    </div>
                    <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">{d.quantity} ventes</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Prochain virement">
          <p className="font-display text-3xl font-bold tabular-nums text-ink">{formatPrice(currentBalance.balance)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prévu le {formatDate(currentBalance.nextPayoutDate, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ventes de la semaine</dt>
              <dd className="tabular-nums text-ink">{formatPrice(currentBalance.gross)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Commission ColeDash</dt>
              <dd className="tabular-nums text-ink">−{formatPrice(currentBalance.commission)}</dd>
            </div>
          </dl>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/marchand/paiements">Détail des paiements</Link>
          </Button>
        </Panel>
      </div>
    </div>
  )
}
