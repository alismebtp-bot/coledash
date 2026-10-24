import { useEffect, useMemo, useState } from 'react'
import { dayRecords, type EarningRecord } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'

/** Current time, refreshed every `interval` ms (kept in state so renders stay pure). */
export function useNow(interval = 30000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [interval])
  return now
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** All records of a given day: seeded history (up to `now`) + deliveries completed in the demo. */
export function mergedDayRecords(date: Date, completed: EarningRecord[], now: number): EarningRecord[] {
  const base = dayRecords(date).filter((r) => new Date(r.at).getTime() <= now)
  const mine = completed.filter((r) => isSameDay(new Date(r.at), date))
  return [...mine, ...base].sort((a, b) => b.at.localeCompare(a.at))
}

export function useDriverToday() {
  const now = useNow()
  const completed = useDriver((s) => s.completed)
  const online = useDriver((s) => s.online)
  const onlineSince = useDriver((s) => s.onlineSince)
  const onlineMinutesToday = useDriver((s) => s.onlineMinutesToday)
  const counterDay = useDriver((s) => s.counterDay)
  const accepted = useDriver((s) => s.accepted)
  const declinedCount = useDriver((s) => s.declinedCount)

  return useMemo(() => {
    const today = new Date(now)
    const records = mergedDayRecords(today, completed, now)
    const earnings = records.reduce((s, r) => s + r.pay + r.tip + r.bonus, 0)
    const tips = records.reduce((s, r) => s + r.tip, 0)
    const baseMinutes = records.filter((r) => !r.id.startsWith('done-')).length * 26
    const storedMinutes = counterDay === today.toISOString().slice(0, 10) ? onlineMinutesToday : 0
    const liveMinutes = online && onlineSince ? Math.max(0, (now - new Date(onlineSince).getTime()) / 60000) : 0
    const minutesOnline = Math.round(baseMinutes + storedMinutes + liveMinutes)
    // Seeded base 94 % (47 offers accepted on 50), adjusted by the demo actions.
    const acceptance = Math.round(((47 + accepted) / (50 + accepted + declinedCount)) * 100)
    return { records, earnings, tips, minutesOnline, acceptance, now }
  }, [now, completed, online, onlineSince, onlineMinutesToday, counterDay, accepted, declinedCount])
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`
}
