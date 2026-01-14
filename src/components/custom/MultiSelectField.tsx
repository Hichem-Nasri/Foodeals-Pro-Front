import React, { FC, JSX } from 'react'
import { Control } from 'react-hook-form'
import {
  FormField,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import { Label } from './Label'
import {
  MultiSelectOptionsType,
  MultiSelect,
} from '../tools/MultiSelect'

interface MultiSelectFieldProps {
  control: Control<any>
  placeholder?: string
  label: string
  options: {
    key: string | number
    label: string
  }[]
  name: string
  disabled?: boolean
  className?: string
  transform?: (
    value: MultiSelectOptionsType[]
  ) => JSX.Element[]
  emptyAvatar?: string
  len?: number
  selected?: string[]
  ref?: React.Ref<HTMLInputElement>
}

export const MultiSelectField: FC<
  MultiSelectFieldProps
> = ({
  control,
  placeholder = 'Sélectionnez',
  options,
  name,
  label,
  disabled = false,
  className,
  transform,
  len,
  emptyAvatar,
  selected,
  ref,
}) => {
  const select =
    (selected &&
      selected.map((val) => ({
        key: val,
        label: val,
      }))) ||
    []

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
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
              <MultiSelect
                options={options}
                disabled={
                  options.length ===
                    0 || disabled
                }
                selectedValues={
                  field.value
                }
                onSelect={(value) =>
                  field.onChange(value)
                }
                placeholder={
                  placeholder
                }
                transform={transform}
                length={len}
                emptyAvatar={
                  emptyAvatar
                }
                ref={ref}
              />
            </div>
            <FormMessage />
          </div>
        )
      }}
    />
  )
}
