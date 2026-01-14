import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { SelectField } from '../custom/SelectField'
import { MultiSelectOptionsType } from '../tools/MultiSelect'

interface FieldCityProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
    country: string
    options: any
    onChange: (value: string) => void
}

const FieldCity: FC<FieldCityProps> = ({
    control,
    disabled,
    name = 'city',
    label = 'Ville',
    placeholder = 'Sélectionner le ville',
    country,
    options,
    onChange,
}) => {
    const [cities, setCities] = useState<MultiSelectOptionsType[]>([])
    useEffect(() => {
        const fetchCountry = async () => {
            setCities(
                options?.map((city: any) => ({
                    key: city.id,
                    label: city.name,
                    id: city.id,
                }))
            )
            // const countries = await getCities(country)
            // setCities(countries)
        }
        if (country) fetchCountry()
    }, [country, options])
    return (
        <SelectField
            control={control}
            name={name}
            label={label}
            options={cities}
            placeholder={country ? placeholder : "Sélectionner le pays d'abord"}
            disabled={disabled}
            onChange={(value) => {
                const id = cities.find((values) => values.key === value)?.id
                onChange(id!)
            }}
        />
    )
}

export default FieldCity
