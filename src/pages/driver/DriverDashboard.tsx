import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, CalendarClock, Clock, Euro, Navigation, Power, ThumbsUp, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatCard } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import DemandChips, { DemandBadge } from '@/components/driver/DemandChips'
import { formatDuration, useDriverToday } from '@/components/driver/useDriverToday'
import { DEMAND_ZONES, DRIVER, WEEKLY_QUEST, generateSlots } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'
import { formatPrice, formatTime, pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'

const DAY_NAMES = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

function useNextShift(now: number) {
  const booked = useDriver((s) => s.booked)
  const slots = generateSlots(0)
  const d = new Date(now)
  const today = (d.getDay() + 6) % 7
  const minutes = d.getHours() * 60 + d.getMinutes()
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
  return slots
    .filter((s) => booked.includes(s.id))
    .filter((s) => s.day > today || (s.day === today && toMin(s.end) > minutes))
    .sort((a, b) => a.day - b.day || toMin(a.start) - toMin(b.start))[0]
}

export default function DriverDashboard() {
  const online = useDriver((s) => s.online)
  const setOnline = useDriver((s) => s.setOnline)
  const current = useDriver((s) => s.current)
  const { records, earnings, tips, minutesOnline, acceptance, now } = useDriverToday()
  const next = useNextShift(now)
  const weekDeliveries = 38 + records.length
  const today = (new Date(now).getDay() + 6) % 7

  const toggle = () => {
    setOnline(!online)
    toast.success(online ? 'Vous êtes hors ligne. Bonne pause !' : 'Vous êtes en ligne : les courses vont arriver.')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PortalPageHeader title={`Bonjour ${DRIVER.firstName}`} description={`${DRIVER.vehicle.type} · ${DRIVER.city} · ${DRIVER.level}`} />

      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.98 }}
        aria-pressed={online}
        className={cn(
          'relative flex w-full items-center gap-4 overflow-hidden rounded-3xl p-5 text-left shadow-lift transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 sm:p-6',
          online ? 'bg-emerald-600 text-white' : 'bg-ink text-white',
        )}
      >
        <span className={cn('relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full', online ? 'bg-white/20' : 'bg-white/10')}>
          {online && <span className="absolute inset-0 animate-ping rounded-full bg-white/25" aria-hidden />}
          <Power className="h-8 w-8" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-2xl font-bold">{online ? 'En ligne' : 'Hors ligne'}</span>
          <span className="block text-sm text-white/75">
            {online ? 'Vous recevez des propositions de courses. Touchez pour passer hors ligne.' : 'Touchez pour commencer à recevoir des courses.'}
          </span>
        </span>
        <span className={cn('hidden h-8 w-14 shrink-0 rounded-full p-1 sm:block', online ? 'bg-white/30' : 'bg-white/15')} aria-hidden>
          <span className={cn('block h-6 w-6 rounded-full bg-white transition-transform', online && 'translate-x-6')} />
        </span>
      </motion.button>

      {current && (
        <Link
          to="/livreur/livraison"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-brand-800 transition-shadow hover:shadow-soft"
        >
          <Navigation className="h-5 w-5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 text-sm">
            <strong className="block">Livraison en cours · {current.offer.orderCode}</strong>
            <span className="block truncate">{current.offer.merchantName} → {current.offer.dropoffAddress}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="Gains du jour" value={formatPrice(earnings)} icon={Euro} hint={`dont ${formatPrice(tips)} de pourboires`} className="p-4 sm:p-5" />
        <StatCard label="Courses" value={records.length} icon={Bike} hint="aujourd'hui" className="p-4 sm:p-5" />
        <StatCard label="Temps en ligne" value={formatDuration(minutesOnline)} icon={Clock} className="p-4 sm:p-5" />
        <StatCard label="Taux d'acceptation" value={`${acceptance} %`} icon={ThumbsUp} hint="7 derniers jours" className="p-4 sm:p-5" />
      </div>

      <div className="mt-4 grid gap-4">
        <Panel
          title="Demande en ce moment"
          action={
            <Button asChild size="sm" variant="soft">
              <Link to="/livreur/courses">Voir les courses</Link>
            </Button>
          }
        >
          <DemandChips zones={DEMAND_ZONES} />
          <p className="mt-3 text-xs text-muted-foreground">Les zones à forte demande appliquent un bonus multiplicateur sur la rémunération des courses.</p>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="Prochain créneau">
            {next ? (
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <CalendarClock className="h-5 w-5 text-ink" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {next.day === today ? "Aujourd'hui" : next.day === today + 1 ? 'Demain' : DAY_NAMES[next.day].replace(/^./, (c) => c.toUpperCase())} · {next.start.replace(':', ' h ')} – {next.end.replace(':', ' h ')}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Estimation ~{formatPrice(next.estimate)} / h</p>
                  <DemandBadge level={next.demand} className="mt-2" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun créneau réservé cette semaine.</p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/livreur/planning">Gérer mon planning</Link>
            </Button>
          </Panel>

          <Panel title="Défi de la semaine">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Trophy className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{formatPrice(WEEKLY_QUEST.reward)} de bonus</p>
                <p className="text-sm text-muted-foreground">
                  {weekDeliveries} / {WEEKLY_QUEST.target} courses
                </p>
              </div>
            </div>
            <Progress value={Math.min(100, (weekDeliveries / WEEKLY_QUEST.target) * 100)} className="mt-4 h-2" aria-label="Progression du défi" />
            <p className="mt-2 text-xs text-muted-foreground">Plus que {pluralize(Math.max(0, WEEKLY_QUEST.target - weekDeliveries), 'course')} avant dimanche minuit.</p>
          </Panel>
        </div>

        <Panel title="Dernières courses" action={<Link to="/livreur/gains" className="text-sm font-semibold text-brand-700 hover:underline">Tout voir</Link>}>
          {records.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune course aujourd'hui pour l'instant.</p>
          ) : (
            <ul className="-my-2 divide-y">
              {records.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{r.merchantName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {formatTime(r.at)} · {r.distanceKm.toLocaleString('fr-FR')} km
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold tabular-nums text-ink">{formatPrice(r.pay + r.tip + r.bonus)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  )
}
