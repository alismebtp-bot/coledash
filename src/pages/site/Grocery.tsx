import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Apple,
  ArrowRight,
  Baby,
  Beef,
  Bike,
  Croissant,
  Leaf,
  Milk,
  Package,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Wine,
  type LucideIcon,
} from 'lucide-react'
import VendorCard from '@/components/shared/VendorCard'
import SectionHeading from '@/components/shared/SectionHeading'
import EmptyState from '@/components/shared/EmptyState'
import ProductRail from '@/components/store/ProductRail'
import ProductDetailDialog from '@/components/store/ProductDetailDialog'
import { fromGrocery, toVendorCard, type CatalogItem } from '@/components/store/catalog'
import { getLocalProducts, getOrganicProducts, getPromotions, groceryCategories, products } from '@/data/groceryProducts'
import { getStoresByKind } from '@/data/stores'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/pricing'
import { formatPrice } from '@/lib/format'
import { useCity } from '@/store/city'

const ICONS: Record<string, LucideIcon> = {
  'fruits-legumes': Apple,
  'viandes-poissons': Beef,
  'produits-laitiers': Milk,
  boulangerie: Croissant,
  boissons: Wine,
  epicerie: Package,
  surgeles: Snowflake,
  bebe: Baby,
  hygiene: Sparkles,
  'bio-local': Leaf,
}

const TINTS = ['bg-emerald-50 text-emerald-700', 'bg-rose-50 text-rose-700', 'bg-sky-50 text-sky-700', 'bg-amber-50 text-amber-700', 'bg-violet-50 text-violet-700']

export default function Grocery() {
  const { city, cityId } = useCity()
  const stores = getStoresByKind('grocery', cityId)
  const first = stores[0]
  const [open, setOpen] = useState<CatalogItem | null>(null)

  const rayons = useMemo(
    () =>
      groceryCategories
        .filter((c) => c.id !== 'all')
        .map((c) => ({ ...c, count: products.filter((p) => p.category === c.id).length }))
        .filter((c) => c.count > 0),
    [],
  )
  const promos = useMemo(() => getPromotions().slice(0, 12).map((p) => fromGrocery(p)), [])
  const fresh = useMemo(() => {
    const seen = new Set<string>()
    return [...getOrganicProducts(), ...getLocalProducts()]
      .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
      .slice(0, 12)
      .map((p) => fromGrocery(p))
  }, [])

  return (
    <div className="pb-24 md:pb-16">
      {/* Hero */}
      <section className="container pt-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#173d2f] px-6 py-10 text-white sm:px-10 md:py-14">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#2b6a4f] opacity-60" aria-hidden />
          <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-[#f4c95d] opacity-25" aria-hidden />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#c9f1d9]">
              <ShoppingBasket className="h-3.5 w-3.5" aria-hidden />
              Courses à {city.name}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-white sm:text-5xl">Le marché, livré chez vous en 20 minutes.</h1>
            <p className="mt-3 text-white/75">
              Primeurs, crèmerie, épicerie fine et produits du quotidien, choisis avec soin par les commerçants de votre quartier.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {first && (
                <Link to={`/courses/${first.id}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#173d2f] transition-transform hover:-translate-y-0.5">
                  Faire mes courses
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
                <Bike className="h-4 w-4" aria-hidden />
                Livraison offerte dès {formatPrice(FREE_DELIVERY_THRESHOLD)}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {!first ? (
        <div className="container py-12">
          <EmptyState icon={ShoppingBasket} title={`Pas encore d’épicerie à ${city.name}`} description="Nos premiers commerçants arrivent bientôt. Changez de ville pour découvrir l’offre." />
        </div>
      ) : (
        <div className="container space-y-14 pt-12">
          <section>
            <SectionHeading eyebrow="Commerces" title={`Vos épiceries à ${city.name}`} description={`${stores.length} commerce${stores.length > 1 ? 's' : ''} partenaire${stores.length > 1 ? 's' : ''} près de chez vous`} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stores.map((s) => (
                <VendorCard key={s.id} vendor={toVendorCard(s)} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading eyebrow="Rayons" title="Parcourir par rayon" description={`Chez ${first.name}`} />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {rayons.map((r, i) => {
                const Icon = ICONS[r.id] ?? Package
                return (
                  <li key={r.id}>
                    <Link
                      to={`/courses/${first.id}?rayon=${r.id}`}
                      className="group flex h-full items-center gap-3 rounded-2xl border bg-card p-3 shadow-soft transition-shadow hover:shadow-lift"
                    >
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TINTS[i % TINTS.length]}`}>
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-700">{r.label}</span>
                        <span className="block text-xs text-muted-foreground">{r.count} produits</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <ProductRail
            eyebrow="Bons plans"
            title="Promotions de la semaine"
            description={`Chez ${first.name}`}
            store={first}
            items={promos}
            onOpen={setOpen}
          />

          <ProductRail
            eyebrow="Circuit court"
            title="Bio & local"
            description="Des producteurs que l’on connaît par leur prénom."
            href={`/courses/${first.id}?rayon=bio-local`}
            store={first}
            items={fresh}
            onOpen={setOpen}
          />
        </div>
      )}

      {first && <ProductDetailDialog store={first} item={open} onOpenChange={(o) => !o && setOpen(null)} />}
    </div>
  )
}
