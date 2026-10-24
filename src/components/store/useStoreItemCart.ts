import { useAddToCart } from '@/hooks/useAddToCart'
import { lineKey, selectProductQuantity, useCart } from '@/store/cart'
import type { Store } from '@/data/stores'
import { toCartInput, type CatalogItem } from './catalog'

/** Cart quantity + add / change handlers for one store item (no options). */
export function useStoreItemCart(store: Store, item: CatalogItem) {
  const quantity = useCart(selectProductQuantity(store.id, item.id))
  const setQuantity = useCart((s) => s.setQuantity)
  const addToCart = useAddToCart()
  const add = (qty = 1) => addToCart({ ...toCartInput(store, item), quantity: qty })
  const change = (q: number) => setQuantity(lineKey({ vendorId: store.id, productId: item.id }), q)
  return { quantity, add, change }
}
