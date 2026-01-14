'use client'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CustomButton } from '@/components/custom/CustomButton'
import {
    ColumnFiltersState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'
import { Coins, Percent, ArrowRight } from 'lucide-react'
import { useNotification } from '@/context/NotifContext'
import {
    NotificationType,
    TotalValueProps,
    TotalValues,
} from '@/types/GlobalType'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import { CardTotalValue } from '@/components/utils/CardTotalValue'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import { FilterTablePayment } from '@/containers/gestions/Paiments/FilterTablePayment'
import {
    partnerCommissionMonthType,
    PaymentFilterSchema,
} from '@/types/payment-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { getFilterDate, formatNumberWithSpaces } from '@/utils/utils'
import {
    columnsCommissionMonthTable,
    defaultDataCommissionMonthTable,
} from '@/containers/gestions/Paiments/column/commissionMonthColumn'
import CommissionMonthCard from './commissionMonthCard'
import { getPaymentCommissionMonth } from '@/actions/payments'

interface CommissionMonthProps {
    id: string
    type: 'NORMAL_PARTNER' | 'SUB_ENTITY'
}

const CommissionMonth: FC<CommissionMonthProps> = ({ id, type }) => {
    const [commissionMonth, setCommissionMonth] = useState<
        partnerCommissionMonthType[]
    >(defaultDataCommissionMonthTable)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [open, setOpen] = useState(false)
    const [multiProductId, setMultiProductId] = useState<string>('')
    const [value, setValue] = useState<boolean>(false)
    const [totals, setTotals] = useState<
        TotalValueProps & {
            totalCommission: number
            totalSales: number
        }
    >({ ...TotalValues, totalCommission: 0, totalSales: 0 })
    const notify = useNotification()
    const router = useRouter()

    const [dateAndPartner, setDateAndPartner] = useState<
        z.infer<typeof PaymentFilterSchema>
    >({
        date: getFilterDate(new Date()),
        partner: id,
    })

    const form = useForm({
        resolver: zodResolver(PaymentFilterSchema),
        defaultValues: dateAndPartner,
        mode: 'onBlur',
    })
    const onSubmit = (data: z.infer<typeof PaymentFilterSchema>) => {
        setDateAndPartner(data)
    }
    const { data, isLoading, isRefetching, error, refetch } = useQuery({
        queryKey: ['commissionMonth', id, dateAndPartner.date, totals.currentPage, totals.pageSize],
        queryFn: async () => {
            try {
                const response = await getPaymentCommissionMonth(
                    totals.currentPage,
                    totals.pageSize,
                    id,
                    dateAndPartner.date!
                )
                if (response.status === 500) {
                    throw new Error('Error fetching commissions')
                }
                
                // Handle paginated response with operations structure
                if (response.data?.content) {
                    // If backend returns Page<CommissionMonthOperationsDTO>
                    const pageData = response.data.content[0] // Get first item from page
                    if (pageData?.operations) {
                        setCommissionMonth(pageData.operations)
                    }
                    setTotals({
                        ...totals,
                        totalElements: response.data.totalElements,
                        totalPages: response.data.totalPages,
                    })
                } else if (response.data?.operations) {
                    // If backend returns CommissionMonthOperationsDTO directly
                    setCommissionMonth(response.data.operations)
                } else {
                    setCommissionMonth([])
                }
                
                return response.data
            } catch (error) {
                notify.notify(
                    NotificationType.ERROR,
                    'Erreur lors de la récupération des données'
                )
                throw new Error('Error fetching commissions')
            }
        },
        refetchOnWindowFocus: false,
    })

    const tableCommission = useReactTable({
        data: commissionMonth,
        columns: columnsCommissionMonthTable(
            router,
            setMultiProductId,
            setValue
        ),
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })
    useEffect(() => {
        if (isLoading || isRefetching) return

        setTotals({
            ...totals,
            currentPage: 0,
        })
        refetch()
    }, [value, dateAndPartner])
    return (
        <Fragment>
            <div className='mr-2 flex w-full flex-col gap-3 px-3 lg:px-0'>
                {/* <div className='flex w-full flex-col-reverse items-center gap-3 lg:flex-row'>
                    <FilterTablePayment
                        form={form}
                        onSubmit={onSubmit}
                        setOpen={setOpen}
                        type='partner'
                        typePartner={'SUB_ENTITY'}
                        id={id}
                        state='commissions'
                    />
                    <CardTotalValue
                        Icon={Coins}
                        title='Total des ventes'
                        value={totals.totalCommission}
                        className='bg-mountain-400 text-mountain-400'
                        isLoading={isLoading || isRefetching}
                    />
                    <CardTotalValue
                        Icon={Percent}
                        title='Total des commissions'
                        value={totals.totalSales}
                        className='bg-amethyst-500 text-amethyst-500'
                        isLoading={isLoading || isRefetching}
                    />
                </div> */}
                <DataTable
                    table={tableCommission}
                    data={commissionMonth}
                    title='Tableau de validation des commission'
                    transform={(data) => (
                        <CommissionMonthCard commission={data} />
                    )}
                    isLoading={isLoading || isRefetching}
                    partnerData={{
                        name: 'Marjane',
                        avatar: 'https://www.marjane.ma/wp-content/uploads/2021/09/logo-marjane.png',
                        city: 'Casablanca',
                    }}
                />
                <PaginationData
                    pageSize={totals.pageSize}
                    currentPage={totals.currentPage}
                    totalPages={totals.totalPages}
                    setCurrentPage={(page) => {
                        setTotals({ ...totals, currentPage: page })
                    }}
                    refetch={refetch}
                />
                <div
                    className={`lg:hidden ${
                        multiProductId ? 'hidden' : 'flex'
                    } my-3 w-full flex-col items-center gap-4`}
                >
                    {/* <ConfirmationAll
                        isLoading={isLoading}
                        details={data?.details}
                        isMobile={true}
                    /> */}
                </div>
            </div>
        </Fragment>
    )
}
export default CommissionMonth
