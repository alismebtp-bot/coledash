import { useMemo, useState } from 'react'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, StatusPill } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchField } from '@/components/admin/Filters'
import TicketConversation from '@/components/admin/TicketConversation'
import { TICKET_PRIORITY_TONES, TICKET_STATUS_TONES } from '@/components/admin/tones'
import { TICKETS, TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS, type Ticket, type TicketStatus } from '@/data/portals/admin'
import { formatRelative } from '@/lib/format'
import { cn } from '@/lib/utils'

const PRIORITY_ORDER = { urgente: 0, haute: 1, normale: 2, basse: 3 }

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS)
  const [tab, setTab] = useState<'all' | TicketStatus>('ouvert')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(TICKETS[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)

  const lastAt = (t: Ticket) => t.messages[t.messages.length - 1].at
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tickets
      .filter((t) => (tab === 'all' || t.status === tab) && (!q || [t.subject, t.requester, t.id, t.orderNumber ?? ''].some((s) => s.toLowerCase().includes(q))))
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || lastAt(b).localeCompare(lastAt(a)))
  }, [tickets, tab, query])

  const selected = tickets.find((t) => t.id === selectedId)
  const update = (id: string, patch: Partial<Ticket>) => setTickets((l) => l.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const count = (s: TicketStatus) => tickets.filter((t) => t.status === s).length

  return (
    <div>
      <PortalPageHeader title="Support" description={`${count('ouvert')} tickets ouverts · temps de première réponse moyen : 6 min`} />

      <div className="grid overflow-hidden rounded-2xl border bg-card shadow-soft lg:grid-cols-[360px_1fr]">
        <aside className={cn('border-r', mobileOpen && 'hidden lg:block')}>
          <div className="space-y-3 border-b p-4">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ouvert" className="px-1 text-xs">Ouverts</TabsTrigger>
                <TabsTrigger value="en_attente" className="px-1 text-xs">En attente</TabsTrigger>
                <TabsTrigger value="resolu" className="px-1 text-xs">Résolus</TabsTrigger>
                <TabsTrigger value="all" className="px-1 text-xs">Tous</TabsTrigger>
              </TabsList>
            </Tabs>
            <SearchField value={query} onChange={setQuery} placeholder="Sujet, client, n° de commande…" label="Rechercher un ticket" />
          </div>
          {visible.length === 0 ? (
            <EmptyState icon={Inbox} title="Boîte vide" description="Aucun ticket dans cette vue." className="m-4 border-0" />
          ) : (
            <ul className="max-h-[640px] divide-y overflow-y-auto">
              {visible.map((t) => {
                const last = t.messages[t.messages.length - 1]
                const waiting = last.from === 'user' && t.status !== 'resolu'
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(t.id)
                        setMobileOpen(true)
                      }}
                      aria-current={selectedId === t.id}
                      className={cn('block w-full px-4 py-3 text-left transition-colors hover:bg-secondary/50', selectedId === t.id && 'bg-brand-50/70')}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 truncate text-sm font-semibold text-ink">
                          {waiting && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="En attente de réponse" />}
                          <span className="truncate">{t.subject}</span>
                        </p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{formatRelative(last.at)}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.requester} · {t.requesterRole}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{last.body}</p>
                      <div className="mt-1.5 flex gap-1.5">
                        <StatusPill tone={TICKET_PRIORITY_TONES[t.priority]}>{TICKET_PRIORITY_LABELS[t.priority]}</StatusPill>
                        <StatusPill tone={TICKET_STATUS_TONES[t.status]}>{TICKET_STATUS_LABELS[t.status]}</StatusPill>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>

        <section className={cn(!mobileOpen && 'hidden lg:block')}>
          {selected ? (
            <TicketConversation
              key={selected.id}
              ticket={selected}
              onBack={() => setMobileOpen(false)}
              onStatus={(s) => {
                update(selected.id, { status: s })
                toast.success(`Ticket ${selected.id} : ${TICKET_STATUS_LABELS[s].toLowerCase()}`)
              }}
              onPriority={(p) => {
                update(selected.id, { priority: p })
                toast.success(`Priorité ${TICKET_PRIORITY_LABELS[p].toLowerCase()}`)
              }}
              onReply={(body, resolve) => {
                update(selected.id, {
                  status: resolve ? 'resolu' : 'en_attente',
                  messages: [...selected.messages, { id: `m-${Date.now()}`, from: 'agent', author: 'Équipe Ops (Support)', at: new Date().toISOString(), body }],
                })
                toast.success(resolve ? 'Réponse envoyée, ticket résolu' : 'Réponse envoyée')
              }}
            />
          ) : (
            <EmptyState icon={Inbox} title="Sélectionnez un ticket" className="m-6" />
          )}
        </section>
      </div>
    </div>
  )
}
