'use client'
import PaginationData from '@/components/tools/PaginationData'
import HeaderLine from '@/components/utils/HeaderLine'
import { useNotification } from '@/context/NotifContext'
import { SchemaFilter, defaultSchemaFilter } from '@/schemas/global-schema'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TopBar from './TopBar'
import Image from 'next/image'
import CommandesHeader from '@/components/utils/CommandesHeader'
import Grid from '@/components/utils/Grid'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import DonateCard from '../components/DonateCard'
import api from '@/utils/api'
import { DonateRoutes } from '@/lib/routes'
import Link from 'next/link'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface RecoveryDonateProps {}

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

const RecoveryDonate: React.FC<RecoveryDonateProps> = () => {
  const [archive, setArchive] = React.useState(false)
  const [orders, setOrders] = useState<DonateRecoveryType[]>([])
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const [state, setState] = useState<'pending' | 'valid' | 'cancel'>('pending')
  const tDonate = useDonateTranslations()
  
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['ordres', totals.currentPage, totals.pageSize, state, archive],
    queryFn: async () => {
      try {
        let url = ''
        switch (state) {
          case 'valid':
            url = '/donates/all/delivered'
            break
          case 'cancel':
            url = '/donates/all/canceled'
            break
          default:
            url = '/donates/all/pending'
            break
        }
        const res = await api.get(url)
        const { content, totalPages, ...data } = res.data
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
        setTotals({ ...totals, totalPages: totalPages })
        return res.data
      } catch (error) {
        notify.notify(
          NotificationType.ERROR,
          tDonate('messages.loadError')
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
        state={state}
        setState={setState}
        disabled={isLoading || isRefetching}
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
          title={tDonate('noDonate')}
          description={tDonate('noDonateDescription')}
        />
      ) : (
        <div className='flex h-full w-full flex-col items-start justify-center gap-3'>
          <CommandesHeader
            title={tDonate('recovery')}
            orders={orders.length}
            className='hidden lg:flex'
            color='blue'
          />
          <Grid isLoading={isLoading || isRefetching}>
            {orders.map((order, index) => (
              <Link
                href={DonateRoutes.donateDetails.replace(':id', order.id)}
                key={order.id + '-' + index}
              >
                <DonateCard {...order} />
              </Link>
            ))}
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

// const dummyData: DonateRecoveryType[] = [
//   {
//     id: '1',
//     title: ['Donation de vetements', 'Donation de vetements'],
//     description: 'Donation de vetements pour les enfants',
//     image: ['/images/pizza.png', '/images/pizza.png'],
//     quantity: 20,
//     association: 'Association 1',
//     associationLogo: '/images/marjane_logo.png',
//     date: '12/12/2021',
//   },
// ] as const

export default RecoveryDonate