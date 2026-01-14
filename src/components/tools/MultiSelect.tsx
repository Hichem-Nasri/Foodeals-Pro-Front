import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  ChevronDown,
  ListPlus,
  LucideProps,
  X,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Icon } from '@radix-ui/react-select'
import {
  ForwardRefExoticComponent,
  JSX,
  RefAttributes,
} from 'react'
import { AvatarAndName } from './AvatarAndName'
export type MultiSelectOptionsType = {
  key: string | number
  label: string
  avatar?: string
  className?: string
  icon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<LucideProps> &
      React.RefAttributes<SVGSVGElement>
  >
  id?: string
}
interface MultiSelectProps {
  options: MultiSelectOptionsType[]
  selectedValues: string[]
  onSelect: (value: string[]) => void
  transform?: (
    value: MultiSelectOptionsType[]
  ) => JSX.Element[]
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  id?: string
  emptyAvatar?: string
  length?: number
  type?: 'company' | 'status'
  normalTransform?: boolean
  region?: boolean
  ref?: React.Ref<HTMLInputElement> // TODO: Tesing this ref
}

const defaultTransform = (
  value: MultiSelectOptionsType[],
  region: boolean,
  len: number
) => {
  if (len == 1 && region) {
    return [
      <div key={99}>
        Plusieurs ville
      </div>,
    ]
  }
  value.slice(0, len)
  return value.map((option, index) => (
    <div
      key={index}
      className={cn(
        'font-xs flex max-w-fit items-center justify-center truncate whitespace-nowrap pl-1 text-base',
        option.className
      )}
    >
      <span>
        {region
          ? option.label
              .split('-')
              .slice(1)
              .join('')
          : option.label +
            (index != value.length - 1
              ? ' -'
              : '')}
      </span>
    </div>
  ))
}

export const MultiSelect: React.FC<
  MultiSelectProps
> = ({
  options,
  selectedValues = [],
  onSelect,
  transform,
  disabled = false,
  placeholder = 'sélectionner',
  searchPlaceholder,
  emptyAvatar,
  id,
  length,
  type = 'company',
  normalTransform = false,
  region = false,
  ref,
}) => {
  const selectedOptions =
    options.filter(
      (option) =>
        selectedValues &&
        (selectedValues?.includes(
          option.key.toString()
        ) ||
          selectedValues?.includes(
            option.label
          ))
    )
  const len = length ?? 3
  if (normalTransform) {
    transform = (value) =>
      defaultTransform(
        value,
        region,
        len
      )
  }
  return (
    <Popover>
      <PopoverTrigger
        id={id}
        disabled={disabled}
        className='w-full'
      >
        <div
          className={cn(
            'flex min-h-14 w-full min-w-full max-w-[32.625rem] flex-1 items-center gap-2 rounded-[12px] border-0 bg-lynch-50 px-3 py-2 text-base font-normal text-lynch-400 hover:text-lynch-700',
            disabled
              ? 'opacity-50'
              : 'cursor-pointer',
            selectedValues?.length > 0
              ? 'border-textGray'
              : ''
          )}
        >
          {selectedValues?.length ==
            1 && !transform ? (
            selectedOptions[0] && (
              <AvatarAndName
                avatar={
                  selectedOptions[0]
                    .avatar!
                }
                name={
                  selectedOptions[0]
                    .label
                }
              />
            )
          ) : !selectedValues?.length &&
            !transform ? (
            <AvatarAndName
              avatar={emptyAvatar}
              name={placeholder}
            />
          ) : transform &&
            selectedValues?.length ? (
            selectedOptions.length >
            len ? (
              <React.Fragment>
                {transform(
                  selectedOptions
                ).slice(0, len)}
                <Dialog>
                  <DialogTrigger>
                    {transform([
                      {
                        key: 'more',
                        label: `+${
                          selectedOptions.length -
                          len
                        }`,
                      },
                    ])}
                  </DialogTrigger>
                  <DialogContent
                    showContent={false}
                  >
                    <DialogHeader className='flex w-full flex-col items-start gap-3'>
                      <DialogTitle className='flex w-full items-center justify-between text-lynch-500'>
                        <h1 className='text-xl'>
                          Activité du
                          partenaire
                        </h1>
                        <DialogClose>
                          <X
                            size={24}
                          />
                        </DialogClose>
                      </DialogTitle>
                      <DialogDescription className='flex flex-wrap gap-3 overflow-auto'>
                        {transform(
                          selectedOptions
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </React.Fragment>
            ) : (
              transform(selectedOptions)
            )
          ) : transform &&
            !selectedValues?.length ? (
            <span>{placeholder}</span>
          ) : (
            <AvatarAndName
              avatar={emptyAvatar}
              name={
                region
                  ? 'Plusieurs zone'
                  : 'Multi'
              }
            />
          )}
          {region &&
          selectedValues?.length > 1 ? (
            <ListPlus className='ml-auto opacity-50' />
          ) : (
            <ChevronDown className='ml-auto opacity-50' />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='rounded-[16px] p-3'>
        <Command className='flex flex-col gap-5 p-0'>
          {!disabled &&
            type != 'status' && (
              <CommandInput
                className='placeholder:text-input text-textGray bg-lynch-50 text-base font-normal placeholder:text-base placeholder:font-normal'
                placeholder={
                  searchPlaceholder
                }
                ref={ref}
                onValueChange={(
                  value
                ) => {}}
              />
            )}
          <CommandList>
            <CommandGroup className='p-0'>
              {!disabled &&
                options?.map(
                  (option) => {
                    const isSelected =
                      selectedValues?.includes(
                        option.key.toString()
                      )
                    return (
                      <CommandItem
                        key={option.key}
                        onSelect={(
                          name: string
                        ) => {
                          if (
                            isSelected
                          ) {
                            const newData =
                              selectedValues?.filter(
                                (
                                  selected
                                ) =>
                                  option.key !==
                                  selected
                              )
                            onSelect(
                              newData
                            )
                          } else {
                            const newData =
                              [
                                ...selectedValues,
                                option.key,
                              ] as string[]
                            onSelect(
                              newData
                            )
                          }
                        }}
                        className='cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2 text-base font-normal text-lynch-500'
                      >
                        <Checkbox
                          checked={
                            isSelected
                          }
                        />
                        {type ==
                        'company' ? (
                          <>
                            {transform ? (
                              transform(
                                [option]
                              )
                            ) : (
                              <AvatarAndName
                                avatar={
                                  option.avatar
                                }
                                name={
                                  option.label
                                }
                              />
                            )}
                          </>
                        ) : (
                          <div
                            className={cn(
                              'flex w-auto items-center justify-between space-x-1 text-nowrap rounded-full px-2 text-sm',
                              option.className
                            )}
                          >
                            {option.icon && (
                              <option.icon className='size-4' />
                            )}
                            <span>
                              {region
                                ? option.label
                                    .split(
                                      '-'
                                    )
                                    .slice(
                                      1
                                    )
                                    .join(
                                      ' '
                                    )
                                : option.label}
                            </span>
                          </div>
                        )}
                      </CommandItem>
                    )
                  }
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
