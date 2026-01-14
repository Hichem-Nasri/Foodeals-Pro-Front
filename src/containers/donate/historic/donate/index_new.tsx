'use client'
import PaginationData from '@/components/tools/PaginationData'
import HeaderLine from '@/components/utils/HeaderLine'
import { useNotification } from '@/context/NotifContext'
import { useDonateTranslations } from '@/hooks/useTranslations'
import { SchemaFilter, defaultSchemaFilter } from '@/schemas/global-schema'
import {
  NotificationType,
  PartnerSolutionType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import CommandesHeader from '@/components/utils/CommandesHeader'
import Grid from '@/components/utils/Grid'
import DonateCardHistory, {
  DonateCardHistoryProps,
} from '../../components/DonateCardHistory'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import TopBar from './TopBar'
import api from '@/utils/api'
import { MyDonatesT } from '../../doante'
import { format } from 'date-fns'
export interface HistoryDonateRes {
  id: string
  status: 'UNAVAILABLE' | 'EXPIRED' | 'AVAILABLE'
  donateUnity: string
  donateItemsResponse: DonateItemsResponse
  quantite: number
  dateDonation: string
  associationAvatar: string
  associationName: string
  donorAvatar: string
  donorName: string
}

export interface DonateItemsResponse {
  id: string
  productDonateResponse: ProductDonateResponse[]
}

export interface ProductDonateResponse {
  id: string
  avatarPath: string
  name: string
  description: string
  expirationDate: string
  quantity: number
}

interface indexProps {}

const DonateHistory: React.FC<indexProps> = () => {
  const donateT = useDonateTranslations()
  const [archive, setArchive] = React.useState(false)
  const [orders, setOrders] = useState<DonateCardHistoryProps[]>([])
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const [state, setState] = useState<'pending' | 'valid' | 'cancel'>('pending')
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['ordres', totals.currentPage, totals.pageSize, state, archive],
    queryFn: async () => {
      try {
        const res = await api.get('/donates/today/donations')
        if (res.status !== 200) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { totalPages, ...content } = res.data!
        const data = content.content as HistoryDonateRes[]
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))
        const orders: DonateCardHistoryProps[] = data.map((order) => ({
          id: order.id,
          title: order?.donateItemsResponse.productDonateResponse[0]?.name,
          description:
            order?.donateItemsResponse?.productDonateResponse[0]?.description,
          image:
            '/images/' +
            order?.donateItemsResponse?.productDonateResponse[0]?.avatarPath,
          date: format(new Date(order.dateDonation), 'dd/MM/yyyy'),
          hour: format(new Date(order.dateDonation), 'HH: mm').replace(
            ':',
            'h'
          ), // Add the missing property 'hour'
          key: order?.donateItemsResponse?.productDonateResponse[0]?.id, // Add the missing property 'key'
          type: order.status, // Add the missing property 'type'
          solution: PartnerSolutionType.DLC_PRO, // Add the missing property 'solution'
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
    <div className='relative mb-5 flex w-full flex-col items-center gap-3 p-3 lg:mb-0 lg:p-0'>
      <TopBar
        state={state}
        setState={setState}
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
          title={donateT('history.noDonationHistory')}
          description={donateT('history.noDonationHistoryDescription')}
        />
      ) : (
        <div className='flex w-full flex-col items-start justify-center gap-3'>
          <CommandesHeader
            title={donateT('history.donationHistory')}
            orders={orders.length}
            className='hidden lg:flex'
            color='blue'
          />
          <Grid isLoading={isLoading || isRefetching}>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <DonateCardHistory
                  {...order}
                  key={order?.id.toString() || ''}
                />
              </Fragment>
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

export default DonateHistory

export type DonateRecoveryType = {
  id: string
  title: string
  description: string
  image: string
  quantity: number
  association: string
  associationLogo: string
  date: string
}
const orders: DonateRecoveryType[] = [
  {
    id: '1',
    title: 'Donation de vetements',
    description: 'Donation de vetements pour les enfants',
    image: '/images/pizza.png',
    quantity: 20,
    association: 'Association 1',
    associationLogo: '/images/marjane_logo.png',
    date: '12/12/2021',
  },
] as const
