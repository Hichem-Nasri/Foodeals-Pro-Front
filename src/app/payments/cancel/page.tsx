/**
 * Payment Cancelled Page
 * User is redirected here when payment is cancelled
 */

'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Home, RotateCcw } from 'lucide-react'

function PaymentCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            You have cancelled the payment process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <p className="text-xs text-center text-muted-foreground">
            No charges were made to your card
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-md py-16" />}>
      <PaymentCancelContent />
    </Suspense>
  )
}
