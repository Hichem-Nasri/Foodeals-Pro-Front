import React, { FC, useEffect, useState } from 'react'
import { MultiSelectField } from '../custom/MultiSelectField'
import { Control } from 'react-hook-form'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import api from '@/utils/api'
import { useTranslations } from '@/hooks/useTranslations'

interface FieldActivitiesProps {
    control: Control<any>
    name: string
    label?: string
    disabled: boolean
    type: 'PARTNER' | 'ASSOCIATION' | 'DELIVERY_PARTNER'
    isLoaded?: boolean
}

const fetchActivities = async (type: string) => {
    const response = await api
        .get(`/activities`)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err)
            return []
        })
    const data = await response

    return data.map((item: any) => ({
        key: item.name,
        label: item.name,
        id: item.id,
    }))
}

const FieldActivities: FC<FieldActivitiesProps> = ({
    control,
    disabled,
    name,
    label,
    type,
    isLoaded,
}) => {
    const { t } = useTranslations()
    const [activities, setActivities] = useState<MultiSelectOptionsType[]>([])
    
    useEffect(() => {
        const fetchActivites = async () => {
            const activity = await fetchActivities(type)
            setActivities(activity)
        }
        fetchActivites()
    }, [type])

    return (
        <MultiSelectField
            control={control}
            name={name}
            label={label || t('fields.activities')}
            options={activities}
            disabled={disabled}
            placeholder={t('fields.select')}
            transform={(value) =>
                value.map((item) => (
                    <span
                        key={item.key}
                        className='rounded-full bg-lynch-200 px-3 py-[0.469rem] text-[0.625rem] font-bold text-lynch-500'
                    >
                        {item.label}
                    </span>
                ))
            }
            len={2}
        />
    )
}

export default FieldActivities
