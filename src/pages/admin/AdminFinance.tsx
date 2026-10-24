import { useMemo, useState } from 'react'
import { Download, Landmark, Percent, Undo2, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatCard, StatusPill, type Tone } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { FilterSelect, SearchField } from '@/components/admin/Filters'
import { compactEur } from '@/components/admin/tones'
import { CHART_COLORS, MONTHLY_FINANCE, TRANSACTIONS, TRANSACTION_LABELS, type Transaction, type TransactionType } from '@/data/portals/admin'
import { formatDate, formatPrice, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'

const TX_STATUS: Record<Transaction['status'], { label: string; tone: Tone }> = {
  reussi: { label: 'Réussi', tone: 'success' },
  en_cours: { label: 'En cours', tone: 'warning' },
  echoue: { label: 'Échoué', tone: 'danger' },
}

const pct = (a: number, b: number) => Math.round(((a - b) / b) * 1000) / 10

export default function AdminFinance() {
  const [type, setType] = useState<'all' | TransactionType>('all')
  const [query, setQuery] = useState('')
  const cur = MONTHLY_FINANCE[MONTHLY_FINANCE.length - 1]
  const prev = MONTHLY_FINANCE[MONTHLY_FINANCE.length - 2]
  const revenue = cur.commissions + cur.fees
  const prevRevenue = prev.commissions + prev.fees

  const chartData = MONTHLY_FINANCE.map((m) => ({ month: m.month, commissions: m.commissions, fees: m.fees }))
  const txs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TRANSACTIONS.filter((t) => (type === 'all' || t.type === type) && (!q || t.label.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q)))
  }, [type, query])

  return (
    <div>
      <PortalPageHeader
        title="Finance"
        description="Revenus de la plateforme, commissions et versements."
        actions={
          <Button variant="outline" onClick={() => toast.success('Export comptable généré (CSV, mois en cours)')}>
            <Download aria-hidden /> Exporter
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Revenus du mois" value={compactEur.format(revenue)} delta={pct(revenue, prevRevenue)} icon={Wallet} hint="commissions + frais" />
        <StatCard label="Commissions" value={compactEur.format(cur.commissions)} delta={pct(cur.commissions, prev.commissions)} icon={Percent} />
        <StatCard label="Versements" value={compactEur.format(cur.merchantPayouts + cur.driverPayouts)} icon={Landmark} hint="commerçants + livreurs" />
        <StatCard label="Remboursements" value={compactEur.format(cur.refunds)} delta={pct(cur.refunds, prev.refunds)} icon={Undo2} hint={`${((cur.refunds / cur.gmv) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} % du volume`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Revenus mensuels" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="#78716c" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="#a8a29e" tickFormatter={(v: number) => compactEur.format(v)} width={64} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4', fontSize: 12 }} cursor={{ fill: 'rgba(28,25,23,0.05)' }} formatter={(v, n) => [formatPrice(Number(v)), String(n)]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="commissions" name="Commissions" stackId="r" fill={CHART_COLORS[0]} stroke="#fff" strokeWidth={1} maxBarSize={32} />
                <Bar dataKey="fees" name="Frais de service et livraison" stackId="r" fill={CHART_COLORS[1]} stroke="#fff" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title={`Répartition · ${cur.month}`}>
          <dl className="space-y-3 text-sm">
            {[
              { label: "Volume d'affaires", value: cur.gmv, strong: true },
              { label: 'Reversé aux commerçants', value: -cur.merchantPayouts },
              { label: 'Rémunération livreurs', value: -cur.driverPayouts },
              { label: 'Remboursements', value: -cur.refunds },
              { label: 'Commissions', value: cur.commissions },
              { label: 'Frais clients', value: cur.fees },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3">
                <dt className={cn(r.strong ? 'font-semibold text-ink' : 'text-muted-foreground')}>{r.label}</dt>
                <dd className={cn('tabular-nums', r.strong && 'font-bold text-ink', r.value < 0 && 'text-red-700')}>{formatPrice(r.value)}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-3">
              <dt className="font-semibold text-ink">Marge nette estimée</dt>
              <dd className="font-bold tabular-nums text-emerald-700">{formatPrice(revenue - cur.driverPayouts - cur.refunds)}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel title="Transactions" className="mt-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <SearchField value={query} onChange={setQuery} placeholder="Libellé ou référence…" label="Rechercher une transaction" />
          <FilterSelect
            label="Type"
            value={type}
            onChange={(v) => setType(v as typeof type)}
            className="sm:w-56"
            options={[{ value: 'all', label: 'Tous les types' }, ...Object.entries(TRANSACTION_LABELS).map(([value, label]) => ({ value, label }))]}
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Date</th>
                <th className="py-2 pr-3 font-semibold">Type</th>
                <th className="py-2 pr-3 font-semibold">Libellé</th>
                <th className="py-2 pr-3 font-semibold">Référence</th>
                <th className="py-2 pr-3 font-semibold">Statut</th>
                <th className="py-2 text-right font-semibold">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {txs.map((t) => (
                <tr key={t.id}>
                  <td className="whitespace-nowrap py-2.5 pr-3 text-muted-foreground">
                    {formatDate(t.at, { day: 'numeric', month: 'short' })} · {formatTime(t.at)}
                  </td>
                  <td className="py-2.5 pr-3">{TRANSACTION_LABELS[t.type]}</td>
                  <td className="py-2.5 pr-3 text-ink">{t.label}</td>
                  <td className="py-2.5 pr-3 font-mono text-xs">{t.reference}</td>
                  <td className="py-2.5 pr-3">
                    <StatusPill tone={TX_STATUS[t.status].tone}>{TX_STATUS[t.status].label}</StatusPill>
                  </td>
                  <td className={cn('py-2.5 text-right font-semibold tabular-nums', t.amount < 0 ? 'text-red-700' : 'text-emerald-700')}>
                    {t.amount > 0 ? '+' : ''}
                    {formatPrice(t.amount)}
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Aucune transaction.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
