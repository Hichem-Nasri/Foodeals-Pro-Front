'use client'
import { Form } from '@/components/ui/form'
import React, { FC } from 'react'
import SearchProduct from './SearchProduct'
import { Select } from '@/components/custom/Select'
import { Label } from '@/components/custom/Label'
import { Input } from '@/components/custom/Input'
import { ProductStatusSchema } from '@/schemas/gestion/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ProductStatus from './ProductStatus'
import { LabelAndAvatar } from '@/components/custom/LabelAndAvatar'
import { ConditionProduct } from '.'
import { useSettingsTranslations } from '@/hooks/useTranslations'

interface ProductListProps {
  setCondition: React.Dispatch<React.SetStateAction<ConditionProduct[]>>
  condition: ConditionProduct[]
  onSubmit: any
  product: any
  handleChangeProduct: (product: any) => void
}

const ProductList: FC<ProductListProps> = ({
  onSubmit,
  product,
  condition,
  setCondition,
  handleChangeProduct,
}) => {
  const t = useSettingsTranslations()
  
  return (
    <div className='flex w-full flex-col items-center justify-evenly gap-6 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-500 lg:rounded-[14px]'>
      <SearchProduct handleChangeProduct={handleChangeProduct} />
      <LabelAndAvatar
        avatar={product?.imageUrl || ''}
        value={product?.name || ''}
        label={t('product.product')}
        placeholder={t('product.product')}
        className='w-full'
        onChange={() => {}}
        name={''}
      />
      <hr className='h-[1px] w-full border-lynch-200' />
      <Input
        label={t('product.barcode')}
        placeholder={t('product.barcode')}
        value={product?.barcode}
        onChange={() => {}}
        name={''}
        disabled
      />
      <ProductStatus
        setCondition={setCondition}
        condition={condition}
        onSubmit={onSubmit}
        disabled={product?.id ? false : true}
      />
    </div>
  )
}

export default ProductList
