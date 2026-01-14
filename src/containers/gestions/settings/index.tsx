'use client'
import { SchemaPaymentDelivery } from '@/schemas/settings-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PaymentAndDelivery from './PaymentAndDelivery'
import ProductList from './ProductList'
import { ProductStatusSchema } from '@/schemas/gestion/product-schema'
import { z } from 'zod'
import { CustomButton } from '@/components/custom/CustomButton'
import { CheckCheck } from 'lucide-react'
import api from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { error } from 'console'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { defaultConditionProductDemo } from '../Products/newProducts/ConditionProduct'
import { useSettingsTranslations } from '@/hooks/useTranslations'

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
  const t = useSettingsTranslations()
  const [Product, setProduct] = useState<any>(product)
  const [ProductId, setProductId] = useState<string | undefined>(id)
  const onSubmitPaymentMethod = (data: any) => {}
  const [SelectData, setSelectData] = useState<paymentDelivery>({
    payment: product?.paymentMethodResponse?.id || '',
    delivery: product?.deliveryMethodResponse?.id || '',
  })
  const [conditions, setCondition] = React.useState<ConditionProduct[]>(
    condition && condition.length > 0 ? condition : defaultConditionProductDemo
  )

  const onSubmit = (data: z.infer<typeof ProductStatusSchema>) => {}
  const notif = useNotification()
  const { mutate, isPending } = useMutation({
    mutationKey: ['condition-retrait'],
    mutationFn: useCondtionProduct,
    onSuccess: (data: any) => {
      notif.notify(
        NotificationType.SUCCESS,
        t('notifications.conditionsUpdated')
      )
    },
    onError: (error) => {
      notif.notify(NotificationType.ERROR, t('notifications.updateError'))
    },
  })

  const handleConfirm = () => {
    if (!ProductId) {
      notif.notify(NotificationType.INFO, t('notifications.selectProduct'))
      return
    }
    mutate({
      conditions,
      ProductId: ProductId || '',
      payment: SelectData.payment,
      delivery: SelectData.delivery,
    })
  }

  const handleChangeProduct = (product: any) => {
    if (!product) return
    setProduct(product)
    setCondition(
      (product?.pickupConditions && product?.pickupConditions?.length) ||
        defaultConditionProductDemo
    )
    setProductId(product.id)
  }

  return (
    <div className='mb-60 flex h-full w-full flex-col gap-4 bg-lynch-50 p-2 lg:bg-transparent'>
      <div className='fixed bottom-0 left-0 right-0 z-40 flex w-full items-center justify-end rounded-t-2xl bg-white p-4 lg:relative lg:rounded-[14px] lg:py-2'>
        <CustomButton
          label={t('actions.confirm')}
          onClick={() => handleConfirm()}
          IconRight={CheckCheck}
          className='h-14 w-full rounded-[14px] lg:h-12 lg:w-fit'
          disabled={isPending}
        />
      </div>
      <PaymentAndDelivery
        onSubmit={onSubmitPaymentMethod}
        setSelectData={setSelectData}
        selectData={SelectData}
      />
      <ProductList
        setCondition={setCondition}
        condition={conditions}
        onSubmit={onSubmit}
        product={Product}
        handleChangeProduct={handleChangeProduct}
      />
    </div>
  )
}

export const useCondtionProduct = async ({
  conditions,
  ProductId,
  payment,
  delivery,
}: {
  conditions: any
  ProductId: string
  payment: string
  delivery: string
}) => {
  const data = conditions.map((item: any) => ({
    conditionName: item.conditionName,
    daysBeforePickup: item.daysBeforePickup,
    discountPercentage: item.discountPercentage,
  }))

  const res = await api
    .put(
      `/products/${ProductId}?paymentMethodId=${payment}&deliveryMethodId=${delivery}`,
      data
    )
    .catch((error) => {
      throw new Error('Error change le condition retrait')
    })

  if (res.status != 200) throw new Error()
}

export default SettingsProduct
