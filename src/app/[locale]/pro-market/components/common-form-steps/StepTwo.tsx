import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { StepTwoType } from './CommonFormSchema'
import TitleDevider from '@/components/utils/TitleDevider'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import { Separator } from '@/components/ui/separator'
import { PriceReductionSlider } from '@/components/tools/PriceReductionSlider'
import { CheckboxWithLabelIcon } from '@/components/custom/CheckboxWithLabelIcon'
import { BaggageClaim, MapPin, Truck } from 'lucide-react'
import { useOffersTranslations } from '@/hooks/useTranslations'

export function StepTwo() {
  const { control, watch, getValues } = useFormContext<StepTwoType>()
  const tOffers = useOffersTranslations()

  const items = [
    {
      id: 'AT_PLACE',
      value: 'AT_PLACE',
      label: tOffers('form.atPlace'),
      icon: MapPin,
    },
    {
      id: 'PICKUP',
      value: 'PICKUP',
      label: tOffers('form.pickup'),
      icon: BaggageClaim,
    },
    {
      id: 'DELIVERY',
      value: 'DELIVERY',
      label: tOffers('form.delivery'),
      icon: Truck,
    },
  ] as const

  return (
    <div className='flex flex-col gap-6'>
      <TitleDevider title={tOffers('form.consumptionMethods')} />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='consumptionMethods'
          render={() => (
            <FormItem>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={control}
                  name='consumptionMethods'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start space-x-3 space-y-0'
                      >
                        <FormControl>
                          <CheckboxWithLabelIcon
                            {...field}
                            id={item.id}
                            icon={item.icon}
                            label={item.label}
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.value
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='sr-only font-normal'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='deliveryCost'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tOffers('form.deliveryCost')}</FormLabel>
              <FormControl>
                <InputWithCurrancy
                  className='text-lynch-500'
                  placeholder={tOffers('form.initialPricePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='initialPrice'
          render={({ field, fieldState, formState }) => (
            <FormItem>
              <FormLabel>{tOffers('form.initialPrice')}</FormLabel>
              <FormControl>
                <InputWithCurrancy
                  className='text-lynch-500'
                  placeholder={tOffers('form.initialPricePlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className='bg-lynch-100' />

        <FormField
          control={control}
          name='reductionPercentage'
          render={({ field, formState }) => {
            const initialPrice =
              watch('initialPrice') || formState.defaultValues?.initialPrice

            return (
              <FormItem>
                <FormControl>
                  <PriceReductionSlider
                    label={tOffers('form.reduction')}
                    initialPrice={initialPrice}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )
          }}
        />
      </div>
    </div>
  )
}
