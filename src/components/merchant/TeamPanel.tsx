import { useState, type FormEvent } from 'react'
import { Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Panel } from '@/components/portal/PortalUI'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TEAM_ROLE_LABELS, type TeamRole } from '@/data/portals/merchant'
import { formatRelative } from '@/lib/format'
import { useMerchant } from '@/store/merchant'

const ASSIGNABLE: TeamRole[] = ['manager', 'kitchen', 'cashier']

export default function TeamPanel() {
  const team = useMerchant((s) => s.team)
  const { addTeamMember, updateTeamRole, removeTeamMember } = useMerchant()
  const [open, setOpen] = useState(false)

  return (
    <Panel
      title="Équipe"
      action={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          <UserPlus /> Inviter
        </Button>
      }
    >
      <div className="-mx-5 -my-5">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Membre</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Dernière activité</TableHead>
              <TableHead className="pr-5 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-ink" aria-hidden>
                      {m.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {m.role === 'owner' ? (
                    <span className="text-sm font-medium text-ink">{TEAM_ROLE_LABELS.owner}</span>
                  ) : (
                    <Select value={m.role} onValueChange={(v) => updateTeamRole(m.id, v as TeamRole)}>
                      <SelectTrigger className="h-8 w-32" aria-label={`Rôle de ${m.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSIGNABLE.map((r) => (
                          <SelectItem key={r} value={r}>
                            {TEAM_ROLE_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{m.lastActive ? formatRelative(m.lastActive) : 'Invitation envoyée'}</TableCell>
                <TableCell className="pr-5 text-right">
                  {m.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Retirer ${m.name}`}
                      onClick={() => {
                        removeTeamMember(m.id)
                        toast(`${m.name} a été retiré(e) de l’équipe`, { action: { label: 'Annuler', onClick: () => addTeamMember(m) } })
                      }}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un membre</DialogTitle>
            <DialogDescription>Un e-mail d’invitation lui permettra d’accéder à l’Espace commerçant.</DialogDescription>
          </DialogHeader>
          <InviteForm
            onCancel={() => setOpen(false)}
            onInvite={(name, email, role) => {
              addTeamMember({ id: `tm-${Date.now().toString(36)}`, name, email, role, lastActive: '' })
              setOpen(false)
              toast.success('Invitation envoyée', { description: email })
            }}
          />
        </DialogContent>
      </Dialog>
    </Panel>
  )
}

function InviteForm({ onInvite, onCancel }: { onInvite: (name: string, email: string, role: TeamRole) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TeamRole>('kitchen')
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const valid = name.trim().length >= 2 && emailOk

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (valid) onInvite(name.trim(), email.trim(), role)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="inv-name">Nom complet</Label>
        <Input id="inv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. : Julie Mercier" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="inv-email">E-mail</Label>
        <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="julie@lebistrotducoin.fr" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="inv-role">Rôle</Label>
        <Select value={role} onValueChange={(v) => setRole(v as TeamRole)}>
          <SelectTrigger id="inv-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASSIGNABLE.map((r) => (
              <SelectItem key={r} value={r}>
                {TEAM_ROLE_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!valid}>
          Envoyer l’invitation
        </Button>
      </DialogFooter>
    </form>
  )
}
