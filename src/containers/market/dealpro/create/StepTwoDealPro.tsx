import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import TitleDevider from '@/components/utils/TitleDevider'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import { Separator } from '@/components/ui/separator'
import { PriceReductionSlider } from '@/components/tools/PriceReductionSlider'
import { CheckboxWithLabelIcon } from '@/components/custom/CheckboxWithLabelIcon'
import { BaggageClaim, Coins, CreditCard, MapPin, Truck } from 'lucide-react'
import { z } from 'zod'
import { StepTwoDealProSchema } from '@/schemas/pro-market/offers-schema'
import { RadioItemWithLabelIcon } from '@/components/custom/RadioItemWithLabelIcon'
import { cn } from '@/lib/utils'
import { RadioGroup } from '@/components/ui/radio-group'

export function StepTwoDealPro({ disabled = false }: { disabled?: boolean }) {
  const { control, watch, getValues } =
    useFormContext<z.infer<typeof StepTwoDealProSchema>>()

  // console.log(getValues('initialPrice'))
  return (
    <div className='flex flex-col gap-6'>
      <TitleDevider title='Modalité de consomation' />

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
                                ? field.onChange([
                                    ...(field.value ?? []),
                                    item.value,
                                  ])
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
              <FormLabel>Frais de livraison</FormLabel>
              <FormControl>
                <InputWithCurrancy
                  className='text-lynch-500'
                  placeholder='Pris initial'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <TitleDevider title='Modalité de paiement' />

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
                  disabled={field.disabled!}
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

const items = [
  {
    id: 'AT_PLACE',
    value: 'AT_PLACE',
    label: 'Sur place',
    icon: MapPin,
  },
  {
    id: 'PICKUP',
    value: 'PICKUP',
    label: 'A emporter',
    icon: BaggageClaim,
  },
  {
    id: 'DELIVERY',
    value: 'DELIVERY',
    label: 'A la livraison',
    icon: Truck,
  },
] as const

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
