/**
 * Payzone Payment Callback Handler
 * API route for handling Payzone payment webhooks/callbacks
 * Integrates with backend validation endpoint
 */

import {
  NextRequest,
  NextResponse,
} from 'next/server'
import { payzoneService } from '@/services/payzone-service'
import {
  PayzonePaymentCallback,
  PayzonePaymentStatus,
} from '@/types/payzone-types'
import api from '@/utils/api'

/**
 * Handle Payzone payment callback
 * POST /api/payments/callback
 */
export async function POST(
  request: NextRequest
) {
  try {
    // Parse callback payload
    const payload: PayzonePaymentCallback =
      await request.json()

    // Get signature from headers
    const signature =
      request.headers.get(
        'X-Payzone-Signature'
      )

    if (!signature) {
      console.error(
        'Missing signature in callback'
      )
      return NextResponse.json(
        {
          success: false,
          error: 'Missing signature',
        },
        { status: 401 }
      )
    }

    // Verify signature
    const isValidSignature =
      payzoneService.verifyWebhookSignature(
        payload,
        signature
      )

    if (!isValidSignature) {
      console.error(
        'Invalid signature in callback'
      )
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid signature',
        },
        { status: 401 }
      )
    }

    // Log callback for debugging
    console.log(
      'Payzone callback received:',
      {
        transactionId:
          payload.transactionId,
        orderId: payload.orderId,
        status: payload.status,
        amount: payload.amount,
      }
    )

    // Extract backend payment ID from metadata
    const backendPaymentId =
      payload.metadata?.backendPaymentId

    if (!backendPaymentId) {
      console.error(
        'Missing backend payment ID in metadata'
      )
      return NextResponse.json(
        {
          success: false,
          error: 'Missing payment ID',
        },
        { status: 400 }
      )
    }

    // Handle different payment statuses
    switch (payload.status) {
      case PayzonePaymentStatus.SUCCESS:
        // Payment successful - validate with backend
        console.log(
          `Payment successful: ${payload.transactionId}`
        )

        try {
          // Call backend validation endpoint
          const validationResponse =
            await api.post(
              `/v1/payments/${backendPaymentId}/validate`
            )

          if (
            [200, 201].includes(
              validationResponse.status
            )
          ) {
            console.log(
              'Backend payment validated successfully'
            )

            // TODO: Send confirmation email
            // TODO: Update order status
            // TODO: Trigger any post-payment workflows
          } else {
            console.error(
              'Backend validation failed:',
              validationResponse.status
            )
          }
        } catch (error) {
          console.error(
            'Error validating payment with backend:',
            error
          )
        }
        break

      case PayzonePaymentStatus.FAILED:
        // Payment failed - log error
        console.log(
          `Payment failed: ${payload.transactionId}`
        )

        // TODO: Update payment status in backend to FAILED
        // TODO: Notify user of failure
        // TODO: Log failure reason
        break

      case PayzonePaymentStatus.CANCELLED:
        // Payment cancelled by user
        console.log(
          `Payment cancelled: ${payload.transactionId}`
        )

        // TODO: Update payment status in backend to CANCELLED
        // TODO: Release any reserved resources
        break

      case PayzonePaymentStatus.EXPIRED:
        // Payment session expired
        console.log(
          `Payment expired: ${payload.transactionId}`
        )

        // TODO: Update payment status in backend to EXPIRED
        // TODO: Clean up expired payment sessions
        break

      default:
        console.log(
          `Payment status: ${payload.status}`
        )
    }

    // Return success response to Payzone
    return NextResponse.json(
      { success: true, received: true },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      'Error processing payment callback:',
      error
    )
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Internal error',
      },
      { status: 500 }
    )
  }
}

/**
 * Health check endpoint
 * GET /api/payments/callback
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      message:
        'Payzone callback endpoint is active',
    },
    { status: 200 }
  )
}
