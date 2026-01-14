import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { LoaderCircle } from 'lucide-react'
import React from 'react'

export default function StatsList({
  listItems,
  iconColor = 'green',
  isLoading,
  className,
}: {
  listItems: StatsListItemProps[]
  iconColor?: ColorsT
  isLoading?: boolean
  className?: string
}) {
  return (
    <ul className={cn('flex flex-col lg:flex-row flex-wrap gap-2', className)}>
      {listItems.map((item) => (
        <StatsListItem
          key={item.statsLabel}
          Icon={item.Icon}
          statsLabel={item.statsLabel}
          statsNumber={item.statsNumber}
          iconColor={iconColor}
          isLoading={isLoading}
        />
      ))}
    </ul>
  )
}

export type StatsListItemProps = {
  Icon: IconType
  statsLabel: string
  statsNumber?: number
  iconColor?: ColorsT
  isLoading?: boolean
}
export function StatsListItem({
  Icon,
  statsLabel,
  statsNumber,
  iconColor = 'green',
  isLoading = false,
}: StatsListItemProps) {
  return (
    <li
      className={
        'flex flex-1 flex-row items-center gap-2.5 rounded-[20px] bg-white p-3 text-sm text-lynch-500 lg:w-auto lg:basis-1/4 lg:flex-col lg:items-center lg:justify-center lg:gap-1 lg:rounded-[30px] lg:px-4 lg:py-2 lg:text-base'
      }
    >
      <Icon size={28} className={cn(getActiveColorClassName(iconColor))} />

      <span className='font-medium lg:text-lg'>{statsLabel}</span>

      {isLoading && (
        <LoaderCircle
          className={cn('animate-spin', getActiveColorClassName(iconColor))}
        />
      )}

      {!isLoading && (
        <span
          className={cn(
            'ml-auto self-center text-lg font-semibold text-mountain-500 lg:m-auto lg:text-xl',
            getActiveColorClassName(iconColor, 'text')
          )}
        >
          {statsNumber || 0}
        </span>
      )}
    </li>
  )
}
