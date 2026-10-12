import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Phone,
  Package,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bike,
  DollarSign,
  Star,
  ArrowLeft,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type DeliveryStatus = 'heading' | 'arrived_pickup' | 'picked_up' | 'en_route' | 'arrived_dropoff' | 'delivered';

interface Delivery {
  id: string;
  status: DeliveryStatus;
  merchantName: string;
  merchantAddress: string;
  merchantPhone: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerNote?: string;
  distanceKm: number;
  estimatedMin: number;
  earnings: number;
  tip: number;
  items: string[];
  isEco: boolean;
}

/* ─────────────────────── mock data ─────────────────────── */

const mockDeliveries: Delivery[] = [
  {
    id: '#CD-D128',
    status: 'picked_up',
    merchantName: 'Le Petit Bistrot',
    merchantAddress: '24 Rue des Martyrs, 75009 Paris',
    merchantPhone: '01 42 78 34 56',
    customerName: 'Marie L.',
    customerAddress: '15 Rue de la Paix, 75009 Paris',
    customerPhone: '06 12 34 56 78',
    customerNote: 'Sonnette 3B',
    distanceKm: 1.2,
    estimatedMin: 8,
    earnings: 6.50,
    tip: 2.00,
    items: ['1× Burger Classic', '1× Frites Maison', '2× Coca-Cola'],
    isEco: true,
  },
  {
    id: '#CD-D129',
    status: 'heading',
    merchantName: 'Sushi Zen',
    merchantAddress: '8 Avenue de l\'Opéra, 75001 Paris',
    merchantPhone: '01 44 55 66 77',
    customerName: 'Pierre D.',
    customerAddress: '3 Rue du Faubourg Saint-Honoré, 75008 Paris',
    customerPhone: '06 98 76 54 32',
    distanceKm: 2.5,
    estimatedMin: 15,
    earnings: 7.80,
    tip: 0,
    items: ['2× Menu Maki', '1× Soupe Miso', '1× Gyoza'],
    isEco: false,
  },
  {
    id: '#CD-D130',
    status: 'en_route',
    merchantName: 'Burger House',
    merchantAddress: '12 Rue de Belleville, 75020 Paris',
    merchantPhone: '01 53 44 22 11',
    customerName: 'Sophie B.',
    customerAddress: '22 Rue des Martyrs, 75009 Paris',
    customerPhone: '06 55 44 33 22',
    distanceKm: 3.1,
    estimatedMin: 18,
    earnings: 8.20,
    tip: 1.50,
    items: ['1× Double Smash', '1× Frites Cheddar', '1× Milkshake'],
    isEco: true,
  },
  {
    id: '#CD-D127',
    status: 'delivered',
    merchantName: 'Pizza Napoli',
    merchantAddress: '45 Boulevard Haussmann, 75009 Paris',
    merchantPhone: '01 42 33 44 55',
    customerName: 'Jean M.',
    customerAddress: '10 Rue de Rivoli, 75004 Paris',
    customerPhone: '06 11 22 33 44',
    distanceKm: 2.8,
    estimatedMin: 20,
    earnings: 6.00,
    tip: 3.00,
    items: ['1× Pizza Margherita', '1× Tiramisu'],
    isEco: false,
  },
  {
    id: '#CD-D126',
    status: 'delivered',
    merchantName: 'Tacos City',
    merchantAddress: '18 Rue Montorgueil, 75001 Paris',
    customerPhone: '01 40 20 30 40',
    customerName: 'Claire R.',
    customerAddress: '5 Boulevard Haussmann, 75009 Paris',
    customerPhone: '06 77 88 99 00',
    distanceKm: 1.5,
    estimatedMin: 10,
    earnings: 5.50,
    tip: 1.00,
    items: ['3× Tacos Al Pastor', '1× Nachos'],
    isEco: false,
  },
];

const statusMeta: Record<DeliveryStatus, { label: string; color: string }> = {
  heading: { label: 'En route vers le restaurant', color: 'text-cd-info' },
  arrived_pickup: { label: 'Arrivé au restaurant', color: 'text-cd-warning' },
  picked_up: { label: 'Commande récupérée', color: 'text-cd-primary' },
  en_route: { label: 'En livraison', color: 'text-cd-primary' },
  arrived_dropoff: { label: 'Arrivé chez le client', color: 'text-cd-warning' },
  delivered: { label: 'Livrée', color: 'text-cd-success' },
};

const statusSteps: DeliveryStatus[] = ['heading', 'arrived_pickup', 'picked_up', 'en_route', 'arrived_dropoff', 'delivered'];

/* ─────────────────────── sub-components ─────────────────────── */

function StatusBadge({ status }: { status: DeliveryStatus }) {
  const meta = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${meta.color} bg-current/5`}>
      <Bike size={12} />
      {meta.label}
    </span>
  );
}

function ProgressStepper({ current }: { current: DeliveryStatus }) {
  const currentIdx = statusSteps.indexOf(current);
  const labels = ['Départ', 'Arrivée resto', 'Récupération', 'En route', 'Arrivée client', 'Livrée'];
  return (
    <div className="flex items-center justify-between py-4">
      {statusSteps.map((step, i) => {
        const done = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done
                  ? isCurrent
                    ? 'bg-cd-primary text-white ring-4 ring-cd-primary/20'
                    : 'bg-cd-success text-white'
                  : 'bg-cd-border text-cd-text-tertiary'
              }`}
            >
              {done && !isCurrent ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${done ? 'text-cd-text-primary' : 'text-cd-text-tertiary'}`}>
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DeliveryCard({
  delivery,
  onSelect,
}: {
  delivery: Delivery;
  onSelect: () => void;
}) {
  const isActive = delivery.status !== 'delivered';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
        isActive ? 'border-l-cd-primary' : 'border-l-cd-success'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-cd-text-primary">{delivery.id}</span>
            <StatusBadge status={delivery.status} />
          </div>
          <div className="flex items-center gap-3">
            {delivery.isEco && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-cd-success-light text-cd-success text-[10px] font-bold rounded-full">
                <Star size={10} className="fill-cd-success" />
                ÉCO
              </span>
            )}
            <span className="text-sm font-semibold text-cd-success">
              {(delivery.earnings + delivery.tip).toFixed(2)} €
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Restaurant</p>
            <p className="text-sm font-semibold text-cd-text-primary">{delivery.merchantName}</p>
            <p className="text-xs text-cd-text-secondary flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {delivery.merchantAddress}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider mb-1">Client</p>
            <p className="text-sm font-semibold text-cd-text-primary">{delivery.customerName}</p>
            <p className="text-xs text-cd-text-secondary flex items-center gap-1 mt-0.5">
              <MapPin size={11} />
              {delivery.customerAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <span className="flex items-center gap-1 text-xs text-cd-text-secondary">
            <Navigation size={12} />
            {delivery.distanceKm} km
          </span>
          <span className="flex items-center gap-1 text-xs text-cd-text-secondary">
            <Clock size={12} />
            ~{delivery.estimatedMin} min
          </span>
          <span className="flex items-center gap-1 text-xs text-cd-text-secondary">
            <Package size={12} />
            {delivery.items.length} article{delivery.items.length > 1 ? 's' : ''}
          </span>
        </div>

        <button
          onClick={onSelect}
          className="w-full py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-lg hover:bg-cd-primary-hover transition-colors flex items-center justify-center gap-2"
        >
          {isActive ? 'Gérer la livraison' : 'Voir les détails'}
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── detail view ─────────────────────── */

function DeliveryDetail({
  delivery,
  onBack,
  onStatusChange,
}: {
  delivery: Delivery;
  onBack: () => void;
  onStatusChange: (s: DeliveryStatus) => void;
}) {
  const isDelivered = delivery.status === 'delivered';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg bg-white border border-cd-border flex items-center justify-center hover:bg-cd-bg-warm transition-colors"
        >
          <ArrowLeft size={18} className="text-cd-text-secondary" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-mp-text">{delivery.id}</h2>
          <StatusBadge status={delivery.status} />
        </div>
      </div>

      {/* Stepper */}
      {!isDelivered && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <ProgressStepper current={delivery.status} />
        </div>
      )}

      {/* Earnings */}
      <div className="bg-gradient-to-r from-[#FFF0ED] to-white rounded-xl p-5 shadow-sm border border-[#FFD5CC]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">Gains</p>
            <p className="text-[32px] font-extrabold text-cd-success leading-tight">
              {(delivery.earnings + delivery.tip).toFixed(2)} €
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-cd-text-secondary">Livraison: <strong className="text-cd-text-primary">{delivery.earnings.toFixed(2)} €</strong></p>
            <p className="text-sm text-cd-text-secondary">Pourboire: <strong className="text-cd-text-primary">{delivery.tip.toFixed(2)} €</strong></p>
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-semibold text-mp-text">Itinéraire</h3>

        {/* Merchant */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-cd-primary/10 flex items-center justify-center">
              <MapPin size={14} className="text-cd-primary" />
            </div>
            <div className="w-0.5 flex-1 bg-cd-border my-1" />
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-semibold text-cd-text-primary">{delivery.merchantName}</p>
            <p className="text-xs text-cd-text-secondary">{delivery.merchantAddress}</p>
            <a href={`tel:${delivery.merchantPhone}`} className="inline-flex items-center gap-1 text-xs text-cd-primary mt-1 hover:underline">
              <Phone size={11} />
              {delivery.merchantPhone}
            </a>
          </div>
        </div>

        {/* Customer */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-cd-success/10 flex items-center justify-center">
              <CheckCircle2 size={14} className="text-cd-success" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-cd-text-primary">{delivery.customerName}</p>
            <p className="text-xs text-cd-text-secondary">{delivery.customerAddress}</p>
            <a href={`tel:${delivery.customerPhone}`} className="inline-flex items-center gap-1 text-xs text-cd-primary mt-1 hover:underline">
              <Phone size={11} />
              {delivery.customerPhone}
            </a>
            {delivery.customerNote && (
              <div className="mt-2 flex items-center gap-1.5 px-3 py-2 bg-cd-warning-light rounded-lg">
                <MessageSquare size={12} className="text-cd-warning" />
                <span className="text-xs text-cd-text-primary font-medium">{delivery.customerNote}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-mp-text mb-3">Articles ({delivery.items.length})</h3>
        <div className="space-y-2">
          {delivery.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-cd-text-primary">
              <Package size={14} className="text-cd-text-tertiary" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {!isDelivered && (
        <div className="space-y-3">
          {delivery.status === 'heading' && (
            <button
              onClick={() => onStatusChange('arrived_pickup')}
              className="w-full py-3.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors"
            >
              Je suis arrivé au restaurant
            </button>
          )}
          {delivery.status === 'arrived_pickup' && (
            <button
              onClick={() => onStatusChange('picked_up')}
              className="w-full py-3.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors"
            >
              J'ai récupéré la commande
            </button>
          )}
          {delivery.status === 'picked_up' && (
            <button
              onClick={() => onStatusChange('en_route')}
              className="w-full py-3.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors"
            >
              Je suis en route vers le client
            </button>
          )}
          {delivery.status === 'en_route' && (
            <button
              onClick={() => onStatusChange('arrived_dropoff')}
              className="w-full py-3.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors"
            >
              Je suis arrivé chez le client
            </button>
          )}
          {delivery.status === 'arrived_dropoff' && (
            <button
              onClick={() => onStatusChange('delivered')}
              className="w-full py-3.5 bg-cd-success text-white text-sm font-semibold rounded-xl hover:bg-[#00b34a] transition-colors"
            >
              Commande livrée
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full py-3 border border-cd-border text-cd-text-secondary text-sm font-medium rounded-xl hover:bg-cd-bg-warm transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      )}

      {isDelivered && (
        <div className="bg-cd-success-light rounded-xl p-5 text-center">
          <CheckCircle2 size={40} className="mx-auto text-cd-success mb-2" />
          <p className="text-sm font-semibold text-cd-success">Livraison terminée avec succès !</p>
          <p className="text-xs text-cd-text-secondary mt-1">
            Merci pour votre service. Les gains ont été ajoutés à votre solde.
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function DriverDelivery() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeDeliveries = deliveries.filter((d) => d.status !== 'delivered');
  const completedDeliveries = deliveries.filter((d) => d.status === 'delivered');

  const selected = deliveries.find((d) => d.id === selectedId);

  const updateStatus = (id: string, newStatus: DeliveryStatus) => {
    setDeliveries((prev) => prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)));
    if (newStatus === 'delivered') {
      setSelectedId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[800px] mx-auto space-y-5"
    >
      {!selected ? (
        <>
          {/* Active */}
          <div>
            <h2 className="text-lg font-bold text-mp-text mb-3 flex items-center gap-2">
              <Bike size={20} className="text-cd-primary" />
              Livraisons en cours ({activeDeliveries.length})
            </h2>
            <div className="space-y-3">
              <AnimatePresence>
                {activeDeliveries.map((d) => (
                  <DeliveryCard
                    key={d.id}
                    delivery={d}
                    onSelect={() => setSelectedId(d.id)}
                  />
                ))}
              </AnimatePresence>
              {activeDeliveries.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <AlertTriangle size={40} className="mx-auto text-cd-text-tertiary mb-3" />
                  <p className="text-sm font-medium text-cd-text-secondary">Aucune livraison active</p>
                  <p className="text-xs text-cd-text-tertiary mt-1">Les nouvelles commandes apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed */}
          {completedDeliveries.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-mp-text mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-cd-success" />
                Livrées aujourd'hui ({completedDeliveries.length})
              </h2>
              <div className="space-y-3">
                {completedDeliveries.map((d) => (
                  <DeliveryCard
                    key={d.id}
                    delivery={d}
                    onSelect={() => setSelectedId(d.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <DeliveryDetail
          delivery={selected}
          onBack={() => setSelectedId(null)}
          onStatusChange={(s) => updateStatus(selected.id, s)}
        />
      )}
    </motion.div>
  );
}
