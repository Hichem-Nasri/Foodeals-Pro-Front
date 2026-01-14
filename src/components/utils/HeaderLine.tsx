import { cn } from '@/lib/utils'
import React, { FC } from 'react'

interface HeaderLine {
  title: string
  className?: string
}

const HeaderLine: FC<HeaderLine> = ({ title, className }) => {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-6 py-2',
        className
      )}
    >
      <div className='h-[0.55px] w-[80%] bg-lynch-200' />
      <h1 className='w-full flex-1 text-nowrap text-xl text-lynch-400'>
        {title}
      </h1>
      <div className='h-[0.55px] w-[80%] bg-lynch-200' />
    </div>
  )
}

export default HeaderLine
