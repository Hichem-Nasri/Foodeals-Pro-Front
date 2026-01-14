/**
 * Payment Error Page
 * User is redirected here when payment encounters an error
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw, Phone } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function PaymentErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const errorMessage = searchParams.get('error')
  const errorCode = searchParams.get('errorCode')

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>
                {errorMessage}
                {errorCode && (
                  <span className="block mt-1 text-xs">Error code: {errorCode}</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {orderId && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="text-sm font-mono">{orderId}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={() => router.back()} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium">Need help?</p>
            <p className="text-xs text-muted-foreground">
              If you continue to experience issues, please contact our support team.
            </p>
            <Button onClick={() => router.push('/support')} variant="ghost" size="sm" className="w-full">
              <Phone className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            No charges were made to your card
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
