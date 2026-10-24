import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '@/store/cart'
import type { CartItem } from '@/types'

type Input = Omit<CartItem, 'key' | 'quantity'> & { quantity?: number }

/**
 * Adds to cart with a confirmation toast. The cart holds a single vendor at a
 * time (one courier, one delivery): adding from another vendor asks first.
 */
export function useAddToCart() {
  const navigate = useNavigate()
  return useCallback(
    (item: Input, opts: { silent?: boolean } = {}) => {
      const { items, add, clear } = useCart.getState()
      const other = items.find((i) => i.vendorId !== item.vendorId)
      if (other) {
        toast(`Votre panier contient des articles de ${other.vendorName}`, {
          description: `Vider le panier pour commander chez ${item.vendorName} ?`,
          action: {
            label: 'Vider et ajouter',
            onClick: () => {
              clear()
              add(item)
              toast.success(`${item.name} ajouté au panier`)
            },
          },
          duration: 8000,
        })
        return false
      }
      add(item)
      if (!opts.silent) {
        toast.success(`${item.name} ajouté au panier`, {
          action: { label: 'Voir le panier', onClick: () => navigate('/panier') },
        })
      }
      return true
    },
    [navigate],
  )
}
