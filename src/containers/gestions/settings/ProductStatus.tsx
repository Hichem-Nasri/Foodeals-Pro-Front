import { Input } from '@/components/custom/Input'
import { Form } from '@/components/ui/form'
import { useSettingsTranslations } from '@/hooks/useTranslations'
import { ProductStatusSchema } from '@/schemas/gestion/product-schema'
import React, { FC, Fragment, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import SelectStatusProduct from './SelectStatusProduct'
import { Value } from '@radix-ui/react-select'
import api from '@/utils/api'
import { ConditionProduct } from '.'

interface ProductStatusProps {
  condition: ConditionProduct[]
  onSubmit: (data: z.infer<typeof ProductStatusSchema>) => void
  setCondition: React.Dispatch<React.SetStateAction<ConditionProduct[]>>
  disabled?: boolean
}

const ProductStatus: FC<ProductStatusProps> = ({
  onSubmit,
  condition,
  setCondition,
  disabled = false,
}) => {
  const t = useSettingsTranslations()
  
  const list = [
    {
      label: t('product.statusTypes.urgent'),
      value: 'bientôt',
      className: 'disabled:text-coral-500 disabled:bg-coral-50',
    },
    {
      label: t('product.statusTypes.required'),
      value: 'exigée',
      className: 'disabled:text-tulip-500 disabled:bg-tulip-100',
    },
    {
      label: t('product.statusTypes.desirable'),
      value: 'souhaitable',
      className: 'disabled:text-mountain-500 disabled:bg-mountain-100',
    },
  ]

  const handleChange = (key: string, value: number, type: string) => {
    if (type === 'daysBeforePickup') {
      setCondition((prev) => {
        return prev.map((item) => {
          if (item.conditionName.includes(key)) {
            return {
              ...item,
              daysBeforePickup: value,
            }
          }
          return item
        })
      })
    }
    if (type === 'discountPercentage') {
      setCondition((prev) => {
        return prev.map((item) => {
          if (item.conditionName.includes(key)) {
            return {
              ...item,
              discountPercentage: value,
            }
          }
          return item
        })
      })
    }
  }

  return (
    <div className='flex w-full flex-col items-center justify-evenly gap-6 rounded-[30px] bg-white pt-[25px] text-lynch-500'>
      {list.map((item, index) => {
        return (
          <div
            key={index + ''}
            className='flex w-full flex-col items-end justify-normal gap-4 lg:flex-row'
          >
            <Input
              label={t('product.status')}
              value={item.label}
              className={item.className}
              onChange={() => {}}
              name={''}
              disabled
              classNameParent='item-start'
            />
            <SelectStatusProduct
              handleChange={handleChange}
              condition={condition}
              name={item.value}
              disabled={disabled}
            />
            {index + 1 < list.length && (
              <hr className='flex h-[1px] w-full border-lynch-200 lg:hidden' />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProductStatus
