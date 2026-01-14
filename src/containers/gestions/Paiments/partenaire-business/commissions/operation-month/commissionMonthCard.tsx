import React from 'react'
import { cn } from '@/lib/utils'
// import { Label } from '@radix-ui/react-dropdown-menu';
import {
    ArrowRight,
    Banknote,
    Building,
    CalendarClock,
    CheckCheck,
    CirclePercent,
    Coins,
    Frame,
    HandCoins,
    Minus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
    partnerCommissionMonthType,
    PaymentFilterSchema,
    PaymentStatusType,
} from '@/types/payment-types'
import { Value } from '@radix-ui/react-select'
import { PaymentStatus } from '../../../PaymentStatus'
import { Label } from '@/components/custom/Label'

const CommissionMonthCard = ({
    commission,
}: {
    commission: partnerCommissionMonthType
}) => {
    const router = useRouter()
    // const dataArray = [
    //     {
    //         label: 'Vente par carte',
    //         value: commission.cardAmount.amount,
    //     },
    //     {
    //         label: 'Vente par espèce',
    //         value: commission.cashAmount.amount,
    //     },
    //     {
    //         label: 'Commission par carte',
    //         value: commission.commission.amount,
    //     },
    //     {
    //         label: 'Commission par espèce',
    //         value: commission.cashCommission.amount,
    //     },
    //     {
    //         label: 'Total commission',
    //         value: commission.amount.amount,
    //     },
    //     {
    //         label: 'Validation',
    //         value: commission.status,
    //         fn: (value: PaymentStatusType) => {
    //             return <PaymentStatus status={value} />
    //         },
    //     },
    // ]
    return (
        <div className='flex h-fit w-full flex-col items-start gap-3 rounded-[20px] bg-white p-3'>
            <div className='grid w-full grid-cols-2 gap-3 p-2'>
                {/* {dataArray.map((data, index) => (
                    <div
                        className='cols-span-1 flex w-full flex-col items-start gap-2'
                        key={index + ''}
                    >
                        <Label label={data.label} />
                        <div className='flex h-14 w-full items-center justify-start rounded-[12px] bg-lynch-50 p-2'>
                            {data.fn ? data.fn(data.value) : data.value}
                        </div>
                    </div>
                ))} */}
            </div>
        </div>
    )
}

export default CommissionMonthCard
