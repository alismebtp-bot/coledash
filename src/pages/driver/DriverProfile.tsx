import { useState } from 'react'
import { BadgeCheck, Bike, Clock, FileText, Gauge, Mail, Phone, Route, Star, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatusPill, type Tone } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DRIVER, DRIVER_DOCUMENTS, RATING_BREAKDOWN, RECENT_COMPLIMENTS, type DocumentStatus, type DriverDocument } from '@/data/portals/driver'
import { useDriver } from '@/store/driver'
import { formatDate, formatNumber } from '@/lib/format'

const DOC_STATUS: Record<DocumentStatus, { label: string; tone: Tone }> = {
  valide: { label: 'Validé', tone: 'success' },
  a_renouveler: { label: 'À renouveler', tone: 'warning' },
  en_verification: { label: 'En vérification', tone: 'info' },
}

const SETTINGS = [
  { id: 'sound', label: 'Son des nouvelles courses', hint: 'Alerte sonore même téléphone verrouillé', default: true },
  { id: 'stacked', label: 'Courses groupées', hint: 'Recevoir 2 commandes du même commerce', default: true },
  { id: 'long', label: 'Longues distances', hint: 'Courses de plus de 5 km', default: false },
  { id: 'flowers', label: 'Livraisons de fleurs', hint: 'Bouquets fragiles, rémunération +1 €', default: true },
  { id: 'night', label: 'Mode sombre de nuit', hint: 'Après 21 h', default: false },
]

export default function DriverProfile() {
  const completed = useDriver((s) => s.completed)
  const [docs, setDocs] = useState<DriverDocument[]>(DRIVER_DOCUMENTS)
  const [settings, setSettings] = useState<Record<string, boolean>>(() => Object.fromEntries(SETTINGS.map((s) => [s.id, s.default])))

  const renew = (id: string) => {
    setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: 'en_verification' } : x)))
    toast.success('Document envoyé, vérification sous 48 h')
  }

  const stats = [
    { icon: Bike, label: 'Courses', value: formatNumber(DRIVER.totalDeliveries + completed.length) },
    { icon: Route, label: 'Kilomètres', value: formatNumber(Math.round(DRIVER.totalKm + completed.reduce((s, r) => s + r.distanceKm, 0))) },
    { icon: Gauge, label: 'Acceptation', value: `${DRIVER.acceptanceRate} %` },
    { icon: Clock, label: 'À l’heure', value: `${DRIVER.onTimeRate} %` },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <PortalPageHeader title="Profil" />

      <section className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-5 text-center shadow-soft sm:flex-row sm:text-left">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-2xl font-bold text-white">KB</span>
        <div className="min-w-0 flex-1">
          <h2 className="flex items-center justify-center gap-1.5 text-xl font-bold text-ink sm:justify-start">
            {DRIVER.firstName} {DRIVER.lastName} <BadgeCheck className="h-5 w-5 text-sky-600" aria-label="Profil vérifié" />
          </h2>
          <p className="text-sm text-muted-foreground">
            {DRIVER.level} · livreur depuis {formatDate(DRIVER.memberSince, { month: 'long', year: 'numeric' })}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" aria-hidden /> {DRIVER.phone}</span>
            <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" aria-hidden /> {DRIVER.email}</span>
          </div>
        </div>
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-ink">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden /> {DRIVER.rating.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-muted-foreground">{formatNumber(DRIVER.ratingCount)} avis</p>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-soft">
            <s.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            <p className="mt-2 font-display text-xl font-bold tabular-nums text-ink">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4">
        <Panel title="Documents">
          <ul className="-my-2 divide-y">
            {docs.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{d.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.detail}
                      {d.expires && ` · expire le ${formatDate(d.expires)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill tone={DOC_STATUS[d.status].tone}>{DOC_STATUS[d.status].label}</StatusPill>
                  {d.status === 'a_renouveler' && (
                    <Button size="sm" onClick={() => renew(d.id)}>
                      <Upload aria-hidden /> Envoyer
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="Véhicule" action={<Button size="sm" variant="ghost" onClick={() => toast('Demande de changement de véhicule envoyée au support')}>Modifier</Button>}>
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-ink">
                <Bike className="h-5 w-5" aria-hidden />
              </span>
              <dl className="space-y-1 text-sm">
                <div><dt className="sr-only">Type</dt><dd className="font-semibold text-ink">{DRIVER.vehicle.type}</dd></div>
                <div><dt className="sr-only">Modèle</dt><dd className="text-muted-foreground">{DRIVER.vehicle.model}</dd></div>
                <div><dt className="sr-only">Batterie</dt><dd className="text-muted-foreground">{DRIVER.vehicle.battery}</dd></div>
                <div><dt className="sr-only">Équipement</dt><dd className="text-muted-foreground">{DRIVER.vehicle.bag}</dd></div>
              </dl>
            </div>
          </Panel>

          <Panel title="Notes clients">
            <ul className="space-y-1.5">
              {RATING_BREAKDOWN.map((r) => (
                <li key={r.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 tabular-nums text-muted-foreground">{r.stars} ★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span className="block h-full rounded-full bg-amber-400" style={{ width: `${r.share}%` }} />
                  </span>
                  <span className="w-10 text-right tabular-nums text-muted-foreground">{r.share.toLocaleString('fr-FR')} %</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {RECENT_COMPLIMENTS.map((c) => (
                <span key={c.label} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-ink">
                  {c.label} · {c.count}
                </span>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Préférences">
          <ul className="-my-2 divide-y">
            {SETTINGS.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <Label htmlFor={`set-${s.id}`} className="cursor-pointer">
                  <span className="block text-sm font-semibold text-ink">{s.label}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{s.hint}</span>
                </Label>
                <Switch
                  id={`set-${s.id}`}
                  checked={settings[s.id]}
                  onCheckedChange={(v) => {
                    setSettings((x) => ({ ...x, [s.id]: v }))
                    toast.success('Préférence enregistrée')
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
