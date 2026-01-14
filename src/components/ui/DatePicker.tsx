// @/components/ui/DatePicker.tsx
import { format } from 'date-fns'
import { Calendar as CalendarIcon, LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ForwardRefExoticComponent, RefAttributes, forwardRef } from 'react'
import { Control, Controller } from 'react-hook-form'
import { Label } from '../custom/Label'

interface DatePickerProps {
    control: Control<any>
    name: string
    label: string
    icon?: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
    disabled?: boolean
    placeholder?: string
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    (
        {
            control,
            name,
            label,
            icon: Icon,
            disabled,
            placeholder = 'Sélectionner une date',
        },
        ref
    ) => {
        return (
            <div className='w-full' ref={ref}>
                <div className='flex flex-col gap-3'>
                    {' '}
                    {/* Added container with gap-3 */}
                    <Label
                        label={label}
                        className={cn(
                            'label text-sm font-semibold text-lynch-950'
                        )}
                    />
                    <Controller
                        control={control}
                        name={name}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        disabled={disabled || field.disabled}
                                        className={cn(
                                            'h-[56px] w-full items-center justify-between gap-3 px-3 py-2',
                                            'bg-[#f5f7f9]',
                                            'text-left font-normal',
                                            disabled ? '!text-[#526077]' : '', // Add this line
                                            !field.value && 'text-[#8695AA]',
                                            'rounded-[12px] border-none hover:bg-[#f5f7f9]'
                                        )}
                                    >
                                        <span className='text-base font-normal'>
                                            {field.value
                                                ? format(field.value, 'PPP')
                                                : placeholder}
                                        </span>
                                        {Icon && (
                                            <Icon
                                                className={cn(
                                                    'h-6 w-6',
                                                    disabled
                                                        ? 'text-[#526077]'
                                                        : 'text-[#8695AA]' // Update icon color when disabled
                                                )}
                                            />
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className='w-auto p-0'
                                    align='center'
                                >
                                    <Calendar
                                        mode='single'
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                        className='rounded-md border'
                                        classNames={{
                                            day_selected:
                                                'bg-[#FAC215] text-white hover:!bg-[#FAC215] hover:!text-white focus:bg-[#FAC215]',
                                            day_today: `${
                                                field.value?.toDateString() ===
                                                new Date().toDateString()
                                                    ? 'bg-[#FAC215] text-white hover:!bg-[#FAC215] hover:!text-white focus:bg-[#FAC215]'
                                                    : 'bg-white text-[#FAC215] border border-[#FAC215]'
                                            }`,
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                </div>
            </div>
        )
    }
)

DatePicker.displayName = 'DatePicker'
