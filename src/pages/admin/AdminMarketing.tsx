import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Mail, MessageSquare, Gift, TrendingUp, Users,
  Eye, MousePointer, ArrowUpRight, Plus, Calendar, Clock,
  ChevronDown, Search, MoreHorizontal, Edit3, Trash2, Copy,
  CheckCircle2, XCircle, Pause, Play, BarChart3, Target,
  Zap, Send, Sparkles, Percent, Crown, AlertTriangle,
  Smartphone, Globe, Hash
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// ─── Mock Data ───────────────────────────────────────────────────────
const campaigns = [
  { id: 'CMP-001', name: 'Promotion de printemps', type: 'email', status: 'active', audience: 12500, openRate: 32.5, clickRate: 8.2, conversions: 245, startDate: '2025-03-01', endDate: '2025-03-31', budget: 500, spent: 320 },
  { id: 'CMP-002', name: 'ColePass - Nouveaux membres', type: 'push', status: 'active', audience: 8500, openRate: 45.0, clickRate: 12.5, conversions: 520, startDate: '2025-02-15', endDate: '2025-04-15', budget: 300, spent: 180 },
  { id: 'CMP-003', name: 'Offre de bienvenue', type: 'sms', status: 'completed', audience: 3200, openRate: 95.0, clickRate: 25.0, conversions: 180, startDate: '2025-01-01', endDate: '2025-01-31', budget: 200, spent: 200 },
  { id: 'CMP-004', name: 'Fidélisation - Clients inactifs', type: 'email', status: 'paused', audience: 5600, openRate: 18.5, clickRate: 3.2, conversions: 45, startDate: '2025-02-01', endDate: '2025-02-28', budget: 400, spent: 150 },
  { id: 'CMP-005', name: 'Nouveaux restaurants', type: 'push', status: 'active', audience: 15000, openRate: 38.0, clickRate: 9.5, conversions: 310, startDate: '2025-03-10', endDate: '2025-04-10', budget: 600, spent: 280 },
];

const promoCodes = [
  { id: 'PRM-001', code: 'WELCOME20', type: 'percentage', value: 20, usageLimit: 1000, usageCount: 645, minOrder: 25, expiry: '2025-06-30', status: 'active', appliesTo: 'all' },
  { id: 'PRM-002', code: 'LIVRAISON', type: 'free_delivery', value: 0, usageLimit: 500, usageCount: 423, minOrder: 30, expiry: '2025-05-15', status: 'active', appliesTo: 'all' },
  { id: 'PRM-003', code: 'COLEPASS10', type: 'fixed', value: 10, usageLimit: 200, usageCount: 198, minOrder: 0, expiry: '2025-04-01', status: 'expiring', appliesTo: 'colepass' },
  { id: 'PRM-004', code: 'SUSHI15', type: 'percentage', value: 15, usageLimit: 300, usageCount: 87, minOrder: 20, expiry: '2025-07-31', status: 'active', appliesTo: 'category' },
  { id: 'PRM-005', code: 'ANNIVERSAIRE', type: 'percentage', value: 25, usageLimit: 1, usageCount: 0, minOrder: 0, expiry: '2025-12-31', status: 'active', appliesTo: 'user_segment' },
];

const emailPerformance = [
  { date: 'Lun', sent: 2500, opened: 875, clicked: 210 },
  { date: 'Mar', sent: 3200, opened: 1050, clicked: 280 },
  { date: 'Mer', sent: 2800, opened: 920, clicked: 240 },
  { date: 'Jeu', sent: 3500, opened: 1150, clicked: 310 },
  { date: 'Ven', sent: 4000, opened: 1400, clicked: 380 },
  { date: 'Sam', sent: 1800, opened: 650, clicked: 150 },
  { date: 'Dim', sent: 1500, opened: 520, clicked: 120 },
];

const campaignTypes = [
  { name: 'Email', value: 40, color: '#FF3008' },
  { name: 'Push', value: 35, color: '#00C853' },
  { name: 'SMS', value: 15, color: '#FFB300' },
  { name: 'Social', value: 10, color: '#2962FF' },
];

// ─── Components ──────────────────────────────────────────────────────
function CampaignStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string; icon: any }> = {
    active: { bg: 'bg-[#E8F5E9]', text: 'text-[#00C853]', label: 'Active', icon: Play },
    paused: { bg: 'bg-[#FFF8E1]', text: 'text-[#FFB300]', label: 'En pause', icon: Pause },
    completed: { bg: 'bg-[#F0EEEA]', text: 'text-[#6B6B6B]', label: 'Terminée', icon: CheckCircle2 },
    expiring: { bg: 'bg-[#FFF0ED]', text: 'text-[#FF3008]', label: 'Expire bientôt', icon: Clock },
  };
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${c.bg} ${c.text} text-xs font-medium`}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

function PromoStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-[#E8F5E9]', text: 'text-[#00C853]', label: 'Actif' },
    expiring: { bg: 'bg-[#FFF8E1]', text: 'text-[#FFB300]', label: 'Expire bientôt' },
    expired: { bg: 'bg-[#F0EEEA]', text: 'text-[#6B6B6B]', label: 'Expiré' },
  };
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${c.bg} ${c.text} text-xs font-medium`}>
      {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminMarketing() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'promos' | 'analytics' | 'automations'>('campaigns');
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showNewPromo, setShowNewPromo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [statusFilter, searchQuery]);

  const totalSent = emailPerformance.reduce((s, d) => s + d.sent, 0);
  const totalOpened = emailPerformance.reduce((s, d) => s + d.opened, 0);
  const totalClicked = emailPerformance.reduce((s, d) => s + d.clicked, 0);
  const avgOpenRate = ((totalOpened / totalSent) * 100).toFixed(1);
  const avgClickRate = ((totalClicked / totalSent) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Marketing</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez vos campagnes, codes promo et automatisations</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'campaigns' && (
            <button
              onClick={() => setShowNewCampaign(true)}
              className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Nouvelle campagne
            </button>
          )}
          {activeTab === 'promos' && (
            <button
              onClick={() => setShowNewPromo(true)}
              className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Nouveau code
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Campagnes actives', value: campaigns.filter((c) => c.status === 'active').length.toString(), icon: Megaphone, color: '#FF3008' },
          { label: 'Codes promo actifs', value: promoCodes.filter((p) => p.status === 'active').length.toString(), icon: Gift, color: '#00C853' },
          { label: 'Taux d\'ouverture', value: `${avgOpenRate}%`, icon: Eye, color: '#FFB300' },
          { label: 'Taux de clic', value: `${avgClickRate}%`, icon: MousePointer, color: '#2962FF' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-[#F0EEEA] p-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: stat.color + '15' }}>
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <p className="text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
            <p className="text-xs text-[#A6A6A6]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#F0EEEA]">
        {[
          { key: 'campaigns' as const, label: 'Campagnes', icon: Megaphone },
          { key: 'promos' as const, label: 'Codes promo', icon: Gift },
          { key: 'analytics' as const, label: 'Analyses', icon: BarChart3 },
          { key: 'automations' as const, label: 'Automatisations', icon: Zap },
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

      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une campagne..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="paused">En pause</option>
              <option value="completed">Terminée</option>
            </select>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-2xl border border-[#F0EEEA] p-5 hover:border-[#FF3008]/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      campaign.type === 'email' ? 'bg-[#FFF0ED] text-[#FF3008]' :
                      campaign.type === 'push' ? 'bg-[#E8F5E9] text-[#00C853]' :
                      campaign.type === 'sms' ? 'bg-[#FFF8E1] text-[#FFB300]' :
                      'bg-[#E3F2FD] text-[#2962FF]'
                    }`}>
                      {campaign.type === 'email' && <Mail size={18} />}
                      {campaign.type === 'push' && <Smartphone size={18} />}
                      {campaign.type === 'sms' && <MessageSquare size={18} />}
                      {campaign.type === 'social' && <Globe size={18} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#1A1A1A]">{campaign.name}</h3>
                      <p className="text-[10px] text-[#A6A6A6]">{campaign.id} · {campaign.startDate} - {campaign.endDate}</p>
                    </div>
                  </div>
                  <CampaignStatusBadge status={campaign.status} />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div className="text-center p-2 rounded-lg bg-[#F9F9FB]">
                    <p className="text-sm font-bold text-[#1A1A1A]">{(campaign.audience / 1000).toFixed(1)}k</p>
                    <p className="text-[10px] text-[#A6A6A6]">Audience</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[#F9F9FB]">
                    <p className="text-sm font-bold text-[#1A1A1A]">{campaign.openRate}%</p>
                    <p className="text-[10px] text-[#A6A6A6]">Ouverture</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[#F9F9FB]">
                    <p className="text-sm font-bold text-[#1A1A1A]">{campaign.clickRate}%</p>
                    <p className="text-[10px] text-[#A6A6A6]">Clics</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-[#F9F9FB]">
                    <p className="text-sm font-bold text-[#1A1A1A]">{campaign.conversions}</p>
                    <p className="text-[10px] text-[#A6A6A6]">Conversions</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#A6A6A6]">Budget</span>
                    <span className="text-[#1A1A1A] font-medium">€{campaign.spent} / €{campaign.budget}</span>
                  </div>
                  <div className="h-1.5 bg-[#F0EEEA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF3008] rounded-full" style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#F0EEEA]">
                  <button className="flex-1 h-8 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                    <BarChart3 size={12} /> Stats
                  </button>
                  <button className="flex-1 h-8 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                    <Edit3 size={12} /> Modifier
                  </button>
                  <button className="flex-1 h-8 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                    <Copy size={12} /> Dupliquer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'promos' && (
        <div className="space-y-4">
          {/* Promo Table */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EEEA] bg-[#F9F9FB]">
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Code</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Type</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Valeur</th>
                    <th className="text-right text-xs font-medium text-[#A6A6A6] px-5 py-3">Utilisé</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Min. commande</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Expire</th>
                    <th className="text-left text-xs font-medium text-[#A6A6A6] px-5 py-3">Statut</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {promoCodes.map((promo) => (
                    <tr key={promo.id} className="border-b border-[#F0EEEA] last:border-0 hover:bg-[#F9F9FB]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-[#FF3008]" />
                          <span className="text-sm font-mono font-medium text-[#1A1A1A]">{promo.code}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B]">
                        {promo.type === 'percentage' ? 'Pourcentage' : promo.type === 'fixed' ? 'Montant fixe' : 'Livraison offerte'}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-right text-[#1A1A1A]">
                        {promo.type === 'percentage' ? `${promo.value}%` : promo.type === 'fixed' ? `€${promo.value}` : '-'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-right">
                          <span className="text-sm text-[#1A1A1A]">{promo.usageCount} / {promo.usageLimit}</span>
                          <div className="w-20 h-1 bg-[#F0EEEA] rounded-full overflow-hidden ml-auto mt-1">
                            <div className="h-full bg-[#FF3008] rounded-full" style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#6B6B6B]">{promo.minOrder > 0 ? `€${promo.minOrder}` : '-'}</td>
                      <td className="px-5 py-3 text-xs text-[#6B6B6B]">{promo.expiry}</td>
                      <td className="px-5 py-3"><PromoStatusBadge status={promo.status} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                            <Edit3 size={14} />
                          </button>
                          <button className="w-8 h-8 rounded-lg hover:bg-[#FFF0ED] flex items-center justify-center text-[#A6A6A6] hover:text-[#FF3008]">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Performance */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Performance email (7 jours)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={emailPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEA" />
                  <XAxis dataKey="date" stroke="#A6A6A6" fontSize={12} />
                  <YAxis stroke="#A6A6A6" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0EEEA' }} />
                  <Bar dataKey="sent" fill="#E8E8E8" radius={[4, 4, 0, 0]} name="Envoyés" />
                  <Bar dataKey="opened" fill="#FFB300" radius={[4, 4, 0, 0]} name="Ouverts" />
                  <Bar dataKey="clicked" fill="#FF3008" radius={[4, 4, 0, 0]} name="Clics" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Campaign Types */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Répartition par canal</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={campaignTypes} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {campaignTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automations' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#F0EEEA] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F9F9FB] flex items-center justify-center mx-auto mb-4">
              <Zap size={28} className="text-[#A6A6A6]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">Automatisations</h3>
            <p className="text-sm text-[#A6A6A6] mb-4">Créez des flux automatisés pour engager vos clients au bon moment.</p>
            <button className="h-10 px-6 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors">
              Créer une automatisation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
