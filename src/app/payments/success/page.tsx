/**
 * Payment Success Page
 * User is redirected here after successful payment
 * Integrates with backend validation
 */

'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { validatePayment } from '@/actions/payments/process-payment'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Home, Receipt } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const paymentId = searchParams.get('paymentId')
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (paymentId) {
      verifyPaymentStatus()
    } else {
      setError('Payment ID not found')
      setIsVerifying(false)
    }
  }, [paymentId, transactionId])

  const verifyPaymentStatus = async () => {
    try {
      if (!paymentId) return

      // Validate payment with backend (and Payzone if transactionId is present)
      const result = await validatePayment(paymentId, transactionId || undefined)

      if (result.success && result.data) {
        setPaymentData(result.data)
      } else {
        setError(result.error || 'Payment verification failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification error')
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="container mx-auto max-w-md py-16">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Verifying payment...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-md py-16">
        <Card>
          <CardHeader>
            <CardTitle>Verification Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push('/')} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed and validated successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment ID</span>
                <span className="text-sm font-mono">{paymentId}</span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="text-sm font-mono">{transactionId}</span>
              </div>
            )}
            {paymentData?.message && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-semibold text-green-600">
                  {paymentData.message}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button onClick={() => router.push('/subscriptions')} className="w-full" size="lg">
              <Receipt className="mr-2 h-4 w-4" />
              View Subscriptions
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-md py-16" />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
