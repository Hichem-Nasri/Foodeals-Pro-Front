/**
 * Pickup Confirmation Dialog
 * Scans store QR code to confirm order pickup
 */

'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { QRCodeScanner } from '@/components/delivery/QRCodeScanner'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Loader2, Package } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { createMutationFn } from '@/utils/createQueryFn'

type PickupConfirmationDialogProps = {
  open: boolean
  onClose: () => void
  deliveryId: string
  onSuccess: () => void
}

type ValidationResponse = {
  valid: boolean
  message: string
  hasTakenOrderFromStore?: boolean
}

export function PickupConfirmationDialog({
  open,
  onClose,
  deliveryId,
  onSuccess,
}: PickupConfirmationDialogProps) {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(true)

  // Validate QR code mutation
  const validatePickupMutation = useMutation({
    mutationFn: createMutationFn<ValidationResponse, { qrCode: string }>(
      `/deliveries/${deliveryId}/validate/pickup`,
      'POST'
    ),
    onSuccess: (data) => {
      console.log('[PickupDialog] Validation success:', data)
      if (data.valid) {
        setTimeout(() => {
          onSuccess()
          handleClose()
        }, 2000)
      }
    },
    onError: (error) => {
      console.error('[PickupDialog] Validation error:', error)
    },
  })

  const handleScan = (qrData: string) => {
    console.log('[PickupDialog] QR scanned:', qrData)
    setScanResult(qrData)
    setShowScanner(false)
    
    // Validate the scanned QR code
    validatePickupMutation.mutate({ qrCode: qrData })
  }

  const handleClose = () => {
    setScanResult(null)
    setShowScanner(true)
    validatePickupMutation.reset()
    onClose()
  }

  const handleRetry = () => {
    setScanResult(null)
    setShowScanner(true)
    validatePickupMutation.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5 text-amethyst-500' />
            Confirm Store Pickup
          </DialogTitle>
          <DialogDescription>
            Scan the store's QR code to confirm you've picked up the order
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
          {validatePickupMutation.isPending && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-amethyst-50 p-8'>
              <Loader2 className='h-12 w-12 animate-spin text-amethyst-500' />
              <p className='text-sm text-amethyst-900'>Validating QR code...</p>
            </div>
          )}

          {/* Success State */}
          {validatePickupMutation.isSuccess && validatePickupMutation.data.valid && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-success-50 p-8'>
              <CheckCircle2 className='h-16 w-16 text-success-500' />
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-success-900'>
                  Pickup Confirmed!
                </h3>
                <p className='mt-2 text-sm text-success-700'>
                  {validatePickupMutation.data.message}
                </p>
                <p className='mt-1 text-xs text-success-600'>
                  Redirecting to client delivery...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {(validatePickupMutation.isError || 
            (validatePickupMutation.isSuccess && !validatePickupMutation.data.valid)) && (
            <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-coral-50 p-8'>
              <AlertCircle className='h-16 w-16 text-coral-500' />
              <div className='text-center'>
                <h3 className='text-lg font-semibold text-coral-900'>
                  Invalid QR Code
                </h3>
                <p className='mt-2 text-sm text-coral-700'>
                  {validatePickupMutation.isError 
                    ? 'Failed to validate QR code. Please try again.'
                    : validatePickupMutation.data?.message || 'The QR code is invalid or expired.'}
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
