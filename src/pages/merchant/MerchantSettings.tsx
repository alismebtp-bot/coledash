import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Store,
  User,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Palette,
  ChevronRight,
  Save,
  CheckCircle2,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  ImageIcon,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

interface RestaurantProfile {
  name: string;
  description: string;
  cuisine: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  website?: string;
  logo?: string;
  coverImage?: string;
}

interface DeliverySettings {
  radius: number;
  minOrder: number;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  estimatedTime: number;
  selfDelivery: boolean;
  ecoDelivery: boolean;
}

interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  reviews: boolean;
  promotions: boolean;
  payouts: boolean;
  emailDigest: boolean;
  pushEnabled: boolean;
}

/* ─────────────────────── mock data ─────────────────────── */

const initialProfile: RestaurantProfile = {
  name: 'Le Burger House',
  description: 'Burgers artisanaux, frites maison et milkshakes. 100% fait maison avec des produits locaux.',
  cuisine: 'Américaine',
  phone: '01 42 78 34 56',
  email: 'contact@burgerhouse.fr',
  address: '12 Rue de Belleville',
  city: 'Paris',
  zipCode: '75020',
  website: 'https://burgerhouse.fr',
};

const initialDelivery: DeliverySettings = {
  radius: 5,
  minOrder: 10,
  freeDeliveryThreshold: 25,
  deliveryFee: 2.5,
  estimatedTime: 25,
  selfDelivery: false,
  ecoDelivery: true,
};

const initialNotifications: NotificationSettings = {
  newOrders: true,
  orderUpdates: true,
  reviews: true,
  promotions: false,
  payouts: true,
  emailDigest: true,
  pushEnabled: true,
};

const cuisineTypes = ['Italienne', 'Asiatique', 'Américaine', 'Française', 'Mexicaine', 'Indienne', 'Japonaise', 'Libanaise', 'Végétarienne', 'Fast-Food'];

/* ─────────────────────── sub-components ─────────────────────── */

function SectionCard({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-cd-bg-warm transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cd-primary/10 flex items-center justify-center">
            <Icon size={18} className="text-cd-primary" />
          </div>
          <span className="text-base font-semibold text-mp-text">{title}</span>
        </div>
        <ChevronRight
          size={18}
          className={`text-cd-text-tertiary transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-cd-text-primary">{label}</p>
        {description && <p className="text-xs text-cd-text-tertiary">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-cd-primary' : 'bg-cd-border'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5"
        />
      </button>
    </div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantSettings() {
  const [openSection, setOpenSection] = useState<string | null>('profile');
  const [profile, setProfile] = useState<RestaurantProfile>(initialProfile);
  const [delivery, setDelivery] = useState<DeliverySettings>(initialDelivery);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[700px] mx-auto space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-mp-text">Paramètres</h1>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors flex items-center gap-2"
        >
          <Save size={16} />
          Enregistrer
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 px-4 py-3 bg-cd-success-light text-cd-success rounded-xl text-sm font-medium"
        >
          <CheckCircle2 size={16} />
          Modifications enregistrées avec succès !
        </motion.div>
      )}

      {/* Profile */}
      <SectionCard
        title="Profil restaurant"
        icon={Store}
        isOpen={openSection === 'profile'}
        onToggle={() => toggleSection('profile')}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-cd-bg-warm flex items-center justify-center border-2 border-dashed border-cd-border">
              <ImageIcon size={28} className="text-cd-text-tertiary" />
            </div>
            <div>
              <button className="px-4 py-2 bg-cd-primary text-white text-xs font-semibold rounded-lg hover:bg-cd-primary-hover transition-colors flex items-center gap-1.5">
                <Upload size={12} />
                Changer le logo
              </button>
              <p className="text-xs text-cd-text-tertiary mt-1.5">PNG ou JPG, max 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Nom du restaurant">
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
            <FormField label="Type de cuisine">
              <select
                value={profile.cuisine}
                onChange={(e) => setProfile({ ...profile, cuisine: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              >
                {cuisineTypes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Description">
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary resize-none"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Téléphone">
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
                />
              </div>
            </FormField>
            <FormField label="Email">
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
                />
              </div>
            </FormField>
          </div>
          <FormField label="Adresse">
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Ville">
              <input
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
            <FormField label="Code postal">
              <input
                value={profile.zipCode}
                onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
          </div>
          <FormField label="Site web">
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
          </FormField>
        </div>
      </SectionCard>

      {/* Delivery */}
      <SectionCard
        title="Livraison"
        icon={Truck}
        isOpen={openSection === 'delivery'}
        onToggle={() => toggleSection('delivery')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Rayon de livraison (km)">
              <input
                type="number"
                value={delivery.radius}
                onChange={(e) => setDelivery({ ...delivery, radius: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
            <FormField label="Temps estimé (min)">
              <input
                type="number"
                value={delivery.estimatedTime}
                onChange={(e) => setDelivery({ ...delivery, estimatedTime: parseInt(e.target.value) })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Commande minimum (€)">
              <input
                type="number"
                step={0.5}
                value={delivery.minOrder}
                onChange={(e) => setDelivery({ ...delivery, minOrder: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
            <FormField label="Frais de livraison (€)">
              <input
                type="number"
                step={0.5}
                value={delivery.deliveryFee}
                onChange={(e) => setDelivery({ ...delivery, deliveryFee: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </FormField>
          </div>
          <FormField label="Livraison gratuite à partir de (€)">
            <input
              type="number"
              step={0.5}
              value={delivery.freeDeliveryThreshold}
              onChange={(e) => setDelivery({ ...delivery, freeDeliveryThreshold: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </FormField>
          <Toggle
            label="Auto-livraison"
            description="Gérez vous-même vos livreurs"
            checked={delivery.selfDelivery}
            onChange={(v) => setDelivery({ ...delivery, selfDelivery: v })}
          />
          <Toggle
            label="Livraison écologique"
            description="Proposer des options de livraison vertes"
            checked={delivery.ecoDelivery}
            onChange={(v) => setDelivery({ ...delivery, ecoDelivery: v })}
          />
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        title="Notifications"
        icon={Bell}
        isOpen={openSection === 'notifications'}
        onToggle={() => toggleSection('notifications')}
      >
        <div className="space-y-1">
          <Toggle
            label="Nouvelles commandes"
            description="Recevoir une alerte pour chaque nouvelle commande"
            checked={notifications.newOrders}
            onChange={(v) => setNotifications({ ...notifications, newOrders: v })}
          />
          <Toggle
            label="Mises à jour des commandes"
            description="Notifications de changement de statut"
            checked={notifications.orderUpdates}
            onChange={(v) => setNotifications({ ...notifications, orderUpdates: v })}
          />
          <Toggle
            label="Nouveaux avis"
            description="Être alerté lors d'un nouvel avis client"
            checked={notifications.reviews}
            onChange={(v) => setNotifications({ ...notifications, reviews: v })}
          />
          <Toggle
            label="Promotions"
            description="Conseils et opportunités de promotion"
            checked={notifications.promotions}
            onChange={(v) => setNotifications({ ...notifications, promotions: v })}
          />
          <Toggle
            label="Paiements"
            description="Confirmation des virements"
            checked={notifications.payouts}
            onChange={(v) => setNotifications({ ...notifications, payouts: v })}
          />
          <Toggle
            label="Résumé email quotidien"
            description="Recevoir un récapitulatif chaque soir"
            checked={notifications.emailDigest}
            onChange={(v) => setNotifications({ ...notifications, emailDigest: v })}
          />
          <Toggle
            label="Notifications push"
            description="Activer les notifications du navigateur"
            checked={notifications.pushEnabled}
            onChange={(v) => setNotifications({ ...notifications, pushEnabled: v })}
          />
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard
        title="Sécurité"
        icon={Shield}
        isOpen={openSection === 'security'}
        onToggle={() => toggleSection('security')}
      >
        <div className="space-y-4">
          <FormField label="Mot de passe actuel">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </FormField>
          <FormField label="Nouveau mot de passe">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </FormField>
          <FormField label="Confirmation">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </FormField>
          <div className="flex items-center gap-2 p-3 bg-cd-warning-light rounded-lg">
            <AlertTriangle size={14} className="text-cd-warning shrink-0" />
            <p className="text-xs text-cd-text-primary">Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.</p>
          </div>
        </div>
      </SectionCard>

      {/* Payment */}
      <SectionCard
        title="Paiement"
        icon={CreditCard}
        isOpen={openSection === 'payment'}
        onToggle={() => toggleSection('payment')}
      >
        <div className="space-y-4">
          <div className="p-4 bg-cd-bg-warm rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cd-primary/10 flex items-center justify-center">
                  <CreditCard size={18} className="text-cd-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-cd-text-primary">Virement bancaire</p>
                  <p className="text-xs text-cd-text-tertiary">IBAN: FR76 **** **** **** 1234 56</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-cd-success-light text-cd-success text-[10px] font-bold rounded-full">ACTIF</span>
            </div>
          </div>
          <button className="w-full py-2.5 border border-cd-border text-cd-text-secondary text-sm font-medium rounded-lg hover:bg-cd-bg-warm transition-colors">
            + Ajouter un compte bancaire
          </button>
        </div>
      </SectionCard>
    </motion.div>
  );
}
