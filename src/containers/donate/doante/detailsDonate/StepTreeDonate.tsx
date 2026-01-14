import { FormField, FormItem, FormLabel } from '@/components/ui/form'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import TitleDevider from '@/components/utils/TitleDevider'
import { CalendarMinus2, Coins, CreditCard } from 'lucide-react'
import { DatePicker } from '@/components/tools/DatePicker'
import { SelectTime } from '@/components/custom/SelectTime'
import { z } from 'zod'
import { StepThreeDonateSchema } from '@/schemas/donate-schema'

export function StepThreeDonate() {
  const { control } = useFormContext<z.infer<typeof StepThreeDonateSchema>>()

  return (
    <div className='flex flex-col gap-4'>
      <TitleDevider title='Publier le donate' />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='startDate'
          render={({ field }) => (
            <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
              <FormLabel>Débute à</FormLabel>
              <DatePicker
                myFormat='dd/MM/yyyy'
                id='startDate'
                triggerClassName='text-base text-lynch-500'
                iconClassName='text-scooter-500'
                placeholder='Choisir début date'
                onChange={field.onChange}
                Icon={CalendarMinus2}
                disabled={field.disabled}
                value={field.value}
                color='blue'
              />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='endDate'
          render={({ field }) => (
            <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
              <FormLabel>Termine à</FormLabel>
              <DatePicker
                myFormat='dd/MM/yyyy'
                id='endDate'
                triggerClassName='text-base text-lynch-500'
                iconClassName='text-scooter-500'
                placeholder='Choisir fin date'
                onChange={field.onChange}
                Icon={CalendarMinus2}
                disabled={field.disabled}
                value={field.value}
                color='blue'
              />
            </FormItem>
          )}
        />

        <div className='flex items-center gap-3'>
          <FormField
            control={control}
            name='startTime'
            render={({ field }) => (
              <SelectTime
                className='flex-1'
                label='Débute à'
                name={field.name}
                placeholder='Temps'
                disabled={field.disabled}
                color='blue'
              />
            )}
          />

          <FormField
            control={control}
            name='endTime'
            render={({ field }) => (
              <SelectTime
                className='flex-1'
                label='Termine à'
                name={field.name}
                placeholder='Temps'
                disabled={field.disabled}
                color='blue'
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

const paymntMethods = [
  {
    label: 'En espèce',
    value: 'CASH',
    icon: Coins,
  },
  {
    label: 'Par cart',
    value: 'CARD',
    icon: CreditCard,
  },
] as const
