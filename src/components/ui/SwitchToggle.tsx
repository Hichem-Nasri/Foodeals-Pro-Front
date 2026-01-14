import { cn } from '@/lib/utils'
import React, { FC } from 'react'

interface SwitchToggleProps<T extends string> {
    selectedType: T
    setSwitchTable: (type: T) => void
    options: T[]
}

const SwitchToggle = <T extends string>({
    selectedType,
    setSwitchTable,
    options,
}: SwitchToggleProps<T>) => {
    const handleSwitch = (type: T) => {
        setSwitchTable(type)
    }

    return (
        <div className='flex w-fit items-center justify-start rounded-[14px] bg-white p-2 text-xs lg:text-[14px]'>
            <div className='relative flex w-auto items-center justify-start gap-2 rounded-[14px] bg-white'>
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => handleSwitch(option)}
                        className={cn(
                            `w-auto cursor-pointer rounded-[4px] px-5 py-2 text-lynch-400`,
                            `${
                                selectedType === option ? 'z-10 text-white' : ''
                            }`
                        )}
                    >
                        {option}
                    </div>
                ))}
                <div
                    className={cn(
                        `absolute left-0 top-0 z-0 h-full w-1/2 rounded-[4px] bg-mountain-400 transition-all`,
                        `${
                            selectedType === options[1]
                                ? 'translate-x-full'
                                : ''
                        }` // Assumes the second option is the one that needs to be translated
                    )}
                ></div>
            </div>
        </div>
    )
}

export default SwitchToggle
