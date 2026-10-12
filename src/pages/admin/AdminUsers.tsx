import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Plus, Filter, ChevronDown, ChevronRight, Star,
  MapPin, Phone, Mail, Calendar, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, TrendingDown, Eye, Edit3, Trash2, MoreHorizontal,
  UtensilsCrossed, Bike, DollarSign, Shield, UserCog, UserX,
  MailOpen, MessageSquare, Ban, Unlock, Clock, Hash
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface UserAccount {
  id: string; name: string; email: string; phone: string; avatar: string;
  role: 'customer' | 'restaurant' | 'delivery' | 'admin';
  status: 'active' | 'inactive' | 'banned' | 'pending'; joinedAt: string;
  lastActive: string; ordersCount: number; totalSpent: number; rating?: number;
  address?: string; city?: string; isColePass: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────
const users: UserAccount[] = [
  {
    id: 'USR-001', name: 'Marie Dupont', email: 'marie@example.com', phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'customer', status: 'active', joinedAt: '2024-03-15', lastActive: '2025-01-15 14:30',
    ordersCount: 45, totalSpent: 1280, rating: 4.8, address: '12 Rue de la Paix', city: 'Paris',
    isColePass: true,
  },
  {
    id: 'USR-002', name: 'Jean Martin', email: 'jean@example.com', phone: '+33 6 23 45 67 89',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'customer', status: 'active', joinedAt: '2024-04-20', lastActive: '2025-01-14 10:15',
    ordersCount: 23, totalSpent: 650, rating: 4.5, address: '25 Avenue des Champs-Élysées', city: 'Paris',
    isColePass: false,
  },
  {
    id: 'USR-003', name: 'Sophie Lefebvre', email: 'sophie@restaurant.fr', phone: '+33 1 42 00 00 01',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'restaurant', status: 'active', joinedAt: '2024-02-01', lastActive: '2025-01-15 08:00',
    ordersCount: 1200, totalSpent: 0, rating: 4.7, city: 'Paris', isColePass: false,
  },
  {
    id: 'USR-004', name: 'Pierre Moreau', email: 'pierre@delivery.fr', phone: '+33 6 34 56 78 90',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    role: 'delivery', status: 'active', joinedAt: '2024-05-10', lastActive: '2025-01-15 13:45',
    ordersCount: 340, totalSpent: 0, rating: 4.9, city: 'Paris', isColePass: false,
  },
  {
    id: 'USR-005', name: 'Admin Principal', email: 'admin@coledash.fr', phone: '+33 1 42 00 00 99',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: 'admin', status: 'active', joinedAt: '2024-01-01', lastActive: '2025-01-15 15:00',
    ordersCount: 0, totalSpent: 0, city: 'Paris', isColePass: false,
  },
  {
    id: 'USR-006', name: 'Alice Bernard', email: 'alice@example.com', phone: '+33 6 45 67 89 01',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    role: 'customer', status: 'banned', joinedAt: '2024-06-01', lastActive: '2024-12-20 09:00',
    ordersCount: 5, totalSpent: 120, address: '8 Rue Montorgueil', city: 'Paris', isColePass: false,
  },
];

// ─── Status Config ───────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  active: { label: 'Actif', color: '#00C853', bg: '#E8F5E9', icon: CheckCircle2 },
  inactive: { label: 'Inactif', color: '#A6A6A6', bg: '#F0EEEA', icon: XCircle },
  banned: { label: 'Banni', color: '#FF3008', bg: '#FFF0ED', icon: Ban },
  pending: { label: 'En attente', color: '#FFB300', bg: '#FFF8E1', icon: Clock },
};

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  customer: { label: 'Client', color: '#2962FF', icon: Users },
  restaurant: { label: 'Restaurant', color: '#FF3008', icon: UtensilsCrossed },
  delivery: { label: 'Livreur', color: '#00C853', icon: Bike },
  admin: { label: 'Admin', color: '#FFB300', icon: Shield },
};

// ─── Components ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium`} style={{ backgroundColor: c.bg, color: c.color }}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const c = roleConfig[role] || roleConfig.customer;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: c.color + '15', color: c.color }}>
      <c.icon size={12} /> {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const colePassUsers = users.filter((u) => u.isColePass).length;
  const newUsersThisMonth = 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Utilisateurs</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez les comptes utilisateurs</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2">
          <Plus size={16} /> Ajouter un utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total utilisateurs', value: totalUsers.toString(), icon: Users, color: '#2962FF' },
          { label: 'Actifs', value: activeUsers.toString(), icon: CheckCircle2, color: '#00C853' },
          { label: 'ColePass', value: colePassUsers.toString(), icon: Star, color: '#FFB300' },
          { label: 'Nouveaux (ce mois)', value: `+${newUsersThisMonth}`, icon: TrendingUp, color: '#FF3008' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6A6A6]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
        >
          <option value="all">Tous les rôles</option>
          {Object.entries(roleConfig).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
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
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const isExpanded = expandedUser === user.id;
          return (
            <div key={user.id} className="bg-white rounded-2xl border border-[#F0EEEA]">
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#F9F9FB] transition-colors"
                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-[#1A1A1A]">{user.name}</h4>
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                    {user.isColePass && (
                      <span className="px-1.5 py-0.5 rounded bg-[#FFF8E1] text-[#FFB300] text-[10px] font-medium">ColePass</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#A6A6A6]">
                    <span className="flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                    <span className="flex items-center gap-1"><Phone size={10} /> {user.phone}</span>
                    {user.city && <span className="flex items-center gap-1"><MapPin size={10} /> {user.city}</span>}
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  {user.role === 'customer' && (
                    <>
                      <p className="text-sm font-bold text-[#1A1A1A]">€{user.totalSpent.toLocaleString()}</p>
                      <p className="text-[10px] text-[#A6A6A6]">{user.ordersCount} commandes</p>
                    </>
                  )}
                  {user.role === 'restaurant' && (
                    <>
                      <p className="text-sm font-bold text-[#1A1A1A]">{user.ordersCount} commandes</p>
                      <p className="text-[10px] text-[#A6A6A6]">Note: {user.rating}</p>
                    </>
                  )}
                  {user.role === 'delivery' && (
                    <>
                      <p className="text-sm font-bold text-[#1A1A1A]">{user.ordersCount} livraisons</p>
                      <p className="text-[10px] text-[#A6A6A6]">Note: {user.rating}</p>
                    </>
                  )}
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
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                        {/* Contact */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Contact</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><Mail size={14} className="text-[#FF3008]" /> {user.email}</p>
                            <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Phone size={14} className="text-[#A6A6A6]" /> {user.phone}</p>
                            {user.address && <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><MapPin size={14} className="text-[#A6A6A6]" /> {user.address}, {user.city}</p>}
                          </div>
                        </div>

                        {/* Account */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Compte</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">ID:</span> {user.id}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Inscrit le:</span> {user.joinedAt}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Dernière activité:</span> {user.lastActive}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">ColePass:</span> {user.isColePass ? 'Oui' : 'Non'}</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Statistiques</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {user.role === 'customer' && (
                              <>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">{user.ordersCount}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Commandes</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">€{user.totalSpent}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Dépensé</p>
                                </div>
                              </>
                            )}
                            {user.role === 'restaurant' && (
                              <>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">{user.ordersCount}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Commandes</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">{user.rating}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Note</p>
                                </div>
                              </>
                            )}
                            {user.role === 'delivery' && (
                              <>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">{user.ordersCount}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Livraisons</p>
                                </div>
                                <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                                  <p className="text-lg font-bold text-[#1A1A1A]">{user.rating}</p>
                                  <p className="text-[10px] text-[#A6A6A6]">Note</p>
                                </div>
                              </>
                            )}
                            <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                              <p className="text-lg font-bold text-[#1A1A1A]">{user.status === 'active' ? 'Oui' : 'Non'}</p>
                              <p className="text-[10px] text-[#A6A6A6]">Actif</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-[#F0EEEA]">
                        <button className="flex-1 h-9 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors flex items-center justify-center gap-1">
                          <Eye size={12} /> Voir profil
                        </button>
                        <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                          <Edit3 size={12} /> Modifier
                        </button>
                        <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                          <MailOpen size={12} /> Envoyer email
                        </button>
                        {user.status === 'banned' ? (
                          <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#00C853] hover:bg-[#E8F5E9] transition-colors flex items-center justify-center gap-1">
                            <Unlock size={12} /> Débannir
                          </button>
                        ) : (
                          <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#FF3008] hover:bg-[#FFF0ED] transition-colors flex items-center justify-center gap-1">
                            <Ban size={12} /> Bannir
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-10">
          <AlertTriangle size={32} className="text-[#A6A6A6] mx-auto mb-2" />
          <p className="text-sm text-[#A6A6A6]">Aucun utilisateur trouvé</p>
        </div>
      )}
    </div>
  );
}
