import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MapPin, CreditCard, Bell, Shield, Gift, Star,
  ChevronRight, Plus, Trash2, Edit3, Check, X, Camera,
  LogOut, Wallet, Ticket, Heart, Clock, Settings, Smartphone,
  Mail, Lock, Eye, EyeOff, Crown, Leaf, Bike, Store,
  Navigation, AlertTriangle, HelpCircle, Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import SafeImage from '@/components/SafeImage';
import AccountSidebar from '@/components/AccountSidebar';
import BottomNav from '@/components/BottomNav';
import { useToast } from '@/components/Toast';
import OrderHistory from '@/components/OrderHistory';

// ─── Types ───────────────────────────────────────────────────────────
interface Address { id: string; label: string; street: string; city: string; postalCode: string; isDefault: boolean; }
interface PaymentMethod { id: string; type: 'card' | 'paypal' | 'apple_pay'; last4: string; brand: string; expiry: string; isDefault: boolean; }
interface PromoCode { id: string; code: string; description: string; discount: string; expiry: string; used: boolean; }
interface NotificationPref { id: string; label: string; description: string; push: boolean; email: boolean; sms: boolean; }
interface FavoriteItem { id: string; name: string; restaurant: string; price: number; image: string; rating: number; }

// ─── Mock Data ───────────────────────────────────────────────────────
const initialAddresses: Address[] = [
  { id: '1', label: 'Maison', street: '15 Rue de Rivoli', city: 'Paris', postalCode: '75001', isDefault: true },
  { id: '2', label: 'Bureau', street: '42 Avenue des Champs-Élysées', city: 'Paris', postalCode: '75008', isDefault: false },
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiry: '12/26', isDefault: true },
  { id: '2', type: 'card', last4: '8888', brand: 'Mastercard', expiry: '08/25', isDefault: false },
];

const initialPromoCodes: PromoCode[] = [
  { id: '1', code: 'WELCOME20', description: '20% de réduction sur votre prochaine commande', discount: '-20%', expiry: '2025-03-31', used: false },
  { id: '2', code: 'LIVRAISON', description: 'Livraison offerte', discount: 'Livraison offerte', expiry: '2025-02-28', used: false },
  { id: '3', code: 'COLEPASS10', description: '-10€ sur votre abonnement ColePass', discount: '-10€', expiry: '2025-01-31', used: true },
];

const initialNotifications: NotificationPref[] = [
  { id: '1', label: 'Commandes', description: 'Mises à jour de vos commandes en temps réel', push: true, email: true, sms: false },
  { id: '2', label: 'Promotions', description: 'Offres exclusives et codes promo', push: true, email: false, sms: false },
  { id: '3', label: 'Restaurants favoris', description: 'Nouveautés de vos restaurants préférés', push: false, email: true, sms: false },
  { id: '4', label: 'ColePass', description: 'Avantages et renouvellement', push: true, email: true, sms: false },
  { id: '5', label: 'Support', description: 'Réponses à vos tickets', push: true, email: true, sms: true },
];

const initialFavorites: FavoriteItem[] = [
  { id: '1', name: 'Menu Sushi Deluxe', restaurant: 'Sushi Master', price: 24.90, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop', rating: 4.7 },
  { id: '2', name: 'Burger Signature', restaurant: 'Burger House', price: 18.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop', rating: 4.5 },
  { id: '3', name: 'Pizza Margherita', restaurant: 'Pizza Roma', price: 14.90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop', rating: 4.6 },
];

// ─── Brand Colors ────────────────────────────────────────────────────
const colors = {
  primary: '#FF3008',
  primaryHover: '#E62B07',
  primaryLight: '#FFF0ED',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#A6A6A6',
  border: '#E8E8E8',
  borderLight: '#F0EEEA',
  bgWarm: '#F9F9FB',
  bgCream: '#FDF8F3',
  success: '#00C853',
  warning: '#FFB300',
  error: '#FF3008',
  info: '#2962FF',
};

// ─── Helper Components ───────────────────────────────────────────────
function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon: any }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-lg bg-[#FFF0ED] flex items-center justify-center">
          <Icon size={18} className="text-[#FF3008]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{title}</h2>
          {subtitle && <p className="text-xs text-[#A6A6A6]">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#F0EEEA] shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-14 h-14 rounded-full bg-[#F9F9FB] flex items-center justify-center mb-3">
        <Icon size={24} className="text-[#A6A6A6]" />
      </div>
      <p className="text-sm text-[#A6A6A6]">{message}</p>
    </div>
  );
}

// ─── Address Form ────────────────────────────────────────────────────
function AddressForm({ address, onSave, onCancel }: { address?: Address; onSave: (a: Address) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    label: address?.label || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    isDefault: address?.isDefault || false,
  });

  return (
    <div className="p-5 space-y-4">
      <div>
        <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Nom de l'adresse</label>
        <input
          type="text"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Maison, Bureau..."
          className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Adresse</label>
        <input
          type="text"
          value={form.street}
          onChange={(e) => setForm({ ...form, street: e.target.value })}
          placeholder="Numéro et rue"
          className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Code postal</label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            placeholder="75001"
            className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Ville</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Paris"
            className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
          className="rounded border-[#E8E8E8] text-[#FF3008] focus:ring-[#FF3008]"
        />
        <span className="text-xs text-[#6B6B6B]">Définir comme adresse par défaut</span>
      </label>
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => onSave({ ...form, id: address?.id || Date.now().toString() })}
          className="flex-1 h-10 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ─── Add Card Form ───────────────────────────────────────────────────
function AddCardForm({ onSave, onCancel }: { onSave: (card: PaymentMethod) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ number: '', expiry: '', cvc: '', holder: '' });

  return (
    <div className="p-5 space-y-4">
      <div>
        <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Numéro de carte</label>
        <div className="relative">
          <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
          <input
            type="text"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
            placeholder="4242 4242 4242 4242"
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008] transition-colors"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Date d'expiration</label>
          <input
            type="text"
            value={form.expiry}
            onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            placeholder="MM/AA"
            className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">CVC</label>
          <input
            type="text"
            value={form.cvc}
            onChange={(e) => setForm({ ...form, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
            placeholder="123"
            className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008] transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Titulaire</label>
        <input
          type="text"
          value={form.holder}
          onChange={(e) => setForm({ ...form, holder: e.target.value })}
          placeholder="NOM PRÉNOM"
          className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="flex-1 h-10 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">
          Annuler
        </button>
        <button
          onClick={() => onSave({
            id: Date.now().toString(),
            type: 'card',
            last4: form.number.slice(-4) || '0000',
            brand: form.number.startsWith('4') ? 'Visa' : 'Mastercard',
            expiry: form.expiry,
            isDefault: false,
          })}
          className="flex-1 h-10 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}

// ─── Security Settings ───────────────────────────────────────────────
function SecuritySettings({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-[#1A1A1A] flex items-center gap-2">
          <Shield size={18} className="text-[#FF3008]" /> Sécurité
        </h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F9F9FB] flex items-center justify-center">
          <X size={18} className="text-[#A6A6A6]" />
        </button>
      </div>

      {/* Change Password */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#1A1A1A]">Changer le mot de passe</h4>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mot de passe actuel"
            className="w-full h-10 pl-9 pr-10 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
          />
          <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmer le nouveau mot de passe"
          className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008] transition-colors"
        />
        {newPassword && newPassword.length < 8 && (
          <p className="text-xs text-[#FF3008] flex items-center gap-1">
            <AlertTriangle size={12} /> Minimum 8 caractères
          </p>
        )}
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9FB]">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A] flex items-center gap-2">
            <Smartphone size={16} className="text-[#2962FF]" /> Authentification à deux facteurs
          </p>
          <p className="text-xs text-[#A6A6A6] mt-0.5">Sécurisez votre compte avec un code SMS</p>
        </div>
        <button
          onClick={() => setTwoFAEnabled(!twoFAEnabled)}
          className={`w-11 h-6 rounded-full transition-colors ${twoFAEnabled ? 'bg-[#00C853]' : 'bg-[#E8E8E8]'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${twoFAEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} style={{ marginTop: '2px' }} />
        </button>
      </div>

      {/* Active Sessions */}
      <div>
        <h4 className="text-sm font-medium text-[#1A1A1A] mb-2">Sessions actives</h4>
        <div className="space-y-2">
          {[
            { device: 'iPhone 15 Pro', location: 'Paris, France', current: true },
            { device: 'Chrome - macOS', location: 'Lyon, France', current: false },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9FB]">
              <div>
                <p className="text-xs font-medium text-[#1A1A1A]">{session.device} {session.current && <span className="text-[10px] text-[#00C853]">(Actuel)</span>}</p>
                <p className="text-[10px] text-[#A6A6A6]">{session.location}</p>
              </div>
              {!session.current && (
                <button className="text-xs text-[#FF3008] font-medium hover:underline">Déconnecter</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full h-11 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center justify-center gap-2"
      >
        {saved ? <><Check size={16} /> Enregistré</> : 'Enregistrer les modifications'}
      </button>
    </div>
  );
}

// ─── ColePass Card ───────────────────────────────────────────────────
function ColePassCard() {
  return (
    <Card className="bg-gradient-to-br from-[#FF3008] to-[#FF6B35] text-white border-0">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown size={20} />
              <span className="text-lg font-bold">ColePass</span>
            </div>
            <p className="text-xs text-white/80">Abonnement actif · Renouvellement le 15/02/2025</p>
          </div>
          <span className="px-2 py-1 rounded-lg bg-white/20 text-xs font-medium">Premium</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Livraisons offertes', value: '∞' },
            { label: 'Réduction', value: '-15%' },
            { label: 'Commandes', value: '24' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 h-9 rounded-lg bg-white text-[#FF3008] text-xs font-medium hover:bg-white/90 transition-colors">
            Gérer l'abonnement
          </button>
          <button className="h-9 px-4 rounded-lg border border-white/30 text-white text-xs font-medium hover:bg-white/10 transition-colors">
            Partager
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── Main Account Page ───────────────────────────────────────────────
export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Data states
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initialPromoCodes);
  const [notifications, setNotifications] = useState<NotificationPref[]>(initialNotifications);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>();
  const [showSecurity, setShowSecurity] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (user?.id) {
      supabase.storage.from('avatars').getPublicUrl(`${user.id}.jpg`).then(({ data }) => {
        if (data?.publicUrl) setAvatarUrl(data.publicUrl);
      });
    }
  }, [user?.id]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const { error } = await supabase.storage.from('avatars').upload(`${user.id}.jpg`, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(`${user.id}.jpg`);
      setAvatarUrl(data.publicUrl + '?t=' + Date.now());
      toast?.show?.('Photo de profil mise à jour');
    }
  };

  const handleSaveAddress = (addr: Address) => {
    if (editingAddress) {
      setAddresses((prev) => prev.map((a) => (a.id === addr.id ? addr : a)));
    } else {
      if (addr.isDefault) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
      setAddresses((prev) => [...prev, addr]);
    }
    setShowAddAddress(false);
    setEditingAddress(undefined);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveCard = (card: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, card]);
    setShowAddCard(false);
  };

  const handleDeleteCard = (id: string) => {
    setPaymentMethods((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleSetDefaultCard = (id: string) => {
    setPaymentMethods((prev) => prev.map((c) => ({ ...c, isDefault: c.id === id })));
  };

  const handleToggleNotification = (id: string, channel: 'push' | 'email' | 'sms') => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n)));
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleCopyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    toast?.show?.('Code copié !');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // ─── Sidebar navigation items ─────────────────────────────────────
  const navItems = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: User },
    { key: 'orders', label: 'Commandes', icon: Clock },
    { key: 'addresses', label: 'Adresses', icon: MapPin },
    { key: 'payment', label: 'Paiement', icon: CreditCard },
    { key: 'favorites', label: 'Favoris', icon: Heart },
    { key: 'promo', label: 'Codes promo', icon: Ticket },
    { key: 'colepass', label: 'ColePass', icon: Crown },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'security', label: 'Sécurité', icon: Shield },
  ];

  // ─── Render Section Content ───────────────────────────────────────
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-5">
            {/* Profile Header */}
            <Card>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <SafeImage
                      src={avatarUrl}
                      alt={user?.user_metadata?.name || 'Profil'}
                      containerClassName="w-16 h-16 rounded-full"
                      placeholderSize={32}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FF3008] text-white flex items-center justify-center shadow-md hover:bg-[#E62B07] transition-colors"
                    >
                      <Camera size={12} />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{user?.user_metadata?.name || 'Utilisateur'}</h3>
                    <p className="text-xs text-[#A6A6A6]">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF0ED] text-[#FF3008] text-[10px] font-medium">
                        <Star size={8} fill="#FF3008" /> 4.8
                      </span>
                      <span className="text-[10px] text-[#A6A6A6]">· Membre depuis janvier 2024</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Commandes', value: '24', icon: Clock },
                    { label: 'Favoris', value: favorites.length.toString(), icon: Heart },
                    { label: 'Codes', value: promoCodes.filter((p) => !p.used).length.toString(), icon: Ticket },
                    { label: 'Points', value: '1,240', icon: Gift },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-[#F9F9FB]">
                      <stat.icon size={16} className="text-[#FF3008] mx-auto mb-1" />
                      <p className="text-base font-bold text-[#1A1A1A]">{stat.value}</p>
                      <p className="text-[10px] text-[#A6A6A6]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Orders Preview */}
            <Card>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1A1A1A]">Commandes récentes</h3>
                  <button onClick={() => setActiveSection('orders')} className="text-xs text-[#FF3008] font-medium hover:underline flex items-center gap-1">
                    Voir tout <ChevronRight size={14} />
                  </button>
                </div>
                <OrderHistory limit={3} compact />
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Ajouter une adresse', icon: Plus, action: () => { setEditingAddress(undefined); setShowAddAddress(true); } },
                { label: 'Ajouter une carte', icon: CreditCard, action: () => setShowAddCard(true) },
                { label: 'Parrainer un ami', icon: Gift, action: () => toast?.show?.('Lien de parrainage copié !') },
                { label: 'Aide & Support', icon: HelpCircle, action: () => navigate('/support') },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#F0EEEA] shadow-sm hover:border-[#FF3008]/30 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                    <action.icon size={18} className="text-[#FF3008]" />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A1A]">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-5">
            <SectionHeader title="Historique des commandes" subtitle="Retrouvez toutes vos commandes passées" icon={Clock} />
            <Card>
              <OrderHistory />
            </Card>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <SectionHeader title="Mes adresses" subtitle="Gérez vos adresses de livraison" icon={MapPin} />
              <button
                onClick={() => { setEditingAddress(undefined); setShowAddAddress(true); }}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            <AnimatePresence>
              {showAddAddress && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Card>
                    <AddressForm
                      address={editingAddress}
                      onSave={handleSaveAddress}
                      onCancel={() => { setShowAddAddress(false); setEditingAddress(undefined); }}
                    />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <Card key={addr.id}>
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-[#FF3008]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-[#1A1A1A]">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#00C853] text-[10px] font-medium">Par défaut</span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B6B6B]">{addr.street}</p>
                        <p className="text-xs text-[#A6A6A6]">{addr.postalCode} {addr.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="w-8 h-8 rounded-lg hover:bg-[#F9F9FB] flex items-center justify-center text-[#A6A6A6]"
                          title="Définir par défaut"
                        >
                          <Navigation size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => { setEditingAddress(addr); setShowAddAddress(true); }}
                        className="w-8 h-8 rounded-lg hover:bg-[#F9F9FB] flex items-center justify-center text-[#A6A6A6]"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="w-8 h-8 rounded-lg hover:bg-[#FFF0ED] flex items-center justify-center text-[#A6A6A6] hover:text-[#FF3008]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <SectionHeader title="Moyens de paiement" subtitle="Gérez vos cartes et comptes" icon={CreditCard} />
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors"
              >
                <Plus size={14} /> Ajouter
              </button>
            </div>

            <AnimatePresence>
              {showAddCard && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <Card><AddCardForm onSave={handleSaveCard} onCancel={() => setShowAddCard(false)} /></Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {paymentMethods.map((card) => (
                <Card key={card.id}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-md bg-gradient-to-br from-[#1A1A1A] to-[#333] flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">{card.brand.toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1A1A1A]">•••• {card.last4}</span>
                          {card.isDefault && (
                            <span className="px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#00C853] text-[10px] font-medium">Par défaut</span>
                          )}
                        </div>
                        <p className="text-xs text-[#A6A6A6]">Expire {card.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!card.isDefault && (
                        <button
                          onClick={() => handleSetDefaultCard(card.id)}
                          className="text-xs text-[#FF3008] font-medium hover:underline"
                        >
                          Par défaut
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="w-8 h-8 rounded-lg hover:bg-[#FFF0ED] flex items-center justify-center text-[#A6A6A6] hover:text-[#FF3008]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ColeWallet */}
            <Card>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center">
                    <Wallet size={18} className="text-[#FF3008]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#1A1A1A]">ColeWallet</h3>
                    <p className="text-xs text-[#A6A6A6]">Portefeuille électronique</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-lg font-bold text-[#1A1A1A]">€12.50</p>
                    <p className="text-[10px] text-[#A6A6A6]">Solde disponible</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-9 rounded-xl bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors">
                    Recharger
                  </button>
                  <button className="flex-1 h-9 rounded-xl border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">
                    Historique
                  </button>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-5">
            <SectionHeader title="Mes favoris" subtitle="Vos plats et restaurants préférés" icon={Heart} />
            {favorites.length === 0 ? (
              <Card><EmptyState icon={Heart} message="Aucun favori pour le moment" /></Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {favorites.map((item) => (
                  <Card key={item.id} className="group cursor-pointer hover:border-[#FF3008]/30 transition-colors">
                    <div className="relative">
                      <SafeImage src={item.image} alt={item.name} className="w-full h-36 object-cover rounded-t-2xl" />
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#FF3008] hover:bg-white transition-colors shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#FF3008] transition-colors">{item.name}</h4>
                      <p className="text-xs text-[#A6A6A6]">{item.restaurant}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-[#1A1A1A]">€{item.price.toFixed(2)}</span>
                        <span className="inline-flex items-center gap-0.5 text-xs text-[#FFB300]">
                          <Star size={12} fill="#FFB300" /> {item.rating}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'promo':
        return (
          <div className="space-y-5">
            <SectionHeader title="Codes promo" subtitle="Vos réductions disponibles" icon={Ticket} />
            <div className="space-y-3">
              {promoCodes.map((promo) => (
                <Card key={promo.id} className={promo.used ? 'opacity-50' : ''}>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FFF0ED] flex items-center justify-center">
                        <Ticket size={20} className="text-[#FF3008]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1A1A1A]">{promo.code}</span>
                          {promo.used && (
                            <span className="px-1.5 py-0.5 rounded bg-[#F0EEEA] text-[#A6A6A6] text-[10px] font-medium">Utilisé</span>
                          )}
                        </div>
                        <p className="text-xs text-[#6B6B6B]">{promo.description}</p>
                        <p className="text-[10px] text-[#A6A6A6]">Expire le {new Date(promo.expiry).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-[#FF3008]">{promo.discount}</span>
                      {!promo.used && (
                        <button
                          onClick={() => handleCopyPromo(promo.code)}
                          className="block mt-1 text-xs text-[#FF3008] font-medium hover:underline"
                        >
                          Copier
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'colepass':
        return (
          <div className="space-y-5">
            <SectionHeader title="ColePass" subtitle="Votre abonnement premium" icon={Crown} />
            <ColePassCard />

            {/* Benefits */}
            <Card>
              <div className="p-5">
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Avantages inclus</h3>
                <div className="space-y-3">
                  {[
                    { icon: Bike, label: 'Livraison offerte', desc: 'Sur toutes vos commandes, sans minimum' },
                    { icon: Percent, label: '-15% de réduction', desc: 'Sur tous les restaurants partenaires' },
                    { icon: Star, label: 'Accès prioritaire', desc: 'Aux nouveaux restaurants et offres exclusives' },
                    { icon: Gift, label: 'Offres surprises', desc: 'Cadeaux et promotions réservées aux membres' },
                  ].map((benefit) => (
                    <div key={benefit.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                        <benefit.icon size={16} className="text-[#FF3008]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{benefit.label}</p>
                        <p className="text-xs text-[#A6A6A6]">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Usage History */}
            <Card>
              <div className="p-5">
                <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Historique d'utilisation</h3>
                <div className="space-y-2">
                  {[
                    { date: '15 janv. 2025', action: 'Commande - Sushi Master', saved: '€4.50' },
                    { date: '14 janv. 2025', action: 'Commande - Burger House', saved: '€3.20' },
                    { date: '12 janv. 2025', action: 'Commande - Pizza Roma', saved: '€5.80' },
                    { date: '10 janv. 2025', action: 'Commande - Le Petit Bistro', saved: '€6.20' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#F0EEEA] last:border-0">
                      <div>
                        <p className="text-xs font-medium text-[#1A1A1A]">{item.action}</p>
                        <p className="text-[10px] text-[#A6A6A6]">{item.date}</p>
                      </div>
                      <span className="text-xs font-medium text-[#00C853]">-{item.saved}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-[#E8F5E9] text-center">
                  <p className="text-sm font-medium text-[#00C853]">Total économisé ce mois : €28.70</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-5">
            <SectionHeader title="Notifications" subtitle="Personnalisez vos alertes" icon={Bell} />
            <Card>
              <div className="p-5">
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="pb-4 border-b border-[#F0EEEA] last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{notif.label}</p>
                          <p className="text-xs text-[#A6A6A6]">{notif.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {(['push', 'email', 'sms'] as const).map((channel) => (
                          <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notif[channel]}
                              onChange={() => handleToggleNotification(notif.id, channel)}
                              className="rounded border-[#E8E8E8] text-[#FF3008] focus:ring-[#FF3008]"
                            />
                            <span className="text-xs text-[#6B6B6B] capitalize">{channel === 'push' ? 'Push' : channel === 'email' ? 'Email' : 'SMS'}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-5">
            <SectionHeader title="Sécurité" subtitle="Protégez votre compte" icon={Shield} />
            <Card>
              <SecuritySettings onClose={() => setActiveSection('overview')} />
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Mobile Header ─────────────────────────────────────────────────
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#F0EEEA] sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <SafeImage
          src={avatarUrl}
          alt=""
          containerClassName="w-9 h-9 rounded-full"
          placeholderSize={18}
        />
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">{user?.user_metadata?.name || 'Mon compte'}</p>
          <p className="text-[10px] text-[#A6A6A6]">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="w-9 h-9 rounded-lg bg-[#F9F9FB] flex items-center justify-center"
      >
        <Settings size={18} className="text-[#6B6B6B]" />
      </button>
    </div>
  );

  // ─── Mobile Menu ───────────────────────────────────────────────────
  const MobileMenu = () => (
    <AnimatePresence>
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden fixed inset-x-0 top-[57px] bg-white border-b border-[#F0EEEA] shadow-lg z-30 max-h-[70vh] overflow-y-auto"
        >
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { setActiveSection(item.key); setShowMobileMenu(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.key ? 'bg-[#FFF0ED] text-[#FF3008]' : 'text-[#6B6B6B] hover:bg-[#F9F9FB]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#F0EEEA] mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#FF3008] hover:bg-[#FFF0ED] transition-colors"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <MobileHeader />
      <MobileMenu />

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-[260px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 py-5 lg:px-8 lg:py-8 pb-24 lg:pb-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

// ─── Percent icon helper ─────────────────────────────────────────────
function Percent(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
