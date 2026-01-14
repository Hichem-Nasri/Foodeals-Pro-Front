'use client'
import StatsCard, { type StatsCardProps } from '@/components/utils/StatsCard'
import StatsList, { StatsListItemProps } from '@/components/utils/StatsList'
import TitleDevider from '@/components/utils/TitleDevider'
import {
  Archive,
  BadgeX,
  CheckCheck,
  CirclePause,
  Coffee,
  HandCoins,
  HandPlatter,
  IterationCw,
  ShoppingBag,
  ShoppingBasket,
  Truck,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'
import { useGetStats } from '@/hooks/delivery/queries/stats-queries'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker } from '@/components/tools/DatePicker'
import { useGetDeliveryManList } from '@/hooks/delivery/queries/delivery-men-queries'
import SelectWithAvatar from '@/components/custom/SelectWithAvatar'
import { ColorsT } from '@/utils/getActiveColorClassName'
import {
  useGetAllSubEntityAccounts,
  useGetMarketStats,
} from '@/hooks/pro-market/queries/statistics-queries'
import { format } from 'date-fns'
import { useStatisticsTranslations, useFormsTranslations } from '@/hooks/useTranslations'

const formSchema = z.object({
  subEntityId: z.string({
    required_error: 'Please select a driver.',
  }),
  startDate: z
    .date({
      required_error: 'End date is required',
    })
    .transform((value) => format(new Date(value), 'yyyy-MM-dd')),
  endDate: z
    .date({
      required_error: 'End date is required',
    })
    .transform((value) => format(new Date(value), 'yyyy-MM-dd')),
})


export default function MarketStatsWrapper({
  color = 'green',
}: {
  color?: ColorsT
}) {
  const t = useStatisticsTranslations()
  const tForms = useFormsTranslations()
  
  const formSchema = z.object({
    subEntityId: z.string({
      required_error: tForms('validation.required'),
    }),
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
  })

  const { data: subEntityAccountsData, isLoading: subIsLoading } =
    useGetAllSubEntityAccounts()

  const { data: statsData, isLoading, setStatsQuery } = useGetMarketStats()

  // todo: add subEntityId
  const { startDate, endDate } = form.watch()
  useEffect(() => {
    if (!startDate || !endDate || !form.formState.isValid) return

    form.handleSubmit((values) => {
      setStatsQuery(values)
    })()
  }, [startDate, endDate])

  return (
    <div className='flex flex-col gap-4 pb-4 max-lg:px-2'>
      <Form {...form}>
        <form className='flex flex-col gap-y-6 rounded-[30px] bg-white px-4 py-6'>
          {/* Select Livreur */}
          <FormField
            control={form.control}
            name='subEntityId'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>{t('form.subEntityLabel')}</FormLabel>
                <FormControl>
                  <SelectWithAvatar
                    control={form.control}
                    placeholder={t('form.subEntityPlaceholder')}
                    options={subEntityAccountsData || []}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* end Select Livreur */}

          {/* Time range */}
          <div className='flex gap-3'>
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
                  <FormLabel htmlFor='startDate'>{t('form.startDateLabel')}</FormLabel>
                  <DatePicker
                    myFormat='dd-MM-yyyy'
                    id='startDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-mountain-400'
                    placeholder={t('form.startDatePlaceholder')}
                    onChange={field.onChange}
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
                  <FormLabel htmlFor='endDate'>{t('form.endDateLabel')}</FormLabel>
                  <DatePicker
                    myFormat='dd-MM-yyyy'
                    id='endDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-mountain-400'
                    placeholder={t('form.endDatePlaceholder')}
                    onChange={field.onChange}
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
      <TitleDevider title={t('sections.orderData')} />
      <div className='grid grid-cols-2 gap-2.5'>
        <StatsCard
          Icon={Truck}
          title={t('stats.totalWithDelivery')}
          statNumber={statsData?.totalWithDelivery}
          color={color}
          isLoading={isLoading}
        />
        <StatsCard
          Icon={HandCoins}
          title={t('stats.totalWithoutDelivery')}
          statNumber={statsData?.totalWithoutDelivery}
          color={color}
          isLoading={isLoading}
        />
        <StatsCard
          Icon={CheckCheck}
          title={t('stats.deliveredPackages')}
          statNumber={statsData?.deliveryCount}
          color={color}
          isLoading={isLoading}
        />
        <StatsCard
          Icon={BadgeX}
          title={t('stats.nonDeliveredPackages')}
          statNumber={statsData?.notDeliveredCount}
          color={color}
          isLoading={isLoading}
        />
      </div>
      <TitleDevider title={t('sections.features')} />
      <div>
        <StatsList
          iconColor='green'
          listItems={[
            {
              Icon: ShoppingBag,
              statsLabel: t('stats.orders'),
              statsNumber: 0,
            },
            {
              Icon: Coffee,
              statsLabel: t('stats.dineIn'),
              statsNumber: statsData?.dineInCount,
            },
            {
              Icon: HandPlatter,
              statsLabel: t('stats.takeAway'),
              statsNumber: statsData?.takeAwayCount,
            },
            {
              Icon: Truck,
              statsLabel: t('stats.delivery'),
              statsNumber: statsData?.deliveryCount,
            },
            {
              Icon: IterationCw,
              statsLabel: t('stats.canceledOrders'),
              statsNumber: statsData?.canceledCount,
            },
            {
              Icon: Archive,
              statsLabel: t('stats.archivedOrders'),
              statsNumber: statsData?.archivedCount,
            },
          ]}
        />
      </div>
      <TitleDevider title={t('sections.kpi')} />
      <div>
        <StatsList
          iconColor='green'
          listItems={[
            {
              Icon: ShoppingBag,
              statsLabel: t('stats.orders'),
              statsNumber: 0,
            },
            {
              Icon: Coffee,
              statsLabel: t('stats.dineIn'),
              statsNumber: 0,
            },
            {
              Icon: HandPlatter,
              statsLabel: t('stats.takeAway'),
              statsNumber: 0,
            },
          ]}
        />
      </div>
    </div>
  )
}
