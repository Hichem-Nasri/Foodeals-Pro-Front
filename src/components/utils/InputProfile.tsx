import React, { FC } from 'react'
import { Control } from 'react-hook-form'
import { InputFieldForm } from '../custom/InputField'
import { Mail, PhoneCall } from 'lucide-react'

interface InputProfileProps {
    email?: boolean
    phone?: boolean
    name: string
    control: Control<any>
    disabled?: boolean
    label?: string
}

const InputProfile: FC<InputProfileProps> = ({
    email,
    phone,
    name,
    control,
    disabled,
    label,
}) => {
    return (
        <div className='flex w-full items-center justify-between'>
            <h4 className='text-base font-semibold text-lynch-950'>{label}</h4>
            <InputFieldForm
                classNameParent=' max-w-fit   ps-0 py-0'
                IconLeft={(phone && PhoneCall) || (email && Mail) || undefined}
                className='border- w-fit flex-none transition-all disabled:justify-self-end disabled:bg-transparent disabled:text-end'
                placeholder=''
                disabled={disabled}
                name={name}
                control={control}
            />
        </div>
    )
}

export default InputProfile
