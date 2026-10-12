import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  Plus,
  Calendar,
  Percent,
  Users,
  TrendingUp,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
  XCircle,
  Gift,
  Sparkles,
  ChevronDown,
  Copy,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type PromoType = 'percentage' | 'fixed' | 'free_delivery' | 'bogo';
type PromoStatus = 'active' | 'scheduled' | 'expired' | 'paused';
type PromoTarget = 'all' | 'new_customers' | 'loyal' | 'referral';

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: PromoType;
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  status: PromoStatus;
  target: PromoTarget;
  usageCount: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  description: string;
}

/* ─────────────────────── mock data ─────────────────────── */

const initialPromotions: Promotion[] = [
  {
    id: 'promo-001',
    name: 'Bienvenue',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrder: 15,
    maxDiscount: 10,
    status: 'active',
    target: 'new_customers',
    usageCount: 45,
    usageLimit: 100,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    description: '-20% sur la première commande pour les nouveaux clients',
  },
  {
    id: 'promo-002',
    name: 'Livraison Gratuite',
    code: 'FREESHIP',
    type: 'free_delivery',
    value: 0,
    minOrder: 25,
    status: 'active',
    target: 'all',
    usageCount: 128,
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    description: 'Livraison offerte dès 25€ d\'achat',
  },
  {
    id: 'promo-003',
    name: 'Fidélité -10€',
    code: 'LOYAL10',
    type: 'fixed',
    value: 10,
    minOrder: 30,
    status: 'active',
    target: 'loyal',
    usageCount: 23,
    usageLimit: 50,
    startDate: '2025-01-01',
    endDate: '2025-06-30',
    description: '-10€ pour nos clients fidèles (5+ commandes)',
  },
  {
    id: 'promo-004',
    name: 'Parrainage',
    code: 'PARRAIN',
    type: 'percentage',
    value: 15,
    minOrder: 20,
    maxDiscount: 15,
    status: 'scheduled',
    target: 'referral',
    usageCount: 0,
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    description: '15% de réduction pour le filleul et le parrain',
  },
  {
    id: 'promo-005',
    name: 'Happy Hour',
    code: 'HAPPY15',
    type: 'percentage',
    value: 15,
    minOrder: 0,
    maxDiscount: 8,
    status: 'expired',
    target: 'all',
    usageCount: 89,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    description: '-15% entre 14h et 17h',
  },
];

const typeMeta: Record<PromoType, { label: string; icon: React.ElementType; color: string }> = {
  percentage: { label: '%', icon: Percent, color: 'text-cd-primary' },
  fixed: { label: '€', icon: Tag, color: 'text-cd-success' },
  free_delivery: { label: 'Livraison', icon: Gift, color: 'text-cd-info' },
  bogo: { label: '1+1', icon: Gift, color: 'text-cd-warning' },
};

const statusMeta: Record<PromoStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-cd-success', bg: 'bg-cd-success-light' },
  scheduled: { label: 'Planifiée', color: 'text-cd-info', bg: 'bg-cd-info-light' },
  expired: { label: 'Expirée', color: 'text-cd-text-tertiary', bg: 'bg-cd-bg-warm' },
  paused: { label: 'En pause', color: 'text-cd-warning', bg: 'bg-cd-warning-light' },
};

const targetMeta: Record<PromoTarget, string> = {
  all: 'Tous',
  new_customers: 'Nouveaux clients',
  loyal: 'Clients fidèles',
  referral: 'Parrainage',
};

/* ─────────────────────── sub-components ─────────────────────── */

function PromoModal({
  promo,
  onSave,
  onClose,
}: {
  promo?: Promotion;
  onSave: (data: Partial<Promotion>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Promotion>>({
    name: promo?.name || '',
    code: promo?.code || '',
    type: promo?.type || 'percentage',
    value: promo?.value || 0,
    minOrder: promo?.minOrder || 0,
    maxDiscount: promo?.maxDiscount || undefined,
    target: promo?.target || 'all',
    usageLimit: promo?.usageLimit || undefined,
    startDate: promo?.startDate || '',
    endDate: promo?.endDate || '',
    description: promo?.description || '',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-cd-overlay z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        className="bg-white rounded-xl p-6 max-w-lg w-full shadow-modal max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-mp-text mb-4">
          {promo ? 'Modifier la promotion' : 'Nouvelle promotion'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Nom</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Code promo</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm font-mono focus:outline-none focus:border-cd-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PromoType })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              >
                <option value="percentage">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
                <option value="free_delivery">Livraison gratuite</option>
                <option value="bogo">1 acheté = 1 offert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Valeur</label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Commande min.</label>
              <input
                type="number"
                value={form.minOrder || ''}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Remise max.</label>
              <input
                type="number"
                value={form.maxDiscount || ''}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Début</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Fin</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Cible</label>
            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value as PromoTarget })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            >
              <option value="all">Tous les clients</option>
              <option value="new_customers">Nouveaux clients</option>
              <option value="loyal">Clients fidèles</option>
              <option value="referral">Parrainage</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary resize-none"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-lg hover:bg-cd-primary-hover transition-colors"
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-cd-border text-cd-text-secondary text-sm font-medium rounded-lg hover:bg-cd-bg-warm transition-colors"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [filter, setFilter] = useState<PromoStatus | 'all'>('all');
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus: PromoStatus = p.status === 'active' ? 'paused' : 'active';
        return { ...p, status: newStatus };
      })
    );
  };

  const deletePromo = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const savePromo = (data: Partial<Promotion>) => {
    if (editing) {
      setPromotions((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p)));
      setEditing(null);
    } else {
      const newPromo: Promotion = {
        id: `promo-${Date.now()}`,
        name: data.name || 'Nouvelle promo',
        code: data.code || 'CODE',
        type: data.type || 'percentage',
        value: data.value || 0,
        minOrder: data.minOrder,
        maxDiscount: data.maxDiscount,
        status: 'active',
        target: data.target || 'all',
        usageCount: 0,
        usageLimit: data.usageLimit,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        description: data.description || '',
      };
      setPromotions((prev) => [newPromo, ...prev]);
      setShowAdd(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredPromos = filter === 'all' ? promotions : promotions.filter((p) => p.status === filter);

  const activePromos = promotions.filter((p) => p.status === 'active').length;
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-mp-text">Promotions</h1>
          <p className="text-sm text-cd-text-secondary mt-1">
            {activePromos} active{activePromos > 1 ? 's' : ''} · {totalUsage} utilisations
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nouvelle promo
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        {([
          { key: 'all', label: 'Toutes' },
          { key: 'active', label: 'Actives' },
          { key: 'scheduled', label: 'Planifiées' },
          { key: 'expired', label: 'Expirées' },
          { key: 'paused', label: 'En pause' },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f.key
                ? 'bg-cd-primary text-white'
                : 'text-cd-text-secondary hover:bg-cd-bg-warm'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Promotions list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredPromos.map((promo) => {
            const type = typeMeta[promo.type];
            const status = statusMeta[promo.status];
            const TypeIcon = type.icon;

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl shadow-sm p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${type.color} bg-current/10 flex items-center justify-center`}>
                      <TypeIcon size={20} className={type.color} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-mp-text">{promo.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-cd-text-secondary mt-0.5">{promo.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-cd-text-tertiary">Cible: {targetMeta[promo.target]}</span>
                        {promo.minOrder && (
                          <span className="text-xs text-cd-text-tertiary">Min: {promo.minOrder}€</span>
                        )}
                        <span className="text-xs text-cd-text-tertiary">
                          {promo.startDate} → {promo.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-cd-text-primary">
                        {promo.type === 'percentage' ? `${promo.value}%` : promo.type === 'fixed' ? `${promo.value}€` : 'Offert'}
                      </span>
                    </div>
                    <p className="text-xs text-cd-text-tertiary">{promo.usageCount} utilisations</p>
                  </div>
                </div>

                {/* Code & Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-cd-border-light">
                  <button
                    onClick={() => copyCode(promo.code)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cd-bg-warm rounded-lg hover:bg-cd-primary-light transition-colors"
                  >
                    <span className="text-sm font-mono font-bold text-cd-primary">{promo.code}</span>
                    {copiedCode === promo.code ? (
                      <CheckCircle2 size={14} className="text-cd-success" />
                    ) : (
                      <Copy size={14} className="text-cd-text-tertiary" />
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStatus(promo.id)}
                      className="p-1.5 text-cd-text-tertiary hover:text-cd-primary transition-colors"
                      title={promo.status === 'active' ? 'Mettre en pause' : 'Activer'}
                    >
                      {promo.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => setEditing(promo)}
                      className="p-1.5 text-cd-text-tertiary hover:text-cd-primary transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="p-1.5 text-cd-text-tertiary hover:text-cd-error transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredPromos.length === 0 && (
          <div className="text-center py-12">
            <Tag size={40} className="mx-auto text-cd-text-tertiary mb-3" />
            <p className="text-sm text-cd-text-secondary">Aucune promotion trouvée</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editing && (
          <PromoModal
            promo={editing}
            onSave={savePromo}
            onClose={() => setEditing(null)}
          />
        )}
        {showAdd && (
          <PromoModal
            onSave={savePromo}
            onClose={() => setShowAdd(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
