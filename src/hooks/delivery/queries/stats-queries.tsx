import { Name } from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'
import {
  useEffect,
  useState,
} from 'react'

type StatsT = {
  activeDeliveryBoys: number
  scheduledOrders: number
  ordersInProgress: number
  deliveredOrders: number
  totalOrders: number
  inactiveDeliveryBoys: number
}

export const useGetStats = (
  deliveryBoyId: string,
  startDate: string,
  endDate: string,
  shouldFetch: boolean
) => {
  return useQuery({
    queryKey: [
      'delivery-man-stats',
      {
        deliveryBoyId,
        startDate,
        endDate,
      },
    ],
    queryFn: createQueryFn<StatsT>(
      `/deliveries/stats`,
      (data) => data
    ),
    enabled: shouldFetch,
  })
}

export const useGetDeliveryStats =
  () => {
    const [statsQuery, setStatsQuery] =
      useState<{
        delivery_man_id: string
        startDate: string
        endDate: string
      }>({
        delivery_man_id: '',
        startDate: '',
        endDate: '',
      })

    // useEffect(() => {
    //   console.log(statsQuery)
    // }, [statsQuery])

    const query = useQuery({
      queryKey: [
        'delivery-man-stats',
        statsQuery,
      ],
      queryFn: createQueryFn<StatsT>(
        `/deliveries/stats?startDate=${statsQuery.startDate}&endDate=${statsQuery.endDate}&deliveryBoyId=${statsQuery.delivery_man_id}`
      ),
      enabled:
        !!statsQuery.startDate &&
        !!statsQuery.endDate &&
        !!statsQuery.delivery_man_id,
    })

    return {
      ...query,
      statsQuery,
      setStatsQuery,
    }
  }
