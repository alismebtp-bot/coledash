import { useState } from 'react'
import { ArrowRight, Calendar, Globe, Mail, MapPin, Phone, Swords, User, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { priorityLabels, sourceLabels, statusLabels, typeLabels, type Prospect } from '@/data/prospects'
import { formatDate, formatPrice } from '@/lib/format'

export interface ProspectNote {
  id: string
  at: string
  author: string
  body: string
}

interface Props {
  prospect: Prospect | null
  notes: ProspectNote[]
  nextLabel?: string
  onOpenChange: (open: boolean) => void
  onAddNote: (body: string) => void
  onAdvance: () => void
  onLose: () => void
}

export default function ProspectDetailSheet({ prospect: p, notes, nextLabel, onOpenChange, onAddNote, onAdvance, onLose }: Props) {
  const [draft, setDraft] = useState('')
  return (
    <Sheet open={Boolean(p)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {p && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle>{p.name}</SheetTitle>
              <SheetDescription>
                {typeLabels[p.type]}
                {p.cuisine && p.cuisine !== typeLabels[p.type] ? ` · ${p.cuisine}` : ''}
                {p.priceRange ? ` · ${p.priceRange}` : ''} · source {sourceLabels[p.source].toLowerCase()}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ background: statusLabels[p.status].color }}>
                {statusLabels[p.status].label}
              </span>
              <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold" style={{ borderColor: priorityLabels[p.priority].color, color: priorityLabels[p.priority].color }}>
                Priorité {priorityLabels[p.priority].label.toLowerCase()}
              </span>
            </div>

            <div className="mt-4 rounded-xl bg-secondary/60 p-4">
              <p className="text-xs text-muted-foreground">Potentiel mensuel estimé</p>
              <p className="font-display text-2xl font-bold tabular-nums text-ink">{formatPrice(p.potentialRevenue ?? 0)}</p>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {p.address}, {p.postalCode} {p.city}</li>
              {p.decisionMaker && <li className="flex gap-2"><User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {p.decisionMaker}</li>}
              {p.phone && <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> <a className="hover:underline" href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a></li>}
              {p.email && <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> <a className="hover:underline" href={`mailto:${p.email}`}>{p.email}</a></li>}
              {p.website && <li className="flex gap-2"><Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> {p.website.replace(/^https?:\/\//, '')}</li>}
              {p.competitors?.length ? <li className="flex gap-2"><Swords className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden /> Déjà chez {p.competitors.join(', ')}</li> : null}
              {p.nextAction && (
                <li className="flex gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span>
                    {p.nextAction}
                    {p.nextActionDate && <span className="text-muted-foreground"> · {formatDate(p.nextActionDate)}</span>}
                  </span>
                </li>
              )}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">Suivi par {p.assignedTo ?? 'personne'}</p>

            {p.status !== 'signe' && p.status !== 'perdu' && (
              <div className="mt-4 flex gap-2">
                {nextLabel && (
                  <Button className="flex-1" onClick={onAdvance}>
                    Passer à « {nextLabel} » <ArrowRight aria-hidden />
                  </Button>
                )}
                <Button variant="outline" onClick={onLose} aria-label="Marquer comme perdu">
                  <XCircle aria-hidden /> Perdu
                </Button>
              </div>
            )}

            <section className="mt-6">
              <h3 className="font-sans text-sm font-semibold text-ink">Notes</h3>
              <form
                className="mt-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!draft.trim()) return
                  onAddNote(draft.trim())
                  setDraft('')
                }}
              >
                <Label htmlFor="prospect-note" className="sr-only">
                  Ajouter une note
                </Label>
                <Textarea id="prospect-note" rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Compte rendu d'appel, objection, prochaine étape…" />
                <div className="mt-2 flex justify-end">
                  <Button type="submit" size="sm" disabled={!draft.trim()}>
                    Ajouter la note
                  </Button>
                </div>
              </form>
              <ol className="mt-3 space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-xl border p-3 text-sm">
                    <p className="text-ink">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {n.author} · {formatDate(n.at, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </li>
                ))}
                {notes.length === 0 && <li className="text-sm text-muted-foreground">Aucune note pour l'instant.</li>}
              </ol>
            </section>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
