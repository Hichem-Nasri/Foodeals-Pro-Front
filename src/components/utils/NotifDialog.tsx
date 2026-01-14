import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { IconType } from '@/types/common-types'
import React from 'react'
import { cn } from '@/lib/utils'

export function NotifDialog({
  isOpen = false,
  content,
  children,
  Icon,
  className,
  classNameIcon,
  setOpen,
}: {
  children?: React.ReactNode
  isOpen?: boolean
  content: string
  Icon: IconType | React.ComponentType<{ size: number }>
  className?: string
  classNameIcon?: string
  setOpen?: (open: boolean) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {/* <Dialog open={isOpen}> */}
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        className={cn(
          'max-w-[362px] rounded-[30px] p-0 shadow-none sm:rounded-[30px]',
          className
        )}
        showContent={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{content}</DialogTitle>
        </VisuallyHidden.Root>
        <div className='flex h-[274px] flex-col items-center justify-center gap-4 p-4 pt-6 text-center'>
          <DialogDescription className='whitespace-pre-wrap text-lg font-semibold text-lynch-900'>
            {content}
          </DialogDescription>
          <Icon size={110} className={cn('text-mountain-500', classNameIcon)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
