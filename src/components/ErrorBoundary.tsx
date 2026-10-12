import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-800">Une erreur est survenue</h2>
            <p className="mt-2 text-sm text-slate-500">
              Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer ou retourner à l'accueil.
            </p>
            {this.state.error && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left">
                <p className="text-xs font-mono text-red-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
