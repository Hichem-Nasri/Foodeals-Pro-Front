'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import formatHour from '@/utils/formatHour'

interface SelectTimeProps {
  label: string
  name: string
  description?: string
  placeholder?: string
  className?: string
  color?: ColorsT
  disabled?: boolean
}

const hours: {
  label: string
  value: string
}[] = [...Array(24).keys()].map((hour) => ({
  label: formatHour(hour),
  value: formatHour(hour),
}))

export const SelectTime = React.forwardRef<HTMLSelectElement, SelectTimeProps>(
  (
    {
      label,
      name,
      description,
      className = '',
      placeholder = 'Select an option',
      color = 'green',
      disabled = false,
    },
    ref
  ) => {
    return (
      <FormField
        name={name}
        disabled={disabled}
        render={({ field }) => (
          <FormItem className={cn(className)}>
            <FormLabel>{label}</FormLabel>
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl ref={ref}>
                <SelectTrigger
                  className='w-full text-base text-lynch-400'
                  disabled={disabled}
                >
                  <div className='flex items-center gap-3'>
                    <Clock className={getActiveColorClassName(color)} />
                    <SelectValue placeholder={placeholder}>
                      {field.value}
                    </SelectValue>
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h.value} value={h.value}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
)

SelectTime.displayName = 'SelectTime'
