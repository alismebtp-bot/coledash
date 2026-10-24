import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, UtensilsCrossed } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import SectionHeading from '@/components/shared/SectionHeading'
import VendorCard from '@/components/shared/VendorCard'
import { Button } from '@/components/ui/button'
import RestaurantHeader from '@/components/restaurant/RestaurantHeader'
import MenuCategoryNav, { type NavSection } from '@/components/restaurant/MenuCategoryNav'
import MenuItemRow from '@/components/restaurant/MenuItemRow'
import MenuItemDialog from '@/components/restaurant/MenuItemDialog'
import { CartBar, CartSideCard } from '@/components/restaurant/RestaurantCartSummary'
import { allItems, recommendScore, restaurantToCard, sectionDomId } from '@/components/restaurant/utils'
import { getRestaurantById, restaurants, type MenuItem } from '@/data/restaurants'
import { cities, matchesCity } from '@/data/cities'
import { useCity } from '@/store/city'
import { useCart } from '@/store/cart'

export default function RestaurantDetail() {
  const { id = '' } = useParams()
  const restaurant = getRestaurantById(id)
  const { city, setCity } = useCity()
  const cartItems = useCart((s) => s.items)
  const [selected, setSelected] = useState<MenuItem | null>(null)

  useEffect(() => {
    if (restaurant) document.title = `${restaurant.name} · ColeDash`
  }, [restaurant])

  const sections = useMemo(() => {
    if (!restaurant) return []
    const popular = allItems(restaurant).filter((i) => i.isPopular || i.isBestseller)
    const list = restaurant.menu.map((c) => ({ id: c.id, label: c.name, description: c.description, items: c.items }))
    return popular.length >= 2 && restaurant.menu.length > 1
      ? [{ id: 'populaires', label: 'Les plus commandés', description: 'Les favoris de nos clients', items: popular.slice(0, 4) }, ...list]
      : list
  }, [restaurant])

  const navSections: NavSection[] = useMemo(() => sections.map((s) => ({ id: s.id, label: s.label, count: s.items.length })), [sections])

  const similar = useMemo(() => {
    if (!restaurant) return []
    const sameCity = restaurants.filter((r) => r.id !== restaurant.id && r.city === restaurant.city)
    return sameCity
      .sort((a, b) => {
        const shared = (x: typeof a) => x.cuisineType.filter((c) => restaurant.cuisineType.includes(c)).length
        return shared(b) - shared(a) || recommendScore(b) - recommendScore(a)
      })
      .slice(0, 3)
  }, [restaurant])

  if (!restaurant) {
    return (
      <div className="container py-16 pb-24 md:pb-16">
        <EmptyState
          icon={UtensilsCrossed}
          title="Ce restaurant est introuvable"
          description="Il a peut-être changé d'adresse ou n'est plus partenaire de ColeDash. Découvrez les autres tables qui livrent près de chez vous."
          action={
            <Button asChild variant="ink">
              <Link to="/restaurants">Voir les restaurants</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const qtyFor = (productId: string) =>
    cartItems.filter((i) => i.vendorId === restaurant.id && i.productId === productId).reduce((n, i) => n + i.quantity, 0)
  const restaurantCity = cities.find((c) => matchesCity(restaurant.city, c.id))
  const otherCity = restaurantCity && restaurantCity.id !== city.id ? restaurantCity : null

  return (
    <div className="pb-44 md:pb-28 lg:pb-16">
      <RestaurantHeader restaurant={restaurant} />

      {otherCity && (
        <div className="container mt-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              Ce restaurant livre à {otherCity.name}. Votre adresse de livraison est actuellement à {city.name}.
            </p>
            <Button size="sm" variant="ink" onClick={() => setCity(otherCity.id)}>
              Livrer à {otherCity.name}
            </Button>
          </div>
        </div>
      )}

      <div className="container mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <div className="min-w-0">
          <MenuCategoryNav sections={navSections} />
          <div className="mt-6 space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={sectionDomId(s.id)} aria-labelledby={`${sectionDomId(s.id)}-title`} className="scroll-mt-36">
                <div className="mb-4">
                  <h2 id={`${sectionDomId(s.id)}-title`} className="text-xl font-bold text-ink sm:text-2xl">
                    {s.label}
                  </h2>
                  {s.description && <p className="mt-0.5 text-sm text-muted-foreground">{s.description}</p>}
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  {s.items.map((item) => (
                    <MenuItemRow key={`${s.id}-${item.id}`} item={item} quantityInCart={qtyFor(item.id)} onOpen={() => setSelected(item)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="hidden lg:block" aria-label="Récapitulatif du panier">
          <div className="sticky top-24">
            <CartSideCard restaurant={restaurant} />
            <p className="mt-3 px-1 text-xs leading-relaxed text-muted-foreground">
              Une allergie ? Précisez-la dans la note de chaque plat ou contactez le restaurant au {restaurant.phone}.
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container mt-16" aria-label="Vous aimerez aussi">
          <SectionHeading
            eyebrow={`À ${restaurant.city}`}
            title="Vous aimerez aussi"
            href="/restaurants"
            linkLabel="Tous les restaurants"
          />
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((r) => (
              <VendorCard key={r.id} vendor={restaurantToCard(r)} />
            ))}
          </div>
        </section>
      )}

      <MenuItemDialog restaurant={restaurant} item={selected} onClose={() => setSelected(null)} />
      <CartBar restaurant={restaurant} />
    </div>
  )
}
