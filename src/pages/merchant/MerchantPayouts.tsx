import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Banknote,
  CreditCard,
  ChevronRight,
  FileText,
  TrendingUp,
  Euro,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
type Period = '7d' | '30d' | '90d';

interface Payout {
  id: string;
  date: string;
  amount: number;
  status: PayoutStatus;
  method: 'bank' | 'stripe' | 'paypal';
  methodLabel: string;
  accountEnding: string;
  ordersCount: number;
  fee: number;
}

interface WeeklySummary {
  week: string;
  revenue: number;
  payouts: number;
  orders: number;
  commission: number;
  net: number;
}

/* ─────────────────────── mock data ─────────────────────── */

const mockPayouts: Payout[] = [
  {
    id: 'PO-2841',
    date: '2025-01-15',
    amount: 2840.50,
    status: 'completed',
    method: 'bank',
    methodLabel: 'Virement bancaire',
    accountEnding: '****1234',
    ordersCount: 156,
    fee: 2.50,
  },
  {
    id: 'PO-2840',
    date: '2025-01-08',
    amount: 3120.00,
    status: 'completed',
    method: 'bank',
    methodLabel: 'Virement bancaire',
    accountEnding: '****1234',
    ordersCount: 180,
    fee: 2.50,
  },
  {
    id: 'PO-2839',
    date: '2025-01-01',
    amount: 2650.75,
    status: 'completed',
    method: 'stripe',
    methodLabel: 'Stripe',
    accountEnding: '****5678',
    ordersCount: 142,
    fee: 2.50,
  },
  {
    id: 'PO-2838',
    date: '2024-12-25',
    amount: 4100.00,
    status: 'completed',
    method: 'bank',
    methodLabel: 'Virement bancaire',
    accountEnding: '****1234',
    ordersCount: 220,
    fee: 2.50,
  },
  {
    id: 'PO-2837',
    date: '2025-01-22',
    amount: 1950.00,
    status: 'processing',
    method: 'bank',
    methodLabel: 'Virement bancaire',
    accountEnding: '****1234',
    ordersCount: 98,
    fee: 2.50,
  },
];

const weeklySummaries: WeeklySummary[] = [
  { week: 'Semaine 3', revenue: 2840.50, payouts: 2840.50, orders: 156, commission: 426.08, net: 2414.42 },
  { week: 'Semaine 2', revenue: 3120.00, payouts: 3120.00, orders: 180, commission: 468.00, net: 2652.00 },
  { week: 'Semaine 1', revenue: 2650.75, payouts: 2650.75, orders: 142, commission: 397.61, net: 2253.14 },
  { week: 'Semaine 52', revenue: 4100.00, payouts: 4100.00, orders: 220, commission: 615.00, net: 3485.00 },
];

const statusMeta: Record<PayoutStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: 'En attente', color: 'text-cd-warning', bg: 'bg-cd-warning-light', icon: Clock },
  processing: { label: 'En cours', color: 'text-cd-info', bg: 'bg-cd-info-light', icon: ArrowUpRight },
  completed: { label: 'Effectué', color: 'text-cd-success', bg: 'bg-cd-success-light', icon: CheckCircle2 },
  failed: { label: 'Échoué', color: 'text-cd-error', bg: 'bg-cd-error-light', icon: AlertTriangle },
};

/* ─────────────────────── sub-components ─────────────────────── */

function StatusBadge({ status }: { status: PayoutStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${meta.color} ${meta.bg}`}>
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

function PayoutCard({ payout }: { payout: Payout }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold text-cd-text-primary">{payout.id}</span>
          <StatusBadge status={payout.status} />
        </div>
        <span className="text-sm text-cd-text-tertiary">{payout.date}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[28px] font-extrabold text-cd-text-primary leading-tight">{payout.amount.toFixed(2)} €</p>
          <p className="text-xs text-cd-text-tertiary mt-1">
            {payout.ordersCount} commandes · Commission: {(payout.amount * 0.15).toFixed(2)} €
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-cd-text-secondary">
            <Banknote size={12} />
            {payout.methodLabel}
          </div>
          <p className="text-xs text-cd-text-tertiary">{payout.accountEnding}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantPayouts() {
  const [period, setPeriod] = useState<Period>('30d');
  const [filter, setFilter] = useState<PayoutStatus | 'all'>('all');

  const filteredPayouts = filter === 'all' ? mockPayouts : mockPayouts.filter((p) => p.status === filter);

  const totalRevenue = weeklySummaries.reduce((sum, w) => sum + w.revenue, 0);
  const totalNet = weeklySummaries.reduce((sum, w) => sum + w.net, 0);
  const totalOrders = weeklySummaries.reduce((sum, w) => sum + w.orders, 0);

  const periodLabels: Record<Period, string> = {
    '7d': '7 jours',
    '30d': '30 jours',
    '90d': '3 mois',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[800px] mx-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-mp-text">Paiements</h1>
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-cd-primary text-white'
                  : 'text-cd-text-secondary hover:bg-cd-bg-warm'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Chiffre d'affaires</p>
          <p className="text-[28px] font-extrabold text-cd-text-primary leading-tight">{totalRevenue.toFixed(2)} €</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={12} className="text-cd-success" />
            <span className="text-xs text-cd-success font-medium">+15% vs période précédente</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#FFF0ED] to-white rounded-xl p-5 shadow-sm border border-[#FFD5CC]">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Net perçu</p>
          <p className="text-[28px] font-extrabold text-cd-success leading-tight">{totalNet.toFixed(2)} €</p>
          <p className="text-xs text-cd-text-tertiary mt-1">Après commission 15%</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Commandes</p>
          <p className="text-[28px] font-extrabold text-cd-text-primary leading-tight">{totalOrders}</p>
          <p className="text-xs text-cd-text-tertiary mt-1">Total période</p>
        </div>
      </div>

      {/* Weekly table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-cd-border">
          <h3 className="text-sm font-semibold text-mp-text">Résumé hebdomadaire</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cd-border">
                <th className="text-left py-3 px-5 text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">Semaine</th>
                <th className="text-right py-3 px-5 text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">CA</th>
                <th className="text-right py-3 px-5 text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">Commission</th>
                <th className="text-right py-3 px-5 text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">Net</th>
                <th className="text-right py-3 px-5 text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">Commandes</th>
              </tr>
            </thead>
            <tbody>
              {weeklySummaries.map((w) => (
                <tr key={w.week} className="border-b border-cd-border-light hover:bg-cd-bg-warm transition-colors">
                  <td className="py-3 px-5 text-sm font-medium text-cd-text-primary">{w.week}</td>
                  <td className="py-3 px-5 text-sm text-cd-text-primary text-right">{w.revenue.toFixed(2)} €</td>
                  <td className="py-3 px-5 text-sm text-cd-error text-right">-{w.commission.toFixed(2)} €</td>
                  <td className="py-3 px-5 text-sm font-bold text-cd-success text-right">{w.net.toFixed(2)} €</td>
                  <td className="py-3 px-5 text-sm text-cd-text-secondary text-right">{w.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payouts list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-mp-text">Historique des virements</h3>
          <div className="flex gap-1">
            {(['all', 'completed', 'processing', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-cd-primary text-white'
                    : 'text-cd-text-secondary hover:bg-cd-bg-warm'
                }`}
              >
                {f === 'all' ? 'Tous' : statusMeta[f].label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {filteredPayouts.map((payout) => (
              <PayoutCard key={payout.id} payout={payout} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
