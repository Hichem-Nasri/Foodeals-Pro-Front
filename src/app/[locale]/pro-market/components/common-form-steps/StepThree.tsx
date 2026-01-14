import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { StepThreeType } from './CommonFormSchema'
import TitleDevider from '@/components/utils/TitleDevider'
import { CalendarMinus2, Coins, CreditCard } from 'lucide-react'
import { DatePicker } from '@/components/tools/DatePicker'
import { SelectTime } from '@/components/custom/SelectTime'
import { RadioGroup } from '@/components/ui/radio-group'
import { RadioItemWithLabelIcon } from '@/components/custom/RadioItemWithLabelIcon'
import { cn } from '@/lib/utils'
import { useOffersTranslations } from '@/hooks/useTranslations'

export function StepThree() {
  const { control } = useFormContext<StepThreeType>()
  const tOffers = useOffersTranslations()

  const paymntMethods = [
    {
      label: tOffers('form.cash'),
      value: 'CASH',
      icon: Coins,
    },
    {
      label: tOffers('form.card'),
      value: 'CARD',
      icon: CreditCard,
    },
  ] as const

  return (
    <div className='flex flex-col gap-4'>
      <TitleDevider title={tOffers('form.publishDeal')} />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='startDate'
          render={({ field }) => (
            <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
              <FormLabel>{tOffers('form.startsAt')}</FormLabel>
              <DatePicker
                myFormat='dd/MM/yyyy'
                id='startDate'
                triggerClassName='text-base text-lynch-500'
                iconClassName='text-mountain-400'
                placeholder={tOffers('form.chooseStartDate')}
                onChange={field.onChange}
                Icon={CalendarMinus2}
                disabled={field.disabled}
                value={field.value}
              />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='endDate'
          render={({ field }) => (
            <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
              <FormLabel>{tOffers('form.endsAt')}</FormLabel>
              <DatePicker
                myFormat='dd/MM/yyyy'
                id='endDate'
                triggerClassName='text-base text-lynch-500'
                iconClassName='text-mountain-400'
                placeholder={tOffers('form.chooseEndDate')}
                onChange={field.onChange}
                Icon={CalendarMinus2}
                disabled={field.disabled}
                value={field.value}
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
                label={tOffers('form.startsAt')}
                name={field.name}
                placeholder={tOffers('form.time')}
                disabled={field.disabled}
              />
            )}
          />

          <FormField
            control={control}
            name='endTime'
            render={({ field }) => (
              <SelectTime
                className='flex-1'
                label={tOffers('form.endsAt')}
                name={field.name}
                placeholder={tOffers('form.time')}
                disabled={field.disabled}
              />
            )}
          />
        </div>

        <FormField
          control={control}
          name='expirationDate'
          render={({ field }) => (
            <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
              <FormLabel>{tOffers('form.expirationDate')}</FormLabel>
              <DatePicker
                myFormat='dd/MM/yyyy'
                id='expirationDate'
                triggerClassName='text-base text-lynch-500'
                iconClassName='text-mountain-400'
                placeholder={tOffers('form.chooseDate')}
                onChange={field.onChange}
                Icon={CalendarMinus2}
                disabled={field.disabled}
                value={field.value}
              />
            </FormItem>
          )}
        />
      </div>

      <TitleDevider title={tOffers('form.paymentMethod')} />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='paymentMethod'
          render={({ field }) => (
            <FormItem className=''>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex flex-col gap-3'
                  disabled={field.disabled}
                >
                  {paymntMethods.map((pm) => (
                    <FormItem
                      key={pm.value}
                      className='relative flex items-center'
                    >
                      <FormControl>
                        <RadioItemWithLabelIcon
                          icon={pm.icon}
                          label={pm.label}
                          value={pm.value}
                          checked={field.value === pm.value}
                        />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          'absolute inset-0 cursor-pointer font-normal opacity-0',
                          {
                            'cursor-default': field.disabled,
                          }
                        )}
                      />
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
