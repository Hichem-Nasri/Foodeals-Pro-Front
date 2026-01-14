import { FC } from 'react'

import { UseFormReturn, Controller } from 'react-hook-form'
import { Label } from '../custom/Label'
import { DatePicker } from '../tools/DatePicker'

interface DateFilterProps {
    form: UseFormReturn<any>
    disabled: boolean
}

export const DateFilter: FC<DateFilterProps> = ({ form, disabled }) => {
    const { control } = form

    return (
        <div className='flex w-full flex-col gap-3'>
            <Label label='Date de création (Début et fin)' htmlFor='start' />
            <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
                <Controller
                    control={control}
                    name='startDate'
                    render={({ field }) => {
                        return (
                            <DatePicker
                                onChange={(newDate) => {
                                    if (newDate) {
                                        field.onChange(newDate.toISOString())
                                    } else {
                                        field.onChange('')
                                    }
                                }}
                                value={
                                    !field.value
                                        ? undefined
                                        : new Date(field.value)
                                }
                                id='start'
                                disabled={disabled}
                            />
                        )
                    }}
                />
                <Controller
                    control={control}
                    name='endDate'
                    render={({ field }) => (
                        <DatePicker
                            onChange={(newDate) => {
                                if (newDate) {
                                    field.onChange(
                                        `${newDate.toISOString().split('T')[0]}T23:59:59.999Z`
                                    )
                                } else {
                                    field.onChange('')
                                }
                            }}
                            value={
                                !field.value ? undefined : new Date(field.value)
                            }
                            id='end'
                            disabled={disabled}
                        />
                    )}
                />
            </div>
        </div>
    )
}
