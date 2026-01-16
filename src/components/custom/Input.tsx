'use client'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, LucideProps } from 'lucide-react'
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  FC,
  useState,
} from 'react'
import { Input as ShadCnInput } from '@/components/ui/input'
import { Skeleton } from '../ui/skeleton'
import { Label } from './Label'

interface InputProps {
  onChange: (value: string | number) => void
  value: string | number | undefined
  placeholder?: string
  type?: 'number' | 'text' | 'email' | 'password' | 'file' | 'textarea'
  name: string
  className?: string
  maxLength?: number
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  onClickRight?: () => void
  disabled?: boolean
  label?: string
  iconLeftColor?: string
  onBlur?: () => void
  isLoaded?: boolean
  valueRight?: string
  valueLeft?: string
  classNameParent?: string
  ref?: React.Ref<HTMLInputElement>
}

export const Input: FC<InputProps> = ({
  name,
  placeholder,
  type = 'text',
  className,
  IconRight = null,
  IconLeft = null,
  disabled = false,
  onClickRight: handleShowPassword = () => {},
  onChange,
  value,
  label,
  iconLeftColor,
  onBlur,
  isLoaded = false,
  valueRight = '',
  valueLeft = '',
  classNameParent,
  maxLength,
  ref,
}) => {
  const [password, setPassword] = useState(false)
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-3 text-lynch-400',
        classNameParent
      )}
    >
      {isLoaded ? (
        <Skeleton className='h-10 w-full rounded-[8px]' />
      ) : (
        <>
          {label && (
            <Label
              htmlFor={name}
              label={label}
              className='text-sm font-semibold'
            />
          )}
        </>
      )}
      {isLoaded ? (
        <Skeleton className='h-10 w-full rounded-[8px]' />
      ) : (
        <div
          className={cn(
            `relative w-full ${
              !value || value != ''
                ? '[&>svg]:text-description'
                : '[&>svg]:text-label-grayLight'
            }`,
            classNameParent
          )}
        >
          {IconLeft && (
            <IconLeft
              className={cn(
                'absolute rtl:right-3 ltr:left-3 top-1/2 -translate-y-1/2 cursor-pointer text-primary',
                iconLeftColor
              )}
            />
          )}
          {valueLeft && <span>{valueLeft}</span>}
          <ShadCnInput
            ref={ref! || null}
            autoComplete='on'
            type={password && type == 'password' ? 'text' : type}
            disabled={disabled}
            onChange={(e) =>
              (type === 'number' && onChange(+e.target.value)) ||
              onChange(e.target.value)
            }
            value={type === 'number' && value === 0 ? undefined : value}
            maxLength={maxLength}
            placeholder={placeholder}
            className={cn(
              'text-base font-normal',
              className,
              IconLeft && 'ps-12'
            )}
            onBlur={onBlur}
          />
          {valueRight && <span>{valueRight}</span>}
          {IconRight && (
            <IconRight
              onClick={handleShowPassword}
              className='absolute rtl:left-3 ltr:right-3 top-1/2 -translate-y-1/2 cursor-pointer'
            />
          )}
          {type === 'password' && (
            <button
              type='button'
              className='absolute rtl:left-0 ltr:right-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center'
              onClick={() => {
                setPassword((prev) => !prev)
              }}
            >
              {!password ? <EyeOff /> : <Eye />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
