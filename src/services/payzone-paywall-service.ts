/**
 * Payzone Paywall Service
 * Based on the official Payzone paywall integration example
 * This service generates the payload and signature for form POST submission
 */

import crypto from 'crypto'
import {
  payzoneConfig,
  validatePayzoneConfig,
} from '@/lib/payzone-config'
import {
  PayzonePaywallPayload,
  PayzoneFormData,
} from '@/types/payzone-types'

class PayzonePaywallService {
  private merchantAccount: string
  private secretKey: string
  private paywallUrl: string

  constructor() {
    validatePayzoneConfig()
    this.merchantAccount =
      payzoneConfig.merchant.account
    this.secretKey =
      payzoneConfig.merchant.secretKey
    this.paywallUrl =
      payzoneConfig.paywallUrl
  }

  /**
   * Generate SHA256 signature for the payload
   * Matches PHP: hash('sha256', $paywallSecretKey . $json_payload)
   */
  generateSignature(
    jsonPayload: string
  ): string {
    const dataToSign =
      this.secretKey + jsonPayload
    return crypto
      .createHash('sha256')
      .update(dataToSign, 'utf8')
      .digest('hex')
  }

  /**
   * Create payment payload and signature
   * This prepares the data for form POST submission to the paywall
   */
  createPaymentData(params: {
    customerId: string
    chargeId: string
    price: string // Amount as string (e.g., '5' for 5 MAD)
    description: string
    customerCountry?: string
    customerLocale?: string
    metadata?: Record<string, any>
  }): PayzoneFormData {
    // Build the payload matching the PHP example structure
    const payload: PayzonePaywallPayload =
      {
        // Authentication parameters
        merchantAccount:
          this.merchantAccount,
        timestamp: Math.floor(
          Date.now() / 1000
        ),
        skin: payzoneConfig.payment
          .skin,

        // Customer parameters
        customerId: params.customerId,
        customerCountry:
          params.customerCountry ||
          payzoneConfig.payment
            .customerCountry,
        customerLocale:
          params.customerLocale ||
          payzoneConfig.payment
            .customerLocale,

        // Charge parameters
        chargeId: params.chargeId,
        price: params.price,
        currency: 'MAD',
        description: params.description,

        // Deep linking
        mode: 'DEEP_LINK',
        paymentMethod: 'CREDIT_CARD',
        showPaymentProfiles:
          payzoneConfig.payment
            .showPaymentProfiles
            ? 'true'
            : 'false',
        flowCompletionUrl:
          payzoneConfig.payment
            .flowCompletionUrl,

        // Add any additional metadata
        ...params.metadata,
      }

    // Convert to JSON and generate signature
    const jsonPayload =
      JSON.stringify(payload)
    const signature =
      this.generateSignature(
        jsonPayload
      )

    return {
      payload: jsonPayload,
      signature: signature,
    }
  }

  /**
   * Get the paywall URL where the form should be submitted
   */
  getPaywallUrl(): string {
    return this.paywallUrl
  }

  /**
   * Generate a unique charge ID
   * Matches PHP: time() or a custom format
   */
  generateChargeId(
    prefix: string = 'CHG'
  ): string {
    const timestamp = Date.now()
    const random = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  /**
   * Verify callback signature (if Payzone sends callbacks with signatures)
   * Note: Check actual Payzone documentation for callback signature format
   */
  verifyCallbackSignature(
    payload: string,
    receivedSignature: string
  ): boolean {
    const expectedSignature =
      this.generateSignature(payload)
    return (
      expectedSignature ===
      receivedSignature
    )
  }
}

// Export singleton instance
export const payzonePaywallService =
  new PayzonePaywallService()

// Export class for testing
export default PayzonePaywallService
