'use client'

import { FC, useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

interface DatePickerProps {
  id?: string
  onChange?: (date: Date | undefined) => void
  value?: Date
  disabled?: boolean
  myFormat?: string
  triggerClassName?: string
  iconClassName?: string
  placeholder?: string
  Icon?: LucideIcon
  color?: ColorsT
}

export const DatePicker: FC<DatePickerProps> = ({
  id,
  disabled,
  onChange,
  value = undefined,
  myFormat = 'MM/dd/yyyy',
  triggerClassName = '',
  iconClassName = '',
  placeholder = 'Pick a date',
  Icon,
  color = 'green',
}) => {
  const [date, setDate] = useState<Date | undefined>(value)
  // const bg = getActiveColorClassName(color, 'bg')
  // const text = getActiveColorClassName(color)
  // const hover = getActiveColorClassName(color, 'hover')
  // const focus = hover.replace('hover', 'focus')
  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'h-14 w-full justify-start gap-3 rounded-[12px] border-0 bg-lynch-50 px-3 py-4 text-left font-normal text-lynch-950 hover:text-lynch-700 disabled:text-lynch-700 disabled:opacity-100 [&>span]:hover:text-lynch-700',
            triggerClassName
          )}
          id={id}
        >
          {Icon ? (
            <Icon className={cn(getActiveColorClassName(color))} />
          ) : (
            <CalendarIcon
              className={cn('text-green-400', iconClassName)}
              size={24}
            />
          )}

          {date ? (
            format(date, myFormat)
          ) : (
            <span className='line-clamp-1 text-lynch-400'>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(value) => {
            setDate(value)
            if (onChange) onChange(value)
          }}
          className='h-fit rounded-md border'
          id={id}
        />
      </PopoverContent>
    </Popover>
  )
}
