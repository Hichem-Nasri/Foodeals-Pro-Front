import { cn } from '@/lib/utils'
// import { Label } from '@radix-ui/react-dropdown-menu';
import {
    ArrowRight,
    Building,
    CalendarClock,
    Frame,
    HandCoins,
    Minus,
} from 'lucide-react'
import { PartnerEntitiesType, PartnerSolutionType } from '@/types/GlobalType'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { partnerSubscriptionType } from '@/types/payment-types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/custom/Label'

const PaymentSubscriptionCard = ({
    subscription,
    setSubscriptionId,
}: {
    subscription: partnerSubscriptionType
    setSubscriptionId: React.Dispatch<React.SetStateAction<string>>
}) => {
    const dataArray = [
        {
            label: subscription.reference.slice(0, 8),
            icon: Frame,
        },
        {
            label:
                subscription.type === PartnerEntitiesType.SUB_ENTITY
                    ? 'Sous Compte'
                    : 'Principal',
            icon: Building,
            className: '',
        },
        {
            label: 'T. ventes : ' + subscription.total.amount,
            icon: HandCoins,
        },
    ]
    const name = subscription.partner.name
    return (
        <div className='flex min-w-full flex-col gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex w-full items-start justify-between'>
                <div className='flex gap-[0.375rem]'>
                    <Avatar className='size-[2.875rem] shrink-0'>
                        <AvatarImage src={subscription.partner.avatarPath} />
                        <AvatarFallback>
                            {name && name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <Label
                            label={name}
                            className='text-sm font-normal text-lynch-950'
                        />
                        <div className='flex items-center gap-2 text-lynch-500'>
                            <CalendarClock size={18} />
                            <Label
                                label={new Date().toDateString()}
                                className='text-xs font-medium text-lynch-500'
                            />
                        </div>
                    </div>
                </div>
                <Link
                    href={'#'} //TODO: Add the link
                    className='flex size-11 items-center justify-center rounded-full bg-lynch-300 text-white hover:bg-lynch-300'
                    // onClick={() => setSubscriptionId(subscription.reference)}
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
            <div className='flex flex-wrap justify-normal'>
                {subscription.solutions.map((solution, index) => {
                    return (
                        <PartnerSolution
                            key={solution + index}
                            solution={solution as PartnerSolutionType}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default PaymentSubscriptionCard
