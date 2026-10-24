import { useMemo, useState } from 'react'
import { Check, PauseCircle, PlayCircle, Store, X } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatCard, StatusPill } from '@/components/portal/PortalUI'
import SafeImage from '@/components/shared/SafeImage'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilterSelect, SearchField } from '@/components/admin/Filters'
import { VENDOR_STATUS_LABELS, VENDOR_TONES, compactEur } from '@/components/admin/tones'
import { ADMIN_VENDORS, VENDOR_KIND_LABELS, cityName, type AdminVendor, type VendorStatus } from '@/data/portals/admin'
import { cities } from '@/data/cities'
import { formatNumber, formatRelative } from '@/lib/format'
import type { VendorKind } from '@/types'

const COMMISSIONS = [12, 15, 18, 20, 22, 25, 27, 28, 30, 32]

function CommissionSelect({ vendor, onChange }: { vendor: AdminVendor; onChange: (v: number) => void }) {
  return (
    <select
      value={vendor.commission}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={`Commission de ${vendor.name}`}
      className="h-8 rounded-md border bg-background px-2 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {Array.from(new Set([...COMMISSIONS, vendor.commission]))
        .sort((a, b) => a - b)
        .map((c) => (
          <option key={c} value={c}>
            {c} %
          </option>
        ))}
    </select>
  )
}

function Actions({ vendor, onStatus }: { vendor: AdminVendor; onStatus: (s: VendorStatus) => void }) {
  if (vendor.status === 'en_attente')
    return (
      <div className="flex gap-1.5">
        <Button size="sm" onClick={() => onStatus('actif')}>
          <Check aria-hidden /> Approuver
        </Button>
        <Button size="icon-sm" variant="outline" aria-label={`Refuser ${vendor.name}`} onClick={() => onStatus('suspendu')}>
          <X aria-hidden />
        </Button>
      </div>
    )
  if (vendor.status === 'actif')
    return (
      <Button size="sm" variant="outline" onClick={() => onStatus('suspendu')}>
        <PauseCircle aria-hidden /> Suspendre
      </Button>
    )
  return (
    <Button size="sm" variant="soft" onClick={() => onStatus('actif')}>
      <PlayCircle aria-hidden /> Réactiver
    </Button>
  )
}

export default function AdminRestaurants() {
  const [vendors, setVendors] = useState<AdminVendor[]>(ADMIN_VENDORS)
  const [tab, setTab] = useState<'all' | VendorStatus>('all')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'all' | VendorKind>('all')
  const [city, setCity] = useState('all')

  const update = (id: string, patch: Partial<AdminVendor>) => setVendors((l) => l.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  const setStatus = (v: AdminVendor, s: VendorStatus) => {
    update(v.id, { status: s })
    const msg =
      v.status === 'en_attente' && s === 'actif' ? `${v.name} est approuvé et visible par les clients` : s === 'suspendu' ? `${v.name} est suspendu` : `${v.name} est réactivé`
    toast.success(msg)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vendors.filter(
      (v) =>
        (tab === 'all' || v.status === tab) &&
        (kind === 'all' || v.kind === kind) &&
        (city === 'all' || v.cityId === city) &&
        (!q || v.name.toLowerCase().includes(q) || v.owner.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)),
    )
  }, [vendors, tab, query, kind, city])

  const count = (s: VendorStatus) => vendors.filter((v) => v.status === s).length
  const avgCommission = vendors.filter((v) => v.status === 'actif').reduce((s, v, _i, arr) => s + v.commission / arr.length, 0)

  return (
    <div>
      <PortalPageHeader title="Commerces" description="Restaurants, épiceries, fleuristes et boutiques partenaires." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Commerces actifs" value={count('actif')} icon={Store} />
        <StatCard label="En attente de validation" value={count('en_attente')} hint="dossiers à examiner" />
        <StatCard label="Suspendus" value={count('suspendu')} />
        <StatCard label="Commission moyenne" value={`${avgCommission.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`} />
      </div>

      <Panel className="mt-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex h-auto w-full flex-wrap justify-start sm:w-auto">
            <TabsTrigger value="all">Tous · {vendors.length}</TabsTrigger>
            <TabsTrigger value="actif">Actifs · {count('actif')}</TabsTrigger>
            <TabsTrigger value="en_attente">En attente · {count('en_attente')}</TabsTrigger>
            <TabsTrigger value="suspendu">Suspendus · {count('suspendu')}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 flex flex-col gap-2 lg:flex-row">
          <SearchField value={query} onChange={setQuery} placeholder="Nom, gérant, catégorie…" label="Rechercher un commerce" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
            <FilterSelect label="Type" value={kind} onChange={(v) => setKind(v as typeof kind)} options={[{ value: 'all', label: 'Tous les types' }, ...Object.entries(VENDOR_KIND_LABELS).map(([value, label]) => ({ value, label }))]} />
            <FilterSelect label="Ville" value={city} onChange={setCity} options={[{ value: 'all', label: 'Toutes les villes' }, ...cities.filter((c) => c.available).map((c) => ({ value: c.id, label: c.name }))]} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Store} title="Aucun commerce" description="Aucun commerce ne correspond à ces critères." className="mt-4" />
        ) : (
          <>
            <ul className="mt-4 space-y-3 lg:hidden">
              {filtered.map((v) => (
                <li key={v.id} className="rounded-xl border p-3">
                  <div className="flex gap-3">
                    <SafeImage src={v.image} alt="" wrapperClassName="h-14 w-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-ink">{v.name}</p>
                        <StatusPill tone={VENDOR_TONES[v.status]}>{VENDOR_STATUS_LABELS[v.status]}</StatusPill>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {VENDOR_KIND_LABELS[v.kind]} · {v.category} · {cityName(v.cityId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {v.status === 'en_attente' ? `Candidature ${formatRelative(v.joinedAt)}` : `${formatNumber(v.ordersMonth)} commandes · ${compactEur.format(v.gmvMonth)}`}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <CommissionSelect vendor={v} onChange={(c) => { update(v.id, { commission: c }); toast.success(`Commission de ${v.name} fixée à ${c} %`) }} />
                    <Actions vendor={v} onStatus={(s) => setStatus(v, s)} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Commerce</th>
                    <th className="py-2 pr-3 font-semibold">Ville</th>
                    <th className="py-2 pr-3 font-semibold">Statut</th>
                    <th className="py-2 pr-3 text-right font-semibold">Commandes (30 j)</th>
                    <th className="py-2 pr-3 text-right font-semibold">Volume (30 j)</th>
                    <th className="py-2 pr-3 font-semibold">Commission</th>
                    <th className="py-2 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((v) => (
                    <tr key={v.id}>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-3">
                          <SafeImage src={v.image} alt="" wrapperClassName="h-10 w-10 shrink-0 rounded-lg" />
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">{v.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {VENDOR_KIND_LABELS[v.kind]} · {v.category} · {v.owner}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3">{cityName(v.cityId)}</td>
                      <td className="py-2.5 pr-3">
                        <StatusPill tone={VENDOR_TONES[v.status]}>{VENDOR_STATUS_LABELS[v.status]}</StatusPill>
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">{v.status === 'en_attente' ? '—' : formatNumber(v.ordersMonth)}</td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">{v.status === 'en_attente' ? '—' : compactEur.format(v.gmvMonth)}</td>
                      <td className="py-2.5 pr-3">
                        <CommissionSelect vendor={v} onChange={(c) => { update(v.id, { commission: c }); toast.success(`Commission de ${v.name} fixée à ${c} %`) }} />
                      </td>
                      <td className="py-2.5">
                        <div className="flex justify-end">
                          <Actions vendor={v} onStatus={(s) => setStatus(v, s)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
    </div>
  )
}
