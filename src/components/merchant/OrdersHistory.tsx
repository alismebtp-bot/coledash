import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { StatusPill } from '@/components/portal/PortalUI'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES, orderItemCount, type MerchantOrder, type MerchantOrderStatus } from '@/data/portals/merchant'
import { formatDate, formatPrice, formatTime, pluralize } from '@/lib/format'

type StatusFilter = 'all' | MerchantOrderStatus
type PeriodFilter = 'today' | 'yesterday' | '7d'

const PAGE = 15

export default function OrdersHistory({ orders, onOpen }: { orders: MerchantOrder[]; onOpen: (o: MerchantOrder) => void }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [period, setPeriod] = useState<PeriodFilter>('7d')
  const [limit, setLimit] = useState(PAGE)

  const filtered = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const t0 = today.getTime()
    const needle = q.trim().toLowerCase()
    return orders
      .filter((o) => {
        const ts = new Date(o.createdAt).getTime()
        if (period === 'today' && ts < t0) return false
        if (period === 'yesterday' && (ts >= t0 || ts < t0 - 86_400_000)) return false
        if (status !== 'all' && o.status !== status) return false
        if (needle && !`${o.number} ${o.customerName}`.toLowerCase().includes(needle)) return false
        return true
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [orders, q, status, period])

  const total = filtered.filter((o) => o.status === 'picked_up').reduce((s, o) => s + o.subtotal, 0)

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="N° de commande ou client" className="pl-9" aria-label="Rechercher une commande" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="sm:w-40" aria-label="Période">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="yesterday">Hier</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="sm:w-44" aria-label="Statut">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {(Object.keys(ORDER_STATUS_LABELS) as MerchantOrderStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {pluralize(filtered.length, 'commande')} · {formatPrice(total)} encaissés
      </p>

      <div className="mt-3 rounded-xl border">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Articles</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, limit).map((o) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => onOpen(o)}>
                <TableCell>
                  <button type="button" className="font-semibold text-ink hover:underline" onClick={() => onOpen(o)}>
                    {o.number}
                  </button>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(o.createdAt, { day: 'numeric', month: 'short' })} · {formatTime(o.createdAt)}
                </TableCell>
                <TableCell className="whitespace-nowrap">{o.customerName}</TableCell>
                <TableCell className="text-right tabular-nums">{orderItemCount(o)}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatPrice(o.subtotal)}</TableCell>
                <TableCell>
                  <StatusPill tone={ORDER_STATUS_TONES[o.status]}>{ORDER_STATUS_LABELS[o.status]}</StatusPill>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucune commande ne correspond à ces filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {filtered.length > limit && (
        <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="mt-3 w-full rounded-lg border py-2 text-sm font-medium text-ink hover:bg-secondary">
          Afficher plus ({filtered.length - limit} restantes)
        </button>
      )}
    </div>
  )
}
