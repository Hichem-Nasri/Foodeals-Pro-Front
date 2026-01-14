'use client'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { Button } from '../ui/button'
import { Archive, ListFilter } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ListItemsNumberFiltersTriggers({
  color = 'green',
  numberOfitems,
  title,
  archiveTriggerFn = () => {},
  filterTriggerFn = () => {},
}: {
  color?: ColorsT
  numberOfitems: number
  title: string
  archiveTriggerFn?: () => void
  filterTriggerFn?: () => void
}) {
  return (
    <div className='flex justify-between'>
      <h2 className='flex items-center gap-3 text-[22px] font-medium'>
        <span className='max-sm:max-w-[170px]'>{title}</span>
        <span
          className={cn(
            'flex size-[34px] items-center justify-center rounded-full bg-amethyst-500 text-white',
            getActiveColorClassName(color, 'bg')
          )}
        >
          {numberOfitems}
        </span>
      </h2>
      <div className='flex gap-3 lg:hidden'>
        <Button
          className='size-14 rounded-full bg-white p-0 text-lynch-400 hover:bg-lynch-100 hover:text-lynch-500'
          onClick={archiveTriggerFn}
        >
          <Archive />
        </Button>
        <Button
          className='size-14 rounded-full bg-white p-0 text-lynch-400 hover:bg-lynch-100 hover:text-lynch-500'
          onClick={filterTriggerFn}
        >
          <ListFilter className='text-lynch-400' />
        </Button>
      </div>
    </div>
  )
}
