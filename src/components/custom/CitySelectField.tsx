'use client'
import { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { FormField, FormMessage } from '../ui/form'
import { cn } from '@/lib/utils'
import DialogMulti from './DialogMulti'
import { ArrowBigDown } from 'lucide-react'
import { Label } from './Label'

interface CitySelectFieldProps {
    control: Control<any>
    placeholder?: string
    label: string
    name: string
    disabled?: boolean
    className?: string
    country: string
}

export const CitySelectField: FC<CitySelectFieldProps> = ({
    control,
    placeholder = 'Sélectionnez',
    label,
    name,
    disabled = false,
    country,
    className,
}) => {
    const [value, setValue] = useState<string>('')
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className={cn('flex w-full flex-col', className)}>
                    <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                        <Label
                            label={label}
                            className='text-xs font-semibold text-lynch-950'
                        />
                        <DialogMulti
                            placeholder={placeholder}
                            value={field.value}
                            setValue={setValue}
                            onChange={(e) => field.onChange(e)}
                            disabled={disabled}
                        />
                    </div>
                    <FormMessage />
                </div>
            )}
        />
    )
}
