'use client'
import { DealProSchema } from '@/schemas/pro-market/offers-schema'
import { DealProType } from '@/types/market-pro-type'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form' // Import zodResolver from react-hook-form
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { MarketRoutes } from '@/lib/routes'
import StepOne from './StepOne'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { StepTwoDealPro } from './StepTwoDealPro'
import { cn } from '@/lib/utils'
import TopBar from './TopBar'

interface CreatDealProProps {
  id: string
  dealPro: DealProType
}

{
  /*
  {
  "quantity": 10,
  "productRequest": {
    "name": "Soda Hallal",
    "title": "Soda Hallal",
    "description": "Soda Hallal pour vous.",
    "barcode": null,
    "type": "GLOBAL",
    "price": null,
    "productImagePath": null,
    "categoryId": null,
    "subCategoryId": null,
    "brandId": null,
    "rayonId": null
  },
  "publishAs": "SUPERMARKETS_HYPERMARKETS",
  "category": "BREAD_AND_PASTRIES",
  "dealStatus": "AVAILABLE",
  "dealProType": "PRODUCT",
  "defaultPrices": [
    {
      "quantity": 5,
      "price": {
        "amount": 100.0,
        "currency": "MAD"
      }
    },
    {
      "quantity": 10,
      "price": {
        "amount": 180.0,
        "currency": "MAD"
      }
    }
  ],
  "customPrices": [
    {
      "quantity": 2,
      "price": {
        "amount": 90.0,
        "currency": "MAD"
      }
    },
    {
      "quantity": 20,
      "price": {
        "amount": 160.0,
        "currency": "MAD"
      }
    }
  ],
  "modalityTypes": ["AT_PLACE", "DELIVERY"],
  "modalityPaiement": "CARD",
  "deliveryFee": 50.0
}
 
  */
}

const extractDealPro = (data: DealProType) => {
  return {
    quantity: data.prixLot,
    productRequest: {
      name: data.title,
      title: data.title,
      description: data.description,
      barcode: null,
      type: 'GLOBAL',
      price: null,
      productImagePath: null,
      categoryId: null,
      subCategoryId: null,
      brandId: null,
      rayonId: null,
    },
    publishAs: 'SUPERMARKETS_HYPERMARKETS',
    category: data.category,
    dealStatus: 'AVAILABLE',
    dealProType: data.typeProduct == 'product' ? 'PRODUCT' : 'LOT',
    defaultPrices: [
      {
        quantity: 30,
        price: {
          amount: data.defaultUnity?.x30,
          currency: 'MAD',
        },
      },
      {
        quantity: 60,
        price: {
          amount: data.defaultUnity?.x60,
          currency: 'MAD',
        },
      },
      {
        quantity: 120,
        price: {
          amount: data.defaultUnity?.x120,
          currency: 'MAD',
        },
      },
    ],
    customPrices: [
      {
        quantity: +data?.customUnity?.global?.quantity! || 0,
        price: {
          amount: data.customUnity?.global.price || 0,
          currency: 'MAD',
        },
      },
      {
        quantity: +data.customUnity?.min.quantity! || 0,
        price: {
          amount: data.customUnity?.min.price || 0,
          currency: 'MAD',
        },
      },
    ],
    modalityTypes: ['AT_PLACE', 'DELIVERY'],
    modalityPaiement: data.paymentMethod,
    deliveryFee: data.deliveryCost,
  }
}

const CreatDealPro: React.FC<CreatDealProProps> = ({ id, dealPro }) => {
  const [state, setState] = useState<'info' | 'modalie'>('info')
  const [dealId, setDealId] = useState(id)
  const [edit, setEdit] = useState(!id || id == '')
  const router = useRouter()
  const { notify } = useNotification()
  const form = useForm<z.infer<typeof DealProSchema>>({
    resolver: zodResolver(DealProSchema),
    mode: 'onBlur',
    defaultValues: { ...dealPro },
    disabled: !edit,
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['deal-pro'],
    mutationFn: async (data: DealProType) => {
      const { productImages } = data
      const formData = new FormData()
      const blob = new Blob([JSON.stringify(extractDealPro(data))], {
        type: 'application/json',
      })
      formData.append('deal', blob)
      const images = new Blob(productImages, {
        type: 'image/jpeg',
      })
      if (data.typeProduct == 'lots') {
        formData.append('photoDealProPath', images)
      } else
        formData.append(
          'photoDealProPath',
          (productImages?.length > 0 && productImages[0]) || ''
        )
      const res = await api.post(`/deals/create-dealpro`, formData)
      if (![200, 201, 204].includes(res.status)) {
        throw new Error("Erreur lors de la création de l'offre")
      }
      return res.data
    },
    onSuccess: (data) => {
      notify(NotificationType.SUCCESS, 'Offre créée avec succès', 'dialog')
      setDealId(data.id)
      setEdit(false)
      router.push(MarketRoutes.dealPro)
      // router.push(MarketRoutes.market)
    },
    onError: (error) => {
      notify(
        NotificationType.ERROR,
        "Erreur lors de la création de l'offre",
        'dialog'
      )
      console.error(error)
    },
  })

  const onSubmit = (data: z.infer<typeof DealProSchema>) => {
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
      ])
      if (next) setState('modalie')
    } else if (state == 'modalie') {
      next = await form.trigger([
        'consumptionMethods',
        'deliveryCost',
        'paymentMethod',
      ])
      if (next) form.handleSubmit(onSubmit)()
    }
    if (!next) {
      notify(NotificationType.INFO, 'Veuillez remplir tous les champs')
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
  console.log('dealPro: ?', dealId, '?')
  console.log('productImages: ', form.formState.errors)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5 p-3 lg:p-0'
      >
        <div
          className={cn(
            'sticky bottom-0 left-0 z-50 hidden w-full gap-3 rounded-[18px] bg-white p-3 lg:right-0 lg:top-0 lg:flex lg:justify-end'
          )}
        >
          <TopBar
            handleBack={handleBack}
            handleNext={handleNext}
            dealId={dealId}
            state={state}
            disabled={isPending}
            isLoading={isPending}
          />
        </div>
        <>
          {(!edit || state === 'info') && <StepOne form={form} />}
          {(!edit || state == 'modalie') && <StepTwoDealPro />}
        </>
        <div
          className={cn(
            'sticky bottom-0 left-0 z-50 flex w-full gap-3 rounded-t-[18px] bg-white p-4 lg:right-0 lg:top-0 lg:hidden lg:justify-end',
            dealId != '' && 'flex-col'
          )}
        >
          <TopBar
            handleBack={handleBack}
            handleNext={handleNext}
            dealId={dealId}
            state={state}
            disabled={isPending}
            isLoading={isPending}
          />
        </div>
      </form>
    </Form>
  )
}

export default CreatDealPro
