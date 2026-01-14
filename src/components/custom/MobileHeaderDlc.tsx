import { ChevronLeft } from 'lucide-react'
import React, { FC } from 'react'
import { DialogClose } from '../ui/dialog'

interface MobileHeaderProps {
    onClick: () => void
    title: string
    buttonType?: 'dialog' | 'button'
}

const MobileHeaderDlc: FC<MobileHeaderProps> = ({
    title,
    onClick,
    buttonType = 'button',
}) => {
    return (
        <div className='sticky top-0 z-40 flex w-full items-center justify-between border-b border-[#FAC215] bg-white px-4 py-4 lg:hidden'>
            {buttonType === 'button' ? (
                <button className='text-lynch-400' onClick={onClick}>
                    <ChevronLeft size={24} />
                </button>
            ) : (
                <DialogClose onClick={onClick}>
                    <ChevronLeft size={24} />
                </DialogClose>
            )}
            <h1 className='text-lynch-950'>{title}</h1>
        </div>
    )
}

export default MobileHeaderDlc
