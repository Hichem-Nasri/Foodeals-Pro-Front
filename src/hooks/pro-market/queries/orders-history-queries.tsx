import { OrderDealType } from '@/types/market-pro-type'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export const useGetOrderHistoryList = () => {
  const tab = useSearchParams()?.get('tab') || 'delivered'
  const tabToStatusMap = {
    delivered: 'COMPLETED',
    canceled: 'CANCELED',
  }

  const getStatus = (tab: string): string =>
    tabToStatusMap[tab as keyof typeof tabToStatusMap] || 'COMPLETED'

  const status = getStatus(tab)
  const url = `/orders/history/${status}`

  return useQuery({
    queryKey: ['orders-history', { status }],
    queryFn: createQueryFn<OrderDealType[]>(url),
  })
}
