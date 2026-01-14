'use client'
import StatsList from '@/components/utils/StatsList'
import { Archive, Coffee, IterationCw, ShoppingBag, Truck } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker } from '@/components/tools/DatePicker'
import { ColorsT } from '@/utils/getActiveColorClassName'
import { useGetAllSubEntityAccounts } from '@/hooks/pro-market/queries/statistics-queries'
import { format } from 'date-fns'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import { useDonateTranslations, useFormsTranslations } from '@/hooks/useTranslations'

type StatsDataT = {
  totalDonation: number
  totalOffres: number
  deliveryCount: number
  canceledCount: number
  archivedCount: number
}

const defaultStatsData: StatsDataT = {
  totalDonation: 0,
  totalOffres: 0,
  deliveryCount: 0,
  canceledCount: 0,
  archivedCount: 0,
}

export default function DonateStatsWrapper({
  color = 'blue',
}: {
  color?: ColorsT
}) {
  const t = useDonateTranslations()
  const tForms = useFormsTranslations()
  
  const formSchema = z.object({
    startDate: z
      .date({
        required_error: tForms('validation.required'),
      })
      .transform((value) => format(new Date(value), 'yyyy-MM-dd')),
    endDate: z
      .date({
        required_error: tForms('validation.required'),
      })
      .transform((value) => format(new Date(value), 'yyyy-MM-dd')),
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      startDate: new Date('2025-02-01').toISOString(),
      endDate: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString(),
    },
  })

  const [statsData, setStatsData] = useState<StatsDataT>(defaultStatsData)

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['donates', 'statistics'],
    queryFn: async () => {
      try {
        //http://localhost:8080/v1/donates/stats?startDate=2025-02-05T00:00:00Z&endDate=2025-02-25T23:59:59Z
        const { startDate, endDate } = form.getValues()
        if (!startDate || !endDate) return
        const res = await api.get('/donates/stats', {
          params: { startDate, endDate },
        })
        if (res.status !== 200) {
          throw new Error('Error fetching data')
        }
        const data = res.data
        setStatsData({
          totalDonation: data.donationsReceived,
          totalOffres: data.donationsCreated,
          deliveryCount: data.deliveries,
          canceledCount: data.donationsCanceled,
          archivedCount: data.donationsArchived,
        })
        return data
      } catch (error) {
        console.error('Error fetching data', error)
        return defaultStatsData
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
  const { startDate, endDate } = form.watch()
  useEffect(() => {
    if (!startDate || !endDate || !form.formState.isValid) return

    form.handleSubmit((values) => {
      // setStatsData(values)
    })()
  }, [startDate, endDate])

  return (
    <div className='flex flex-col gap-4 pb-4 max-lg:px-2'>
      <Form {...form}>
        <form className='flex flex-col gap-y-6 rounded-[30px] bg-white px-4 py-6'>
          {/* Time range */}
          <div className='flex gap-3'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
                  <FormLabel htmlFor='startDate'>{t('statistics.startDate')}</FormLabel>
                  <DatePicker
                    myFormat='dd-MM-yyyy'
                    id='startDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-scooter-500'
                    placeholder={t('statistics.startDatePlaceholder')}
                    onChange={field.onChange}
                    color={color}
                    value={new Date(field.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
                  <FormLabel htmlFor='endDate'>{t('statistics.endDate')}</FormLabel>
                  <DatePicker
                    myFormat='dd-MM-yyyy'
                    id='endDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-scooter-500'
                    placeholder={t('statistics.endDatePlaceholder')}
                    onChange={field.onChange}
                    color={color}
                    value={new Date(field.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* end Time range */}
          {/* <Button type='submit'>Submit</Button> */}
        </form>
      </Form>
      <div>
        <StatsList
          iconColor={color}
          isLoading={isLoading || isRefetching}
          listItems={[
            {
              Icon: Coffee,
              statsLabel: t('statistics.stats.donationsReceived'),
              statsNumber: statsData?.totalDonation,
            },
            {
              Icon: ShoppingBag,
              statsLabel: t('statistics.stats.ourOffers'),
              statsNumber: statsData?.totalOffres,
            },
            {
              Icon: Truck,
              statsLabel: t('statistics.stats.deliveries'),
              statsNumber: statsData?.deliveryCount,
            },
            {
              Icon: IterationCw,
              statsLabel: t('statistics.stats.donationsCanceled'),
              statsNumber: statsData?.canceledCount,
            },
            {
              Icon: Archive,
              statsLabel: t('statistics.stats.donationsArchived'),
              statsNumber: statsData?.archivedCount,
            },
          ]}
        />
      </div>
    </div>
  )
}
