import { X, ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FlowerProduct } from '@/data/flowerCatalog'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  product: FlowerProduct | null
  open: boolean
  onClose: () => void
}

export default function FlowerProductModal({ product, open, onClose }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      storeId: product.storeId,
    })
    toast.success(`${product.name} added to cart`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.occasion && <Badge variant="outline">{product.occasion}</Badge>}
            <div className="flex items-center gap-1 ml-auto">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">€{product.price.toFixed(2)}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
