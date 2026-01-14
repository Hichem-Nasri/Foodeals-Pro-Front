import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import React, { useId } from 'react'

interface InputWithCurrancyProps
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
  currancy?: string
}

export const InputWithCurrancy = React.forwardRef<
  HTMLInputElement,
  InputWithCurrancyProps
>(
  (
    {
      value,
      onChange,
      label,
      min = 0,
      max = 999999,
      currancy = 'DH',
      className,
      ...props
    },
    ref
  ) => {
    const id = useId()
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange?.(newValue)
      }
    }

    return (
      <div className='flex w-full items-stretch overflow-hidden rounded-[12px] bg-lynch-50 pl-3 text-sm text-lynch-400'>
        <Input
          {...props}
          id={id}
          ref={ref}
          type='text'
          value={value?.toString()?.padStart(2, '0')! || ''}
          onChange={handleInputChange}
          className='w-[2ch] p-0'
          style={{
            width: `${value?.toString().length >= 2 ? value?.toString().length : 2}ch`,
          }}
        />
        <Label htmlFor={id} className='flex flex-1 items-center text-sm'>
          {currancy}
        </Label>
      </div>
    )
  }
)
InputWithCurrancy.displayName = 'InputWithCurrancy'
