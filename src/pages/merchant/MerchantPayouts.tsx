import { useState } from 'react'
import { Banknote, CalendarClock, Download, Eye, EyeOff, FileText, Landmark, Percent, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { Panel, PortalPageHeader, StatCard, StatusPill, type Tone } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  bankAccount,
  COMMISSION_RATE,
  currentBalance,
  maskIban,
  PAYMENT_FEE_RATE,
  PAYOUT_STATUS_LABELS,
  payouts,
  type Payout,
  type PayoutStatus,
} from '@/data/portals/merchant'
import { formatDate, formatPrice } from '@/lib/format'

const STATUS_TONES: Record<PayoutStatus, Tone> = { paid: 'success', processing: 'info', pending: 'neutral', failed: 'danger' }

const short = (iso: string) => formatDate(iso, { day: 'numeric', month: 'short' })

function downloadInvoice(label: string) {
  toast.promise(new Promise((resolve) => window.setTimeout(resolve, 900)), {
    loading: 'Génération du PDF…',
    success: `PDF généré — ${label}`,
    error: 'Impossible de générer le document',
  })
}

export default function MerchantPayouts() {
  const [showIban, setShowIban] = useState(false)
  const b = currentBalance
  const g = b.gross || 1
  const paid = payouts.filter((p) => p.status === 'paid')
  const last30 = paid.slice(0, 4).reduce((s, p) => s + p.net, 0)

  const breakdown = [
    { label: 'Ventes brutes (TTC)', value: b.gross, strong: true },
    { label: `Commission ColeDash (${Math.round(COMMISSION_RATE * 100)} %)`, value: -b.commission },
    { label: `Frais de paiement (${(PAYMENT_FEE_RATE * 100).toLocaleString('fr-FR')} %)`, value: -b.fees },
    { label: 'Promotions financées', value: -b.promotions },
    { label: 'Remboursements clients', value: -b.refunds },
  ]

  return (
    <div>
      <PortalPageHeader
        title="Paiements"
        description="Virements hebdomadaires chaque mardi pour les ventes du lundi au dimanche précédents."
        actions={
          <Button variant="outline" onClick={() => downloadInvoice('relevé annuel 2026')}>
            <FileText /> Relevé annuel
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Solde en cours" value={formatPrice(b.balance)} icon={Wallet} hint={`depuis le ${short(b.periodStart)}`} />
        <StatCard label="Prochain virement" value={formatDate(b.nextPayoutDate, { weekday: 'short', day: 'numeric', month: 'short' })} icon={CalendarClock} hint="estimation" />
        <StatCard label="Versé sur 4 semaines" value={formatPrice(last30)} icon={Banknote} />
        <StatCard label="Taux de commission" value={`${Math.round(COMMISSION_RATE * 100)} %`} icon={Percent} hint="offre Partenaire" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Détail de la semaine en cours" className="lg:col-span-2">
          <dl className="divide-y text-sm">
            {breakdown.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2.5">
                <dt className={r.strong ? 'font-medium text-ink' : 'text-muted-foreground'}>{r.label}</dt>
                <dd className={`tabular-nums ${r.strong ? 'font-semibold text-ink' : 'text-ink'}`}>
                  {r.value < 0 ? `−${formatPrice(-r.value)}` : formatPrice(r.value)}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <dt className="font-semibold text-ink">Net à verser</dt>
              <dd className="font-display text-xl font-bold tabular-nums text-ink">{formatPrice(b.balance)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-secondary" role="img" aria-label="Répartition des ventes brutes">
            <span className="h-full bg-emerald-500" style={{ width: `${(b.balance / g) * 100}%` }} />
            <span className="h-full border-l-2 border-card bg-brand-600" style={{ width: `${(b.commission / g) * 100}%` }} />
            <span className="h-full border-l-2 border-card bg-amber-500" style={{ width: `${((b.fees + b.promotions + b.refunds) / g) * 100}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Votre revenu</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-600" />Commission</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Frais, promotions et remboursements</span>
          </div>
        </Panel>

        <Panel title="Compte bancaire" action={<Landmark className="h-4 w-4 text-muted-foreground" aria-hidden />}>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Titulaire</dt>
              <dd className="font-medium text-ink">{bankAccount.holder}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Banque</dt>
              <dd className="text-ink">{bankAccount.bank}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">IBAN</dt>
              <dd className="flex items-center gap-2">
                <span className="font-mono text-[13px] tracking-tight text-ink">{showIban ? bankAccount.iban : maskIban(bankAccount.iban)}</span>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowIban((v) => !v)} aria-label={showIban ? 'Masquer l’IBAN' : 'Afficher l’IBAN'}>
                  {showIban ? <EyeOff /> : <Eye />}
                </Button>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">BIC</dt>
              <dd className="font-mono text-[13px] text-ink">{bankAccount.bic}</dd>
            </div>
          </dl>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => toast('Modification du RIB', { description: 'Un lien sécurisé a été envoyé à philippe@lebistrotducoin.fr.' })}
          >
            Modifier le compte
          </Button>
        </Panel>
      </div>

      <Panel title="Historique des virements" className="mt-6">
        <div className="-mx-5 -my-5">
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Période</TableHead>
                <TableHead>Virement</TableHead>
                <TableHead className="text-right">Commandes</TableHead>
                <TableHead className="text-right">Brut</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead className="text-right">Frais & promos</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="pr-5 text-right">Facture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((p: Payout) => (
                <TableRow key={p.id}>
                  <TableCell className="whitespace-nowrap pl-5 text-ink">
                    {short(p.periodStart)} – {short(p.periodEnd)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="block text-ink">{formatDate(p.payoutDate)}</span>
                    <span className="text-xs text-muted-foreground">{p.reference}</span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{p.orders}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPrice(p.gross)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">−{formatPrice(p.commission)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">−{formatPrice(p.fees + p.promotions)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-ink">{formatPrice(p.net)}</TableCell>
                  <TableCell>
                    <StatusPill tone={STATUS_TONES[p.status]}>{PAYOUT_STATUS_LABELS[p.status]}</StatusPill>
                    {p.status === 'failed' && <span className="mt-0.5 block text-[11px] text-muted-foreground">Renvoyé le lendemain</span>}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm" onClick={() => downloadInvoice(`facture ${p.reference}`)} aria-label={`Télécharger la facture ${p.reference}`}>
                      <Download /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  )
}
