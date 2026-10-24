import { motion } from 'framer-motion'
import { BookOpen, Pill, Smartphone, Store as StoreIcon, Wine, type LucideIcon } from 'lucide-react'
import VendorCard from '@/components/shared/VendorCard'
import EmptyState from '@/components/shared/EmptyState'
import SafeImage from '@/components/shared/SafeImage'
import { toVendorCard } from '@/components/store/catalog'
import { getRetailProducts, retailCategories, type RetailCategory } from '@/data/retailProducts'
import { getStoresByKind } from '@/data/stores'
import { useCity } from '@/store/city'
import { cn } from '@/lib/utils'

const ICONS: Record<RetailCategory, LucideIcon> = { Pharmacie: Pill, Caviste: Wine, 'High-tech': Smartphone, Librairie: BookOpen }
const anchor = (id: string) => `rayon-${id.toLowerCase().replace(/[^a-z]+/g, '-')}`

export default function Retail() {
  const { city, cityId } = useCity()
  const stores = getStoresByKind('retail', cityId)
  const groups = retailCategories.map((c) => ({ ...c, stores: stores.filter((s) => s.category === c.id) }))
  const present = groups.filter((g) => g.stores.length > 0)

  return (
    <div className="pb-24 md:pb-16">
      <section className="container pt-8 md:pt-12">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Boutiques à {city.name}</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-ink sm:text-5xl">Le commerce d’à côté, sans vous déplacer.</h1>
          <p className="mt-3 text-muted-foreground">
            Une crème oubliée, une bouteille pour ce soir, un chargeur ou un roman pour le week-end : vos boutiques de quartier livrent en moins d’une heure.
          </p>
        </motion.div>

        <nav aria-label="Catégories de boutiques" className="mt-8">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {groups.map((g) => {
              const Icon = ICONS[g.id]
              const empty = g.stores.length === 0
              return (
                <li key={g.id}>
                  <a
                    href={empty ? undefined : `#${anchor(g.id)}`}
                    aria-disabled={empty || undefined}
                    className={cn(
                      'group relative block overflow-hidden rounded-2xl',
                      empty ? 'cursor-not-allowed opacity-60' : 'shadow-soft transition-shadow hover:shadow-lift',
                    )}
                  >
                    <SafeImage src={g.image} alt="" wrapperClassName="aspect-[4/3] sm:aspect-[16/10]" className={cn('transition-transform duration-500', !empty && 'group-hover:scale-105', empty && 'grayscale')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                      <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="block font-display text-lg font-bold leading-tight">{g.label}</span>
                      <span className="block text-xs text-white/75">
                        {empty ? 'Bientôt dans votre ville' : `${g.stores.length} boutique${g.stores.length > 1 ? 's' : ''} · ${getRetailProducts(g.id).length} produits`}
                      </span>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </section>

      <div className="container space-y-12 pt-12">
        {present.length === 0 ? (
          <EmptyState icon={StoreIcon} title={`Pas encore de boutique à ${city.name}`} description="Nous préparons l’arrivée de nos premiers commerçants. Revenez bientôt !" />
        ) : (
          present.map((g) => {
            const Icon = ICONS[g.id]
            return (
              <section key={g.id} id={anchor(g.id)} className="scroll-mt-24" aria-labelledby={`${anchor(g.id)}-title`}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 id={`${anchor(g.id)}-title`} className="text-2xl font-bold text-ink">
                      {g.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">{g.description}</p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {g.stores.map((s) => (
                    <VendorCard key={s.id} vendor={toVendorCard(s)} />
                  ))}
                </div>
                {g.id === 'Caviste' && (
                  <p className="mt-4 text-xs text-muted-foreground">Vente d’alcool interdite aux mineurs. L’abus d’alcool est dangereux pour la santé, à consommer avec modération.</p>
                )}
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}
