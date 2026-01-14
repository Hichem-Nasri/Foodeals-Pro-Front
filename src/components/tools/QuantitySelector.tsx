'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface QuantitySelectorProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  value: number
  onChange?: (value: number) => void
  label?: string
  min?: number
  max?: number
  className?: string
}

export const QuantitySelector = React.forwardRef<
  HTMLInputElement,
  QuantitySelectorProps
>(
  (
    { value, onChange, label, min = 0, max = 999, className, ...props },
    ref
  ) => {
    const handleIncrement = () => {
      if (value < max) {
        onChange?.(value + 1)
      }
    }

    const handleDecrement = () => {
      if (value > min) {
        onChange?.(value - 1)
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange?.(newValue)
      }
    }

    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {label && <Label className='text-sm font-medium'>{label}</Label>}
        <div className='flex items-center gap-2.5'>
          <Input
            {...props}
            ref={ref}
            type='text'
            value={value.toString().padStart(2, '0')}
            onChange={handleInputChange}
            className='flex-1 bg-lynch-50 text-center text-lynch-400'
          />
          {!props.disabled && (
            <>
              <PlusMinusButton
                sign='minus'
                handleClick={handleDecrement}
                disabled={value <= min}
                ariaLabel='Decrease quantity'
              />
              <PlusMinusButton
                sign='plus'
                handleClick={handleIncrement}
                disabled={value >= max}
                ariaLabel='Increase quantity'
              />
            </>
          )}
        </div>
      </div>
    )
  }
)
QuantitySelector.displayName = 'QuantitySelector'

function PlusMinusButton({
  handleClick,
  sign,
  disabled,
  ariaLabel = '',
}: {
  handleClick: () => void
  sign: 'plus' | 'minus'
  disabled: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type='button'
      onClick={handleClick}
      className='size-14 rounded-full border-2 border-mountain-500 bg-mountain-50 text-mountain-500 transition-all duration-150 hover:bg-mountain-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mountain-500 focus-visible:ring-offset-2 active:bg-mountain-400/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-mountain-50'
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {sign === 'plus' && <Plus className='mx-auto h-4 w-4' />}
      {sign === 'minus' && <Minus className='mx-auto h-4 w-4' />}
    </button>
  )
}

PlusMinusButton.displayName = 'PlusMinusButton'
