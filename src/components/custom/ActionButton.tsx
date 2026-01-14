// src/components/custom/ActionButton.tsx
import { FC } from 'react'
import { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
    Icon: LucideIcon
    bgColor: string
    onClick?: () => void
}

const ActionButton: FC<ActionButtonProps> = ({ Icon, bgColor, onClick }) => {
    return (
        <button
            className={`${bgColor} flex size-[46px] items-center justify-center rounded-full p-2`}
            onClick={onClick}
        >
            <Icon className='h-6 w-6 text-white' />
        </button>
    )
}

export default ActionButton
