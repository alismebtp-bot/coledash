import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, Clock, Flower2, MapPin, Search, ShieldCheck, ShoppingBasket, Sparkles, Star, Store, UtensilsCrossed } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import SectionHeading from '@/components/shared/SectionHeading'
import VendorCard from '@/components/shared/VendorCard'
import ActiveOrderBanner from '@/components/site/ActiveOrderBanner'
import { CityPickerDialog } from '@/components/site/CityPicker'
import { Button } from '@/components/ui/button'
import { restaurants } from '@/data/restaurants'
import { getStoresByKind } from '@/data/stores'
import { matchesCity } from '@/data/cities'
import { useCity } from '@/store/city'
import { restaurantCard, storeCard } from '@/lib/vendors'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/pricing'

const img = (id: string, w = 900, h = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop`

const CUISINE_SHORTCUTS = [
  { label: 'Française', image: img('1565299624946-b28f40a0ae38', 200, 200) },
  { label: 'Japonaise', image: img('1579871494447-9811cf80d66c', 200, 200) },
  { label: 'Italienne', image: img('1513104890138-7c749659a591', 200, 200) },
  { label: 'Américaine', image: img('1568901346375-23c9450c58cd', 200, 200) },
  { label: 'Méditerranéenne', image: img('1512621776951-a57141f2eefd', 200, 200) },
  { label: 'Oriental', image: img('1529006557810-274b9b2fc783', 200, 200) },
  { label: 'Fruits de Mer', image: img('1559737558-2f5a35f4523b', 200, 200) },
]

const STEPS = [
  { icon: Search, title: 'Choisissez', text: 'Restaurants, épiceries, fleuristes et boutiques de votre quartier.' },
  { icon: ShieldCheck, title: 'Commandez', text: 'Paiement sécurisé, livraison immédiate ou programmée au créneau qui vous va.' },
  { icon: Bike, title: 'Recevez', text: 'Suivez votre livreur en temps réel jusqu’à votre porte. 28 min en moyenne.' },
]

export default function Home() {
  const { city, cityId } = useCity()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cityOpen, setCityOpen] = useState(false)

  const cityRestaurants = useMemo(() => restaurants.filter((r) => matchesCity(r.city, cityId)), [cityId])
  const popular = useMemo(() => [...cityRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 4), [cityRestaurants])
  const promos = useMemo(() => cityRestaurants.filter((r) => r.isPromo).slice(0, 3), [cityRestaurants])
  const grocery = getStoresByKind('grocery', cityId)
  const florists = getStoresByKind('flowers', cityId)
  const shops = getStoresByKind('retail', cityId)

  const verticals = [
    { to: '/restaurants', label: 'Restaurants', icon: UtensilsCrossed, count: cityRestaurants.length, image: img('1414235077428-338989a2e8c0', 800, 1000) },
    { to: '/courses', label: 'Courses', icon: ShoppingBasket, count: grocery.length, image: img('1542838132-92c53300491e', 800, 1000) },
    { to: '/fleurs', label: 'Fleurs', icon: Flower2, count: florists.length, image: img('1487070183336-b863922373d4', 800, 1000) },
    { to: '/boutiques', label: 'Boutiques', icon: Store, count: shops.length, image: img('1510812431401-41d2bd2722f3', 800, 1000) },
  ]

  return (
    <div>
      <ActiveOrderBanner />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="container grid items-center gap-10 pb-12 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            type="button"
            onClick={() => setCityOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium text-ink shadow-sm hover:border-ink/30"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Livraison active à {city.name}
            <span className="text-muted-foreground">· changer</span>
          </button>
          <h1 className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.02] text-ink sm:text-6xl lg:text-[4.2rem]">
            Le meilleur de votre ville, <span className="text-brand-600">chez vous</span> en 30&nbsp;minutes.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Petits plats de bistrot, courses du marché, bouquets de saison ou chargeur oublié : ColeDash livre tout ce dont vous avez besoin, quand vous en avez besoin.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              navigate(query.trim() ? `/recherche?q=${encodeURIComponent(query.trim())}` : '/restaurants')
            }}
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border bg-card p-2 shadow-lift sm:flex-row"
          >
            <label className="relative flex-1">
              <span className="sr-only">Que voulez-vous commander ?</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pizza, sushis, pivoines, croissants…"
                className="h-12 w-full rounded-xl bg-transparent pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground"
              />
            </label>
            <Button type="submit" size="lg" className="h-12">
              Rechercher
            </Button>
          </form>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-600" aria-hidden />
              <dt className="sr-only">Délai moyen</dt>
              <dd><strong className="text-ink">28 min</strong> <span className="text-muted-foreground">en moyenne</span></dd>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              <dt className="sr-only">Satisfaction</dt>
              <dd><strong className="text-ink">4,8/5</strong> <span className="text-muted-foreground">par 120 000 clients</span></dd>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="h-4 w-4 text-brand-600" aria-hidden />
              <dt className="sr-only">Livraison</dt>
              <dd><span className="text-muted-foreground">Offerte dès</span> <strong className="text-ink">{FREE_DELIVERY_THRESHOLD} €</strong></dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-4 lg:max-w-none"
          aria-hidden
        >
          <SafeImage src={img('1504674900247-0877df9cc836', 700, 900)} alt="" wrapperClassName="row-span-2 aspect-[3/4] h-full rounded-[1.75rem] shadow-lift" />
          <SafeImage src={img('1490750967868-88aa4486c946', 600, 500)} alt="" wrapperClassName="aspect-[6/5] rounded-[1.75rem] shadow-lift" />
          <SafeImage src={img('1488459716781-31db52582fe9', 600, 500)} alt="" wrapperClassName="aspect-[6/5] rounded-[1.75rem] shadow-lift" />

          <div className="absolute -left-2 bottom-8 flex items-center gap-3 rounded-2xl bg-card p-3 pr-4 shadow-lift sm:-left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Bike className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-xs text-muted-foreground">Commande CD-48213</p>
              <p className="text-sm font-semibold text-ink">Livrée en 22 min</p>
            </div>
          </div>
          <div className="absolute -right-2 top-6 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift sm:-right-5">
            <p className="flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" /> 4,9
            </p>
            <p className="text-xs text-white/70">Atelier Pivoine</p>
          </div>
        </motion.div>
      </section>

      {/* ── Verticals ────────────────────────────────────── */}
      <section className="container" aria-labelledby="verticals">
        <h2 id="verticals" className="sr-only">Que voulez-vous commander ?</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {verticals.map((v, i) => (
            <motion.div key={v.to} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={v.to} className="group relative block overflow-hidden rounded-2xl">
                <SafeImage src={v.image} alt="" wrapperClassName="aspect-[4/5] sm:aspect-[4/4.4]" className="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white sm:p-5">
                  <div>
                    <v.icon className="mb-2 h-5 w-5" aria-hidden />
                    <p className="font-display text-xl font-bold sm:text-2xl">{v.label}</p>
                    <p className="text-xs text-white/75 sm:text-sm">{v.count} adresse{v.count > 1 ? 's' : ''} à {city.name}</p>
                  </div>
                  <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5 sm:flex">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Cuisines ─────────────────────────────────────── */}
      <section className="container mt-14" aria-labelledby="cuisines">
        <h2 id="cuisines" className="mb-5 text-xl font-bold text-ink">Envie de quelque chose en particulier ?</h2>
        <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <ul className="flex w-max gap-5 sm:gap-7">
            {CUISINE_SHORTCUTS.map((c) => (
              <li key={c.label}>
                <Link to={`/restaurants?cuisine=${encodeURIComponent(c.label)}`} className="group flex w-20 flex-col items-center gap-2 text-center sm:w-24">
                  <SafeImage src={c.image} alt="" wrapperClassName="h-20 w-20 rounded-full ring-2 ring-transparent transition group-hover:ring-brand-600 sm:h-24 sm:w-24" />
                  <span className="text-sm font-medium text-ink">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Popular ──────────────────────────────────────── */}
      <section className="container mt-16">
        <SectionHeading eyebrow={`À ${city.name}`} title="Les mieux notés du moment" href="/restaurants" />
        {popular.length ? (
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((r) => (
              <VendorCard key={r.id} vendor={restaurantCard(r)} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Les restaurants arrivent bientôt dans votre ville.</p>
        )}
      </section>

      {/* ── Fleurs band ──────────────────────────────────── */}
      <section className="container mt-20">
        <div className="relative grid overflow-hidden rounded-[2rem] bg-[#f6e7e4] lg:grid-cols-2">
          <div className="relative z-10 p-8 sm:p-12 lg:p-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">ColeDash Fleurs</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Composez <em className="text-brand-700">votre</em> bouquet, tige par tige.
            </h2>
            <p className="mt-4 max-w-md text-ink/70">
              Choisissez vos fleurs, votre papier et un mot doux : un fleuriste de votre ville le compose à la main et le livre dans l’heure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="ink">
                <Link to="/fleurs/atelier">
                  <Sparkles className="h-4 w-4" /> Ouvrir l’atelier
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-ink/20 bg-transparent">
                <Link to="/fleurs">Bouquets prêts à offrir</Link>
              </Button>
            </div>
          </div>
          <SafeImage src={img('1455659817273-f96807779a8a', 1000, 800)} alt="Bouquet de fleurs de saison" wrapperClassName="min-h-[260px] lg:min-h-full" />
        </div>
      </section>

      {/* ── Promos ───────────────────────────────────────── */}
      {promos.length > 0 && (
        <section className="container mt-20">
          <SectionHeading eyebrow="Bons plans" title="Offres de la semaine" href="/restaurants?promo=1" />
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {promos.map((r) => (
              <VendorCard key={r.id} vendor={restaurantCard(r)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Courses & boutiques ──────────────────────────── */}
      {(grocery.length > 0 || shops.length > 0) && (
        <section className="container mt-20">
          <SectionHeading eyebrow="Pas que des repas" title="Courses et commerces de quartier" href="/courses" linkLabel="Voir les courses" />
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[...grocery, ...shops].slice(0, 4).map((s) => (
              <VendorCard key={s.id} vendor={storeCard(s)} />
            ))}
          </div>
        </section>
      )}

      {/* ── How it works ─────────────────────────────────── */}
      <section className="container mt-20" aria-labelledby="how">
        <div className="rounded-[2rem] border bg-card p-8 shadow-soft sm:p-12">
          <h2 id="how" className="text-3xl font-bold text-ink">Comment ça marche</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="font-display text-6xl font-extrabold text-brand-100">{i + 1}</span>
                <div className="-mt-6 flex items-center gap-2">
                  <s.icon className="h-5 w-5 text-brand-600" aria-hidden />
                  <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                </div>
                <p className="mt-2 text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ink">
              <strong>Première commande ?</strong> Profitez de −20 % avec le code{' '}
              <code className="rounded-md bg-white px-2 py-0.5 font-mono font-bold text-brand-700">BIENVENUE</code>
            </p>
            <Button asChild>
              <Link to="/restaurants">Commander maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Partners ─────────────────────────────────────── */}
      <section className="container mt-20 grid gap-4 md:grid-cols-2">
        <Link to="/partenaires" className="group relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-10">
          <Store className="h-7 w-7 text-brand-500" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold">Vous êtes commerçant ?</h2>
          <p className="mt-2 max-w-sm text-white/70">Touchez de nouveaux clients sans investissement : mise en ligne en 48 h, commission dès 15 %.</p>
          <span className="mt-6 inline-flex items-center gap-1 font-semibold">
            Devenir partenaire <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <Link to="/partenaires#livreur" className="group relative overflow-hidden rounded-[2rem] bg-brand-600 p-8 text-white sm:p-10">
          <Bike className="h-7 w-7 text-white/80" aria-hidden />
          <h2 className="mt-4 text-2xl font-bold">Livrez avec ColeDash</h2>
          <p className="mt-2 max-w-sm text-white/80">Choisissez vos créneaux, soyez payé chaque semaine et gardez 100 % de vos pourboires.</p>
          <span className="mt-6 inline-flex items-center gap-1 font-semibold">
            Devenir livreur <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <p className="container mt-10 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" aria-hidden /> Vous n’êtes pas à {city.name} ?{' '}
        <button type="button" onClick={() => setCityOpen(true)} className="font-semibold text-ink underline underline-offset-4">
          Changer de ville
        </button>
      </p>
      <CityPickerDialog open={cityOpen} onOpenChange={setCityOpen} />
    </div>
  )
}
