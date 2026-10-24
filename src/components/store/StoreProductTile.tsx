import ProductCard from '@/components/shared/ProductCard'
import type { Store } from '@/data/stores'
import type { CatalogItem } from './catalog'
import { useStoreItemCart } from './useStoreItemCart'
import { cn } from '@/lib/utils'

interface Props {
  store: Store
  item: CatalogItem
  onOpen?: (item: CatalogItem) => void
  className?: string
}

export function ItemBadge({ label }: { label: string }) {
  const tone = label.startsWith('-')
    ? 'bg-brand-600 text-white'
    : label === 'Bio' || label === 'Local'
      ? 'bg-emerald-600 text-white'
      : 'bg-white text-ink'
  return <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm', tone)}>{label}</span>
}

/** ProductCard wired to the cart for one store. */
export default function StoreProductTile({ store, item, onOpen, className }: Props) {
  const { quantity, add, change } = useStoreItemCart(store, item)
  return (
    <ProductCard
      className={className}
      name={item.name}
      image={item.image}
      price={item.price}
      originalPrice={item.originalPrice}
      meta={[item.brand, item.meta].filter(Boolean).join(' · ')}
      badges={item.badges.length ? item.badges.map((b) => <ItemBadge key={b} label={b} />) : undefined}
      quantity={quantity}
      disabled={!item.inStock}
      onAdd={() => add()}
      onQuantityChange={change}
      onOpen={onOpen ? () => onOpen(item) : undefined}
    />
  )
}
