import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Filter, ChevronDown, ChevronRight, Clock,
  CheckCircle2, XCircle, Truck, MapPin, User, Phone, Mail,
  DollarSign, Calendar, MoreHorizontal, Eye, Printer, Download,
  ArrowUpDown, AlertTriangle, RefreshCw, UtensilsCrossed, Bike,
  Navigation, MessageSquare, Star, ThumbsUp, ThumbsDown
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────
interface OrderItem { name: string; quantity: number; price: number; options?: string[]; }
interface Order {
  id: string; customer: string; email: string; phone: string;
  restaurant: string; items: OrderItem[]; total: number; deliveryFee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  address: string; city: string; postalCode: string;
  instructions?: string; createdAt: string; deliveredAt?: string;
  driver?: string; driverPhone?: string; rating?: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────
const orders: Order[] = [
  {
    id: 'ORD-2025-001', customer: 'Marie Dupont', email: 'marie@email.com', phone: '+33 6 12 34 56 78',
    restaurant: 'Le Petit Bistro', items: [
      { name: 'Steak frites', quantity: 1, price: 24.90, options: ['Saignant'] },
      { name: 'Tarte Tatin', quantity: 1, price: 9.90 },
    ], total: 34.80, deliveryFee: 2.99, status: 'delivered', paymentStatus: 'paid',
    address: '15 Rue de Rivoli', city: 'Paris', postalCode: '75001', instructions: 'Sonner à l\'interphone',
    createdAt: '2025-01-15 12:30', deliveredAt: '2025-01-15 13:05', driver: 'Ahmed K.', driverPhone: '+33 6 98 76 54 32', rating: 5,
  },
  {
    id: 'ORD-2025-002', customer: 'Jean Martin', email: 'jean@email.com', phone: '+33 6 23 45 67 89',
    restaurant: 'Sushi Master', items: [
      { name: 'Menu Sushi Deluxe', quantity: 2, price: 24.90 },
      { name: 'Miso Soup', quantity: 2, price: 4.50 },
    ], total: 58.80, deliveryFee: 2.99, status: 'out_for_delivery', paymentStatus: 'paid',
    address: '42 Avenue des Champs-Élysées', city: 'Paris', postalCode: '75008',
    createdAt: '2025-01-15 12:45', driver: 'Sophie L.', driverPhone: '+33 6 87 65 43 21',
  },
  {
    id: 'ORD-2025-003', customer: 'Pierre Bernard', email: 'pierre@email.com', phone: '+33 6 34 56 78 90',
    restaurant: 'Burger House', items: [
      { name: 'Burger Signature', quantity: 1, price: 18.50, options: ['Pain brioche', 'Extra cheese'] },
      { name: 'Frites', quantity: 1, price: 4.50 },
      { name: 'Milkshake', quantity: 1, price: 6.00 },
    ], total: 29.00, deliveryFee: 2.99, status: 'preparing', paymentStatus: 'paid',
    address: '8 Rue de la Paix', city: 'Paris', postalCode: '75002',
    createdAt: '2025-01-15 13:00',
  },
  {
    id: 'ORD-2025-004', customer: 'Sophie Leroy', email: 'sophie@email.com', phone: '+33 6 45 67 89 01',
    restaurant: 'Pizza Roma', items: [
      { name: 'Pizza Margherita', quantity: 1, price: 13.90, options: ['Large'] },
      { name: 'Coca-Cola', quantity: 2, price: 3.50 },
    ], total: 20.90, deliveryFee: 0, status: 'confirmed', paymentStatus: 'paid',
    address: '25 Boulevard Haussmann', city: 'Paris', postalCode: '75009',
    createdAt: '2025-01-15 13:15', instructions: 'Livraison au bureau, étage 3',
  },
  {
    id: 'ORD-2025-005', customer: 'Lucas Petit', email: 'lucas@email.com', phone: '+33 6 56 78 90 12',
    restaurant: 'Taco Fiesta', items: [
      { name: 'Tacos Trio', quantity: 3, price: 12.90 },
      { name: 'Nachos', quantity: 1, price: 7.50 },
    ], total: 46.20, deliveryFee: 2.99, status: 'pending', paymentStatus: 'pending',
    address: '33 Rue de Rivoli', city: 'Paris', postalCode: '75001',
    createdAt: '2025-01-15 13:30',
  },
  {
    id: 'ORD-2025-006', customer: 'Emma Garcia', email: 'emma@email.com', phone: '+33 6 67 89 01 23',
    restaurant: 'Le Petit Bistro', items: [
      { name: 'Salade César', quantity: 1, price: 14.90 },
      { name: 'Quiche Lorraine', quantity: 1, price: 12.50 },
    ], total: 27.40, deliveryFee: 2.99, status: 'cancelled', paymentStatus: 'refunded',
    address: '5 Place de la Concorde', city: 'Paris', postalCode: '75008',
    createdAt: '2025-01-15 11:00', instructions: 'Annulé par le client',
  },
];

// ─── Status Config ───────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'En attente', color: '#FFB300', bg: '#FFF8E1', icon: Clock },
  confirmed: { label: 'Confirmée', color: '#2962FF', bg: '#E3F2FD', icon: CheckCircle2 },
  preparing: { label: 'En préparation', color: '#FF3008', bg: '#FFF0ED', icon: UtensilsCrossed },
  ready: { label: 'Prête', color: '#00C853', bg: '#E8F5E9', icon: Package },
  out_for_delivery: { label: 'En livraison', color: '#FF6B35', bg: '#FFF0ED', icon: Bike },
  delivered: { label: 'Livrée', color: '#00C853', bg: '#E8F5E9', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: '#FF3008', bg: '#FFF0ED', icon: XCircle },
};

const paymentStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Payé', color: '#00C853', bg: '#E8F5E9' },
  pending: { label: 'En attente', color: '#FFB300', bg: '#FFF8E1' },
  refunded: { label: 'Remboursé', color: '#FF3008', bg: '#FFF0ED' },
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

function PaymentBadge({ status }: { status: string }) {
  const c = paymentStatusConfig[status] || paymentStatusConfig.pending;
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium`} style={{ backgroundColor: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.restaurant.toLowerCase().includes(q);
      }
      return true;
    });
    result.sort((a, b) => {
      const field = sortBy === 'date' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : a.total - b.total;
      return sortOrder === 'asc' ? field : -field;
    });
    return result;
  }, [searchQuery, statusFilter, sortBy, sortOrder]);

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    revenue: orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0),
  }), []);

  const toggleOrder = (id: string) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Commandes</h1>
          <p className="text-sm text-[#A6A6A6]">Gérez et suivez toutes les commandes</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2">
            <Download size={16} /> Exporter
          </button>
          <button className="h-10 px-4 rounded-xl border border-[#E8E8E8] text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2">
            <Printer size={16} /> Imprimer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, color: '#1A1A1A', icon: Package },
          { label: 'En attente', value: stats.pending, color: '#FFB300', icon: Clock },
          { label: 'En prépa', value: stats.preparing, color: '#FF3008', icon: UtensilsCrossed },
          { label: 'Livrées', value: stats.delivered, color: '#00C853', icon: CheckCircle2 },
          { label: 'Annulées', value: stats.cancelled, color: '#FF3008', icon: XCircle },
          { label: 'Revenus', value: `€${stats.revenue.toFixed(2)}`, color: '#2962FF', icon: DollarSign },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#F0EEEA] p-4 text-center">
            <s.icon size={18} style={{ color: s.color }} className="mx-auto mb-1" />
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#A6A6A6]">{s.label}</p>
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
            placeholder="Rechercher par ID, client ou restaurant..."
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
        <button
          onClick={() => { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
          className="h-10 px-3 rounded-xl border border-[#E8E8E8] bg-white text-sm font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors flex items-center gap-2"
        >
          <ArrowUpDown size={14} /> {sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien'}
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF0ED]">
          <span className="text-sm text-[#FF3008] font-medium">{selectedOrders.size} commande(s) sélectionnée(s)</span>
          <div className="flex-1"></div>
          <button className="h-8 px-3 rounded-lg bg-white text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">Marquer comme prête</button>
          <button className="h-8 px-3 rounded-lg bg-white text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">Assigner livreur</button>
          <button className="h-8 px-3 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors">Annuler</button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const isSelected = selectedOrders.has(order.id);
          return (
            <div key={order.id} className={`bg-white rounded-2xl border transition-colors ${isSelected ? 'border-[#FF3008]' : 'border-[#F0EEEA]'}`}>
              {/* Order Header */}
              <div
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-[#F9F9FB] transition-colors"
                onClick={() => toggleOrder(order.id)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => { e.stopPropagation(); toggleSelect(order.id); }}
                  className="rounded border-[#E8E8E8] text-[#FF3008] focus:ring-[#FF3008]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-mono font-medium text-[#1A1A1A]">{order.id}</span>
                    <StatusBadge status={order.status} />
                    <PaymentBadge status={order.paymentStatus} />
                    {order.rating && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-[#FFB300]">
                        <Star size={10} fill="#FFB300" /> {order.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#A6A6A6]">
                    <span className="flex items-center gap-1"><Calendar size={10} /> {order.createdAt}</span>
                    <span className="flex items-center gap-1"><User size={10} /> {order.customer}</span>
                    <span className="flex items-center gap-1"><UtensilsCrossed size={10} /> {order.restaurant}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A1A1A]">€{order.total.toFixed(2)}</p>
                  <p className="text-[10px] text-[#A6A6A6]">{order.items.length} article(s)</p>
                </div>
                <button className="w-8 h-8 rounded-lg hover:bg-[#F0EEEA] flex items-center justify-center text-[#A6A6A6]">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>

              {/* Expanded Details */}
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
                        {/* Items */}
                        <div>
                          <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider mb-2">Articles</h4>
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#F9F9FB]">
                                <div>
                                  <p className="text-sm text-[#1A1A1A]">{item.quantity}x {item.name}</p>
                                  {item.options && item.options.length > 0 && (
                                    <p className="text-[10px] text-[#A6A6A6]">{item.options.join(', ')}</p>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-[#1A1A1A]">€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0EEEA]">
                            <span className="text-xs text-[#A6A6A6]">Livraison</span>
                            <span className="text-xs text-[#6B6B6B]">{order.deliveryFee === 0 ? 'Gratuite' : `€${order.deliveryFee.toFixed(2)}`}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold text-[#1A1A1A]">Total</span>
                            <span className="text-sm font-bold text-[#FF3008]">€{order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Customer & Delivery */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider mb-2">Client</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><User size={14} className="text-[#FF3008]" /> {order.customer}</p>
                              <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Mail size={14} className="text-[#A6A6A6]" /> {order.email}</p>
                              <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Phone size={14} className="text-[#A6A6A6]" /> {order.phone}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider mb-2">Livraison</h4>
                            <div className="space-y-1">
                              <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><MapPin size={14} className="text-[#FF3008]" /> {order.address}, {order.postalCode} {order.city}</p>
                              {order.instructions && <p className="text-xs text-[#A6A6A6] flex items-center gap-2"><MessageSquare size={12} /> {order.instructions}</p>}
                            </div>
                          </div>
                          {order.driver && (
                            <div>
                              <h4 className="text-xs font-medium text-[#A6A6A6] uppercase tracking-wider mb-2">Livreur</h4>
                              <div className="space-y-1">
                                <p className="text-sm text-[#1A1A1A] flex items-center gap-2"><Bike size={14} className="text-[#FF3008]" /> {order.driver}</p>
                                <p className="text-sm text-[#6B6B6B] flex items-center gap-2"><Phone size={14} className="text-[#A6A6A6]" /> {order.driverPhone}</p>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            {order.status === 'pending' && (
                              <>
                                <button className="flex-1 h-9 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors">Confirmer</button>
                                <button className="flex-1 h-9 rounded-lg border border-[#E8E8E8] text-xs font-medium text-[#6B6B6B] hover:bg-[#F9F9FB] transition-colors">Annuler</button>
                              </>
                            )}
                            {order.status === 'confirmed' && (
                              <button className="flex-1 h-9 rounded-lg bg-[#FF3008] text-white text-xs font-medium hover:bg-[#E62B07] transition-colors">Marquer en préparation</button>
                            )}
                            {order.status === 'preparing' && (
                              <button className="flex-1 h-9 rounded-lg bg-[#00C853] text-white text-xs font-medium hover:bg-[#00A844] transition-colors">Prête pour livraison</button>
                            )}
                            {order.status === 'ready' && (
                              <button className="flex-1 h-9 rounded-lg bg-[#2962FF] text-white text-xs font-medium hover:bg-[#1E50CC] transition-colors">Assigner livreur</button>
                            )}
                            {order.status === 'out_for_delivery' && (
                              <button className="flex-1 h-9 rounded-lg bg-[#00C853] text-white text-xs font-medium hover:bg-[#00A844] transition-colors">Marquer livrée</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-10">
          <AlertTriangle size={32} className="text-[#A6A6A6] mx-auto mb-2" />
          <p className="text-sm text-[#A6A6A6]">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  );
}
