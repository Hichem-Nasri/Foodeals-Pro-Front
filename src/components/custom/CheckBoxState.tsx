import React from 'react'
import { Check, Minus, Box } from 'lucide-react'

interface TriStateCheckboxProps {
    state: 'all' | 'some' | 'none'
    onChange: (value?: any) => void
}

export const TriStateCheckbox: React.FC<TriStateCheckboxProps> = ({
    state,
    onChange,
}) => {
    return (
        <div
            onClick={onChange}
            className={`flex h-5 w-5 cursor-pointer items-center justify-center p-[2px_0_0_0] ${
                state === 'all'
                    ? `h-5 w-5 rounded-[6px_6px_6px_6px] border-2 border-[#FDD147] bg-[#FDD147] p-[7px_6px_7px_6px]`
                    : state === 'some'
                      ? `h-5 w-5 rounded-[6px_6px_6px_6px] border-[1.5px] border-[#FDD147] bg-[#FDD147]`
                      : `h-5 w-5 rounded-[6px_6px_6px_6px] border-[1.5px] border-[#B1BBC8] opacity-80`
            } `}
        >
            {state === 'all' && (
                <Check className='absolute h-4 w-4 text-white' />
            )}
            {state === 'some' && (
                <Minus className='absolute h-4 w-4 text-white' />
            )}
        </div>
    )
}
