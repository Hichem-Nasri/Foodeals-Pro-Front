import { FC, ForwardRefExoticComponent, RefAttributes } from 'react'

import { Control } from 'react-hook-form'
import { FormField, FormItem, FormMessage } from '../ui/form'
import { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './Input'

interface InputFieldProps {
  label?: string
  name: string
  control: Control<any>
  type?: 'number' | 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  className?: string
  disabled?: boolean
  maxLength?: number
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  iconLeftColor?: string
  onClickIconRight?: () => void
  classNameParent?: string
  isLoaded?: boolean
  valueLeft?: string
  valueRight?: string
  value?: string | number
}

export const InputFieldForm: FC<InputFieldProps> = ({
  label,
  name,
  control,
  IconLeft,
  IconRight,
  className,
  disabled,
  maxLength,
  placeholder,
  type,
  iconLeftColor,
  classNameParent,
  isLoaded = false,
  onClickIconRight = () => {},
  valueLeft = '',
  valueRight = '',
  value,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={cn('flex w-full flex-col items-start', classNameParent)}
          >
            <div
              className={`relative flex w-full items-start ${
                field.value != ''
                  ? '[&>svg]:text-description'
                  : '[&>svg]:text-label-grayLight'
              }`}
            >
              <Input
                {...field}
                ref={null}
                type={type}
                label={label}
                disabled={disabled || field.disabled}
                maxLength={maxLength}
                onBlur={field.onBlur}
                onChange={(value) =>
                  (type === 'number' && field.onChange(+value)) ||
                  field.onChange(value)
                }
                value={value ? value : field.value}
                placeholder={placeholder || 'Saisser ' + label}
                className={className}
                IconLeft={IconLeft}
                IconRight={IconRight}
                iconLeftColor={iconLeftColor}
                onClickRight={onClickIconRight}
                isLoaded={isLoaded}
                valueLeft={valueLeft}
                valueRight={valueRight}
                classNameParent={classNameParent}
              />
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
