'use client'
import Grid from '@/components/utils/Grid'
import HeaderLine from '@/components/utils/HeaderLine'
import React from 'react'
import BacketCard from './BacketCard'
import { BasketItem, CartType } from '@/types/market-pro-type'
import Image from 'next/image'
import DetailsBasket from './DetailsBasket'
import TotalOrder from './TotalOrder'
import { CustomButton } from '@/components/custom/CustomButton'
import { CheckCheck, ShoppingBag, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MarketRoutes } from '@/lib/routes'
import { PaymentValidation } from '@/containers/gestions/Paiments/PaymentValidation'
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { useBasketTranslations } from '@/hooks/useTranslations'

interface MyBasketProps {}

const extractCartToBasket: (data: CartType) => {
  basket: BasketItem[]
  data: Omit<CartType, 'deals'> & { address: string }
} = (data) => {
  const { deals, ...rest } = data
  let filteredOrganization = new Map<string, BasketItem>()
  deals.forEach((deal) => {
    const { organizationName, organizationAvatar, ...restDeal } = deal
    const key = organizationName
    const value = filteredOrganization.get(key)
    if (value) {
      value.Store.products += 1
      value.orders.push({
        name: deal.titleDeal,
        image: deal.organizationAvatar,
        description: deal.description,
        quantity: deal.quantity,
        price: deal.price.amount,
      })
    } else {
      filteredOrganization.set(key, {
        Store: {
          name: organizationName,
          image: organizationAvatar,
          products: 1,
        },
        date: deal.dateDeal,
        orders: [
          {
            name: deal.titleDeal,
            image: deal.organizationAvatar,
            description: deal.description,
            quantity: deal.quantity,
            price: deal.price.amount,
          },
        ],
        ...deal,
        price: deal.price.amount,
      })
    }
  })
  console.log('filteredOrganization:', filteredOrganization)
  return {
    basket: Array.from(filteredOrganization.values()),
    data: { address: data.deals[0].deliveryAdress, ...rest },
  }
}

const MyBasket: React.FC<MyBasketProps> = () => {
  const router = useRouter()
  const { notify } = useNotification()
  const bt = useBasketTranslations()
  const [basket, setBasket] = React.useState<BasketItem[]>([])
  const [index, setIndex] = React.useState<number>(0)
  const { data, isLoading, error } = useQuery({
    queryKey: ['basket'],
    queryFn: async () => {
      try {
        const res = await api.get('/cart').catch((error) => {
          throw new Error(error)
        })
        if (res.status !== 200) {
          throw new Error('error')
        }
        const data = extractCartToBasket(res.data)
        setBasket(data.basket)
        return data
      } catch (error) {
        console.error(error)
        return null
      }
    },
    placeholderData: keepPreviousData,
  })
  const { mutate, isPending } = useMutation({
    mutationKey: ['basket'],
    mutationFn: async () => {
      const res = await api.delete(`/cart`)
      if (![200, 201, 202, 204].includes(res.status)) {
        throw new Error('error')
      }
      return res.data
    },
    onSuccess: () => {
      notify(NotificationType.SUCCESS, bt('messages.cartClearedSuccess'))
      router.push(MarketRoutes.market)
    },
    onError: () => {
      notify(NotificationType.ERROR, bt('messages.dealProDeleteError'))
    },
  })
  const CancleBascket = async () => {
    mutate()
  }

  return (
    <div className='flex h-full flex-col gap-4 px-3 lg:px-0'>
      <div className='sticky top-0 z-50 hidden items-center justify-end gap-2 rounded-[18px] bg-white p-2 shadow shadow-black/10 lg:flex'>
        <CustomButton
          label={bt('actions.cancelPurchase')}
          size={'sm'}
          onClick={() => {
            CancleBascket()
          }}
          className='w-fit'
          IconRight={X}
          isPending={isPending}
          disabled={isPending || isLoading}
          variant='outline'
        />
        <PaymentValidation
          label={bt('actions.validatePayment')}
          IconRight={CheckCheck}
          className='h-12 w-fit rounded-[12px]'
          amount={data?.data?.priceTotalTTc?.amount || 0}
          disabled={!data || isLoading}
          id={''}
        />
      </div>
      {!data || (data && basket.length === 0) ? (
        <>
          {isLoading ? (
            <Grid>
              {Array.from({ length: 5 }).map((_, index) => (
                <div className='felx-col flex h-56 w-full flex-col items-start gap-3 rounded-[18px] bg-white p-4' key={index}>
                  <Skeleton className='size-10 rounded-full bg-lynch-50' />
                  <Skeleton className='h-14 w-full rounded-[12px] bg-lynch-50' />
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-6 w-16 rounded-sm bg-lynch-50' />
                    <Skeleton className='h-6 w-16 rounded-sm bg-lynch-50' />
                  </div>
                </div>
              ))}
            </Grid>
          ) : (
            <div className='w-full gap-3 flex-col-center'>
              <HeaderLine title={bt('empty.title')} />
              <Image
                src='/icons/auth-icon-3.svg'
                width={200}
                height={200}
                alt={bt('empty.title')}
              />
              <p className='text-center text-lg text-primary'>
                {bt('empty.description')}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <HeaderLine title={bt('title')} />
          <Grid>
            {basket.map((item, index) => (
              <BacketCard
                DeleteItem={async () => {
                  const newBasket = basket.filter((_, i) => i !== index)
                  setBasket(newBasket)
                  try {
                    const res = await api.delete(
                      `/cart/deleteAllDealPro/${item.id}`
                    )
                    if (![200, 201, 202, 204].includes(res.status)) {
                      throw new Error('error')
                    }
                    notify(
                      NotificationType.SUCCESS,
                      bt('messages.dealProDeletedSuccess')
                    )
                    return res.data
                  } catch (error) {
                    notify(
                      NotificationType.ERROR,
                      bt('messages.dealProDeleteError')
                    )
                  }
                }}
                id={index}
                key={index}
                Item={item}
                setItems={setBasket}
              />
            ))}
          </Grid>
          <div className='flex h-fit w-full flex-shrink flex-grow flex-col gap-4 lg:flex-row'>
            <div className='w-full'>
              <HeaderLine title={bt('details.title')} />
              {basket.length! >= index && (
                <DetailsBasket
                  dateDeal={basket[index].date!}
                  hourOfDeal={basket[index].hourOfDeal!}
                  modalityPayment={basket[index].modalityPayment!}
                  modalityTypes={basket[index].modalityTypes!}
                  deliveryAdress={basket[index].deliveryAdress || ''}
                />
              )}
            </div>
            <div className='w-full'>
              <HeaderLine title={bt('total.title')} />

              {data?.data && <TotalOrder {...data?.data} />}
            </div>
          </div>
          <div className='sticky bottom-0 left-0 z-50 flex w-full flex-col items-center justify-center gap-3 rounded-t-[18px] bg-white p-[20px] lg:hidden'>
            <PaymentValidation
              label={bt('actions.validateAndProceed')}
              IconRight={CheckCheck}
              className='h-16'
              amount={data?.data?.priceTotalTTc?.amount || 0}
              id={''}
              isMobile
            />
            <CustomButton
              label={bt('actions.cancelPurchase')}
              onClick={() => {
                CancleBascket()
              }}
              className='w-full'
              IconRight={X}
              isPending={isPending}
              disabled={isPending || isLoading}
              variant='outline'
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MyBasket
