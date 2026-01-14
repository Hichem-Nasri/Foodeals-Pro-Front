import { cn } from '@/lib/utils'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import React from 'react'

interface CommandesHeaderProps {
  title?: string
  orders: number
  className?: string
  color?: ColorsT
}

const CommandesHeader: React.FC<CommandesHeaderProps> = ({
  orders,
  title = 'Commandes',
  className,
  color = 'green',
}) => {
  const colorBg = getActiveColorClassName(color, 'bg')
  return (
    <div className={cn('flex items-center justify-start gap-1.5', className)}>
      <h2 className='text-[1.375rem] font-medium text-lynch-950'>{title}</h2>
      {orders > 0 && (
        <div
          className={`size-8 rounded-full ${colorBg} text-lg font-semibold text-white flex-center`}
        >
          {orders}
        </div>
      )}
    </div>
  )
}

export default CommandesHeader
