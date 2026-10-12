import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, Star, Clock, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Revenus aujourd\'hui', value: '€1,240', change: '+15%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Commandes', value: '48', change: '+8%', icon: ShoppingBag, color: 'bg-rose-50 text-rose-600' },
  { label: 'Note moyenne', value: '4.7', change: '+0.1', icon: Star, color: 'bg-amber-50 text-amber-600' },
  { label: 'Temps moyen', value: '22min', change: '-2min', icon: Clock, color: 'bg-blue-50 text-blue-600' },
];

const chartData = [
  { name: '8h', orders: 12 },
  { name: '10h', orders: 18 },
  { name: '12h', orders: 35 },
  { name: '14h', orders: 28 },
  { name: '16h', orders: 15 },
  { name: '18h', orders: 22 },
  { name: '20h', orders: 30 },
  { name: '22h', orders: 20 },
];

const recentOrders = [
  { id: '#4567', customer: 'Marie L.', items: 3, total: 45.50, status: 'new', time: '2 min' },
  { id: '#4566', customer: 'Jean D.', items: 2, total: 32.00, status: 'preparing', time: '8 min' },
  { id: '#4565', customer: 'Sophie M.', items: 4, total: 58.50, status: 'ready', time: '15 min' },
];

export default function MerchantDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Tableau de bord</h1>
        <p className="text-stone-500">Vue d'ensemble de votre restaurant</p>
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
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Commandes par heure</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis dataKey="name" stroke="#78716c" fontSize={12} />
            <YAxis stroke="#78716c" fontSize={12} />
            <Tooltip />
            <Bar dataKey="orders" fill="#e11d48" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-stone-100 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Commandes récentes</h2>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  order.status === 'new' ? 'bg-red-500' :
                  order.status === 'preparing' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <p className="font-medium text-stone-800">{order.id} — {order.customer}</p>
                  <p className="text-sm text-stone-500">{order.items} articles</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-stone-800">{order.total.toFixed(2)} €</p>
                <p className="text-xs text-stone-400">{order.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
