export const DEMO_EMAIL = 'camille.martin@exemple.fr'
export const DEMO_PASSWORD = 'coledash'

/** Only allow internal redirects (avoid open redirect via ?redirect=). */
export function safeRedirect(value: string | null, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
