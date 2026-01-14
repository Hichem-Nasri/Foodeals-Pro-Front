import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

const CardSkeleton = () => {
    const dataArray = [
        {
            label: '0236',
            className: '',
        },
        {
            label: 'PRIX: 1000',
        },
        {
            label: 'QTE 10',
        },
        {
            label: 'V.CARTE: 500',
        },
        {
            label: 'C.CARTE: 500',
        },
    ]
    return (
        <div className='flex w-full animate-fade-down flex-col items-center justify-center gap-3 rounded-[20px] bg-white p-3 lg:hidden'>
            <div className='flex w-full items-start justify-between'>
                <div className='flex gap-[0.375rem]'>
                    <Skeleton className='size-20 rounded-full' />
                    <div className='flex flex-col gap-1'>
                        <Skeleton className='text-sm font-normal text-lynch-950' />
                    </div>
                </div>
            </div>
            <span className='h-[1px] w-full bg-lynch-100' />
            <div className='flex flex-wrap gap-[0.375rem]'>
                {dataArray.map((data) => (
                    <div
                        key={data.label}
                        className={cn(
                            'flex gap-[0.375rem] rounded-full bg-lynch-100 px-3 py-[0.375rem] text-lynch-500',
                            data?.className
                        )}
                    >
                        <Skeleton className='size-6 rounded-full' />
                        <Skeleton
                            className={cn(
                                'w-24 text-lynch-500',
                                data?.className
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CardSkeleton
