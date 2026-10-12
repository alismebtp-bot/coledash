import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Globe, DollarSign, Truck, Bell, Shield, Palette,
  Save, Check, X, Plus, Trash2, Edit3, ChevronRight, Clock,
  MapPin, Percent, CreditCard, Smartphone, Mail, MessageSquare,
  Upload, Image as ImageIcon, AlertTriangle, Eye, EyeOff,
  RefreshCw, Database, Server, Zap, Lock, UserCog, Languages,
  Moon, Sun, Monitor, Layout, Type, Hash, FileText, HelpCircle,
  ExternalLink, Copy, CheckCircle2, XCircle, ArrowUpDown
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface SettingSection { id: string; label: string; icon: any; description: string; }

// ─── Setting Sections ────────────────────────────────────────────────
const sections: SettingSection[] = [
  { id: 'general', label: 'Général', icon: Settings, description: 'Nom, logo, langue, fuseau horaire' },
  { id: 'appearance', label: 'Apparence', icon: Palette, description: 'Couleurs, thème, logo' },
  { id: 'pricing', label: 'Tarification', icon: DollarSign, description: 'Commissions, frais, devise' },
  { id: 'delivery', label: 'Livraison', icon: Truck, description: 'Zones, délais, livreurs' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, push, SMS' },
  { id: 'security', label: 'Sécurité', icon: Shield, description: '2FA, sessions, API keys' },
  { id: 'integrations', label: 'Intégrations', icon: Zap, description: 'Paiement, cartes, analytics' },
  { id: 'database', label: 'Base de données', icon: Database, description: 'Sauvegardes, export' },
];

// ─── Mock Data ───────────────────────────────────────────────────────
const deliveryZones = [
  { id: 'z1', name: 'Paris Centre', cities: ['75001', '75002', '75003', '75004'], fee: 2.99, minOrder: 15, time: '25-35 min', active: true },
  { id: 'z2', name: 'Paris Nord', cities: ['75009', '75010', '75017', '75018'], fee: 3.99, minOrder: 20, time: '30-40 min', active: true },
  { id: 'z3', name: 'Paris Sud', cities: ['75013', '75014', '75015'], fee: 3.49, minOrder: 18, time: '30-45 min', active: true },
  { id: 'z4', name: 'Banlieue Ouest', cities: ['92100', '92200', '92300'], fee: 4.99, minOrder: 25, time: '40-55 min', active: false },
];

const notificationTemplates = [
  { id: 't1', name: 'Confirmation commande', channel: 'email', subject: 'Votre commande est confirmée !', active: true },
  { id: 't2', name: 'Commande en préparation', channel: 'push', subject: 'Votre commande est en préparation', active: true },
  { id: 't3', name: 'Livreur en route', channel: 'push', subject: 'Votre livreur est en route !', active: true },
  { id: 't4', name: 'Commande livrée', channel: 'email', subject: 'Bon appétit ! Votre commande est livrée', active: true },
  { id: 't5', name: 'Promo hebdomadaire', channel: 'email', subject: 'Nos offres de la semaine', active: false },
];

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Informations générales</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Nom de l'application</label>
                  <input type="text" defaultValue="ColeDash" className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Description</label>
                  <textarea defaultValue="Livraison de repas, bouquets et plus encore" rows={3} className="w-full px-3 py-2 rounded-xl border border-[#E8E8E8] text-sm resize-none focus:outline-none focus:border-[#FF3008]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Langue par défaut</label>
                    <select defaultValue="fr" className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Fuseau horaire</label>
                    <select defaultValue="Europe/Paris" className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]">
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Contact support</label>
                  <input type="email" defaultValue="support@coledash.fr" className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Logo & Favicon</h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-[#FF3008] flex items-center justify-center text-white text-2xl font-bold">
                  C
                </div>
                <div>
                  <button className="h-9 px-4 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2">
                    <Upload size={14} /> Changer le logo
                  </button>
                  <p className="text-xs text-[#A6A6A6] mt-1">PNG, JPG ou SVG. Max 2MB.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Thème</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'light', label: 'Clair', icon: Sun },
                  { key: 'dark', label: 'Sombre', icon: Moon },
                  { key: 'auto', label: 'Auto', icon: Monitor },
                ].map((theme) => (
                  <button key={theme.key} className="p-4 rounded-xl border-2 border-[#F0EEEA] hover:border-[#FF3008] transition-colors text-center">
                    <theme.icon size={24} className="text-[#FF3008] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#1A1A1A]">{theme.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Couleurs de marque</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Couleur principale</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#FF3008" className="w-10 h-10 rounded-xl border border-[#E8E8E8] cursor-pointer" />
                    <input type="text" defaultValue="#FF3008" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Couleur secondaire</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#00C853" className="w-10 h-10 rounded-xl border border-[#E8E8E8] cursor-pointer" />
                    <input type="text" defaultValue="#00C853" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Couleur d'accent</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#FFB300" className="w-10 h-10 rounded-xl border border-[#E8E8E8] cursor-pointer" />
                    <input type="text" defaultValue="#FFB300" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Couleur de fond</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#FDF8F3" className="w-10 h-10 rounded-xl border border-[#E8E8E8] cursor-pointer" />
                    <input type="text" defaultValue="#FDF8F3" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Tarification</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Commission par défaut (%)</label>
                    <input type="number" defaultValue={15} min={0} max={100} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Devise</label>
                    <select defaultValue="EUR" className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]">
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Frais de livraison par défaut</label>
                    <input type="number" defaultValue={2.99} step={0.01} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Commande minimum par défaut</label>
                    <input type="number" defaultValue={15} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[#E8E8E8] text-[#FF3008] focus:ring-[#FF3008]" />
                    <span className="text-sm text-[#6B6B6B]">Autoriser les livraisons gratuites au-dessus d'un certain montant</span>
                  </label>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Seuil livraison gratuite</label>
                  <input type="number" defaultValue={25} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">ColePass</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Prix mensuel</label>
                    <input type="number" defaultValue={9.99} step={0.01} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Prix annuel</label>
                    <input type="number" defaultValue={99.99} step={0.01} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Réduction ColePass (%)</label>
                  <input type="number" defaultValue={15} min={0} max={100} className="w-full h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm focus:outline-none focus:border-[#FF3008]" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'delivery':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#1A1A1A]">Zones de livraison</h3>
                <button className="h-9 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2">
                  <Plus size={14} /> Ajouter une zone
                </button>
              </div>
              <div className="space-y-3">
                {deliveryZones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFF0ED] flex items-center justify-center">
                        <MapPin size={18} className="text-[#FF3008]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{zone.name}</p>
                        <p className="text-xs text-[#A6A6A6]">CP: {zone.cities.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="text-[#1A1A1A] font-medium">{zone.fee === 0 ? 'Gratuit' : `€${zone.fee}`}</p>
                        <p className="text-[10px] text-[#A6A6A6]">Frais</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#1A1A1A] font-medium">€{zone.minOrder}</p>
                        <p className="text-[10px] text-[#A6A6A6]">Min.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#1A1A1A] font-medium">{zone.time}</p>
                        <p className="text-[10px] text-[#A6A6A6]">Délai</p>
                      </div>
                      <button className={`w-11 h-6 rounded-full transition-colors ${zone.active ? 'bg-[#00C853]' : 'bg-[#E8E8E8]'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${zone.active ? 'translate-x-[22px]' : 'translate-x-0.5'}`} style={{ marginTop: '2px' }} />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                        <Edit3 size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-[#FFF0ED] flex items-center justify-center text-[#A6A6A6] hover:text-[#FF3008]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Modèles de notification</h3>
              <div className="space-y-2">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        template.channel === 'email' ? 'bg-[#FFF0ED] text-[#FF3008]' :
                        template.channel === 'push' ? 'bg-[#E8F5E9] text-[#00C853]' :
                        'bg-[#FFF8E1] text-[#FFB300]'
                      }`}>
                        {template.channel === 'email' && <Mail size={16} />}
                        {template.channel === 'push' && <Smartphone size={16} />}
                        {template.channel === 'sms' && <MessageSquare size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{template.name}</p>
                        <p className="text-xs text-[#A6A6A6]">{template.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className={`w-11 h-6 rounded-full transition-colors ${template.active ? 'bg-[#00C853]' : 'bg-[#E8E8E8]'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${template.active ? 'translate-x-[22px]' : 'translate-x-0.5'}`} style={{ marginTop: '2px' }} />
                      </button>
                      <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                        <Edit3 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">API Keys</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Clé publique</label>
                  <div className="flex items-center gap-2">
                    <input type={showApiKey ? 'text' : 'password'} defaultValue="pk_live_51H7xYKL8J2a4f3d9e0c1b2a3" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" readOnly />
                    <button onClick={() => setShowApiKey(!showApiKey)} className="w-10 h-10 rounded-xl border border-[#E8E8E8] flex items-center justify-center text-[#A6A6A6]">
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-[#E8E8E8] flex items-center justify-center text-[#A6A6A6]">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] block mb-1.5">Clé secrète</label>
                  <div className="flex items-center gap-2">
                    <input type="password" defaultValue="sk_live_****************************************" className="flex-1 h-10 px-3 rounded-xl border border-[#E8E8E8] text-sm font-mono focus:outline-none focus:border-[#FF3008]" readOnly />
                    <button className="w-10 h-10 rounded-xl border border-[#E8E8E8] flex items-center justify-center text-[#A6A6A6]">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Authentification à deux facteurs</h3>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9FB]">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">2FA obligatoire pour les admins</p>
                  <p className="text-xs text-[#A6A6A6]">Tous les administrateurs doivent activer la 2FA</p>
                </div>
                <button className="w-11 h-6 rounded-full bg-[#00C853]">
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-[22px]" style={{ marginTop: '2px' }} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Paiement</h3>
              <div className="space-y-3">
                {[
                  { name: 'Stripe', icon: CreditCard, connected: true, desc: 'Paiements par carte' },
                  { name: 'PayPal', icon: Globe, connected: true, desc: 'Paiements PayPal' },
                  { name: 'Apple Pay', icon: Smartphone, connected: false, desc: 'Paiements Apple' },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#E8E8E8] flex items-center justify-center">
                        <integration.icon size={18} className="text-[#1A1A1A]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{integration.name}</p>
                        <p className="text-xs text-[#A6A6A6]">{integration.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <span className="px-2 py-1 rounded-lg bg-[#E8F5E9] text-[#00C853] text-xs font-medium">Connecté</span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-[#F0EEEA] text-[#A6A6A6] text-xs font-medium">Non connecté</span>
                      )}
                      <button className="h-8 px-3 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-white transition-colors">
                        {integration.connected ? 'Configurer' : 'Connecter'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Analytics</h3>
              <div className="space-y-3">
                {[
                  { name: 'Google Analytics', connected: true, desc: 'Suivi du trafic' },
                  { name: 'Mixpanel', connected: false, desc: 'Analytics produit' },
                ].map((integration) => (
                  <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{integration.name}</p>
                      <p className="text-xs text-[#A6A6A6]">{integration.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <span className="px-2 py-1 rounded-lg bg-[#E8F5E9] text-[#00C853] text-xs font-medium">Connecté</span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg bg-[#F0EEEA] text-[#A6A6A6] text-xs font-medium">Non connecté</span>
                      )}
                      <button className="h-8 px-3 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-white transition-colors">
                        {integration.connected ? 'Configurer' : 'Connecter'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Sauvegardes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF0ED] flex items-center justify-center">
                      <Database size={18} className="text-[#FF3008]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">Sauvegarde automatique</p>
                      <p className="text-xs text-[#A6A6A6]">Tous les jours à 3h du matin</p>
                    </div>
                  </div>
                  <button className="w-11 h-6 rounded-full bg-[#00C853]">
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-[22px]" style={{ marginTop: '2px' }} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F9F9FB]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E3F2FD] flex items-center justify-center">
                      <Server size={18} className="text-[#2962FF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">Rétention</p>
                      <p className="text-xs text-[#A6A6A6]">Conserver les 30 derniers jours</p>
                    </div>
                  </div>
                  <select defaultValue="30" className="h-9 px-3 rounded-lg border border-[#E8E8E8] bg-white text-sm">
                    <option value="7">7 jours</option>
                    <option value="30">30 jours</option>
                    <option value="90">90 jours</option>
                    <option value="365">1 an</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2">
                  <Database size={16} /> Sauvegarder maintenant
                </button>
                <button className="h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2">
                  <Download size={16} /> Exporter les données
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Paramètres</h1>
        <p className="text-sm text-[#A6A6A6]">Configurez votre application</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#F0EEEA] p-2 space-y-1 sticky top-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeSection === section.id ? 'bg-[#FFF0ED] text-[#FF3008]' : 'text-[#6B6B6B] hover:bg-[#F9F9FB]'
                }`}
              >
                <section.icon size={18} />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{section.label}</p>
                  <p className={`text-[10px] truncate ${activeSection === section.id ? 'text-[#FF3008]/70' : 'text-[#A6A6A6]'}`}>{section.description}</p>
                </div>
                <ChevronRight size={14} className={`transition-transform ${activeSection === section.id ? 'rotate-90 text-[#FF3008]' : 'text-[#A6A6A6]'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              className="h-11 px-6 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2"
            >
              {saved ? <><Check size={16} /> Enregistré</> : <><Save size={16} /> Enregistrer</>}
            </button>
            <button className="h-11 px-6 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
