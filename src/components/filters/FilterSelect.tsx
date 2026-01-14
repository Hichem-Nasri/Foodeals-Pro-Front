'use client'
import { FC, useEffect, useState } from 'react'
import { Select } from '../custom/Select'
import { SelectField } from '../custom/SelectField'
import { Control } from 'react-hook-form'
import { MultiSelectOptionsType } from '../tools/MultiSelect'

interface FilterSelectProps {
    control: Control<any>
    name: string
    label: string
    placeholder?: string
}

export const FilterSelect: FC<FilterSelectProps> = ({
    control,
    name,
    label,
    placeholder,
}) => {
    const [options, setOptions] = useState<MultiSelectOptionsType[]>([])
    useEffect(() => {
        const fetchOptions = async () => {
            // fetch options
        }
        fetchOptions()
    }, [])
    return (
        <SelectField
            control={control}
            name={name}
            label={label}
            placeholder={placeholder}
            options={options}
        />
    )
}
