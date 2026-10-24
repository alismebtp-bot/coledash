import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'
import VendorCard, { type VendorCardData } from '@/components/shared/VendorCard'
import { useFavorites } from '@/store/favorites'
import { getRestaurantById } from '@/data/restaurants'
import { getStoreById } from '@/data/stores'
import { restaurantCard, storeCard } from '@/lib/vendors'

export default function FavoritesSection() {
  const ids = useFavorites((s) => s.ids)
  const cards = ids
    .map((id): VendorCardData | null => {
      const r = getRestaurantById(id)
      if (r) return restaurantCard(r)
      const s = getStoreById(id)
      return s ? storeCard(s) : null
    })
    .filter((c): c is VendorCardData => c !== null)

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Pas encore de favoris"
        description="Touchez le cœur sur un restaurant ou une boutique pour le retrouver ici."
        action={
          <Button asChild variant="ink">
            <Link to="/restaurants">Explorer les restaurants</Link>
          </Button>
        }
      />
    )
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <VendorCard key={c.id} vendor={c} />
      ))}
    </div>
  )
}
