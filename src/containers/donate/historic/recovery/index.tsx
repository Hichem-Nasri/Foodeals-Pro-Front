'use client'
import PaginationData from '@/components/tools/PaginationData'
import HeaderLine from '@/components/utils/HeaderLine'
import { useNotification } from '@/context/NotifContext'
import { useDonateTranslations } from '@/hooks/useTranslations'
import { SchemaFilter, defaultSchemaFilter } from '@/schemas/global-schema'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import CommandesHeader from '@/components/utils/CommandesHeader'
import Grid from '@/components/utils/Grid'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import DonateCard from '../../components/DonateCard'
import TopBar from './TopBar'
import api from '@/utils/api'

interface RecoveryDonateHistoryProps {}

const RecoveryDonateHistory: React.FC<RecoveryDonateHistoryProps> = () => {
  const donateT = useDonateTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [archive, setArchive] = React.useState(false)
  const [orders, setOrders] = useState<DonateRecoveryType[]>([])
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(false)
  const notify = useNotification()
  
  // Get status and page from URL params
  const status = (searchParams.get('status') as 'valid' | 'cancel') || 'valid'
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  
  // Function to update URL with new parameters
  const updateStatus = useCallback((newStatus: 'valid' | 'cancel') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('status', newStatus)
    params.set('page', '1') // Reset to first page when changing status
    router.push(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])
  
  const updatePage = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  const [state, setState] = useState<'valid' | 'cancel'>(status)
  
  // Sync state with URL params when they change
  useEffect(() => {
    setState(status)
    setTotals(prev => ({ ...prev, currentPage }))
  }, [status, currentPage])
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['recovery-orders', currentPage, totals.pageSize, status, archive],
    queryFn: async () => {
      try {
        const res = await api.get(
          `/donates/recovries/history?pageNum=${currentPage}&pageSize=${totals.pageSize}&status=${status}`
        )
        if (res.status !== 200) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { content, totalPages, ...data } = res.data
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))
        const orders = content.map((order: any) => ({
          id: order.id,
          title: order?.donateItemsResponse?.productDonateResponse.map(
            (item: any) => item.name
          ),
          description: order?.donateItemsResponse?.productDonateResponse.map(
            (item: any) => item.name
          ),
          image: order?.donateItemsResponse?.productDonateResponse.map(
            (item: any) => '/images/' + item.avatarPath
          ),
          quantity: order.quantite,
          association: order.associationName,
          associationLogo: order.associationAvatar,
          date: order.dateDonation,
        }))
        setOrders(orders)
        return res.data
      } catch (error) {
        notify.notify(
          NotificationType.ERROR,
          donateT('messages.loadError')
        )
        console.error(error)
        setOrders([])
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const form = useForm<z.infer<typeof SchemaFilter>>({
    resolver: zodResolver(SchemaFilter),
    mode: 'onBlur',
    defaultValues: defaultSchemaFilter,
  })

  const onSubmit = (data: z.infer<typeof SchemaFilter>) => {
    setFilterData(data)
    setOpen(false)
  }

  return (
    <div className='relative mb-5 flex h-full w-full flex-col items-center gap-3 p-3 lg:mb-0 lg:p-0'>
      <TopBar
        state={status}
        setState={updateStatus}
        disabled={false}
        router={router}
        form={form}
        onSubmit={onSubmit}
        orders={orders.length}
        setOpen={setOpen}
        open={open}
        setImage={setImage}
        image={image}
      />
      {orders?.length == 0 && !isLoading && !isRefetching ? (
        <EmptyListPlaceholder
          color='blue'
          title={donateT('history.noRecoveryHistory')}
          description={donateT('history.noRecoveryHistoryDescription')}
        />
      ) : (
        <div className='flex h-full w-full flex-col items-start justify-center gap-3'>
          <CommandesHeader
            title={donateT('history.recoveryHistory')}
            orders={orders.length}
            className='hidden lg:flex'
            color='blue'
          />
          <Grid isLoading={isLoading || isRefetching}>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <DonateCard
                  key={order?.id.toString() || ''}
                  {...order}
                  className='cursor-default'
                />
              </Fragment>
            ))}
          </Grid>
          <PaginationData
            currentPage={currentPage}
            setCurrentPage={updatePage}
            totalPages={totals.totalPages}
            pageSize={totals.pageSize}
          />
        </div>
      )}
    </div>
  )
}
export type DonateRecoveryType = {
  id: string
  title: string[]
  description: string
  image: string[]
  quantity: number
  association: string
  associationLogo: string
  date: string
}
const dummyData: DonateRecoveryType[] = [
  {
    id: '1',
    title: ['Donation de vetements', 'Donation de vetements'],
    description: 'Donation de vetements pour les enfants',
    image: ['/images/pizza.png', '/images/pizza.png'],
    quantity: 20,
    association: 'Association 1',
    associationLogo: '/images/marjane_logo.png',
    date: '12/12/2021',
  },
] as const

export default RecoveryDonateHistory
