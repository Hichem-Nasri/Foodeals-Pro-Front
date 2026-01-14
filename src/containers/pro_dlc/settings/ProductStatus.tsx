import { Input } from '@/components/custom/Input'
import React, { FC, Fragment } from 'react'
import { z } from 'zod'
import SelectStatusProduct from './SelectStatusProduct'
import { ConditionProduct } from '.'
import { ProductStatusSchema } from '@/schemas/gestion/product-schema'

interface ProductStatusProps {
  condition: ConditionProduct[]
  onSubmit: (data: z.infer<typeof ProductStatusSchema>) => void
  setCondition: React.Dispatch<React.SetStateAction<ConditionProduct[]>>
}

const ProductStatus: FC<ProductStatusProps> = ({
  onSubmit,
  condition,
  setCondition,
}) => {
  const list = [
    {
      label: 'Valorisation urgente',
      value: 'bientôt',
      className: 'disabled:text-coral-500 disabled:bg-coral-50',
    },
    {
      label: 'Valorisation exigée',
      value: 'exigée',
      className: 'disabled:text-tulip-500 disabled:bg-tulip-100',
    },
    {
      label: 'Valorisation souhaitable',
      value: 'souhaitable',
      className: 'disabled:text-mountain-500 disabled:bg-mountain-100',
    },
  ]

  const handleChange = (key: string, value: number, type: string) => {
    console.log('key:', key)
    console.log('value:', value)
    console.log('type:', type)
    if (type === 'daysBeforePickup') {
      setCondition((prev) => {
        return prev.map((item) => {
          if (item.conditionName.includes(key)) {
            console.log('item:', item)
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
  console.log('condition:', condition)
  return (
    <div className='flex w-full flex-col items-center justify-evenly gap-6 rounded-[30px] bg-white pt-[25px] text-lynch-500'>
      {list.map((item, index) => {
        return (
          <Fragment key={index + ''}>
            <Input
              label='Status'
              value={item.label}
              className={item.className}
              onChange={() => {}}
              name={''}
              disabled
            />
            <SelectStatusProduct
              handleChange={handleChange}
              condition={condition}
              name={item.value}
              disabled={false}
            />
            {index + 1 < list.length && (
              <hr className='h-[1px] w-full border-lynch-200' />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default ProductStatus
