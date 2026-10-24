import { useMemo, useState, type ReactNode } from 'react'
import { Ban, Bike, ShieldCheck, Store, UserRound, Users } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatCard, StatusPill } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilterSelect, SearchField } from '@/components/admin/Filters'
import {
  ADMIN_CUSTOMERS,
  ADMIN_DRIVERS,
  ADMIN_MERCHANT_USERS,
  LIVE_CITY_IDS,
  VENDOR_KIND_LABELS,
  cityName,
  type UserStatus,
} from '@/data/portals/admin'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'

interface BaseUser {
  id: string
  name: string
  email: string
  phone: string
  cityId: string
  createdAt: string
  status: UserStatus
}

interface Column<T> {
  label: string
  align?: 'right'
  render: (u: T) => ReactNode
}

function UserTable<T extends BaseUser>({
  users,
  columns,
  onToggle,
}: {
  users: T[]
  columns: Column<T>[]
  onToggle: (u: T) => void
}) {
  if (users.length === 0) return <EmptyState icon={Users} title="Aucun utilisateur" description="Aucun résultat pour cette recherche." className="mt-4" />
  const action = (u: T) =>
    u.status === 'actif' ? (
      <Button size="sm" variant="outline" onClick={() => onToggle(u)} aria-label={`Bloquer ${u.name}`}>
        <Ban aria-hidden /> Bloquer
      </Button>
    ) : (
      <Button size="sm" variant="soft" onClick={() => onToggle(u)} aria-label={`Débloquer ${u.name}`}>
        <ShieldCheck aria-hidden /> Débloquer
      </Button>
    )
  return (
    <>
      <ul className="mt-4 divide-y rounded-xl border md:hidden">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-ink">
              {u.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                {u.name} {u.status === 'bloque' && <StatusPill tone="danger">Bloqué</StatusPill>}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {u.email} · {cityName(u.cityId)}
              </p>
            </div>
            {action(u)}
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Nom</th>
              <th className="py-2 pr-3 font-semibold">Ville</th>
              {columns.map((c) => (
                <th key={c.label} className={c.align === 'right' ? 'py-2 pr-3 text-right font-semibold' : 'py-2 pr-3 font-semibold'}>
                  {c.label}
                </th>
              ))}
              <th className="py-2 pr-3 font-semibold">Statut</th>
              <th className="py-2 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="py-2.5 pr-3">
                  <p className="font-semibold text-ink">{u.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.email} · {u.phone}
                  </p>
                </td>
                <td className="py-2.5 pr-3">{cityName(u.cityId)}</td>
                {columns.map((c) => (
                  <td key={c.label} className={c.align === 'right' ? 'py-2.5 pr-3 text-right tabular-nums' : 'py-2.5 pr-3'}>
                    {c.render(u)}
                  </td>
                ))}
                <td className="py-2.5 pr-3">
                  <StatusPill tone={u.status === 'actif' ? 'success' : 'danger'}>{u.status === 'actif' ? 'Actif' : 'Bloqué'}</StatusPill>
                </td>
                <td className="py-2.5 text-right">{action(u)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function useToggleable<T extends BaseUser>(initial: T[]) {
  const [list, setList] = useState(initial)
  const toggle = (u: T) => {
    const next: UserStatus = u.status === 'actif' ? 'bloque' : 'actif'
    setList((l) => l.map((x) => (x.id === u.id ? { ...x, status: next } : x)))
    toast.success(next === 'bloque' ? `${u.name} est bloqué` : `${u.name} est débloqué`, {
      action: { label: 'Annuler', onClick: () => setList((l) => l.map((x) => (x.id === u.id ? { ...x, status: u.status } : x))) },
    })
  }
  return [list, toggle] as const
}

export default function AdminUsers() {
  const [tab, setTab] = useState('clients')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [customers, toggleCustomer] = useToggleable(ADMIN_CUSTOMERS)
  const [drivers, toggleDriver] = useToggleable(ADMIN_DRIVERS)
  const [merchants, toggleMerchant] = useToggleable(ADMIN_MERCHANT_USERS)

  const match = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (u: BaseUser & { vendorName?: string }) =>
      (city === 'all' || u.cityId === city) && (!q || [u.name, u.email, u.phone, u.vendorName ?? ''].some((s) => s.toLowerCase().includes(q)))
  }, [query, city])

  const blocked = [...customers, ...drivers, ...merchants].filter((u) => u.status === 'bloque').length

  return (
    <div>
      <PortalPageHeader title="Utilisateurs" description="Clients, livreurs et commerçants inscrits sur la plateforme." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Clients" value={formatNumber(customers.length)} icon={UserRound} hint="échantillon affiché" />
        <StatCard label="Livreurs" value={formatNumber(drivers.length)} icon={Bike} hint={`${drivers.filter((d) => d.online).length} en ligne`} />
        <StatCard label="Commerçants" value={formatNumber(merchants.length)} icon={Store} />
        <StatCard label="Comptes bloqués" value={blocked} icon={Ban} />
      </div>

      <Panel className="mt-4">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <TabsList className="self-start">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="livreurs">Livreurs</TabsTrigger>
              <TabsTrigger value="commercants">Commerçants</TabsTrigger>
            </TabsList>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row">
              <SearchField value={query} onChange={setQuery} placeholder="Nom, e-mail, téléphone…" label="Rechercher un utilisateur" />
              <FilterSelect label="Ville" value={city} onChange={setCity} options={[{ value: 'all', label: 'Toutes les villes' }, ...LIVE_CITY_IDS.map((id) => ({ value: id, label: cityName(id) }))]} />
            </div>
          </div>

          <TabsContent value="clients">
            <UserTable
              users={customers.filter(match)}
              onToggle={toggleCustomer}
              columns={[
                { label: 'Inscription', render: (u) => formatDate(u.createdAt) },
                { label: 'Commandes', align: 'right', render: (u) => u.orders },
                { label: 'Dépensé', align: 'right', render: (u) => formatPrice(u.spent) },
              ]}
            />
          </TabsContent>
          <TabsContent value="livreurs">
            <UserTable
              users={drivers.filter(match)}
              onToggle={toggleDriver}
              columns={[
                { label: 'Véhicule', render: (u) => u.vehicle },
                { label: 'Courses', align: 'right', render: (u) => formatNumber(u.deliveries) },
                { label: 'Note', align: 'right', render: (u) => `${u.rating.toLocaleString('fr-FR')} ★` },
                {
                  label: 'Disponibilité',
                  render: (u) => (
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <span className={u.online ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-stone-300'} aria-hidden />
                      {u.online ? 'En ligne' : 'Hors ligne'}
                    </span>
                  ),
                },
              ]}
            />
          </TabsContent>
          <TabsContent value="commercants">
            <UserTable
              users={merchants.filter(match)}
              onToggle={toggleMerchant}
              columns={[
                { label: 'Commerce', render: (u) => u.vendorName },
                { label: 'Type', render: (u) => VENDOR_KIND_LABELS[u.vendorKind] },
                { label: 'Depuis', render: (u) => formatDate(u.createdAt, { month: 'short', year: 'numeric' }) },
              ]}
            />
          </TabsContent>
        </Tabs>
      </Panel>
    </div>
  )
}
