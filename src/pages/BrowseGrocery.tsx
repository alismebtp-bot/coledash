import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, ShoppingCart, Heart, Eye,
  ChevronDown, Star, ArrowLeft, X, Check, Leaf, Truck,
  Package, TrendingUp, Tag
} from 'lucide-react';
import { products, groceryCategories, getProductsByCategory, searchProducts } from '@/data/product-catalog';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { SafeImage } from '@/components/SafeImage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';

/* ── types ─────────────────────────────────────────────────────── */
interface FilterState {
  search: string;
  category: string;
  subcategory: string | null;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  onlyAvailable: boolean;
  onlySale: boolean;
  onlyOrganic: boolean;
  onlyLocal: boolean;
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'bestseller', label: 'Populaires' },
];

/* ── helpers ───────────────────────────────────────────────────── */
const toEuro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

export default function BrowseGrocery() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();

  /* filter state */
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    subcategory: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'featured',
    onlyAvailable: false,
    onlySale: false,
    onlyOrganic: false,
    onlyLocal: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  /* favs */
  const [favs, setFavs] = useState<Set<string>>(new Set());

  /* quick filter */
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  /* ── derived data ─────────────────────────────────────────────── */
  const subcategories = useMemo(() => {
    if (filters.category === 'all') return [];
    // @ts-ignore
    const subs = (await import('@/data/product-catalog')).subcategories;
    return subs[filters.category] || [];
  }, [filters.category]);

  const filtered = useMemo(() => {
    let list = filters.search ? searchProducts(filters.search) : getProductsByCategory(filters.category);

    /* subcategory */
    if (filters.subcategory) {
      list = list.filter((p) => p.subcategory === filters.subcategory);
    }

    /* price */
    list = list.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    /* toggles */
    if (filters.onlyAvailable) list = list.filter((p) => p.inStock);
    if (filters.onlySale) list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
    if (filters.onlyOrganic) list = list.filter((p) => p.isOrganic);
    if (filters.onlyLocal) list = list.filter((p) => p.isLocal);

    /* quick filter */
    if (quickFilter === 'bestseller') list = list.filter((p) => p.isBestseller);
    if (quickFilter === 'new') list = list.filter((p) => p.isNew);
    if (quickFilter === 'promo') list = list.filter((p) => p.originalPrice && p.originalPrice > p.price);

    /* sort */
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'bestseller':
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [filters, quickFilter]);

  /* ── actions ──────────────────────────────────────────────────── */
  const toggleFav = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAddToCart = useCallback(
    (product: typeof products[number]) => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        storeId: 'grocery-default',
        category: 'grocery',
      });
      toast({ title: 'Ajouté au panier', description: product.name });
    },
    [addItem, toast]
  );

  /* ── render ───────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative bg-[#16a34a] pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Retour
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-3">
              <Package size={32} className="text-white" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Épicerie en Ligne</h1>
            </div>
            <p className="text-white/80 text-lg max-w-xl">
              Des produits frais et de qualité livrés chez vous en moins d'une heure
            </p>
          </motion.div>

          {/* Quick filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {[
              { key: 'bestseller', label: 'Populaires', icon: TrendingUp },
              { key: 'promo', label: 'Promotions', icon: Tag },
              { key: 'new', label: 'Nouveautés', icon: Package },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setQuickFilter(quickFilter === key ? null : key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  quickFilter === key
                    ? 'bg-white text-[#16a34a]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
            {quickFilter && (
              <button
                onClick={() => setQuickFilter(null)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 flex items-center gap-1"
              >
                <X size={14} /> Effacer
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Sidebar filters ─────────────────────────────────── */}
          <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-800 flex items-center gap-2">
                  <SlidersHorizontal size={18} /> Filtres
                </h3>
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      category: 'all',
                      subcategory: null,
                      minPrice: 0,
                      maxPrice: 1000,
                      sortBy: 'featured',
                      onlyAvailable: false,
                      onlySale: false,
                      onlyOrganic: false,
                      onlyLocal: false,
                    })
                  }
                  className="text-xs text-[#16a34a] hover:underline"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">Recherche</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">Catégorie</label>
                <div className="space-y-1.5">
                  {groceryCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters((f) => ({ ...f, category: cat.id, subcategory: null }))}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.category === cat.id
                          ? 'bg-[#16a34a]/10 text-[#16a34a] font-medium'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-medium text-stone-500 mb-2 block">
                  Prix : {toEuro(filters.minPrice)} - {toEuro(filters.maxPrice)}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                {[
                  { key: 'onlyAvailable', label: 'En stock uniquement' },
                  { key: 'onlySale', label: 'En promotion' },
                  { key: 'onlyOrganic', label: 'Bio uniquement', icon: Leaf },
                  { key: 'onlyLocal', label: 'Produits locaux' },
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`w-10 h-5 rounded-full transition-colors relative ${
                        // @ts-ignore
                        filters[key] ? 'bg-[#16a34a]' : 'bg-stone-300'
                      }`}
                      onClick={() => setFilters((f) => ({ ...f, [key]: !f[key as keyof FilterState] }))}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          // @ts-ignore
                          filters[key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <span className="text-sm text-stone-600 flex items-center gap-1.5">
                      {Icon && <Icon size={14} className="text-stone-400" />}
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product grid ────────────────────────────────────── */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-sm text-stone-500">
                {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50"
                >
                  <SlidersHorizontal size={16} /> Filtres
                </button>

                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
                    className="appearance-none bg-white border border-stone-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonLoader key={i} type="card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Package size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-lg font-semibold text-stone-600 mb-2">Aucun produit trouvé</h3>
                <p className="text-stone-400">Essayez d'autres filtres ou termes de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          containerClassName="w-full h-full"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          placeholderSize={24}
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-[#16a34a] text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Nouveau
                            </span>
                          )}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Promo
                            </span>
                          )}
                          {product.isOrganic && (
                            <span className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Bio
                            </span>
                          )}
                          {product.isLocal && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                              Local
                            </span>
                          )}
                        </div>

                        {/* Fav */}
                        <button
                          onClick={() => toggleFav(product.id)}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Heart
                            size={16}
                            className={favs.has(product.id) ? 'fill-[#e11d48] text-[#e11d48]' : 'text-stone-600'}
                          />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">{product.brand}</p>
                            <h3 className="font-semibold text-stone-800 line-clamp-1">{product.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium text-stone-700">{product.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-400 mb-2 line-clamp-2">{product.description}</p>

                        {product.weight && (
                          <p className="text-xs text-stone-400 mb-2">{product.weight}</p>
                        )}

                        {/* Price */}
                        <div className="flex items-end gap-2 mb-3">
                          <span className="text-lg font-bold text-stone-800">{toEuro(product.price)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-stone-400 line-through">{toEuro(product.originalPrice)}</span>
                          )}
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="w-full py-2.5 bg-[#16a34a] text-white rounded-lg text-sm font-semibold hover:bg-[#15803d] transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={16} />
                          {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
