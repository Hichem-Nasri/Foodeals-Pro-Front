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
import api from '@/utils/api'
import { Key } from 'lucide-react'

interface FilterManagerProps {
  control: Control<any>
  disabled?: boolean
  name: string
  label: string
  type: string
}

const fetchFilterManager = async (
  search: string,
  type: string
) => {
  const res = await api
    .get(
      `/users/search?name=${search}&page=0&size=10&sort=name,asc`
    )
    .catch((err) => {
      console.error(
        'Error fetching filter manager',
        err
      )
      return { data: { content: [] } }
    })
  return res.data.content.map(
    (item: any) => ({
      key: item.id,
      label: `${item.name?.firstName} ${item.name?.lastName}`,
      avatar: item.avatar,
    })
  )
}

export const FilterManager: FC<
  FilterManagerProps
> = ({
  control,
  disabled = false,
  name,
  label,
  type,
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
        const data =
          await fetchFilterManager(
            search,
            type
          )

        setOptions(data)
      }
    fetchFilterCities()
  }, [search])
  return (
    <SelectField
      control={control}
      name={name}
      label={label}
      options={options}
      disabled={disabled}
      search={true} // Enable search
      onChangeSearch={(value) => {
        inputRef.current?.focus()

        setSearch(value) // Update search term
      }} // Pass the input reference to the SelectField
      emptyAvatar='/images/emptyUser.png'
    />
  )
}
