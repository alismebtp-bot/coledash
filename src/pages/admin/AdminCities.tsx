import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, TrendingUp, Users } from 'lucide-react';

interface City {
  id: string;
  name: string;
  country: string;
  restaurants: number;
  orders: number;
  active: boolean;
}

const mockCities: City[] = [
  { id: 'paris', name: 'Paris', country: 'France', restaurants: 1240, orders: 85600, active: true },
  { id: 'london', name: 'London', country: 'UK', restaurants: 980, orders: 72300, active: true },
  { id: 'berlin', name: 'Berlin', country: 'Germany', restaurants: 750, orders: 54200, active: true },
  { id: 'madrid', name: 'Madrid', country: 'Spain', restaurants: 620, orders: 43100, active: true },
  { id: 'rome', name: 'Rome', country: 'Italy', restaurants: 580, orders: 38900, active: false },
];

export default function AdminCities() {
  const [cities] = useState<City[]>(mockCities);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Gestion des Villes</h1>
          <p className="text-stone-500">Gérez les villes où ColeDash est présent</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#e11d48] text-white rounded-lg font-medium hover:bg-[#be123c] transition-colors">
          <Plus size={18} />
          Ajouter une ville
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city, i) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-stone-100 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <MapPin size={20} className="text-[#e11d48]" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800">{city.name}</h3>
                  <p className="text-sm text-stone-500">{city.country}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-stone-400 hover:text-stone-600">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 text-stone-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-xs">Restaurants</span>
                </div>
                <p className="text-lg font-bold text-stone-800">{city.restaurants}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Users size={14} />
                  <span className="text-xs">Commandes</span>
                </div>
                <p className="text-lg font-bold text-stone-800">{city.orders.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${city.active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              <span className={`text-xs ${city.active ? 'text-emerald-600' : 'text-stone-400'}`}>
                {city.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
