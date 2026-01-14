// components/Grid.tsx
import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'

const Grid: React.FC<{
  children: React.ReactNode
  isLoading?: boolean
  className?: string
}> = ({ children, isLoading, className }) => {
  return (
    <div
      className={cn(
        'relative grid h-full min-w-full grid-cols-1 place-content-start place-items-start content-start gap-4 overflow-hidden p-2 lg:grid-cols-2 lg:place-items-start lg:content-start xl:grid-cols-3',
        className
      )}
    >
      {isLoading ? (
        Array.from({ length: 10 }, (_, i) => (
          <Skeleton
            key={i}
            className='flex w-full min-w-72 max-w-lg flex-1 flex-col gap-[10px] place-self-center rounded-[20px] bg-white p-3 transition-all lg:max-w-full'
          >
            <div className='flex min-w-72 max-w-full flex-1 flex-col gap-[10px] rounded-[20px] bg-white p-3'>
              <header className='flex items-center justify-between'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <Skeleton className='h-6 w-24 rounded' />
              </header>
              <div className='relative aspect-[33/25] overflow-hidden rounded-xl bg-gray-300'>
                <Skeleton className='h-full w-full' />
              </div>
              <div className='flex justify-between text-sm'>
                <div className='flex flex-col gap-1'>
                  <Skeleton className='h-4 w-32 rounded' />
                  <Skeleton className='h-4 w-24 rounded' />
                </div>
                <Skeleton className='h-4 w-12 rounded' />
              </div>
              <Separator className='block h-[1px] w-full bg-lynch-100' />
              <div className='flex items-center justify-between text-lynch-500'>
                <Skeleton className='h-4 w-20 rounded' />
                <div className='flex gap-1 text-lg font-semibold text-amethyst-500'>
                  <Skeleton className='h-4 w-12 rounded' />
                  <Skeleton className='h-4 w-8 rounded' />
                </div>
              </div>
            </div>
          </Skeleton>
        ))
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export default Grid
