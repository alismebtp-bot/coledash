import { useMemo, useState } from 'react'
import { FolderPlus, MoreHorizontal, PackageX, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, PortalPageHeader, StatusPill } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import SafeImage from '@/components/shared/SafeImage'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import CategoryDialog from '@/components/merchant/CategoryDialog'
import MenuItemDialog from '@/components/merchant/MenuItemDialog'
import { BADGE_LABELS, type CatalogCategory, type CatalogItem } from '@/data/portals/merchant'
import { formatPrice, pluralize } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useMerchant } from '@/store/merchant'

export default function MerchantMenu() {
  const categories = useMerchant((s) => s.categories)
  const items = useMerchant((s) => s.items)
  const { toggleAvailability, upsertItem, removeItem, addCategory, renameCategory } = useMerchant()

  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState<string>('all')
  const [onlyOut, setOnlyOut] = useState(false)
  const [editing, setEditing] = useState<CatalogItem | null>(null)
  const [itemDialog, setItemDialog] = useState(false)
  const [catDialog, setCatDialog] = useState<{ open: boolean; category?: CatalogCategory }>({ open: false })

  const outCount = items.filter((i) => !i.available).length

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (i) =>
        (activeCat === 'all' || i.categoryId === activeCat) &&
        (!onlyOut || !i.available) &&
        (!q || `${i.name} ${i.description}`.toLowerCase().includes(q)),
    )
  }, [items, query, activeCat, onlyOut])

  const grouped = categories
    .map((c) => ({ category: c, items: visible.filter((i) => i.categoryId === c.id) }))
    .filter((g) => g.items.length > 0 || (activeCat === g.category.id && !query && !onlyOut))

  const openNew = () => {
    setEditing(null)
    setItemDialog(true)
  }

  return (
    <div>
      <PortalPageHeader
        title="Carte & produits"
        description={`${pluralize(items.length, 'produit')} dans ${pluralize(categories.length, 'catégorie')} · ${outCount ? `${pluralize(outCount, 'produit')} en rupture` : 'tout est disponible'}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setCatDialog({ open: true })}>
              <FolderPlus /> Ajouter une catégorie
            </Button>
            <Button onClick={openNew}>
              <Plus /> Ajouter un produit
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Catégories" className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
            {[{ id: 'all', name: 'Toute la carte' }, ...categories].map((c) => {
              const count = c.id === 'all' ? items.length : items.filter((i) => i.categoryId === c.id).length
              const active = activeCat === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCat(c.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                    active ? 'bg-ink text-white' : 'bg-card text-ink hover:bg-secondary lg:bg-transparent',
                  )}
                >
                  <span className="truncate">{c.name}</span>
                  <span className={cn('text-xs tabular-nums', active ? 'text-white/70' : 'text-muted-foreground')}>{count}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un plat…" className="bg-card pl-9" aria-label="Rechercher un produit" />
            </div>
            <label className="flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium text-ink">
              <Switch checked={onlyOut} onCheckedChange={setOnlyOut} aria-label="Afficher uniquement les ruptures" />
              Ruptures uniquement
            </label>
          </div>

          {grouped.length === 0 ? (
            <EmptyState
              icon={PackageX}
              title="Aucun produit trouvé"
              description="Modifiez votre recherche ou ajoutez un nouveau produit à votre carte."
              action={<Button onClick={openNew}>Ajouter un produit</Button>}
            />
          ) : (
            grouped.map(({ category, items: catItems }) => (
              <Panel
                key={category.id}
                title={`${category.name} · ${catItems.length}`}
                action={
                  <Button variant="ghost" size="sm" onClick={() => setCatDialog({ open: true, category })}>
                    <Pencil /> Renommer
                  </Button>
                }
                className="overflow-hidden"
              >
                {catItems.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">Catégorie vide pour le moment.</p>
                ) : (
                  <ul className="-mx-5 -my-5 divide-y">
                    {catItems.map((item) => (
                      <li key={item.id} className={cn('flex items-center gap-3 px-5 py-3.5 sm:gap-4', !item.available && 'bg-stone-50')}>
                        <SafeImage src={item.image} alt="" wrapperClassName={cn('h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16', !item.available && 'opacity-50 grayscale')} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className={cn('font-semibold text-ink', !item.available && 'text-muted-foreground line-through')}>{item.name}</p>
                            {!item.available && <StatusPill tone="danger">Rupture</StatusPill>}
                            {item.badges.slice(0, 3).map((b) => (
                              <StatusPill key={b} tone={b === 'populaire' || b === 'meilleure_vente' ? 'brand' : b === 'nouveau' ? 'info' : 'neutral'}>
                                {BADGE_LABELS[b]}
                              </StatusPill>
                            ))}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <p className="hidden w-20 text-right font-semibold tabular-nums text-ink sm:block">{formatPrice(item.price)}</p>
                        <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <p className="text-sm font-semibold tabular-nums text-ink sm:hidden">{formatPrice(item.price)}</p>
                          <Switch
                            checked={item.available}
                            onCheckedChange={() => {
                              toggleAvailability(item.id)
                              toast(item.available ? `${item.name} en rupture` : `${item.name} de nouveau disponible`)
                            }}
                            aria-label={`Disponibilité de ${item.name}`}
                          />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${item.name}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() => {
                                setEditing(item)
                                setItemDialog(true)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700"
                              onSelect={() => {
                                removeItem(item.id)
                                toast(`${item.name} supprimé de la carte`, {
                                  action: { label: 'Annuler', onClick: () => upsertItem(item) },
                                })
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            ))
          )}
        </div>
      </div>

      <MenuItemDialog
        open={itemDialog}
        onOpenChange={setItemDialog}
        item={editing}
        categories={categories}
        defaultCategoryId={activeCat !== 'all' ? activeCat : undefined}
        onSave={(item) => {
          upsertItem(item)
          setItemDialog(false)
          toast.success(editing ? 'Produit mis à jour' : `${item.name} ajouté à la carte`)
        }}
      />
      <CategoryDialog
        open={catDialog.open}
        onOpenChange={(open) => setCatDialog((s) => ({ ...s, open }))}
        initialName={catDialog.category?.name}
        existingNames={categories.map((c) => c.name)}
        onSave={(name) => {
          if (catDialog.category) {
            renameCategory(catDialog.category.id, name)
            toast.success('Catégorie renommée')
          } else {
            const cat = addCategory(name)
            setActiveCat(cat.id)
            toast.success(`Catégorie « ${name} » créée`)
          }
          setCatDialog({ open: false })
        }}
      />
    </div>
  )
}
