import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthShell, { DemoNotice, OrDivider } from '@/components/account/AuthShell'
import FormField from '@/components/account/FormField'
import PasswordInput from '@/components/account/PasswordInput'
import { DEMO_EMAIL, DEMO_PASSWORD, safeRedirect } from '@/components/account/demo'
import { useAuth } from '@/store/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [params] = useSearchParams()
  const redirect = safeRedirect(params.get('redirect'), '/')
  const navigate = useNavigate()
  const user = useAuth((s) => s.user)
  const login = useAuth((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  if (user && !loading) return <Navigate to={redirect} replace />

  const finish = (firstName: string) => {
    toast.success(`Bon retour parmi nous, ${firstName} !`)
    navigate(redirect, { replace: true })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!EMAIL_RE.test(email.trim())) errs.email = 'Saisissez une adresse e-mail valide.'
    if (password.length < 6) errs.password = 'Au moins 6 caractères.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    window.setTimeout(() => {
      const res = login(email.trim().toLowerCase(), password)
      if (!res.ok) {
        setLoading(false)
        setErrors({ form: res.error })
        return
      }
      finish(useAuth.getState().user?.firstName ?? '')
    }, 500)
  }

  const demo = () => {
    setLoading(true)
    login(DEMO_EMAIL, DEMO_PASSWORD)
    finish('Camille')
  }

  const q = params.get('redirect') ? `?redirect=${encodeURIComponent(redirect)}` : ''

  return (
    <AuthShell
      title="Connexion"
      subtitle="Heureux de vous revoir. Votre prochaine commande n’attend que vous."
      image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&h=1200&fit=crop"
      quote="Les meilleures adresses de votre quartier, livrées chez vous."
    >
      <Button type="button" variant="soft" size="lg" className="w-full" onClick={demo} disabled={loading}>
        <Sparkles aria-hidden /> Connexion démo<span className="hidden sm:inline"> (Camille Martin)</span>
      </Button>
      <OrDivider />
      <form onSubmit={submit} noValidate className="space-y-4">
        {errors.form && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive" role="alert">
            {errors.form}
          </p>
        )}
        <FormField id="login-email" label="Adresse e-mail" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="h-11"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((x) => ({ ...x, email: undefined, form: undefined }))
            }}
            aria-invalid={!!errors.email}
            aria-describedby="login-email-msg"
          />
        </FormField>
        <FormField id="login-password" label="Mot de passe" error={errors.password}>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((x) => ({ ...x, password: undefined, form: undefined }))
            }}
            aria-invalid={!!errors.password}
            aria-describedby="login-password-msg"
          />
        </FormField>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-brand-700 hover:underline"
            onClick={() => toast('Lien de réinitialisation envoyé', { description: 'Fonction simulée dans cette démo.' })}
          >
            Mot de passe oublié ?
          </button>
        </div>
        <Button type="submit" variant="ink" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to={`/inscription${q}`} className="font-semibold text-ink hover:underline">
          Créer un compte
        </Link>
      </p>
      <DemoNotice />
    </AuthShell>
  )
}
