import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, Star, Clock, Package, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Revenus du jour', value: '€12,450', change: '+12%', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Commandes', value: '234', change: '+8%', icon: ShoppingBag, color: 'bg-rose-50 text-rose-600' },
  { label: 'Nouveaux clients', value: '45', change: '+23%', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { label: 'Note moyenne', value: '4.7', change: '+0.2', icon: Star, color: 'bg-amber-50 text-amber-600' },
];

const chartData = [
  { name: 'Lun', orders: 180, revenue: 9800 },
  { name: 'Mar', orders: 220, revenue: 11200 },
  { name: 'Mer', orders: 190, revenue: 10500 },
  { name: 'Jeu', orders: 250, revenue: 13400 },
  { name: 'Ven', orders: 310, revenue: 16800 },
  { name: 'Sam', orders: 340, revenue: 18200 },
  { name: 'Dim', orders: 280, revenue: 15600 },
];

const recentOrders = [
  { id: '#1234', customer: 'Marie L.', restaurant: 'Le Petit Bistrot', total: 45.50, status: 'delivered', time: '5 min' },
  { id: '#1233', customer: 'Jean D.', restaurant: 'Sakura Sushi', total: 32.00, status: 'preparing', time: '12 min' },
  { id: '#1232', customer: 'Sophie M.', restaurant: 'Pizza Napoli', total: 28.50, status: 'delivering', time: '18 min' },
  { id: '#1231', customer: 'Pierre R.', restaurant: 'Tacos Boulevard', total: 19.00, status: 'delivered', time: '32 min' },
];

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Tableau de bord</h1>
        <p className="text-stone-500">Vue d'ensemble de l'activité</p>
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
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
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
        <h2 className="font-semibold text-stone-800 mb-4">Commandes et revenus (7 jours)</h2>
        <ResponsiveContainer width="100%" height={300}>
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
                  order.status === 'delivered' ? 'bg-emerald-500' :
                  order.status === 'delivering' ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
                <div>
                  <p className="font-medium text-stone-800">{order.id} — {order.customer}</p>
                  <p className="text-sm text-stone-500">{order.restaurant}</p>
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
