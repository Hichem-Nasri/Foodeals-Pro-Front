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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppRoutes } from '@/lib/routes'
import { Label } from '@/components/custom/Label'
import { PaymentValidation } from '../../PaymentValidation'
import { ConfirmPayment } from '../../ConfirmPayment'
import {
    PaymentStatusEnum,
    PartnerType,
    PaymentCommission,
} from '@/types/payment-types'
import Link from 'next/link'
const PaymentCommissionCard = ({
    commission,
}: {
    commission: PaymentCommission
}) => {
    const payed = commission.toPay.amount != 0
    const label = payed ? 'A PAYER' : 'A RECEVOIR'
    const icon = payed ? Banknote : HandCoins
    const router = useRouter()
    const dataArray = [
        {
            label: commission.ref || '0236',
            icon: Frame,
        },
        {
            label: 'T. VENTES: ' + commission.totalAmount.amount,
            icon: Coins,
        },
        {
            label: 'COMMISSIOM FD: ' + commission.foodealsCommission.amount,
            icon: CirclePercent,
        },
        {
            label: 'A PAYER: ' + commission.foodealsCommission.amount,
            icon: icon,
            className: 'bg-mountain-100 text-mountain-400',
        },
    ]
    return (
        <div className='flex h-fit w-full flex-col items-start gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex gap-[0.375rem] text-lynch-400 flex-center'>
                    <CalendarClock size={18} />
                    <Label
                        label={commission.date}
                        className='text-xs font-medium text-lynch-500'
                    />
                </div>
                <Link
                    href={AppRoutes.paiementsOperation.replace(
                        ':id',
                        commission.id
                    )}
                    className='size-11 rounded-full bg-lynch-300 text-white flex-center'
                >
                    <ArrowRight size={18} className='m-auto w-full' />
                </Link>
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
                        <data.icon size={18} key={data.label} />
                        <Label
                            label={data.label.toString()}
                            className={cn('text-lynch-500', data?.className)}
                        />
                    </div>
                ))}
            </div>
            {
                <div className='flex w-full flex-wrap justify-normal'>
                    {payed ? (
                        <PaymentValidation
                            IconRight={CheckCheck}
                            label='Payé'
                            className='w-full bg-mountain-400 text-white hover:bg-white hover:text-mountain-400'
                            isMobile
                            id={commission.id}
                            amount={commission.toPay.amount}
                        />
                    ) : (
                        <ConfirmPayment
                            IconRight={CheckCheck}
                            label='Confirmer'
                            className='w-full bg-mountain-400 text-white hover:bg-white hover:text-mountain-400'
                            isMobile
                            id={commission.id}
                        />
                    )}
                </div>
            }
        </div>
    )
}

export default PaymentCommissionCard
