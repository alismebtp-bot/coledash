import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import BouquetPreview from '@/components/flowers/BouquetPreview'
import StemPicker from '@/components/flowers/builder/StemPicker'
import { MessageStep, PaletteStep, VaseStep, WrapStep } from '@/components/flowers/builder/BuilderOptions'
import PriceSummary from '@/components/flowers/builder/PriceSummary'
import {
  EMPTY_COMPOSITION,
  MAX_STEMS,
  MIN_STEMS,
  compositionFromPalette,
  compositionHash,
  pricing,
  stemCount,
  summaryLabels,
  type Composition,
} from '@/components/flowers/composer'
import { vendorFields } from '@/components/store/catalog'
import { getStoresByKind } from '@/data/stores'
import { palettes } from '@/data/flowerCatalog'
import { useAddToCart } from '@/hooks/useAddToCart'
import { useCity } from '@/store/city'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

const STEPS = [
  { id: 'fleurs', label: 'Fleurs', title: 'Choisissez vos fleurs', hint: `Jusqu’à ${MAX_STEMS} tiges, ${MIN_STEMS} au minimum.` },
  { id: 'palette', label: 'Palette', title: 'Une palette pour s’inspirer', hint: 'Partez d’une harmonie de couleurs.' },
  { id: 'emballage', label: 'Emballage', title: 'L’emballage', hint: 'Papier noué main et ruban assorti.' },
  { id: 'vase', label: 'Vase', title: 'Un vase ?', hint: 'Pour un bouquet prêt à poser.' },
  { id: 'carte', label: 'Carte', title: 'La carte message', hint: 'Écrite à la main par le fleuriste.' },
] as const

const ATELIER_IMAGE = 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=600&h=600&fit=crop'

export default function BouquetBuilder() {
  const { city, cityId } = useCity()
  const florist = getStoresByKind('flowers', cityId)[0]
  const addToCart = useAddToCart()
  const [composition, setComposition] = useState<Composition>(EMPTY_COMPOSITION)
  const [step, setStep] = useState(0)
  const total = stemCount(composition)
  const price = useMemo(() => pricing(composition), [composition])

  const setStems = (id: string, count: number) =>
    setComposition((c) => {
      const others = stemCount(c) - (c.stems[id] ?? 0)
      const next = Math.max(0, Math.min(count, MAX_STEMS - others))
      const stems = { ...c.stems }
      if (next === 0) delete stems[id]
      else stems[id] = next
      return { ...c, stems }
    })

  const applyPalette = (id: string) => {
    setComposition((c) => compositionFromPalette(id, c))
    const name = palettes.find((p) => p.id === id)?.name
    toast.success(`Palette « ${name} » appliquée`, { description: 'Ajustez les tiges à votre goût.' })
    setStep(0)
  }

  const add = () => {
    if (!florist || total < MIN_STEMS) return
    addToCart({
      ...vendorFields(florist),
      productId: `bouquet-${compositionHash(composition)}`,
      name: 'Bouquet sur mesure',
      image: ATELIER_IMAGE,
      unitPrice: price.total,
      options: summaryLabels(composition),
    })
  }

  const current = STEPS[step]

  return (
    <div className="bg-[linear-gradient(180deg,#fdf6f3_0%,hsl(var(--background))_420px)] pb-32 md:pb-16">
      <div className="container pt-6">
        <Link to="/fleurs" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          ColeDash Fleurs
        </Link>
        <div className="mt-3 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">L’atelier</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">Composez votre bouquet</h1>
          <p className="mt-2 text-muted-foreground">
            Tige par tige, comme chez le fleuriste. {florist ? `${florist.name} le prépare et le livre à ${city.name}.` : `Bientôt disponible à ${city.name}.`}
          </p>
        </div>
      </div>

      <div className="container mt-6 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
        {/* Preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,#fdf2f4_55%,#f8e8e4_100%)] shadow-soft">
            <BouquetPreview composition={composition} className="relative mx-auto aspect-[5/6] w-full max-w-[360px] sm:max-w-[440px]" />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur">
              {total}/{MAX_STEMS} tiges
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white shadow-sm tabular-nums">{formatPrice(price.total)}</div>
          </div>
          <Progress value={(total / MAX_STEMS) * 100} className="mt-3 h-1.5" aria-label="Nombre de tiges" />
        </div>

        {/* Controls */}
        <div className="min-w-0">
          <nav aria-label="Étapes" className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            <ol className="flex w-max gap-2">
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={i === step ? 'step' : undefined}
                    className={cn(
                      'inline-flex h-10 items-center gap-2 rounded-full border pl-1.5 pr-4 text-sm font-medium transition-colors',
                      i === step ? 'border-ink bg-ink text-white' : 'bg-card text-ink hover:border-ink/40',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                        i === step ? 'bg-white text-ink' : 'bg-secondary text-ink',
                      )}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <section aria-labelledby="bq-step" className="mt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 id="bq-step" className="font-serif text-2xl font-semibold text-ink">
                  {current.title}
                </h2>
                <p className="text-sm text-muted-foreground">{current.hint}</p>
              </div>
              {step === 0 && total === 0 && (
                <Button variant="soft" size="sm" onClick={() => setStep(1)}>
                  <Sparkles aria-hidden />
                  Inspiration
                </Button>
              )}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                {current.id === 'fleurs' && <StemPicker stems={composition.stems} total={total} onChange={setStems} />}
                {current.id === 'palette' && <PaletteStep composition={composition} onApply={applyPalette} />}
                {current.id === 'emballage' && <WrapStep value={composition.wrapId} onChange={(wrapId) => setComposition((c) => ({ ...c, wrapId }))} />}
                {current.id === 'vase' && <VaseStep value={composition.vaseId} onChange={(vaseId) => setComposition((c) => ({ ...c, vaseId }))} />}
                {current.id === 'carte' && <MessageStep value={composition.message} onChange={(message) => setComposition((c) => ({ ...c, message }))} />}
              </motion.div>
            </AnimatePresence>
            <div className="mt-6 flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                <ArrowLeft aria-hidden />
                Précédent
              </Button>
              {step < STEPS.length - 1 && (
                <Button variant="ink" onClick={() => setStep((s) => s + 1)}>
                  {STEPS[step + 1].label}
                  <ArrowRight aria-hidden />
                </Button>
              )}
            </div>
          </section>

          <div className="mt-8">
            <PriceSummary composition={composition} floristName={florist?.name} canOrder={!!florist} onAdd={add} onReset={() => setComposition(EMPTY_COMPOSITION)} />
          </div>
        </div>
      </div>

      {/* Mobile quick bar */}
      {total > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 px-4 md:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-ink p-2 pr-3 text-white shadow-lift">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#fdf2f4]">
              <BouquetPreview composition={composition} className="relative h-full w-full" />
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-semibold">{total} tiges</p>
              <p className="text-xs text-white/70 tabular-nums">{formatPrice(price.total)}</p>
            </div>
            <Button size="sm" className="bg-white text-ink hover:bg-white/90" disabled={!florist || total < MIN_STEMS} onClick={add}>
              {total < MIN_STEMS ? `Min. ${MIN_STEMS} tiges` : 'Ajouter'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
