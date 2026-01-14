'use client'

/**
 * Payzone Paywall Component
 * Implements the iframe-based payment wall integration
 * Based on the official Payzone example
 */

import { useRef, useEffect, useState } from 'react'
import { payzonePaywallService } from '@/services/payzone-paywall-service'
import type { PayzoneFormData } from '@/types/payzone-types'

interface PayzonePaywallProps {
  customerId: string
  amount: number // Amount in MAD (e.g., 5 for 5 MAD)
  description: string
  customerCountry?: string
  customerLocale?: 'en_US' | 'fr_FR' | 'ar_MA'
  metadata?: Record<string, any>
  onComplete?: () => void
  onError?: (error: string) => void
  className?: string
}

export function PayzonePaywall({
  customerId,
  amount,
  description,
  customerCountry,
  customerLocale,
  metadata,
  onComplete,
  onError,
  className,
}: PayzonePaywallProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [paymentData, setPaymentData] = useState<PayzoneFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Generate unique charge ID
      const chargeId = payzonePaywallService.generateChargeId()

      // Create payment data
      const data = payzonePaywallService.createPaymentData({
        customerId,
        chargeId,
        price: amount.toString(),
        description,
        customerCountry,
        customerLocale,
        metadata,
      })

      setPaymentData(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to initialize payment:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to initialize payment')
      setIsLoading(false)
    }
  }, [customerId, amount, description, customerCountry, customerLocale, metadata, onError])

  useEffect(() => {
    // Auto-submit the form once payment data is ready
    if (paymentData && formRef.current) {
      formRef.current.submit()
    }
  }, [paymentData])

  // Listen for payment completion messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // TODO: Update this based on actual Payzone message format
      if (event.data?.type === 'PAYMENT_COMPLETE') {
        onComplete?.()
      } else if (event.data?.type === 'PAYMENT_ERROR') {
        onError?.(event.data.message)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onComplete, onError])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Initializing payment...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="text-center p-8 text-red-600">
        Failed to initialize payment. Please try again.
      </div>
    )
  }

  return (
    <>
      {/* Hidden form that auto-submits to the paywall */}
      <form
        ref={formRef}
        action={payzonePaywallService.getPaywallUrl()}
        method="POST"
        target="paywallFrame"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="payload" value={paymentData.payload} />
        <input type="hidden" name="signature" value={paymentData.signature} />
      </form>

      {/* iFrame that displays the paywall */}
      <iframe
        id="paywallFrame"
        name="paywallFrame"
        className={className}
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1000px',
          height: '100%',
          border: 'none',
          padding: 0,
          overflow: 'hidden',
          zIndex: 999999,
          display: 'block',
        }}
        title="Payzone Payment"
      />
    </>
  )
}

/**
 * Payzone Payment Button
 * Opens the paywall in a modal/popup
 */
interface PayzonePaymentButtonProps {
  customerId: string
  amount: number
  description: string
  buttonText?: string
  customerCountry?: string
  customerLocale?: 'en_US' | 'fr_FR' | 'ar_MA'
  metadata?: Record<string, any>
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
}

export function PayzonePaymentButton({
  customerId,
  amount,
  description,
  buttonText = 'Pay Now',
  customerCountry,
  customerLocale,
  metadata,
  onSuccess,
  onError,
  className,
}: PayzonePaymentButtonProps) {
  const [showPaywall, setShowPaywall] = useState(false)

  const handleComplete = () => {
    setShowPaywall(false)
    onSuccess?.()
  }

  const handleError = (error: string) => {
    setShowPaywall(false)
    onError?.(error)
  }

  return (
    <>
      <button
        onClick={() => setShowPaywall(true)}
        className={className || 'px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'}
      >
        {buttonText}
      </button>

      {showPaywall && (
        <div className="fixed inset-0 bg-black/50 z-[999998]">
          <div className="absolute top-4 right-4 z-[999999]">
            <button
              onClick={() => setShowPaywall(false)}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <PayzonePaywall
            customerId={customerId}
            amount={amount}
            description={description}
            customerCountry={customerCountry}
            customerLocale={customerLocale}
            metadata={metadata}
            onComplete={handleComplete}
            onError={handleError}
          />
        </div>
      )}
    </>
  )
}
