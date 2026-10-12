import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Calendar,
  Download, Filter, ChevronDown, Search, MoreHorizontal,
  CheckCircle2, XCircle, Clock, AlertTriangle, Banknote,
  Receipt, ArrowRightLeft, BadgePercent, Users, Store
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 45200, orders: 320, commission: 6780 },
  { month: 'Fév', revenue: 48900, orders: 345, commission: 7335 },
  { month: 'Mar', revenue: 52300, orders: 380, commission: 7845 },
  { month: 'Avr', revenue: 49800, orders: 355, commission: 7470 },
  { month: 'Mai', revenue: 56700, orders: 410, commission: 8505 },
  { month: 'Juin', revenue: 61200, orders: 450, commission: 9180 },
  { month: 'Juil', revenue: 58900, orders: 430, commission: 8835 },
  { month: 'Août', revenue: 63400, orders: 470, commission: 9510 },
  { month: 'Sep', revenue: 59800, orders: 440, commission: 8970 },
  { month: 'Oct', revenue: 64500, orders: 480, commission: 9675 },
  { month: 'Nov', revenue: 67800, orders: 510, commission: 10170 },
  { month: 'Déc', revenue: 71200, orders: 540, commission: 10680 },
];

const commissionByCategory = [
  { name: 'Restaurants', value: 45, color: '#FF3008' },
  { name: 'Bouquets', value: 20, color: '#FF6B35' },
  { name: 'Épicerie', value: 15, color: '#FFB300' },
  { name: 'ColePass', value: 12, color: '#00C853' },
  { name: 'Autres', value: 8, color: '#2962FF' },
];

const recentTransactions = [
  { id: 'TX-001', type: 'order', description: 'Commande #ORD-4521', amount: 42.50, commission: 6.38, status: 'completed', date: '2025-01-15 14:30', restaurant: 'Le Petit Bistro' },
  { id: 'TX-002', type: 'order', description: 'Commande #ORD-4522', amount: 78.90, commission: 11.84, status: 'completed', date: '2025-01-15 13:45', restaurant: 'Sushi Master' },
  { id: 'TX-003', type: 'refund', description: 'Remboursement #ORD-4508', amount: -24.50, commission: -3.68, status: 'refunded', date: '2025-01-15 12:20', restaurant: 'Burger House' },
  { id: 'TX-004', type: 'subscription', description: 'Abonnement ColePass', amount: 9.99, commission: 0, status: 'completed', date: '2025-01-15 11:00', restaurant: 'ColeDash' },
  { id: 'TX-005', type: 'order', description: 'Commande #ORD-4523', amount: 35.00, commission: 5.25, status: 'pending', date: '2025-01-15 10:15', restaurant: 'Pizza Roma' },
  { id: 'TX-006', type: 'order', description: 'Commande #ORD-4524', amount: 56.70, commission: 8.51, status: 'completed', date: '2025-01-15 09:30', restaurant: 'Taco Fiesta' },
  { id: 'TX-007', type: 'order', description: 'Commande #ORD-4525', amount: 89.00, commission: 13.35, status: 'completed', date: '2025-01-15 08:45', restaurant: 'Le Petit Bistro' },
  { id: 'TX-008', type: 'order', description: 'Commande #ORD-4526', amount: 28.50, commission: 4.28, status: 'pending', date: '2025-01-15 08:00', restaurant: 'Crêperie Bretonne' },
];

const payoutData = [
  { id: 'PY-001', restaurant: 'Le Petit Bistro', amount: 2450.80, status: 'completed', date: '2025-01-15', method: 'Virement' },
  { id: 'PY-002', restaurant: 'Sushi Master', amount: 1890.50, status: 'completed', date: '2025-01-15', method: 'Virement' },
  { id: 'PY-003', restaurant: 'Burger House', amount: 1560.20, status: 'pending', date: '2025-01-15', method: 'Virement' },
  { id: 'PY-004', restaurant: 'Pizza Roma', amount: 980.75, status: 'completed', date: '2025-01-14', method: 'Virement' },
  { id: 'PY-005', restaurant: 'Taco Fiesta', amount: 1340.60, status: 'pending', date: '2025-01-14', method: 'Virement' },
];

const restaurantPerformance = [
  { name: 'Le Petit Bistro', revenue: 12450, orders: 340, growth: 12.5 },
  { name: 'Sushi Master', revenue: 9870, orders: 280, growth: 8.3 },
  { name: 'Burger House', revenue: 8650, orders: 310, growth: -2.1 },
  { name: 'Pizza Roma', revenue: 7230, orders: 250, growth: 5.7 },
  { name: 'Taco Fiesta', revenue: 6540, orders: 210, growth: 15.2 },
];

// ─── Components ──────────────────────────────────────────────────────
function StatCard({ title, value, change, changeType, icon: Icon }: { title: string; value: string; change: string; changeType: 'up' | 'down' | 'neutral'; icon: any }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center">
          <Icon size={20} className="text-[#FF3008]" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
          changeType === 'up' ? 'bg-[#E8F5E9] text-[#00C853]' :
          changeType === 'down' ? 'bg-[#FFF0ED] text-[#FF3008]' :
          'bg-[#F9F9FB] text-[#6B6B6B]'
        }`}>
          {changeType === 'up' ? <ArrowUpRight size={12} /> : changeType === 'down' ? <ArrowDownRight size={12} /> : null}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
      <p className="text-xs text-[#A6A6A6] mt-1">{title}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: any }> = {
    completed: { bg: 'bg-[#E8F5E9]', text: 'text-[#00C853]', label: 'Complété', icon: CheckCircle2 },
    pending: { bg: 'bg-[#FFF8E1]', text: 'text-[#FFB300]', label: 'En attente', icon: Clock },
    refunded: { bg: 'bg-[#FFF0ED]', text: 'text-[#FF3008]', label: 'Remboursé', icon: XCircle },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${c.bg} ${c.text} text-xs font-medium`}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminFinance() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts' | 'analytics'>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((tx) => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase()) && !tx.restaurant.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [statusFilter, searchQuery]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalCommission = revenueData.reduce((sum, d) => sum + d.commission, 0);
  const totalOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Finance</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez les revenus, commissions et paiements</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="1y">Cette année</option>
          </select>
          <button className="h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2">
            <Download size={16} /> Exporter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#F0EEEA]">
        {[
          { key: 'overview' as const, label: 'Vue d\'ensemble', icon: BarChart3 },
          { key: 'transactions' as const, label: 'Transactions', icon: ArrowRightLeft },
          { key: 'payouts' as const, label: 'Paiements', icon: Banknote },
          { key: 'analytics' as const, label: 'Analyses', icon: PieChart },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-[#FF3008] text-[#FF3008]' : 'border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Revenus totaux" value={`€${totalRevenue.toLocaleString()}`} change="+12.5%" changeType="up" icon={DollarSign} />
            <StatCard title="Commissions" value={`€${totalCommission.toLocaleString()}`} change="+10.2%" changeType="up" icon={BadgePercent} />
            <StatCard title="Commandes" value={totalOrders.toLocaleString()} change="+8.3%" changeType="up" icon={Receipt} />
            <StatCard title="Panier moyen" value={`€${avgOrderValue.toFixed(2)}`} change="+3.1%" changeType="up" icon={Wallet} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#1A1A1A]">Évolution des revenus</h3>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF3008]" /> Revenus</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#00C853]" /> Commissions</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF3008" stopOpacity={0.1}/><stop offset="95%" stopColor="#FF3008" stopOpacity={0}/></linearGradient>
                    <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00C853" stopOpacity={0.1}/><stop offset="95%" stopColor="#00C853" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEA" />
                  <XAxis dataKey="month" stroke="#A6A6A6" fontSize={12} />
                  <YAxis stroke="#A6A6A6" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid #F0EEEA' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#FF3008" fill="url(#revGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="commission" stroke="#00C853" fill="url(#comGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Commission by Category */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Commissions par catégorie</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie data={commissionByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {commissionByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {commissionByCategory.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[#6B6B6B]">{cat.name}</span>
                    </span>
                    <span className="font-medium text-[#1A1A1A]">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="p-5 border-b border-[#F0EEEA] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1A1A1A]">Transactions récentes</h3>
              <button onClick={() => setActiveTab('transactions')} className="text-xs text-[#FF3008] font-medium hover:underline">Voir tout</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EEEA]">
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Description</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Restaurant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Montant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Commission</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b border-[#F0EEEA] last:border-0 hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3 text-xs text-[#A6A6A6]">{tx.id}</td>
                      <td className="px-5 py-3 text-sm text-[#1A1A1A]">{tx.description}</td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B]">{tx.restaurant}</td>
                      <td className={`px-5 py-3 text-sm font-medium text-right ${tx.amount < 0 ? 'text-[#FF3008]' : 'text-[#1A1A1A]'}`}>
                        {tx.amount < 0 ? '-' : ''}€{Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B] text-right">€{Math.abs(tx.commission).toFixed(2)}</td>
                      <td className="px-5 py-3"><StatusBadge status={tx.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une transaction..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Complété</option>
              <option value="pending">En attente</option>
              <option value="refunded">Remboursé</option>
            </select>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EEEA] bg-[#F9F9FB]">
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Description</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Restaurant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Montant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Commission</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Statut</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#F0EEEA] last:border-0 hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3 text-xs text-[#A6A6A6] font-mono">{tx.id}</td>
                      <td className="px-5 py-3 text-xs text-[#6B6B6B]">{tx.date}</td>
                      <td className="px-5 py-3 text-sm text-[#1A1A1A]">{tx.description}</td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B]">{tx.restaurant}</td>
                      <td className={`px-5 py-3 text-sm font-medium text-right ${tx.amount < 0 ? 'text-[#FF3008]' : 'text-[#1A1A1A]'}`}>
                        {tx.amount < 0 ? '-' : ''}€{Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B] text-right">€{Math.abs(tx.commission).toFixed(2)}</td>
                      <td className="px-5 py-3"><StatusBadge status={tx.status} /></td>
                      <td className="px-5 py-3">
                        <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-10">
                <AlertTriangle size={32} className="text-[#A6A6A6] mx-auto mb-2" />
                <p className="text-sm text-[#A6A6A6]">Aucune transaction trouvée</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Payout Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Paiements ce mois" value="€12,450" change="+15.2%" changeType="up" icon={Banknote} />
            <StatCard title="En attente" value="€3,890" change="5 paiements" changeType="neutral" icon={Clock} />
            <StatCard title="Restaurants payés" value="24" change="+2 ce mois" changeType="up" icon={Store} />
          </div>

          {/* Payouts Table */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="p-5 border-b border-[#F0EEEA] flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1A1A1A]">Paiements aux restaurants</h3>
              <button className="h-9 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors">
                Nouveau paiement
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EEEA] bg-[#F9F9FB]">
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Restaurant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Montant</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Méthode</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutData.map((payout) => (
                    <tr key={payout.id} className="border-b border-[#F0EEEA] last:border-0 hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3 text-xs text-[#A6A6A6] font-mono">{payout.id}</td>
                      <td className="px-5 py-3 text-sm font-medium text-[#1A1A1A]">{payout.restaurant}</td>
                      <td className="px-5 py-3 text-sm font-medium text-right text-[#1A1A1A]">€{payout.amount.toFixed(2)}</td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B]">{payout.method}</td>
                      <td className="px-5 py-3 text-xs text-[#6B6B6B]">{payout.date}</td>
                      <td className="px-5 py-3"><StatusBadge status={payout.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top Restaurants */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Performance des restaurants</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={restaurantPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEA" />
                <XAxis type="number" stroke="#A6A6A6" fontSize={12} tickFormatter={(v) => `€${v}`} />
                <YAxis type="category" dataKey="name" stroke="#A6A6A6" fontSize={12} width={120} />
                <Tooltip formatter={(value: number) => `€${value.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid #F0EEEA' }} />
                <Bar dataKey="revenue" fill="#FF3008" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Growth Table */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="p-5 border-b border-[#F0EEEA]">
              <h3 className="text-base font-semibold text-[#1A1A1A]">Croissance par restaurant</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EEEA] bg-[#F9F9FB]">
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Restaurant</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Revenus</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Commandes</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Croissance</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurantPerformance.map((r) => (
                    <tr key={r.name} className="border-b border-[#F0EEEA] last:border-0 hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3 text-sm font-medium text-[#1A1A1A]">{r.name}</td>
                      <td className="px-5 py-3 text-sm text-right text-[#1A1A1A]">€{r.revenue.toLocaleString()}</td>
                      <td className="px-5 py-3 text-sm text-right text-[#6B6B6B]">{r.orders}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${r.growth >= 0 ? 'text-[#00C853]' : 'text-[#FF3008]'}`}>
                          {r.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {r.growth > 0 ? '+' : ''}{r.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
