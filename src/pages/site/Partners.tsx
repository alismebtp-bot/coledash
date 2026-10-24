import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Bike, CalendarCheck, Check, Euro, Megaphone, ShieldCheck, Smartphone, Store } from 'lucide-react'
import { toast } from 'sonner'
import SafeImage from '@/components/shared/SafeImage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cities } from '@/data/cities'

const MERCHANT_PERKS = [
  { icon: Megaphone, title: 'Visibilité immédiate', text: 'Votre carte devant 120 000 clients actifs dès la mise en ligne.' },
  { icon: Euro, title: 'Commission dès 15 %', text: 'Pas de frais d’installation, pas d’engagement. Virement chaque semaine.' },
  { icon: BarChart3, title: 'Outils de pilotage', text: 'Commandes, carte, promotions et statistiques depuis un seul espace.' },
]

const COURIER_PERKS = [
  { icon: CalendarCheck, title: 'Vos horaires', text: 'Réservez les créneaux qui vous arrangent, à la semaine.' },
  { icon: Euro, title: 'Paiement hebdomadaire', text: 'Rémunération par course + bonus de pointe, pourboires reversés à 100 %.' },
  { icon: ShieldCheck, title: 'Assurance incluse', text: 'Responsabilité civile et accident couvertes pendant vos livraisons.' },
]

function LeadForm({ kind }: { kind: 'merchant' | 'courier' }) {
  const [city, setCity] = useState('paris')
  const [done, setDone] = useState(false)
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDone(true)
    toast.success('Demande envoyée', { description: 'Un membre de l’équipe vous contacte sous 48 h.' })
  }
  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-emerald-50 p-8 text-center text-emerald-900">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-semibold">Merci, c’est noté !</p>
        <p className="mt-1 text-sm">Nous vous recontactons sous 48 h pour finaliser votre inscription.</p>
        <Button asChild variant="ink" className="mt-6">
          <Link to={kind === 'merchant' ? '/marchand' : '/livreur'}>Découvrir l’espace {kind === 'merchant' ? 'commerçant' : 'livreur'}</Link>
        </Button>
      </div>
    )
  }
  const p = kind === 'merchant' ? 'm' : 'c'
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {kind === 'merchant' && (
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`${p}-shop`}>Nom de l’établissement</Label>
          <Input id={`${p}-shop`} required placeholder="Le Petit Zinc" />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor={`${p}-name`}>Nom complet</Label>
        <Input id={`${p}-name`} required autoComplete="name" placeholder="Camille Martin" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${p}-phone`}>Téléphone</Label>
        <Input id={`${p}-phone`} required type="tel" autoComplete="tel" pattern="[0-9 +]{10,}" placeholder="06 12 34 56 78" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${p}-email`}>E-mail</Label>
        <Input id={`${p}-email`} required type="email" autoComplete="email" placeholder="vous@exemple.fr" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${p}-city`}>Ville</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger id={`${p}-city`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
                {!c.available && ' (bientôt)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" size="lg" variant={kind === 'merchant' ? 'ink' : 'default'} className="sm:col-span-2">
        {kind === 'merchant' ? 'Être rappelé par un conseiller' : 'Postuler comme livreur'}
      </Button>
    </form>
  )
}

export default function Partners() {
  return (
    <div>
      <section className="container grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Partenaires ColeDash</p>
          <h1 className="mt-3 text-balance text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">Grandissons ensemble, quartier par quartier.</h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Restaurateurs, épiciers, fleuristes, cavistes ou livreurs indépendants : rejoignez la plateforme qui met en avant les commerces de proximité.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="ink">
              <a href="#commercant">
                <Store className="h-4 w-4" /> Je suis commerçant
              </a>
            </Button>
            <Button asChild size="lg">
              <a href="#livreur">
                <Bike className="h-4 w-4" /> Je veux livrer
              </a>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              ['2 400', 'commerces'],
              ['6 800', 'livreurs'],
              ['+38 %', 'de CA moyen'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-bold text-ink">{v}</dd>
                <dd className="text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <SafeImage
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&h=900&fit=crop"
          alt="Chef en cuisine préparant une commande"
          wrapperClassName="aspect-[10/9] rounded-[2rem] shadow-lift"
        />
      </section>

      <section id="commercant" className="scroll-mt-20 bg-ink py-16 text-white sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <Store className="h-8 w-8 text-brand-500" aria-hidden />
            <h2 className="mt-4 text-4xl font-bold">Pour les commerçants</h2>
            <p className="mt-3 max-w-md text-white/70">Mise en ligne en 48 h : nous photographions votre carte, configurons votre espace et formons votre équipe.</p>
            <ul className="mt-8 space-y-6">
              {MERCHANT_PERKS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <p.icon className="h-5 w-5 text-brand-500" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold">{p.title}</h3>
                    <p className="text-sm text-white/65">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-6 text-foreground shadow-lift sm:p-8">
            <h3 className="text-xl font-bold text-ink">Parlons de votre établissement</h3>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">Un conseiller vous rappelle sous 48 h, sans engagement.</p>
            <LeadForm kind="merchant" />
          </div>
        </div>
      </section>

      <section id="livreur" className="container scroll-mt-20 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="order-2 rounded-2xl border bg-card p-6 shadow-soft sm:p-8 lg:order-1">
            <h3 className="text-xl font-bold text-ink">Postuler en 2 minutes</h3>
            <p className="mb-6 mt-1 text-sm text-muted-foreground">Statut auto-entrepreneur requis. Vélo, vélo électrique ou scooter.</p>
            <LeadForm kind="courier" />
          </div>
          <div className="order-1 lg:order-2">
            <Bike className="h-8 w-8 text-brand-600" aria-hidden />
            <h2 className="mt-4 text-4xl font-bold text-ink">Pour les livreurs</h2>
            <p className="mt-3 max-w-md text-muted-foreground">Gagnez en moyenne 16 € de l’heure en période de pointe, avec une appli pensée pour aller vite.</p>
            <ul className="mt-8 space-y-6">
              {COURIER_PERKS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <p.icon className="h-5 w-5 text-brand-600" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-sans font-semibold text-ink">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Smartphone className="h-4 w-4" aria-hidden /> Aperçu de l’application :{' '}
              <Link to="/livreur" className="font-semibold text-ink underline underline-offset-4">
                espace livreur
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
