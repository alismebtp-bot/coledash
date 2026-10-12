import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  X,
  ImageIcon,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

/* ─────────────────────── types ─────────────────────── */

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  dietary: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

/* ─────────────────────── mock data ─────────────────────── */

const initialCategories: MenuCategory[] = [
  {
    id: 'cat-1',
    name: 'Burgers',
    items: [
      { id: 'item-1', name: 'Burger Classic', description: 'Boeuf charolais, cheddar, salade, tomate, oignon, sauce maison', price: 13.50, category: 'Burgers', isAvailable: true, isPopular: true, isVegetarian: false, dietary: [] },
      { id: 'item-2', name: 'Bacon BBQ', description: 'Boeuf, bacon croustillant, sauce BBQ fumée, oignon frit', price: 15.50, category: 'Burgers', isAvailable: true, isPopular: true, isVegetarian: false, dietary: [] },
      { id: 'item-3', name: 'Veggie Burger', description: 'Steak de légumes grillé, avocat, roquette, houmous', price: 14.00, category: 'Burgers', isAvailable: true, isPopular: false, isVegetarian: true, dietary: ['Végétarien'] },
      { id: 'item-4', name: 'Double Smash', description: 'Double steak écrasé, double cheddar, pickles, moutarde', price: 17.00, category: 'Burgers', isAvailable: true, isPopular: false, isVegetarian: false, dietary: [] },
    ],
  },
  {
    id: 'cat-2',
    name: 'Sides',
    items: [
      { id: 'item-5', name: 'Frites Maison', description: 'Pommes de terre fraîches, sel de mer', price: 4.50, category: 'Sides', isAvailable: true, isPopular: true, isVegetarian: true, dietary: ['Végétarien'] },
      { id: 'item-6', name: 'Onion Rings', description: 'Rondelles d\'oignon panées, sauce ranch', price: 5.50, category: 'Sides', isAvailable: true, isPopular: false, isVegetarian: true, dietary: ['Végétarien'] },
      { id: 'item-7', name: 'Wings BBQ', description: 'Ailes de poulet sauce BBQ maison (6 pièces)', price: 9.50, category: 'Sides', isAvailable: false, isPopular: false, isVegetarian: false, dietary: [] },
    ],
  },
  {
    id: 'cat-3',
    name: 'Boissons',
    items: [
      { id: 'item-8', name: 'Coca-Cola', description: '33cl', price: 3.50, category: 'Boissons', isAvailable: true, isPopular: true, isVegetarian: true, dietary: [] },
      { id: 'item-9', name: 'Limonade Maison', description: 'Citron, menthe, eau pétillante', price: 4.50, category: 'Boissons', isAvailable: true, isPopular: false, isVegetarian: true, dietary: [] },
    ],
  },
  {
    id: 'cat-4',
    name: 'Desserts',
    items: [
      { id: 'item-10', name: 'Brownie', description: 'Chocolat noir, noix de pécan, glace vanille', price: 7.50, category: 'Desserts', isAvailable: true, isPopular: true, isVegetarian: true, dietary: ['Végétarien'] },
      { id: 'item-11', name: 'Milkshake Vanille', description: 'Glace vanille, lait entier, crème fouettée', price: 6.50, category: 'Desserts', isAvailable: true, isPopular: false, isVegetarian: true, dietary: ['Végétarien', 'Sans Gluten'] },
    ],
  },
];

/* ─────────────────────── sub-components ─────────────────────── */

function ItemModal({
  item,
  categoryName,
  onSave,
  onClose,
}: {
  item?: MenuItem;
  categoryName: string;
  onSave: (item: Partial<MenuItem>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<MenuItem>>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    isAvailable: item?.isAvailable ?? true,
    isPopular: item?.isPopular ?? false,
    isVegetarian: item?.isVegetarian ?? false,
    dietary: item?.dietary || [],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-cd-overlay z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-mp-text mb-4">
          {item ? 'Modifier l\'article' : 'Nouvel article'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Nom</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-cd-text-secondary mb-1.5">Prix (€)</label>
            <input
              type="number"
              step={0.1}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 border border-cd-border rounded-lg text-sm focus:outline-none focus:border-cd-primary"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                className="w-4 h-4 accent-cd-primary"
              />
              <span className="text-sm text-cd-text-secondary">Disponible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                className="w-4 h-4 accent-cd-primary"
              />
              <span className="text-sm text-cd-text-secondary">Populaire</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isVegetarian}
                onChange={(e) => setForm({ ...form, isVegetarian: e.target.checked })}
                className="w-4 h-4 accent-cd-primary"
              />
              <span className="text-sm text-cd-text-secondary">Végétarien</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-lg hover:bg-cd-primary-hover transition-colors"
          >
            Enregistrer
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-cd-border text-cd-text-secondary text-sm font-medium rounded-lg hover:bg-cd-bg-warm transition-colors"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────── main component ─────────────────────── */

export default function MerchantMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<{ item: MenuItem; categoryId: string } | null>(null);
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(initialCategories.map((c) => c.id)));

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  };

  const saveItem = (categoryId: string, itemId: string | undefined, data: Partial<MenuItem>) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        if (itemId) {
          return { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...data } : i)) };
        }
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: data.name || 'Nouvel article',
          description: data.description || '',
          price: data.price || 0,
          category: c.name,
          isAvailable: data.isAvailable ?? true,
          isPopular: data.isPopular ?? false,
          isVegetarian: data.isVegetarian ?? false,
          dietary: data.dietary || [],
        };
        return { ...c, items: [...c.items, newItem] };
      })
    );
    setEditingItem(null);
    setShowAdd(null);
  };

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0 || search === '');

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const availableItems = categories.reduce((sum, c) => sum + c.items.filter((i) => i.isAvailable).length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[900px] mx-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-mp-text">Menu</h1>
          <p className="text-sm text-cd-text-secondary mt-1">
            {totalItems} articles · {availableItems} disponibles
          </p>
        </div>
        <button
          onClick={() => setShowAdd(categories[0]?.id || null)}
          className="px-5 py-2.5 bg-cd-primary text-white text-sm font-semibold rounded-xl hover:bg-cd-primary-hover transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un article
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cd-text-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un article..."
          className="w-full pl-10 pr-4 py-3 border border-cd-border rounded-xl text-sm text-cd-text-primary focus:outline-none focus:border-cd-primary focus:ring-2 focus:ring-cd-primary/15 transition-all"
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isExpanded = expandedCategories.has(cat.id);
          const visibleItems = search
            ? cat.items.filter(
                (i) =>
                  i.name.toLowerCase().includes(search.toLowerCase()) ||
                  i.description.toLowerCase().includes(search.toLowerCase())
              )
            : cat.items;

          if (search && visibleItems.length === 0) return null;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-cd-bg-warm transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-cd-text-tertiary" />
                  <h3 className="text-base font-semibold text-mp-text">{cat.name}</h3>
                  <span className="px-2 py-0.5 bg-cd-bg-warm text-cd-text-tertiary text-[10px] font-bold rounded-full">
                    {cat.items.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAdd(cat.id);
                    }}
                    className="p-1.5 text-cd-primary hover:bg-cd-primary-light rounded-lg transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <ChevronDown
                    size={16}
                    className={`text-cd-text-tertiary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-cd-border">
                      {visibleItems.map((item) => (
                        <div
                          key={item.id}
                          className={`px-5 py-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-50' : ''}`}
                        >
                          <div className="w-12 h-12 rounded-lg bg-cd-bg-warm flex items-center justify-center shrink-0">
                            <ImageIcon size={18} className="text-cd-text-tertiary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-cd-text-primary">{item.name}</p>
                              {item.isPopular && (
                                <span className="px-1.5 py-0.5 bg-cd-primary-light text-cd-primary text-[9px] font-bold rounded-full">
                                  POPULAIRE
                                </span>
                              )}
                              {item.isVegetarian && (
                                <span className="px-1.5 py-0.5 bg-cd-success-light text-cd-success text-[9px] font-bold rounded-full">
                                  VEGGIE
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-cd-text-tertiary truncate">{item.description}</p>
                            <p className="text-sm font-bold text-cd-text-primary mt-0.5">{item.price.toFixed(2)} €</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setCategories((prev) =>
                                  prev.map((c) =>
                                    c.id === cat.id
                                      ? {
                                          ...c,
                                          items: c.items.map((i) =>
                                            i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i
                                          ),
                                        }
                                      : c
                                  )
                                )
                              }
                              className="p-1.5 text-cd-text-tertiary hover:text-cd-primary transition-colors"
                              title={item.isAvailable ? 'Rendre indisponible' : 'Rendre disponible'}
                            >
                              {item.isAvailable ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                            <button
                              onClick={() => setEditingItem({ item, categoryId: cat.id })}
                              className="p-1.5 text-cd-text-tertiary hover:text-cd-primary transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteItem(cat.id, item.id)}
                              className="p-1.5 text-cd-text-tertiary hover:text-cd-error transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingItem && (
          <ItemModal
            item={editingItem.item}
            categoryName={categories.find((c) => c.id === editingItem.categoryId)?.name || ''}
            onSave={(data) => saveItem(editingItem.categoryId, editingItem.item.id, data)}
            onClose={() => setEditingItem(null)}
          />
        )}
        {showAdd && (
          <ItemModal
            categoryName={categories.find((c) => c.id === showAdd)?.name || ''}
            onSave={(data) => saveItem(showAdd, undefined, data)}
            onClose={() => setShowAdd(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
