import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, MapPin, Store, Phone, Mail, Plus, Search, Filter,
  ChevronDown, ChevronRight, Star, Clock, CheckCircle2, XCircle,
  MessageSquare, Calendar, User, ArrowUpRight, TrendingUp,
  TrendingDown, BarChart3, PieChart, MoreHorizontal, Edit3,
  Trash2, Send, ClipboardList, Navigation, Building2, Globe,
  Briefcase, Hash, Award, AlertTriangle, ThumbsUp, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────
interface Prospect {
  id: string; name: string; type: 'restaurant' | 'commerce' | 'service';
  address: string; city: string; postalCode: string; phone: string; email: string;
  website?: string; contactName?: string; notes?: string;
  status: 'new' | 'contacted' | 'meeting_scheduled' | 'negotiating' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: string; createdAt: string; lastContact?: string;
  estimatedValue?: number; assignedTo?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────
const prospects: Prospect[] = [
  {
    id: 'PRS-001', name: 'Brasserie du Coin', type: 'restaurant', address: '45 Rue de la Roquette', city: 'Paris', postalCode: '75011',
    phone: '+33 1 47 00 00 01', email: 'contact@brasserieducoin.fr', website: 'https://brasserieducoin.fr',
    contactName: 'Jean Dupont', notes: 'Intéressé par la livraison. 40 couverts/jour.',
    status: 'negotiating', priority: 'high', source: 'Appel entrant', createdAt: '2025-01-10', lastContact: '2025-01-14',
    estimatedValue: 2500, assignedTo: 'Marie L.',
  },
  {
    id: 'PRS-002', name: 'Boulangerie des Lilas', type: 'commerce', address: '12 Avenue des Lilas', city: 'Paris', postalCode: '75019',
    phone: '+33 1 42 00 00 02', email: 'boulangerie.lilas@gmail.com',
    contactName: 'Sophie Martin', notes: 'Vente de sandwichs et pâtisseries. Clientèle de bureau.',
    status: 'meeting_scheduled', priority: 'medium', source: 'Prospection', createdAt: '2025-01-08', lastContact: '2025-01-13',
    estimatedValue: 1200, assignedTo: 'Pierre B.',
  },
  {
    id: 'PRS-003', name: 'Sushi Zen', type: 'restaurant', address: '8 Rue du Faubourg Saint-Honoré', city: 'Paris', postalCode: '75008',
    phone: '+33 1 42 00 00 03', email: 'sushizen@restaurant.fr', website: 'https://sushizen.fr',
    contactName: 'Takashi Yamamoto', notes: 'Restaurant haut de gamme. Intéressé par ColePass.',
    status: 'won', priority: 'high', source: 'Salon Food', createdAt: '2025-01-05', lastContact: '2025-01-15',
    estimatedValue: 4500, assignedTo: 'Marie L.',
  },
  {
    id: 'PRS-004', name: 'Café des Artistes', type: 'restaurant', address: '25 Boulevard Saint-Germain', city: 'Paris', postalCode: '75005',
    phone: '+33 1 42 00 00 04', email: 'cafedesartistes@email.com',
    contactName: 'Lucas Bernard', notes: 'Café littéraire avec petite restauration. Clientèle étudiante.',
    status: 'contacted', priority: 'low', source: 'Site web', createdAt: '2025-01-12', lastContact: '2025-01-14',
    estimatedValue: 800, assignedTo: 'Pierre B.',
  },
  {
    id: 'PRS-005', name: 'Traiteur Deluxe', type: 'service', address: '55 Rue de Bercy', city: 'Paris', postalCode: '75012',
    phone: '+33 1 42 00 00 05', email: 'contact@traiteurdeluxe.fr', website: 'https://traiteurdeluxe.fr',
    contactName: 'Emma Richard', notes: 'Service traiteur haut de gamme pour événements.',
    status: 'new', priority: 'medium', source: 'Partenaire', createdAt: '2025-01-15',
    estimatedValue: 3000, assignedTo: 'Marie L.',
  },
  {
    id: 'PRS-006', name: 'Pizza Napoli', type: 'restaurant', address: '18 Rue de la Pompe', city: 'Paris', postalCode: '75016',
    phone: '+33 1 42 00 00 06', email: 'pizza.napoli@restaurant.fr',
    status: 'lost', priority: 'low', source: 'Prospection', createdAt: '2025-01-03', lastContact: '2025-01-10',
    estimatedValue: 1500, assignedTo: 'Pierre B.',
  },
];

const statusFunnel = [
  { stage: 'Nouveaux', count: prospects.filter((p) => p.status === 'new').length, color: '#2962FF' },
  { stage: 'Contactés', count: prospects.filter((p) => p.status === 'contacted').length, color: '#FFB300' },
  { stage: 'RDV', count: prospects.filter((p) => p.status === 'meeting_scheduled').length, color: '#FF6B35' },
  { stage: 'Négociation', count: prospects.filter((p) => p.status === 'negotiating').length, color: '#FF3008' },
  { stage: 'Gagnés', count: prospects.filter((p) => p.status === 'won').length, color: '#00C853' },
  { stage: 'Perdus', count: prospects.filter((p) => p.status === 'lost').length, color: '#A6A6A6' },
];

const sourceDistribution = [
  { name: 'Prospection', value: 35, color: '#FF3008' },
  { name: 'Appel entrant', value: 25, color: '#00C853' },
  { name: 'Site web', value: 15, color: '#FFB300' },
  { name: 'Partenaire', value: 10, color: '#2962FF' },
  { name: 'Salon', value: 10, color: '#FF6B35' },
  { name: 'Autre', value: 5, color: '#A6A6A6' },
];

// ─── Status Config ───────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  new: { label: 'Nouveau', color: '#2962FF', bg: '#E3F2FD', icon: Star },
  contacted: { label: 'Contacté', color: '#FFB300', bg: '#FFF8E1', icon: Phone },
  meeting_scheduled: { label: 'RDV planifié', color: '#FF6B35', bg: '#FFF0ED', icon: Calendar },
  negotiating: { label: 'En négociation', color: '#FF3008', bg: '#FFF0ED', icon: MessageSquare },
  won: { label: 'Gagné', color: '#00C853', bg: '#E8F5E9', icon: CheckCircle2 },
  lost: { label: 'Perdu', color: '#A6A6A6', bg: '#F0EEEA', icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Basse', color: '#00C853' },
  medium: { label: 'Moyenne', color: '#FFB300' },
  high: { label: 'Haute', color: '#FF3008' },
};

// ─── Components ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.new;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium`} style={{ backgroundColor: c.bg, color: c.color }}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminProspecting() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'prospects' | 'analytics'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [expandedProspect, setExpandedProspect] = useState<string | null>(null);
  const [showNewProspect, setShowNewProspect] = useState(false);

  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && p.priority !== priorityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.contactName?.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  const totalValue = prospects.filter((p) => p.status !== 'lost').reduce((s, p) => s + (p.estimatedValue || 0), 0);
  const wonValue = prospects.filter((p) => p.status === 'won').reduce((s, p) => s + (p.estimatedValue || 0), 0);
  const conversionRate = ((prospects.filter((p) => p.status === 'won').length / prospects.filter((p) => p.status !== 'new').length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Prospection</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez vos prospects et suivez le pipeline commercial</p>
        </div>
        <button
          onClick={() => setShowNewProspect(true)}
          className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau prospect
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total prospects', value: prospects.length.toString(), icon: Target, color: '#FF3008' },
          { label: 'Pipeline', value: `€${totalValue.toLocaleString()}`, icon: TrendingUp, color: '#00C853' },
          { label: 'Gagnés', value: `€${wonValue.toLocaleString()}`, icon: CheckCircle2, color: '#2962FF' },
          { label: 'Taux conversion', value: `${conversionRate}%`, icon: Award, color: '#FFB300' },
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
          { key: 'pipeline' as const, label: 'Pipeline', icon: Target },
          { key: 'prospects' as const, label: 'Prospects', icon: ClipboardList },
          { key: 'analytics' as const, label: 'Analyses', icon: BarChart3 },
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

      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Funnel */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
            <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Pipeline de vente</h3>
            <div className="space-y-3">
              {statusFunnel.map((stage, i) => {
                const maxCount = Math.max(...statusFunnel.map((s) => s.count));
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <div className="w-24 text-right">
                      <span className="text-xs font-medium text-[#6B6B6B]">{stage.stage}</span>
                    </div>
                    <div className="flex-1 h-8 bg-[#F9F9FB] rounded-lg overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="h-full rounded-lg flex items-center justify-end px-2"
                        style={{ backgroundColor: stage.color }}
                      >
                        <span className="text-xs font-bold text-white">{stage.count}</span>
                      </motion.div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs text-[#A6A6A6]">{((stage.count / prospects.length) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Prospects */}
          <div className="bg-white rounded-2xl border border-[#F0EEEA] overflow-hidden">
            <div className="p-5 border-b border-[#F0EEEA]">
              <h3 className="text-base font-semibold text-[#1A1A1A]">Prospects récents</h3>
            </div>
            <div className="divide-y divide-[#F0EEEA]">
              {prospects.slice(0, 5).map((prospect) => (
                <div key={prospect.id} className="p-4 flex items-center gap-4 hover:bg-[#F9F9FB] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                    {prospect.type === 'restaurant' && <Store size={18} className="text-[#FF3008]" />}
                    {prospect.type === 'commerce' && <Building2 size={18} className="text-[#FF3008]" />}
                    {prospect.type === 'service' && <Briefcase size={18} className="text-[#FF3008]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#1A1A1A]">{prospect.name}</h4>
                      <StatusBadge status={prospect.status} />
                    </div>
                    <p className="text-xs text-[#A6A6A6] flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {prospect.city} · {prospect.contactName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">€{prospect.estimatedValue?.toLocaleString()}</p>
                    <p className="text-[10px] text-[#A6A6A6]">{prospect.assignedTo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prospects' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un prospect..."
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
            >
              <option value="all">Toutes priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>

          {/* Prospects List */}
          <div className="space-y-3">
            {filteredProspects.map((prospect) => {
              const isExpanded = expandedProspect === prospect.id;
              return (
                <div key={prospect.id} className="bg-white rounded-2xl border border-[#F0EEEA]">
                  <div
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-[#F9F9FB] transition-colors"
                    onClick={() => setExpandedProspect(isExpanded ? null : prospect.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0">
                      {prospect.type === 'restaurant' && <Store size={18} className="text-[#FF3008]" />}
                      {prospect.type === 'commerce' && <Building2 size={18} className="text-[#FF3008]" />}
                      {prospect.type === 'service' && <Briefcase size={18} className="text-[#FF3008]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-medium text-[#1A1A1A]">{prospect.name}</h4>
                        <StatusBadge status={prospect.status} />
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: priorityConfig[prospect.priority].color + '15', color: priorityConfig[prospect.priority].color }}>
                          {priorityConfig[prospect.priority].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#A6A6A6]">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {prospect.city}</span>
                        <span className="flex items-center gap-1"><User size={10} /> {prospect.contactName || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {prospect.createdAt}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1A1A1A]">€{prospect.estimatedValue?.toLocaleString()}</p>
                      <p className="text-[10px] text-[#A6A6A6]">{prospect.assignedTo}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-[#F0EEEA]">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Coordonnées</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><MapPin size={14} className="text-[#FF3008]" /> {prospect.address}, {prospect.postalCode} {prospect.city}</p>
                                <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Phone size={14} className="text-[#A6A6A6]" /> {prospect.phone}</p>
                                <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Mail size={14} className="text-[#A6A6A6]" /> {prospect.email}</p>
                                {prospect.website && <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Globe size={14} className="text-[#A6A6A6]" /> {prospect.website}</p>}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Détails</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Source:</span> {prospect.source}</p>
                                <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Assigné à:</span> {prospect.assignedTo}</p>
                                {prospect.lastContact && <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Dernier contact:</span> {prospect.lastContact}</p>}
                              </div>
                              {prospect.notes && (
                                <div className="p-3 rounded-xl bg-[#F9F9FB]">
                                  <p className="text-xs text-[#6B6B6B]">{prospect.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-3 border-t border-[#F0EEEA]">
                            <button className="flex-1 h-9 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors flex items-center justify-center gap-1">
                              <Phone size={12} /> Appeler
                            </button>
                            <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                              <Mail size={12} /> Email
                            </button>
                            <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                              <Calendar size={12} /> Planifier RDV
                            </button>
                            <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                              <CheckCircle2 size={12} /> Marquer gagné
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {filteredProspects.length === 0 && (
            <div className="text-center py-10">
              <AlertTriangle size={32} className="text-[#A6A6A6] mx-auto mb-2" />
              <p className="text-sm text-[#A6A6A6]">Aucun prospect trouvé</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Distribution */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Répartition par source</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie data={sourceDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* Funnel Chart */}
            <div className="bg-white rounded-2xl border border-[#F0EEEA] p-5">
              <h3 className="text-base font-semibold text-[#1A1A1A] mb-4">Pipeline</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEEA" />
                  <XAxis type="number" stroke="#A6A6A6" fontSize={12} />
                  <YAxis type="category" dataKey="stage" stroke="#A6A6A6" fontSize={12} width={100} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0EEEA' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {statusFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
