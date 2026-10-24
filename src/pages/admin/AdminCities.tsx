import { useState } from 'react'
import { Clock, MapPin, Rocket, ShoppingBag, Star, Store, TrendingUp, Users } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatusPill } from '@/components/portal/PortalUI'
import SafeImage from '@/components/shared/SafeImage'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { compactEur } from '@/components/admin/tones'
import { ADMIN_VENDORS, CITY_METRICS, type CityMetrics } from '@/data/portals/admin'
import { cities } from '@/data/cities'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function AdminCities() {
  const [metrics, setMetrics] = useState<CityMetrics[]>(CITY_METRICS)
  const [launched, setLaunched] = useState<Record<string, boolean>>(() => Object.fromEntries(cities.map((c) => [c.id, c.available])))
  const [selected, setSelected] = useState('paris')

  const sel = metrics.find((m) => m.cityId === selected)!
  const selCity = cities.find((c) => c.id === selected)!
  const isLive = launched[selected]

  const toggleLaunch = (id: string, on: boolean) => {
    setLaunched((l) => ({ ...l, [id]: on }))
    const name = cities.find((c) => c.id === id)!.name
    if (on) {
      setMetrics((ms) => ms.map((m) => (m.cityId === id ? { ...m, zones: m.zones.map((z, i) => ({ ...z, active: i === 0 })) } : m)))
      toast.success(`${name} est ouverte ! Première zone activée, la liste d'attente va être notifiée.`)
    } else {
      setMetrics((ms) => ms.map((m) => (m.cityId === id ? { ...m, zones: m.zones.map((z) => ({ ...z, active: false })) } : m)))
      toast(`Lancement de ${name} mis en pause`)
    }
  }

  const toggleZone = (zoneId: string, on: boolean) => {
    setMetrics((ms) => ms.map((m) => (m.cityId === selected ? { ...m, zones: m.zones.map((z) => (z.id === zoneId ? { ...z, active: on } : z)) } : m)))
    toast.success(on ? 'Zone de livraison activée' : 'Zone de livraison désactivée')
  }

  return (
    <div>
      <PortalPageHeader title="Villes" description="Performance par ville, ouvertures et zones de livraison." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cities.map((c) => {
          const m = metrics.find((x) => x.cityId === c.id)!
          const live = launched[c.id]
          const merchants = ADMIN_VENDORS.filter((v) => v.cityId === c.id && v.status === 'actif').length
          return (
            <article
              key={c.id}
              className={cn('overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-lift', selected === c.id && 'ring-2 ring-brand-500')}
            >
              <button type="button" onClick={() => setSelected(c.id)} className="block w-full text-left" aria-label={`Voir les zones de ${c.name}`}>
                <div className="relative">
                  <SafeImage src={c.image} alt="" wrapperClassName="h-28 w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <h2 className="text-xl font-bold">{c.name}</h2>
                      <p className="text-xs text-white/80">{c.region}</p>
                    </div>
                    <StatusPill tone={live ? 'success' : 'warning'}>{live ? 'Ouverte' : 'Bientôt'}</StatusPill>
                  </div>
                </div>
              </button>
              <div className="p-4">
                {c.available ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="h-3 w-3" aria-hidden /> Volume 30 j</dt><dd className="font-semibold tabular-nums">{compactEur.format(m.gmvMonth)}</dd></div>
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><ShoppingBag className="h-3 w-3" aria-hidden /> Commandes 30 j</dt><dd className="font-semibold tabular-nums">{formatNumber(m.ordersMonth)}</dd></div>
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3 w-3" aria-hidden /> Livreurs en ligne</dt><dd className="font-semibold tabular-nums">{m.driversOnline} / {m.driversTotal}</dd></div>
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Store className="h-3 w-3" aria-hidden /> Commerces actifs</dt><dd className="font-semibold tabular-nums">{merchants}</dd></div>
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" aria-hidden /> Délai moyen</dt><dd className="font-semibold tabular-nums">{m.avgDeliveryMinutes} min</dd></div>
                    <div><dt className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3" aria-hidden /> Satisfaction</dt><dd className="font-semibold tabular-nums">{m.satisfaction.toLocaleString('fr-FR')} / 5</dd></div>
                  </dl>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Lancement prévu le <strong className="text-ink">{formatDate(m.launchDate!, { day: 'numeric', month: 'long', year: 'numeric' })}</strong> ·{' '}
                      {formatNumber(m.waitlist ?? 0)} personnes sur liste d'attente
                    </p>
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 p-3">
                      <Label htmlFor={`launch-${c.id}`} className="flex items-center gap-2 text-sm font-semibold">
                        <Rocket className="h-4 w-4 text-brand-600" aria-hidden /> Ouvrir la ville
                      </Label>
                      <Switch id={`launch-${c.id}`} checked={live} onCheckedChange={(v) => toggleLaunch(c.id, v)} />
                    </div>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      <Panel title={`Zones de livraison · ${selCity.name}`} className="mt-4" action={<span className="text-sm text-muted-foreground">{sel.zones.filter((z) => z.active).length} / {sel.zones.length} actives</span>}>
        {!isLive && <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">La ville n'est pas encore ouverte : activez-la pour pouvoir ouvrir des zones.</p>}
        <ul className="grid gap-2 md:grid-cols-2">
          {sel.zones.map((z) => (
            <li key={z.id} className={cn('flex items-center justify-between gap-3 rounded-xl border p-3', z.active ? 'bg-card' : 'bg-secondary/40')}>
              <div className="flex min-w-0 items-start gap-3">
                <MapPin className={cn('mt-0.5 h-4 w-4 shrink-0', z.active ? 'text-brand-600' : 'text-muted-foreground')} aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{z.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Frais {formatPrice(z.fee)} · ~{z.avgMinutes} min
                  </p>
                </div>
              </div>
              <Switch checked={z.active} disabled={!isLive} onCheckedChange={(v) => toggleZone(z.id, v)} aria-label={`Activer la zone ${z.name}`} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
