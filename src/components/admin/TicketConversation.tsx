import { useState } from 'react'
import { ArrowLeft, MessageSquareQuote, Package, Send } from 'lucide-react'
import { StatusPill } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FilterSelect } from './Filters'
import { TICKET_PRIORITY_TONES, TICKET_STATUS_TONES } from './tones'
import {
  CANNED_RESPONSES,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  cityName,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from '@/data/portals/admin'
import { formatDate, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'

interface Props {
  ticket: Ticket
  onBack: () => void
  onReply: (body: string, resolve: boolean) => void
  onStatus: (s: TicketStatus) => void
  onPriority: (p: TicketPriority) => void
}

export default function TicketConversation({ ticket: t, onBack, onReply, onStatus, onPriority }: Props) {
  const [draft, setDraft] = useState('')

  const send = (resolve: boolean) => {
    if (!draft.trim()) return
    onReply(draft.trim(), resolve)
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-[560px] flex-col">
      <header className="border-b p-4">
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="icon-sm" className="-ml-1 lg:hidden" onClick={onBack} aria-label="Retour à la liste">
            <ArrowLeft aria-hidden />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {t.id} · {t.category}
            </p>
            <h2 className="font-sans text-lg font-semibold text-ink">{t.subject}</h2>
            <p className="text-sm text-muted-foreground">
              {t.requester} ({t.requesterRole}) · {cityName(t.cityId)}
              {t.orderNumber && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-ink">
                  <Package className="h-3 w-3" aria-hidden /> {t.orderNumber}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:flex">
          <FilterSelect label="Statut du ticket" value={t.status} onChange={(v) => onStatus(v as TicketStatus)} options={Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
          <FilterSelect label="Priorité du ticket" value={t.priority} onChange={(v) => onPriority(v as TicketPriority)} options={Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => ({ value, label }))} />
          <div className="col-span-2 hidden items-center gap-2 sm:flex">
            <StatusPill tone={TICKET_STATUS_TONES[t.status]}>{TICKET_STATUS_LABELS[t.status]}</StatusPill>
            <StatusPill tone={TICKET_PRIORITY_TONES[t.priority]}>{TICKET_PRIORITY_LABELS[t.priority]}</StatusPill>
          </div>
        </div>
      </header>

      <ol className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4" aria-live="polite">
        {t.messages.map((m) => (
          <li key={m.id} className={cn('flex', m.from === 'agent' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-soft', m.from === 'agent' ? 'rounded-br-md bg-ink text-white' : 'rounded-bl-md border bg-card text-ink')}>
              <p className={cn('mb-0.5 text-xs font-semibold', m.from === 'agent' ? 'text-white/70' : 'text-muted-foreground')}>{m.author}</p>
              <p className="whitespace-pre-line">{m.body}</p>
              <p className={cn('mt-1 text-[11px]', m.from === 'agent' ? 'text-white/50' : 'text-muted-foreground')}>
                {formatDate(m.at, { day: 'numeric', month: 'short' })} · {formatTime(m.at)}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <form
        className="border-t p-4"
        onSubmit={(e) => {
          e.preventDefault()
          send(false)
        }}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <Label htmlFor="ticket-reply">Répondre à {t.requester.split(' ')[0]}</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" variant="ghost">
                <MessageSquareQuote aria-hidden /> Réponses types
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Insérer une réponse</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CANNED_RESPONSES.map((c) => (
                <DropdownMenuItem key={c.id} onSelect={() => setDraft((d) => (d ? `${d}\n\n${c.body}` : c.body))}>
                  {c.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Textarea id="ticket-reply" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Votre réponse…" />
        <div className="mt-2 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" disabled={!draft.trim()} onClick={() => send(true)}>
            Envoyer et résoudre
          </Button>
          <Button type="submit" disabled={!draft.trim()}>
            <Send aria-hidden /> Envoyer
          </Button>
        </div>
      </form>
    </div>
  )
}
