/**
 * Card Payment Component
 * Handles Payzone card payment initiation and processing
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { initiateCardPayment, generateOrderId } from '@/actions/payments/payzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard } from 'lucide-react'

interface CardPaymentProps {
  amount: number
  description?: string
  orderId?: string
  customerEmail: string
  customerPhone?: string
  customerFirstName?: string
  customerLastName?: string
  metadata?: Record<string, any>
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
}

export function CardPayment({
  amount,
  description,
  orderId,
  customerEmail,
  customerPhone,
  customerFirstName,
  customerLastName,
  metadata,
  onSuccess,
  onError,
}: CardPaymentProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      // Generate order ID if not provided
      const finalOrderId = orderId || await generateOrderId('PAY')

      // Initiate payment
      const result = await initiateCardPayment({
        orderId: finalOrderId,
        amount,
        description,
        customerEmail,
        customerPhone,
        customerFirstName,
        customerLastName,
        metadata,
      })

      if (!result.success) {
        setError(result.error || 'Payment initialization failed')
        onError?.(result.error || 'Payment initialization failed')
        return
      }

      // Redirect to Payzone payment page
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        setError('Payment URL not received')
        onError?.('Payment URL not received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Card Payment
        </CardTitle>
        <CardDescription>
          Secure payment via Payzone
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <div className="text-2xl font-bold">
            {amount.toFixed(2)} MAD
          </div>
        </div>

        {description && (
          <div className="space-y-2">
            <Label>Description</Label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {amount.toFixed(2)} MAD
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You will be redirected to Payzone secure payment page
        </p>
      </CardContent>
    </Card>
  )
}

/**
 * Simple Card Payment Button
 */
interface CardPaymentButtonProps {
  amount: number
  orderId?: string
  customerEmail: string
  customerPhone?: string
  customerFirstName?: string
  customerLastName?: string
  description?: string
  metadata?: Record<string, any>
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
}

export function CardPaymentButton({
  amount,
  orderId,
  customerEmail,
  customerPhone,
  customerFirstName,
  customerLastName,
  description,
  metadata,
  className,
  variant = 'default',
  size = 'default',
  children,
}: CardPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    try {
      setIsProcessing(true)

      const finalOrderId = orderId || await generateOrderId('PAY')

      const result = await initiateCardPayment({
        orderId: finalOrderId,
        amount,
        description,
        customerEmail,
        customerPhone,
        customerFirstName,
        customerLastName,
        metadata,
      })

      if (result.success && result.paymentUrl) {
        window.location.href = result.paymentUrl
      } else {
        alert(result.error || 'Payment initialization failed')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      variant={variant}
      size={size}
      className={className}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay with Card
          </>
        )
      )}
    </Button>
  )
}
