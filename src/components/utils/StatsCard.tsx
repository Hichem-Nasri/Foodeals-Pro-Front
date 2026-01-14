import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { LoaderCircle } from 'lucide-react'

export type StatsCardProps = {
  Icon: IconType
  title: string
  statNumber?: number
  className?: string
  color?: ColorsT
  isLoading?: boolean
}
export default function StatsCard({
  Icon,
  title,
  statNumber,
  className = '',
  color = 'purple',
  isLoading = false,
}: StatsCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-3 rounded-[20px] bg-white p-4 text-center text-lg',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full bg-amethyst-500 p-2.5',
          getActiveColorClassName(color, 'bg')
        )}
      >
        <Icon className='text-white' />
      </div>
      <h3 className='whitespace-pre-wrap font-normal leading-6'>{title}</h3>
      {isLoading && (
        <LoaderCircle
          className={cn('animate-spin', getActiveColorClassName(color))}
        />
      )}
      {!isLoading && (
        <p className='text-[22px] font-semibold text-mountain-500'>
          {statNumber || 0}
        </p>
      )}
    </section>
  )
}
