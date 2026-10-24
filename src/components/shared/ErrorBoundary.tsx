import { Component, type ErrorInfo, type ReactNode } from 'react'

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur non gérée', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="text-5xl" aria-hidden>
          🍳
        </p>
        <h1 className="text-2xl font-bold text-ink">Oups, quelque chose a brûlé en cuisine</h1>
        <p className="max-w-md text-muted-foreground">Une erreur inattendue s'est produite. Rechargez la page pour réessayer.</p>
        <div className="flex gap-2">
          <button className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
            Recharger
          </button>
          <a className="rounded-lg border px-4 py-2 text-sm font-semibold text-ink" href="/">
            Accueil
          </a>
        </div>
      </div>
    )
  }
}
