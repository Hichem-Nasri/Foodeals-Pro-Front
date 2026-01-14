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
import { BaggageClaim, HandHeart, MapPin, Truck } from 'lucide-react'
import { z } from 'zod'
import { RadioItemWithLabelIcon } from '@/components/custom/RadioItemWithLabelIcon'
import { cn } from '@/lib/utils'
import { RadioGroup } from '@/components/ui/radio-group'
import FoodealsIcon from '@/components/utils/FoodealsIcon'
import { StepTwoDonateSchema } from '@/schemas/donate-schema'

export function StepTwoDonate() {
  const { control, watch, getValues } =
    useFormContext<z.infer<typeof StepTwoDonateSchema>>()

  return (
    <div className='flex flex-col gap-6'>
      <TitleDevider title='Modalité et réduction' />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='consumptionMethods'
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
                  {items.map((pm) => (
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
                          color='blue'
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
        <FormField
          control={control}
          name='deliveryCost'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frais de livraison</FormLabel>
              <FormControl>
                <InputWithCurrancy
                  className='text-lynch-500'
                  placeholder='00'
                  {...field}
                />
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
    id: 'FOODEALS',
    value: 'FOODEALS',
    label: 'Foodeals delivery',
    icon: FoodealsIcon,
  },
  {
    id: 'ASSOCIATION',
    value: 'ASSOCIATION',
    label: "moyen de l'association",
    icon: HandHeart,
  },
  {
    id: 'DELIVERY',
    value: 'DELIVERY',
    label: 'A la livraison',
    icon: Truck,
  },
] as const
