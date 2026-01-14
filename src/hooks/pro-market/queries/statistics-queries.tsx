import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

type StatsRes = {
  totalWithDelivery: number
  totalWithoutDelivery: number
  deliveredCount: number
  notDeliveredCount: number
  dineInCount: number
  takeAwayCount: number
  deliveryCount: number
  canceledCount: number
  archivedCount: number
}

export const useGetMarketStats = () => {
  const [statsQuery, setStatsQuery] = useState<{
    startDate: string
    endDate: string
  }>({ startDate: '', endDate: '' })

  const query = useQuery({
    queryKey: ['pro-market-statistics', statsQuery],
    queryFn: createQueryFn<StatsRes>(
      `/statistics?startDate=${statsQuery.startDate}&endDate=${statsQuery.endDate}`
    ),
    enabled: !!statsQuery.startDate && !!statsQuery.endDate,
  })

  return { ...query, statsQuery, setStatsQuery }
}

type SubEntityType = {
  id: string
  name: string
  avatarPath: string
}

export const useGetAllSubEntityAccounts = () =>
  useQuery({
    queryKey: ['all-sub-entity-accounts'],
    queryFn: createQueryFn<SubEntityType[]>('/subentities/all'),
    select: (data) =>
      data.map((item) => ({
        value: item.id,
        label: item.name,
        image: item.avatarPath,
      })),
  })
