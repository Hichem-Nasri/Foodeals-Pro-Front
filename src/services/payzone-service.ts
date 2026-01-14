/**
 * Payzone Payment Service
 * Handles all Payzone API interactions for card payments
 */

import crypto from 'crypto'
import {
  payzoneConfig,
  validatePayzoneConfig,
} from '@/lib/payzone-config'
import {
  PayzonePaymentInitRequest,
  PayzonePaymentInitResponse,
  PayzonePaymentVerifyRequest,
  PayzonePaymentVerifyResponse,
  PayzoneRefundRequest,
  PayzoneRefundResponse,
  PayzonePaymentStatusRequest,
  PayzoneApiResponse,
  isPayzoneError,
  PayzonePaymentCallback,
  PayzonePaymentMethod,
} from '@/types/payzone-types'

class PayzoneService {
  private baseUrl: string
  private merchantId: string
  private apiKey: string
  private secretKey: string

  constructor() {
    validatePayzoneConfig()
    this.baseUrl = payzoneConfig.baseUrl
    this.merchantId =
      payzoneConfig.merchant.id
    this.apiKey =
      payzoneConfig.merchant.apiKey
    this.secretKey =
      payzoneConfig.merchant.secretKey
  }

  /**
   * Generate HMAC signature for request authentication
   */
  private generateSignature(
    data: Record<string, any>
  ): string {
    const sortedKeys =
      Object.keys(data).sort()
    const signatureString = sortedKeys
      .map(
        (key) => `${key}=${data[key]}`
      )
      .join('&')

    return crypto
      .createHmac(
        'sha256',
        this.secretKey
      )
      .update(signatureString)
      .digest('hex')
  }

  /**
   * Verify webhook signature
   */
  public verifyWebhookSignature(
    payload: PayzonePaymentCallback,
    receivedSignature: string
  ): boolean {
    const { signature, ...data } =
      payload
    const calculatedSignature =
      this.generateSignature(data)
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(receivedSignature)
    )
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: Record<string, any>
  ): Promise<PayzoneApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const timestamp =
        Date.now().toString()

      const requestData = {
        merchantId: this.merchantId,
        timestamp,
        ...body,
      }

      const signature =
        this.generateSignature(
          requestData
        )

      const headers: HeadersInit = {
        'Content-Type':
          'application/json',
        'X-Payzone-Api-Key':
          this.apiKey,
        'X-Payzone-Signature':
          signature,
        'X-Payzone-Timestamp':
          timestamp,
      }

      const options: RequestInit = {
        method,
        headers,
      }

      if (method === 'POST' && body) {
        options.body = JSON.stringify(
          requestData
        )
      }

      const response = await fetch(
        url,
        options
      )
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code:
              data.code ||
              'UNKNOWN_ERROR',
            message:
              data.message ||
              'An error occurred',
            details: data,
          },
        }
      }

      return data
    } catch (error) {
      console.error(
        'Payzone API request failed:',
        error
      )
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Network error',
        },
      }
    }
  }

  /**
   * Initialize a card payment
   */
  async initializePayment(
    request: Omit<
      PayzonePaymentInitRequest,
      'merchantId' | 'paymentMethod'
    >
  ): Promise<
    PayzoneApiResponse<PayzonePaymentInitResponse>
  > {
    const endpoint =
      payzoneConfig.endpoints
        .initPayment

    const payload: PayzonePaymentInitRequest =
      {
        ...request,
        merchantId: this.merchantId,
        paymentMethod:
          PayzonePaymentMethod.CARD,
        currency: 'MAD',
      }

    return this.makeRequest<PayzonePaymentInitResponse>(
      endpoint,
      'POST',
      payload
    )
  }

  /**
   * Verify payment status
   */
  async verifyPayment(
    transactionId: string
  ): Promise<
    PayzoneApiResponse<PayzonePaymentVerifyResponse>
  > {
    const endpoint =
      payzoneConfig.endpoints
        .verifyPayment

    const payload: PayzonePaymentVerifyRequest =
      {
        transactionId,
        merchantId: this.merchantId,
      }

    return this.makeRequest<PayzonePaymentVerifyResponse>(
      endpoint,
      'POST',
      payload
    )
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(
    transactionId: string
  ): Promise<
    PayzoneApiResponse<PayzonePaymentVerifyResponse>
  > {
    const endpoint = `${payzoneConfig.endpoints.paymentStatus}/${transactionId}`

    const payload: PayzonePaymentStatusRequest =
      {
        transactionId,
        merchantId: this.merchantId,
      }

    return this.makeRequest<PayzonePaymentVerifyResponse>(
      endpoint,
      'GET',
      payload
    )
  }

  /**
   * Refund a payment (full or partial)
   */
  async refundPayment(
    transactionId: string,
    amount: number,
    reason?: string
  ): Promise<
    PayzoneApiResponse<PayzoneRefundResponse>
  > {
    const endpoint =
      payzoneConfig.endpoints.refund

    const payload: PayzoneRefundRequest =
      {
        transactionId,
        merchantId: this.merchantId,
        amount,
        reason,
      }

    return this.makeRequest<PayzoneRefundResponse>(
      endpoint,
      'POST',
      payload
    )
  }

  /**
   * Convert amount to smallest currency unit (cents)
   * Example: 100.50 MAD -> 10050
   */
  public static amountToCents(
    amount: number
  ): number {
    return Math.round(amount * 100)
  }

  /**
   * Convert amount from smallest currency unit to decimal
   * Example: 10050 -> 100.50 MAD
   */
  public static centsToAmount(
    cents: number
  ): number {
    return cents / 100
  }

  /**
   * Generate unique order ID
   */
  public static generateOrderId(
    prefix: string = 'ORD'
  ): string {
    const timestamp = Date.now()
    const random = Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }
}

// Export singleton instance
export const payzoneService =
  new PayzoneService()

// Export class for testing
export { PayzoneService }
