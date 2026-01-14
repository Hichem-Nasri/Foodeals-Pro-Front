import React, { FC } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconType } from '@/types/common-types'
import { cn } from '@/lib/utils'
import { DropdownMenuTriggerProps } from '@radix-ui/react-dropdown-menu'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
// import AppRouter from 'next/dist/client/components/app-router';

interface ListDropDownProps {
  list: {
    label: string
    Icon: IconType
    action: () => void
  }[]
  children: React.ReactNode
  setOpen: (open: boolean) => void
  className?: string
  color?: ColorsT
}

const ListDropDown: FC<
  ListDropDownProps
> = ({
  list,
  children,
  setOpen,
  className,
  color = 'green',
}) => {
  const colorBg =
    getActiveColorClassName(color, 'bg')
  const focusColor = `focus:${colorBg}`
  return (
    <>
      <DropdownMenu
        onOpenChange={setOpen}
      >
        <DropdownMenuTrigger
          className={cn(
            'focus:outline-none',
            className
          )}
          asChild
        >
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className='z-[60] flex flex-col gap-2 rounded-[24px] border-none bg-transparent p-3 shadow-none lg:rounded-[18px] lg:bg-white'>
          {list.map(
            (
              { label, Icon, action },
              index
            ) => (
              <DropdownMenuItem
                key={index}
                className={`w-full rounded-[18px] ${colorBg} text-white ${focusColor} text-xs focus:text-white sm:text-sm lg:rounded-[12px] lg:bg-white lg:text-lynch-400 lg:focus:bg-lynch-100 lg:focus:text-lynch-500`}
              >
                <button
                  type='button'
                  onClick={action}
                  className='flex w-full items-center justify-between gap-2 p-2'
                >
                  <span>{label}</span>
                  <span className='flex lg:hidden'>
                    <Icon size={16} />
                  </span>
                  <span className='hidden lg:flex'>
                    <Icon size={24} />
                  </span>
                </button>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ListDropDown
