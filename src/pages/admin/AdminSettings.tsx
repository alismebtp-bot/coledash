import { useState } from 'react'
import { Save, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { FilterSelect } from '@/components/admin/Filters'
import { ADMIN_ROLES, ADMIN_TEAM, FEATURE_FLAGS } from '@/data/portals/admin'
import { FREE_DELIVERY_THRESHOLD } from '@/lib/pricing'
import { formatPrice, formatRelative } from '@/lib/format'

const toNum = (s: string) => Number(s.replace(',', '.'))

function NumberField({ id, label, value, onChange, suffix, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; suffix: string; hint?: string }) {
  const invalid = !Number.isFinite(toNum(value)) || toNum(value) < 0
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Input id={id} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className="pr-10 tabular-nums" />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function AdminSettings() {
  const [fees, setFees] = useState({ rate: '5', min: '0,99', max: '3,99', delivery: '1,99', freeFrom: String(FREE_DELIVERY_THRESHOLD), rain: '1,50' })
  const [flags, setFlags] = useState(FEATURE_FLAGS)
  const [team, setTeam] = useState(ADMIN_TEAM)
  const [invite, setInvite] = useState({ email: '', role: 'Support' })

  const set = (k: keyof typeof fees) => (v: string) => setFees((f) => ({ ...f, [k]: v }))
  const serviceFee = (subtotal: number) => Math.min(Math.max((subtotal * toNum(fees.rate)) / 100, toNum(fees.min)), toNum(fees.max))
  const valid = Object.values(fees).every((v) => Number.isFinite(toNum(v)) && toNum(v) >= 0) && toNum(fees.min) <= toNum(fees.max)
  const inviteValid = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(invite.email)

  return (
    <div>
      <PortalPageHeader
        title="Paramètres"
        description="Frais de la plateforme, fonctionnalités et équipe."
        actions={
          <Button disabled={!valid} onClick={() => toast.success('Paramètres enregistrés')}>
            <Save aria-hidden /> Enregistrer
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Frais de service">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField id="fee-rate" label="Taux" value={fees.rate} onChange={set('rate')} suffix="%" hint="du sous-total" />
            <NumberField id="fee-min" label="Minimum" value={fees.min} onChange={set('min')} suffix="€" />
            <NumberField id="fee-max" label="Plafond" value={fees.max} onChange={set('max')} suffix="€" />
          </div>
          {toNum(fees.min) > toNum(fees.max) && <p className="mt-2 text-sm text-red-600">Le minimum doit être inférieur au plafond.</p>}
          <div className="mt-4 rounded-xl bg-secondary/60 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Simulation</p>
            <ul className="mt-2 grid grid-cols-3 gap-2 text-sm">
              {[12, 35, 90].map((s) => (
                <li key={s}>
                  <p className="text-muted-foreground">Panier {formatPrice(s)}</p>
                  <p className="font-semibold tabular-nums text-ink">{valid ? formatPrice(serviceFee(s)) : '—'}</p>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Frais de livraison">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField id="del-base" label="Frais par défaut" value={fees.delivery} onChange={set('delivery')} suffix="€" hint="si le commerce n'en fixe pas" />
            <NumberField id="del-free" label="Offerte dès" value={fees.freeFrom} onChange={set('freeFrom')} suffix="€" />
            <NumberField id="del-rain" label="Bonus météo" value={fees.rain} onChange={set('rain')} suffix="€" hint="reversé au livreur" />
          </div>
        </Panel>

        <Panel title="Fonctionnalités">
          <ul className="-my-2 divide-y">
            {flags.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 py-3">
                <Label htmlFor={`flag-${f.id}`} className="cursor-pointer">
                  <span className="block text-sm font-semibold text-ink">{f.label}</span>
                  <span className="block text-xs font-normal text-muted-foreground">{f.description}</span>
                </Label>
                <Switch
                  id={`flag-${f.id}`}
                  checked={f.enabled}
                  onCheckedChange={(v) => {
                    setFlags((l) => l.map((x) => (x.id === f.id ? { ...x, enabled: v } : x)))
                    toast.success(`${f.label} : ${v ? 'activé' : 'désactivé'}`)
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Équipe d'administration">
          <ul className="-my-2 divide-y">
            {team.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-ink">
                  {m.name.split(' ').map((p) => p[0]).join('')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.email} · {m.lastSeen ? `vu ${formatRelative(m.lastSeen)}` : 'invitation envoyée'}
                  </p>
                </div>
                <FilterSelect
                  label={`Rôle de ${m.name}`}
                  value={m.role}
                  className="sm:w-48"
                  onChange={(role) => {
                    setTeam((l) => l.map((x) => (x.id === m.id ? { ...x, role } : x)))
                    toast.success(`${m.name} est désormais « ${role} »`)
                  }}
                  options={ADMIN_ROLES.map((r) => ({ value: r, label: r }))}
                />
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              if (!inviteValid) return
              const name = invite.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              setTeam((l) => [...l, { id: `t-${l.length + 1}`, name, email: invite.email, role: invite.role, lastSeen: '' }])
              setInvite({ email: '', role: invite.role })
              toast.success(`Invitation envoyée à ${invite.email}`)
            }}
          >
            <Label htmlFor="invite-email" className="sr-only">
              E-mail du nouveau membre
            </Label>
            <Input id="invite-email" type="email" placeholder="prenom.nom@coledash.fr" value={invite.email} onChange={(e) => setInvite((i) => ({ ...i, email: e.target.value }))} />
            <FilterSelect label="Rôle" value={invite.role} onChange={(role) => setInvite((i) => ({ ...i, role }))} options={ADMIN_ROLES.map((r) => ({ value: r, label: r }))} />
            <Button type="submit" disabled={!inviteValid}>
              <UserPlus aria-hidden /> Inviter
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  )
}
