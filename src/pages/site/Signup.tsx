import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Gift, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import AuthShell, { DemoNotice, OrDivider } from '@/components/account/AuthShell'
import FormField from '@/components/account/FormField'
import PasswordInput from '@/components/account/PasswordInput'
import { DEMO_EMAIL, DEMO_PASSWORD, safeRedirect } from '@/components/account/demo'
import { useAuth } from '@/store/auth'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'terms'

function strength(pw: string): { score: number; label: string } {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return { score, label: ['Trop court', 'Faible', 'Correct', 'Bon', 'Excellent'][score] }
}

export default function Signup() {
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'), '/')
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const signup = useAuth((s) => s.signup)
  const login = useAuth((s) => s.login)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<Field | 'form', string>>>({})
  const [loading, setLoading] = useState(false)

  if (user && !loading) return <Navigate to={redirect} replace />

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((x) => ({ ...x, [k]: undefined, form: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!form.firstName.trim()) errs.firstName = 'Indiquez votre prénom.'
    if (!form.lastName.trim()) errs.lastName = 'Indiquez votre nom.'
    if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Saisissez une adresse e-mail valide.'
    if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) errs.phone = 'Format attendu : 06 12 34 56 78.'
    if (form.password.length < 6) errs.password = 'Au moins 6 caractères.'
    if (!terms) errs.terms = 'Vous devez accepter les conditions pour continuer.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`signup-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      const res = signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      })
      if (!res.ok) {
        setLoading(false)
        setErrors({ form: res.error })
        return
      }
      toast.success(`Bienvenue chez ColeDash, ${form.firstName.trim()} !`, {
        description: 'Utilisez le code BIENVENUE pour -20 % sur votre première commande.',
      })
      navigate(redirect, { replace: true })
    }, 500)
  }

  const s = strength(form.password)
  const q = params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''

  return (
    <AuthShell
      title="Créer un compte"
      subtitle="Une minute suffit. Vos adresses et vos favoris vous suivront partout."
      image="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&h=1200&fit=crop"
      quote="Un bouquet, un dîner, les courses de la semaine : un seul compte."
    >
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm text-brand-800">
        <Gift className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong>-20 %</strong> sur votre première commande avec le code <strong>BIENVENUE</strong>
        </span>
      </div>
      <form onSubmit={submit} noValidate className="space-y-4">
        {errors.form && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive" role="alert">
            {errors.form}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="signup-firstName" label="Prénom" error={errors.firstName}>
            <Input id="signup-firstName" className="h-11" autoComplete="given-name" value={form.firstName} onChange={set('firstName')} aria-invalid={!!errors.firstName} aria-describedby="signup-firstName-msg" />
          </FormField>
          <FormField id="signup-lastName" label="Nom" error={errors.lastName}>
            <Input id="signup-lastName" className="h-11" autoComplete="family-name" value={form.lastName} onChange={set('lastName')} aria-invalid={!!errors.lastName} aria-describedby="signup-lastName-msg" />
          </FormField>
        </div>
        <FormField id="signup-email" label="Adresse e-mail" error={errors.email}>
          <Input id="signup-email" type="email" inputMode="email" className="h-11" autoComplete="email" placeholder="vous@exemple.fr" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby="signup-email-msg" />
        </FormField>
        <FormField id="signup-phone" label="Téléphone (facultatif)" error={errors.phone} hint="Pour que le livreur puisse vous joindre.">
          <Input id="signup-phone" type="tel" inputMode="tel" className="h-11" autoComplete="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby="signup-phone-msg" />
        </FormField>
        <FormField id="signup-password" label="Mot de passe" error={errors.password}>
          <PasswordInput id="signup-password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} aria-describedby="signup-password-msg signup-strength" />
        </FormField>
        {form.password && (
          <div id="signup-strength" className="-mt-2 flex items-center gap-2" aria-live="polite">
            <div className="flex flex-1 gap-1" aria-hidden>
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={cn(
                    'h-1.5 flex-1 rounded-full',
                    n <= s.score ? (s.score <= 1 ? 'bg-red-500' : s.score === 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-muted',
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        )}
        <div>
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="signup-terms"
              checked={terms}
              onCheckedChange={(v) => {
                setTerms(v === true)
                setErrors((x) => ({ ...x, terms: undefined }))
              }}
              aria-invalid={!!errors.terms}
              aria-describedby="signup-terms-msg"
              className="mt-0.5"
            />
            <label htmlFor="signup-terms" className="text-sm text-muted-foreground">
              J’accepte les conditions générales d’utilisation et la politique de confidentialité de ColeDash.
            </label>
          </div>
          {errors.terms && (
            <p id="signup-terms-msg" className="mt-1.5 text-xs font-medium text-destructive" role="alert">
              {errors.terms}
            </p>
          )}
        </div>
        <Button type="submit" variant="ink" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </Button>
      </form>
      <OrDivider />
      <Button
        type="button"
        variant="soft"
        size="lg"
        className="w-full"
        disabled={loading}
        onClick={() => {
          setLoading(true)
          login(DEMO_EMAIL, DEMO_PASSWORD)
          toast.success('Connectée en tant que Camille Martin (démo)')
          navigate(redirect, { replace: true })
        }}
      >
        <Sparkles aria-hidden /> Connexion démo
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link to={`/connexion${q}`} className="font-semibold text-ink hover:underline">
          Se connecter
        </Link>
      </p>
      <DemoNotice />
    </AuthShell>
  )
}
