import { useMemo, useState } from 'react'
import { ArrowRight, CalendarClock, Euro, Handshake, Target, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, StatCard } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { FilterSelect, SearchField } from '@/components/admin/Filters'
import ProspectDetailSheet, { type ProspectNote } from '@/components/admin/ProspectDetailSheet'
import { compactEur } from '@/components/admin/tones'
import { priorityLabels, prospects as SEED, statusLabels, typeLabels, type Prospect } from '@/data/prospects'
import { formatDate, formatPrice } from '@/lib/format'

type Status = Prospect['status']
const PIPELINE: Status[] = ['nouveau', 'contacte', 'visite', 'negociation', 'signe']
const COLUMNS: Status[] = [...PIPELINE, 'perdu']
const nextOf = (s: Status): Status | undefined => {
  const i = PIPELINE.indexOf(s)
  return i >= 0 && i < PIPELINE.length - 1 ? PIPELINE[i + 1] : undefined
}
const ME = 'Équipe Ops'

export default function AdminProspecting() {
  const [list, setList] = useState<Prospect[]>(SEED)
  const [notes, setNotes] = useState<Record<string, ProspectNote[]>>(() =>
    Object.fromEntries(SEED.map((p) => [p.id, p.notes ? [{ id: `${p.id}-n0`, at: p.updatedAt, author: p.assignedTo ?? 'Équipe commerciale', body: p.notes }] : []])),
  )
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [priority, setPriority] = useState('all')
  const [owner, setOwner] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const cities = useMemo(() => Array.from(new Set(SEED.map((p) => p.city))).sort(), [])
  const owners = useMemo(() => Array.from(new Set(SEED.map((p) => p.assignedTo).filter(Boolean) as string[])).sort(), [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter(
      (p) =>
        (city === 'all' || p.city === city) &&
        (priority === 'all' || p.priority === priority) &&
        (owner === 'all' || p.assignedTo === owner) &&
        (!q || [p.name, p.address, p.cuisine ?? '', p.decisionMaker ?? ''].some((s) => s.toLowerCase().includes(q))),
    )
  }, [list, query, city, priority, owner])

  const setStatus = (p: Prospect, status: Status) => {
    const today = new Date().toISOString().slice(0, 10)
    setList((l) => l.map((x) => (x.id === p.id ? { ...x, status, updatedAt: today, lastContactDate: today } : x)))
    setNotes((n) => ({
      ...n,
      [p.id]: [{ id: `${p.id}-${Date.now()}`, at: new Date().toISOString(), author: ME, body: `Statut changé : ${statusLabels[p.status].label} → ${statusLabels[status].label}` }, ...(n[p.id] ?? [])],
    }))
    toast.success(status === 'signe' ? `${p.name} a signé !` : status === 'perdu' ? `${p.name} marqué comme perdu` : `${p.name} → ${statusLabels[status].label}`)
  }

  const open = filtered.filter((p) => p.status !== 'signe' && p.status !== 'perdu')
  const pipelineValue = open.reduce((s, p) => s + (p.potentialRevenue ?? 0), 0)
  const signedValue = filtered.filter((p) => p.status === 'signe').reduce((s, p) => s + (p.potentialRevenue ?? 0), 0)
  const closed = filtered.filter((p) => p.status === 'signe' || p.status === 'perdu').length
  const winRate = closed ? Math.round((filtered.filter((p) => p.status === 'signe').length / closed) * 100) : 0
  const selected = list.find((p) => p.id === selectedId) ?? null
  const selectedNext = selected ? nextOf(selected.status) : undefined

  return (
    <div>
      <PortalPageHeader title="Prospection" description="Pipeline d'acquisition des commerces partenaires." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Pipeline ouvert" value={compactEur.format(pipelineValue)} icon={TrendingUp} hint={`${open.length} prospects · potentiel mensuel`} />
        <StatCard label="Signé" value={compactEur.format(signedValue)} icon={Handshake} hint="potentiel mensuel" />
        <StatCard label="Taux de transformation" value={`${winRate} %`} icon={Target} hint="signés / clôturés" />
        <StatCard label="Potentiel total" value={compactEur.format(pipelineValue + signedValue)} icon={Euro} />
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border bg-card p-3 shadow-soft lg:flex-row">
        <SearchField value={query} onChange={setQuery} placeholder="Nom, adresse, cuisine, décideur…" label="Rechercher un prospect" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
          <FilterSelect label="Ville" value={city} onChange={setCity} options={[{ value: 'all', label: 'Toutes les villes' }, ...cities.map((c) => ({ value: c, label: c }))]} />
          <FilterSelect label="Priorité" value={priority} onChange={setPriority} options={[{ value: 'all', label: 'Toutes priorités' }, ...Object.entries(priorityLabels).map(([value, v]) => ({ value, label: v.label }))]} />
          <FilterSelect label="Commercial" value={owner} onChange={setOwner} options={[{ value: 'all', label: 'Tous les commerciaux' }, ...owners.map((o) => ({ value: o, label: o }))]} />
        </div>
      </div>

      <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex snap-x snap-mandatory gap-3">
          {COLUMNS.map((status) => {
            const items = filtered.filter((p) => p.status === status)
            const total = items.reduce((s, p) => s + (p.potentialRevenue ?? 0), 0)
            return (
              <section key={status} className="flex w-[280px] shrink-0 snap-start flex-col rounded-2xl bg-secondary/60 p-2" aria-label={statusLabels[status].label}>
                <header className="flex items-center justify-between px-2 py-2">
                  <h2 className="flex items-center gap-2 font-sans text-sm font-semibold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusLabels[status].color }} aria-hidden />
                    {statusLabels[status].label}
                    <span className="rounded-full bg-card px-1.5 text-xs text-muted-foreground">{items.length}</span>
                  </h2>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">{formatPrice(total)}</span>
                </header>
                <ul className="flex flex-1 flex-col gap-2">
                  {items.map((p) => {
                    const next = nextOf(p.status)
                    return (
                      <li key={p.id} className="rounded-xl border bg-card p-3 shadow-soft">
                        <button type="button" onClick={() => setSelectedId(p.id)} className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-ink">{p.name}</p>
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: priorityLabels[p.priority].color }} title={`Priorité ${priorityLabels[p.priority].label}`} aria-label={`Priorité ${priorityLabels[p.priority].label}`} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {typeLabels[p.type]} · {p.city} {p.postalCode}
                          </p>
                          <p className="mt-2 text-sm font-bold tabular-nums text-ink">{formatPrice(p.potentialRevenue ?? 0)}<span className="text-xs font-normal text-muted-foreground"> / mois</span></p>
                          {p.nextAction && p.status !== 'signe' && p.status !== 'perdu' && (
                            <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                              <CalendarClock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                              <span>
                                {p.nextAction}
                                {p.nextActionDate && ` · ${formatDate(p.nextActionDate, { day: 'numeric', month: 'short' })}`}
                              </span>
                            </p>
                          )}
                        </button>
                        {next && (
                          <Button size="sm" variant="soft" className="mt-3 w-full" onClick={() => setStatus(p, next)}>
                            {statusLabels[next].label} <ArrowRight aria-hidden />
                          </Button>
                        )}
                      </li>
                    )
                  })}
                  {items.length === 0 && <li className="rounded-xl border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">Aucun prospect</li>}
                </ul>
              </section>
            )
          })}
        </div>
      </div>

      <ProspectDetailSheet
        prospect={selected}
        notes={selected ? (notes[selected.id] ?? []) : []}
        nextLabel={selectedNext ? statusLabels[selectedNext].label : undefined}
        onOpenChange={(o) => !o && setSelectedId(null)}
        onAddNote={(body) => {
          if (!selected) return
          setNotes((n) => ({ ...n, [selected.id]: [{ id: `${selected.id}-${Date.now()}`, at: new Date().toISOString(), author: ME, body }, ...(n[selected.id] ?? [])] }))
          toast.success('Note ajoutée')
        }}
        onAdvance={() => selected && selectedNext && setStatus(selected, selectedNext)}
        onLose={() => selected && setStatus(selected, 'perdu')}
      />
    </div>
  )
}
