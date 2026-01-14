'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { cn } from '@/lib/utils'
import { Percent, FileBadge } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'

interface SwitchPaymentProps {
    state: 'commissions' | 'subscriptions'
    setState: React.Dispatch<
        React.SetStateAction<'commissions' | 'subscriptions'>
    >
}

export const SwitchPayment: FC<SwitchPaymentProps> = ({ state, setState }) => {
    const router = useRouter()
    const handleClick = (type: 'commissions' | 'subscriptions') => {
        setState(type)
    }
    return (
        <div className='flex h-fit w-fit items-center justify-center space-x-0 rounded-[14px] bg-white p-0 lg:hidden lg:space-x-3 lg:bg-transparent lg:p-2'>
            <CustomButton
                label='Validation des commissions'
                className={cn(
                    'whitespace-normal rounded-none border-lynch-200 bg-transparent text-center text-[14px] font-[21.94px] text-lynch-400 transition-all hover:bg-transparent lg:h-12 lg:rounded-[12px] lg:border-2 lg:text-sm lg:font-normal lg:hover:bg-lynch-400/80 lg:hover:text-white [&>.icon]:hidden lg:[&>.icon]:flex',
                    state === 'commissions' &&
                        'border-primary text-primary lg:hover:bg-primary'
                )}
                IconRight={Percent}
                onClick={() => handleClick('commissions')}
            />
            <span className='h-9 w-[1px] bg-lynch-400 lg:hidden' />
            <CustomButton
                label='Validation des abonnements'
                className={cn(
                    'whitespace-normal rounded-none border-lynch-200 bg-transparent text-center text-[14px] font-[21.94px] text-lynch-400 transition-all hover:bg-transparent lg:h-12 lg:rounded-[12px] lg:border-2 lg:text-sm lg:font-normal lg:hover:bg-lynch-400/80 lg:hover:text-white [&>.icon]:hidden lg:[&>.icon]:flex',
                    state === 'subscriptions' &&
                        'border-primary text-primary lg:hover:bg-primary'
                )}
                IconRight={FileBadge}
                onClick={() => handleClick('subscriptions')}
            />
        </div>
    )
}
