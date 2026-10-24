export type SlotValue = { mode: 'asap' } | { mode: 'scheduled'; day: number; slot: string | null }

export function dayDate(offset: number, now: Date): Date {
  const d = new Date(now)
  d.setDate(d.getDate() + offset)
  return d
}

/** ISO date of a scheduled slot, or undefined for ASAP / incomplete. */
export function slotToIso(value: SlotValue, now = new Date()): string | undefined {
  if (value.mode !== 'scheduled' || !value.slot) return undefined
  const d = dayDate(value.day, now)
  const [h, m] = value.slot.split(':').map(Number)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export function slotEnd(slot: string): string {
  const [h, m] = slot.split(':').map(Number)
  const t = h * 60 + m + 30
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

