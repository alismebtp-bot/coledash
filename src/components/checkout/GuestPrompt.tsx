import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/components/account/demo'

export default function GuestPrompt({ onContinue }: { onContinue: () => void }) {
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-brand-50 to-card p-4 shadow-soft sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm">
          <UserRound className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-ink">Déjà client ? Gagnez du temps</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Connectez-vous pour retrouver vos adresses et cumuler des points fidélité sur cette commande.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="ink">
              <Link to="/connexion?redirect=/commande">Se connecter</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/inscription?redirect=/commande">Créer un compte</Link>
            </Button>
            <Button
              size="sm"
              variant="soft"
              onClick={() => {
                login(DEMO_EMAIL, DEMO_PASSWORD)
                toast.success('Connectée en tant que Camille Martin (démo)')
                navigate('/commande', { replace: true })
              }}
            >
              <Sparkles aria-hidden /> Connexion démo
            </Button>
            <Button size="sm" variant="ghost" onClick={onContinue}>
              Continuer sans compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
