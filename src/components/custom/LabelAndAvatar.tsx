import { cn } from '@/lib/utils'
import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes, FC } from 'react'
import { Input, Input as ShadCnInput } from '@/components/ui/input'
import { Label } from './Label'
import { AvatarAndName } from '../tools/AvatarAndName'

interface InputProps {
  onChange: (value: string | number) => void
  value: string | number | undefined
  placeholder?: string
  type?: 'number' | 'text' | 'email' | 'password' | 'file' | 'textarea'
  name: string
  className?: string
  classNameParent?: string
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  onClickRight?: () => void
  onClick?: () => void
  disabled?: boolean
  label?: string
  iconLeftColor?: string
  onBlur?: () => void
  avatar?: string
}

export const LabelAndAvatar: FC<InputProps> = ({
  name,
  placeholder,
  type = 'text',
  className,
  classNameParent,
  IconRight = null,
  IconLeft = null,
  disabled = false,
  onClickRight: handleShowPassword = () => {},
  onClick,
  onChange,
  value,
  label,
  iconLeftColor,
  onBlur,
  avatar,
}) => {
  return (
    <div
      className={cn(
        `flex w-full flex-col items-start gap-3 text-lynch-500 ${
          label == 'Adresse' && 'col-span-2'
        }`,
        classNameParent
      )}
      onClick={onClick}
    >
      {label && (
        <Label label={label} className='text-base font-medium text-lynch-950' />
      )}
      <div
        className={`relative w-full ${
          !value || value != ''
            ? '[&>svg]:text-description'
            : '[&>svg]:text-label-grayLight'
        }`}
      >
        {IconLeft && (
          <IconLeft
            className={cn(
              'icon absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-primary',
              iconLeftColor
            )}
          />
        )}
        {/* {avatar ? ( */}
        <AvatarAndName
          name={value + '' || placeholder!}
          avatar={avatar}
          className={cn(
            'flex h-14 w-full items-center justify-start rounded-[14px] bg-lynch-50 px-4 text-base font-normal',
            className,
            IconLeft && 'ps-12',
            `${value || 'opacity-40'}`
          )}
        />
        {/* 
                // ) : (
                //     <Input
                //         disabled={disabled}
                //         onChange={(e) =>
                //             (type === 'number' && onChange(+e.target.value)) ||
                //             onChange(e.target.value)
                //         }
                //         value={
                //             type === 'number' && value === 0 ? undefined : value
                //         }
                //         placeholder={placeholder}
                //         className={cn(
                //             'text-base font-normal',
                //             className,
                //             IconLeft && 'ps-12'
                //         )}
                //         onBlur={onBlur}
                //     />
                // )
                }
                */}
        {IconRight && (
          <IconRight
            onClick={handleShowPassword}
            className='icon absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-lynch-300'
          />
        )}
      </div>
    </div>
  )
}
