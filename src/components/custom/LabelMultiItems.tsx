import { cn } from '@/lib/utils'
import React, { FC, JSX } from 'react'
import { Label } from './Label'

interface LabelMultiItemsProps {
  placeholder?: string
  label: string
  options: string[]
  name: string
  disabled?: boolean
  className?: string
  transform?: (
    value: string | any
  ) => JSX.Element[]
}

const Element = ({
  option,
}: {
  option: string
}) => {
  return (
    <div className='rounded-full bg-lynch-200 px-3 py-[0.469rem] text-[0.625rem] font-bold text-lynch-500'>
      {option}
    </div>
  )
}

const LabelMultiItems: FC<
  LabelMultiItemsProps
> = ({
  placeholder = 'Sélectionnez',
  options,
  name,
  label,
  disabled = false,
  className,
  transform,
}) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        className
      )}
    >
      <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
        <Label
          label={label}
          className='text-sm font-semibold text-lynch-950'
        />
        <div className='flex h-14 w-full items-center space-x-1 rounded-[14px] bg-lynch-50 px-2'>
          {typeof options ===
          'string' ? (
            <Element option={options} />
          ) : (
            options.map(
              (option: string) => (
                <div
                  key={option}
                  className='rounded-full bg-lynch-200 px-3 py-[0.469rem] text-[0.625rem] font-bold text-lynch-500'
                >
                  {option}
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default LabelMultiItems
