import { createColumnHelper } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
    PartnerEntitiesType,
    PartnerSolutionType,
    PartnerStatusType,
} from '@/types/GlobalType'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { AppRoutes } from '@/lib/routes'
import {
    partnerSubscriptionType,
    partnerSubscriptonOnesType,
    deadlineType,
    DeadlineStatus,
    PaymentStatusType,
} from '@/types/payment-types'
import { ConfirmPayment } from '../ConfirmPayment'
import { formatDate } from '@/utils/utils'
import { PartnerStatus } from '@/components/utils/PartnerStatus'
import { PaymentStatus } from '../PaymentStatus'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

//* Subscription General

const columnHelperSubscription = createColumnHelper<partnerSubscriptionType>()

export const columnsSubscriptionTable = (router: AppRouterInstance) => {
    const t = usePaymentsTranslations()
    return [
        columnHelperSubscription.accessor('reference', {
            cell: (info) => info.getValue().slice(0, 4) + info.getValue().slice(-4),
            header: t('reference'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscription.accessor('date', {
            cell: (info) => {
                return <span>{info.getValue()}</span>
            },
            header: t('deadline'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscription.accessor('total', {
            cell: (info) => info.getValue().amount + info.getValue().currency,
            header: t('price'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscription.accessor('partner', {
            cell: (info) => {
                return (
                    <AvatarAndName
                        className='flex items-center gap-1 text-nowrap'
                        name={info.getValue().name}
                        avatar={info.getValue().avatarPath}
                    />
                )
            },
            header: t('by'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscription.accessor('solutions', {
            cell: (info) => (
                <div className='flex items-center gap-1'>
                    {info.getValue().map((solution) => (
                        <PartnerSolution
                            solution={solution as PartnerSolutionType}
                            key={solution}
                        />
                    ))}
                </div>
            ),
            header: t('solutions'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscription.accessor('status', {
            cell: (info) => {
                return <PaymentStatus status={info.getValue()} />
            },
            header: t('status'),
            footer: (info) => info.column.id,
        }),
    ]
}

//* Subscription Ones
const columnHelperSubscriptionOnes =
    createColumnHelper<partnerSubscriptonOnesType>()

export const columnsSubscriptionOnesTable = (
    setPartnerDeadlines: (deadlines: deadlineType[]) => void
) => {
    const t = usePaymentsTranslations()
    return [
        columnHelperSubscriptionOnes.accessor('reference', {
            cell: (info) => info.getValue(),
            header: t('reference_short'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('date', {
            cell: (info) => {
                const date = formatDate(new Date(info.getValue()), 'long')
                return (
                    date.split(' ')[1] +
                    ' ' +
                    date.split(' ')[0] +
                    ' ' +
                    date.split(' ')[2]
                )
            },
            header: t('deadline'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('deadlines', {
            cell: (info) => info.getValue().length,
            header: t('deadlineCount'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('amount', {
            cell: (info) => {
                const amount = info.getValue().amount
                return (
                    amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD'
                )
            },
            header: t('deadlinePrice'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('total', {
            cell: (info) =>
                info
                    .getValue()
                    .amount.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD',
            header: t('deadlineTotal'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('solution', {
            cell: (info) => {
                return (
                    <div className='flex items-center justify-center space-x-2'>
                        {info.getValue().map((solution) => (
                            <PartnerSolution solution={solution} key={solution} />
                        ))}
                    </div>
                )
            },
            header: t('solution'),
            footer: (info) => info.column.id,
        }),
        columnHelperSubscriptionOnes.accessor('id', {
            cell: (info) => (
                <div
                    title={t('view')}
                    onClick={() => {
                        const deadlines = info.row.getValue(
                            'deadlines'
                        ) as deadlineType[]
                        if (info.row.getValue('deadlines'))
                            setPartnerDeadlines(
                                deadlines.sort((a, b) => {
                                    return (
                                        new Date(b.date).getTime() -
                                        new Date(a.date).getTime()
                                    )
                                })
                            )
                    }}
                    className='flex items-center justify-center'
                >
                    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-lynch-300 p-2 text-white'>
                        <Eye size={20} />
                    </div>
                </div>
            ),
            header: t('activity'),
            footer: (info) => info.column.id,
        }),
    ]
}

//* Validation Subscription
const columnValidationSubscriptionHelper = createColumnHelper<deadlineType>()

export const columnsValidationTable = () => {
    const t = usePaymentsTranslations()
    return [
        columnValidationSubscriptionHelper.accessor('ref', {
            cell: (info) => info.getValue().slice(0, 3) + info.getValue().slice(-3),
            header: t('reference_short'),
            footer: (info) => info.column.id,
        }),
        columnValidationSubscriptionHelper.accessor('date', {
            cell: (info) => {
                const date = formatDate(new Date(info.getValue()), 'long')
                return (
                    date.split(' ')[1] +
                    ' ' +
                    date.split(' ')[0] +
                    ' ' +
                    date.split(' ')[2]
                )
            },
            header: t('deadline'),
            footer: (info) => info.column.id,
        }),
        columnValidationSubscriptionHelper.accessor('amount', {
            cell: (info) => {
                const type = info.row.getValue('deadlineStatus') as string
                return (
                    <div
                        className={`${
                            type == DeadlineStatus.CONFIRMED_BY_FOODEALS &&
                            'text-coral-500'
                        }`}
                    >
                        {info
                            .getValue()
                            .amount.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD'}
                    </div>
                )
            },
            header: t('deadlinePrice'),
            footer: (info) => info.column.id,
        }),
        columnValidationSubscriptionHelper.accessor('payable', {
            cell: (info) => null,
            header: '',
            footer: (info) => null,
        }),
        columnValidationSubscriptionHelper.accessor('deadlineStatus', {
            cell: (info) => {
                const id = info.row.getValue('id') as string
                const payable = info.row.getValue('payable')! as boolean
                const status = info.getValue()

                return (
                    <ConfirmPayment
                        id={id}
                        disabled={
                            payable &&
                            !(status == DeadlineStatus.CONFIRMED_BY_FOODEALS)
                        }
                        label={
                            status == DeadlineStatus.CONFIRMED_BY_FOODEALS
                                ? t('toReceive').toUpperCase()
                                : t('received').toUpperCase()
                        }
                        className='w-full'
                    />
                )
            },
            header: t('validation'),
            footer: (info) => info.column.id,
            size: 20,
        }),
    ]
}

// TODO: remove this demo data

export const defaultDataValidationTable: deadlineType[] = [
    {
        id: '1',
        ref: '231234',
        date: '2021-06-01',
        deadlineStatus: DeadlineStatus.PAYED_BY_PARTNER,
        amount: {
            amount: 1000,
            currency: 'MAD',
        },
        payable: true,
    },
    {
        id: '2',
        ref: '234324234',
        date: '2021-07-01',
        deadlineStatus: DeadlineStatus.CONFIRMED_BY_FOODEALS,
        amount: {
            amount: 1000,
            currency: 'MAD',
        },
        payable: true,
    },
]

export const defaultDataSubscriptionTable: partnerSubscriptionType[] = [
    {
        id: '1',
        reference: '123456789',
        type: PartnerEntitiesType.SUB_ENTITY,
        partner: {
            id: '1',
            name: 'partner1',
            avatarPath: 'https://picsum.photos/200/300',
        },
        total: {
            amount: 1000,
            currency: 'MAD',
        },
        solutions: [
            PartnerSolutionType.DLC_PRO,
            PartnerSolutionType.DONATE_PRO,
        ],
        status: PaymentStatusType.PAID,
        date: '2021-06-01',
    },
    {
        id: '2',
        reference: '123456789',
        type: PartnerEntitiesType.SUB_ENTITY,
        partner: {
            id: '2',
            name: 'partner2',
            avatarPath: 'https://picsum.photos/200/300',
        },
        total: {
            amount: 1000,
            currency: 'MAD',
        },
        solutions: [PartnerSolutionType.DLC_PRO],
        status: PaymentStatusType.IN_PROGRESS,
        date: '2021-06-01',
    },
    {
        id: '3',
        reference: '123456789',
        type: PartnerEntitiesType.PARTNER_SB,
        partner: {
            id: '3',
            name: 'partner3',
            avatarPath: 'https://picsum.photos/200/300',
        },
        total: {
            amount: 1000,
            currency: 'MAD',
        },
        solutions: [PartnerSolutionType.DLC_PRO],
        status: PaymentStatusType.IN_PROGRESS,
        date: '2021-06-01',
    },
]
