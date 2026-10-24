const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const num = new Intl.NumberFormat('fr-FR')

export function formatPrice(value: number): string {
  return eur.format(value)
}

export function formatNumber(value: number): string {
  return num.format(value)
}

export function formatDate(value: string | number | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(value).toLocaleDateString('fr-FR', options ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(value: string | number | Date): string {
  return new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatRelative(value: string | number | Date): string {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  return days === 1 ? 'hier' : `il y a ${days} jours`
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count > 1 ? plural : singular}`
}
