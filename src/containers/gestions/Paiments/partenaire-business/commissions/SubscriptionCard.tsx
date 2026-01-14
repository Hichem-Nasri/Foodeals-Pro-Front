import React from 'react'
import { cn } from '@/lib/utils'
// import { Label } from '@radix-ui/react-dropdown-menu';
import {
    ArrowRight,
    Building,
    CalendarClock,
    Coins,
    Frame,
    HandCoins,
    Minus,
    CreditCard,
} from 'lucide-react'
import { PartnerEntitiesType, PartnerSolutionType } from '@/types/GlobalType'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import {
    partnerSubscriptionType,
    PaymentStatusType,
} from '@/types/payment-types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/custom/Label'
import { PaymentStatus } from '../../PaymentStatus'
import { usePaymentsTranslations } from '@/hooks/useTranslations'
import { SubscriptionPayment } from '../../SubscriptionPayment'

const PaymentSubscriptionCard = ({
    subscription,
}: {
    subscription: partnerSubscriptionType
}) => {
    const t = usePaymentsTranslations()
    const dataArray = [
        {
            label: subscription.reference.slice(0, 8),
            icon: Frame,
        },
        {
            label: t('deadline') + ' : ' + subscription.date,
            icon: CalendarClock,
            className: '',
        },
        {
            label: t('price') + ' : ' + subscription.total.amount,
            icon: Coins,
        },
    ]
    const name = subscription.partner.name
    return (
        <div className='flex min-w-full flex-col gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex w-full items-start justify-between'>
                <div className='flex items-center justify-end gap-[0.375rem]'>
                    <PaymentStatus status={subscription.status} />
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
                        <data.icon size={18} key={data.label} />
                        <Label
                            label={data.label.toString()}
                            className={cn('text-lynch-500', data?.className)}
                        />
                    </div>
                ))}
            </div>
            <div className='flex flex-wrap justify-normal gap-1'>
                {subscription.solutions.map((solution, index) => {
                    return (
                        <PartnerSolution
                            key={solution + index}
                            solution={solution as PartnerSolutionType}
                        />
                    )
                })}
            </div>
            <span className='h-[1px] w-full bg-lynch-100' />
            <div className='flex w-full justify-end'>
                <SubscriptionPayment
                    subscriptionId={subscription.id}
                    label={t('pay')}
                    amount={subscription.total.amount}
                    IconLeft={CreditCard}
                    disabled={subscription.status !== PaymentStatusType.IN_PROGRESS}
                    isMobile={true}
                />
            </div>
        </div>
    )
}

export default PaymentSubscriptionCard
