import { JSX, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'

interface InputDateProps {
    placeholder: string
    className?: string
    onChange: (date: Date) => void
}

export const InputDate: React.FC<InputDateProps> = ({
    placeholder,
    className,
    onChange,
}): JSX.Element => {
    const [isDateTouched, setIsDateTouched] = useState<boolean>(false)
    const [date, setDate] = useState('')
    return (
        <div className={cn('flex h-fit w-full flex-col', className)}>
            <Input
                onBlur={() => onChange(new Date(date))}
                onChange={(value) => setDate(value.currentTarget.value)}
                value={isDateTouched ? date : ''}
                type={!isDateTouched ? 'text' : 'date'}
                placeholder={placeholder}
                onSelect={() => setIsDateTouched(true)}
                className='h-full w-full px-3 py-4'
            />
        </div>
    )
}
