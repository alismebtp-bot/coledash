import { useMemo } from 'react'
import { CalendarClock, Zap } from 'lucide-react'
import { OptionTile } from './CheckoutSection'
import { cn } from '@/lib/utils'
import { dayDate, slotEnd, type SlotValue } from './slots'

const OPEN_MIN = 11 * 60
const CLOSE_MIN = 22 * 60 + 30

function slotsFor(dayOffset: number, now: Date): string[] {
  const earliest = dayOffset === 0 ? now.getHours() * 60 + now.getMinutes() + 45 : OPEN_MIN
  const out: string[] = []
  for (let m = OPEN_MIN; m <= CLOSE_MIN; m += 30) {
    if (m < earliest) continue
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  }
  return out
}

function dayLabel(offset: number, now: Date): { top: string; bottom: string } {
  const d = dayDate(offset, now)
  const top = offset === 0 ? 'Aujourd’hui' : offset === 1 ? 'Demain' : d.toLocaleDateString('fr-FR', { weekday: 'long' })
  return { top: top.charAt(0).toUpperCase() + top.slice(1), bottom: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) }
}

interface Props {
  value: SlotValue
  onChange: (v: SlotValue) => void
  asapLabel?: string
  invalid?: boolean
}

export default function SlotStep({ value, onChange, asapLabel = '25-40 min', invalid }: Props) {
  const now = useMemo(() => new Date(), [])
  const days = useMemo(() => [0, 1, 2, 3, 4].filter((d) => slotsFor(d, now).length > 0), [now])
  const scheduled = value.mode === 'scheduled' ? value : null
  const slots = scheduled ? slotsFor(scheduled.day, now) : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Moment de la livraison">
        <OptionTile selected={value.mode === 'asap'} onSelect={() => onChange({ mode: 'asap' })} className="flex items-center gap-3">
          <Zap className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
          <span className="text-sm">
            <span className="block font-semibold text-ink">Dès que possible</span>
            <span className="text-muted-foreground">{asapLabel}</span>
          </span>
        </OptionTile>
        <OptionTile
          selected={value.mode === 'scheduled'}
          onSelect={() => !scheduled && onChange({ mode: 'scheduled', day: days[0] ?? 1, slot: null })}
          className="flex items-center gap-3"
        >
          <CalendarClock className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
          <span className="text-sm">
            <span className="block font-semibold text-ink">Programmer</span>
            <span className="text-muted-foreground">Choisir un créneau</span>
          </span>
        </OptionTile>
      </div>

      {scheduled && (
        <div className="space-y-3">
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            <div className="flex w-max gap-2" role="radiogroup" aria-label="Jour de livraison">
              {days.map((d) => {
                const l = dayLabel(d, now)
                const active = scheduled.day === d
                return (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange({ mode: 'scheduled', day: d, slot: null })}
                    className={cn(
                      'min-w-[88px] rounded-xl border px-3 py-2 text-center text-sm transition-colors',
                      active ? 'border-ink bg-ink text-white' : 'bg-background hover:border-ink/40',
                    )}
                  >
                    <span className="block font-semibold">{l.top}</span>
                    <span className={cn('block text-xs', active ? 'text-white/70' : 'text-muted-foreground')}>{l.bottom}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Créneau horaire">
            {slots.map((s) => {
              const active = scheduled.slot === s
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange({ ...scheduled, slot: s })}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-sm font-medium tabular-nums transition-colors',
                    active ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600' : 'bg-background hover:border-ink/40',
                  )}
                >
                  {s}–{slotEnd(s)}
                </button>
              )
            })}
          </div>
          {invalid && !scheduled.slot && (
            <p className="text-xs font-medium text-destructive" role="alert">
              Choisissez un créneau de livraison.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
