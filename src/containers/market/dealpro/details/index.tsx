'use client'
import HeaderLine from '@/components/utils/HeaderLine'
import React from 'react'
import {
  BaggageClaim,
  Coins,
  CreditCard,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import { Input } from '@/components/custom/Input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import QuntityLabel from '../../components/Quntity'
import { DealProType } from '@/types/market-pro-type'
import { RadioItemWithLabelIcon } from '@/components/custom/RadioItemWithLabelIcon'
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LabelAndInputCurrancy from '../../components/LabelAndInputCurrancy'
import InfoDealPro from './InfoDealPro'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'
import { MarketRoutes } from '@/lib/routes'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'

interface DetailsDealProProps {
  id: string
  dealPro: DealProType
}

const DealProStore = z.object({
  delivery: z.string(),
  quntity: z.number(),
  payment: z.string(),
  defaultUnity: z.enum(['custom', 'x30', 'x60', 'x120']),
  productImages: z.array(z.string()),
})

type DealProStoreType = z.infer<typeof DealProStore>

const defaultUnity = ['custom', 'x30', 'x60', 'x120']

const paymntMethods = [
  { label: 'En espèce', value: 'CASH', icon: Coins },
  { label: 'Par carte', value: 'CARD', icon: CreditCard },
] as const

const DetailsDealPro: React.FC<DetailsDealProProps> = ({ dealPro, id }) => {
  const form = useForm<z.infer<typeof DealProStore>>({
    resolver: zodResolver(DealProStore),
    defaultValues: {
      delivery:
        (dealPro.consumptionMethods?.length && dealPro.consumptionMethods[0]) ||
        'AT_PLACE',
      quntity: 0,
      payment: dealPro.paymentMethod || 'card',
      defaultUnity: 'custom',
      productImages: dealPro.productImages as string[] | [],
    },
    mode: 'onBlur',
  })
  const { control, handleSubmit } = form
  const router = useRouter()
  const [isRed, setIsRed] = React.useState(false)
  const { notify } = useNotification()
  const { mutate, isPending } = useMutation({
    mutationKey: ['panier'],
    mutationFn: async (data: z.infer<typeof DealProStore>) => {
      try {
        const quantitySelected =
          data.defaultUnity === 'custom'
            ? data.quntity
            : parseInt(data.defaultUnity.slice(1))
        const res = await api.post(
          `/cart/add?dealId=${id}&quantity=${quantitySelected}`
        )
        if (![200, 201].includes(res.status)) {
          throw new Error('Erreur')
        }
        return data
      } catch (error) {
        throw new Error('Erreur')
      }
    },
    onSuccess: (data) => {
      notify(NotificationType.SUCCESS, 'Deal ajouté au panier', 'dialog')
      if (isRed) router.push(MarketRoutes.Panier)
      else router.back()
    },
    onError: (error) => {
      notify(
        NotificationType.ERROR,
        "Erreur lors de l'ajout au panier",
        'dialog'
      )
    },
  })
  const onSubmit = (data: z.infer<typeof DealProStore>) => {
    console.log(data)
    mutate(data)
  }
  const quantity = form.watch('quntity')

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full gap-3 p-3 flex-col-center-start lg:mb-0 lg:p-0'
      >
        <div className='sticky left-0 top-0 z-50 hidden w-full flex-col items-center justify-end gap-3 rounded-t-[18px] bg-white p-3 shadow-sm lg:flex lg:flex-row lg:rounded-[18px]'>
          <CustomButton
            label='AJOUTER ET CONTINUER MES ACHATS'
            onClick={() => {
              setIsRed(true)
              handleSubmit(onSubmit)()
            }}
            isPending={isPending && isRed}
            disabled={isPending}
            size={'sm'}
            className='w-fit text-sm'
            IconRight={ShoppingBag}
          />
          <CustomButton
            label='AJOUTER AU PANIER'
            onClick={() => {
              setIsRed(false)
              handleSubmit(onSubmit)()
            }}
            isPending={isPending && !isRed}
            disabled={isPending}
            size={'sm'}
            className='w-fit text-sm'
            IconRight={ShoppingCart}
            variant='outline'
          />
        </div>
        <h1 className='hidden self-start text-xl font-medium text-lynch-950 lg:inline-flex'>
          Nouveau deal
        </h1>

        <InfoDealPro
          {...dealPro}
          control={control}
          productImages={dealPro.productImages as string[] | []}
          client='marjane'
          clientAvatar='/images/marjane_logo.jpg'
          date={new Date()}
        />
        <HeaderLine title='Quantité ' />
        <div className='flex w-full flex-col gap-3 rounded-[30px] bg-white p-2 px-4 py-[25px]'>
          <FormField
            control={control}
            name='defaultUnity'
            render={({ field }) => (
              <RadioGroup
                value={field.value} // Bind the selected value to the form state
                onValueChange={field.onChange} // Update the form state on value change
                className='flex flex-col gap-3'
                disabled={field.disabled}
              >
                <Input
                  label='Type de unité'
                  value='Kg'
                  onChange={() => {}}
                  disabled
                  name={''}
                />
                {/* Map through predefined units */}
                {defaultUnity.map((pm) => (
                  <FormItem
                    key={pm}
                    className='relative flex w-full items-center gap-2'
                  >
                    <RadioGroupItem
                      value={pm} // Set value for each radio button
                      className='mt-10'
                    />
                    <label htmlFor={pm} className='relative flex w-full gap-2'>
                      {pm === 'custom' ? (
                        <QuntityLabel
                          value={quantity}
                          onChange={(e) => {
                            form.setValue('quntity', +e)
                          }}
                          label='Qte Personnalisé'
                          disabled={field.value !== 'custom'} // Disable if not selected
                        >
                          <div className='h-12 w-fit rounded-[12px] border-[1px] border-lynch-200 px-2 text-lg text-lynch-500 flex-center'>
                            x100
                          </div>
                        </QuntityLabel>
                      ) : (
                        <>
                          <Input
                            label='Qte'
                            placeholder=''
                            value={pm}
                            disabled
                            onChange={() => {}}
                            name={''}
                            className='text-center'
                          />
                          <LabelAndInputCurrancy
                            label='Prix'
                            className='w-full'
                            placeholder='0'
                            disabled={false} // Disable if "custom" is selected
                            onChange={() => {}}
                            value={0}
                          />
                        </>
                      )}
                    </label>
                  </FormItem>
                ))}
              </RadioGroup>
            )}
          />
        </div>
        <HeaderLine title='Modalité de consomation' />
        <FormField
          control={control}
          name='delivery'
          render={({ field }) => (
            <FormItem className='container-item w-full'>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className='flex w-full flex-col gap-3'
                  disabled={field.disabled}
                >
                  {items.map((pm) => (
                    <FormItem
                      key={pm.value}
                      className='relative flex w-full items-center'
                    >
                      <FormControl className='w-full'>
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
        <HeaderLine title='Modalité de paiement' />
        <div className='flex w-full flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
          <FormField
            control={control}
            name='payment'
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
                            { 'cursor-default': field.disabled }
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
        <div className='sticky bottom-0 left-0 z-50 flex w-full flex-col items-center justify-center gap-3 rounded-t-[18px] bg-white p-[20px] lg:hidden lg:flex-row lg:rounded-[30px]'>
          <CustomButton
            label='AJOUTER ET CONTINUER MES ACHATS'
            size={'sm'}
            onClick={() => {
              setIsRed(true)
              handleSubmit(onSubmit)()
            }}
            isPending={isPending && isRed}
            disabled={isPending}
            className='h-14 w-full text-sm'
            IconRight={ShoppingBag}
          />
          <CustomButton
            label='AJOUTER AU PANIER'
            onClick={() => {
              setIsRed(false)
              handleSubmit(onSubmit)()
            }}
            isPending={isPending && !isRed}
            disabled={isPending}
            size={'sm'}
            className='h-14 w-full text-sm'
            IconRight={ShoppingCart}
            variant='outline'
          />
        </div>
      </form>
    </Form>
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

export default DetailsDealPro
