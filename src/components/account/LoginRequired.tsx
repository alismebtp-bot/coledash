import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/shared/EmptyState'

export default function LoginRequired({ redirect, title, description }: { redirect: string; title: string; description: string }) {
  const q = `?redirect=${encodeURIComponent(redirect)}`
  return (
    <EmptyState
      icon={Lock}
      title={title}
      description={description}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="ink">
            <Link to={`/connexion${q}`}>Se connecter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/inscription${q}`}>Créer un compte</Link>
          </Button>
        </div>
      }
    />
  )
}
