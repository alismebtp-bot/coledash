import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, AlertTriangle, Bike, CheckCircle2, Info, ShoppingBag, Users, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PortalPageHeader, Panel, StatCard, StatusPill } from '@/components/portal/PortalUI'
import { useNow } from '@/components/driver/useDriverToday'
import { ORDER_TONES, compactEur } from '@/components/admin/tones'
import { ADMIN_ORDERS, ADMIN_STATUS_LABELS, CITY_METRICS, DAILY_ORDERS, INCIDENTS, LIVE_CITY_IDS, cityColor, cityName, type IncidentSeverity } from '@/data/portals/admin'
import { createRng } from '@/data/portals/driver'
import { formatNumber, formatPrice, formatRelative } from '@/lib/format'

const SEVERITY = {
  critique: { icon: AlertOctagon, tone: 'danger', label: 'Critique' },
  majeur: { icon: AlertTriangle, tone: 'warning', label: 'Majeur' },
  mineur: { icon: Info, tone: 'info', label: 'Mineur' },
} as const satisfies Record<IncidentSeverity, unknown>

const tooltipStyle = { borderRadius: 12, border: '1px solid #e7e5e4', fontSize: 12 }

export default function AdminOverview() {
  const now = useNow(5000)
  const live = CITY_METRICS.filter((m) => LIVE_CITY_IDS.includes(m.cityId))
  const totals = live.reduce(
    (t, m) => ({ gmv: t.gmv + m.gmvMonth, orders: t.orders + m.ordersToday, customers: t.customers + m.activeCustomers, drivers: t.drivers + m.driversOnline }),
    { gmv: 0, orders: 0, customers: 0, drivers: 0 },
  )
  // Live counter: seeded wobble per 5-second tick, so it "breathes" without Math.random.
  const liveOrders = useMemo(() => {
    const rng = createRng(Math.floor(now / 5000))
    return 412 + Math.floor(rng() * 40) - 20
  }, [now])
  const perCity = live.map((m) => ({ city: cityName(m.cityId), cityId: m.cityId, gmv: m.gmvMonth, orders: m.ordersMonth }))
  const recent = ADMIN_ORDERS.slice(0, 6)

  return (
    <div>
      <PortalPageHeader
        title="Vue d'ensemble"
        description="Activité de la plateforme sur les 4 villes ouvertes."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold text-ink shadow-soft" aria-live="polite">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            {liveOrders} commandes en cours
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Volume d'affaires (30 j)" value={compactEur.format(totals.gmv)} delta={12.4} icon={Wallet} hint="vs mois précédent" />
        <StatCard label="Commandes aujourd'hui" value={formatNumber(totals.orders)} delta={6.1} icon={ShoppingBag} hint="vs J-7" />
        <StatCard label="Clients actifs" value={formatNumber(totals.customers)} delta={3.8} icon={Users} hint="30 derniers jours" />
        <StatCard label="Livreurs en ligne" value={formatNumber(totals.drivers)} delta={-2.3} icon={Bike} hint="en ce moment" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Commandes par jour et par ville" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_ORDERS} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={11} stroke="#78716c" interval="preserveStartEnd" minTickGap={16} />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#a8a29e" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatNumber(Number(v)), String(n)]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                {LIVE_CITY_IDS.map((id) => (
                  <Line key={id} type="monotone" dataKey={id} name={cityName(id)} stroke={cityColor(id)} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Volume d'affaires par ville (30 j)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perCity} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#e7e5e4" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} stroke="#a8a29e" tickFormatter={(v: number) => compactEur.format(v)} />
                <YAxis type="category" dataKey="city" tickLine={false} axisLine={false} fontSize={12} stroke="#57534e" width={72} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(28,25,23,0.05)' }} formatter={(v) => [formatPrice(Number(v)), "Volume d'affaires"]} />
                <Bar dataKey="gmv" fill="#e11d48" radius={[0, 4, 4, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Incidents récents" action={<StatusPill tone="danger">{INCIDENTS.filter((i) => !i.resolved).length} ouverts</StatusPill>}>
          <ul className="-my-2 divide-y">
            {INCIDENTS.map((inc) => {
              const s = SEVERITY[inc.severity]
              const Icon = inc.resolved ? CheckCircle2 : s.icon
              return (
                <li key={inc.id} className="flex items-start gap-3 py-3">
                  <Icon className={inc.resolved ? 'mt-0.5 h-5 w-5 shrink-0 text-emerald-600' : 'mt-0.5 h-5 w-5 shrink-0 text-ink'} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{inc.title}</p>
                      <StatusPill tone={inc.resolved ? 'success' : s.tone}>{inc.resolved ? 'Résolu' : s.label}</StatusPill>
                    </div>
                    <p className="text-sm text-muted-foreground">{inc.detail}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cityName(inc.cityId)} · {formatRelative(inc.at)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Panel>

        <Panel title="Dernières commandes" action={<Link to="/admin/commandes" className="text-sm font-semibold text-brand-700 hover:underline">Tout voir</Link>}>
          <ul className="-my-2 divide-y">
            {recent.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {o.number} · {o.vendorName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.customer} · {cityName(o.cityId)} · {formatRelative(o.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-bold tabular-nums text-ink">{formatPrice(o.total)}</span>
                  <StatusPill tone={ORDER_TONES[o.status]}>{ADMIN_STATUS_LABELS[o.status]}</StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Indicateurs par ville" className="mt-4">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-semibold">Ville</th>
                <th className="pb-2 text-right font-semibold">Commandes (30 j)</th>
                <th className="pb-2 text-right font-semibold">Clients actifs</th>
                <th className="pb-2 text-right font-semibold">Livreurs en ligne</th>
                <th className="pb-2 text-right font-semibold">Délai moyen</th>
                <th className="pb-2 text-right font-semibold">Satisfaction</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {live.map((m) => (
                <tr key={m.cityId}>
                  <td className="py-2.5 font-semibold text-ink">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: cityColor(m.cityId) }} aria-hidden />
                    {cityName(m.cityId)}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">{formatNumber(m.ordersMonth)}</td>
                  <td className="py-2.5 text-right tabular-nums">{formatNumber(m.activeCustomers)}</td>
                  <td className="py-2.5 text-right tabular-nums">{m.driversOnline}</td>
                  <td className="py-2.5 text-right tabular-nums">{m.avgDeliveryMinutes} min</td>
                  <td className="py-2.5 text-right tabular-nums">{m.satisfaction.toLocaleString('fr-FR')} / 5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
