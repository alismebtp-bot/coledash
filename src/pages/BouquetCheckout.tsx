import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Minus, Trash2, Gift, Clock,
  MapPin, CreditCard, Check, Truck, Home, Briefcase, Star,
  MessageSquare, Phone, Shield, AlertCircle, Sparkles, X,
  Package, Heart, Calendar, ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import SafeImage from '@/components/SafeImage';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';

// ─── Types ───────────────────────────────────────────────────────────
interface BouquetAddon { id: string; name: string; price: number; icon: string; }
interface DeliverySlot { id: string; label: string; time: string; price: number; }
interface Address { id: string; label: string; street: string; city: string; instructions?: string; }

// ─── Mock Data ───────────────────────────────────────────────────────
const bouquetAddons: BouquetAddon[] = [
  { id: 'card', name: 'Carte message personnalisée', price: 3.50, icon: 'message' },
  { id: 'chocolate', name: 'Boîte de chocolats', price: 12.90, icon: 'gift' },
  { id: 'vase', name: 'Vase en céramique', price: 18.00, icon: 'home' },
  { id: 'teddy', name: 'Petit ours en peluche', price: 14.50, icon: 'heart' },
  { id: 'wine', name: 'Bouteille de champagne', price: 45.00, icon: 'sparkles' },
  { id: 'balloons', name: 'Bouquet de ballons', price: 9.90, icon: 'package' },
];

const deliverySlots: DeliverySlot[] = [
  { id: 'express', label: 'Express', time: 'Dans 1h', price: 9.90 },
  { id: 'morning', label: 'Matin', time: '9h - 13h', price: 4.90 },
  { id: 'afternoon', label: 'Après-midi', time: '14h - 18h', price: 4.90 },
  { id: 'evening', label: 'Soirée', time: '18h - 21h', price: 5.90 },
  { id: 'scheduled', label: 'Programmé', time: 'Choisir une date', price: 3.90 },
];

const savedAddresses: Address[] = [
  { id: '1', label: 'Maison', street: '15 Rue de Rivoli, Paris 75001', city: 'Paris', instructions: 'Sonner à l\'interphone' },
  { id: '2', label: 'Bureau', street: '42 Avenue des Champs-Élysées, Paris 75008', city: 'Paris', instructions: 'Accueil au rez-de-chaussée' },
];

const occasionMessages: Record<string, string[]> = {
  birthday: [
    'Joyeux anniversaire ! 🎉 Que cette journée soit remplie de joie et de belles surprises.',
    'Bonne fête ! Je te souhaite tout le bonheur du monde.',
    'Un an de plus, un an de plus belle. Joyeux anniversaire !',
  ],
  love: [
    'Je t\'aime de tout mon cœur. Ces fleurs ne sont rien comparé à mon amour pour toi.',
    'Tu es la plus belle chose qui me soit arrivée. 💕',
    'Avec toi, chaque jour est une fête. Je t\'aime !',
  ],
  thanks: [
    'Merci pour tout ce que tu fais. Tu es extraordinaire !',
    'Un grand merci avec toute ma gratitude.',
    'Je ne sais pas comment te remercier. Voici un petit geste pour dire merci.',
  ],
  condolences: [
    'Toutes mes condoléances. Je pense très fort à toi.',
    'Dans ces moments difficiles, je suis à tes côtés.',
    'Mes pensées les plus sincères t\'accompagnent.',
  ],
  congrats: [
    'Félicitations ! Tu le mérites amplement.',
    'Bravo pour cette belle réussite !',
    'Toutes mes félicitations. Je suis fier/fière de toi !',
  ],
};

// ─── Steps ───────────────────────────────────────────────────────────
type CheckoutStep = 'cart' | 'addons' | 'delivery' | 'message' | 'payment' | 'confirmation';

// ─── Main Component ──────────────────────────────────────────────────
export default function BouquetCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<CheckoutStep>('cart');
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [selectedSlot, setSelectedSlot] = useState<string>('morning');
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('birthday');
  const [selectedMessageTemplate, setSelectedMessageTemplate] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [orderId, setOrderId] = useState('');

  const bouquetItems = items.filter((item) => item.category === 'bouquet');

  useEffect(() => {
    if (bouquetItems.length === 0 && !orderComplete) {
      navigate('/bouquets');
    }
  }, [bouquetItems, navigate, orderComplete]);

  const toggleAddon = (id: string) => {
    const next = new Set(selectedAddons);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedAddons(next);
  };

  const addonsTotal = Array.from(selectedAddons).reduce((sum, id) => {
    const addon = bouquetAddons.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const slotPrice = deliverySlots.find((s) => s.id === selectedSlot)?.price || 0;
  const subtotal = bouquetItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = subtotal + addonsTotal + slotPrice;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const newOrderId = `BQT-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderComplete(true);
    setStep('confirmation');
    setIsProcessing(false);
    clearCart();
  };

  const canProceed = () => {
    switch (step) {
      case 'cart': return bouquetItems.length > 0;
      case 'addons': return true;
      case 'delivery': return selectedAddress && (selectedSlot !== 'scheduled' || (scheduledDate && scheduledTime));
      case 'message': return true;
      case 'payment': return true;
      default: return false;
    }
  };

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'cart', label: 'Panier' },
    { key: 'addons', label: 'Options' },
    { key: 'delivery', label: 'Livraison' },
    { key: 'message', label: 'Message' },
    { key: 'payment', label: 'Paiement' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // ─── Step Renderers ────────────────────────────────────────────────
  const renderCartStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <Gift size={20} className="text-[#FF3008]" /> Votre bouquet
      </h2>
      {bouquetItems.map((item) => (
        <motion.div
          key={item.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-[#F0EEEA] p-4 flex gap-4"
        >
          <SafeImage src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A]">{item.name}</h3>
                <p className="text-xs text-[#A6A6A6]">{item.restaurantName}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 rounded-lg hover:bg-[#FFF0ED] flex items-center justify-center text-[#A6A6A6] hover:text-[#FF3008] transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-[#E8E8E8] flex items-center justify-center hover:border-[#FF3008] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-[#E8E8E8] flex items-center justify-center hover:border-[#FF3008] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-base font-bold text-[#1A1A1A]">€{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Subtotal */}
      <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#6B6B6B]">Sous-total</span>
          <span className="text-sm font-medium">€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EEEA]">
          <span className="text-base font-semibold text-[#1A1A1A]">Total</span>
          <span className="text-xl font-bold text-[#FF3008]">€{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderAddonsStep = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <Sparkles size={20} className="text-[#FF3008]" /> Personnalisez votre bouquet
      </h2>
      <p className="text-sm text-[#6B6B6B]">Ajoutez des options pour faire de ce moment quelque chose d'unique.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bouquetAddons.map((addon) => {
          const selected = selectedAddons.has(addon.id);
          return (
            <button
              key={addon.id}
              onClick={() => toggleAddon(addon.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selected ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] bg-white hover:border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected ? 'bg-[#FF3008] text-white' : 'bg-[#F9F9FB] text-[#6B6B6B]'}`}>
                    {addon.icon === 'message' && <MessageSquare size={18} />}
                    {addon.icon === 'gift' && <Gift size={18} />}
                    {addon.icon === 'home' && <Home size={18} />}
                    {addon.icon === 'heart' && <Heart size={18} />}
                    {addon.icon === 'sparkles' && <Sparkles size={18} />}
                    {addon.icon === 'package' && <Package size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{addon.name}</p>
                    <p className="text-xs text-[#A6A6A6]">+ €{addon.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#FF3008] bg-[#FF3008]' : 'border-[#E8E8E8]'}`}>
                  {selected && <Check size={14} className="text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAddons.size > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B6B6B]">Options sélectionnées</span>
            <span className="text-sm font-medium text-[#FF3008]">+ €{addonsTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <Truck size={20} className="text-[#FF3008]" /> Livraison
      </h2>

      {/* Address Selection */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Adresse de livraison</h3>
        <div className="space-y-2">
          {savedAddresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => setSelectedAddress(addr.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedAddress === addr.id ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] bg-white hover:border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedAddress === addr.id ? 'bg-[#FF3008] text-white' : 'bg-[#F9F9FB] text-[#6B6B6B]'}`}>
                  {addr.label === 'Maison' ? <Home size={18} /> : <Briefcase size={18} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A]">{addr.label}</p>
                  <p className="text-xs text-[#6B6B6B]">{addr.street}</p>
                  {addr.instructions && <p className="text-[10px] text-[#A6A6A6] mt-1">{addr.instructions}</p>}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAddress === addr.id ? 'border-[#FF3008] bg-[#FF3008]' : 'border-[#E8E8E8]'}`}>
                  {selectedAddress === addr.id && <Check size={14} className="text-white" />}
                </div>
              </div>
            </button>
          ))}
          <button className="w-full p-4 rounded-2xl border-2 border-dashed border-[#E8E8E8] text-center hover:border-[#FF3008] transition-colors">
            <Plus size={18} className="text-[#A6A6A6] mx-auto mb-1" />
            <span className="text-xs text-[#6B6B6B]">Ajouter une nouvelle adresse</span>
          </button>
        </div>
      </div>

      {/* Delivery Slot */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Créneau de livraison</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {deliverySlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                selectedSlot === slot.id ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] bg-white hover:border-[#E8E8E8]'
              }`}
            >
              <p className="text-sm font-medium text-[#1A1A1A]">{slot.label}</p>
              <p className="text-xs text-[#A6A6A6]">{slot.time}</p>
              <p className={`text-xs font-medium mt-1 ${slot.price === 0 ? 'text-[#00C853]' : 'text-[#FF3008]'}`}>
                {slot.price === 0 ? 'Gratuit' : `+ €${slot.price.toFixed(2)}`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Date/Time */}
      <AnimatePresence>
        {selectedSlot === 'scheduled' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4 space-y-3">
              <h3 className="text-sm font-medium text-[#1A1A1A] flex items-center gap-2">
                <Calendar size={16} className="text-[#FF3008]" /> Choisir une date et heure
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B6B6B] block mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6B6B] block mb-1">Heure</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderMessageStep = () => (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <MessageSquare size={20} className="text-[#FF3008]" /> Votre message
      </h2>

      {/* Occasion */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Occasion</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'birthday', label: 'Anniversaire', icon: Gift },
            { key: 'love', label: 'Amour', icon: Heart },
            { key: 'thanks', label: 'Remerciements', icon: Star },
            { key: 'condolences', label: 'Condoléances', icon: AlertCircle },
            { key: 'congrats', label: 'Félicitations', icon: Sparkles },
          ].map((occ) => (
            <button
              key={occ.key}
              onClick={() => { setSelectedOccasion(occ.key); setSelectedMessageTemplate(0); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                selectedOccasion === occ.key ? 'border-[#FF3008] bg-[#FFF0ED] text-[#FF3008]' : 'border-[#F0EEEA] bg-white text-[#6B6B6B] hover:border-[#E8E8E8]'
              }`}
            >
              <occ.icon size={16} />
              {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Templates */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Messages suggérés</h3>
        <div className="space-y-2">
          {occasionMessages[selectedOccasion]?.map((msg, i) => (
            <button
              key={i}
              onClick={() => { setSelectedMessageTemplate(i); setCustomMessage(msg); }}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                selectedMessageTemplate === i ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] bg-white hover:border-[#E8E8E8]'
              }`}
            >
              <p className="text-sm text-[#1A1A1A]">{msg}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Ou écrivez votre propre message</h3>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Votre message personnel..."
          rows={4}
          maxLength={200}
          className="w-full px-4 py-3 rounded-2xl border border-[#E8E8E8] text-sm resize-none focus:outline-none focus:border-[#FF3008] transition-colors"
        />
        <p className="text-right text-xs text-[#A6A6A6] mt-1">{customMessage.length}/200</p>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <CreditCard size={20} className="text-[#FF3008]" /> Paiement
      </h2>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-[#F0EEEA] p-4 space-y-2">
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Récapitulatif</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B6B6B]">Bouquet(s)</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        {addonsTotal > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B6B6B]">Options</span>
            <span>€{addonsTotal.toFixed(2)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B6B6B]">Livraison ({deliverySlots.find((s) => s.id === selectedSlot)?.label})</span>
          <span>€{slotPrice.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#F0EEEA]">
          <span className="text-base font-semibold text-[#1A1A1A]">Total</span>
          <span className="text-xl font-bold text-[#FF3008]">€{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Moyen de paiement</h3>
        <div className="space-y-2">
          {[
            { id: 'card', label: 'Carte bancaire', desc: '•••• 4242', icon: CreditCard },
            { id: 'paypal', label: 'PayPal', desc: 'compte@email.com', icon: Globe },
            { id: 'apple_pay', label: 'Apple Pay', desc: 'Débit instantané', icon: Smartphone },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                paymentMethod === method.id ? 'border-[#FF3008] bg-[#FFF0ED]' : 'border-[#F0EEEA] bg-white hover:border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-[#FF3008] text-white' : 'bg-[#F9F9FB] text-[#6B6B6B]'}`}>
                  <method.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#1A1A1A]">{method.label}</p>
                  <p className="text-xs text-[#A6A6A6]">{method.desc}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#FF3008] bg-[#FF3008]' : 'border-[#E8E8E8]'}`}>
                  {paymentMethod === method.id && <Check size={14} className="text-white" />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#E8F5E9]">
        <Shield size={16} className="text-[#00C853] flex-shrink-0" />
        <p className="text-xs text-[#00C853]">Paiement sécurisé par encryption SSL. Vos données bancaires ne sont jamais stockées.</p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full h-14 rounded-2xl bg-[#FF3008] text-white text-base font-semibold hover:bg-[#E62B07] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          <>
            Payer €{finalTotal.toFixed(2)} <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-6"
      >
        <Check size={40} className="text-[#00C853]" />
      </motion.div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Commande confirmée !</h2>
      <p className="text-sm text-[#6B6B6B] mb-1">Votre bouquet sera livré avec amour.</p>
      <p className="text-xs text-[#A6A6A6] mb-6">Commande #{orderId}</p>

      <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5 text-left max-w-sm mx-auto mb-6">
        <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Détails de la livraison</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-[#FF3008]" />
            <span className="text-[#6B6B6B]">{savedAddresses.find((a) => a.id === selectedAddress)?.street}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-[#FF3008]" />
            <span className="text-[#6B6B6B]">
              {selectedSlot === 'scheduled'
                ? `${scheduledDate} à ${scheduledTime}`
                : deliverySlots.find((s) => s.id === selectedSlot)?.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare size={14} className="text-[#FF3008]" />
            <span className="text-[#6B6B6B] truncate">{customMessage || occasionMessages[selectedOccasion]?.[0]}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate('/account?tab=orders')}
          className="px-6 h-11 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors"
        >
          Voir mes commandes
        </button>
        <button
          onClick={() => navigate('/bouquets')}
          className="px-6 h-11 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors"
        >
          Commander à nouveau
        </button>
      </div>
    </motion.div>
  );

  // ─── Main Render ───────────────────────────────────────────────────
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FDF8F3]">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {renderConfirmation()}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#F0EEEA]">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (currentStepIndex > 0) setStep(steps[currentStepIndex - 1].key);
                else navigate(-1);
              }}
              className="w-9 h-9 rounded-xl bg-[#F9F9FB] flex items-center justify-center hover:bg-[#F0EEEA] transition-colors"
            >
              <ChevronLeft size={18} className="text-[#1A1A1A]" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-[#1A1A1A]">Commande bouquet</h1>
              <div className="flex items-center gap-1 mt-1">
                {steps.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${i <= currentStepIndex ? 'bg-[#FF3008]' : 'bg-[#E8E8E8]'}`} />
                    {i < steps.length - 1 && <div className={`w-4 h-0.5 ${i < currentStepIndex ? 'bg-[#FF3008]' : 'bg-[#E8E8E8]'}`} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 'cart' && renderCartStep()}
            {step === 'addons' && renderAddonsStep()}
            {step === 'delivery' && renderDeliveryStep()}
            {step === 'message' && renderMessageStep()}
            {step === 'payment' && renderPaymentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step !== 'payment' && (
          <div className="mt-6 flex gap-3">
            {currentStepIndex > 0 && (
              <button
                onClick={() => setStep(steps[currentStepIndex - 1].key)}
                className="h-12 px-6 rounded-2xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors"
              >
                Retour
              </button>
            )}
            <button
              onClick={() => currentStepIndex < steps.length - 1 && setStep(steps[currentStepIndex + 1].key)}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-2xl bg-[#FF3008] text-white text-sm font-semibold hover:bg-[#E62B07] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continuer <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// ─── Globe icon helper ───────────────────────────────────────────────
function Globe(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Smartphone icon (already imported) ──────────────────────────────
function Smartphone(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}
