'use client'
import StatsCard, { type StatsCardProps } from '@/components/utils/StatsCard'
import StatsList, { StatsListItemProps } from '@/components/utils/StatsList'
import TitleDevider from '@/components/utils/TitleDevider'
import {
  CheckCheck,
  CirclePause,
  ShoppingBasket,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'
import {
  useGetDeliveryStats,
  useGetStats,
} from '@/hooks/delivery/queries/stats-queries'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import SelectWithAvatar from '@/components/custom/SelectWithAvatar'
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
import { useUserRole } from '@/context/UserRoleContext'
import { Roles } from '@/types/GlobalType'
import { cn } from '@/lib/utils'
import { DevTool } from '@hookform/devtools'

const formSchema = z.object({
  delivery_man_id: z.string({
    required_error: 'Please select a driver.',
  }),
  startDate: z
    .date({
      required_error: 'Start date is required',
    })
    .transform((date) => date.toISOString()),
  endDate: z
    .date({
      required_error: 'End date is required',
    })
    .transform((date) => date.toISOString()),
})

export default function DeliveryStatsWrapper() {
  const { role, userId } = useUserRole()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      delivery_man_id: role === Roles.DELIVERY_MAN ? userId : undefined,
      startDate: undefined,
      endDate: undefined,
    },
  })

  // Todo: Latitude and longitude should be dynamic
  const { data: deliveryMenListData } = useGetDeliveryManList({
    latitude: 33.5731,
    longitude: -7.5898,
    enabled: role === Roles.DELIVERY_MAN ? false : true,
  })

  const { data: statsData, setStatsQuery } = useGetDeliveryStats()

  const { startDate, endDate, delivery_man_id } = form.watch()

  // This useEffect is used to submit the form when all the required fields are filled
  useEffect(() => {
    if (!startDate || !delivery_man_id || !endDate) return

    form.handleSubmit((values) => {
      setStatsQuery(values)
    })()
  }, [startDate, endDate, delivery_man_id])

  return (
    <div className='flex flex-col gap-4 max-lg:px-2'>
      {/* <DevTool control={form.control} placement='top-left' /> */}
      <Form {...form}>
        <form className='flex flex-col gap-y-6 rounded-[30px] bg-white px-4 py-6'>
          {/* Select Livreur */}
          <FormField
            control={form.control}
            name='delivery_man_id'
            render={({ field }) => (
              <FormItem className={cn({ hidden: role === Roles.DELIVERY_MAN })}>
                <FormLabel className='text-sm' htmlFor='selectDriver'>
                  Liste des livreurs
                </FormLabel>
                <FormControl>
                  <SelectWithAvatar
                    id='selectDriver'
                    control={form.control}
                    options={deliveryMenListData || []}
                    placeholder='Choisir un livreur'
                    // options={livreurs}
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
                  <FormLabel htmlFor='startDate'>Date début</FormLabel>
                  <DatePicker
                    myFormat='dd/MM/yyyy'
                    id='startDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-amethyst-500'
                    placeholder='Choisir début'
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
                  <FormLabel htmlFor='endDate'>Date fin</FormLabel>
                  <DatePicker
                    myFormat='dd/MM/yyyy'
                    id='endDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-amethyst-500'
                    placeholder='Choisir début'
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />
          </div>
          {/* end Time range */}
          {/* <Button type='submit'>Submit</Button> */}
        </form>
      </Form>
      <TitleDevider title='Tableau de bord' />
      <div className='grid grid-cols-2 gap-2.5'>
        <StatsCard
          Icon={ShoppingBasket}
          title={'Total des\ncommandes'}
          statNumber={statsData ? statsData.totalOrders : 0}
        />
        <StatsCard
          Icon={CirclePause}
          title={'Commande\nen cours'}
          statNumber={statsData ? statsData.ordersInProgress : 0}
        />
        <StatsCard
          Icon={CheckCheck}
          title={'A planifier'}
          statNumber={statsData ? statsData.scheduledOrders : 0}
        />
        <StatsCard
          Icon={CheckCheck}
          title={'Commande\nlivrée'}
          statNumber={statsData ? statsData.deliveredOrders : 0}
        />
      </div>
      <TitleDevider title='Detail des commandes livrées' />
      <div>
        <StatsList
          iconColor='purple'
          className='grid grid-cols-3 gap-2.5'
          listItems={[
            {
              Icon: Users,
              statsLabel: 'Total des livreurs',
              statsNumber: statsData
                ? statsData.activeDeliveryBoys + statsData.inactiveDeliveryBoys
                : 0,
            },
            {
              Icon: UserCheck,
              statsLabel: 'Livreur actif',
              statsNumber: statsData ? statsData.activeDeliveryBoys : 0,
            },
            {
              Icon: UserX,
              statsLabel: 'Livreur non actif',
              statsNumber: statsData ? statsData.inactiveDeliveryBoys : 0,
            },
          ]}
        />
      </div>
    </div>
  )
}
