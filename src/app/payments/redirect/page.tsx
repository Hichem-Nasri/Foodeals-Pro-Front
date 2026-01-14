'use client'

/**
 * Payment Redirect Handler Page
 * This page is loaded when Payzone redirects after payment completion
 * It should send a message to the parent window (iframe) and close
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function PaymentRedirectPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')

  useEffect(() => {
    // Extract payment status from URL parameters
    // Note: Update these parameter names based on actual Payzone redirect format
    const paymentStatus = searchParams.get('status')
    const transactionId = searchParams.get('transactionId') || searchParams.get('chargeId')
    
    // Determine the payment outcome
    if (paymentStatus === 'success' || paymentStatus === 'SUCCESS') {
      setStatus('success')
      
      // Notify parent window
      if (window.opener || window.parent !== window) {
        const message = {
          type: 'PAYMENT_COMPLETE',
          status: 'success',
          transactionId,
        }
        
        // Send to opener (if popup)
        if (window.opener) {
          window.opener.postMessage(message, window.location.origin)
        }
        
        // Send to parent (if iframe)
        window.parent.postMessage(message, window.location.origin)
      }
    } else if (paymentStatus === 'failed' || paymentStatus === 'FAILED' || paymentStatus === 'cancelled') {
      setStatus('failed')
      
      // Notify parent window
      if (window.opener || window.parent !== window) {
        const message = {
          type: 'PAYMENT_ERROR',
          status: 'failed',
          message: 'Payment failed or was cancelled',
        }
        
        if (window.opener) {
          window.opener.postMessage(message, window.location.origin)
        }
        
        window.parent.postMessage(message, window.location.origin)
      }
    }

    // Auto-close after a delay
    setTimeout(() => {
      if (window.opener) {
        window.close()
      }
    }, 3000)
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            <p className="text-sm text-gray-500">This window will close automatically...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">There was an issue processing your payment.</p>
            <p className="text-sm text-gray-500">This window will close automatically...</p>
          </>
        )}
      </div>
    </div>
  )
}
