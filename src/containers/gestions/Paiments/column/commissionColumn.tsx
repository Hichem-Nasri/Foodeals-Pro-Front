import { createColumnHelper } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PriceType } from '@/types/GlobalType'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import {
  PaymentCommission,
  PartnerType,
  PaymentStatusEnum,
  PaymentStatusType,
} from '@/types/payment-types'
import { ConfirmPayment } from '../ConfirmPayment'
import { PaymentValidation } from '../PaymentValidation'
import { PaymentStatus } from '../PaymentStatus'
import { AppRoutes } from '@/lib/routes'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

const columnHelperCommission =
  createColumnHelper<PaymentCommission>()

export const columnsCommissionTable = (
  router: AppRouterInstance,
  path:
    | 'parnter'
    | 'subStore' = 'parnter'
) => {
  const t = usePaymentsTranslations()
  
  return [
    columnHelperCommission.accessor(
      'ref',
      {
        cell: (info) => {
          const id = info.row.original.id
          return (
            <div className='flex items-center gap-1'>
              {id.slice(0, 4) +
                id.slice(-4)}
            </div>
          )
        },
        header: t('reference'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'date',
      {
        cell: (info) => {
          return (
            <span>{info.getValue()}</span>
          )
        },
        header: t('month'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'totalAmount',
      {
        cell: (info) => {
          const amount =
            info.getValue().amount
          return <span>{amount}</span>
        },
        header: t('sale'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'foodealsCommission',
      {
        cell: (info) => {
          const amount =
            info.getValue().amount
          return <span>{amount}</span>
        },
        header: t('foodeals'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'commissionCard',
      {
        cell: (info) => {
          return (
            <span>{info.getValue()}</span>
          )
        },
        header: t('byCard'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'commissionCash',
      {
        cell: (info) => {
          return (
            <span>{info.getValue()}</span>
          )
        },
        header: t('byCash'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'paymentStatus',
      {
        cell: (info) => {
          return (
            <PaymentStatus
              status={
                info.getValue() as PaymentStatusType
              }
            />
          )
        },
        header: t('status'),
        footer: (info) => info.column.id,
      }
    ),

    columnHelperCommission.accessor(
      'toPay',
      {
        cell: (info) => {
          // const payable = info.row.original.payable
          // const id = info.row.original.id
          const toPay =
            info.getValue() as PriceType
          //

          // const status = info.row.getValue(
          //     'paymentStatus'
          // ) as PaymentStatusEnum
          // const paid = info.row.original.toPay.amount
          const status =
            info.row.original
              .paymentStatus
          const id = info.row.original.id

          // if (!paid) {
          return (
            <PaymentValidation
              className='min-w-full'
              id={id}
              label={t('confirm')}
              disabled={
                PaymentStatusType.PAID ==
                (status as PaymentStatusType)
              }
              amount={toPay.amount}
            />
          )
          // } else {
          //     return (
          //         <PaymentValidation
          //             className='min-w-full'
          //             id={id}
          //             label={'Payé'}
          //             disabled={
          //                 PaymentStatusEnum.IN_VALID !=
          //                     (status as PaymentStatusEnum) || !payable
          //             }
          //             amount={toPay.amount}
          //         />
          //     )
          // }
        },
        header: t('validation'),
        footer: (info) => info.column.id,
      }
    ),
    columnHelperCommission.accessor(
      'id',
      {
        cell: (info) => {
          return (
            <div
              title={t('viewDetails')}
              onClick={() => {
                router.push(
                  AppRoutes.paiementsOperation.replace(
                    ':id',
                    info.getValue()
                  )
                )
                // if (
                //     path != 'subStore' &&
                //     type == PartnerType.PARTNER_SB
                // )
                //     router.push(
                //         AppRoutes.PBCommissionDetails.replace(
                //             ':id',
                //             info.getValue()
                //         )
                //     )
                // else {
                //     if (type == PartnerType.PARTNER_SB) return
                //     router.push(
                //         AppRoutes.SubStoreCommission.replace(
                //             ':id',
                //             info.getValue() + '?type=' + type
                //         )
                //     )
                // }
              }}
              className='flex items-center justify-center'
            >
              <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-lynch-300 p-2 text-white'>
                <Eye size={20} />
              </div>
            </div>
          )
        },
        header: t('activity'),
        footer: (info) => info.column.id,
      }
    ),
  ]
}

// TODO: remove demo data
export const defaultDataCommissionTable: PaymentCommission[] =
  [
    {
      id: '123456789',
      ref: '123456789',
      date: '2021-12-12',
      totalAmount: {
        amount: 1000,
        currency: 'MAD',
      },
      foodealsCommission: {
        amount: 100,
        currency: 'MAD',
      },
      commissionCard: 10,
      commissionCash: 10,
      paymentStatus:
        PaymentStatusType.IN_PROGRESS,
      payable: true,
      toPay: {
        amount: 1000,
        currency: 'MAD',
      },
    },
    {
      id: '123456789',
      ref: '123456789',
      date: '2021-12-12',
      totalAmount: {
        amount: 1000,
        currency: 'MAD',
      },
      foodealsCommission: {
        amount: 100,
        currency: 'MAD',
      },
      commissionCard: 10,
      commissionCash: 10,
      paymentStatus:
        PaymentStatusType.PAID,
      payable: true,
      toPay: {
        amount: 1000,
        currency: 'MAD',
      },
    },
    {
      id: '123456789',
      ref: '123456789',
      date: '2021-12-12',
      totalAmount: {
        amount: 1000,
        currency: 'MAD',
      },
      foodealsCommission: {
        amount: 100,
        currency: 'MAD',
      },
      commissionCard: 10,
      commissionCash: 10,
      paymentStatus:
        PaymentStatusType.PAID,
      payable: true,
      toPay: {
        amount: 1000,
        currency: 'MAD',
      },
    },
    {
      id: '123456789',
      ref: '123456789',
      date: '2021-12-12',
      totalAmount: {
        amount: 1000,
        currency: 'MAD',
      },
      foodealsCommission: {
        amount: 100,
        currency: 'MAD',
      },
      commissionCard: 10,
      commissionCash: 10,
      paymentStatus:
        PaymentStatusType.IN_PROGRESS,
      payable: true,
      toPay: {
        amount: 1000,
        currency: 'MAD',
      },
    },
  ]
