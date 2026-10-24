import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-[7rem] font-extrabold leading-none text-brand-100 sm:text-[10rem]">404</p>
      <h1 className="-mt-6 text-3xl font-bold text-ink sm:-mt-10">Cette page a été livrée ailleurs</h1>
      <p className="mt-3 max-w-md text-muted-foreground">L’adresse que vous cherchez n’existe pas ou plus. Retrouvez vos commerces préférés depuis l’accueil.</p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/">Retour à l’accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/restaurants">Voir les restaurants</Link>
        </Button>
      </div>
    </div>
  )
}
