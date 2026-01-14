'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface PriceReductionSliderProps {
  value: number
  onChange?: (value: number) => void
  initialPrice?: number
  className?: string
  label?: string
  disabled?: boolean
}

const PriceReductionSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  PriceReductionSliderProps
>(
  (
    {
      value,
      onChange,
      initialPrice = 0,
      label = 'Réduction',
      className,
      disabled = false,
    },
    ref
  ) => {
    const handleValueChange = (newValue: number[]) => {
      onChange?.(newValue[0])
    }

    const calculatedPrice = initialPrice * (1 - value / 100)

    return (
      <div
        className={cn(
          'flex gap-3',
          {
            'items-center': disabled,
          },
          className
        )}
      >
        <div
          className={cn('flex flex-1 flex-col items-start justify-between', {
            // 'flex-1': disabled,
          })}
        >
          <div
            className={cn('flex items-center gap-2.5 text-sm font-medium', {
              'w-full flex-col items-start': disabled,
            })}
          >
            <Label>{label}</Label>
            {disabled ? (
              <div
                className={cn(
                  'rounded-[12px] bg-lynch-50 px-3 py-4 font-normal text-lynch-500',
                  {
                    'w-full text-center': disabled,
                  }
                )}
              >
                {value}%
              </div>
            ) : (
              <Badge
                variant='secondary'
                className='bg-mountain-400 px-3 py-1.5 text-white hover:bg-mountain-400'
              >
                {value}%
              </Badge>
            )}
          </div>
          {!disabled && (
            <SliderPrimitive.Root
              ref={ref}
              className='relative mb-2 flex w-full touch-none select-none items-center'
              value={[value]}
              onValueChange={handleValueChange}
              max={100}
              step={1}
              disabled={disabled}
            >
              <SliderPrimitive.Track className='relative top-1/2 h-[3px] w-full grow -translate-y-1/2 rounded-full bg-lynch-200'>
                <SliderPrimitive.Range className='absolute h-[6px] rounded-full bg-mountain-400' />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className='block size-[22.5px] rounded-full border-[3.5px] border-tulip-50 bg-mountain-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
            </SliderPrimitive.Root>
          )}
        </div>

        <div
          className={cn('flex items-center justify-end', {
            'flex-1 items-start justify-start': disabled,
          })}
        >
          <div className={cn('flex flex-col gap-3', { 'w-full': disabled })}>
            <Label className='text-sm font-medium'>Prix de</Label>
            <div
              className={cn(
                'rounded-[12px] bg-lynch-50 px-3 py-4 font-normal text-lynch-500',
                { 'w-full text-center': disabled }
              )}
            >
              {calculatedPrice.toFixed(0)} Dh
            </div>
          </div>
        </div>
      </div>
    )
  }
)
PriceReductionSlider.displayName = 'PriceReductionSlider'

export { PriceReductionSlider }
export type { PriceReductionSliderProps }
