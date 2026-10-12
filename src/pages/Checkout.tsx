/**
 * ═══════════════════════════════════════════════════════════════════
 *  Checkout — Multi-step checkout page
 *  with address, delivery, payment, and order summary
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, CreditCard, Check, ChevronRight,
  Truck, Home, Building2, Plus, Minus, X, AlertCircle,
  Smartphone, Wallet, BadgeCheck, ShieldCheck, Gift, Tag,
  ChevronDown, Star, Calendar, User, Phone, Mail, Info
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { useToast } from '@/hooks/use-toast';
import { SafeImage } from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/* ── types ─────────────────────────────────────────────────────── */
interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  label: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
}

interface DeliverySlot {
  id: string;
  label: string;
  time: string;
  price: number;
}

/* ── mock data ─────────────────────────────────────────────────── */
const mockAddresses: Address[] = [
  { id: 'addr-1', label: 'Domicile', street: '12 Rue de la Paix', city: 'Paris', postalCode: '75002', isDefault: true },
  { id: 'addr-2', label: 'Bureau', street: '45 Avenue des Champs-Élysées', city: 'Paris', postalCode: '75008', isDefault: false },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm-1', type: 'card', label: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'pm-2', type: 'card', label: 'Mastercard', last4: '8888', expiry: '08/25', isDefault: false },
];

const deliverySlots: DeliverySlot[] = [
  { id: 'slot-1', label: 'Dès que possible', time: '20-35 min', price: 2.99 },
  { id: 'slot-2', label: 'Livraison rapide', time: '15-25 min', price: 4.99 },
  { id: 'slot-3', label: 'Livraison standard', time: '35-50 min', price: 1.99 },
  { id: 'slot-4', label: 'Programmée', time: 'Choisir un horaire', price: 0 },
];

const STEPS = [
  { id: 'address', label: 'Adresse', icon: MapPin },
  { id: 'delivery', label: 'Livraison', icon: Truck },
  { id: 'payment', label: 'Paiement', icon: CreditCard },
  { id: 'summary', label: 'Récapitulatif', icon: Check },
];

/* ── helpers ───────────────────────────────────────────────────── */
const toEuro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default function Checkout() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { selectedCity } = useCity();
  const { toast } = useToast();

  /* ── State ──────────────────────────────────────────────────── */
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<string>(mockAddresses.find((a) => a.isDefault)?.id || '');
  const [selectedSlot, setSelectedSlot] = useState<string>('slot-1');
  const [selectedPayment, setSelectedPayment] = useState<string>(mockPaymentMethods.find((p) => p.isDefault)?.id || '');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  /* New address form */
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', postalCode: '' });

  /* New payment form */
  const [showNewPayment, setShowNewPayment] = useState(false);

  /* ── derived data ───────────────────────────────────────────── */
  const deliveryFee = deliverySlots.find((s) => s.id === selectedSlot)?.price || 0;
  const subtotal = total;
  const serviceFee = subtotal * 0.05;
  const tip = tipAmount;
  const discount = promoApplied ? promoDiscount : 0;
  const finalTotal = subtotal + deliveryFee + serviceFee + tip - discount;

  const selectedAddr = mockAddresses.find((a) => a.id === selectedAddress);
  const selectedPay = mockPaymentMethods.find((p) => p.id === selectedPayment);
  const selectedDel = deliverySlots.find((s) => s.id === selectedSlot);

  /* ── actions ────────────────────────────────────────────────── */
  const applyPromo = useCallback(() => {
    if (!promoCode.trim()) return;
    const code = promoCode.trim().toUpperCase();
    if (code === 'BIENVENUE10') {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1);
      toast({ title: 'Code promo appliqué', description: '-10% sur votre commande' });
    } else if (code === 'LIVRAISON') {
      setPromoApplied(true);
      setPromoDiscount(deliveryFee);
      toast({ title: 'Code promo appliqué', description: 'Livraison gratuite' });
    } else {
      toast({ title: 'Code promo invalide', description: 'Vérifiez le code et réessayez', variant: 'destructive' });
    }
  }, [promoCode, subtotal, deliveryFee, toast]);

  const handlePlaceOrder = useCallback(async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const id = `CMD-${Date.now()}`;
    setOrderId(id);
    setOrderComplete(true);
    clearCart();
    setIsProcessing(false);
    toast({ title: 'Commande confirmée', description: `N° ${id}` });
  }, [clearCart, toast]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: return !!selectedAddress;
      case 1: return !!selectedSlot;
      case 2: return !!selectedPayment;
      case 3: return true;
      default: return false;
    }
  }, [currentStep, selectedAddress, selectedSlot, selectedPayment]);

  /* ── render ───────────────────────────────────────────────────── */
  if (orderComplete) {
    return <OrderConfirmation orderId={orderId} onContinue={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Paiement</h1>
            <p className="text-sm text-stone-400">Finalisez votre commande en quelques étapes</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${idx > 0 ? 'ml-4 sm:ml-8' : ''}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-[#f59e0b] text-white shadow-md'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {isDone ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-[10px] font-medium mt-1.5 whitespace-nowrap ${
                      isActive ? 'text-[#f59e0b]' : isDone ? 'text-emerald-500' : 'text-stone-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-8 sm:w-16 mx-2 sm:mx-4 transition-colors ${
                      isDone ? 'bg-emerald-500' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Main form ───────────────────────────────────────── */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Step 1: Address */}
              {currentStep === 0 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">Adresse de livraison</h2>

                  {mockAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAddress === addr.id
                          ? 'border-[#f59e0b] bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          selectedAddress === addr.id ? 'border-[#f59e0b]' : 'border-stone-300'
                        }`}>
                          {selectedAddress === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-800">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] rounded-full">Par défaut</span>
                            )}
                          </div>
                          <p className="text-sm text-stone-500 mt-0.5">{addr.street}</p>
                          <p className="text-sm text-stone-500">{addr.postalCode} {addr.city}</p>
                        </div>
                        <MapPin size={18} className="text-stone-400 shrink-0" />
                      </div>
                    </button>
                  ))}

                  {/* Add new address */}
                  <AnimatePresence>
                    {showNewAddress ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-xl border border-stone-200 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-stone-700">Nouvelle adresse</h3>
                          <button onClick={() => setShowNewAddress(false)} className="text-stone-400 hover:text-stone-600">
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Label (ex: Domicile)"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                        />
                        <input
                          type="text"
                          placeholder="Rue"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress((p) => ({ ...p, street: e.target.value }))}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Code postal"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))}
                            className="w-1/3 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                          />
                          <input
                            type="text"
                            placeholder="Ville"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                            className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!newAddress.label || !newAddress.street) return;
                            const id = `addr-${Date.now()}`;
                            mockAddresses.push({ ...newAddress, id, isDefault: false });
                            setSelectedAddress(id);
                            setShowNewAddress(false);
                            setNewAddress({ label: '', street: '', city: '', postalCode: '' });
                            toast({ title: 'Adresse ajoutée' });
                          }}
                          className="w-full py-2.5 bg-stone-800 text-white rounded-lg text-sm font-semibold hover:bg-stone-900 transition-colors"
                        >
                          Ajouter cette adresse
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-500 hover:border-stone-300 hover:text-stone-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Ajouter une nouvelle adresse
                      </button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {currentStep === 1 && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">Options de livraison</h2>

                  {deliverySlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedSlot === slot.id
                          ? 'border-[#f59e0b] bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedSlot === slot.id ? 'border-[#f59e0b]' : 'border-stone-300'
                        }`}>
                          {selectedSlot === slot.id && <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-800">{slot.label}</span>
                            <span className="text-sm font-medium text-stone-700">
                              {slot.price === 0 ? 'Gratuit' : `+${slot.price.toFixed(2)}€`}
                            </span>
                          </div>
                          <p className="text-sm text-stone-500">{slot.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Order note */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Note pour le livreur</label>
                    <textarea
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Code d'entrée, étage, instructions spéciales..."
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b] resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">Méthode de paiement</h2>

                  {mockPaymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPayment(pm.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedPayment === pm.id
                          ? 'border-[#f59e0b] bg-amber-50'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === pm.id ? 'border-[#f59e0b]' : 'border-stone-300'
                        }`}>
                          {selectedPayment === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />}
                        </div>
                        <div className="w-10 h-7 bg-stone-100 rounded-md flex items-center justify-center">
                          <CreditCard size={16} className="text-stone-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-800">{pm.label}</span>
                            {pm.isDefault && (
                              <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] rounded-full">Par défaut</span>
                            )}
                          </div>
                          <p className="text-sm text-stone-500">•••• {pm.last4} · Expire {pm.expiry}</p>
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Add new card */}
                  <AnimatePresence>
                    {showNewPayment ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-xl border border-stone-200 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-stone-700">Nouvelle carte</h3>
                          <button onClick={() => setShowNewPayment(false)} className="text-stone-400 hover:text-stone-600">
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Numéro de carte"
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-1/3 px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="w-1/4 px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowNewPayment(false);
                            toast({ title: 'Carte ajoutée' });
                          }}
                          className="w-full py-2.5 bg-stone-800 text-white rounded-lg text-sm font-semibold hover:bg-stone-900 transition-colors"
                        >
                          Ajouter cette carte
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setShowNewPayment(true)}
                        className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-500 hover:border-stone-300 hover:text-stone-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Ajouter une carte
                      </button>
                    )}
                  </AnimatePresence>

                  {/* Tip */}
                  <div className="mt-4">
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Pourboire pour le livreur</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 5].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setTipAmount(amount)}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                            tipAmount === amount
                              ? 'bg-[#f59e0b] text-white border-[#f59e0b]'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {amount === 0 ? 'Aucun' : `${amount}€`}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Summary */}
              {currentStep === 3 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-stone-800 mb-4">Récapitulatif</h2>

                  {/* Address summary */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-[#f59e0b]" />
                      <span className="text-sm font-semibold text-stone-700">Adresse de livraison</span>
                    </div>
                    <p className="text-sm text-stone-600">{selectedAddr?.street}</p>
                    <p className="text-sm text-stone-600">{selectedAddr?.postalCode} {selectedAddr?.city}</p>
                  </div>

                  {/* Delivery summary */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck size={16} className="text-[#f59e0b]" />
                      <span className="text-sm font-semibold text-stone-700">Livraison</span>
                    </div>
                    <p className="text-sm text-stone-600">{selectedDel?.label} · {selectedDel?.time}</p>
                    {orderNote && (
                      <p className="text-sm text-stone-500 mt-1">Note: {orderNote}</p>
                    )}
                  </div>

                  {/* Payment summary */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={16} className="text-[#f59e0b]" />
                      <span className="text-sm font-semibold text-stone-700">Paiement</span>
                    </div>
                    <p className="text-sm text-stone-600">{selectedPay?.label} · •••• {selectedPay?.last4}</p>
                    {tipAmount > 0 && (
                      <p className="text-sm text-stone-500 mt-1">Pourboire: {tipAmount}€</p>
                    )}
                  </div>

                  {/* Items */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <h3 className="text-sm font-semibold text-stone-700 mb-3">Articles</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <SafeImage
                            src={item.image}
                            alt={item.name}
                            containerClassName="w-14 h-14 rounded-lg bg-stone-100 shrink-0"
                            className="object-cover"
                            placeholderSize={8}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                            <p className="text-xs text-stone-400">Qté: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-stone-700">{toEuro(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="bg-white rounded-xl border border-stone-200 p-4">
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Code promo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Entrez votre code"
                        className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 focus:border-[#f59e0b]"
                        disabled={promoApplied}
                      />
                      <button
                        onClick={applyPromo}
                        disabled={promoApplied}
                        className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-900 transition-colors disabled:opacity-40"
                      >
                        {promoApplied ? 'Appliqué' : 'Appliquer'}
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                        <Check size={12} /> Code promo appliqué: -{toEuro(discount)}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="px-6 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Retour
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canProceed}
                  className="ml-auto px-6 py-3 bg-[#f59e0b] text-white rounded-xl text-sm font-semibold hover:bg-[#d97706] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Continuer <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="ml-auto px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Commander {toEuro(finalTotal)}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── Order summary sidebar ───────────────────────────── */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl border border-stone-200 p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-stone-800 mb-4">Votre commande</h3>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      containerClassName="w-12 h-12 rounded-lg bg-stone-100 shrink-0"
                      className="object-cover"
                      placeholderSize={8}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs text-stone-600">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-stone-700">{toEuro(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[10px] text-red-400 hover:text-red-600 mt-0.5"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Sous-total</span>
                  <span className="text-stone-700">{toEuro(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Livraison</span>
                  <span className="text-stone-700">{deliveryFee === 0 ? 'Gratuit' : `+${toEuro(deliveryFee)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Frais de service (5%)</span>
                  <span className="text-stone-700">{toEuro(serviceFee)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Pourboire</span>
                    <span className="text-stone-700">{toEuro(tip)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Réduction</span>
                    <span className="text-emerald-600">-{toEuro(discount)}</span>
                  </div>
                )}
                <div className="border-t border-stone-100 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-stone-800">TOTAL</span>
                    <span className="font-bold text-stone-800">{toEuro(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-center gap-4 text-stone-400">
                <div className="flex items-center gap-1 text-[10px]">
                  <ShieldCheck size={12} /> Paiement sécurisé
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <BadgeCheck size={12} /> SSL 256-bit
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OrderConfirmation — Success screen after order placement
   ═══════════════════════════════════════════════════════════════ */
function OrderConfirmation({ orderId, onContinue }: { orderId: string; onContinue: () => void }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md w-full text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
          className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
        >
          <Check size={40} className="text-emerald-600" />
        </motion.div>

        <h2 className="text-2xl font-bold text-stone-800 mb-2">Commande confirmée !</h2>
        <p className="text-stone-500 mb-6">Votre commande a été envoyée au restaurant</p>

        <div className="bg-stone-50 rounded-xl p-4 mb-6">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Numéro de commande</p>
          <p className="text-lg font-bold text-stone-800 font-mono">{orderId}</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <Clock size={16} className="text-stone-400" />
            <span>Temps de préparation estimé: 20-30 min</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <Truck size={16} className="text-stone-400" />
            <span>Livraison estimée: 35-50 min</span>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 bg-[#f59e0b] text-white rounded-xl text-sm font-semibold hover:bg-[#d97706] transition-colors"
        >
          Retour à l'accueil
        </button>
      </motion.div>
    </div>
  );
}
