/**
 * Delivery Confirmation Dialog
 * Scans client QR code to confirm order delivery
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { QRCodeScanner } from '@/components/delivery/QRCodeScanner'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Loader2, Home } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { createMutationFn } from '@/utils/createQueryFn'
import { useRouter } from 'next/navigation'

type DeliveryConfirmationDialogProps = {
  open: boolean
  onClose: () => void
  deliveryId: string
  onSuccess?: () => void
}

type ValidationResponse = {
  valid: boolean
  message: string
  status?: string
}

export function DeliveryConfirmationDialog({
  open,
  onClose,
  deliveryId,
  onSuccess,
}: DeliveryConfirmationDialogProps) {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(true)
  const router = useRouter()

  // Validate QR code mutation
  const validateDeliveryMutation = useMutation({
    mutationFn: createMutationFn<ValidationResponse, { qrCode: string }>(
      `/deliveries/${deliveryId}/validate/delivery`,
      'POST'
    ),
    onSuccess: (data) => {
      console.log('[DeliveryDialog] Validation success:', data)
      if (data.valid) {
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          }
          handleClose()
          // Navigate to completed delivery screen or dashboard
          router.push('/delivery')
        }, 3000)
      }
    },
    onError: (error) => {
      console.error('[DeliveryDialog] Validation error:', error)
    },
  })

  const handleScan = (qrData: string) => {
    console.log('[DeliveryDialog] QR scanned:', qrData)
    setScanResult(qrData)
    setShowScanner(false)
    
    // Validate the scanned QR code
    validateDeliveryMutation.mutate({ qrCode: qrData })
  }

  const handleClose = () => {
    setScanResult(null)
    setShowScanner(true)
    validateDeliveryMutation.reset()
    onClose()
  }

  const handleRetry = () => {
    setScanResult(null)
    setShowScanner(true)
    validateDeliveryMutation.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Home className='h-5 w-5 text-amethyst-500' />
            Confirm Client Delivery
          </DialogTitle>
          <DialogDescription>
            Scan the client's QR code to confirm successful delivery
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {/* QR Scanner */}
          {showScanner && (
            <QRCodeScanner
              onScan={handleScan}
              onClose={handleClose}
              isScanning={open}
            />
          )}

          {/* Loading State */}
          {validateDeliveryMutation.isPending && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-amethyst-50 p-8'>
              <Loader2 className='h-12 w-12 animate-spin text-amethyst-500' />
              <p className='text-sm text-amethyst-900'>Validating QR code...</p>
            </div>
          )}

          {/* Success State */}
          {validateDeliveryMutation.isSuccess && validateDeliveryMutation.data.valid && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-success-50 p-8'>
              <CheckCircle2 className='h-16 w-16 text-success-500' />
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-success-900'>
                  Delivery Completed!
                </h3>
                <p className='mt-2 text-sm text-success-700'>
                  {validateDeliveryMutation.data.message}
                </p>
                <p className='mt-1 text-xs text-success-600'>
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {(validateDeliveryMutation.isError || 
            (validateDeliveryMutation.isSuccess && !validateDeliveryMutation.data.valid)) && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-coral-50 p-8'>
              <AlertCircle className='h-16 w-16 text-coral-500' />
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-coral-900'>
                  Invalid QR Code
                </h3>
                <p className='mt-2 text-sm text-coral-700'>
                  {validateDeliveryMutation.isError 
                    ? 'Failed to validate QR code. Please try again.'
                    : validateDeliveryMutation.data?.message || 'The QR code is invalid or expired.'}
                </p>
              </div>
              <Button onClick={handleRetry} variant='outline' className='mt-2'>
                Scan Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
