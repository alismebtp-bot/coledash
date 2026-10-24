import { useState } from 'react'
import { Megaphone, Pause, Play, Plus, Tag, Target, TicketPercent } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel, StatCard, StatusPill, type Tone } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import PushComposer from '@/components/admin/PushComposer'
import { compactEur } from '@/components/admin/tones'
import { CAMPAIGNS, CAMPAIGN_STATUS_LABELS, CHANNEL_LABELS, PROMO_STATS, type Campaign, type CampaignStatus, type PromoStats } from '@/data/portals/admin'
import { formatDate, formatNumber, formatPrice } from '@/lib/format'

const CAMPAIGN_TONES: Record<CampaignStatus, Tone> = { active: 'success', programmee: 'info', terminee: 'neutral', brouillon: 'warning' }

function NewPromoDialog({ open, onOpenChange, onCreate, existing }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (p: PromoStats) => void; existing: string[] }) {
  const [code, setCode] = useState('')
  const [label, setLabel] = useState('')
  const [limit, setLimit] = useState('1000')
  const normalized = code.trim().toUpperCase().replace(/\s+/g, '')
  const duplicate = existing.includes(normalized)
  const valid = /^[A-Z0-9]{3,16}$/.test(normalized) && label.trim().length > 2 && !duplicate

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau code promo</DialogTitle>
          <DialogDescription>Le code sera actif immédiatement sur les villes ouvertes.</DialogDescription>
        </DialogHeader>
        <form
          id="new-promo"
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return
            onCreate({ code: normalized, label: label.trim(), uses: 0, limit: Number(limit) || undefined, discountTotal: 0, revenue: 0, active: true, live: false })
            setCode('')
            setLabel('')
          }}
        >
          <div>
            <Label htmlFor="promo-code">Code</Label>
            <Input id="promo-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="HIVER25" className="mt-1.5 font-mono uppercase" aria-invalid={duplicate} />
            {duplicate && <p className="mt-1 text-xs text-red-600">Ce code existe déjà.</p>}
          </div>
          <div>
            <Label htmlFor="promo-label">Avantage</Label>
            <Input id="promo-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="-25 % sur la première commande" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="promo-limit">Nombre d'utilisations maximum</Label>
            <Input id="promo-limit" inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))} className="mt-1.5" />
          </div>
        </form>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" form="new-promo" disabled={!valid}>
            Créer le code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminMarketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS)
  const [promos, setPromos] = useState<PromoStats[]>(PROMO_STATS)
  const [dialogOpen, setDialogOpen] = useState(false)

  const active = campaigns.filter((c) => c.status === 'active')
  const totalUses = promos.reduce((s, p) => s + p.uses, 0)
  const totalDiscount = promos.reduce((s, p) => s + p.discountTotal, 0)
  const conversions = campaigns.reduce((s, c) => s + c.conversions, 0)
  const reach = campaigns.reduce((s, c) => s + c.reach, 0)

  const toggleCampaign = (c: Campaign) => {
    const next: CampaignStatus = c.status === 'active' ? 'terminee' : 'active'
    setCampaigns((l) => l.map((x) => (x.id === c.id ? { ...x, status: next } : x)))
    toast.success(next === 'active' ? `Campagne « ${c.name} » lancée` : `Campagne « ${c.name} » arrêtée`)
  }

  return (
    <div>
      <PortalPageHeader title="Marketing" description="Campagnes, codes promo et notifications push." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Campagnes actives" value={active.length} icon={Megaphone} />
        <StatCard label="Taux de conversion" value={`${((conversions / Math.max(reach, 1)) * 100).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`} icon={Target} hint="toutes campagnes" />
        <StatCard label="Utilisations de codes" value={formatNumber(totalUses)} icon={TicketPercent} />
        <StatCard label="Remises accordées" value={compactEur.format(totalDiscount)} icon={Tag} />
      </div>

      <Panel title="Campagnes" className="mt-4">
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => {
            const spentPct = c.budget ? (c.spent / c.budget) * 100 : 0
            return (
              <li key={c.id} className="flex flex-col rounded-xl border p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{CHANNEL_LABELS[c.channel]} · {c.audience}</p>
                  </div>
                  <StatusPill tone={CAMPAIGN_TONES[c.status]}>{CAMPAIGN_STATUS_LABELS[c.status]}</StatusPill>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Du {formatDate(c.start, { day: 'numeric', month: 'short' })} au {formatDate(c.end, { day: 'numeric', month: 'short' })}
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div><dt className="text-muted-foreground">Portée</dt><dd className="font-semibold tabular-nums text-ink">{formatNumber(c.reach)}</dd></div>
                  <div><dt className="text-muted-foreground">Conversions</dt><dd className="font-semibold tabular-nums text-ink">{formatNumber(c.conversions)}</dd></div>
                  <div><dt className="text-muted-foreground">Budget</dt><dd className="font-semibold tabular-nums text-ink">{compactEur.format(c.budget)}</dd></div>
                </dl>
                <Progress value={spentPct} className="mt-3 h-1.5" aria-label={`Budget consommé : ${Math.round(spentPct)} %`} />
                <p className="mt-1 text-[11px] text-muted-foreground">{formatPrice(c.spent)} dépensés</p>
                <div className="mt-auto pt-3">
                  {c.status === 'active' ? (
                    <Button size="sm" variant="outline" onClick={() => toggleCampaign(c)}>
                      <Pause aria-hidden /> Arrêter
                    </Button>
                  ) : c.status !== 'terminee' ? (
                    <Button size="sm" variant="soft" onClick={() => toggleCampaign(c)}>
                      <Play aria-hidden /> Lancer maintenant
                    </Button>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel
        title="Codes promo"
        className="mt-4"
        action={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus aria-hidden /> Nouveau code
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Code</th>
                <th className="py-2 pr-3 font-semibold">Utilisations</th>
                <th className="py-2 pr-3 text-right font-semibold">Remises</th>
                <th className="py-2 pr-3 text-right font-semibold">CA généré</th>
                <th className="py-2 pr-3 font-semibold">Expiration</th>
                <th className="py-2 text-right font-semibold">Actif</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {promos.map((p) => (
                <tr key={p.code}>
                  <td className="py-2.5 pr-3">
                    <p className="flex items-center gap-2">
                      <span className="rounded-md bg-ink px-2 py-0.5 font-mono text-xs font-bold text-white">{p.code}</span>
                      {p.live && <StatusPill tone="brand">Au paiement</StatusPill>}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.label}</p>
                  </td>
                  <td className="py-2.5 pr-3">
                    <p className="tabular-nums">
                      {formatNumber(p.uses)}
                      {p.limit ? <span className="text-muted-foreground"> / {formatNumber(p.limit)}</span> : null}
                    </p>
                    {p.limit ? <Progress value={Math.min(100, (p.uses / p.limit) * 100)} className="mt-1 h-1.5 w-28" aria-label={`Utilisation du code ${p.code}`} /> : null}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{formatPrice(p.discountTotal)}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{formatPrice(p.revenue)}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{p.expires ? formatDate(p.expires) : 'Sans limite'}</td>
                  <td className="py-2.5 text-right">
                    <Switch
                      checked={p.active}
                      aria-label={`Activer le code ${p.code}`}
                      onCheckedChange={(v) => {
                        setPromos((l) => l.map((x) => (x.code === p.code ? { ...x, active: v } : x)))
                        toast.success(v ? `Code ${p.code} activé` : `Code ${p.code} désactivé`)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Les codes marqués « Au paiement » sont réellement acceptés dans le panier de la démo.</p>
      </Panel>

      <Panel title="Notification push" className="mt-4">
        <PushComposer />
      </Panel>

      <NewPromoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        existing={promos.map((p) => p.code)}
        onCreate={(p) => {
          setPromos((l) => [p, ...l])
          setDialogOpen(false)
          toast.success(`Code ${p.code} créé`)
        }}
      />
    </div>
  )
}
