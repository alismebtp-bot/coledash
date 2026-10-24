import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Flower2, Leaf, Mail } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import VendorCard from '@/components/shared/VendorCard'
import EmptyState from '@/components/shared/EmptyState'
import BouquetTile from '@/components/flowers/BouquetTile'
import BouquetDialog from '@/components/flowers/BouquetDialog'
import AtelierCta from '@/components/flowers/AtelierCta'
import { toVendorCard } from '@/components/store/catalog'
import { bouquets, occasions, resolveFlorist, type Bouquet, type OccasionId } from '@/data/bouquets'
import { getStoresByKind } from '@/data/stores'
import { useCity } from '@/store/city'
import { cn } from '@/lib/utils'

const PROMISES = [
  { icon: Clock, title: 'Livré dans l’heure', text: 'Par votre fleuriste de quartier, à vélo.' },
  { icon: Leaf, title: 'Fleurs de saison', text: 'Majoritairement cultivées en France.' },
  { icon: Mail, title: 'Carte offerte', text: 'Votre message écrit à la main.' },
]

const TIPS = [
  { n: '01', title: 'Recoupez en biseau', text: 'Deux centimètres de tige, en biais, avec un couteau bien affûté : les fleurs boivent mieux.' },
  { n: '02', title: 'Une eau fraîche, souvent', text: 'Changez l’eau tous les deux jours et rincez le vase. Ôtez les feuilles qui trempent.' },
  { n: '03', title: 'Loin des fruits', text: 'Les fruits mûrs dégagent de l’éthylène, qui fait faner les fleurs plus vite. Évitez aussi le plein soleil.' },
]

export default function Flowers() {
  const { city, cityId } = useCity()
  const florists = getStoresByKind('flowers', cityId)
  const [occasion, setOccasion] = useState<OccasionId | 'all'>('all')
  const [open, setOpen] = useState<Bouquet | null>(null)

  const collection = useMemo(() => {
    const list = occasion === 'all' ? bouquets : bouquets.filter((b) => b.occasions.includes(occasion))
    // Bouquets signed by a florist of the current city come first.
    return [...list]
      .map((b) => ({ bouquet: b, florist: resolveFlorist(b, cityId) }))
      .sort((a, b) => Number(b.florist?.id === b.bouquet.storeId) - Number(a.florist?.id === a.bouquet.storeId))
  }, [occasion, cityId])

  const activeOccasion = occasions.find((o) => o.id === occasion)

  return (
    <div className="bg-[#fbf6f2] pb-24 md:pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid items-center gap-10 py-10 md:grid-cols-[1.05fr_1fr] md:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">ColeDash Fleurs · {city.name}</p>
            <h1 className="mt-4 font-serif text-[2.6rem] font-semibold leading-[1.05] text-ink sm:text-6xl">
              Des fleurs qui ont <em className="font-serif italic text-brand-700">quelque chose</em> à dire.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/70">
              Bouquets de saison composés à la main par les meilleurs fleuristes de {city.name}, livrés en moins d’une heure.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#collection" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-semibold text-white transition-transform hover:-translate-y-0.5">
                Voir les bouquets
              </a>
              <Link
                to="/fleurs/atelier"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 bg-white px-6 font-semibold text-ink transition-colors hover:border-ink/40"
              >
                Composer le mien
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto grid w-full max-w-md grid-cols-[1.2fr_1fr] gap-3 md:max-w-none"
            aria-hidden
          >
            <SafeImage src={bouquets[0].image} alt="" wrapperClassName="row-span-2 aspect-[3/4] rounded-[2rem] rounded-tr-[6rem]" />
            <SafeImage src={bouquets[3].image} alt="" wrapperClassName="aspect-square rounded-[2rem]" />
            <SafeImage src={bouquets[9].image} alt="" wrapperClassName="aspect-square rounded-[2rem] rounded-bl-[5rem]" />
            <span className="absolute -bottom-4 left-6 rounded-full bg-white px-4 py-2 font-serif text-sm italic text-ink shadow-soft">
              « Cueilli ce matin, chez vous ce midi »
            </span>
          </motion.div>
        </div>
      </section>

      {/* Promises */}
      <section className="container" aria-label="Nos engagements">
        <ul className="grid gap-3 rounded-[2rem] border border-[#eedfd8] bg-white/70 p-4 sm:grid-cols-3 sm:p-6">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <p.icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-ink">{p.title}</span>
                <span className="block text-sm text-muted-foreground">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Collection */}
      <section id="collection" className="container scroll-mt-24 pt-14 md:pt-20" aria-labelledby="collection-title">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">La collection</p>
          <h2 id="collection-title" className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Pour chaque occasion
          </h2>
          <p className="mt-2 text-muted-foreground">{activeOccasion ? activeOccasion.line : 'Prêts à offrir, en trois tailles.'}</p>
        </div>
        <div className="-mx-4 mt-6 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
          <div className="mx-auto flex w-max gap-2" role="radiogroup" aria-label="Occasion">
            {[{ id: 'all' as const, label: 'Toutes' }, ...occasions].map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={occasion === o.id}
                onClick={() => setOccasion(o.id)}
                className={cn(
                  'h-10 whitespace-nowrap rounded-full border px-5 font-serif text-[15px] transition-colors',
                  occasion === o.id ? 'border-[#3f2a2e] bg-[#3f2a2e] text-white' : 'border-[#e8d6cf] bg-white text-ink hover:border-[#3f2a2e]/50',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {collection.map(({ bouquet, florist }, i) => (
            <BouquetTile key={bouquet.id} bouquet={bouquet} floristName={florist?.name} onOpen={setOpen} index={i} />
          ))}
        </div>
      </section>

      {/* Atelier */}
      <div className="container pt-16 md:pt-24">
        <AtelierCta />
      </div>

      {/* Florists */}
      <section className="container pt-16 md:pt-24" aria-labelledby="florists-title">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Nos artisans</p>
          <h2 id="florists-title" className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            Les fleuristes de {city.name}
          </h2>
        </div>
        {florists.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {florists.map((s) => (
              <VendorCard key={s.id} vendor={toVendorCard(s)} />
            ))}
          </div>
        ) : (
          <EmptyState icon={Flower2} title={`Pas encore de fleuriste à ${city.name}`} description="Nous recrutons nos premiers artisans. Revenez très vite !" />
        )}
      </section>

      {/* Tips */}
      <section className="container pt-16 md:pt-24" aria-labelledby="tips-title">
        <div className="rounded-[2rem] border border-[#eedfd8] bg-white p-6 sm:p-10">
          <h2 id="tips-title" className="font-serif text-3xl font-semibold text-ink">
            Le petit mot du fleuriste
          </h2>
          <p className="mt-1 text-muted-foreground">Trois gestes pour garder votre bouquet plus longtemps.</p>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {TIPS.map((t) => (
              <li key={t.n}>
                <span className="font-serif text-4xl italic text-brand-200">{t.n}</span>
                <h3 className="mt-2 font-serif text-xl font-semibold text-ink">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BouquetDialog bouquet={open} cityId={cityId} onOpenChange={(o) => !o && setOpen(null)} />
    </div>
  )
}
