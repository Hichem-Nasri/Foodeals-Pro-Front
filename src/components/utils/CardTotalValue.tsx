import { cn } from '@/lib/utils'
import { FC } from 'react'
import { Skeleton } from '../ui/skeleton'
import { IconType } from '@/types/common-types'
import { Label } from '../custom/Label'

interface CardTotalValueProps {
    Icon: IconType
    title: string
    value: number
    currency?: boolean
    className?: string
    isLoading?: boolean
    deadline?: string
}

export const CardTotalValue: FC<CardTotalValueProps> = ({
    title,
    value,
    className,
    currency,
    Icon,
    isLoading,
    deadline,
}) => {
    const total = !currency ? `${value} MAD` : `${value}`
    return (
        <div className='flex h-full w-full flex-1 flex-col gap-1 whitespace-nowrap rounded-[14px] bg-white p-4 lg:w-full lg:min-w-72'>
            {isLoading ? (
                <Skeleton className='flex h-32 flex-col justify-between bg-white'>
                    <Skeleton className='self-items-start h-16 w-full rounded-[12px] bg-lynch-50' />
                    <Skeleton className='ml-auto size-10 overflow-hidden text-ellipsis whitespace-nowrap text-[1.375rem] font-semibold text-primary' />
                </Skeleton>
            ) : (
                <>
                    <div
                        className={`flex items-center ${deadline ? 'justify-between' : 'justify-start'}`}
                    >
                        <div className='flex items-center gap-3'>
                            <span
                                className={cn(
                                    'rounded-full bg-primary p-2.5',
                                    className
                                )}
                            >
                                {<Icon className='text-white' />}
                            </span>
                            <Label
                                label={title}
                                className='w-fit overflow-hidden text-nowrap text-lg font-medium text-lynch-950'
                            />
                        </div>
                        {deadline && (
                            <div className='flex items-center gap-2 rounded-full bg-coral-100 px-3 py-1.5 text-coral-500'>
                                {deadline}
                            </div>
                        )}
                    </div>
                    <div
                        className={cn(
                            'ml-auto overflow-hidden text-ellipsis whitespace-nowrap py-2 text-[1.375rem] font-semibold text-primary',
                            className?.replace('bg', '')
                        )}
                    >
                        {total}
                    </div>
                </>
            )}
        </div>
    )
}
