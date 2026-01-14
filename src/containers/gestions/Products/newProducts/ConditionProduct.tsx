import { CustomButton } from '@/components/custom/CustomButton'
import { AppRoutes } from '@/lib/routes'
import { CalendarClock, LoaderCircle, PencilLine } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ConditionProduct } from '../../settings'
import api from '@/utils/api'
import { ProductType } from '@/types/product-type'

interface ConditionProductType {
    // condition: string;
    days: number
    percent: number
}

export const defaultConditionProductDemo = [
    {
        conditionName: 'A consommer bientôt',
        daysBeforePickup: 10,
        discountPercentage: 60,
    },
    {
        conditionName: 'Valorisation exigée',
        daysBeforePickup: 20,
        discountPercentage: 30,
    },
    {
        conditionName: 'Valorisation souhaitable',
        daysBeforePickup: 30,
        discountPercentage: 15,
    },
]

const GetCondition = (str: string) => {
    switch (str) {
        case 'A consommer bientôt':
            return { text: 'A consommer bientôt', className: 'text-coral-500' }
        case 'Valorisation exigée':
            return { text: 'Valorisation exigée', className: 'text-tulip-500' }
        default:
            return {
                text: 'Valorisation souhaitable',
                className: 'text-primary',
            }
    }
}

const ConditionProducts = ({
    id,
    product,
}: {
    id: string
    product: ProductType
}) => {
    const [condition, setCondition] = useState<ConditionProduct[]>(
        product?.pickupConditions?.length > 0
            ? product.pickupConditions
            : defaultConditionProductDemo
    )

    return (
        <div className='flex w-full flex-col items-start justify-center gap-4 rounded-[24px] bg-white p-4'>
            <div className='flex w-full items-center justify-between'>
                <h1 className='text-lg font-bold'>Condition du retrait</h1>
                <Link href={AppRoutes.settings + `?product=${id}`}>
                    <CustomButton
                        label=''
                        size='sm'
                        className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary text-white [&>.icon]:ml-0'
                        IconRight={PencilLine}
                    />
                </Link>
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-4 px-2'>
                {condition.map((item, index) => {
                    const { text, className } = GetCondition(item.conditionName)
                    return (
                        <>
                            <div
                                key={index}
                                className='flex w-full flex-col items-start justify-center space-y-2'
                            >
                                <h1
                                    className={`${className} text-lg font-semibold`}
                                >
                                    {text}
                                </h1>
                                <h2 className='text-sm font-normal text-lynch-950'>
                                    Condition de retrait
                                </h2>
                                <div className='inline-flex gap-[30px]'>
                                    <div className='flex items-center justify-center space-x-1 text-lynch-500'>
                                        <CalendarClock size={24} />
                                        <span className='text-sm'>
                                            {item.daysBeforePickup}
                                        </span>
                                    </div>
                                    <div className='flex items-center justify-center space-x-1 text-lynch-500'>
                                        <LoaderCircle size={24} />
                                        <span className='text-sm'>
                                            {item.discountPercentage}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {index !== condition.length - 1 && (
                                <hr className='w-full border-lynch-200' />
                            )}
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default ConditionProducts
