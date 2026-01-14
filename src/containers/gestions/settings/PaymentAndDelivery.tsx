import { Label } from '@/components/custom/Label'
import { Select } from '@/components/custom/Select'
import { SelectField } from '@/components/custom/SelectField'
import SelectDate from '@/components/filters/SelectDate'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { Form } from '@/components/ui/form'
import FoodealsIcon from '@/components/utils/FoodealsIcon'
import { useSettingsTranslations } from '@/hooks/useTranslations'
import { SchemaPaymentDelivery } from '@/schemas/settings-schema'
import api from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { set } from 'animejs'
import { CreditCard, Truck, Wallet } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { paymentDelivery } from '.'

interface PaymentAndDeliveryProps {
  onSubmit: (data: z.infer<typeof SchemaPaymentDelivery>) => void
  setSelectData: React.Dispatch<React.SetStateAction<paymentDelivery>>
  selectData: paymentDelivery
}

const getIcon = (method: string) => {
  if (method == 'Especes') return Wallet
  return CreditCard
}

const getIconDelivery = (method: string) => {
  if (method == 'Foodeals') return FoodealsIcon
  return Truck
}

const PaymentAndDelivery: FC<PaymentAndDeliveryProps> = ({
  onSubmit,
  setSelectData,
  selectData,
}) => {
  const t = useSettingsTranslations()
  const [payment, setPayment] = useState<MultiSelectOptionsType[]>([])
  const [delivery, setDelivery] = useState<MultiSelectOptionsType[]>([])
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      const response = await api
        .get('/v1/paiments-methods/all')
        .then((data) => data.data)
        .catch((error) => {
          return []
        })
      setPayment(
        response.map((method: any) => {
          return {
            key: method.id,
            label: method.methodName,
            icon: getIcon(method.methodName),
          }
        })
      )
    }
    const fetchDeliveryMethod = async () => {
      const response = await api
        .get('/v1/delivery-methods/all')
        .then((data) => data.data)
        .catch((error) => {
          return []
        })
      setDelivery(
        response.map((method: any) => {
          return {
            key: method.id,
            label: method.deliveryName,
            icon: getIconDelivery(method.deliveryName),
            avatar:
              method.deliveryName == 'Foodeals'
                ? '/images/symbole-foodeals.svg'
                : '',
          }
        })
      )
    }
    fetchDeliveryMethod()
    fetchPaymentMethod()
  }, [])

  useEffect(() => {
    if (!selectData.payment && payment.length)
      setSelectData((prev) => ({
        ...prev,
        payment: payment[0]?.key + '',
      }))
    if (!selectData.delivery && delivery.length)
      setSelectData((prev) => ({
        ...prev,
        delivery: delivery[0]?.key + '',
      }))
  }, [delivery, payment])
  
  return (
    <div className='flex w-full flex-col items-center justify-evenly gap-4 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-500 lg:flex-row lg:rounded-[14px]'>
      <div className='flex w-full flex-col items-start justify-between'>
        <Label label={t('paymentAndDelivery.paymentMethod')} className='text-sm font-semibold' />
        <Select
          label=''
          placeholder={t('paymentAndDelivery.selectPaymentMethod')}
          options={payment}
          onChange={(value) => {
            setSelectData((prev) => ({ ...prev, payment: value }))
          }}
          className='font-normal text-lynch-500'
          transform={(value) => {
            const item = payment.find(
              (option) =>
                option.key == value?.toString() || option.label == value
            )
            return (
              <div className='flex h-12 items-center justify-center space-x-2 font-normal text-lynch-500'>
                {item?.icon && <item.icon size={24} className='text-primary' />}
                <span className='text-lynch-500'>{item?.label}</span>
              </div>
            )
          }}
          value={selectData.payment}
        />
      </div>
      <div className='flex w-full flex-col items-start justify-center'>
        <Label label={t('paymentAndDelivery.deliveryMethod')} className='text-sm font-semibold' />
        <Select
          onChange={(value) => {
            setSelectData((prev) => ({ ...prev, delivery: value }))
          }}
          value={selectData.delivery}
          label=''
          placeholder={t('paymentAndDelivery.selectDeliveryMethod')}
          options={delivery}
          className='text-lynch-500'
          transform={(value) => {
            const item = delivery.find(
              (option) =>
                option.key == value?.toString() || option.label == value
            )
            return (
              <div className='flex h-12 items-center justify-center space-x-2 font-normal text-lynch-500'>
                {item?.avatar ? (
                  <AvatarAndName avatar={item?.avatar} name={item?.label} />
                ) : (
                  <>
                    {item?.icon && (
                      <item.icon
                        size={20}
                        className='h-10 w-10 rounded-full bg-primary p-2 text-white'
                      />
                    )}
                    <span className='text-lynch-500'>{item?.label}</span>
                  </>
                )}
              </div>
            )
          }}
          transformItem={(value) => {
            const item = delivery.find(
              (option) => option.key == value?.toString()
            )
            return (
              <div className='flex h-12 items-center justify-center space-x-2 text-lynch-500'>
                {item?.icon && <item.icon size={24} />}
                <span className='text-lynch-500'>{item?.label}</span>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}

export default PaymentAndDelivery
