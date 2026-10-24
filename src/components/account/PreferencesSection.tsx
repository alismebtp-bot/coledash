import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

const STORAGE_KEY = 'coledash-preferences'

const PREFS = [
  { id: 'orderUpdates', label: 'Suivi de commande', description: 'Notifications à chaque étape de la livraison.' },
  { id: 'sms', label: 'SMS du livreur', description: 'Un SMS quand votre livreur est à proximité.' },
  { id: 'promos', label: 'Offres et codes promo', description: 'Les bons plans de vos commerces préférés.' },
  { id: 'newsletter', label: 'Lettre d’information', description: 'Nouveautés et adresses coups de cœur, une fois par semaine.' },
] as const

type PrefId = (typeof PREFS)[number]['id']
type Prefs = Record<PrefId, boolean>

const DEFAULTS: Prefs = { orderUpdates: true, sms: true, promos: false, newsletter: false }

function load(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

export default function PreferencesSection() {
  const [prefs, setPrefs] = useState<Prefs>(load)

  const toggle = (id: PrefId, value: boolean) => {
    const next = { ...prefs, [id]: value }
    setPrefs(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* stockage indisponible */
    }
    toast.success('Préférence enregistrée')
  }

  return (
    <ul className="divide-y rounded-2xl border bg-background">
      {PREFS.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-4 p-4">
          <div>
            <label htmlFor={`pref-${p.id}`} className="font-medium text-ink">
              {p.label}
            </label>
            <p id={`pref-${p.id}-desc`} className="text-sm text-muted-foreground">
              {p.description}
            </p>
          </div>
          <Switch
            id={`pref-${p.id}`}
            checked={prefs[p.id]}
            onCheckedChange={(v) => toggle(p.id, v)}
            aria-describedby={`pref-${p.id}-desc`}
          />
        </li>
      ))}
    </ul>
  )
}
