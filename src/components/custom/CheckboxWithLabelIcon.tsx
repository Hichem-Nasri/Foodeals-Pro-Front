'use client'

import { Label } from '../ui/label'
import { cn } from '@/lib/utils'
import { Check, LucideIcon } from 'lucide-react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import React from 'react'
import { Checkbox } from '../ui/checkbox'

interface CheckboxWithLabelIconProps
  extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  label: string
  icon: LucideIcon
  color?: ColorsT
}

export const CheckboxWithLabelIcon = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxWithLabelIconProps
>(({ label, className, color = 'green', ...props }, ref) => {
  return (
    <div className='w-full'>
      <Checkbox
        ref={ref}
        className={cn('peer sr-only pointer-events-none', className)}
        {...props}
      />
      <Label
        htmlFor={props.id}
        className={cn(
          'flex cursor-pointer items-center gap-3 rounded-[12px] bg-lynch-50 px-3 py-4 leading-none outline-none outline-2 peer-focus-visible:outline-2 peer-focus-visible:outline-lynch-300 peer-disabled:cursor-default peer-disabled:opacity-100'
        )}
      >
        <props.icon className={getActiveColorClassName(color)} />
        <span className='text-lg font-normal text-lynch-500'>{label}</span>
        {/* {!props.disabled && ( */}
        <>
          {!props.checked && (
            <span className='ml-auto size-5 rounded-[6px] border-2 border-lynch-300' />
          )}
          {props.checked && (
            <span
              className={cn(
                'ml-auto flex size-5 items-center justify-center rounded-[6px]',
                getActiveColorClassName(color, 'bg')
              )}
            >
              <Check className='text-white' size={10} strokeWidth={4} />
            </span>
          )}
        </>
        {/* )} */}
      </Label>
    </div>
  )
})
CheckboxWithLabelIcon.displayName = 'CheckboxWithLabelIcon'
