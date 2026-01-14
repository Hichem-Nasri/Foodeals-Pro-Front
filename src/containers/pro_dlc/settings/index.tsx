'use client'
import { SchemaPaymentDelivery } from '@/schemas/settings-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PaymentAndDelivery from './PaymentAndDelivery'
import ProductList from './ProductList'
import { z } from 'zod'
import { CustomButton } from '@/components/custom/CustomButton'
import { CheckCheck } from 'lucide-react'
import api from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { error } from 'console'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { ProductStatusSchema } from '@/schemas/gestion/product-schema'
import { defaultConditionProductDemo } from '@/containers/gestions/Products/newProducts/ConditionProduct'

interface SettingsProductProps {
  id?: string
  product: any
  condition: any
}

export type paymentDelivery = {
  payment: string
  delivery: string
}

export type ConditionProduct = {
  id?: string
  conditionName: string
  daysBeforePickup: number
  discountPercentage: number
}

const SettingsProduct: FC<SettingsProductProps> = ({
  id,
  product,
  condition,
}) => {
  const onSubmitPaymentMethod = (data: any) => {
    console.log('data:', data)
  }
  const [SelectData, setSelectData] = useState<paymentDelivery>({
    payment: '',
    delivery: '',
  })
  const [conditions, setCondition] = React.useState<ConditionProduct[]>(
    condition.length > 0 ? condition : defaultConditionProductDemo
  )

  const onSubmit = (data: z.infer<typeof ProductStatusSchema>) => {
    console.log('data:', data)
  }
  const notif = useNotification()
  const { mutate, isPending } = useMutation({
    mutationKey: ['condition-retrait'],
    mutationFn: async () => {
      const data = conditions.map((item) => ({
        conditionName: item.conditionName,
        daysBeforePickup: item.daysBeforePickup,
        discountPercentage: item.discountPercentage,
      }))
      console.log('data:', data)
      const res = await api
        .put(
          `http://localhost:8080/v1/products/${id}?paymentMethodId=${SelectData.payment}&deliveryMethodId=${SelectData.delivery}`,
          data
        )
        .catch((error) => {
          throw new Error('Error change le condition retrait')
        })
      console.log('res: ', res)
      if (res.status != 200) throw new Error()
    },
    onSuccess: (data: any) => {
      notif.notify(
        NotificationType.SUCCESS,
        'les conditions retrait bien change'
      )
    },
    onError: (error) => {
      notif.notify(NotificationType.ERROR, 'Error change le condition retrait')
    },
  })

  const handleConfirm = () => {
    mutate()
  }

  return (
    <div className='mb-24 flex h-full w-full flex-col gap-4 overflow-auto bg-lynch-50 p-4 lg:bg-transparent'>
      <PaymentAndDelivery
        onSubmit={onSubmitPaymentMethod}
        setSelectData={setSelectData}
        selectData={SelectData}
      />
      <ProductList
        setCondition={setCondition}
        condition={conditions}
        onSubmit={onSubmit}
        product={product}
      />
      <div className='fixed bottom-0 left-0 right-0 z-40 w-full rounded-t-2xl bg-white p-4'>
        <CustomButton
          label='CONFIRMER'
          size='default'
          onClick={() => handleConfirm()}
          IconRight={CheckCheck}
          className='w-full'
          disabled={isPending}
        />
      </div>
    </div>
  )
}

export default SettingsProduct
