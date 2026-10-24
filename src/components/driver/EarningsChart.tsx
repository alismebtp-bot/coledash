import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EARNING_SERIES, type DayEarnings } from '@/data/portals/driver'
import { formatPrice } from '@/lib/format'


export default function EarningsChart({ days }: { days: DayEarnings[] }) {
  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={days} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid vertical={false} stroke="#e7e5e4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="#78716c" />
          <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#a8a29e" tickFormatter={(v: number) => `${v} €`} />
          <Tooltip
            cursor={{ fill: 'rgba(28,25,23,0.05)' }}
            formatter={(value, name) => [formatPrice(Number(value)), String(name)]}
            contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4', fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          {EARNING_SERIES.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="e"
              fill={s.color}
              stroke="#fff"
              strokeWidth={1}
              radius={i === EARNING_SERIES.length - 1 ? [4, 4, 0, 0] : 0}
              maxBarSize={36}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
