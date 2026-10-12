import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bike,
  MapPin,
  Phone,
  Printer,
  ChevronDown,
  Filter,
  Search,
  ArrowUpRight,
  Package,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type OrderStatus = 'new' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  estimatedReady: string;
  note?: string;
  paymentMethod: string;
  isEcoDelivery: boolean;
}

/* ─────────────────────── mock data ─────────────────────── */

const statusMeta: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  new: { label: 'Nouvelle', color: 'text-cd-primary', bg: 'bg-cd-primary-light', icon: ShoppingBag },
  preparing: { label: 'En préparation', color: 'text-cd-warning', bg: 'bg-cd-warning-light', icon: ChefHat },
  ready: { label: 'Prête', color: 'text-cd-info', bg: 'bg-cd-info-light', icon: Package },
  picked_up: { label: 'Récupérée', color: 'text-cd-info', bg: 'bg-cd-info-light', icon: Bike },
  delivered: { label: 'Livrée', color: 'text-cd-success', bg: 'bg-cd-success-light', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: 'text-cd-error', bg: 'bg-cd-error-light', icon: XCircle },
};

const mockOrders: Order[] = [
  {
    id: '#CD-2841',
    status: 'new',
    customerName: 'Marie L.',
    customerPhone: '06 12 34 56 78',
    customerAddress: '15 Rue de la Paix, 75009 Paris',
    items: [
      { name: 'Burger Classic', quantity: 1, price: 13.50, options: ['Sans oignon'] },
      { name: 'Frites Maison', quantity: 1, price: 4.50 },
      { name: 'Coca-Cola', quantity: 2, price: 3.50 },
    ],
    subtotal: 25.00,
    deliveryFee: 2.50,
    total: 27.50,
    createdAt: '12:34',
    estimatedReady: '12:54',
    note: 'Sonnette 3B',
    paymentMethod: 'Carte',
    isEcoDelivery: true,
  },
  {
    id: '#CD-2840',
    status: 'preparing',
    customerName: 'Pierre D.',
    customerPhone: '06 98 76 54 32',
    customerAddress: '3 Rue du Faubourg Saint-Honoré, 75008 Paris',
    items: [
      { name: 'Double Smash', quantity: 1, price: 17.00 },
      { name: 'Onion Rings', quantity: 1, price: 5.50 },
      { name: 'Milkshake Vanille', quantity: 1, price: 6.50 },
    ],
    subtotal: 29.00,
    deliveryFee: 2.50,
    total: 31.50,
    createdAt: '12:25',
    estimatedReady: '12:45',
    paymentMethod: 'Carte',
    isEcoDelivery: false,
  },
  {
    id: '#CD-2839',
    status: 'ready',
    customerName: 'Sophie B.',
    customerPhone: '06 55 44 33 22',
    customerAddress: '22 Rue des Martyrs, 75009 Paris',
    items: [
      { name: 'Veggie Burger', quantity: 1, price: 14.00 },
      { name: 'Frites Maison', quantity: 1, price: 4.50 },
    ],
    subtotal: 18.50,
    deliveryFee: 0,
    total: 18.50,
    createdAt: '12:10',
    estimatedReady: '12:30',
    paymentMethod: 'Espèces',
    isEcoDelivery: true,
  },
  {
    id: '#CD-2838',
    status: 'delivered',
    customerName: 'Jean M.',
    customerPhone: '06 11 22 33 44',
    customerAddress: '10 Rue de Rivoli, 75004 Paris',
    items: [
      { name: 'Bacon BBQ', quantity: 1, price: 15.50 },
      { name: 'Frites Maison', quantity: 2, price: 4.50 },
      { name: 'Limonade Maison', quantity: 1, price: 4.50 },
    ],
    subtotal: 29.00,
    deliveryFee: 2.50,
    total: 31.50,
    createdAt: '11:45',
    estimatedReady: '12:05',
    paymentMethod: 'Carte',
    isEcoDelivery: false,
  },
  {
    id: '#CD-2837',
    status: 'cancelled',
    customerName: 'Claire R.',
    customerPhone: '06 77 88 99 00',
    customerAddress: '5 Boulevard Haussmann, 75009 Paris',
    items: [
      { name: 'Burger Classic', quantity: 2, price: 13.50 },
    ],
    subtotal: 27.00,
    deliveryFee: 2.50,
    total: 29.50,
    createdAt: '11:30',
    estimatedReady: '11:50',
    paymentMethod: 'Carte',
    isEcoDelivery: false,
  },
];

/* ─────────────────────── sub-components ─────────────────────── */

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${meta.color} ${meta.bg}`}>
      <Icon size={12} />
      {meta.label}
    </span>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = statusMeta[order.status];

  const nextStatus: Record<OrderStatus, OrderStatus | null> = {
    new: 'preparing',
    preparing: 'ready',
    ready: 'picked_up',
    picked_up: 'delivered',
    delivered: null,
    cancelled: null,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-cd-bg-warm transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-full bg-cd-bg-warm flex items-center justify-center shrink-0">
          <ShoppingBag size={18} className="text-cd-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-cd-text-primary">{order.id}</span>
            <StatusBadge status={order.status} />
            {order.isEcoDelivery && (
              <span className="px-1.5 py-0.5 bg-cd-success-light text-cd-success text-[9px] font-bold rounded-full">
                ÉCO
              </span>
            )}
          </div>
          <p className="text-xs text-cd-text-tertiary mt-0.5">
            {order.customerName} · {order.createdAt} · {order.items.length} article{order.items.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-cd-text-primary">{order.total.toFixed(2)} €</p>
          <p className="text-xs text-cd-text-tertiary">{order.paymentMethod}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-cd-text-tertiary transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Items */}
              <div className="bg-cd-bg-warm rounded-lg p-3 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cd-text-primary">
                        {item.quantity}× {item.name}
                      </p>
                      {item.options && (
                        <p className="text-xs text-cd-text-tertiary">{item.options.join(', ')}</p>
                      )}
                    </div>
                    <span className="text-sm text-cd-text-secondary">{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
                <div className="border-t border-cd-border pt-2 space-y-1">
                  <div className="flex justify-between text-xs text-cd-text-secondary">
                    <span>Sous-total</span>
                    <span>{order.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-xs text-cd-text-secondary">
                    <span>Livraison</span>
                    <span>{order.deliveryFee === 0 ? 'Gratuit' : `${order.deliveryFee.toFixed(2)} €`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-cd-text-primary">
                    <span>Total</span>
                    <span>{order.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-cd-text-tertiary" />
                  <span className="text-cd-text-secondary">{order.customerAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-cd-text-tertiary" />
                  <a href={`tel:${order.customerPhone}`} className="text-cd-primary hover:underline">
                    {order.customerPhone}
                  </a>
                </div>
              </div>

              {order.note && (
                <div className="flex items-center gap-2 px-3 py-2 bg-cd-warning-light rounded-lg">
                  <Package size={14} className="text-cd-warning" />
                  <span className="text-xs text-cd-text-primary font-medium">{order.note}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {/* print */}}
                  className="px-4 py-2 border border-cd-border text-cd-text-secondary text-xs font-medium rounded-lg hover:bg-cd-bg-warm transition-colors flex items-center gap-1.5"
                >
                  <Printer size={13} />
                  Imprimer
                </button>
                {nextStatus[order.status] && (
                  <button
                    onClick={() => onStatusChange(nextStatus[order.status]!)}
                    className="flex-1 py-2 bg-cd-primary text-white text-xs font-semibold rounded-lg hover:bg-cd-primary-hover transition-colors"
                  >
                    {order.status === 'new' && 'Accepter & préparer'}
                    {order.status === 'preparing' && 'Marquer comme prête'}
                    {order.status === 'ready' && 'Récupérée par le livreur'}
                    {order.status === 'picked_up' && 'Marquer comme livrée'}
                  </button>
                )}
                {order.status === 'new' && (
                  <button
                    onClick={() => onStatusChange('cancelled')}
                    className="px-4 py-2 border border-cd-error text-cd-error text-xs font-medium rounded-lg hover:bg-cd-error-light transition-colors"
                  >
                    Refuser
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.items.some((i) => i.name.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const counts = {
    all: orders.length,
    new: orders.filter((o) => o.status === 'new').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
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
        <h1 className="text-[28px] font-bold text-mp-text">Commandes</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 border border-cd-border rounded-lg text-sm text-cd-text-primary focus:outline-none focus:border-cd-primary"
            />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        {([
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'new', label: 'Nouvelles', count: counts.new },
          { key: 'preparing', label: 'En cours', count: counts.preparing },
          { key: 'ready', label: 'Prêtes', count: counts.ready },
          { key: 'delivered', label: 'Livrées', count: counts.delivered },
          { key: 'cancelled', label: 'Annulées', count: counts.cancelled },
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
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={(status) => updateStatus(order.id, status)}
            />
          ))}
        </AnimatePresence>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag size={40} className="mx-auto text-cd-text-tertiary mb-3" />
            <p className="text-sm text-cd-text-secondary">Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
