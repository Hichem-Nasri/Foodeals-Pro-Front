import { FC } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select } from '../custom/Select'

interface InputScheduleProps {
    value?: {
        start: string
        end: string
    }
    onChange: (value: { start: string; end: string }) => void
    disabled?: boolean
    className?: string
}

export const InputSchedule: FC<InputScheduleProps> = ({
    onChange,
    value,
    disabled,
    className = '',
}) => {
    const times = [
        { key: '00h', label: '00h' },
        { key: '01h', label: '01h' },
        { key: '02h', label: '02h' },
        { key: '03h', label: '03h' },
        { key: '04h', label: '04h' },
        { key: '05h', label: '05h' },
        { key: '06h', label: '06h' },
        { key: '07h', label: '07h' },
        { key: '08h', label: '08h' },
        { key: '09h', label: '09h' },
        { key: '10h', label: '10h' },
        { key: '11h', label: '11h' },
        { key: '12h', label: '12h' },
        { key: '13h', label: '13h' },
        { key: '14h', label: '14h' },
        { key: '15h', label: '15h' },
        { key: '16h', label: '16h' },
        { key: '17h', label: '17h' },
        { key: '18h', label: '18h' },
        { key: '19h', label: '19h' },
        { key: '20h', label: '20h' },
        { key: '21h', label: '21h' },
        { key: '22h', label: '22h' },
        { key: '23h', label: '23h' },
    ]
    return (
        <Dialog>
            <DialogTrigger
                disabled={disabled || !value}
                className={cn(
                    'flex h-14 w-full min-w-44 max-w-full flex-shrink items-center gap-3 rounded-[12px] bg-lynch-50 px-3 py-4 text-sm outline-none file:bg-transparent file:text-base file:font-normal placeholder:text-lynch-400 disabled:cursor-default disabled:text-lynch-500',
                    className,
                    !value &&
                        '!placeholder:text-red-500 !bg-coral-50 !text-coral-300'
                )}
            >
                <CalendarClock
                    className={`icon ${value?.start ? 'text-mountain-400' : ''}`}
                />
                {value ? `${value.start} - ${value.end}` : 'Libre'}
            </DialogTrigger>
            <DialogContent className='w-full max-w-[42.5rem] gap-[1.875rem] rounded-[14px] p-5 [&>.Icon]:hidden'>
                <DialogTitle className='text-[1.375rem] font-normal text-lynch-400'>
                    Afficher les colonnes
                </DialogTitle>
                <DialogDescription className='flex items-center gap-4'>
                    <Select
                        options={times}
                        value={value?.start || ''}
                        label='commencer'
                        onChange={(start) =>
                            onChange({
                                start: start,
                                end: value?.end || '',
                            })
                        }
                    />
                    <Select
                        options={times}
                        value={value?.end || ''}
                        label='finir'
                        onChange={(end) =>
                            onChange({
                                start: value?.start || '',
                                end: end,
                            })
                        }
                    />
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
