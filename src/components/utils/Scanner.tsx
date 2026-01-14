// components/Scanner.tsx

import React, { use, useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { QrCode } from 'lucide-react'
import { useMediaQuery } from 'react-responsive'
import { useMutation } from '@tanstack/react-query'
import { appApi } from '@/lib/routes'
import api from '@/utils/api'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

interface ScannerProps {
  handleScanProduct: (data: any) => void
  open: boolean
  color?: ColorsT
}

const Scanner: React.FC<ScannerProps> = ({
  handleScanProduct,
  open,
  color = 'green',
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
  const webcamRef = useRef<Webcam>(null)
  const [error, setError] = useState('')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const ColorClassName = {
    bg: getActiveColorClassName(color).replace('text', 'bg'),
    text: getActiveColorClassName(color),
    border: getActiveColorClassName(color).replace('text', 'border'),
  }
  const Reset = () => {
    setImageSrc(null)
    setError('')
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (data: any) => {
      try {
        const formData = new FormData()
        formData.append('file', data)
        const response = await api
          .post(appApi.scanProduct, formData)
          .then((res) => res.data)
          .catch((error) => {
            throw new Error(error)
          })
        return response
      } catch (error) {
        throw new Error('Error uploading image')
      }
    },
    onSuccess: (data: any) => {
      handleScanProduct(data)
    },
    onError: () => {
      setError('Failed to upload image')
    },
  })

  const takeScreenshotAndSend = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setError('')
        const saveImageLocally = (imageSrc: string) => {
          const link = document.createElement('a')
          link.href = imageSrc
          link.download = 'image.jpg'
          link.click()
        }

        saveImageLocally(imageSrc)
        const file = new File([imageSrc], 'image.jpg', {
          type: 'image/jpeg',
        })
        mutate(file)
      } else {
        setError('Failed to take screenshot')
      }
    }
  }

  useEffect(() => {
    if (!open) {
      Reset()
    }
  }, [open])

  const videoConstraints = isMobile
    ? { facingMode: { exact: 'environment' } }
    : { facingMode: 'environment' }

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center lg:hidden'>
      {error && <p className='text-red-500'>{error}</p>}
      <div className='absolute inset-0 h-full w-full lg:h-80 lg:w-96'>
        <Webcam
          ref={webcamRef}
          screenshotFormat='image/jpeg'
          videoConstraints={{
            ...videoConstraints,
            width: window.innerWidth,
            height: window.innerHeight,
          }}
          className='h-full w-full object-cover'
          onUserMedia={() => console.log('Webcam started')}
          onUserMediaError={(error: any) => {
            console.error('Webcam error:', error)
            setError('Camera access was denied or is not available.')
          }}
        />
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='relative h-52 w-80'>
          {/* Corner Borders */}
          <div
            className={`absolute h-8 w-8 rounded-tl-lg border-l-4 border-t-4 ${ColorClassName.border}`}
            style={{ top: '10%', left: '10%' }}
          ></div>
          <div
            className={`absolute h-8 w-8 rounded-tr-lg border-r-4 border-t-4 ${ColorClassName.border}`}
            style={{ top: '10%', right: '10%' }}
          ></div>
          <div
            className={`absolute h-8 w-8 rounded-bl-lg border-b-4 border-l-4 ${ColorClassName.border}`}
            style={{ bottom: '10%', left: '10%' }}
          ></div>
          <div
            className={`absolute h-8 w-8 rounded-br-lg border-b-4 border-r-4 ${ColorClassName.border}`}
            style={{ bottom: '10%', right: '10%' }}
          ></div>

          {/* Middle Top and Bottom Lines */}
          <div
            className={`absolute w-6 border-t-4 ${ColorClassName.border}`}
            style={{ top: '10%', left: 'calc(50% - 12px)' }}
          ></div>
          <div
            className={`absolute w-6 border-b-4 ${ColorClassName.border}`}
            style={{ bottom: '10%', left: 'calc(50% - 12px)' }}
          ></div>

          <div className='animate-scan-line absolute left-0 right-0 top-0 mx-auto flex h-full w-64 items-center justify-center bg-gradient-to-b from-transparent via-primary/20 to-transparent px-2'>
            <div
              className={`h-1 w-full rounded-full ${ColorClassName.bg}`}
            ></div>
          </div>
        </div>
      </div>
      {error && (
        <p className='absolute top-4 z-50 text-center text-red-500'>{error}</p>
      )}
      <button
        type='button'
        disabled={isPending}
        onClick={takeScreenshotAndSend}
        className='absolute bottom-[10%] left-1/2 flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-primary p-4 font-bold text-white transition-colors disabled:bg-lynch-500'
      >
        <QrCode size={28} />
      </button>
    </div>
  )
}

export default Scanner
