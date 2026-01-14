'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import {
  ArrowRight,
  CalendarCheck,
  CheckCheck,
  ChevronLeft,
  ListFilter,
  Percent,
  RotateCw,
  X,
} from 'lucide-react'
import { AppRoutes } from '@/lib/routes'
import MobileHeader from '@/components/custom/MobileHeader'
import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import { useNotification } from '@/context/NotifContext'
import {
  TotalValueProps,
  TotalValues,
  NotificationType,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import {
  FC,
  useState,
  useEffect,
  Fragment,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  partnerSubscriptionType,
  PaymentCommission,
  PaymentFilterSchema,
} from '@/types/payment-types'
import { CardTotalValue } from '@/components/utils/CardTotalValue'
import PaymentCommissionCard from './PaymentCommissionCard'
import {
  columnsCommissionTable,
  defaultDataCommissionTable,
} from '../../column/commissionColumn'
import { FilterTablePayment } from '../../FilterTablePayment'
import { FormFilterPayment } from '../../FormFilterPayment'
import {
  getFilterDate,
  formatNumberWithSpaces,
} from '@/utils/utils'
import {
  columnsSubscriptionTable,
  defaultDataSubscriptionTable,
} from '../../column/subscriptionColumn'
import CommissionTable from './CommissionTable'
import SubscriptionTable from './SubscriptionTable'
import { SwitchPayment } from './SwitcherPayment'
import { getPaymentCommission } from '@/actions/payments'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

interface OperationsProps {}

export const ValidationCommissions: FC<
  OperationsProps
> = ({}) => {
  const t = usePaymentsTranslations()
  const [commission, setCommission] =
    useState<PaymentCommission[]>(
      defaultDataCommissionTable
    )
  const [
    subscription,
    setSubscription,
  ] = useState<
    partnerSubscriptionType[]
  >(defaultDataSubscriptionTable)
  const [state, setState] = useState<
    'commissions' | 'subscriptions'
  >('commissions')
  const [
    columnFilters,
    setColumnFilters,
  ] = useState<ColumnFiltersState>([])
  const [totals, setTotals] = useState<
    TotalValueProps & {
      totalCommission: number
      totalSales: number
    }
  >({
    ...TotalValues,
    totalCommission: 0,
    totalSales: 0,
  })
  const [
    dateAndPartner,
    setDateAndPartner,
  ] = useState<
    z.infer<typeof PaymentFilterSchema>
  >({
    // date MM/yyyy
    date: getFilterDate(new Date()),
    partner: 'all',
  })
  const [open, setOpen] =
    useState(false)
  const notify = useNotification()
  const router = useRouter()

  const {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['commissions', dateAndPartner.date, totals.currentPage, totals.pageSize],
    queryFn: async () => {
      const [year, month] = dateAndPartner.date?.split('-') || ['', '']
      const response =
        await getPaymentCommission(
          'all',
          year,
          month,
          totals.currentPage,
          totals.pageSize
        )

      if (response.status === 200 && response.data) {
         if (data) {
      setTotals(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      }))
      setCommission(data.content || [])
    }
        return response.data
      }

      return { content: [], totalPages: 0, totalElements: 0 }
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    retry: 2,
  })

  const form = useForm({
    resolver: zodResolver(
      PaymentFilterSchema
    ),
    defaultValues: dateAndPartner,
    mode: 'onBlur',
  })

  const onSubmit = (
    data: z.infer<
      typeof PaymentFilterSchema
    >
  ) => {
    if (data.partner !== 'all') {
      // router.push(
      //     AppRoutes.PBCommissionDetails.replace(':id', data.partner!)
      // )
    }
    setDateAndPartner(data)
    // Reset to first page when filter changes
    setTotals(prev => ({
      ...prev,
      currentPage: 0,
    }))
  }

  const { handleSubmit } = form

  return (
    <Fragment>
      {!open ? (
        <div className='flex w-full flex-col items-center gap-4'>
          {/* <SwitchPayment state={state} setState={setState} /> */}
          <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
            <FilterTablePayment
              form={form}
              onSubmit={onSubmit}
              setOpen={setOpen}
              type='all'
              state='commissions'
            />
            <CardTotalValue
              Icon={CalendarCheck}
              title={t('deadline')}
              value={
                totals.totalCommission
              }
              className='bg-coral-500 text-coral-500'
              isLoading={
                isLoading ||
                isRefetching
              }
              deadline='05j/ 10h'
            />
            <CardTotalValue
              Icon={Percent}
              title={t('totalCommissions')}
              value={totals.totalSales}
              className='bg-mountain-400 text-mountain-400'
              isLoading={
                isLoading ||
                isRefetching
              }
            />
          </div>
          <div
            className={`lg:flex ${state == 'commissions' ? 'flex flex-col' : 'hidden'} w-full`}
          >
            <CommissionTable
              partnerId={
                dateAndPartner.partner!
              }
              date={
                dateAndPartner.date!
              }
            />
          </div>
          <div
            className={`lg:flex ${state == 'subscriptions' ? 'flex' : 'hidden'} w-full flex-col`}
          >
            <div className='hidden items-center justify-start gap-2 lg:flex'>
              <div className='flex size-11 items-center justify-center rounded-full bg-lynch-400 p-1 text-white'>
                <ListFilter size={28} />
              </div>
              <h1 className='text-lg font-[500px] text-lynch-950'>
                {t('commission.monthlyStatus')}
              </h1>
            </div>
            <SubscriptionTable />
          </div>
        </div>
      ) : (
        <div
          className={`fixed left-0 right-0 top-0 flex min-h-screen w-full min-w-full flex-col justify-between gap-[1.875rem] overflow-auto bg-white`}
          spellCheck
        >
          <div className='flex h-full flex-col items-center justify-between'>
            <MobileHeader
              title={t('filter')}
              onClick={() =>
                setOpen((prev) => !prev)
              }
            />
            <FormFilterPayment
              form={form}
              onSubmit={onSubmit}
            />
          </div>
          <div className='flex w-full justify-between space-x-4 rounded-[18px] p-4 lg:bg-white'>
            <CustomButton
              size='sm'
              variant='outline'
              label={t('cancel')}
              className='w-full'
              IconRight={X}
              onClick={() =>
                setOpen((prev) => !prev)
              }
            />
            <CustomButton
              type='submit'
              size='sm'
              label={t('filter')}
              className='w-full'
              IconRight={CheckCheck}
              onClick={() => {
                handleSubmit(onSubmit)
                setOpen((prev) => !prev)
              }}
            />
          </div>
        </div>
      )}
    </Fragment>
  )
}
