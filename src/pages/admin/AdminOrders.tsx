import { useMemo, useState } from 'react'
import { ChevronRight, PackageSearch } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatusPill } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { FilterSelect, SearchField } from '@/components/admin/Filters'
import OrderDetailSheet from '@/components/admin/OrderDetailSheet'
import { ORDER_TONES } from '@/components/admin/tones'
import { ADMIN_ORDERS, ADMIN_STATUS_LABELS, LIVE_CITY_IDS, VENDOR_KIND_LABELS, cityName, type AdminOrder } from '@/data/portals/admin'
import { formatPrice, formatRelative, formatTime } from '@/lib/format'
import type { OrderStatus, VendorKind } from '@/types'

const PAGE = 20

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(ADMIN_ORDERS)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [city, setCity] = useState('all')
  const [kind, setKind] = useState<'all' | VendorKind>('all')
  const [limit, setLimit] = useState(PAGE)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter(
      (o) =>
        (status === 'all' || o.status === status) &&
        (city === 'all' || o.cityId === city) &&
        (kind === 'all' || o.vendorKind === kind) &&
        (!q || [o.number, o.customer, o.vendorName, o.driver ?? ''].some((s) => s.toLowerCase().includes(q))),
    )
  }, [orders, query, status, city, kind])

  const selected = orders.find((o) => o.id === selectedId) ?? null
  const update = (id: string, patch: Partial<AdminOrder>) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  const resetPaging = () => setLimit(PAGE)

  const counts = useMemo(() => {
    const c: Partial<Record<OrderStatus, number>> = {}
    orders.forEach((o) => (c[o.status] = (c[o.status] ?? 0) + 1))
    return c
  }, [orders])

  return (
    <div>
      <PortalPageHeader title="Commandes" description={`${orders.length} commandes sur les dernières 48 heures.`} />

      <div className="mb-4 flex flex-wrap gap-2">
        {(['confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'] as OrderStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStatus(status === s ? 'all' : s)
              resetPaging()
            }}
            aria-pressed={status === s}
            className="rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-ink shadow-soft transition hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
          >
            {ADMIN_STATUS_LABELS[s]} · {counts[s] ?? 0}
          </button>
        ))}
      </div>

      <Panel>
        <div className="flex flex-col gap-2 lg:flex-row">
          <SearchField value={query} onChange={(v) => { setQuery(v); resetPaging() }} placeholder="N° de commande, client, commerce, livreur…" label="Rechercher une commande" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
            <FilterSelect
              label="Statut"
              value={status}
              onChange={(v) => { setStatus(v as typeof status); resetPaging() }}
              options={[{ value: 'all', label: 'Tous les statuts' }, ...Object.entries(ADMIN_STATUS_LABELS).map(([value, label]) => ({ value, label }))]}
            />
            <FilterSelect
              label="Ville"
              value={city}
              onChange={(v) => { setCity(v); resetPaging() }}
              options={[{ value: 'all', label: 'Toutes les villes' }, ...LIVE_CITY_IDS.map((id) => ({ value: id, label: cityName(id) }))]}
            />
            <FilterSelect
              label="Type de commerce"
              value={kind}
              onChange={(v) => { setKind(v as typeof kind); resetPaging() }}
              options={[{ value: 'all', label: 'Tous les commerces' }, ...Object.entries(VENDOR_KIND_LABELS).map(([value, label]) => ({ value, label }))]}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={PackageSearch} title="Aucune commande trouvée" description="Modifiez la recherche ou les filtres." className="mt-4" />
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="mt-4 divide-y rounded-xl border md:hidden">
              {filtered.slice(0, limit).map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => setSelectedId(o.id)} className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-secondary/50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{o.number} · {o.vendorName}</p>
                      <p className="truncate text-xs text-muted-foreground">{o.customer} · {cityName(o.cityId)} · {formatRelative(o.createdAt)}</p>
                      <div className="mt-1"><StatusPill tone={ORDER_TONES[o.status]}>{ADMIN_STATUS_LABELS[o.status]}</StatusPill></div>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{formatPrice(o.total)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Commande</th>
                    <th className="py-2 pr-3 font-semibold">Client</th>
                    <th className="py-2 pr-3 font-semibold">Commerce</th>
                    <th className="py-2 pr-3 font-semibold">Ville</th>
                    <th className="py-2 pr-3 font-semibold">Statut</th>
                    <th className="py-2 pr-3 text-right font-semibold">Total</th>
                    <th className="py-2"><span className="sr-only">Détail</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.slice(0, limit).map((o) => (
                    <tr key={o.id} className="cursor-pointer hover:bg-secondary/40" onClick={() => setSelectedId(o.id)}>
                      <td className="py-2.5 pr-3">
                        <p className="font-semibold text-ink">{o.number}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(o.createdAt)} · {formatRelative(o.createdAt)}</p>
                      </td>
                      <td className="py-2.5 pr-3">{o.customer}</td>
                      <td className="py-2.5 pr-3">
                        <p>{o.vendorName}</p>
                        <p className="text-xs text-muted-foreground">{VENDOR_KIND_LABELS[o.vendorKind]}</p>
                      </td>
                      <td className="py-2.5 pr-3">{cityName(o.cityId)}</td>
                      <td className="py-2.5 pr-3">
                        <StatusPill tone={ORDER_TONES[o.status]}>{ADMIN_STATUS_LABELS[o.status]}</StatusPill>
                        {o.refunded ? <span className="ml-1.5 text-xs font-semibold text-red-700">Remb.</span> : null}
                      </td>
                      <td className="py-2.5 pr-3 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Voir la commande ${o.number}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedId(o.id)
                          }}
                        >
                          <ChevronRight aria-hidden />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {Math.min(limit, filtered.length)} sur {filtered.length}
              </span>
              {limit < filtered.length && (
                <Button variant="outline" size="sm" onClick={() => setLimit((l) => l + PAGE)}>
                  Afficher plus
                </Button>
              )}
            </div>
          </>
        )}
      </Panel>

      <OrderDetailSheet
        order={selected}
        onOpenChange={(o) => !o && setSelectedId(null)}
        onRefund={(o, amount) => {
          update(o.id, { refunded: Math.round(((o.refunded ?? 0) + amount) * 100) / 100 })
          toast.success(`${formatPrice(amount)} remboursés à ${o.customer}`)
        }}
        onCancel={(o) => {
          update(o.id, { status: 'cancelled', refunded: o.total })
          toast.success(`Commande ${o.number} annulée et remboursée`)
        }}
      />
    </div>
  )
}
