/**
 * Payzone Paywall Types and Interfaces
 * Based on Payzone Paywall Integration Example
 */

export enum PayzonePaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

/**
 * Payzone Paywall Payload
 * This matches the structure from launch_paywall.php example
 */
export interface PayzonePaywallPayload {
  // Authentication parameters
  merchantAccount: string
  timestamp: number
  skin: string // e.g., 'vps-1-vue'

  // Customer parameters
  customerId: string
  customerCountry: string // e.g., 'MA'
  customerLocale: string // e.g., 'en_US', 'fr_FR', 'ar_MA'

  // Charge parameters
  chargeId: string // Unique charge/transaction ID
  price: string // Amount as string (e.g., '5' for 5 MAD)
  currency: 'MAD'
  description: string

  // Deep linking
  mode: 'DEEP_LINK'
  paymentMethod: 'CREDIT_CARD'
  showPaymentProfiles: string // 'true' or 'false'
  flowCompletionUrl?: string // Optional redirect URL after payment

  // Optional metadata
  [key: string]: any
}

/**
 * Payzone form data for POST submission
 */
export interface PayzoneFormData {
  payload: string // JSON stringified PayzonePaywallPayload
  signature: string // SHA256 hash of secretKey + payload
}

/**
 * Payment callback/webhook response from Payzone
 * (Structure may vary based on actual Payzone implementation)
 */
export interface PayzonePaymentCallback {
  transactionId?: string
  chargeId?: string
  status:
    | 'SUCCESS'
    | 'FAILED'
    | 'CANCELLED'
  amount?: string
  currency?: string
  customerId?: string
  [key: string]: any
}

/**
 * Database record for storing payment transactions
 */
export interface PayzonePaymentRecord {
  id: string
  chargeId: string
  customerId: string
  amount: string
  currency: string
  status: PayzonePaymentStatus
  description?: string
  merchantAccount: string
  customerEmail?: string
  customerPhone?: string
  metadata?: Record<string, any>
  initiatedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Payment initialization request (for backend API)
 */
export interface PayzonePaymentInitRequest {
  amount: number
  customerId: string
  customerEmail: string
  customerPhone?: string
  description: string
  metadata?: Record<string, any>
}

/**
 * Error response
 */
export interface PayzoneErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

/**
 * Type guard for error response
 */
export function isPayzoneError(
  response: any
): response is PayzoneErrorResponse {
  return (
    response &&
    response.success === false &&
    response.error
  )
}
