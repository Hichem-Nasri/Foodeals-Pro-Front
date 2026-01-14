import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { SelectField } from '../custom/SelectField'
import { getCities } from '@/actions/global'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { useTranslations } from '@/hooks/useTranslations'

interface FieldCityProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
    country: string
    state: string
    onChange: (value: string) => void
}

const FieldCity: FC<FieldCityProps> = ({
    control,
    disabled,
    name = 'city',
    label,
    placeholder,
    country,
    state,
    onChange,
}) => {
    const { t } = useTranslations()
    const [cities, setCities] = useState<MultiSelectOptionsType[]>([])
    
    useEffect(() => {
        const fetchCountry = async () => {
            const cities = await getCities()
            setCities(cities)
        }
        if (country) fetchCountry()
    }, [country])
    
    const getPlaceholder = () => {
        if (placeholder) return placeholder
        if (state) return t('fields.selectCity')
        if (country) return t('fields.selectStateFirst')
        return t('fields.selectCountryFirst')
    }
    
    return (
        <SelectField
            control={control}
            name={name}
            label={label || t('fields.city')}
            options={cities}
            placeholder={getPlaceholder()}
            disabled={disabled}
            onChange={(value) => {
                const id = cities.find((values) => values.key === value)?.id
                onChange(id!)
            }}
        />
    )
}

export default FieldCity
