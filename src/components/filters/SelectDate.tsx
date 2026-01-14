'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Select } from '../custom/Select'
import { CalendarClock } from 'lucide-react'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { Label } from '../custom/Label'

const getOptionsDate: (
    format: 'MM/YYYY' | 'YYYY'
) => MultiSelectOptionsType[] = (format) => {
    const date = new Date()
    const years = []
    for (let i = 0; i < 10; i++) {
        years.push(date.getFullYear() - i)
    }
    if (format == 'YYYY')
        return years.map((year) => ({
            key: year.toString(),
            label: year.toString(),
        }))
    return years.flatMap((year) => {
        const months = []
        for (let i = 12; i >= 1; i--) {
            months.push(i)
        }
        return months.map((month) => ({
            key: `${month.toString().padStart(2, '0')}/${year}`,
            label: `${month.toString().padStart(2, '0')}/${year}`,
        }))
    })
}

const SelectDate = ({
    onChange,
    disabled = false,
    label,
    format = 'MM/YYYY',
    placeholder,
    value,
    type = 'partner',
    id,
}: {
    onChange: (value: string) => void
    disabled?: boolean
    label: string
    format?: string
    placeholder?: string
    value: string
    type?: string
    id?: string
}) => {
    // const options: MultiSelectOptionsType[] = []

    const [options, setOptions] = useState<MultiSelectOptionsType[]>([])
    useEffect(() => {
        const fetch = async () => {
            let res
            // if (format == 'MM/YYYY') {
            //     if (type == 'partner' || type == 'organization') {
            //         res = await getDateAvailable(type, id)
            //     } else {
            //         res = await getDateAvailable('all')
            //     }
            // } else {
            //     res = await getYearsAvailable()
            // }

            // setOptions(res.map((date: string) => ({ key: date, label: date })))
        }
        fetch()
    }, [format, id, type])

    return (
        <div className='flex w-full flex-col items-start text-sm font-semibold'>
            <Label
                label={label}
                htmlFor={label}
                className='text-sm font-semibold text-lynch-950'
            />
            <Select
                label=''
                placeholder={placeholder || 'Sélectionner'}
                onChange={onChange}
                options={options}
                value={value.toString()}
                // disabled={disabled}
                RightIcon={CalendarClock}
                className='text-lynch-400'
                classNameParent='text-lynch-400'
            />
        </div>
    )
}

export default SelectDate
