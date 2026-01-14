'use client'

import { FC } from 'react'
import { LucideIcon } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

interface HistoryCardProps {
    Icon: LucideIcon
    title: string
    value: string | number
    color?: string
    isLoading?: boolean
}

const HistoryCard: FC<HistoryCardProps> = ({
    Icon,
    title,
    value,
    color = '#FAC215',
    isLoading = false,
}) => {
    const colorBg = `bg-[${color}]`
    return (
        <div className='flex min-h-[160px] flex-1 flex-col items-center justify-between gap-6 rounded-2xl bg-white p-6'>
            <div className='flex w-full flex-col items-center justify-center gap-4'>
                <div className={`${colorBg} w-fit rounded-full p-2`}>
                    <Icon className='h-6 w-6 text-white' />
                </div>
                <h3 className='font-montserrat text-center text-[18px] font-normal leading-[21.94px] text-[#23272E]'>
                    {title}
                </h3>
            </div>
            {isLoading ? (
                <Skeleton className='size-14 rounded-[14px] bg-lynch-50' />
            ) : (
                <div
                    className='font-montserrat text-[22px] font-semibold leading-[26.82px]'
                    style={{ color }}
                >
                    {value}
                </div>
            )}
        </div>
    )
}

export default HistoryCard
