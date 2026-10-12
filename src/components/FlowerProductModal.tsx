import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Minus, Plus, ShoppingCart, X, Heart, Truck, Clock, Shield } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FlowerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  occasions: string[];
  colors: string[];
  sizes: { label: string; price: number }[];
}

interface FlowerProductModalProps {
  product: FlowerProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FlowerProductModal({
  product,
  open,
  onOpenChange,
}: FlowerProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  if (!product) return null;

  const currentPrice = product.sizes?.[selectedSize]?.price ?? product.price;

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor || "default"}`,
      name: `${product.name}${product.sizes[selectedSize]?.label ? ` (${product.sizes[selectedSize].label})` : ""}`,
      price: currentPrice,
      quantity,
      image: product.image,
    });
    toast.success(`${product.name} ajouté au panier`);
    onOpenChange(false);
    setQuantity(1);
  };

  const colorMap: Record<string, string> = {
    Rouge: "bg-red-500",
    Rose: "bg-pink-400",
    Blanc: "bg-white border border-slate-300",
    Jaune: "bg-yellow-400",
    Orange: "bg-orange-400",
    Violet: "bg-purple-500",
    Bleu: "bg-blue-500",
    "Vert clair": "bg-green-300",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{product.category}</p>
                <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  isWishlisted
                    ? "bg-red-50 text-red-500"
                    : "bg-slate-100 text-slate-400 hover:text-red-400"
                )}
              >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-slate-300"
                    )}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-slate-600">({product.reviewCount})</span>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600">{product.description}</p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700">Taille</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                        selectedSize === idx
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {size.label} — {size.price.toFixed(2)} €
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-700">Couleur</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                        selectedColor === color
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full",
                          colorMap[color] || "bg-slate-300"
                        )}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4 text-emerald-500" />
                Livraison express disponible
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-emerald-500" />
                {product.deliveryTime}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-emerald-500" />
                Garantie fraîcheur 7 jours
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">
                    {currentPrice.toFixed(2)} €
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-slate-400 line-through">
                      {product.originalPrice.toFixed(2)} €
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-slate-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-slate-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button onClick={handleAddToCart} className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
