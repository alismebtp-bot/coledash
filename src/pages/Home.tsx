import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, UtensilsCrossed, ShoppingBag, Flower2, ArrowRight, Star, Clock, TrendingUp } from 'lucide-react';
import { useCity } from '../context/CityContext';
import { cityRestaurants } from '../data/cityRestaurants';
import { useState } from 'react';

export default function Home() {
  const { currentCity } = useCity();
  const [searchQuery, setSearchQuery] = useState('');
  const restaurants = cityRestaurants[currentCity.id] || cityRestaurants['paris'];

  const categories = [
    { id: 'restaurants', name: 'Restaurants', icon: UtensilsCrossed, color: 'bg-rose-50 text-rose-600', path: '/browse' },
    { id: 'grocery', name: 'Épicerie', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', path: '/grocery' },
    { id: 'flowers', name: 'Fleurs', icon: Flower2, color: 'bg-pink-50 text-pink-600', path: '/flowers' },
    { id: 'retail', name: 'Commerce', icon: TrendingUp, color: 'bg-amber-50 text-amber-600', path: '/retail' },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-rose-400" />
              <span className="text-sm text-stone-300">{currentCity.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Livraison de repas à domicile
            </h1>
            <p className="text-lg text-stone-300 mb-8">
              Découvrez les meilleurs restaurants, épiceries et fleuristes près de chez vous.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un restaurant, un plat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={cat.path}
                className="block bg-white rounded-xl border border-stone-100 p-6 hover:shadow-lg transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-semibold text-stone-800">{cat.name}</h3>
                <p className="text-sm text-stone-500 mt-1">Explorer</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Restaurants populaires</h2>
          <Link to="/browse" className="text-rose-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.slice(0, 4).map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link to={`/restaurant/${restaurant.id}`} className="block group">
                <div className="bg-white rounded-xl border border-stone-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-stone-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {restaurant.promotion && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                        {restaurant.promotion}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-stone-800">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-medium">{restaurant.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-stone-500 mb-2">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {restaurant.deliveryTime}
                      </span>
                      <span>{restaurant.priceRange}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
