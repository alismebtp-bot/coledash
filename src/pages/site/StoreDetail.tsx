import { Link, useLocation, useParams } from 'react-router-dom'
import { Store as StoreIcon } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import StoreHeader from '@/components/store/StoreHeader'
import StoreCartBar from '@/components/store/StoreCartBar'
import ProductCatalog from '@/components/store/ProductCatalog'
import FloristCatalog from '@/components/flowers/FloristCatalog'
import { getStoreById } from '@/data/stores'

const ROOTS: Record<string, { href: string; label: string }> = {
  courses: { href: '/courses', label: 'Voir les épiceries' },
  boutiques: { href: '/boutiques', label: 'Voir les boutiques' },
  fleurs: { href: '/fleurs', label: 'Voir les fleuristes' },
}

export default function StoreDetail() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const store = id ? getStoreById(id) : undefined

  if (!store) {
    const root = ROOTS[pathname.split('/')[1]] ?? ROOTS.courses
    return (
      <div className="container py-16">
        <EmptyState
          icon={StoreIcon}
          title="Commerce introuvable"
          description="Ce commerce n’existe pas ou ne livre plus sur ColeDash."
          action={
            <Button asChild variant="ink">
              <Link to={root.href}>{root.label}</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className={store.kind === 'flowers' ? 'bg-[#fbf6f2] pb-40 md:pb-28' : 'pb-40 md:pb-28'}>
      <StoreHeader store={store} />
      {store.kind === 'flowers' ? <FloristCatalog key={store.id} store={store} /> : <ProductCatalog key={store.id} store={store} />}
      <StoreCartBar store={store} />
    </div>
  )
}
