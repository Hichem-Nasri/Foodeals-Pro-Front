import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import {
    NotificationType,
    TotalValueProps,
    TotalValues,
} from '@/types/GlobalType'
import { usePaymentsTranslations } from '@/hooks/useTranslations'
import { PaymentCommission } from '@/types/payment-types'
import {
    ColumnFiltersState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import {
    defaultDataCommissionTable,
    columnsCommissionTable,
} from '../../column/commissionColumn'
import { useQuery } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import PaymentCommissionCard from './PaymentCommissionCard'
import { getPaymentCommission } from '@/actions/payments'

interface CommissionTableProps {
    partnerId: string
    date: string
}

const CommissionTable: React.FC<CommissionTableProps> = ({
    partnerId,
    date,
}) => {
    const t = usePaymentsTranslations()
    const router = useRouter()
    const { notify } = useNotification()
    const [commission, setCommission] = useState<PaymentCommission[]>(
        defaultDataCommissionTable
    )
    const [totals, setTotals] = useState<
        TotalValueProps & {
            totalCommission: number
            totalSales: number
        }
    >({ ...TotalValues, totalCommission: 0, totalSales: 0 })
    const { isLoading, isRefetching, refetch } = useQuery({
        queryKey: [
            'commission',
            partnerId,
            date,
            totals.currentPage,
            totals.pageSize,
        ],
        queryFn: async () => {
            try {
                const [year, month] = date.split('-')
                const response = await getPaymentCommission(
                    partnerId,
                    year,
                    month,
                    totals.currentPage,
                    totals.pageSize
                )
                if (response.status === 500) {
                    notify(
                        NotificationType.ERROR,
                        t('error.fetchCommissions')
                    )
                    return null
                }
                // Handle paginated response
                if (response.data?.content) {
                    setCommission(response.data.content)
                    setTotals((prev) => ({
                        ...prev,
                        totalPages: response.data.totalPages,
                        totalElements: response.data.totalElements,
                    }))
                } else {
                    setCommission(response.data || [])
                }
                return response.data
            } catch (error) {
                notify(
                    NotificationType.ERROR,
                    t('error.fetchCommissions')
                )
                return null
            }
        },
    })
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const tableCommission = useReactTable({
        data: commission,
        columns: columnsCommissionTable(router),
        state: {
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })
    return (
        <>
            <DataTable
                table={tableCommission}
                data={commission}
                title=''
                transform={(data) => (
                    <PaymentCommissionCard commission={data} />
                )}
                isLoading={isLoading || isRefetching}
            />
            <PaginationData
                currentPage={totals.currentPage}
                totalPages={totals.totalPages}
                setCurrentPage={(page) =>
                    setTotals((prev) => ({ ...prev, currentPage: page }))
                }
                pageSize={totals.pageSize}
                refetch={refetch}
            />
        </>
    )
}

export default CommissionTable
