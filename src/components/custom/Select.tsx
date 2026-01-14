import {
  FC,
  ForwardRefExoticComponent,
  JSX,
  RefAttributes,
} from 'react'
import {
  Select as SelectShadCn,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Avatar,
  AvatarFallback,
} from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Input } from './Input'
import {
  LucideProps,
  Search,
  SearchCheck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from './Label'
import { AvatarAndName } from '../tools/AvatarAndName'
import { MultiSelectOptionsType } from '../tools/MultiSelect'

interface SelectProps {
  onChange: (value: string) => void
  transform?: (
    value: string | number
  ) => JSX.Element
  transformItem?: (
    value: string | number
  ) => JSX.Element
  value: string
  options?: MultiSelectOptionsType[]
  placeholder?: string
  disabled?: boolean
  label: string
  search?: boolean
  onChangeSearch?: (
    value: string
  ) => void
  inputRef?: React.RefObject<HTMLInputElement>
  className?: string
  classNameParent?: string
  LeftIcon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  RightIcon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  emptyAvatar?: string
  checked?: boolean
}

export const Select: FC<
  SelectProps
> = ({
  options,
  onChange,
  transform,
  value,
  disabled = false,
  placeholder,
  label,
  search,
  onChangeSearch,
  className,
  inputRef,
  classNameParent,
  LeftIcon,
  RightIcon,
  emptyAvatar = '',
  transformItem,
  checked = true,
}) => {
  const avatar = options?.find(
    (option) =>
      option.key.toString() ===
      value?.toString()
  )?.avatar
  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-3 text-lynch-400',
        classNameParent
      )}
    >
      <Label
        label={label}
        className={cn(
          'label text-sm font-semibold text-lynch-950',
          className
        )}
      />
      <SelectShadCn
        disabled={disabled}
        value={value}
        onValueChange={(value) => {
          if (!value) return
          onChange(value)
        }}
      >
        <SelectTrigger
          className={`select z-30 w-full border-0 text-lynch-400 hover:text-lynch-700 ${
            options?.find(
              (option) =>
                option.key === value
            )?.label
              ? 'border-textGray'
              : ''
          } ${(LeftIcon || RightIcon) && '[&>.icon]:hidden'} `}
        >
          {LeftIcon && (
            <LeftIcon
              size={20}
              className='ml-[0 5rem] text-lynch-400'
            />
          )}
          {!value ||
          !value.toString().length ? (
            <span className='line-clamp-1 text-start text-base font-normal'>
              {emptyAvatar &&
              emptyAvatar.length ? (
                <AvatarAndName
                  avatar={emptyAvatar}
                  name={'Selectionner'}
                />
              ) : (
                <span>
                  {placeholder}
                </span>
              )}
            </span>
          ) : transform ? (
            transform(
              options &&
                options.length > 0
                ? options?.find(
                    (option) =>
                      option.key ===
                      value
                  )!?.label
                : value
            )
          ) : (
            <div
              className={`line-clamp-1 flex items-center text-start text-base font-normal text-lynch-950 ${
                avatar
                  ? 'justify-start gap-2'
                  : ''
              }`}
            >
              {avatar ? (
                <AvatarAndName
                  name={
                    options?.find(
                      (option) =>
                        option.key.toString() ===
                        value.toString()
                    )?.label!
                  }
                  avatar={avatar}
                />
              ) : options?.length ? (
                options?.find(
                  (option) =>
                    option.key.toString() ===
                    value.toString()
                )?.label
              ) : (
                value
              )}
            </div>
          )}
          {RightIcon && (
            <RightIcon
              size={20}
              className='text-lynch-400'
            />
          )}
        </SelectTrigger>
        <SelectContent className='absolute z-50'>
          {search && (
            <div className='flex items-center justify-center space-x-2 p-1'>
              <div className='flex w-full items-center justify-start rounded-md border-2 border-lynch-300 px-1 focus:border-lynch-700 focus:outline-none'>
                <Search className='h-5 w-5 text-lynch-200' />
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Rechercher'
                  className='w-full p-2 focus-within:border-0 focus-within:outline-none'
                  onChange={(e) => {
                    const target =
                      e.target as HTMLInputElement
                    onChangeSearch &&
                      onChangeSearch(
                        target.value +
                          ''
                      )
                  }}
                />
                {/* <X
                                    className='h-5 w-5 text-lynch-200'
                                    onClick={() => {
                                        onChangeSearch && onChangeSearch('')
                                        inputRef?.current?.focus()
                                    }}
                                /> */}
              </div>
            </div>
          )}
          {options?.map((option) => (
            <SelectItem
              key={option.key}
              value={option.key.toString()}
              defaultChecked={
                checked
                  ? option.key === value
                  : undefined
              }
              className='w-full cursor-pointer pl-2 [&>.checked]:hidden'
            >
              {transformItem ? (
                transformItem(
                  option.key
                )
              ) : (
                <>
                  {option.avatar ? (
                    <AvatarAndName
                      avatar={
                        option.avatar
                      }
                      name={
                        option.label
                      }
                    />
                  ) : (
                    <div className='hover:bg-lynch-10 flex items-center gap-2 p-2'>
                      {option.icon && (
                        <option.icon
                          size={20}
                        />
                      )}
                      {option.label}
                    </div>
                  )}
                </>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectShadCn>
    </div>
  )
}
