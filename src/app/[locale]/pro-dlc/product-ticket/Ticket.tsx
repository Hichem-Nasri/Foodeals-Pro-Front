'use client'
// components/TicketCard.tsx
import React, { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'
import JsBarcode from 'jsbarcode'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useValuationTranslations } from '@/hooks/useTranslations'

interface BarcodeProps {
  value: string
  width?: number
  height?: number
  displayValue?: boolean
  className?: string
}

const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 2,
  height = 100,
  displayValue = true,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        width,
        height,
        margin: 0,
      })
    }
  }, [value, width, height, displayValue])

  return <svg ref={svgRef} className={className}></svg>
}

interface ProductCardsProps {
  name: string
  description: string
  barcode: string
  oldPrice: number
  newPrice: number
  imageSaved: string
  setImageSaved: React.Dispatch<React.SetStateAction<string>>
}

const TicketCard: React.FC<ProductCardsProps> = ({
  name,
  description,
  barcode,
  oldPrice,
  newPrice,
  imageSaved,
  setImageSaved,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Generate the image and store its URL
  useEffect(() => {
    if (cardRef.current && imageSaved == '') {
      // cardRef.current.style.display = 'flex'
      toPng(cardRef.current)
        .then((dataUrl) => {
          setImageSaved(dataUrl)
        })
        .catch((error) => {
          console.error('Error generating image:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [cardRef.current, imageSaved]) // Only run when cardRef changes

  return (
    <div className='relative flex flex-col items-center justify-center gap-3 p-2'>
      {/* {isLoading && (
                    <div className='absolute z-50 h-[468px] w-[1130px] overflow-hidden rounded-xl bg-white shadow-xl'>
                            <Skeleton className='h-full w-full bg-lynch-50' />
                    </div>
            )} */}
      {/* Generated Image Display */}
      {imageSaved ? (
        <img
          key={imageSaved} // Add key prop to force re-render
          src={imageSaved}
          alt='Generated Product Card'
          className='mt-4 aspect-[1130/468] w-full rounded-xl object-cover'
        />
      ) : (
        <div className='h-[calc( absolute top-0 z-50 aspect-[1130/468] w-full overflow-hidden rounded-[30px] bg-white p-4 shadow-xl'>
          <Skeleton className='h-full w-full bg-lynch-50' />
        </div>
      )}

      <div
        className={cn(
          'absolute left-[9999px] flex h-full w-full',
          imageSaved != '' && 'hidden'
        )}
      >
        <FoodDealsTicket
          name={name}
          description={description}
          barcode={barcode}
          oldPrice={oldPrice}
          newPrice={newPrice}
          ref={cardRef}
        />
      </div>
    </div>
  )
}

export default TicketCard

interface ProductCardProps {
  name: string
  description: string
  barcode: string
  oldPrice: number
  newPrice: number
}

const FoodDealsTicket = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ name, description, barcode, oldPrice, newPrice }, ref) => {
    const t = useValuationTranslations()
    
    // useEffect(() => {
    //   JsBarcode('#barcode', barcode, {
    //     width: 2,
    //     height: 50,
    //     displayValue: true,
    //   })
    // }, [barcode])
    return (
      <div
        ref={ref}
        className='relative flex aspect-[1130/468] h-[468px] w-[1130px] justify-between rounded-[60px] bg-tulip-400'
      >
        {/* Header */}
        <div className='h-full w-[72%] rounded-[50px] border-b-[24px] border-l-[24px] border-t-[24px] border-tulip-400 bg-white'>
          <div className='mb-4 flex flex-col items-start justify-center gap-[30px] p-6'>
            <Image
              src='/icons/foodeals-hand.svg'
              alt='foodeals'
              className='w-[50%]'
              loading='lazy'
              width={100}
              height={20}
            />
            <div className='flex flex-1 justify-start gap-12'>
              {/* Circular Logo */}
              <div className='mb-4 flex w-full max-w-[25%] items-center justify-center'>
                <img
                  src='/icons/Global.svg'
                  alt='global'
                  className='aspect-square w-full'
                  loading='lazy'
                />
              </div>
              {/* Product Info */}
              <div className='flex w-full max-w-[60%] flex-1 flex-col gap-4'>
                <div className='mb-4 space-y-3'>
                  <h2 className='text-3xl font-bold text-gray-800'>{name}</h2>
                  <p className='line-clamp-3 h-fit w-full text-lg text-gray-600'>
                    {description} Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Iusto quo earum sed aliquid quod illo
                    velit vel expedita officiis ratione harum rem officia
                    placeat, maxime corrupti adipisci blanditiis, a eveniet.
                  </p>
                </div>
                {/* Barcode */}
                <div className='mt-4 text-center'>
                  <Barcode
                    value={barcode}
                    width={2}
                    height={50}
                    displayValue
                    className='w-48 font-mono text-gray-800'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex h-full w-full max-w-[28%]'>
          {/* Left Section */}

          {/* Right Section */}
          <div className='relative flex w-full flex-col items-end justify-center'>
            {/* Pricing */}
            <div className='mb-4 flex flex-col items-center'>
              <div className='absolute right-1 top-1 flex aspect-[61/52] h-[300px] w-[330px] flex-col items-center justify-center gap-2 rounded-ee-full rounded-es-full rounded-ss-full border-[22px] border-white bg-mountain-500 text-white'>
                <span className='mt-6 text-6xl font-bold'>
                  {newPrice.toFixed(2)}
                </span>
                <p className='text-3xl font-semibold text-white'>
                  {t('newPrice')}
                </p>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <div className='absolute -left-1 bottom-4 flex aspect-[61/52] h-[200px] w-[200px] flex-col items-center justify-center rounded-ee-full rounded-es-full rounded-se-full border-[12px] border-white bg-coral-500 text-white'>
                <span className='mt-10 text-5xl font-bold line-through'>
                  {oldPrice.toFixed(2)}
                </span>
                <p className='w-[90%] text-wrap text-center text-3xl font-semibold text-white'>
                  {t('oldPrice')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

FoodDealsTicket.displayName = 'FoodDealsTicket'
