import type { Tone } from '@/components/portal/PortalUI'
import type { OrderStatus } from '@/types'
import type { TicketPriority, TicketStatus, VendorStatus } from '@/data/portals/admin'

export const ORDER_TONES: Record<OrderStatus, Tone> = {
  confirmed: 'info',
  preparing: 'warning',
  picked_up: 'brand',
  delivering: 'brand',
  delivered: 'success',
  cancelled: 'danger',
}

export const VENDOR_TONES: Record<VendorStatus, Tone> = { actif: 'success', suspendu: 'danger', en_attente: 'warning' }
export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = { actif: 'Actif', suspendu: 'Suspendu', en_attente: 'En attente' }

export const TICKET_STATUS_TONES: Record<TicketStatus, Tone> = { ouvert: 'info', en_attente: 'warning', resolu: 'success' }
export const TICKET_PRIORITY_TONES: Record<TicketPriority, Tone> = { basse: 'neutral', normale: 'info', haute: 'warning', urgente: 'danger' }

export const compactEur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', notation: 'compact', maximumFractionDigits: 1 })
