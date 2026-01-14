/**
 * Payzone Payment Actions
 * Server actions for handling Payzone card payments
 */

'use server'

import { auth } from '@/auth'
import {
  payzoneService,
  PayzoneService,
} from '@/services/payzone-service'
import { payzoneConfig } from '@/lib/payzone-config'
import {
  PayzonePaymentInitRequest,
  PayzonePaymentStatus,
  isPayzoneError,
  PayzonePaymentRecord,
} from '@/types/payzone-types'
import { revalidatePath } from 'next/cache'

interface InitiatePaymentParams {
  orderId: string
  amount: number // Amount in MAD (decimal)
  description?: string
  customerEmail: string
  customerPhone?: string
  customerFirstName?: string
  customerLastName?: string
  metadata?: Record<string, any>
}

interface InitiatePaymentResult {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  orderId?: string
  error?: string
  errorCode?: string
}

/**
 * Initiate a card payment with Payzone
 */
export async function initiateCardPayment(
  params: InitiatePaymentParams
): Promise<InitiatePaymentResult> {
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

    // Convert amount to cents
    const amountInCents =
      PayzoneService.amountToCents(
        params.amount
      )

    // Prepare payment request
    const paymentRequest: Omit<
      PayzonePaymentInitRequest,
      'merchantId' | 'paymentMethod'
    > = {
      amount: amountInCents,
      currency: 'MAD',
      orderId: params.orderId,
      description:
        params.description ||
        `Order ${params.orderId}`,
      customer: {
        email: params.customerEmail,
        phone: params.customerPhone,
        firstName:
          params.customerFirstName,
        lastName:
          params.customerLastName,
      },
      callbackUrl:
        payzoneConfig.payment
          .callbackUrl,
      returnUrl:
        payzoneConfig.payment.returnUrl,
      cancelUrl:
        payzoneConfig.payment.cancelUrl,
      errorUrl:
        payzoneConfig.payment.errorUrl,
      metadata: {
        ...params.metadata,
        userId: session.user.id,
        organizationId:
          session.user.organizationId,
      },
      language:
        payzoneConfig.payment.language,
    }

    // Initialize payment with Payzone
    const response =
      await payzoneService.initializePayment(
        paymentRequest
      )

    if (isPayzoneError(response)) {
      console.error(
        'Payzone payment initialization failed:',
        response.error
      )
      return {
        success: false,
        error: response.error.message,
        errorCode: response.error.code,
      }
    }

    // TODO: Store payment record in database
    // await savePaymentRecord({
    //   transactionId: response.transactionId,
    //   orderId: response.orderId,
    //   userId: session.user.id,
    //   organizationId: session.user.organizationId,
    //   amount: params.amount,
    //   currency: 'MAD',
    //   status: PayzonePaymentStatus.PENDING,
    //   paymentMethod: 'CARD',
    //   customerEmail: params.customerEmail,
    //   customerPhone: params.customerPhone,
    //   customerFirstName: params.customerFirstName,
    //   customerLastName: params.customerLastName,
    //   paymentUrl: response.paymentUrl,
    //   metadata: params.metadata,
    //   expiresAt: new Date(response.expiresAt),
    //   initiatedAt: new Date(),
    // })

    return {
      success: true,
      transactionId:
        response.transactionId,
      paymentUrl: response.paymentUrl,
      orderId: response.orderId,
    }
  } catch (error) {
    console.error(
      'Error initiating payment:',
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
 * Verify payment status
 */
export async function verifyPayment(
  transactionId: string
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

    const response =
      await payzoneService.verifyPayment(
        transactionId
      )

    if (isPayzoneError(response)) {
      return {
        success: false,
        error: response.error.message,
        errorCode: response.error.code,
      }
    }

    // TODO: Update payment record in database
    // await updatePaymentRecord(transactionId, {
    //   status: response.status,
    //   paidAt: response.paidAt ? new Date(response.paidAt) : undefined,
    //   cardBrand: response.card?.brand,
    //   cardLast4: response.card?.last4,
    //   errorMessage: response.errorMessage,
    //   errorCode: response.errorCode,
    // })

    // Revalidate relevant paths
    if (
      response.status ===
      PayzonePaymentStatus.SUCCESS
    ) {
      revalidatePath('/payments')
      revalidatePath('/orders')
    }

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error(
      'Error verifying payment:',
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
 * Get payment status
 */
export async function getPaymentStatus(
  transactionId: string
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

    const response =
      await payzoneService.getPaymentStatus(
        transactionId
      )

    if (isPayzoneError(response)) {
      return {
        success: false,
        error: response.error.message,
        errorCode: response.error.code,
      }
    }

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error(
      'Error getting payment status:',
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
 * Refund a payment
 */
export async function refundPayment(
  transactionId: string,
  amount: number,
  reason?: string
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

    // Convert amount to cents
    const amountInCents =
      PayzoneService.amountToCents(
        amount
      )

    const response =
      await payzoneService.refundPayment(
        transactionId,
        amountInCents,
        reason
      )

    if (isPayzoneError(response)) {
      return {
        success: false,
        error: response.error.message,
        errorCode: response.error.code,
      }
    }

    // TODO: Update payment record in database with refund info
    // await updatePaymentRecord(transactionId, {
    //   status: PayzonePaymentStatus.REFUNDED,
    //   refundId: response.refundId,
    //   refundAmount: amount,
    //   refundedAt: new Date(response.refundedAt),
    //   refundReason: reason,
    // })

    revalidatePath('/payments')

    return {
      success: true,
      data: response,
    }
  } catch (error) {
    console.error(
      'Error refunding payment:',
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
 * Generate a unique order ID
 */
export async function generateOrderId(
  prefix: string = 'ORD'
): Promise<string> {
  return PayzoneService.generateOrderId(
    prefix
  )
}
