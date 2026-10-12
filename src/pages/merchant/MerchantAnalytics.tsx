import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

type Period = '7d' | '30d' | '90d' | '1y';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  accent: string;
}

/* ─────────────────────── mock data ─────────────────────── */

const mockData: Record<Period, {
  revenue: number;
  orders: number;
  customers: number;
  rating: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  ratingChange: number;
  dailyRevenue: number[];
  categorySales: { name: string; value: number; color: string }[];
  topItems: { name: string; orders: number; revenue: number }[];
  peakHours: { hour: string; orders: number }[];
}> = {
  '7d': {
    revenue: 2840,
    orders: 156,
    customers: 89,
    rating: 4.7,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: 15.2,
    ratingChange: 0.1,
    dailyRevenue: [320, 410, 380, 450, 520, 380, 380],
    categorySales: [
      { name: 'Plats', value: 45, color: '#FF3008' },
      { name: 'Entrées', value: 20, color: '#FFB300' },
      { name: 'Desserts', value: 15, color: '#00C853' },
      { name: 'Boissons', value: 20, color: '#2196F3' },
    ],
    topItems: [
      { name: 'Burger Classic', orders: 42, revenue: 546 },
      { name: 'Frites Maison', orders: 38, revenue: 266 },
      { name: 'Coca-Cola', orders: 35, revenue: 122 },
    ],
    peakHours: [
      { hour: '11h', orders: 12 },
      { hour: '12h', orders: 28 },
      { hour: '13h', orders: 35 },
      { hour: '14h', orders: 18 },
      { hour: '18h', orders: 15 },
      { hour: '19h', orders: 32 },
      { hour: '20h', orders: 38 },
      { hour: '21h', orders: 20 },
    ],
  },
  '30d': {
    revenue: 12450,
    orders: 680,
    customers: 410,
    rating: 4.6,
    revenueChange: 18.2,
    ordersChange: 14.5,
    customersChange: 22.1,
    ratingChange: 0.2,
    dailyRevenue: [380, 420, 390, 450, 520, 610, 580, 400, 430, 470, 510, 490, 550, 600, 580, 420, 460, 500, 540, 520, 580, 620, 590, 440, 480, 510, 550, 530, 590, 610],
    categorySales: [
      { name: 'Plats', value: 48, color: '#FF3008' },
      { name: 'Entrées', value: 18, color: '#FFB300' },
      { name: 'Desserts', value: 14, color: '#00C853' },
      { name: 'Boissons', value: 20, color: '#2196F3' },
    ],
    topItems: [
      { name: 'Burger Classic', orders: 180, revenue: 2340 },
      { name: 'Frites Maison', orders: 165, revenue: 1155 },
      { name: 'Coca-Cola', orders: 150, revenue: 525 },
    ],
    peakHours: [
      { hour: '11h', orders: 55 },
      { hour: '12h', orders: 120 },
      { hour: '13h', orders: 145 },
      { hour: '14h', orders: 80 },
      { hour: '18h', orders: 65 },
      { hour: '19h', orders: 135 },
      { hour: '20h', orders: 160 },
      { hour: '21h', orders: 90 },
    ],
  },
  '90d': {
    revenue: 38900,
    orders: 2100,
    customers: 1280,
    rating: 4.5,
    revenueChange: 25.0,
    ordersChange: 20.1,
    customersChange: 30.5,
    ratingChange: 0.3,
    dailyRevenue: Array(90).fill(0).map(() => 300 + Math.random() * 400),
    categorySales: [
      { name: 'Plats', value: 50, color: '#FF3008' },
      { name: 'Entrées', value: 17, color: '#FFB300' },
      { name: 'Desserts', value: 13, color: '#00C853' },
      { name: 'Boissons', value: 20, color: '#2196F3' },
    ],
    topItems: [
      { name: 'Burger Classic', orders: 580, revenue: 7540 },
      { name: 'Frites Maison', orders: 520, revenue: 3640 },
      { name: 'Coca-Cola', orders: 480, revenue: 1680 },
    ],
    peakHours: [
      { hour: '11h', orders: 170 },
      { hour: '12h', orders: 380 },
      { hour: '13h', orders: 450 },
      { hour: '14h', orders: 250 },
      { hour: '18h', orders: 200 },
      { hour: '19h', orders: 420 },
      { hour: '20h', orders: 500 },
      { hour: '21h', orders: 280 },
    ],
  },
  '1y': {
    revenue: 156000,
    orders: 8500,
    customers: 5200,
    rating: 4.4,
    revenueChange: 35.0,
    ordersChange: 28.5,
    customersChange: 40.2,
    ratingChange: 0.4,
    dailyRevenue: Array(365).fill(0).map(() => 300 + Math.random() * 500),
    categorySales: [
      { name: 'Plats', value: 52, color: '#FF3008' },
      { name: 'Entrées', value: 16, color: '#FFB300' },
      { name: 'Desserts', value: 12, color: '#00C853' },
      { name: 'Boissons', value: 20, color: '#2196F3' },
    ],
    topItems: [
      { name: 'Burger Classic', orders: 2400, revenue: 31200 },
      { name: 'Frites Maison', orders: 2100, revenue: 14700 },
      { name: 'Coca-Cola', orders: 1900, revenue: 6650 },
    ],
    peakHours: [
      { hour: '11h', orders: 700 },
      { hour: '12h', orders: 1550 },
      { hour: '13h', orders: 1850 },
      { hour: '14h', orders: 1000 },
      { hour: '18h', orders: 800 },
      { hour: '19h', orders: 1700 },
      { hour: '20h', orders: 2050 },
      { hour: '21h', orders: 1150 },
    ],
  },
};

/* ─────────────────────── sub-components ─────────────────────── */

function MetricCard({ title, value, change, changeLabel, icon: Icon, accent }: MetricCardProps) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${accent}15` }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-cd-success' : 'text-cd-error'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-[11px] font-medium text-cd-text-tertiary uppercase tracking-wider">{title}</p>
      <p className="text-[28px] font-extrabold text-mp-text leading-tight mt-1">{value}</p>
      <p className="text-xs text-cd-text-tertiary mt-1">{changeLabel}</p>
    </motion.div>
  );
}

function MiniBarChart({ data, max }: { data: number[]; max: number }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.slice(-14).map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-cd-primary rounded-t transition-all hover:bg-cd-primary-hover"
          style={{ height: `${(v / max) * 100}%`, opacity: 0.6 + (i / data.length) * 0.4 }}
        />
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((d, i) => {
            const start = cumulative;
            cumulative += d.value;
            const end = cumulative;
            const startAngle = (start / total) * 360;
            const endAngle = (end / total) * 360;
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-cd-text-secondary">{d.name}</span>
            <span className="text-sm font-bold text-cd-text-primary">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HourlyBarChart({ data }: { data: { hour: string; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.orders));
  return (
    <div className="flex items-end gap-2 h-32 px-2">
      {data.map((d) => (
        <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-cd-primary rounded-t transition-all hover:bg-cd-primary-hover"
            style={{ height: `${(d.orders / max) * 100}%` }}
          />
          <span className="text-[10px] text-cd-text-tertiary">{d.hour}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantAnalytics() {
  const [period, setPeriod] = useState<Period>('7d');
  const data = mockData[period];

  const periodLabels: Record<Period, string> = {
    '7d': '7 jours',
    '30d': '30 jours',
    '90d': '3 mois',
    '1y': '1 an',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-mp-text">Analytics</h1>
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-cd-primary text-white'
                  : 'text-cd-text-secondary hover:bg-cd-bg-warm'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Chiffre d'affaires"
          value={`${data.revenue.toLocaleString()} €`}
          change={data.revenueChange}
          changeLabel={`vs période précédente`}
          icon={DollarSign}
          accent="#FF3008"
        />
        <MetricCard
          title="Commandes"
          value={data.orders.toLocaleString()}
          change={data.ordersChange}
          changeLabel={`vs période précédente`}
          icon={ShoppingBag}
          accent="#00C853"
        />
        <MetricCard
          title="Clients"
          value={data.customers.toLocaleString()}
          change={data.customersChange}
          changeLabel={`vs période précédente`}
          icon={Users}
          accent="#2196F3"
        />
        <MetricCard
          title="Note moyenne"
          value={data.rating.toFixed(1)}
          change={data.ratingChange}
          changeLabel={`vs période précédente`}
          icon={Star}
          accent="#FFB300"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mp-text">Évolution du CA</h3>
            <BarChart3 size={16} className="text-cd-text-tertiary" />
          </div>
          <MiniBarChart data={data.dailyRevenue} max={Math.max(...data.dailyRevenue) * 1.1} />
          <div className="flex justify-between text-[10px] text-cd-text-tertiary mt-2">
            <span>Il y a 14j</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mp-text">Ventes par catégorie</h3>
            <PieChart size={16} className="text-cd-text-tertiary" />
          </div>
          <DonutChart data={data.categorySales} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top Items */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mp-text">Top articles</h3>
            <TrendingUp size={16} className="text-cd-success" />
          </div>
          <div className="space-y-3">
            {data.topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-cd-bg-warm flex items-center justify-center text-xs font-bold text-cd-text-primary">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-cd-text-primary">{item.name}</p>
                  <p className="text-xs text-cd-text-tertiary">{item.orders} commandes</p>
                </div>
                <span className="text-sm font-bold text-cd-text-primary">{item.revenue} €</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-mp-text">Heures de pointe</h3>
            <Activity size={16} className="text-cd-primary" />
          </div>
          <HourlyBarChart data={data.peakHours} />
        </div>
      </div>
    </motion.div>
  );
}
