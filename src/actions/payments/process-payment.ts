/**
 * Payment Processing Actions
 * Integrates backend payment endpoints with Payzone for card payments
 */

'use server'

import { auth } from '@/auth'
import api from '@/utils/api'
import {
  payzoneService,
  PayzoneService,
} from '@/services/payzone-service'
import { payzoneConfig } from '@/lib/payzone-config'
import {
  PaymentMethod,
  PaymentStatusType,
} from '@/types/payment-types'
import {
  PayzonePaymentStatus,
  isPayzoneError,
} from '@/types/payzone-types'
import { revalidatePath } from 'next/cache'

interface ProcessPaymentParams {
  subscriptionId: string
  paymentMethod: PaymentMethod
  amount: number
  currency?: string

  // Card payment fields
  cardHolderName?: string
  last4Digits?: string

  // Cheque payment fields
  chequeNumber?: string

  // Customer info
  customerEmail?: string
  customerPhone?: string
  customerFirstName?: string
  customerLastName?: string
}

interface ProcessPaymentResult {
  success: boolean
  paymentId?: string
  redirectUrl?: string
  status?: string
  error?: string
  errorCode?: string
}

/**
 * Process payment - integrates with backend /v1/payments/process
 * For CARD payments, integrates with Payzone
 */
export async function processPayment(
  params: ProcessPaymentParams
): Promise<ProcessPaymentResult> {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error:
          'Unauthorized - Please login',
        errorCode: 'UNAUTHORIZED',
      }
    }

    // Prepare backend payment request
    const backendRequest = {
      subscriptionId:
        params.subscriptionId,
      paymentMethod:
        params.paymentMethod,
      amount: {
        amount: params.amount,
        currency:
          params.currency || 'MAD',
      },
      cardHolderName:
        params.cardHolderName,
      last4Digits: params.last4Digits,
      chequeNumber: params.chequeNumber,
    }

    // Call backend to create payment record
    const backendResponse =
      await api.post(
        '/v1/payments/process',
        backendRequest
      )

    if (
      ![200, 201].includes(
        backendResponse.status
      )
    ) {
      return {
        success: false,
        error:
          'Failed to process payment',
        errorCode: 'BACKEND_ERROR',
      }
    }

    const backendData =
      backendResponse.data

    // For CARD payments, integrate with Payzone
    if (
      params.paymentMethod ===
      PaymentMethod.CARD_BANK
    ) {
      // Generate order ID from backend payment ID
      const orderId = `PAY-${backendData.paymentId}`

      // Convert amount to cents
      const amountInCents =
        PayzoneService.amountToCents(
          params.amount
        )

      // Initialize Payzone payment
      const payzoneResponse =
        await payzoneService.initializePayment(
          {
            amount: amountInCents,
            currency: 'MAD',
            orderId: orderId,
            description: `Payment for subscription ${params.subscriptionId}`,
            customer: {
              email:
                params.customerEmail ||
                session.user.email ||
                '',
              phone:
                params.customerPhone,
              firstName:
                params.customerFirstName ||
                session.user.name?.split(
                  ' '
                )[0],
              lastName:
                params.customerLastName ||
                session.user.name?.split(
                  ' '
                )[1],
            },
            callbackUrl:
              payzoneConfig.payment
                .callbackUrl,
            returnUrl: `${payzoneConfig.payment.returnUrl}?paymentId=${backendData.paymentId}&transactionId={transactionId}`,
            cancelUrl: `${payzoneConfig.payment.cancelUrl}?paymentId=${backendData.paymentId}`,
            errorUrl:
              payzoneConfig.payment
                .errorUrl,
            metadata: {
              backendPaymentId:
                backendData.paymentId,
              subscriptionId:
                params.subscriptionId,
              userId: session.user.id,
              organizationId:
                session.user
                  .organizationId,
            },
            language:
              payzoneConfig.payment
                .language,
          }
        )

      if (
        isPayzoneError(payzoneResponse)
      ) {
        console.error(
          'Payzone initialization failed:',
          payzoneResponse.error
        )
        return {
          success: false,
          error:
            payzoneResponse.error
              .message,
          errorCode:
            payzoneResponse.error.code,
        }
      }

      // Return Payzone payment URL for redirect
      return {
        success: true,
        paymentId:
          backendData.paymentId,
        redirectUrl:
          payzoneResponse.paymentUrl,
        status: backendData.status,
      }
    }

    // For non-card payments (CASH, CHEQUE, TRANSFER)
    return {
      success: true,
      paymentId: backendData.paymentId,
      redirectUrl:
        backendData.redirectUrl,
      status: backendData.status,
    }
  } catch (error) {
    console.error(
      'Error processing payment:',
      error
    )
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      errorCode: 'INTERNAL_ERROR',
    }
  }
}

/**
 * Validate payment - integrates with backend /v1/payments/{paymentId}/validate
 */
export async function validatePayment(
  paymentId: string,
  transactionId?: string
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized',
        errorCode: 'UNAUTHORIZED',
      }
    }

    // If transactionId is provided, verify with Payzone first
    if (transactionId) {
      const payzoneResponse =
        await payzoneService.verifyPayment(
          transactionId
        )

      if (
        isPayzoneError(payzoneResponse)
      ) {
        return {
          success: false,
          error:
            payzoneResponse.error
              .message,
          errorCode:
            payzoneResponse.error.code,
        }
      }

      // Check if Payzone payment was successful
      if (
        payzoneResponse.status !==
        PayzonePaymentStatus.SUCCESS
      ) {
        return {
          success: false,
          error: `Payment not successful. Status: ${payzoneResponse.status}`,
          errorCode:
            'PAYMENT_NOT_SUCCESSFUL',
          data: payzoneResponse,
        }
      }
    }

    // Call backend to validate payment
    const response = await api.post(
      `/v1/payments/${paymentId}/validate`
    )

    if (
      ![200, 201].includes(
        response.status
      )
    ) {
      return {
        success: false,
        error:
          'Failed to validate payment',
        errorCode: 'BACKEND_ERROR',
      }
    }

    revalidatePath('/payments')
    revalidatePath('/subscriptions')

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(
      'Error validating payment:',
      error
    )
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      errorCode: 'INTERNAL_ERROR',
    }
  }
}

/**
 * Get payment statistics
 */
export async function getPaymentStatistics() {
  try {
    const response = await api.get(
      '/v1/payments/statistics'
    )

    if (
      ![200, 201].includes(
        response.status
      )
    ) {
      return {
        success: false,
        error:
          'Failed to fetch statistics',
        errorCode: 'BACKEND_ERROR',
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error(
      'Error fetching payment statistics:',
      error
    )
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
      errorCode: 'INTERNAL_ERROR',
    }
  }
}
