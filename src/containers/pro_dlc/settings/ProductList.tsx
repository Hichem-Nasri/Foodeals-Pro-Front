'use client'
import { Form } from '@/components/ui/form'
import React, { FC } from 'react'
import SearchProduct from './SearchProduct'
import { Select } from '@/components/custom/Select'
import { Label } from '@/components/custom/Label'
import { Input } from '@/components/custom/Input'
import { z } from 'zod'
import ProductStatus from './ProductStatus'
import { LabelAndAvatar } from '@/components/custom/LabelAndAvatar'
import { ConditionProduct } from '.'

interface ProductListProps {
    setCondition: React.Dispatch<React.SetStateAction<ConditionProduct[]>>
    condition: ConditionProduct[]
    onSubmit: any
    product: any
}

const ProductList: FC<ProductListProps> = ({
    onSubmit,
    product,
    condition,
    setCondition,
}) => {
    const [products, setProduct] = React.useState('1')
    return (
        <div className='flex w-full flex-col items-center justify-evenly gap-6 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-500'>
            <SearchProduct setProduct={setProduct} product={products} />
            <LabelAndAvatar
                avatar={product?.imageUrl}
                value={product?.name}
                label='Produit'
                className='w-full'
                onChange={() => {}}
                name={''}
            />

            <hr className='h-[1px] w-full border-lynch-200' />
            <Input
                label='Code à barre'
                placeholder='Code à barre'
                value={product?.barcode}
                onChange={() => {}}
                name={''}
                disabled
            />
            <ProductStatus
                setCondition={setCondition}
                condition={condition}
                onSubmit={onSubmit}
            />
        </div>
    )
}

export default ProductList
