import { useMemo, useState } from 'react'
import { Euro, Repeat, ShoppingBag, Star, TrendingDown, TrendingUp, UserPlus, Wallet } from 'lucide-react'
import { Panel, PortalPageHeader, StatCard } from '@/components/portal/PortalUI'
import SafeImage from '@/components/shared/SafeImage'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CategoryDonut, CustomersBarChart, RevenueAreaChart, SlotBarChart } from '@/components/merchant/charts'
import { categoryBreakdown, dishPerformance, ordersBySlot, pctDelta, statsForPeriod, summarize, type DailyStat } from '@/data/portals/merchant'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

type Period = 7 | 30 | 90

const PERIOD_LABELS: Record<Period, string> = { 7: '7 jours', 30: '30 jours', 90: '90 jours' }

/** Groups days into buckets (weekly for long periods) for readable bar charts. */
function bucketCustomers(stats: DailyStat[], period: Period) {
  if (period === 7) {
    return stats.map((d) => ({ label: formatDate(d.date, { weekday: 'short' }), newCustomers: d.newCustomers, returning: d.returningCustomers }))
  }
  const size = 7
  const out: { label: string; newCustomers: number; returning: number }[] = []
  // Full weeks only, counted back from today (a partial oldest week would look like a drop).
  for (let i = stats.length; i - size >= 0; i -= size) {
    const chunk = stats.slice(i - size, i)
    out.unshift({
      label: `Sem. du ${formatDate(chunk[0].date, { day: 'numeric', month: 'short' })}`,
      newCustomers: chunk.reduce((s, d) => s + d.newCustomers, 0),
      returning: chunk.reduce((s, d) => s + d.returningCustomers, 0),
    })
  }
  return out
}

function Trend({ value }: { value: number }) {
  const up = value >= 0
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums', up ? 'text-emerald-600' : 'text-red-600')}>
      {up ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
      {up ? '+' : ''}
      {value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %
    </span>
  )
}

export default function MerchantAnalytics() {
  const [period, setPeriod] = useState<Period>(30)

  const data = useMemo(() => {
    const stats = statsForPeriod(period)
    const prev = statsForPeriod(period, period)
    const cur = summarize(stats)
    const before = summarize(prev)
    const dishes = dishPerformance(period)
    return {
      cur,
      before,
      revenue: stats.map((d) => ({
        label: formatDate(d.date, period === 7 ? { weekday: 'short', day: 'numeric' } : { day: 'numeric', month: 'short' }),
        revenue: d.revenue,
        orders: d.orders,
      })),
      slots: ordersBySlot(stats),
      categories: categoryBreakdown(period),
      dishes,
      customers: bucketCustomers(stats, period),
    }
  }, [period])

  const { cur, before } = data
  const newShare = cur.orders ? Math.round((cur.newCustomers / cur.orders) * 100) : 0
  const retention = cur.orders ? Math.round((cur.returningCustomers / cur.orders) * 100) : 0
  const top = data.dishes.slice(0, 5)
  const flop = [...data.dishes].sort((a, b) => a.revenue - b.revenue).slice(0, 3)
  const peak = data.slots.reduce((m, s) => (s.orders > m.orders ? s : m), data.slots[0])

  return (
    <div>
      <PortalPageHeader
        title="Statistiques"
        description={`Performances des ${PERIOD_LABELS[period]}, comparées à la période précédente.`}
        actions={
          <ToggleGroup
            type="single"
            value={String(period)}
            onValueChange={(v) => v && setPeriod(Number(v) as Period)}
            className="rounded-lg border bg-card p-1"
            aria-label="Période"
          >
            {([7, 30, 90] as Period[]).map((p) => (
              <ToggleGroupItem key={p} value={String(p)} className="h-8 px-3 text-sm data-[state=on]:bg-ink data-[state=on]:text-white">
                {p} j
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Chiffre d'affaires" value={formatPrice(cur.revenue)} delta={pctDelta(cur.revenue, before.revenue)} icon={Euro} />
        <StatCard label="Commandes" value={formatNumber(cur.orders)} delta={pctDelta(cur.orders, before.orders)} icon={ShoppingBag} />
        <StatCard label="Panier moyen" value={formatPrice(cur.basket)} delta={pctDelta(cur.basket, before.basket)} icon={Wallet} />
        <StatCard
          label="Note moyenne"
          value={cur.rating.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
          delta={pctDelta(cur.rating, before.rating)}
          icon={Star}
        />
      </div>

      <Panel title="Chiffre d'affaires" className="mt-6">
        <RevenueAreaChart data={data.revenue} height={280} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Commandes par heure" action={<span className="text-xs text-muted-foreground">Pic : {peak.slot}</span>}>
          <SlotBarChart data={data.slots} />
          <p className="mt-2 text-xs text-muted-foreground">Heure de passage de la commande, service continu de 11h30 à 22h30. Fermé le dimanche.</p>
        </Panel>
        <Panel title="Répartition par catégorie">
          <CategoryDonut data={data.categories} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Clients" className="lg:col-span-2">
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-secondary/60 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserPlus className="h-3.5 w-3.5" aria-hidden /> Nouveaux clients
              </p>
              <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">{formatNumber(cur.newCustomers)}</p>
              <Trend value={pctDelta(cur.newCustomers, before.newCustomers)} />
            </div>
            <div className="rounded-xl bg-secondary/60 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Repeat className="h-3.5 w-3.5" aria-hidden /> Commandes récurrentes
              </p>
              <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">{formatNumber(cur.returningCustomers)}</p>
              <Trend value={pctDelta(cur.returningCustomers, before.returningCustomers)} />
            </div>
            <div className="col-span-2 rounded-xl bg-secondary/60 p-3 sm:col-span-1">
              <p className="text-xs text-muted-foreground">Taux de fidélité</p>
              <p className="mt-1 font-display text-xl font-bold tabular-nums text-ink">{retention} %</p>
              <p className="text-xs text-muted-foreground">{newShare} % de nouveaux clients</p>
            </div>
          </div>
          <CustomersBarChart data={data.customers} />
        </Panel>

        <Panel title="Plats à surveiller">
          <p className="mb-3 text-xs text-muted-foreground">Les 3 plats au chiffre d'affaires le plus faible sur la période.</p>
          <ul className="space-y-3">
            {flop.map((d) => (
              <li key={d.itemId} className="flex items-center gap-3">
                <SafeImage src={d.image} alt="" wrapperClassName="h-10 w-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.quantity} ventes · {formatPrice(d.revenue)}
                  </p>
                </div>
                <Trend value={d.trend} />
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            Astuce : une offre « 1 acheté = 1 offert » sur un dessert relance souvent les ventes en deux semaines.
          </p>
        </Panel>
      </div>

      <Panel title="Performance des plats" className="mt-6">
        <div className="-mx-5 -my-5">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">#</TableHead>
                <TableHead>Plat</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Ventes</TableHead>
                <TableHead className="text-right">CA</TableHead>
                <TableHead className="text-right">Évolution</TableHead>
                <TableHead className="pr-5 text-right">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.dishes.map((d, i) => (
                <TableRow key={d.itemId}>
                  <TableCell className="pl-5 tabular-nums text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <SafeImage src={d.image} alt="" wrapperClassName="h-8 w-8 shrink-0 rounded-md" />
                      <span className="whitespace-nowrap font-medium text-ink">{d.name}</span>
                      {top.some((t) => t.itemId === d.itemId) && i < 3 && (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">Top {i + 1}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.category}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatNumber(d.quantity)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatPrice(d.revenue)}</TableCell>
                  <TableCell className="text-right">
                    <Trend value={d.trend} />
                  </TableCell>
                  <TableCell className="pr-5 text-right tabular-nums">{d.rating.toLocaleString('fr-FR', { minimumFractionDigits: 1 })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
