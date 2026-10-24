export type VendorKind = 'restaurant' | 'grocery' | 'flowers' | 'retail'

export interface CartItem {
  /** Unique line key: same product with different options = different line. */
  key: string
  productId: string
  vendorId: string
  vendorName: string
  vendorKind: VendorKind
  vendorDeliveryFee: number
  vendorMinOrder: number
  name: string
  image?: string
  unitPrice: number
  quantity: number
  /** Human readable option labels, e.g. ["Grande", "Sans oignon"]. */
  options?: string[]
  note?: string
}

export type OrderStatus = 'confirmed' | 'preparing' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled'

export interface Address {
  id: string
  label: string
  line1: string
  postalCode: string
  city: string
  instructions?: string
}

export type PaymentMethod = 'card' | 'apple_pay' | 'paypal' | 'cash'

export interface Order {
  id: string
  /** Short public number, e.g. "CD-48213". */
  number: string
  createdAt: string
  /** Owner; undefined for guest checkouts. */
  userId?: string
  vendorId: string
  vendorName: string
  vendorKind: VendorKind
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  serviceFee: number
  tip: number
  discount: number
  total: number
  address: Address
  paymentMethod: PaymentMethod
  /** Scheduled delivery (ISO) or undefined for ASAP. */
  scheduledFor?: string
  /** Gift message, used for flower orders. */
  giftMessage?: string
  recipientName?: string
  cancelled?: boolean
  rating?: number
}

export type UserRole = 'customer' | 'merchant' | 'driver' | 'admin'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  loyaltyPoints: number
  createdAt: string
}
