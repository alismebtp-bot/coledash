import { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FilterSelect } from './Filters'
import { CITY_METRICS, LIVE_CITY_IDS, cityName } from '@/data/portals/admin'
import { formatNumber } from '@/lib/format'

const AUDIENCES = [
  { value: 'all', label: 'Tous les clients', share: 1 },
  { value: 'inactive', label: 'Inactifs depuis 30 jours', share: 0.28 },
  { value: 'new', label: 'Nouveaux inscrits (7 j)', share: 0.05 },
  { value: 'flowers', label: 'Acheteurs de fleurs', share: 0.12 },
  { value: 'grocery', label: 'Clients courses', share: 0.34 },
]

const TITLE_MAX = 50
const BODY_MAX = 140

export default function PushComposer() {
  const [title, setTitle] = useState('Votre dîner livré en 25 min 🍜')
  const [body, setBody] = useState('Ce soir, la livraison est offerte dès 20 € avec le code LIVRAISON. Il ne reste plus qu’à choisir !')
  const [audience, setAudience] = useState('inactive')
  const [city, setCity] = useState('all')
  const [when, setWhen] = useState('now')
  const [today] = useState(() => new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }))

  const base = CITY_METRICS.filter((m) => (city === 'all' ? LIVE_CITY_IDS.includes(m.cityId) : m.cityId === city)).reduce((s, m) => s + m.activeCustomers, 0)
  const reach = Math.round(base * (AUDIENCES.find((a) => a.value === audience)?.share ?? 1))
  const valid = title.trim().length > 0 && body.trim().length > 0

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          toast.success(when === 'now' ? `Notification envoyée à ${formatNumber(reach)} clients` : `Notification programmée pour ${formatNumber(reach)} clients`)
        }}
      >
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="push-title">Titre</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{title.length}/{TITLE_MAX}</span>
          </div>
          <Input id="push-title" value={title} maxLength={TITLE_MAX} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <Label htmlFor="push-body">Message</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{body.length}/{BODY_MAX}</span>
          </div>
          <Textarea id="push-body" value={body} maxLength={BODY_MAX} rows={3} onChange={(e) => setBody(e.target.value)} className="mt-1.5" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="mb-1.5 text-sm font-medium">Audience</p>
            <FilterSelect label="Audience" value={audience} onChange={setAudience} className="sm:w-full" options={AUDIENCES} />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Ville</p>
            <FilterSelect label="Ville" value={city} onChange={setCity} className="sm:w-full" options={[{ value: 'all', label: 'Toutes les villes' }, ...LIVE_CITY_IDS.map((id) => ({ value: id, label: cityName(id) }))]} />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium">Envoi</p>
            <FilterSelect
              label="Moment de l'envoi"
              value={when}
              onChange={setWhen}
              className="sm:w-full"
              options={[
                { value: 'now', label: 'Immédiatement' },
                { value: 'lunch', label: "Aujourd'hui 11 h 30" },
                { value: 'dinner', label: "Aujourd'hui 18 h 45" },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-secondary/60 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Portée estimée : <strong className="tabular-nums text-ink">{formatNumber(reach)} clients</strong>
          </p>
          <Button type="submit" disabled={!valid}>
            <Send aria-hidden /> {when === 'now' ? 'Envoyer' : 'Programmer'}
          </Button>
        </div>
      </form>

      <div aria-label="Aperçu de la notification" className="mx-auto w-full max-w-[300px]">
        <div className="rounded-[2.2rem] border-[6px] border-ink bg-gradient-to-b from-brand-700 via-brand-500 to-amber-400 p-3 pb-16 shadow-lift">
          <p className="mt-6 text-center font-display text-5xl font-light text-white/95">12:30</p>
          <p className="text-center text-xs text-white/80">{today}</p>
          <div className="mt-6 rounded-2xl bg-white/85 p-3 shadow-soft backdrop-blur">
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-600 text-[10px] font-bold text-white">C</span>
              <span className="font-semibold uppercase tracking-wide">ColeDash</span>
              <span className="ml-auto">maintenant</span>
            </div>
            <p className="mt-1.5 break-words text-sm font-semibold text-stone-900">{title || 'Titre de la notification'}</p>
            <p className="break-words text-sm leading-snug text-stone-700">{body || 'Votre message apparaîtra ici.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
