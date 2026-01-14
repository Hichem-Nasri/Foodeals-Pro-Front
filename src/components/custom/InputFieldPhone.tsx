import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { countries } from '@/utils/utils'
import {
  LucideProps,
  PhoneCall,
} from 'lucide-react'
import {
  ForwardRefExoticComponent,
  Fragment,
  JSX,
  RefAttributes,
  useState,
} from 'react'
import { Control } from 'react-hook-form'
import {
  FormField,
  FormMessage,
} from '../ui/form'
import { Input } from './Input'
import { Label } from './Label'

interface InputPhoneFieldProps {
  control: Control<any>
  placeholder: string
  name: string
  className?: string
  countryCode: string
  onChangeCountryCode: (
    label: string
  ) => void
  label: string
  disabled?: boolean
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  styleIcon?: string
}

export type CountryType = {
  name: string
  code: string
  dialCode: string
  flag: string
}

export const InputPhoneField: React.FC<
  InputPhoneFieldProps
> = ({
  control,
  placeholder,
  name,
  className,
  countryCode,
  label,
  disabled,
  onChangeCountryCode,
  IconRight,
  IconLeft,
  styleIcon,
}): JSX.Element => {
  const [
    CountryCodes,
    setCountryCodes,
  ] = useState<CountryType>(() => {
    return countries.find(
      (option) =>
        option.dialCode === countryCode
    )!
  })
  const country =
    countries.find(
      (option) =>
        option.dialCode === countryCode
    ) ||
    countries.find(
      (option) => option.code === 'MA'
    )
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
            <Label
              htmlFor={name}
              className='text-sm font-semibold text-lynch-950'
              label={label}
            />
            <div
              className={cn(
                'flex w-full flex-col',
                className
              )}
            >
              <div className='flex w-full items-center gap-[0.375rem]'>
                <Select
                  value={
                    CountryCodes.dialCode
                  }
                  onValueChange={(
                    value
                  ) => {
                    if (
                      value ===
                      CountryCodes.dialCode
                    )
                      return
                    const country =
                      countries.find(
                        (option) =>
                          option.dialCode ===
                          value
                      )
                    if (!country) return
                    console.log(
                      'country: ',
                      country
                    )
                    setCountryCodes(
                      country!
                    )
                    onChangeCountryCode(
                      country!.dialCode
                    )
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className='flex w-fit gap-1 rounded-[12px] border-0 text-base font-light flex-center-start'>
                    <div className='flex w-fit items-center justify-start gap-1 pr-3'>
                      <img
                        src={`https://flagcdn.com/${CountryCodes.code.toLowerCase()}.svg`}
                        alt={
                          CountryCodes.name
                        }
                        width={20}
                        height={10}
                        loading='lazy'
                      />
                      <span>
                        {
                          CountryCodes.code
                        }
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className='text-normal w-full basis-1 overflow-auto'>
                    {countries.map(
                      (
                        option,
                        index
                      ) => (
                        <Fragment
                          key={`${option.dialCode}-${index}`}
                        >
                          <SelectItem
                            key={`${option.dialCode}-${index}`}
                            value={
                              option.dialCode
                            }
                            className='w-full cursor-pointer p-1 pl-8'
                          >
                            <div className='flex w-full items-center justify-between gap-1'>
                              <img
                                src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                                alt={
                                  option.dialCode
                                }
                                width={
                                  25
                                }
                                height={
                                  15
                                }
                                className='h-fit'
                                loading='lazy'
                              />
                              <span>
                                {
                                  option.name
                                }
                              </span>
                              <div className='ml-2 text-sm'>
                                {
                                  option.dialCode
                                }
                              </div>
                            </div>
                          </SelectItem>
                        </Fragment>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Input
                  {...field}
                  label={''}
                  onChange={(value) => {
                    if (
                      value
                        .toString()
                        .startsWith('0')
                    ) {
                      value
                        .toString()
                        .replace(
                          '0',
                          ''
                        )
                    } else
                      field.onChange(
                        value
                      )
                  }}
                  className='w-full flex-1'
                  placeholder={
                    placeholder
                  }
                  IconRight={IconRight}
                  IconLeft={PhoneCall}
                  disabled={disabled}
                />
              </div>
              <FormMessage />
            </div>
          </div>
        )
      }}
    />
  )
}
