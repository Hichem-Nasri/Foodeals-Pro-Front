import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { SelectField } from '../custom/SelectField'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { useTranslations } from '@/hooks/useTranslations'

interface FieldRegionProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
    city: string
    state: string
    country: string
    onChange: (value: string) => void
}

const FieldRegion: FC<FieldRegionProps> = ({
    control,
    disabled,
    name = 'region',
    label,
    placeholder,
    city,
    country,
    state,
    onChange,
}) => {
    const { t } = useTranslations()
    const [regions, setRegions] = useState<MultiSelectOptionsType[]>([])
    
    useEffect(() => {
        const fetchRegions = async () => {
            // const regions = await getRegions()
            // setRegions(regions)
        }
        if (city && country) fetchRegions()
    }, [city, country])
    
    const getPlaceholder = () => {
        if (placeholder) return placeholder
        if (city) return t('fields.selectRegion')
        if (country) return t('fields.selectCityFirst')
        if (state) return t('fields.selectStateFirst')
        return t('fields.selectCountryFirst')
    }
    
    return (
        <SelectField
            control={control}
            name={name}
            label={label || t('fields.region')}
            options={regions}
            placeholder={getPlaceholder()}
            disabled={disabled}
            onChange={(value) => {
                const id = regions.find((values) => values.key === value)?.id
                onChange(id!)
            }}
        />
    )
}

export default FieldRegion
