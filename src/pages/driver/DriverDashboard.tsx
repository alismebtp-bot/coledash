import { motion } from 'framer-motion';
import { DollarSign, Clock, Star, MapPin, TrendingUp, Package } from 'lucide-react';

const stats = [
  { label: 'Gains aujourd\'hui', value: '€87.50', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Courses', value: '12', icon: Package, color: 'bg-rose-50 text-rose-600' },
  { label: 'Note', value: '4.9', icon: Star, color: 'bg-amber-50 text-amber-600' },
  { label: 'Temps en ligne', value: '4h30', icon: Clock, color: 'bg-blue-50 text-blue-600' },
];

const activeDeliveries = [
  { id: 'D1234', restaurant: 'Le Petit Bistrot', customer: 'Marie L.', address: '12 Rue de la Paix', status: 'pickup', eta: '5 min' },
  { id: 'D1233', restaurant: 'Sakura Sushi', customer: 'Jean D.', address: '45 Avenue Victor Hugo', status: 'delivery', eta: '8 min' },
];

export default function DriverDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Espace Livreur</h1>
        <p className="text-stone-500">Bienvenue, Thomas</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-stone-100 p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Deliveries */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Livraisons en cours</h2>
        <div className="space-y-3">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 bg-stone-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    delivery.status === 'pickup' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{delivery.restaurant}</p>
                    <p className="text-sm text-stone-500">{delivery.customer}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-stone-600">{delivery.eta}</span>
              </div>
              <p className="text-sm text-stone-500 ml-13">{delivery.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
