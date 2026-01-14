import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { SelectField } from '../custom/SelectField'
import { MultiSelectOptionsType } from '../tools/MultiSelect'

interface FieldRegionProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
    city: string
    country: string
    options: any
    onChange: (value: string) => void
}

const FieldRegion: FC<FieldRegionProps> = ({
    control,
    disabled,
    name = 'region',
    label = 'Region',
    placeholder = 'Sélectionner le region',
    city,
    country,
    options,
    onChange,
}) => {
    const [regions, setRegions] = useState<MultiSelectOptionsType[]>([])
    useEffect(() => {
        const fetchRgions = async () => {
            const regions = options
                ?.find((cities: any) => cities.id === city)
                ?.regionsResponse.map((region: any) => ({
                    key: region.id,
                    label: region.name,
                    id: region.id,
                }))
            // const countries = await getRegions(city)

            setRegions(regions || [])
        }
        if (city) fetchRgions()
    }, [country, city, options])
    return (
        <SelectField
            control={control}
            name={name}
            label={label}
            options={regions}
            placeholder={
                city
                    ? placeholder
                    : country
                      ? "Sélectionner la ville d'abord"
                      : "Sélectionner le pays d'abord"
            }
            disabled={disabled}
            onChange={(value) => {
                const id = regions.find((values) => values.key === value)?.id

                onChange(id!)
            }}
        />
    )
}

export default FieldRegion
