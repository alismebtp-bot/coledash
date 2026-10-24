export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown'

export interface CardState {
  number: string
  expiry: string
  cvc: string
  name: string
}

export const EMPTY_CARD: CardState = { number: '', expiry: '', cvc: '', name: '' }

export function detectBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, '')
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  return 'unknown'
}

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  unknown: 'Carte',
}

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (detectBrand(digits) === 'amex') {
    const d = digits.slice(0, 15)
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(' ')
  }
  return digits
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function formatExpiry(raw: string, previous: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  // Suppression du « / » : on retire aussi le chiffre précédent
  if (raw.length < previous.length && previous.endsWith('/') && digits.length === 2) return digits.slice(0, 1)
  if (digits.length === 1 && Number(digits) > 1) return `0${digits} / `
  if (digits.length >= 2) return `${digits.slice(0, 2)} / ${digits.slice(2)}`.trimEnd()
  return digits
}

function luhn(digits: string): boolean {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

export type CardErrors = Partial<Record<keyof CardState, string>>

export function validateCard(card: CardState, now = new Date()): CardErrors {
  const errors: CardErrors = {}
  const digits = card.number.replace(/\D/g, '')
  const brand = detectBrand(digits)
  const expected = brand === 'amex' ? 15 : 16
  if (digits.length !== expected || !luhn(digits)) errors.number = 'Numéro de carte invalide.'

  const m = card.expiry.replace(/\s/g, '').match(/^(\d{2})\/(\d{2})$/)
  if (!m) errors.expiry = 'Format MM / AA.'
  else {
    const month = Number(m[1])
    const year = 2000 + Number(m[2])
    const endOfMonth = new Date(year, month, 1)
    if (month < 1 || month > 12) errors.expiry = 'Mois invalide.'
    else if (endOfMonth <= now) errors.expiry = 'Cette carte a expiré.'
  }

  const cvcLen = brand === 'amex' ? 4 : 3
  if (!new RegExp(`^\\d{${cvcLen}}$`).test(card.cvc)) errors.cvc = `${cvcLen} chiffres au dos de la carte.`
  if (card.name.trim().length < 3) errors.name = 'Nom tel qu’inscrit sur la carte.'
  return errors
}
