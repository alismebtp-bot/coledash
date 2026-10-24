import { Copy, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { DAY_KEYS, DAY_LABELS, validateDay, type DayHours, type DayKey } from '@/data/portals/merchant'
import { cn } from '@/lib/utils'

interface Props {
  value: Record<DayKey, DayHours>
  onChange: (value: Record<DayKey, DayHours>) => void
}

/** Adds a slot; a continuous day is split into lunch and dinner services. */
function addSlot(day: DayHours): DayHours {
  const last = day.slots[day.slots.length - 1]
  if (last && last.open < '15:00' && last.close > '18:30') {
    return { ...day, slots: [...day.slots.slice(0, -1), { open: last.open, close: '15:00' }, { open: '18:30', close: last.close }] }
  }
  return { ...day, slots: [...day.slots, { open: last && last.close < '18:30' ? '18:30' : '19:00', close: '22:30' }] }
}

export default function HoursEditor({ value, onChange }: Props) {
  const update = (key: DayKey, day: DayHours) => onChange({ ...value, [key]: day })

  const copyToAll = (key: DayKey) => {
    const src = value[key]
    // Applies this day's slots to every other open day.
    onChange(
      Object.fromEntries(
        DAY_KEYS.map((k) => [k, value[k].isOpen ? { isOpen: true, slots: src.slots.map((s) => ({ ...s })) } : value[k]]),
      ) as Record<DayKey, DayHours>,
    )
  }

  return (
    <ul className="divide-y">
      {DAY_KEYS.map((key) => {
        const day = value[key]
        const error = validateDay(day)
        return (
          <li key={key} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start">
            <div className="flex w-32 shrink-0 items-center gap-3 sm:pt-2">
              <Switch
                id={`day-${key}`}
                checked={day.isOpen}
                onCheckedChange={(isOpen) => update(key, { ...day, isOpen })}
                aria-label={`${DAY_LABELS[key]} ouvert`}
              />
              <label htmlFor={`day-${key}`} className="text-sm font-medium text-ink">
                {DAY_LABELS[key]}
              </label>
            </div>
            {day.isOpen ? (
              <div className="flex-1 space-y-2">
                {day.slots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={slot.open}
                      onChange={(e) =>
                        update(key, { ...day, slots: day.slots.map((s, j) => (j === i ? { ...s, open: e.target.value } : s)) })
                      }
                      className={cn('h-9 w-28', error && 'border-red-300')}
                      aria-label={`${DAY_LABELS[key]}, créneau ${i + 1}, ouverture`}
                    />
                    <span className="text-sm text-muted-foreground">à</span>
                    <Input
                      type="time"
                      value={slot.close}
                      onChange={(e) =>
                        update(key, { ...day, slots: day.slots.map((s, j) => (j === i ? { ...s, close: e.target.value } : s)) })
                      }
                      className={cn('h-9 w-28', error && 'border-red-300')}
                      aria-label={`${DAY_LABELS[key]}, créneau ${i + 1}, fermeture`}
                    />
                    {day.slots.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => update(key, { ...day, slots: day.slots.filter((_, j) => j !== i) })}
                        aria-label={`Supprimer le créneau ${i + 1} du ${DAY_LABELS[key].toLowerCase()}`}
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                ))}
                {error && <p className="text-xs text-red-600">{error}</p>}
              </div>
            ) : (
              <p className="flex-1 text-sm text-muted-foreground sm:pt-2">Fermé</p>
            )}
            <div className="flex gap-1 sm:pt-0.5">
              {day.isOpen && day.slots.length < 3 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => update(key, addSlot(day))}
                  title="Ajouter un créneau (coupure)"
                  aria-label={`Ajouter un créneau le ${DAY_LABELS[key].toLowerCase()}`}
                >
                  <Plus />
                </Button>
              )}
              {day.isOpen && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copyToAll(key)}
                  title="Appliquer ces horaires aux autres jours ouverts"
                  aria-label={`Appliquer les horaires du ${DAY_LABELS[key].toLowerCase()} aux autres jours ouverts`}
                >
                  <Copy />
                </Button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
