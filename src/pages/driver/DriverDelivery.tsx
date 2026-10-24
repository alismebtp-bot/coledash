import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, CheckCircle2, Info, MapPin, MessageCircle, Navigation, PackageCheck, Phone, Store, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { PortalPageHeader, Panel } from '@/components/portal/PortalUI'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import RouteMap from '@/components/driver/RouteMap'
import type { EarningRecord } from '@/data/portals/driver'
import { useDriver, type DeliveryStep } from '@/store/driver'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

const STEPS: { id: DeliveryStep; label: string }[] = [
  { id: 'to_merchant', label: 'Aller au commerce' },
  { id: 'pickup', label: 'Récupérer' },
  { id: 'to_customer', label: 'Livrer' },
]

function Stepper({ step }: { step: DeliveryStep }) {
  const idx = STEPS.findIndex((s) => s.id === step)
  return (
    <ol className="flex items-center gap-2" aria-label="Étapes de la livraison">
      {STEPS.map((s, i) => (
        <li key={s.id} className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:flex-row sm:gap-2" aria-current={i === idx ? 'step' : undefined}>
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              i < idx ? 'bg-emerald-600 text-white' : i === idx ? 'bg-brand-600 text-white' : 'bg-secondary text-muted-foreground',
            )}
          >
            {i < idx ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
          </span>
          <span className={cn('max-w-full truncate text-center text-[11px] font-semibold sm:text-left sm:text-sm', i === idx ? 'text-ink' : 'text-muted-foreground')}>{s.label}</span>
          {i < STEPS.length - 1 && <span className={cn('hidden h-px flex-1 sm:block', i < idx ? 'bg-emerald-600' : 'bg-border')} aria-hidden />}
        </li>
      ))}
    </ol>
  )
}

function ContactButtons({ who, name }: { who: 'client' | 'commerce'; name: string }) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={`Appeler ${who === 'client' ? 'le client' : 'le commerce'}`}
        onClick={() => toast(`Appel de ${name} via le numéro masqué ColeDash…`)}
      >
        <Phone aria-hidden />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={`Envoyer un message ${who === 'client' ? 'au client' : 'au commerce'}`}
        onClick={() => toast.success(`Message envoyé à ${name} : « J'arrive dans quelques minutes. »`)}
      >
        <MessageCircle aria-hidden />
      </Button>
    </div>
  )
}

export default function DriverDelivery() {
  const current = useDriver((s) => s.current)
  const advance = useDriver((s) => s.advance)
  const complete = useDriver((s) => s.complete)
  const cancelCurrent = useDriver((s) => s.cancelCurrent)
  const [checked, setChecked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [done, setDone] = useState<EarningRecord | null>(null)

  if (done) {
    const total = done.pay + done.tip + done.bonus
    return (
      <div className="mx-auto max-w-md py-8 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" aria-hidden />
        </motion.div>
        <h1 className="mt-5 text-2xl font-bold text-ink">Livraison terminée</h1>
        <p className="mt-1 text-muted-foreground">Bravo ! {formatPrice(total)} ont été ajoutés à vos gains.</p>
        <dl className="mx-auto mt-6 max-w-xs space-y-2 rounded-2xl border bg-card p-4 text-left text-sm shadow-soft">
          <div className="flex justify-between"><dt className="text-muted-foreground">Course</dt><dd className="font-semibold tabular-nums">{formatPrice(done.pay)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Pourboire</dt><dd className="font-semibold tabular-nums">{formatPrice(done.tip)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Bonus</dt><dd className="font-semibold tabular-nums">{formatPrice(done.bonus)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/livreur/courses">Nouvelle course</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/livreur/gains">Voir mes gains</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-2xl">
        <PortalPageHeader title="Livraison en cours" />
        <EmptyState
          icon={Navigation}
          title="Aucune livraison en cours"
          description="Acceptez une course pour démarrer l'itinéraire guidé."
          action={
            <Button asChild size="lg">
              <Link to="/livreur/courses">Voir les courses disponibles</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const { offer, step } = current
  const toMerchant = step === 'to_merchant' || step === 'pickup'

  const validatePin = () => {
    if (pin !== offer.pin) {
      setPinError(true)
      toast.error('Code PIN incorrect. Demandez au client de vérifier son application.')
      return
    }
    const record = complete()
    if (record) {
      toast.success(`Course terminée : +${formatPrice(record.pay + record.tip + record.bonus)}`)
      setDone(record)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PortalPageHeader title="Livraison en cours" description={`Commande ${offer.orderCode} · ${formatPrice(offer.pay)}${offer.tipEstimate ? ` + ${formatPrice(offer.tipEstimate)} de pourboire` : ''}`} />

      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <Stepper step={step} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-soft">
        <RouteMap seed={offer.seed} leg={toMerchant ? 0 : 1} className="block h-auto w-full" />
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            {toMerchant ? `${offer.pickupKm.toLocaleString('fr-FR')} km jusqu'au commerce` : `${offer.distanceKm.toLocaleString('fr-FR')} km jusqu'au client`}
          </span>
          <Button size="sm" variant="ink" onClick={() => toast('Ouverture de la navigation GPS…')}>
            <Navigation aria-hidden /> Naviguer
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Panel>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-ink">
                <Store className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Retrait</p>
                <p className="font-semibold text-ink">{offer.merchantName}</p>
                <p className="text-sm text-muted-foreground">{offer.pickupAddress}</p>
              </div>
            </div>
            <ContactButtons who="commerce" name={offer.merchantName} />
          </div>

          {step === 'to_merchant' && (
            <Button size="lg" className="mt-4 w-full" onClick={advance}>
              Je suis arrivé au commerce
            </Button>
          )}

          {step === 'pickup' && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-ink p-4 text-center text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-white/60">Code de commande à annoncer</p>
                <p className="mt-1 font-display text-3xl font-bold tracking-wider">{offer.orderCode}</p>
                <p className="mt-1 text-sm text-white/70">{offer.items} article{offer.items > 1 ? 's' : ''} · client {offer.customerName}</p>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="check-items" checked={checked} onCheckedChange={(v) => setChecked(v === true)} className="mt-0.5" />
                <Label htmlFor="check-items" className="text-sm font-normal leading-snug">
                  J'ai vérifié le nombre d'articles et le sac est bien fermé.
                </Label>
              </div>
              <Button
                size="lg"
                className="w-full"
                disabled={!checked}
                onClick={() => {
                  advance()
                  toast.success('Commande récupérée, direction le client')
                }}
              >
                <PackageCheck aria-hidden /> Commande récupérée
              </Button>
            </div>
          )}
        </Panel>

        <Panel className={cn(step !== 'to_customer' && 'opacity-70')}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Livraison</p>
                <p className="font-semibold text-ink">{offer.customerName}</p>
                <p className="text-sm text-muted-foreground">{offer.dropoffAddress}</p>
              </div>
            </div>
            <ContactButtons who="client" name={offer.customerName} />
          </div>
          {offer.instructions && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {offer.instructions}
            </p>
          )}

          {step === 'to_customer' && (
            <div className="mt-5">
              <Label htmlFor="pin" className="text-sm font-semibold text-ink">
                Code PIN du client
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Le client trouve ce code à 4 chiffres dans son suivi de commande.</p>
              <InputOTP
                id="pin"
                maxLength={4}
                value={pin}
                inputMode="numeric"
                pattern="^[0-9]*$"
                onChange={(v) => {
                  setPin(v)
                  setPinError(false)
                }}
                containerClassName="mt-3 justify-center sm:justify-start"
                aria-invalid={pinError}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <InputOTPSlot key={i} index={i} aria-invalid={pinError} className="h-14 w-14 rounded-xl border text-xl font-bold first:rounded-xl last:rounded-xl" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {pinError && <p className="mt-2 text-sm font-medium text-red-600">Code incorrect, réessayez.</p>}
              <p className="mt-2 text-xs text-muted-foreground">Démo : le code du client est {offer.pin}.</p>
              <Button size="lg" className="mt-4 w-full" disabled={pin.length !== 4} onClick={validatePin}>
                Valider la livraison
              </Button>
            </div>
          )}
        </Panel>

        <button
          type="button"
          onClick={() => {
            cancelCurrent()
            toast('Course signalée au support et retirée de votre liste')
          }}
          className="mx-auto inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted-foreground hover:text-red-600"
        >
          <TriangleAlert className="h-4 w-4" aria-hidden /> Signaler un problème et annuler
        </button>
      </div>
    </div>
  )
}
