import React from 'react'
import { Check, Box } from 'lucide-react'

interface CheckboxProps {
    checked: boolean
    onChange: (value?: any) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange }) => {
    return (
        <div 
            onClick={onChange}
            className={`
                w-5 h-5 p-[2px_0_0_0]
                cursor-pointer
                flex items-center justify-center
                ${checked ? `
                    w-5 h-5 p-[7px_6px_7px_6px]
                    rounded-[6px_6px_6px_6px]
                    border-2 border-[#FDD147]
                    bg-[#FDD147]
                ` : `
                    w-5 h-5
                    rounded-[6px_6px_6px_6px]
                    border-[1.5px] border-[#B1BBC8]
                    opacity-80
                `}
            `}
        >
            {checked && (
                <Check className="w-4 h-4 text-white absolute" />
            )}
        </div>
    )
}