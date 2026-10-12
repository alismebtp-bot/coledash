import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cartItems, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7] pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingBag size={40} className="text-stone-300" />
          </motion.div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Votre panier est vide</h1>
          <p className="text-stone-500 mb-8">Découvrez nos restaurants et commerces pour remplir votre panier.</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#e11d48] text-white rounded-xl font-semibold hover:bg-[#be123c] transition-colors"
          >
            <ArrowLeft size={18} />
            Parcourir les restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Panier ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-xl border border-stone-100 p-4 flex gap-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-stone-800">{item.name}</h3>
                        {item.restaurantName && (
                          <p className="text-xs text-stone-500">{item.restaurantName}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-semibold text-stone-800">
                        {(item.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-stone-100 p-6 sticky top-24">
              <h2 className="font-bold text-stone-800 mb-4">Récapitulatif</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Sous-total</span>
                  <span>{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Frais de livraison</span>
                  <span>2.99 €</span>
                </div>
                <div className="border-t border-stone-100 pt-2 mt-2">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>Total</span>
                    <span>{(totalPrice + 2.99).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block w-full py-3 bg-[#e11d48] text-white text-center rounded-xl font-semibold hover:bg-[#be123c] transition-colors"
              >
                Passer la commande
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
