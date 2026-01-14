/**
 * Payzone Card Payment Integration Examples
 * Demonstrates various use cases for the Payzone payment integration
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CardPayment, CardPaymentButton } from '@/components/payments/CardPayment'
import { initiateCardPayment, generateOrderId, verifyPayment, refundPayment, getPaymentStatus } from '@/actions/payments/payzone'
import { processPayment, validatePayment } from '@/actions/payments/process-payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

// ============================================================================
// Example 1: Basic Payment Button in Product Page
// ============================================================================

export function ProductPurchaseExample() {
  return (
    <div className="product-card">
      <h2>Premium Product</h2>
      <p className="price">250.00 MAD</p>
      
      <CardPaymentButton
        amount={250.00}
        customerEmail="customer@example.com"
        description="Premium Product Purchase"
        metadata={{
          productId: 'prod_123',
          productName: 'Premium Product',
        }}
      >
        Buy Now - 250.00 MAD
      </CardPaymentButton>
    </div>
  )
}

// ============================================================================
// Example 2: Full Payment Component in Checkout
// ============================================================================

interface CheckoutExampleProps {
  cart: {
    items: Array<{ id: string; name: string; price: number; quantity: number }>
    total: number
  }
  user: {
    email: string
    phone?: string
    firstName?: string
    lastName?: string
  }
}

export function CheckoutExample({ cart, user }: CheckoutExampleProps) {
  const router = useRouter()

  return (
    <div className="checkout-container">
      <div className="cart-summary">
        <h2>Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>{item.price * item.quantity} MAD</span>
          </div>
        ))}
        <div className="total">
          <strong>Total: {cart.total} MAD</strong>
        </div>
      </div>

      <CardPayment
        amount={cart.total}
        description={`Order with ${cart.items.length} items`}
        customerEmail={user.email}
        customerPhone={user.phone}
        customerFirstName={user.firstName}
        customerLastName={user.lastName}
        metadata={{
          cartItems: cart.items.map(i => i.id),
          itemCount: cart.items.length,
        }}
        onSuccess={(transactionId) => {
          console.log('Payment successful!', transactionId)
          router.push(`/orders/confirmation?transaction=${transactionId}`)
        }}
        onError={(error) => {
          console.error('Payment failed:', error)
          alert(`Payment failed: ${error}`)
        }}
      />
    </div>
  )
}

// ============================================================================
// Example 3: Custom Payment Flow with Order Creation
// ============================================================================

interface Order {
  id?: string
  items: Array<{ productId: string; quantity: number; price: number }>
  total: number
  userId: string
}

export function CustomPaymentFlow() {
  const [isProcessing, setIsProcessing] = useState(false)

  const createOrderAndPay = async (order: Order) => {
    try {
      setIsProcessing(true)

      // 1. Generate unique order ID
      const orderId = await generateOrderId('ORD')

      // 2. Create order in your database (your API call)
      const createdOrder = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order,
          orderId,
          status: 'PENDING_PAYMENT',
        }),
      }).then(res => res.json())

      // 3. Initiate payment
      const paymentResult = await initiateCardPayment({
        orderId: createdOrder.orderId,
        amount: order.total,
        description: `Order ${createdOrder.orderId}`,
        customerEmail: 'customer@example.com', // Get from session/user
        metadata: {
          orderId: createdOrder.id,
          itemCount: order.items.length,
        },
      })

      if (paymentResult.success && paymentResult.paymentUrl) {
        // 4. Save payment transaction ID to order
        await fetch(`/api/orders/${createdOrder.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: paymentResult.transactionId,
          }),
        })

        // 5. Redirect to Payzone payment page
        window.location.href = paymentResult.paymentUrl
      } else {
        throw new Error(paymentResult.error || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Order creation/payment error:', error)
      alert('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button 
      onClick={() => createOrderAndPay({
        items: [
          { productId: 'prod_1', quantity: 2, price: 50.00 },
          { productId: 'prod_2', quantity: 1, price: 150.00 },
        ],
        total: 250.00,
        userId: 'user_123',
      })}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Complete Purchase'
      )}
    </Button>
  )
}

// ============================================================================
// Example 4: Subscription/Recurring Payment
// ============================================================================

export function SubscriptionPaymentExample() {
  const subscribeToPlan = async (planId: string, amount: number) => {
    const result = await initiateCardPayment({
      orderId: `SUB-${Date.now()}`,
      amount: amount,
      description: `Subscription to ${planId}`,
      customerEmail: 'subscriber@example.com',
      metadata: {
        type: 'SUBSCRIPTION',
        planId: planId,
        billingCycle: 'MONTHLY',
      },
    })

    if (result.success && result.paymentUrl) {
      window.location.href = result.paymentUrl
    }
  }

  return (
    <div className="subscription-plans">
      <div className="plan">
        <h3>Basic Plan</h3>
        <p>50 MAD/month</p>
        <button onClick={() => subscribeToPlan('basic', 50.00)}>
          Subscribe
        </button>
      </div>
      
      <div className="plan">
        <h3>Premium Plan</h3>
        <p>150 MAD/month</p>
        <button onClick={() => subscribeToPlan('premium', 150.00)}>
          Subscribe
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Payment Verification After Redirect
// ============================================================================

export function PaymentVerificationExample() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const verify = async () => {
      if (!transactionId) {
        setStatus('failed')
        return
      }

      const result = await verifyPayment(transactionId)

      if (result.success && result.data) {
        setPaymentData(result.data)
        setStatus('success')
        
        // Update your order status
        await fetch('/api/orders/update-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: result.data.transactionId,
            orderId: result.data.orderId,
            status: result.data.status,
          }),
        })
      } else {
        setStatus('failed')
      }
    }

    verify()
  }, [transactionId])

  if (status === 'loading') {
    return <div>Verifying payment...</div>
  }

  if (status === 'success') {
    return (
      <div>
        <h2>Payment Successful!</h2>
        <p>Transaction ID: {paymentData?.transactionId}</p>
        <p>Amount: {(paymentData?.amount / 100).toFixed(2)} MAD</p>
      </div>
    )
  }

  return <div>Payment verification failed</div>
}

// ============================================================================
// Example 6: Refund Processing (Admin Panel)
// ============================================================================

interface RefundExampleProps {
  transaction: {
    id: string
    orderId: string
    amount: number
    status: string
  }
}

export function RefundExample({ transaction }: RefundExampleProps) {
  const [refundAmount, setRefundAmount] = useState(transaction.amount)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const processRefund = async () => {
    if (!confirm(`Refund ${refundAmount} MAD to customer?`)) return

    setIsProcessing(true)

    try {
      const result = await refundPayment(
        transaction.id,
        refundAmount,
        reason || 'Customer request'
      )

      if (result.success) {
        alert('Refund processed successfully')
        // Refresh page or update UI
        window.location.reload()
      } else {
        alert(`Refund failed: ${result.error}`)
      }
    } catch (error) {
      alert('Refund processing error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="refund-form">
      <h3>Process Refund</h3>
      <p>Order: {transaction.orderId}</p>
      <p>Original Amount: {transaction.amount} MAD</p>

      <div>
        <label>Refund Amount (MAD)</label>
        <Input
          type="number"
          value={refundAmount}
          onChange={(e) => setRefundAmount(parseFloat(e.target.value))}
          max={transaction.amount}
          min={0}
          step={0.01}
        />
      </div>

      <div>
        <label>Reason (optional)</label>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Customer request, Defective product"
        />
      </div>

      <Button
        onClick={processRefund}
        disabled={isProcessing || refundAmount <= 0}
        variant="destructive"
      >
        {isProcessing ? 'Processing...' : `Refund ${refundAmount} MAD`}
      </Button>
    </div>
  )
}

// ============================================================================
// Example 7: Payment Status Checker
// ============================================================================

export function PaymentStatusChecker() {
  const [transactionId, setTransactionId] = useState('')
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    if (!transactionId) return

    setLoading(true)
    const result = await getPaymentStatus(transactionId)

    if (result.success && result.data) {
      setStatus(result.data)
    } else {
      alert('Failed to get payment status')
    }
    setLoading(false)
  }

  return (
    <div className="status-checker">
      <h3>Check Payment Status</h3>
      
      <div className="flex gap-2">
        <Input
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Enter transaction ID"
        />
        <Button onClick={checkStatus} disabled={loading || !transactionId}>
          {loading ? 'Checking...' : 'Check Status'}
        </Button>
      </div>

      {status && (
        <div className="status-result">
          <h4>Payment Details</h4>
          <p><strong>Status:</strong> {status.status}</p>
          <p><strong>Amount:</strong> {(status.amount / 100).toFixed(2)} MAD</p>
          <p><strong>Order ID:</strong> {status.orderId}</p>
          <p><strong>Customer:</strong> {status.customer.email}</p>
          {status.card && (
            <p><strong>Card:</strong> {status.card.brand} •••• {status.card.last4}</p>
          )}
          {status.paidAt && (
            <p><strong>Paid At:</strong> {new Date(status.paidAt).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 8: Multi-step Checkout with Payment
// ============================================================================

type Step = 'cart' | 'shipping' | 'payment'

export function MultiStepCheckout() {
  const [step, setStep] = useState<Step>('cart')
  const [orderData, setOrderData] = useState({
    items: [{ id: '1', name: 'Product 1', price: 100 }],
    shipping: { address: '', city: '', phone: '' },
    total: 100,
  })

  const proceedToPayment = async () => {
    const result = await initiateCardPayment({
      orderId: `ORD-${Date.now()}`,
      amount: orderData.total,
      description: 'Multi-step checkout order',
      customerEmail: 'customer@example.com',
      customerPhone: orderData.shipping.phone,
      metadata: {
        shippingAddress: orderData.shipping.address,
        shippingCity: orderData.shipping.city,
      },
    })

    if (result.success && result.paymentUrl) {
      window.location.href = result.paymentUrl
    }
  }

  return (
    <div className="multi-step-checkout">
      {step === 'cart' && (
        <div>
          <h2>Shopping Cart</h2>
          {/* Cart items */}
          <button onClick={() => setStep('shipping')}>Continue to Shipping</button>
        </div>
      )}

      {step === 'shipping' && (
        <div>
          <h2>Shipping Information</h2>
          {/* Shipping form */}
          <button onClick={() => setStep('payment')}>Continue to Payment</button>
        </div>
      )}

      {step === 'payment' && (
        <div>
          <h2>Payment</h2>
          <p>Total: {orderData.total} MAD</p>
          <button onClick={proceedToPayment}>Pay Now</button>
        </div>
      )}
    </div>
  )
}
