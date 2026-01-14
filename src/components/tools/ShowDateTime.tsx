import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarDays, Clock } from 'lucide-react'
import React from 'react'

export default function ShowDateTime({
  date,
  className = '',
}: {
  date: Date | string | number
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-sm text-lynch-500',
        className
      )}
    >
      <div className='flex items-center gap-1'>
        <CalendarDays size={16} />
        <span>{format(date, 'dd/MM/yyyy')}</span>
      </div>
      <div className='flex items-center gap-1'>
        <Clock size={16} />
        <span>{format(date, "HH'h' mm")}</span>
      </div>
    </div>
  )
}
