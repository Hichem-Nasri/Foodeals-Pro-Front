/**
 * QR Code Scanner Component
 * Uses html5-qrcode library for camera access and QR scanning
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { X, Camera, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type QRScanResult = {
  data: string
  success: boolean
}

type QRCodeScannerProps = {
  onScan: (result: string) => void
  onClose: () => void
  isScanning?: boolean
  className?: string
}

export function QRCodeScanner({
  onScan,
  onClose,
  isScanning = true,
  className,
}: QRCodeScannerProps) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isScanning || isInitialized) return

    const qrCodeScanner = new Html5Qrcode('qr-reader')
    setScanner(qrCodeScanner)

    const startScanning = async () => {
      try {
        // Request camera permission
        const cameras = await Html5Qrcode.getCameras()
        
        if (cameras && cameras.length > 0) {
          setHasPermission(true)
          
          // Use back camera if available (better for scanning)
          const cameraId = cameras.find(camera => 
            camera.label.toLowerCase().includes('back')
          )?.id || cameras[0].id

          await qrCodeScanner.start(
            cameraId,
            {
              fps: 10, // Frames per second for scanning
              qrbox: { width: 250, height: 250 }, // Scanning box size
              aspectRatio: 1.0,
            },
            (decodedText) => {
              // Success callback - QR code scanned
              console.log('[QRScanner] Scanned:', decodedText)
              onScan(decodedText)
            },
            (errorMessage) => {
              // Error callback - usually just "No QR code found"
              // Don't show these errors as they're normal
            }
          )
          
          setIsInitialized(true)
          setError(null)
        } else {
          setHasPermission(false)
          setError('No cameras found on this device')
        }
      } catch (err) {
        console.error('[QRScanner] Error starting scanner:', err)
        setHasPermission(false)
        setError(err instanceof Error ? err.message : 'Failed to start camera')
      }
    }

    startScanning()

    return () => {
      // Cleanup
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(console.error)
      }
    }
  }, [isScanning, onScan, isInitialized])

  const handleClose = () => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch(console.error)
    }
    onClose()
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Scanner Container */}
      <div className='relative'>
        <div 
          id='qr-reader' 
          ref={scannerRef}
          className='overflow-hidden rounded-lg'
        />
        
        {/* Permission Denied */}
        {hasPermission === false && (
          <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-coral-50 p-8 text-center'>
            <AlertCircle className='h-16 w-16 text-coral-500' />
            <div>
              <h3 className='text-lg font-semibold text-coral-900'>
                Camera Access Denied
              </h3>
              <p className='mt-2 text-sm text-coral-700'>
                {error || 'Please allow camera access in your browser settings to scan QR codes.'}
              </p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {hasPermission === null && (
          <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-lynch-50 p-8'>
            <Camera className='h-16 w-16 animate-pulse text-amethyst-500' />
            <p className='text-sm text-lynch-600'>Requesting camera access...</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      {hasPermission && (
        <div className='rounded-lg bg-amethyst-50 p-4'>
          <div className='flex items-start gap-3'>
            <Camera className='mt-0.5 h-5 w-5 text-amethyst-600' />
            <div className='text-sm text-amethyst-900'>
              <p className='font-medium'>Position the QR code within the frame</p>
              <p className='mt-1 text-amethyst-700'>
                The scanner will automatically detect and read the code
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Close Button */}
      <Button
        variant='outline'
        onClick={handleClose}
        className='w-full'
      >
        <X className='mr-2 h-4 w-4' />
        Cancel
      </Button>
    </div>
  )
}
