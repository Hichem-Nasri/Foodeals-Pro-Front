import { ChevronLeft } from 'lucide-react'
import React, { FC } from 'react'
import { DialogClose } from '../ui/dialog'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { cn } from '@/lib/utils'

interface MobileHeaderProps {
  onClick: () => void
  title: string
  buttonType?: 'dialog' | 'button'
  color?: ColorsT
  className?: string
}

const MobileHeader: FC<MobileHeaderProps> = ({
  title,
  onClick,
  buttonType = 'button',
  color = 'green',
  className,
}) => {
  const borderColor = getActiveColorClassName(color, 'border')
  return (
    <div
      className={cn(
        `sticky left-0 top-0 z-50 flex w-full items-center justify-between gap-5 border-b-2 ${borderColor} mb-2 bg-white px-2 py-4 lg:hidden`,
        className
      )}
    >
      {buttonType === 'button' ? (
        <button className='text-lynch-400' onClick={onClick}>
          <ChevronLeft size={24} />
        </button>
      ) : (
        <DialogClose onClick={onClick}>
          <ChevronLeft size={24} />
        </DialogClose>
      )}
      <h1 className='text-[1.125rem] font-normal text-lynch-950'>{title}</h1>
    </div>
  )
}

export default MobileHeader
