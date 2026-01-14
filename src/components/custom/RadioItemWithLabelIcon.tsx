'use client'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Circle, type LucideIcon } from 'lucide-react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import React, { useId } from 'react'
import { RadioGroupItem } from '@/components/ui/radio-group'

interface RadioItemWithLabelIconProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupItem>, 'id'> {
  label: string
  icon: LucideIcon
  color?: ColorsT
}

export const RadioItemWithLabelIcon = React.forwardRef<
  React.ElementRef<typeof RadioGroupItem>,
  RadioItemWithLabelIconProps
>(({ label, className, color = 'green', ...props }, ref) => {
  const id = useId()
  return (
    <div className='relative w-full'>
      <RadioGroupItem
        ref={ref}
        className={cn('peer sr-only pointer-events-none', className)}
        id={id}
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          'flex items-center gap-3 rounded-[12px] bg-lynch-50 px-3 py-4 leading-none outline-none outline-2 peer-focus-visible:outline-2 peer-focus-visible:outline-lynch-300 peer-disabled:opacity-100'
        )}
      >
        <props.icon className={getActiveColorClassName(color)} />
        <span className='text-lg font-normal text-lynch-500'>{label}</span>
        {!props.checked && (
          <span className='ml-auto size-5 rounded-full border-2 border-lynch-400' />
        )}
        {props.checked && (
          <span
            className={cn(
              'ml-auto flex size-5 items-center justify-center rounded-full border-2',
              getActiveColorClassName(color, 'border')
            )}
          >
            <Circle
              className={getActiveColorClassName(color)}
              size={11}
              fill='currentColor'
            />
          </span>
        )}
      </Label>
    </div>
  )
})

RadioItemWithLabelIcon.displayName = 'RadioItemWithLabelIcon'
