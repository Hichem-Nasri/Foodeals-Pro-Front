'use client'
import React, { useState, useEffect } from 'react'
import { useNotification } from '@/context/NotifContext'
import {
  TotalValues,
  TotalValueProps,
  NotificationType,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { StoresType } from '@/types/store-type'
import { defaultSchemaFilter, SchemaFilter } from '@/schemas/global-schema'
import HeaderLine from '@/components/utils/HeaderLine'
import Image from 'next/image'
import {
  OrderDealProType,
  OrderType,
} from '@/hooks/delivery/queries/orders-queries'
import Grid from '@/components/utils/Grid'
import CommandesHeader from '../../../components/utils/CommandesHeader'
import OrderDealCard from './OrderDealProCard'
import TopBar from './Topbar'
import QrCodeDialog from '../components/QrCodeDialog'
import { getAllStores } from '@/actions/store'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '@/utils/api'
import PaginationData from '@/components/tools/PaginationData'
import { useDealProTranslations } from '@/hooks/useTranslations'

const getAllDealPro = async (
  page: number,
  size: number,
  archive: boolean,
  state: string
) => {
  try {
    let url = `/orders/dealpro/`
    switch (state) {
      case 'pending':
        url += 'IN_PROGRESS'
        break
      case 'valid':
        url += 'COMPLETED'
        break
      default:
        url += 'COMPLETED'
        break
    }
    const res = await api.get(url)
    if (res.status !== 200) {
      throw new Error('Erreur ')
    }
    console.log('res.data', res.data)
    return {
      status: 200,
      data: {
        ...res.data,
      },
    }
  } catch (error) {
    return { status: 500, data: [] }
  }
}
const DealPro = () => {
  const [archive, setArchive] = React.useState(false)
  const [dealsPro, setDealsPro] = useState<OrderDealProType[]>([])
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [image, setImage] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial values from URL or use defaults
  const [state, setState] = useState<'pending' | 'valid' | 'all'>(() => {
    const urlState = searchParams.get('state') as 'pending' | 'valid' | 'all'
    return urlState && ['pending', 'valid', 'all'].includes(urlState) ? urlState : 'pending'
  })
  
  const [totals, setTotals] = useState<TotalValueProps>(() => ({
    ...TotalValues,
    currentPage: parseInt(searchParams.get('page') || '1'),
    pageSize: parseInt(searchParams.get('size') || '10')
  }))
  
  const t = useDealProTranslations()

  // Update URL when state or pagination changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    params.set('state', state)
    params.set('page', totals.currentPage.toString())
    params.set('size', totals.pageSize.toString())
    
    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [state, totals.currentPage, totals.pageSize, router, searchParams])
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: [
      'dealsPro',
      totals.currentPage,
      totals.pageSize,
      state,
      filterData,
    ],
    queryFn: async () => {
      try {
        const res = await getAllDealPro(
          totals.currentPage,
          totals.totalPages,
          archive,
          state
        )
        if (res.status === 500) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { totalPages, content } = res.data
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))

        setDealsPro(content)
        return res.data
      } catch (error) {
        notify.notify(NotificationType.ERROR, t('messages.fetchError'))
        console.error(error)
        setDealsPro([])
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
    <div className='mb-6 flex w-full flex-col items-center gap-4 px-3 lg:mb-0 lg:px-0'>
      <TopBar
        state={state}
        setState={(newState) => {
          setState(newState)
          // Reset to page 1 when changing state
          setTotals(prev => ({ ...prev, currentPage: 1 }))
        }}
        disabled={isLoading || isRefetching}
        router={router}
        form={form}
        onSubmit={onSubmit}
        orders={totals.totalElements}
        setOpen={setOpen}
        open={open}
      />
      {dealsPro.length == 0 && !isLoading && !isRefetching ? (
        <div className='w-full gap-3 flex-col-center'>
          <HeaderLine title='Pas de Deals' />
          <Image
            src='/icons/auth-icon-2.svg'
            width={200}
            height={200}
            alt='pas de ccommandes'
          />
          <p className='text-center text-lg text-primary'>
            Vous n’avez aucune deal
          </p>
        </div>
      ) : (
        <div className='flex w-full flex-col items-start justify-center gap-3 gap-y-5'>
          <CommandesHeader
            orders={dealsPro.length}
            className='hidden lg:flex'
          />
          <Grid isLoading={isLoading || isRefetching}>
            {dealsPro.map((order) => {
              return (
                <OrderDealCard
                  key={order.id}
                  state={state}
                  {...order}
                  id={order.idDealPro}
                  handleQrCode={() => {
                    console.log('handleQrCode', order.barCode)
                    setQrCode('e14824928743')
                  }}
                />
              )
            })}
          </Grid>
        </div>
      )}
      <PaginationData
        currentPage={totals.currentPage}
        setCurrentPage={(page) => setTotals(prev => ({ ...prev, currentPage: page }))}
        totalPages={totals.totalPages}
        pageSize={totals.pageSize}
      />
      <QrCodeDialog
        open={qrCode !== ''}
        onChangeOpen={(open) => !open && setQrCode('')}
        code={qrCode || ''}
      />
    </div>
  )
}

export default DealPro

// export const demoData: OrderDealProType[] = [
//   {
//     id: '1',
//     type: 'online',
//     status: 'completed',
//     orderSource: 'PRO_MARKET',
//     client: 'John Doe',
//     clientProActivity: 'PATTESER',
//     clientProAvatar: 'market_logo.png',
//     photosProducts: ['jus.jpg'],
//     title: 'Product 1',
//     description: 'Description of Product 1',
//     quantity: 2,
//     orderDate: new Date('2023-01-01').toISOString(),
//     priceOrder: { amount: 100, currency: 'USD' },
//     barCode: '1234567890',
//     seen: true,
//     affected: false,
//   },
//   {
//     id: '2',
//     type: 'offline',
//     status: 'pending',
//     orderSource: 'DONATE_CLIENT',
//     client: 'Jane Smith',
//     clientProActivity: 'PATTESER',
//     clientProAvatar: 'market_logo.png',
//     photosProducts: ['fromages.jpg', 'soda.png'],
//     title: 'Product 2',
//     description: 'Description of Product 2',
//     quantity: 1,
//     orderDate: new Date('2023-02-01').toISOString(),
//     priceOrder: { amount: 200, currency: 'USD' },
//     barCode: '1234567890',
//     seen: false,
//     affected: true,
//   },
// ]
