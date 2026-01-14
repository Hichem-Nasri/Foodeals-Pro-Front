import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { SelectField } from '../custom/SelectField'
import { getCountry } from '@/actions/global'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { useTranslations } from '@/hooks/useTranslations'

interface FieldCountryProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
    country: string
    onChange: (value: string) => void
}

const FieldCountry: FC<FieldCountryProps> = ({
    control,
    disabled,
    name = 'country',
    label,
    placeholder,
    country,
    onChange,
}) => {
    const { t } = useTranslations()
    const [countries, setCountry] = useState<MultiSelectOptionsType[]>([])
    
    useEffect(() => {
        const fetchCountry = async () => {
            const countries = await getCountry()
            setCountry(countries)
        }
        fetchCountry()
    }, [country])
    
    return (
        <SelectField
            control={control}
            name={name}
            label={label || t('fields.country')}
            options={countries}
            placeholder={placeholder || t('fields.selectCountry')}
            disabled={disabled}
            onChange={(value) => {
                const id = countries.find((values) => values.key === value)?.id
                onChange(id!)
            }}
        />
    )
}

export default FieldCountry
