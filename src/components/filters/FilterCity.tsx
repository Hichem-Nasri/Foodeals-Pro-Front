import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Control } from 'react-hook-form'
import {
  FormField,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import { SelectField } from '../custom/SelectField'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { getCities } from '@/actions/global'

interface FilterCityProps {
  control: Control<any>
  disabled?: boolean
  name: string
  label: string
}

export const FilterCity: FC<
  FilterCityProps
> = ({
  control,
  disabled = false,
  name,
  label,
}) => {
  const [options, setOptions] =
    useState<MultiSelectOptionsType[]>(
      []
    )
  const inputRef =
    useRef<HTMLInputElement>(null)
  const [search, setSearch] =
    useState('')
  useEffect(() => {
    if (inputRef.current)
      inputRef.current.focus()
    const fetchFilterCities =
      async () => {
        const data = await getCities()
        if (data) {
        }
        setOptions(data)
      }
    fetchFilterCities()
  }, [search])
  return (
    <SelectField
      control={control}
      name={name}
      label={label}
      options={options || []}
      disabled={disabled}
      search={true} // Enable search
      onChangeSearch={(value) => {
        inputRef.current?.focus()

        setSearch(value) // Update search term
      }} // Pass the input reference to the SelectField
    />
  )
}
