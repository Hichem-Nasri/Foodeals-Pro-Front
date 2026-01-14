import React from 'react'
import { cn } from '@/lib/utils'
// import { Label } from '@radix-ui/react-dropdown-menu';
import {
    ArrowRight,
    CalendarClock,
    CirclePercent,
    Frame,
    HandCoins,
    Minus,
} from 'lucide-react'
import { PartnerInfoDto } from '@/types/GlobalType'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/custom/Label'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { partnerSubscriptonOnesType, deadlineType } from '@/types/payment-types'

const PaymentOnesSubscriptionCard = ({
    subscription,
    partner,
    setPartnerDeadlines,
}: {
    subscription: partnerSubscriptonOnesType
    partner: PartnerInfoDto
    setPartnerDeadlines: (deadlines: deadlineType[]) => void
}) => {
    const dataArray = [
        {
            label:
                subscription.reference.slice(0, 4) +
                subscription.reference.slice(-4),
            icon: Frame,
        },
        {
            label: 'Nbr d’écheance: ' + subscription.deadlines.length,
            icon: Minus,
            className: '',
        },
        {
            label:
                'T. d’échéance: ' +
                subscription.total.amount +
                subscription.total.currency,
            icon: HandCoins,
        },
        {
            label:
                'P. d’échéance: ' +
                subscription.deadlines[0]?.amount.amount +
                subscription.deadlines[0]?.amount.currency,
            icon: CirclePercent,
        },
    ]
    const date =
        subscription.deadlines.find((val) => val.deadlineStatus == 'IN_VALID')
            ?.date || subscription.deadlines[0]?.date
    return (
        <div className='flex min-w-full flex-col gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex w-full items-start justify-between'>
                <div className='flex gap-[0.375rem]'>
                    <Avatar className='size-[2.875rem] shrink-0'>
                        <AvatarImage src={partner.avatarPath!} />
                        <AvatarFallback>
                            {partner.name && partner.name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <Label
                            label={partner.name}
                            className='text-sm font-normal text-lynch-950'
                        />
                        <div className='flex items-center gap-2 text-lynch-500'>
                            <CalendarClock size={18} />
                            <Label
                                label={date!}
                                className='text-xs font-medium text-lynch-500'
                            />
                        </div>
                    </div>
                </div>
                <button
                    className='size-11 rounded-full bg-lynch-300 text-white'
                    onClick={() => {
                        const deadlines = subscription.deadlines.sort(
                            (a, b) => {
                                return (
                                    new Date(b.date).getTime() -
                                    new Date(a.date).getTime()
                                )
                            }
                        )
                        setPartnerDeadlines(deadlines)
                    }}
                >
                    <ArrowRight size={18} className='m-auto w-full' />
                </button>
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
            <div className='flex flex-wrap justify-normal'>
                {subscription.solution.map((solution) => (
                    <PartnerSolution solution={solution} key={solution} />
                ))}
            </div>
        </div>
    )
}

export default PaymentOnesSubscriptionCard
