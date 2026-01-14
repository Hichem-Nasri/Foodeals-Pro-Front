import {
  NextRequest,
  NextResponse,
} from 'next/server'
import crypto from 'crypto'

/**
 * Payzone Webhook Handler
 * Receives real-time notifications when payment status changes
 * Based on PayzonePaywallTutorial.pdf section 7
 */

interface PayzoneNotification {
  id: string // chargeId
  internalId: string // Payzone's internal ID
  status:
    | 'CHARGED'
    | 'AUTHORIZED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'FAILED'
  merchantAccount: string
  lineItem: {
    amount: number
    currency: string
    description: string
    taxCode?: string
    taxIncludedInPrice?: boolean
  }
  transactions: Array<{
    timestamp: string
    gatewayProvidedId: string
    type:
      | 'CHARGE'
      | 'AUTHORIZE'
      | 'SETTLE'
      | 'AUTH_REVERSAL'
      | 'REFUND'
    state:
      | 'APPROVED'
      | 'DECLINED'
      | 'ERROR'
    amount: number
    currency: string
    resultCode: number
    responseText: string
  }>
  paymentType: 'CREDIT_CARD'
  paymentMethod: string // e.g., 'Visa', 'Mastercard'
  created: string
  amountRemaining: number
}

/**
 * Validate webhook signature using HMAC-SHA256
 * Based on PHP example:
 * $signature = hash_hmac('sha256', $input, $notificationKey);
 */
function validateSignature(
  payload: string,
  receivedSignature: string
): boolean {
  const notificationKey =
    process.env.PAYZONE_NOTIFICATION_KEY

  if (!notificationKey) {
    console.error(
      'PAYZONE_NOTIFICATION_KEY is not configured'
    )
    return false
  }

  // Calculate expected signature
  const expectedSignature = crypto
    .createHmac(
      'sha256',
      notificationKey
    )
    .update(payload, 'utf8')
    .digest('hex')

  // Case-insensitive comparison (as in PHP example)
  return (
    expectedSignature.toLowerCase() ===
    receivedSignature.toLowerCase()
  )
}

/**
 * Update backend payment status
 */
async function updatePaymentStatus(
  notification: PayzoneNotification
) {
  const backendUrl =
    process.env.NEXT_PUBLIC_BASE_URL

  if (!backendUrl) {
    console.error(
      'NEXT_PUBLIC_BASE_URL is not configured'
    )
    return {
      success: false,
      error:
        'Backend URL not configured',
    }
  }

  try {
    const response = await fetch(
      `${backendUrl}/v1/payments/payzone-webhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          chargeId: notification.id,
          internalId:
            notification.internalId,
          status: notification.status,
          amount:
            notification.lineItem
              .amount,
          currency:
            notification.lineItem
              .currency,
          paymentMethod:
            notification.paymentMethod,
          transactions:
            notification.transactions,
          created: notification.created,
        }),
      }
    )

    if (!response.ok) {
      const errorText =
        await response.text()
      console.error(
        'Backend update failed:',
        response.status,
        errorText
      )
      return {
        success: false,
        error: errorText,
      }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error(
      'Failed to update backend:',
      error
    )
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * POST /api/payments/webhook
 * Receives Payzone notifications
 */
export async function POST(
  request: NextRequest
) {
  try {
    // 1. Read raw body (needed for signature validation)
    const body = await request.text()

    // 2. Get signature from header
    const receivedSignature =
      request.headers.get(
        'X-callback-signature'
      )

    if (!receivedSignature) {
      console.error(
        'Missing X-callback-signature header'
      )
      return NextResponse.json(
        {
          error:
            'Missing signature header',
        },
        { status: 400 }
      )
    }

    // 3. Validate signature
    const isValid = validateSignature(
      body,
      receivedSignature
    )

    if (!isValid) {
      console.error(
        'Invalid webhook signature'
      )
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // 4. Parse notification
    const notification: PayzoneNotification =
      JSON.parse(body)

    console.log(
      'Payzone notification received:',
      {
        id: notification.id,
        status: notification.status,
        amount:
          notification.lineItem.amount,
        currency:
          notification.lineItem
            .currency,
      }
    )

    // 5. Process based on status
    switch (notification.status) {
      case 'CHARGED':
        // Payment successful - update backend
        const updateResult =
          await updatePaymentStatus(
            notification
          )

        if (!updateResult.success) {
          console.error(
            'Failed to update payment status:',
            updateResult.error
          )
          // Still return 200 to avoid retries for backend errors
        } else {
          console.log(
            'Payment status updated successfully:',
            notification.id
          )
        }
        break

      case 'AUTHORIZED':
        // Payment authorized but not captured yet
        console.log(
          'Payment authorized (not captured):',
          notification.id
        )
        // TODO: Update backend with AUTHORIZED status
        break

      case 'CANCELLED':
        // Payment cancelled
        console.log(
          'Payment cancelled:',
          notification.id
        )
        // TODO: Update backend with CANCELLED status
        break

      case 'REFUNDED':
        // Payment refunded
        console.log(
          'Payment refunded:',
          notification.id
        )
        // TODO: Update backend with REFUNDED status
        break

      case 'FAILED':
        // Payment failed
        console.log(
          'Payment failed:',
          notification.id
        )
        // TODO: Update backend with FAILED status
        break

      default:
        console.warn(
          'Unknown payment status:',
          notification.status
        )
    }

    // 6. Return 200 to acknowledge receipt
    // IMPORTANT: Payzone will retry if not 200
    return NextResponse.json(
      { received: true },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      'Webhook processing error:',
      error
    )

    // Return 200 even on error to prevent retries for parsing errors
    // Only return non-200 for temporary issues (db down, etc)
    return NextResponse.json(
      { error: 'Processing error' },
      { status: 200 }
    )
  }
}

/**
 * GET /api/payments/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Payzone webhook endpoint',
    configured:
      !!process.env
        .PAYZONE_NOTIFICATION_KEY,
  })
}
