import { useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import EarningsChart from '@/components/driver/EarningsChart'
import { mergedDayRecords, useNow } from '@/components/driver/useDriverToday'
import { EARNING_SERIES, summarizeDay, weekStart, type EarningRecord } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'
import { formatDate, formatPrice, formatTime, pluralize } from '@/lib/format'

const INSTANT_FEE = 0.5

export default function DriverEarnings() {
  const now = useNow(60000)
  const completed = useDriver((s) => s.completed)
  const payouts = useDriver((s) => s.payouts)
  const payout = useDriver((s) => s.payout)
  const [offset, setOffset] = useState(0)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const week = useMemo(() => {
    const start = weekStart(offset, new Date(now))
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const records: EarningRecord[] = d.getTime() > now ? [] : mergedDayRecords(d, completed, now)
      return { date: d, records, summary: summarizeDay(d, records) }
    })
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    const totals = days.reduce(
      (t, d) => ({
        courses: t.courses + d.summary.courses,
        tips: t.tips + d.summary.tips,
        bonus: t.bonus + d.summary.bonus,
        deliveries: t.deliveries + d.summary.deliveries,
        hours: t.hours + d.summary.hours,
      }),
      { courses: 0, tips: 0, bonus: 0, deliveries: 0, hours: 0 },
    )
    return { start, end, days, totals, total: totals.courses + totals.tips + totals.bonus }
  }, [offset, now, completed])

  // Available balance = current week earnings minus transfers made this week.
  const currentWeekTotal = useMemo(() => {
    if (offset === 0) return week.total
    const start = weekStart(0, new Date(now))
    let t = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      if (d.getTime() > now) break
      const s = summarizeDay(d, mergedDayRecords(d, completed, now))
      t += s.courses + s.tips + s.bonus
    }
    return t
  }, [offset, week.total, now, completed])
  const weekStartMs = weekStart(0, new Date(now)).getTime()
  const paidThisWeek = payouts.filter((p) => new Date(p.at).getTime() >= weekStartMs).reduce((s, p) => s + p.amount + INSTANT_FEE, 0)
  const balance = Math.max(0, Math.round((currentWeekTotal - paidThisWeek) * 100) / 100)

  const history = week.days
    .slice()
    .reverse()
    .filter((d) => d.records.length > 0)

  const label =
    offset === 0 ? 'Cette semaine' : offset === 1 ? 'Semaine dernière' : `Du ${formatDate(week.start, { day: 'numeric', month: 'short' })} au ${formatDate(week.end, { day: 'numeric', month: 'short' })}`

  return (
    <div className="mx-auto max-w-3xl">
      <PortalPageHeader title="Gains" description="Paiement automatique chaque lundi sur votre compte bancaire." />

      <section className="rounded-3xl bg-ink p-5 text-white shadow-lift sm:p-6" aria-label="Solde disponible">
        <p className="text-sm text-white/70">Solde disponible</p>
        <p className="mt-1 font-display text-4xl font-bold tabular-nums">{formatPrice(balance)}</p>
        <p className="mt-1 text-xs text-white/60">Prochain virement automatique lundi · gratuit</p>
        <Button size="lg" className="mt-4 w-full sm:w-auto" disabled={balance <= INSTANT_FEE} onClick={() => setConfirmOpen(true)}>
          <Zap aria-hidden /> Virement instantané
        </Button>
      </section>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border bg-card p-2 shadow-soft">
        <Button variant="ghost" size="icon" onClick={() => { setOffset((o) => Math.min(o + 1, 7)); setExpanded(null) }} disabled={offset >= 7} aria-label="Semaine précédente">
          <ChevronLeft aria-hidden />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(week.start, { day: 'numeric', month: 'long' })} – {formatDate(week.end, { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => { setOffset((o) => Math.max(o - 1, 0)); setExpanded(null) }} disabled={offset === 0} aria-label="Semaine suivante">
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <Panel className="mt-4">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Total de la semaine</p>
            <p className="font-display text-3xl font-bold tabular-nums text-ink">{formatPrice(week.total)}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {pluralize(week.totals.deliveries, 'course')} · {week.totals.hours.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} h en ligne
          </p>
        </div>
        <EarningsChart days={week.days.map((d) => d.summary)} />
        <dl className="mt-4 grid grid-cols-3 gap-2">
          {EARNING_SERIES.map((s) => (
            <div key={s.key} className="rounded-xl bg-secondary/60 p-3">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden />
                {s.label}
              </dt>
              <dd className="mt-1 text-sm font-bold tabular-nums text-ink sm:text-base">{formatPrice(week.totals[s.key])}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {payouts.length > 0 && offset === 0 && (
        <Panel title="Virements récents" className="mt-4">
          <ul className="-my-2 divide-y">
            {payouts.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <span>
                  <span className="font-semibold text-ink">Virement instantané</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatDate(p.at, { day: 'numeric', month: 'long' })} à {formatTime(p.at)} · frais {formatPrice(INSTANT_FEE)}
                  </span>
                </span>
                <span className="font-bold tabular-nums text-ink">{formatPrice(p.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel title="Historique des courses" className="mt-4">
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune course sur cette période.</p>
        ) : (
          <div className="space-y-5">
            {history.map((d, i) => {
              const key = d.date.toISOString()
              const isOpen = expanded === null ? i === 0 : expanded === key
              return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? '' : key)}
                  aria-expanded={isOpen}
                  className="mb-1 flex w-full items-center justify-between gap-2 rounded-lg py-1 text-left"
                >
                  <span>
                    <span className="block font-sans text-sm font-semibold capitalize text-ink">{formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    <span className="block text-xs text-muted-foreground">{pluralize(d.records.length, 'course')}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-ink">
                    {formatPrice(d.summary.courses + d.summary.tips + d.summary.bonus)}
                    <ChevronDown className={isOpen ? 'h-4 w-4 rotate-180 text-muted-foreground transition-transform' : 'h-4 w-4 text-muted-foreground transition-transform'} aria-hidden />
                  </span>
                </button>
                {isOpen && (
                <ul className="divide-y rounded-xl border">
                  {d.records.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{r.merchantName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatTime(r.at)} · {r.distanceKm.toLocaleString('fr-FR')} km · {r.dropoffAddress}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-ink">{formatPrice(r.pay + r.tip + r.bonus)}</p>
                        {(r.tip > 0 || r.bonus > 0) && (
                          <p className="text-[11px] text-emerald-700">
                            {r.tip > 0 && `+${formatPrice(r.tip)} pourboire`}
                            {r.tip > 0 && r.bonus > 0 && ' · '}
                            {r.bonus > 0 && `+${formatPrice(r.bonus)} bonus`}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                )}
              </div>
              )
            })}
          </div>
        )}
      </Panel>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Virement instantané</DialogTitle>
            <DialogDescription>Les fonds arrivent sur votre compte en quelques minutes, même le week-end.</DialogDescription>
          </DialogHeader>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Montant</dt><dd className="font-semibold tabular-nums">{formatPrice(balance - INSTANT_FEE)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Frais</dt><dd className="tabular-nums">{formatPrice(INSTANT_FEE)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Vers</dt><dd>IBAN FR76 •••• 4421</dd></div>
          </dl>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                const amount = Math.round((balance - INSTANT_FEE) * 100) / 100
                payout(amount)
                setConfirmOpen(false)
                toast.success(`Virement de ${formatPrice(amount)} envoyé`)
              }}
            >
              Confirmer le virement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
