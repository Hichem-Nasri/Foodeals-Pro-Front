'use client'
import PaginationData from '@/components/tools/PaginationData'
import CommandesHeader from '@/components/utils/CommandesHeader'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import DonateCard from '@/containers/donate/components/DonateCard'
import { useNotification } from '@/context/NotifContext'
import { SchemaFilter, defaultSchemaFilter } from '@/schemas/global-schema'
import {
  NotificationType,
  PartnerSolutionType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Fragment, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import TopBar from './TopBar'
import Grid from '@/components/utils/Grid'
import api from '@/utils/api'
import { RecoveryCardDetails } from '../components/RecoveryCardDetails'
import { DonateRoutes } from '@/lib/routes'
import { useDonateTranslations } from '@/hooks/useTranslations'

export interface MyDonatesT {
  id: string
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
}

interface DonatePageProps {}

const DonatePage: React.FC<DonatePageProps> = () => {
  const [archive, setArchive] = React.useState(false)
  const [orders, setOrders] = useState<MyDonatesT[]>([])
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useDonateTranslations()
  
  // Get state from URL params or default to 'new'
  const [state, setState] = useState<'new' | 'all'>(() => {
    const urlState = searchParams.get('state') as 'new' | 'all'
    return urlState === 'new' || urlState === 'all' ? urlState : 'new'
  })

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('state', state)
    router.replace(`?${params.toString()}`, { scroll: false })
  }, [state, router, searchParams])

  // Sync state with URL params when they change
  useEffect(() => {
    const urlState = searchParams.get('state') as 'new' | 'all'
    if ((urlState === 'new' || urlState === 'all') && urlState !== state) {
      setState(urlState)
    }
  }, [searchParams, state])
  
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['ordres', totals.currentPage, totals.pageSize, state, archive],
    queryFn: async () => {
      try {
        const res = await api.get('/donates/today/donations')
        if (res.status !== 200) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { totalPages, content } = res.data!
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))
        setOrders(content)
        return res.data
      } catch (error) {
        notify.notify(
          NotificationType.ERROR,
          t('messages.loadError')
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
        orders={orders?.length}
        setOpen={setOpen}
        open={open}
        setImage={setImage}
        image={image}
      />
      {orders?.length == 0 && !isLoading && !isRefetching ? (
        <EmptyListPlaceholder
          color='blue'
          title={t('noDonate')}
          description={t('noDonateDescription')}
        />
      ) : (
        <div className='flex w-full flex-col items-start justify-center gap-3'>
          <CommandesHeader
            title={t('myDonations')}
            orders={orders.length}
            className='hidden lg:flex'
            color='blue'
          />
          <Grid isLoading={isLoading || isRefetching}>
            {orders.map(({ donateItemsResponse, id, dateDonation }) => (
              <Fragment key={id}>
                <RecoveryCardDetails
                  id={id}
                  imageUrl={
                    donateItemsResponse?.productDonateResponse[0]?.avatarPath
                  }
                  title={donateItemsResponse?.productDonateResponse[0]?.name}
                  description={
                    donateItemsResponse?.productDonateResponse[0]?.description
                  }
                  solution={PartnerSolutionType.DLC_PRO}
                  time={dateDonation}
                  onClick={() => router.push(DonateRoutes.donate + '/' + id)}
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

export default DonatePage
