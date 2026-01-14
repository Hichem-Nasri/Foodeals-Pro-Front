'use client'
import React, { useState } from 'react'
import TopBar from './Topbar'
import { useNotification } from '@/context/NotifContext'
import {
  TotalValues,
  TotalValueProps,
  NotificationType,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { defaultSchemaFilter, SchemaFilter } from '@/schemas/global-schema'
import HeaderLine from '@/components/utils/HeaderLine'
import Image from 'next/image'
import Grid from '@/components/utils/Grid'
import CommandesHeader from '../../../components/utils/CommandesHeader'
import OrderCard from './OrderDealCard'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getOrders } from '@/actions/market'
import PaginationData from '@/components/tools/PaginationData'
import { OrderDealType } from '@/types/market-pro-type'
import { useMarketTranslations } from '@/hooks/useTranslations'

const DashboardMarket = () => {
  const [archive, setArchive] = React.useState(false)
  const [orders, setOrders] = useState<OrderDealType[]>([])
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const [state, setState] = useState<'pending' | 'valid' | 'cancel'>('pending')
  const t = useMarketTranslations()
  
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['ordres', totals.currentPage, totals.pageSize, state, archive],
    queryFn: async () => {
      try {
        const res = await getOrders(
          totals.currentPage,
          totals.pageSize,
          archive,
          state
        )
        if (res.status !== 200) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { totalPages, content } = res.data!
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))
        setOrders(content)
        console.log('orders: ', content)
        return res.data
      } catch (error) {
        notify.notify(
          NotificationType.ERROR,
          t('dashboard.ordersLoadError')
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

  const [test, setTest] = useState(false)
  return (
    <div className='relative mb-5 flex w-full flex-col items-center gap-3 p-3 lg:mb-0 lg:p-0'>
      <TopBar
        state={state}
        setState={setState}
        disabled={isLoading || isRefetching}
        router={router}
        form={form}
        onSubmit={onSubmit}
        orders={orders?.length}
        setOpen={setOpen}
        open={open}
        setImage={setImage}
        image={image}

      />
      {orders?.length == 0 && !isLoading && !isRefetching ? (
        <div className='w-full gap-3 flex-col-center'>
          <HeaderLine title={t('dashboard.noOrders')} />
          <Image
            src='/icons/auth-icon-2.svg'
            width={200}
            height={200}
            alt={t('dashboard.noOrders')}
          />
          <p className='text-center text-lg text-primary'>
            {t('dashboard.noOrdersDescription')}
          </p>
        </div>
      ) : (
        <div className='flex w-full flex-col items-start justify-center gap-3'>
          <CommandesHeader orders={orders.length} className='hidden lg:flex' />
          <Grid isLoading={isLoading || isRefetching}>
            {orders?.map((order) => <OrderCard key={order.id} {...order} />)}
          </Grid>
          <PaginationData
            currentPage={totals.currentPage}
            setCurrentPage={(page) =>
              setTotals({ ...totals, currentPage: page })
            }
            totalPages={totals.totalPages}
            pageSize={totals.pageSize}
          />
        </div>
      )}
    </div>
  )
}

export default DashboardMarket
