import type { ReactNode } from 'react'
import SectionHeading from '@/components/shared/SectionHeading'
import type { Store } from '@/data/stores'
import type { CatalogItem } from './catalog'
import StoreProductTile from './StoreProductTile'

interface Props {
  title: ReactNode
  eyebrow?: string
  description?: string
  href?: string
  store: Store
  items: CatalogItem[]
  onOpen: (item: CatalogItem) => void
}

/** Horizontally scrollable row of products of one store. */
export default function ProductRail({ title, eyebrow, description, href, store, items, onOpen }: Props) {
  if (!items.length) return null
  return (
    <section>
      <SectionHeading title={title} eyebrow={eyebrow} description={description} href={href} linkLabel="Tout le rayon" />
      <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:px-0">
        <ul className="flex w-max gap-4">
          {items.map((item) => (
            <li key={item.id} className="w-40 sm:w-48">
              <StoreProductTile store={store} item={item} onOpen={onOpen} className="h-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
