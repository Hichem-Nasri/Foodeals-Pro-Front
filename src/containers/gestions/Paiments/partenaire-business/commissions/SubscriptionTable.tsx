import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { usePaymentsTranslations } from '@/hooks/useTranslations'
import { partnerSubscriptionType } from '@/types/payment-types'
import {
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, {
  Fragment,
  useState,
} from 'react'
import {
  defaultDataSubscriptionTable,
  columnsSubscriptionTable,
} from '../../column/subscriptionColumn'
import { useQuery } from '@tanstack/react-query'
import PaymentSubscriptionCard from './SubscriptionCard'
import { getSubscriptions } from '@/actions/payments'
import { useNotification } from '@/context/NotifContext'
import { columnsStoresTable } from '@/containers/gestions/Stores/column/storeColumn';

interface SubscriptionTableProps {}

const SubscriptionTable: React.FC<
  SubscriptionTableProps
> = () => {
  const router = useRouter()
  const t = usePaymentsTranslations()
  const { notify } = useNotification()
  const [
    subscription,
    setSubscription,
  ] = useState<
    partnerSubscriptionType[]
  >([])
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
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['subscription', totals.currentPage, totals.pageSize],
    queryFn: async () => {
      try {
        console.log("++++++++++++Fetching subscriptions with page:", totals.currentPage, "and size:", totals.pageSize);
        const response = await getSubscriptions(
          totals.currentPage,
          totals.pageSize
        )
        console.log("++++++++++++-------------Subscriptions response:", response);
        // Handle authentication errors
        if (response.status === 401) {
          notify(
            NotificationType.ERROR,
            'Session expired. Please login again.'
          )
          return null
        }

        // Handle other errors
        if (response.status !== 200 && response.status !== 201) {
          console.error(
            'Subscriptions fetch error:',
            response.error
          )
          notify(
            NotificationType.ERROR,
            response.error || t('error.fetchSubscriptions')
          )
          return null
        }

        // Handle paginated response
        if (response.data != null) {
          console.log("++++++++++++Subscriptions data:", response.data);
          setSubscription(response.data.content)
          setTotals((prev) => ({
            ...prev,
            totalPages: response.data.totalPages,
            totalElements: response.data.totalElements,
          }))
        } else {
          setSubscription(response.data || [])
        }
        return response.data
      } catch (error) {
        notify(
          NotificationType.ERROR,
          t('error.fetchSubscriptions')
        )
        return null
      }
    },
  })
  const tableSubscriptions =
    useReactTable({
      data: subscription,
      columns:
        columnsSubscriptionTable(
          router
        ),
      getCoreRowModel:
        getCoreRowModel(),
      onColumnFiltersChange:
        setColumnFilters,
      getFilteredRowModel:
        getFilteredRowModel(),
      getSortedRowModel:
        getSortedRowModel(),
      getPaginationRowModel:
        getPaginationRowModel(),
    })
  return (
    <>
      <DataTable
        table={tableSubscriptions}
        data={subscription}
        title=''
        transform={(data) => (
          <PaymentSubscriptionCard
            subscription={data}
          />
        )}
        isLoading={
          isLoading || isRefetching
        }
      />
      <PaginationData
        currentPage={totals.currentPage}
        totalPages={totals.totalPages}
        setCurrentPage={(page) =>
          setTotals({
            ...totals,
            currentPage: page,
          })
        }
        pageSize={totals.pageSize}
        refetch={refetch}
      />
    </>
  )
}

export default SubscriptionTable
