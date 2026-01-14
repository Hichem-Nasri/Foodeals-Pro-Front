import { CustomButton } from '@/components/custom/CustomButton'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { createColumnHelper } from '@tanstack/react-table'
import { CupSoda, Eye } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import React from 'react'
import {
    partnerCommissionMonthType,
    PaymentFilterSchema,
    PaymentStatusType,
} from '@/types/payment-types'

const columnHelperCommissionMonth =
    createColumnHelper<partnerCommissionMonthType>()

export const columnsCommissionMonthTable = (
    router: AppRouterInstance,
    setMultiProductId: React.Dispatch<React.SetStateAction<string>>,
    setValue: React.Dispatch<React.SetStateAction<boolean>>
) => [
    columnHelperCommissionMonth.accessor('ref', {
        cell: (info) => {
            const id = info.row.original.productId
            // slice the id to get the last 4 characters and the first 4 characters
            return (
                <span>
                    {id.slice(0, 4)}
                    {id.slice(-4)}
                </span>
            )
        },
        header: 'Réf',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('productName', {
        cell: (info) => {
            const avatar = info.row.original.avatarPhoto
            return (
                <AvatarAndName
                    className='flex items-center gap-1 text-nowrap'
                    name={info.getValue()}
                    avatar={avatar}
                />
            )
        },
        header: 'Produit',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('totalSales', {
        cell: (info) => {
            return (
                <span>
                    {info.getValue() > 0 ? `${info.getValue()} MAD` : 'N/A'}
                </span>
            )
        },
        header: 'Prix',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('quantity', {
        cell: (info) => info.getValue(),
        header: 'Qté',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('totalCardPayments', {
        cell: (info) => {
            return (
                <span>
                    {info.getValue() > 0 ? `${info.getValue()} MAD` : 'N/A'}
                </span>
            )
        },
        header: 'V. par carte',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('totalCashPayments', {
        cell: (info) => {
            return (
                <span>
                    {info.getValue() > 0 ? `${info.getValue()} MAD` : 'N/A'}
                </span>
            )
        },
        header: 'V. par espèce',
        footer: (info) => info.column.id,
    }),
    columnHelperCommissionMonth.accessor('commissionCard', {
        cell: (info) => {
            return (
                <span>
                    {info.getValue() > 0 ? `${info.getValue()} MAD` : 'N/A'}
                </span>
            )
        },
        header: 'C. par carte',
        footer: (info) => info.column.id,
    }),
    // columnHelperCommissionMonth.accessor('cashCommission', {
    //     cell: (info) => {
    //         return (
    //             <span>
    //                 {info.getValue().amount > 0
    //                     ? `${info.getValue().amount} MAD`
    //                     : 'N/A'}
    //             </span>
    //         )
    //     },
    //     header: 'C. par espèce',
    //     footer: (info) => info.column.id,
    // }),
    // columnHelperCommissionMonth.accessor('productId', {
    //     cell: (info) => {
    //         const type = info.row.original.type
    //     },
    //     header: 'Plus',
    //     footer: (info) => info.column.id,
    // }),
]

// TODO: remove this demo data

export const defaultDataCommissionMonthTable: partnerCommissionMonthType[] = [
    {
        ref: '1',
        productId: '123456789',
        productName: 'Product 1',
        avatarPhoto: 'https://via.placeholder.com/150',
        totalSales: 1000,
        quantity: 10,
        totalCardPayments: 1000,
        totalCashPayments: 0,
        commissionCard: 100,
        totalOffers: 0,
    },
    {
        ref: '1',
        productId: '987654321',
        productName: 'Product 2',
        avatarPhoto: 'https://via.placeholder.com/150',
        totalSales: 2000,
        quantity: 20,
        totalCardPayments: 2000,
        totalCashPayments: 0,
        commissionCard: 200,
        totalOffers: 0,
    },
    {
        ref: '1',
        productId: '123456789',
        productName: 'Product 3',
        avatarPhoto: 'https://via.placeholder.com/150',
        totalSales: 3000,
        quantity: 30,
        totalCardPayments: 3000,
        totalCashPayments: 0,
        commissionCard: 300,
        totalOffers: 0,
    },
    {
        ref: '1',
        productId: '987654321',
        productName: 'Product 4',
        avatarPhoto: 'https://via.placeholder.com/150',
        totalSales: 4000,
        quantity: 40,
        totalCardPayments: 4000,
        totalCashPayments: 0,
        commissionCard: 400,
        totalOffers: 0,
    },
]
