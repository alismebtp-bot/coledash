import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel } from '@/components/portal/PortalUI'
import { DemandBadge } from '@/components/driver/DemandChips'
import { useNow } from '@/components/driver/useDriverToday'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DEMAND_LABELS, SLOT_HOURS, generateSlots, weekStart, type DemandLevel, type ShiftSlot } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const HEAT: Record<DemandLevel, string> = {
  faible: 'border-stone-200 bg-stone-50',
  normale: 'border-amber-200 bg-amber-50',
  forte: 'border-orange-200 bg-orange-50',
  tres_forte: 'border-brand-200 bg-brand-50',
}

const hours = (s: { start: string; end: string }) => {
  const m = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
  return (m(s.end) - m(s.start)) / 60
}
const fmtH = (t: string) => t.replace(':00', ' h').replace(':', ' h ')

function SlotButton({ slot, booked, past, onToggle, compact }: { slot: ShiftSlot; booked: boolean; past: boolean; onToggle: () => void; compact?: boolean }) {
  const full = slot.spots === 0 && !booked
  return (
    <button
      type="button"
      disabled={past || full}
      onClick={onToggle}
      aria-pressed={booked}
      aria-label={`${DAYS[slot.day]} ${fmtH(slot.start)} à ${fmtH(slot.end)}, ${DEMAND_LABELS[slot.demand]}, ${booked ? 'réservé' : full ? 'complet' : 'disponible'}`}
      className={cn(
        'group relative w-full rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-45',
        booked ? 'border-ink bg-ink text-white shadow-soft' : cn(HEAT[slot.demand], 'hover:shadow-soft'),
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold tabular-nums">
          {fmtH(slot.start)} – {fmtH(slot.end)}
        </span>
        <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', booked ? 'bg-white text-ink' : 'border border-current/30 bg-white/70 text-ink')}>
          {booked ? <Check className="h-3 w-3" aria-hidden /> : <Plus className="h-3 w-3" aria-hidden />}
        </span>
      </div>
      {!compact && (
        <p className={cn('mt-1 text-xs', booked ? 'text-white/70' : 'text-muted-foreground')}>
          ~{formatPrice(slot.estimate)} / h · {full ? 'complet' : `${slot.spots} place${slot.spots > 1 ? 's' : ''}`}
        </p>
      )}
      <DemandBadge level={slot.demand} className={cn('mt-2', booked && 'border-white/20')} />
    </button>
  )
}

export default function DriverSchedule() {
  const now = useNow(60000)
  const booked = useDriver((s) => s.booked)
  const toggleSlot = useDriver((s) => s.toggleSlot)
  const [week, setWeek] = useState<'0' | '1'>('0')
  const today = (new Date(now).getDay() + 6) % 7
  const [day, setDay] = useState(today)
  const dayRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    dayRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  const offset = Number(week)
  const slots = useMemo(() => generateSlots(offset), [offset])
  const start = weekStart(-offset, new Date(now))
  const nowMin = new Date(now).getHours() * 60 + new Date(now).getMinutes()
  const isPast = (s: ShiftSlot) => offset === 0 && (s.day < today || (s.day === today && Number(s.end.slice(0, 2)) * 60 + Number(s.end.slice(3)) <= nowMin))

  const mine = slots.filter((s) => booked.includes(s.id))
  const plannedHours = mine.reduce((t, s) => t + hours(s), 0)
  const estimate = mine.reduce((t, s) => t + hours(s) * s.estimate, 0)

  const toggle = (s: ShiftSlot) => {
    const was = booked.includes(s.id)
    toggleSlot(s.id)
    toast[was ? 'message' : 'success'](was ? `Créneau ${DAYS[s.day]} ${fmtH(s.start)} libéré` : `Créneau ${DAYS[s.day]} ${fmtH(s.start)} – ${fmtH(s.end)} réservé`)
  }

  const dateOf = (i: number) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.getDate()
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PortalPageHeader
        title="Planning"
        description="Réservez vos créneaux : vous êtes prioritaire sur les courses pendant vos heures réservées."
        actions={
          <Tabs value={week} onValueChange={(v) => setWeek(v as '0' | '1')}>
            <TabsList>
              <TabsTrigger value="0">Cette semaine</TabsTrigger>
              <TabsTrigger value="1">Semaine prochaine</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'Créneaux', value: mine.length },
          { label: 'Heures prévues', value: `${plannedHours.toLocaleString('fr-FR')} h` },
          { label: 'Gains estimés', value: formatPrice(estimate) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-3 shadow-soft sm:p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums text-ink sm:text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Mobile: day picker + list */}
      <div className="md:hidden">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist" aria-label="Jour">
          {DAYS.map((d, i) => {
            const count = slots.filter((s) => s.day === i && booked.includes(s.id)).length
            return (
              <button
                key={d}
                type="button"
                role="tab"
                ref={day === i ? dayRef : undefined}
                aria-selected={day === i}
                onClick={() => setDay(i)}
                className={cn(
                  'flex w-14 shrink-0 flex-col items-center rounded-2xl border py-2 text-xs font-semibold transition',
                  day === i ? 'border-ink bg-ink text-white' : 'bg-card text-ink',
                )}
              >
                {d}
                <span className="font-display text-lg">{dateOf(i)}</span>
                <span className={cn('mt-0.5 h-1.5 w-1.5 rounded-full', count ? (day === i ? 'bg-brand-500' : 'bg-brand-600') : 'bg-transparent')} aria-hidden />
              </button>
            )
          })}
        </div>
        <div className="mt-3 space-y-2">
          {slots
            .filter((s) => s.day === day)
            .map((s) => (
              <SlotButton key={s.id} slot={s} booked={booked.includes(s.id)} past={isPast(s)} onToggle={() => toggle(s)} />
            ))}
        </div>
      </div>

      {/* Desktop: weekly grid */}
      <Panel className="hidden md:block">
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d, i) => (
            <div key={d} className={cn('rounded-lg py-1 text-center text-sm font-semibold', offset === 0 && i === today ? 'bg-brand-50 text-brand-700' : 'text-ink')}>
              {d} {dateOf(i)}
            </div>
          ))}
          {SLOT_HOURS.map((_, row) =>
            DAYS.map((_d, i) => {
              const s = slots.find((x) => x.day === i && x.id.endsWith(`-s${row}`))
              return s ? <SlotButton key={s.id} slot={s} compact booked={booked.includes(s.id)} past={isPast(s)} onToggle={() => toggle(s)} /> : null
            }),
          )}
        </div>
      </Panel>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarCheck className="h-4 w-4" aria-hidden /> Vous pouvez libérer un créneau jusqu'à 2 heures avant son début sans pénalité.
      </p>
    </div>
  )
}
