'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { Form } from '@/components/ui/form'
import { DealSchema } from '@/schemas/pro-market/offers-schema'
import { DealType } from '@/types/market-pro-type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InfoProduct from './InfoProduct'
import { ArrowLeft, ArrowRight, PenLine, Send, Trash, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { MarketRoutes } from '@/lib/routes'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import DeleteDeal from './DeleteDeal'
import { StepTwo } from '@/app/[locale]/pro-market/components/common-form-steps/StepTwo'
import { StepThree } from '@/app/[locale]/pro-market/components/common-form-steps/StepThree'
import { useTranslations, useOffersTranslations, useCommonTranslations, useNavigationTranslations } from '@/hooks/useTranslations'

interface indexProps {
  deal: DealType
  id: string
  locale: string
}

const getAllDataBackend = (
  data: z.infer<typeof DealSchema>,
  prodReq: produtRequestType
) => {
  const productId = data.barCode != '' && data.id ? data.id : null
  const produtRequest =
    data.barCode != ''
      ? prodReq
      : {
          name: data.title,
          title: data.title,
          description: data.description,
          barcode: null,
          type: 'GLOBAL',
          price: null,
          productImagePath: null,
          expirationDate: data.expirationDate,
          categoryId: null,
          subCategoryId: null,
          brand: null,
          rayonId: null,
        }
  console.log('modalityTypes: ', data.consumptionMethods)
  return {
    deal: {
      produtRequest,
      productId,
      quantity: data.quantity,
      price: data.initialPrice,
      supplements: data.supplements?.map((item: any) => {
        return {
          name: item.name,
          price: {
            amount: item.price,
            currency: 'MAD',
          },
        }
      }),
      supplementsIds: null,
      salePrice: data.initialPrice * (1 - data.reductionPercentage / 100),
      reduction: data.reductionPercentage,
      modalityTypes: data.consumptionMethods.map((item) => {
        return item == 'DELIVERY' ? 'DELIVERY' : 'AT_PLACE'
      }),
      modalityPaiement: data.paymentMethod,
      deliveryFee: data.deliveryCost,
      openTimes: [
        {
          date: data.startDate,
          from: data.startTime.padStart(2, '0').replace('h', ':'),
          to: data.endTime.padStart(2, '0').replace('h', ':'),
        },
        {
          date: data.endDate,
          from: data.startTime.padStart(2, '0').replace('h', ':'),
          to: data.endTime.padStart(2, '0').replace('h', ':'),
        },
      ],
      publishAs: data.type,
      category: data.category,
    },
    productImage: data.productImages[0],
    supplementImages: data.supplements?.map((item) => item.image) || null,
  }
}

export type produtRequestType = {
  name: string
  title: string
  description: string
  barcode: string | null
  type: string | null
  price: string | null
  productImagePath: string | null
  categoryId: string | null
  subCategoryId: string | null
  brand: string | null
  rayonId: string | null
  expirationDate: string | null
}

const prodReqDemo: produtRequestType = {
  name: '',
  title: '',
  description: '',
  barcode: null,
  type: 'GLOBAL',
  price: null,
  productImagePath: null,
  categoryId: null,
  subCategoryId: null,
  brand: null,
  rayonId: null,
  expirationDate: null,
}

const DealOffers: React.FC<indexProps> = ({ deal, id, locale }) => {
  const [state, setState] = useState<'info' | 'modalie' | 'payment'>('info')
  const [edit, setEdit] = useState(!id || id == '')
  const [dealId, setDealId] = useState(id)
  const [prodReq, setProdReq] = useState<produtRequestType | null>(null)
  const router = useRouter()
  const { notify } = useNotification()
  
  // Use translation hooks
  const { t } = useTranslations()
  const tOffers = useOffersTranslations()
  const tCommon = useCommonTranslations()
  const tNav = useNavigationTranslations()

  const { mutate, isPending } = useMutation({
    mutationKey: ['deal'],
    mutationFn: async (data: z.infer<typeof DealSchema>) => {
      const { deal, productImage, supplementImages } = getAllDataBackend(
        data,
        prodReq!
      )
      const blob = new Blob([JSON.stringify(deal)], {
        type: 'application/json',
      })
      const formData = new FormData()
      formData.append('deal', blob)
      formData.append('productImage', productImage)
      supplementImages?.forEach((image) => {
        formData.append('supplementImages', image)
      })
      const url = dealId ? `/deals/${dealId}` : '/deals'
      const method = dealId ? 'put' : 'post'
      const res = await api[method](url, formData)
      console.log('res: ', res.status)
      if (res.status !== 201) {
        throw new Error(tOffers('messages.dealAddError'))
      }
      return res.data
    },
    onSuccess(data) {
      setDealId(data.id)
      setEdit(false)
      notify(
        NotificationType.SUCCESS, 
        tOffers('messages.dealAddedSuccess'), 
        'dialog'
      )
      window.scrollTo(0, 0)
    },
    onError(error) {
      notify(NotificationType.ERROR, error.message)
    },
  })
  const form = useForm<z.infer<typeof DealSchema>>({
    resolver: zodResolver(DealSchema),
    mode: 'onBlur',
    defaultValues: { ...deal },
    disabled: !edit,
  })

  const onSubmit = (data: z.infer<typeof DealSchema>) => {
    mutate(data)
    console.log('data: ', data)
  }
  const handleNext = async () => {
    let next = false
    if (state == 'info') {
      next = await form.trigger([
        'productImages',
        'title',
        'category',
        'description',
        'type',
        'supplements',
        'unity',
        'quantity',
      ])
      if (next) setState('modalie')
    } else if (state == 'modalie') {
      next = await form.trigger([
        'consumptionMethods',
        'deliveryCost',
        'initialPrice',
        'reductionPercentage',
      ])
      if (next) setState('payment')
    } else {
      next = await form.trigger([
        'startDate',
        'endDate',
        'startTime',
        'endTime',
        'expirationDate',
        'paymentMethod',
      ])
      if (next) {
        form.handleSubmit(onSubmit)()
      }
    }
    if (!next) {
      notify(NotificationType.INFO, tOffers('messages.fillAllFields'))
    }
  }
  const handleBack = () => {
    if (state == 'info') {
      router.push(MarketRoutes.market)
    } else if (state == 'modalie') {
      setState('info')
    } else {
      setState('modalie')
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)
  const { type } = form.watch()
  const changeProdReq = (data: any) => {
    console.log('prod: ', data)
    setProdReq({
      ...prodReqDemo,
      name: data.name,
      title: data.name,
      categoryId: data.category.id,
      subCategoryId: data.subCategory.id,
      description: data.description,
      barcode: data.barcode,
    } as produtRequestType)
    form.setValue('barCode', data?.barcode || '')
    form.setValue('id', data.id || '')
    form.setValue('title', data?.name || '')
    form.setValue('description', data?.description || '')
    form.setValue('productImages', [
      process.env.NEXT_PUBLIC_BASE_URL + '/photos/' + data?.imageUrl,
    ])
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state])

  return (
    <Form {...form}>
      <div className='sticky bottom-0 left-0 z-50 hidden w-full gap-3 rounded-t-[18px] bg-white p-2 shadow-sm lg:right-0 lg:top-0 lg:flex lg:justify-end lg:rounded-[18px]'>
        <CustomButton
          variant='outline'
          label={edit ? (state == 'info' ? tCommon('cancel') : tCommon('back')) : tNav('home')}
          size={'sm'}
          type='button'
          className='w-full rounded-[18px] lg:w-fit'
          onClick={handleBack}
          disabled={isPending}
          IconRight={state == 'info' ? X : ArrowLeft}
        />
        <CustomButton
          label={
            edit ? (state == 'payment' ? tOffers('form.publish') : tOffers('form.next')) : tOffers('form.modify')
          }
          className='w-full rounded-[18px] lg:w-fit'
          size={'sm'}
          disabled={isPending}
          onClick={() => {
            if (edit) handleNext()
            else {
              setState('info')
              setEdit(true)
            }
          }}
          IconRight={edit ? (state == 'payment' ? Send : ArrowRight) : PenLine}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex w-full flex-col gap-3 p-2 lg:p-0 lg:py-2'
      >
        {(state == 'info' || !edit) && (
          <InfoProduct
            form={form}
            disabled={!edit}
            changeProdReq={changeProdReq}
            id={dealId}
          />
        )}
        {(state == 'modalie' || !edit) && <StepTwo />}
        {(state == 'payment' || !edit) && <StepThree />}
        {dealId && (
          <div className='flex w-full items-center justify-normal rounded-[30px] bg-white p-3 lg:justify-end lg:rounded-[18px]'>
            <DeleteDeal id={dealId} disable={!edit} />
          </div>
        )}
      </form>
      <div className='sticky bottom-0 left-0 z-50 flex w-full gap-3 rounded-t-[18px] bg-white p-4 shadow-sm lg:right-0 lg:top-0 lg:hidden lg:justify-end lg:rounded-[18px]'>
        <CustomButton
          variant='outline'
          label={edit ? (state == 'info' ? tCommon('cancel') : tCommon('back')) : tNav('home')}
          size={'sm'}
          type='button'
          className='w-full rounded-[18px] lg:w-fit'
          onClick={handleBack}
          disabled={isPending}
          IconRight={state == 'info' ? X : ArrowLeft}
        />
        <CustomButton
          label={
            edit ? (state == 'payment' ? tOffers('form.publish') : tOffers('form.next')) : tOffers('form.modify')
          }
          className='w-full rounded-[18px] lg:w-fit'
          size={'sm'}
          disabled={isPending}
          onClick={() => {
            if (edit) handleNext()
            else {
              setState('info')
              setEdit(true)
            }
          }}
          IconRight={edit ? (state == 'payment' ? Send : ArrowRight) : PenLine}
        />
      </div>
    </Form>
  )
}

export default DealOffers
