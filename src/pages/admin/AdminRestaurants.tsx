import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Search, Plus, Filter, ChevronDown, ChevronRight, Star,
  MapPin, Phone, Mail, Globe, Clock, CheckCircle2, XCircle,
  AlertTriangle, TrendingUp, TrendingDown, Eye, Edit3, Trash2,
  MoreHorizontal, UtensilsCrossed, Bike, DollarSign, Calendar,
  BarChart3, BadgeCheck, ThumbsUp, ThumbsDown, Image as ImageIcon,
  Upload, X
} from 'lucide-react';
import SafeImage from '@/components/SafeImage';

// ─── Types ───────────────────────────────────────────────────────────
interface Restaurant {
  id: string; name: string; email: string; phone: string; website?: string;
  address: string; city: string; postalCode: string; cuisine: string;
  rating: number; reviewCount: number; status: 'active' | 'inactive' | 'pending' | 'suspended';
  commission: number; deliveryTime: string; minOrder: number; deliveryFee: number;
  isOpen: boolean; joinedAt: string; image: string; ordersCount: number;
  revenue: number; badges?: string[];
}

// ─── Mock Data ───────────────────────────────────────────────────────
const restaurants: Restaurant[] = [
  {
    id: 'RES-001', name: 'Le Petit Bistro', email: 'contact@petitbistro.fr', phone: '+33 1 42 00 00 01', website: 'https://petitbistro.fr',
    address: '12 Rue de la Paix', city: 'Paris', postalCode: '75002', cuisine: 'Française',
    rating: 4.7, reviewCount: 1240, status: 'active', commission: 15, deliveryTime: '25-35 min',
    minOrder: 15, deliveryFee: 2.99, isOpen: true, joinedAt: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    ordersCount: 3420, revenue: 124500, badges: ['Coup de cœur', 'Éco-responsable'],
  },
  {
    id: 'RES-002', name: 'Sushi Master', email: 'sushi@master.fr', phone: '+33 1 42 00 00 02',
    address: '25 Rue Saint-Honoré', city: 'Paris', postalCode: '75001', cuisine: 'Japonaise',
    rating: 4.5, reviewCount: 890, status: 'active', commission: 15, deliveryTime: '30-40 min',
    minOrder: 20, deliveryFee: 2.99, isOpen: true, joinedAt: '2024-04-20',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&h=200&fit=crop',
    ordersCount: 2180, revenue: 98700, badges: ['Coup de cœur'],
  },
  {
    id: 'RES-003', name: 'Burger House', email: 'burger@house.fr', phone: '+33 1 42 00 00 03',
    address: '8 Avenue des Champs-Élysées', city: 'Paris', postalCode: '75008', cuisine: 'Américaine',
    rating: 4.2, reviewCount: 650, status: 'active', commission: 15, deliveryTime: '20-30 min',
    minOrder: 12, deliveryFee: 1.99, isOpen: true, joinedAt: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    ordersCount: 1850, revenue: 86500, badges: [],
  },
  {
    id: 'RES-004', name: 'Pizza Roma', email: 'pizza@roma.fr', phone: '+33 1 42 00 00 04',
    address: '15 Rue de Rivoli', city: 'Paris', postalCode: '75001', cuisine: 'Italienne',
    rating: 4.6, reviewCount: 1100, status: 'active', commission: 12, deliveryTime: '25-35 min',
    minOrder: 15, deliveryFee: 0, isOpen: true, joinedAt: '2024-02-01',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&h=200&fit=crop',
    ordersCount: 2900, revenue: 72300, badges: ['Livraison offerte'],
  },
  {
    id: 'RES-005', name: 'Taco Fiesta', email: 'taco@fiesta.fr', phone: '+33 1 42 00 00 05',
    address: '33 Boulevard Saint-Germain', city: 'Paris', postalCode: '75005', cuisine: 'Mexicaine',
    rating: 4.3, reviewCount: 420, status: 'pending', commission: 15, deliveryTime: '20-30 min',
    minOrder: 10, deliveryFee: 2.99, isOpen: false, joinedAt: '2025-01-10',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
    ordersCount: 0, revenue: 0, badges: ['Nouveau'],
  },
  {
    id: 'RES-006', name: 'Crêperie Bretonne', email: 'crepes@bretonne.fr', phone: '+33 1 42 00 00 06',
    address: '5 Rue Montorgueil', city: 'Paris', postalCode: '75001', cuisine: 'Française',
    rating: 4.4, reviewCount: 780, status: 'inactive', commission: 15, deliveryTime: '15-25 min',
    minOrder: 10, deliveryFee: 1.99, isOpen: false, joinedAt: '2024-06-01',
    image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=200&h=200&fit=crop',
    ordersCount: 1200, revenue: 45000, badges: [],
  },
];

// ─── Status Config ───────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  active: { label: 'Actif', color: '#00C853', bg: '#E8F5E9', icon: CheckCircle2 },
  inactive: { label: 'Inactif', color: '#A6A6A6', bg: '#F0EEEA', icon: XCircle },
  pending: { label: 'En attente', color: '#FFB300', bg: '#FFF8E1', icon: Clock },
  suspended: { label: 'Suspendu', color: '#FF3008', bg: '#FFF0ED', icon: AlertTriangle },
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

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminRestaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [expandedRestaurant, setExpandedRestaurant] = useState<string | null>(null);
  const [showNewRestaurant, setShowNewRestaurant] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (cuisineFilter !== 'all' && r.cuisine !== cuisineFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery, statusFilter, cuisineFilter]);

  const cuisines = useMemo(() => ['all', ...Array.from(new Set(restaurants.map((r) => r.cuisine)))], []);

  const totalRevenue = restaurants.filter((r) => r.status === 'active').reduce((s, r) => s + r.revenue, 0);
  const totalOrders = restaurants.filter((r) => r.status === 'active').reduce((s, r) => s + r.ordersCount, 0);
  const avgRating = (restaurants.filter((r) => r.status === 'active').reduce((s, r) => s + r.rating, 0) / restaurants.filter((r) => r.status === 'active').length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Restaurants</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez les restaurants partenaires</p>
        </div>
        <button
          onClick={() => setShowNewRestaurant(true)}
          className="h-10 px-4 rounded-xl bg-[#FF3008] text-white text-sm font-medium hover:bg-[#E62B07] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter un restaurant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Restaurants actifs', value: restaurants.filter((r) => r.status === 'active').length.toString(), icon: Store, color: '#00C853' },
          { label: 'Commandes', value: totalOrders.toLocaleString(), icon: UtensilsCrossed, color: '#FF3008' },
          { label: 'Revenus', value: `€${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: '#2962FF' },
          { label: 'Note moyenne', value: avgRating, icon: Star, color: '#FFB300' },
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
            placeholder="Rechercher un restaurant..."
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
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm focus:outline-none focus:border-[#FF3008]"
        >
          {cuisines.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'Toutes cuisines' : c}</option>
          ))}
        </select>
      </div>

      {/* Restaurants List */}
      <div className="space-y-3">
        {filteredRestaurants.map((restaurant) => {
          const isExpanded = expandedRestaurant === restaurant.id;
          return (
            <div key={restaurant.id} className="bg-white rounded-2xl border border-[#F0EEEA]">
              <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#F9F9FB] transition-colors"
                onClick={() => setExpandedRestaurant(isExpanded ? null : restaurant.id)}
              >
                <SafeImage
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-[#1A1A1A]">{restaurant.name}</h4>
                    <StatusBadge status={restaurant.status} />
                    {restaurant.isOpen ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#E8F5E9] text-[#00C853] text-[10px] font-medium">Ouvert</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-[#F0EEEA] text-[#A6A6A6] text-[10px] font-medium">Fermé</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#A6A6A6]">
                    <span className="flex items-center gap-1"><UtensilsCrossed size={10} /> {restaurant.cuisine}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {restaurant.city}</span>
                    <span className="flex items-center gap-1"><Star size={10} fill="#FFB300" className="text-[#FFB300]" /> {restaurant.rating} ({restaurant.reviewCount})</span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#1A1A1A]">€{restaurant.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-[#A6A6A6]">{restaurant.ordersCount} commandes</p>
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
                        {/* Info */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Coordonnées</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><MapPin size={14} className="text-[#FF3008]" /> {restaurant.address}, {restaurant.postalCode} {restaurant.city}</p>
                            <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Phone size={14} className="text-[#A6A6A6]" /> {restaurant.phone}</p>
                            <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Mail size={14} className="text-[#A6A6A6]" /> {restaurant.email}</p>
                            {restaurant.website && <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Globe size={14} className="text-[#A6A6A6]" /> {restaurant.website}</p>}
                          </div>
                          {restaurant.badges && restaurant.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {restaurant.badges.map((badge) => (
                                <span key={badge} className="px-2 py-0.5 rounded-lg bg-[#FFF0ED] text-[#FF3008] text-[10px] font-medium">{badge}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Config */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Configuration</h4>
                          <div className="space-y-1">
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Commission:</span> {restaurant.commission}%</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Délai livraison:</span> {restaurant.deliveryTime}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Commande min.:</span> €{restaurant.minOrder}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Frais livraison:</span> {restaurant.deliveryFee === 0 ? 'Gratuit' : `€${restaurant.deliveryFee}`}</p>
                            <p className="text-sm text-[#1A1A1A]"><span className="text-[#6B6B6B]">Inscrit le:</span> {restaurant.joinedAt}</p>
                          </div>
                        </div>

                        {/* Performance */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider">Performance</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                              <p className="text-lg font-bold text-[#1A1A1A]">{restaurant.ordersCount}</p>
                              <p className="text-[10px] text-[#A6A6A6]">Commandes</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                              <p className="text-lg font-bold text-[#1A1A1A]">€{(restaurant.revenue / 1000).toFixed(0)}k</p>
                              <p className="text-[10px] text-[#A6A6A6]">Revenus</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                              <p className="text-lg font-bold text-[#1A1A1A]">{restaurant.rating}</p>
                              <p className="text-[10px] text-[#A6A6A6]">Note</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#F9F9FB] text-center">
                              <p className="text-lg font-bold text-[#1A1A1A]">{restaurant.reviewCount}</p>
                              <p className="text-[10px] text-[#A6A6A6]">Avis</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-[#F0EEEA]">
                        <button className="flex-1 h-9 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors flex items-center justify-center gap-1">
                          <Eye size={12} /> Voir détails
                        </button>
                        <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                          <Edit3 size={12} /> Modifier
                        </button>
                        <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center justify-center gap-1">
                          <BarChart3 size={12} /> Stats
                        </button>
                        {restaurant.status === 'active' ? (
                          <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#FF3008] hover:bg-[#FFF0ED] transition-colors flex items-center justify-center gap-1">
                            <XCircle size={12} /> Désactiver
                          </button>
                        ) : (
                          <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#00C853] hover:bg-[#E8F5E9] transition-colors flex items-center justify-center gap-1">
                            <CheckCircle2 size={12} /> Activer
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

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-10">
          <AlertTriangle size={32} className="text-[#A6A6A6] mx-auto mb-2" />
          <p className="text-sm text-[#A6A6A6]">Aucun restaurant trouvé</p>
        </div>
      )}
    </div>
  );
}
