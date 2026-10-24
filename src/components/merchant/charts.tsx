import type { ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CHART_COLORS } from '@/data/portals/merchant'
import { formatNumber, formatPrice } from '@/lib/format'

const AXIS = { fontSize: 11, fill: 'hsl(25 6% 42%)' }
const GRID = 'hsl(30 18% 90%)'

interface TooltipRow {
  label: string
  value: string
  color?: string
}

function TooltipBox({ title, rows }: { title: ReactNode; rows: TooltipRow[] }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-lift">
      <p className="mb-1 font-semibold text-ink">{title}</p>
      {rows.map((r) => (
        <p key={r.label} className="flex items-center gap-2 text-muted-foreground">
          {r.color && <span className="h-2 w-2 rounded-full" style={{ background: r.color }} aria-hidden />}
          <span>{r.label}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums text-ink">{r.value}</span>
        </p>
      ))}
    </div>
  )
}

const compactEur = (v: number) => (v >= 1000 ? `${formatNumber(Math.round(v / 100) / 10)} k€` : `${Math.round(v)} €`)

export interface RevenuePoint {
  label: string
  revenue: number
  orders: number
}

export function RevenueAreaChart({ data, height = 260 }: { data: RevenuePoint[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Évolution du chiffre d'affaires">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="merchant-rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} minTickGap={16} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={compactEur} width={56} />
          <Tooltip
            cursor={{ stroke: 'hsl(24 10% 10% / 0.25)', strokeWidth: 1 }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox
                  title={label}
                  rows={[
                    { label: "Chiffre d'affaires", value: formatPrice(Number(payload[0].payload.revenue)), color: CHART_COLORS[0] },
                    { label: 'Commandes', value: formatNumber(Number(payload[0].payload.orders)) },
                  ]}
                />
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            fill="url(#merchant-rev)"
            activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SlotBarChart({ data, height = 240 }: { data: { slot: string; orders: number }[]; height?: number }) {
  const max = Math.max(...data.map((d) => d.orders))
  return (
    <div style={{ height }} role="img" aria-label="Commandes par heure">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap={6}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="slot" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'hsl(33 30% 92% / 0.6)' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <TooltipBox title={`Entre ${label} et ${Number(String(label).replace('h', '')) + 1}h`} rows={[{ label: 'Commandes', value: formatNumber(Number(payload[0].value)) }]} />
              ) : null
            }
          />
          <Bar dataKey="orders" radius={[4, 4, 0, 0]} maxBarSize={44}>
            {data.map((d) => (
              <Cell key={d.slot} fill={d.orders === max ? CHART_COLORS[0] : 'hsl(347 77% 50% / 0.35)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryDonut({ data }: { data: { name: string; revenue: number }[] }) {
  const total = data.reduce((s, d) => s + d.revenue, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-48 w-48 shrink-0" role="img" aria-label="Répartition du chiffre d'affaires par catégorie">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="revenue" nameKey="name" innerRadius="62%" outerRadius="100%" paddingAngle={2} stroke="#fff" strokeWidth={2}>
              {data.map((d, i) => (
                <Cell key={d.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <TooltipBox
                    title={String(payload[0].name)}
                    rows={[
                      { label: 'CA', value: formatPrice(Number(payload[0].value)) },
                      { label: 'Part', value: `${Math.round((Number(payload[0].value) / total) * 100)} %` },
                    ]}
                  />
                ) : null
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-muted-foreground">Total</span>
          <span className="font-display text-lg font-bold tabular-nums text-ink">{compactEur(total)}</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} aria-hidden />
            <span className="text-ink">{d.name}</span>
            <span className="ml-auto tabular-nums text-muted-foreground">{Math.round((d.revenue / total) * 100)} %</span>
            <span className="w-24 text-right font-medium tabular-nums text-ink">{formatPrice(d.revenue)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CustomersBarChart({ data, height = 240 }: { data: { label: string; newCustomers: number; returning: number }[]; height?: number }) {
  return (
    <div>
      <div className="mb-2 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS[1] }} />Clients récurrents</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: CHART_COLORS[0] }} />Nouveaux clients</span>
      </div>
      <div style={{ height }} role="img" aria-label="Nouveaux clients et clients récurrents">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barCategoryGap={8}>
            <CartesianGrid vertical={false} stroke={GRID} />
            <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} minTickGap={8} />
            <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'hsl(33 30% 92% / 0.6)' }}
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <TooltipBox
                    title={label}
                    rows={[
                      { label: 'Récurrents', value: formatNumber(Number(payload[0].payload.returning)), color: CHART_COLORS[1] },
                      { label: 'Nouveaux', value: formatNumber(Number(payload[0].payload.newCustomers)), color: CHART_COLORS[0] },
                    ]}
                  />
                ) : null
              }
            />
            <Bar dataKey="returning" stackId="c" fill={CHART_COLORS[1]} stroke="#fff" strokeWidth={1} maxBarSize={40} />
            <Bar dataKey="newCustomers" stackId="c" fill={CHART_COLORS[0]} stroke="#fff" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
