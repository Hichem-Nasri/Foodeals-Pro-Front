import { FC } from 'react'
import { Switch as SwitchShadCn } from '../ui/switch'
import { Label } from './Label'

interface SwitchProps {
    label: string
    checked: boolean
    onChange: (e: unknown) => void
}

export const Switch: FC<SwitchProps> = ({ label, checked, onChange }) => {
    return (
        <div
            onClick={onChange}
            className={`flex cursor-pointer items-center gap-3 border ${
                checked
                    ? 'border-primary bg-white text-primary'
                    : 'border-lynch-50 bg-lynch-50'
            } rounded-[12px] px-3 py-4`}
        >
            <Label
                label={label}
                htmlFor={label}
                className={`cursor-pointer ${
                    checked ? 'text-primary' : 'text-lynch-400'
                }`}
            />
            <SwitchShadCn name={label} checked={checked} />
        </div>
    )
}
