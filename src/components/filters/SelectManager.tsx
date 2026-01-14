import React, {
  useEffect,
  useState,
  useRef,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { Control } from 'react-hook-form'
import {
  FormField,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select' // Import ShadCN Select components
import { SelectField } from '../custom/SelectField'
import { MultiSelectOptionsType } from '../tools/MultiSelect'

const SelectManager = ({
  control,
  disabled = false,
  name,
  label,
}: {
  control: Control<any>
  disabled?: boolean
  name: string
  label: string
}) => {
  const [search, setSearch] =
    useState('')
  const inputRef =
    useRef<HTMLInputElement>(null)
  const [options, setOptions] =
    useState<MultiSelectOptionsType[]>(
      []
    )

  useEffect(() => {
    // if (inputRef.current) inputRef.current.focus()
    // const fetchManagerData = async () => {
    //     const data = await fetchManager(search)
    //     setOptions(data)
    //     inputRef.current?.focus()
    // }
    // fetchManagerData()
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

export default SelectManager
